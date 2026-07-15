// Lead delivery — the router that sends a scored lead out to lender partners.
//
// Called at the end of the lead pipeline (index.ts), inside the failsafe block:
// it must NEVER throw and must NEVER make the request fail. Every attempt is
// logged to the lead_deliveries table (sent / accepted / rejected / error /
// skipped) so we can reconcile payouts and see exactly what happened.
//
// DORMANT BY DEFAULT. Nothing leaves this server unless:
//   LEAD_DELIVERY_ENABLED === "true"   (global master switch)
//   AND a partner's <PARTNER>_ENABLED === "true"
//   AND that partner's secret (API key / intake email) is set
//   AND the lead is eligible (see partners.ts::isEligible)

import type { LeadInput } from "./types.ts";
import {
  PARTNERS, productOf, idTypeOf, isEligible,
  type PartnerConfig, type CanonicalProduct,
} from "./partners.ts";

type DbFn = (path: string, init: RequestInit) => Promise<Response>;

interface DeliveryOutcome {
  status: "sent" | "accepted" | "rejected" | "error" | "skipped";
  accepted?: boolean;
  price?: number | null;
  reason?: string;
  httpStatus?: number;
  requestPayload?: unknown;
  responseBody?: unknown;
}

const env = (k?: string) => (k ? Deno.env.get(k) : undefined);
const isOn = (k: string) => (Deno.env.get(k) || "").toLowerCase() === "true";

/** fetch with a hard timeout so a slow/hung partner can never stall the request. */
async function postJson(url: string, body: unknown, headers: Record<string, string>, ms = 4000): Promise<{ httpStatus: number; body: unknown }> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json", ...headers },
      body: JSON.stringify(body),
      signal: ctl.signal,
    });
    const text = await r.text();
    let parsed: unknown = text;
    try { parsed = JSON.parse(text); } catch { /* keep raw text */ }
    return { httpStatus: r.status, body: parsed };
  } finally {
    clearTimeout(t);
  }
}

/** Build an outbound payload from the partner's field map, plus consent tokens
 *  under the names most buyers expect. Only non-empty values are included. */
function buildApiPayload(p: PartnerConfig, lead: LeadInput): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const map = p.fieldMap || {};
  for (const [canonical, partnerField] of Object.entries(map)) {
    const v = lead[canonical as keyof LeadInput];
    if (v !== undefined && v !== null && String(v).trim() !== "") out[partnerField as string] = v;
  }
  if ((lead.trustedFormCertUrl || "").trim()) out["trusted_form_cert_url"] = lead.trustedFormCertUrl;
  if ((lead.jornayaLeadId || "").trim()) out["jornaya_leadid"] = lead.jornayaLeadId;
  return out;
}

/** Read a numeric bid/price out of a partner response, tolerating common shapes. */
function readPrice(body: unknown): number | null {
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    for (const k of ["price", "bid", "payout", "amount", "revenue"]) {
      const v = o[k];
      if (typeof v === "number") return v;
      if (typeof v === "string" && v.trim() && !isNaN(Number(v))) return Number(v);
    }
  }
  return null;
}

function readAccepted(httpStatus: number, body: unknown): boolean {
  if (httpStatus < 200 || httpStatus >= 300) return false;
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    if (typeof o.accepted === "boolean") return o.accepted;
    if (typeof o.success === "boolean") return o.success;
    const status = String(o.status ?? o.result ?? "").toLowerCase();
    if (status) return ["accepted", "matched", "sold", "success", "ok"].some((s) => status.includes(s));
  }
  return true; // 2xx with no explicit verdict => treat as received
}

// ---- adapters -------------------------------------------------------------

async function deliverApi(p: PartnerConfig, lead: LeadInput): Promise<DeliveryOutcome> {
  const url = env(p.endpointEnv) || p.defaultEndpoint;
  const key = env(p.authEnv);
  if (!url) return { status: "skipped", reason: "no endpoint configured" };
  if (p.authEnv && !key) return { status: "skipped", reason: "no API key configured" };
  const payload = buildApiPayload(p, lead);
  const headers: Record<string, string> = key ? { authorization: `Bearer ${key}` } : {};
  try {
    const { httpStatus, body } = await postJson(url, payload, headers);
    const accepted = readAccepted(httpStatus, body);
    return {
      status: accepted ? "accepted" : "rejected",
      accepted, price: readPrice(body), httpStatus,
      requestPayload: payload, responseBody: body,
    };
  } catch (e) {
    return { status: "error", reason: String(e), requestPayload: payload };
  }
}

/** Ping-post: POST a ping, and if it returns a bid, POST the full lead to claim it.
 *  If no separate post URL is configured, the ping response is treated as final. */
async function deliverPingPost(p: PartnerConfig, lead: LeadInput): Promise<DeliveryOutcome> {
  const pingUrl = env(p.endpointEnv);
  const key = env(p.authEnv);
  if (!pingUrl) return { status: "skipped", reason: "no ping URL configured" };
  if (p.authEnv && !key) return { status: "skipped", reason: "no API key configured" };
  const headers: Record<string, string> = key ? { authorization: `Bearer ${key}` } : {};
  const payload = buildApiPayload(p, lead);
  try {
    const ping = await postJson(pingUrl, payload, headers);
    const bid = readPrice(ping.body);
    const postUrl = env(`${p.id.toUpperCase()}_POST_URL`) || env("RGR_POST_URL");
    if (!bid || bid <= 0) {
      return { status: "rejected", accepted: false, price: bid, httpStatus: ping.httpStatus, requestPayload: payload, responseBody: ping.body };
    }
    if (!postUrl) {
      // Got a bid but no post endpoint to claim it — record the winning bid.
      return { status: "sent", accepted: true, price: bid, httpStatus: ping.httpStatus, requestPayload: payload, responseBody: ping.body };
    }
    const post = await postJson(postUrl, payload, headers);
    const accepted = readAccepted(post.httpStatus, post.body);
    return { status: accepted ? "accepted" : "rejected", accepted, price: readPrice(post.body) ?? bid, httpStatus: post.httpStatus, requestPayload: payload, responseBody: post.body };
  } catch (e) {
    return { status: "error", reason: String(e), requestPayload: payload };
  }
}

async function deliverEmail(p: PartnerConfig, lead: LeadInput, product: CanonicalProduct): Promise<DeliveryOutcome> {
  const to = env(p.emailToEnv);
  const key = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("LEAD_EMAIL_FROM");
  if (!to) return { status: "skipped", reason: "no intake email configured" };
  if (!key || !from) return { status: "skipped", reason: "email sender not configured" };
  const rows: [string, string][] = ([
    ["Name", [lead.firstName, lead.lastName].filter(Boolean).join(" ") || lead.name || ""],
    ["State", lead.state || ""], ["ZIP", lead.zip || ""], ["Looking for", lead.loanType || product],
    ["Amount", lead.amount || ""], ["Income", lead.income || ""], ["Credit", lead.score || ""],
    ["ID", lead.itin_status || ""], ["Phone", lead.phone || ""], ["Email", lead.email || ""],
  ] as [string, string][]).filter(([, v]) => v);
  const subject = `ITIN ${product} referral — ${lead.firstName || lead.name || "lead"}, ${lead.state || ""}`;
  const text = ["New consented referral from ITIN Lending:", "", ...rows.map(([k, v]) => `- ${k}: ${v}`),
    "", "They asked to be connected and are expecting a call."].join("\n");
  const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:560px">
    <p>New consented referral from ITIN Lending:</p>
    <table style="border-collapse:collapse;font-size:14px">${rows.map(([k, v]) =>
      `<tr><td style="padding:2px 12px 2px 0;color:#56627A">${k}</td><td style="padding:2px 0"><b>${String(v).replace(/[<>&]/g, "")}</b></td></tr>`).join("")}</table>
    <p>They asked to be connected and are expecting a call.</p></div>`;
  try {
    const { httpStatus, body } = await postJson("https://api.resend.com/emails",
      { from, to: to.split(",").map((s) => s.trim()), subject, html, text },
      { authorization: `Bearer ${key}` });
    const ok = httpStatus >= 200 && httpStatus < 300;
    return { status: ok ? "sent" : "error", accepted: ok, httpStatus, requestPayload: { to, subject }, responseBody: body };
  } catch (e) {
    return { status: "error", reason: String(e), requestPayload: { to, subject } };
  }
}

async function logDelivery(db: DbFn, leadId: string, p: PartnerConfig, o: DeliveryOutcome): Promise<void> {
  try {
    await db("lead_deliveries", {
      method: "POST",
      body: JSON.stringify({
        lead_id: leadId, partner_id: p.id, channel: p.channel, status: o.status,
        accepted: o.accepted ?? null, price: o.price ?? null, reason: o.reason ?? null,
        http_status: o.httpStatus ?? null, request_payload: o.requestPayload ?? null,
        response_body: o.responseBody ?? null,
      }),
    });
  } catch (e) {
    console.error("lead_deliveries log failed", p.id, e);
  }
}

/** Route a scored lead to every eligible, enabled partner. Best-effort and
 *  non-blocking on failure. Returns a short per-partner summary for logging. */
export async function deliverLead(lead: LeadInput, leadId: string, db: DbFn): Promise<Array<{ partner: string; status: string }>> {
  const summary: Array<{ partner: string; status: string }> = [];
  if (!isOn("LEAD_DELIVERY_ENABLED")) return summary; // master switch off => dormant

  const product = productOf(lead.loanType);
  const idType = idTypeOf(lead.itin_status);

  for (const p of PARTNERS) {
    if (!isOn(p.enableEnv)) continue; // partner off => not even considered
    try {
      const elig = isEligible(p, lead, product, idType);
      if (!elig.ok) {
        await logDelivery(db, leadId, p, { status: "skipped", reason: elig.reason });
        summary.push({ partner: p.id, status: `skipped: ${elig.reason}` });
        continue;
      }
      let outcome: DeliveryOutcome;
      if (p.channel === "api") outcome = await deliverApi(p, lead);
      else if (p.channel === "ping_post") outcome = await deliverPingPost(p, lead);
      else outcome = await deliverEmail(p, lead, product);

      await logDelivery(db, leadId, p, outcome);
      summary.push({ partner: p.id, status: outcome.status });
    } catch (e) {
      await logDelivery(db, leadId, p, { status: "error", reason: String(e) });
      summary.push({ partner: p.id, status: "error" });
    }
  }
  return summary;
}
