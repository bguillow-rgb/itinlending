// Lead Intelligence — POST /functions/v1/lead   (M1 orchestrator)
//
// Replaces the form's Web3Forms target. The applicant experience is identical:
// the form POSTs here, this returns { success: true }, the page redirects to
// /thank-you. Everything else runs server-side:
//
//   validate required fields -> write lead to DB -> run validation engine
//   -> (LLM exec summary) -> store validation report -> send internal email
//
// FAILSAFE: the lead is ALWAYS saved and an email is ALWAYS attempted. AI/LLM/
// email failures degrade gracefully; lead processing never fails because AI fails.

import { validateLead } from "../_shared/engine.ts";
import { llmExecutiveSummary } from "../_shared/llm.ts";
import { buildInternalEmail, sendInternalEmail } from "../_shared/email.ts";
import type { LeadInput, DuplicateContext, ServerSignals } from "../_shared/types.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") ||
  "https://itinlending.net,https://www.itinlending.net,https://itincreditcard.com,https://www.itincreditcard.com,https://itincreditscore.com,https://www.itincreditscore.com,http://localhost:4321")
  .split(",").map((s) => s.trim());

const SITE_BY_HOST: Record<string, string> = {
  "itinlending.net":"itinlending.net", "www.itinlending.net":"itinlending.net",
  "itincreditcard.com":"itincreditcard.com", "www.itincreditcard.com":"itincreditcard.com",
  "itincreditscore.com":"itincreditscore.com", "www.itincreditscore.com":"itincreditscore.com",
};

function cors(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, accept",
    "Vary": "Origin",
  };
}
const json = (body: unknown, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...cors(origin) } });

async function parseBody(req: Request): Promise<Record<string, string>> {
  const ct = req.headers.get("content-type") || "";
  const out: Record<string, string> = {};
  if (ct.includes("application/json")) {
    Object.assign(out, await req.json().catch(() => ({})));
  } else {
    const form = await req.formData().catch(() => null);
    if (form) for (const [k, v] of form.entries()) out[k] = typeof v === "string" ? v : "";
  }
  return out;
}

function hostOf(u?: string | null): string { try { return u ? new URL(u).host : ""; } catch { return ""; } }

// ---- M5 screening signals (all best-effort; failures leave signals undefined) ----

/** MX lookup with timeout. true = has MX, false = domain resolves no MX, null = unknown. */
async function checkMx(email?: string): Promise<boolean | null> {
  const dom = (email || "").split("@").pop()?.trim().toLowerCase();
  if (!dom || !dom.includes(".")) return null;
  try {
    const recs = await Promise.race([
      Deno.resolveDns(dom, "MX"),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 1800)),
    ]);
    return Array.isArray(recs) && recs.length > 0;
  } catch (e) {
    // NXDOMAIN / no records => false; timeout or resolver error => null (never penalize)
    const msg = String(e);
    if (msg.includes("timeout")) return null;
    return false;
  }
}

/** Velocity: prior 24h submissions sharing ip / email / phone (excluding this lead). */
async function checkVelocity(leadId: string, ip?: string, email?: string, phone?: string): Promise<Partial<ServerSignals>> {
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const ors: string[] = [];
  if (ip) ors.push(`ip.eq.${ip}`);
  if (email) ors.push(`email.eq.${encodeURIComponent(email.toLowerCase())}`);
  if (phone) ors.push(`phone.eq.${encodeURIComponent(phone)}`);
  if (!ors.length) return {};
  const q = new URLSearchParams({ select: "id,ip,email,phone", limit: "100" });
  q.set("created_at", `gte.${since}`);
  q.set("or", `(${ors.join(",")})`);
  const r = await db(`leads?${q}`, { method: "GET" });
  if (!r.ok) return {};
  const rows: Array<{ id: string; ip: string | null; email: string | null; phone: string | null }> = await r.json();
  const others = rows.filter((x) => x.id !== leadId);
  return {
    ipRepeats24h: ip ? others.filter((x) => x.ip === ip).length : 0,
    emailRepeats24h: email ? others.filter((x) => (x.email || "").toLowerCase() === email.toLowerCase()).length : 0,
    phoneRepeats24h: phone ? others.filter((x) => x.phone === phone).length : 0,
  };
}

/** OFAC SDN name screen: both first+last tokens present in a normalized SDN name.
 *  Name-only similarity — downstream treatment is a manual-review FLAG only. */
async function checkSdn(name?: string): Promise<string[]> {
  const norm = (name || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const toks = norm.split(" ").filter((t) => t.length >= 3);
  if (toks.length < 2) return [];
  const first = toks[0], last = toks[toks.length - 1];
  const q = new URLSearchParams({ select: "name", limit: "3" });
  q.append("name_norm", `ilike.*${first}*`);
  q.append("name_norm", `ilike.*${last}*`);
  const r = await db(`sdn_names?${q}`, { method: "GET" });
  if (!r.ok) return [];
  const rows: Array<{ name: string }> = await r.json();
  return rows.map((x) => x.name);
}

async function db(path: string, init: RequestInit): Promise<Response> {
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: SERVICE_KEY, authorization: `Bearer ${SERVICE_KEY}`, "content-type": "application/json", ...(init.headers || {}) },
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return json({ success: false, message: "method not allowed" }, 405, origin);

  const raw = await parseBody(req);

  // Honeypot: bots tick "botcheck". Silently accept so the bot sees success, but drop.
  if (raw.botcheck) return json({ success: true }, 200, origin);

  // Derive source site + server metadata (never trust client for these).
  const source =
    SITE_BY_HOST[hostOf(origin) || hostOf(req.headers.get("referer") || "") || hostOf(raw.landing_page)] || raw.from_name || "";
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || undefined;

  const lead: LeadInput = {
    name: raw.name, email: raw.email, phone: raw.phone, state: raw.state, loanType: raw.loanType,
    amount: raw.amount, score: raw.score, income: raw.income, itin_status: raw.itin_status,
    time_in_business: raw.time_in_business, down_payment: raw.down_payment, notes: raw.notes,
    source, ip, userAgent: req.headers.get("user-agent") || undefined,
    referrer: raw.source_referrer, landingPage: raw.landing_page,
    utmSource: raw.utm_source, utmMedium: raw.utm_medium, utmCampaign: raw.utm_campaign,
    submittedAt: new Date().toISOString(),
    extra: raw,
  };

  // Minimal required-field guard (client already enforces these).
  const missing = ["name", "phone", "email"].filter((k) => !(lead as Record<string, string>)[k]);
  if (missing.length) return json({ success: false, message: `missing ${missing.join(", ")}` }, 400, origin);

  // 1) Write the lead (must succeed — this is the one non-negotiable step).
  let leadId: string | null = null;
  try {
    const resp = await db("leads", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        submitted_at: lead.submittedAt, source_site: source, name: lead.name, email: lead.email,
        phone: lead.phone, state: lead.state, loan_type: lead.loanType, amount: lead.amount,
        credit_band: lead.score, income: lead.income, itin_status: lead.itin_status,
        time_in_business: lead.time_in_business, down_payment: lead.down_payment, notes: lead.notes,
        ip, user_agent: lead.userAgent, referrer: lead.referrer, landing_page: lead.landingPage,
        utm_source: lead.utmSource, utm_medium: lead.utmMedium, utm_campaign: lead.utmCampaign,
        raw_payload: raw,
      }),
    });
    const rows = await resp.json();
    leadId = Array.isArray(rows) ? rows[0]?.id ?? null : null;
    if (!resp.ok || !leadId) throw new Error(`insert failed ${resp.status}`);
  } catch (e) {
    console.error("lead insert failed", e);
    return json({ success: false, message: "could not save lead" }, 500, origin);
  }

  // From here on, NOTHING may cause the request to fail — failsafe to a plain email.
  const errors: string[] = [];
  try {
    // 2) Duplicate context (phone/email already on file).
    let dup: DuplicateContext = { duplicatePhone: false, duplicateEmail: false };
    try {
      const q = new URLSearchParams({ select: "id,phone,email", limit: "50" });
      q.set("or", `(phone.eq.${encodeURIComponent(lead.phone || "")},email.eq.${encodeURIComponent((lead.email || "").toLowerCase())})`);
      const dres = await db(`leads?${q}`, { method: "GET" });
      const prior: Array<{ id: string; phone: string; email: string }> = await dres.json();
      const others = prior.filter((p) => p.id !== leadId);
      dup = {
        duplicatePhone: others.some((p) => p.phone && p.phone === lead.phone),
        duplicateEmail: others.some((p) => (p.email || "").toLowerCase() === (lead.email || "").toLowerCase()),
      };
    } catch (e) { errors.push("dup-check: " + String(e)); }

    // 2.5) M5 screening signals — MX, velocity, OFAC — gathered in parallel,
    // each best-effort (a failed check contributes nothing rather than blocking).
    const signals: ServerSignals = {};
    try {
      const [mx, velo, sdn] = await Promise.allSettled([
        checkMx(lead.email),
        checkVelocity(leadId, ip, lead.email, lead.phone),
        checkSdn(lead.name),
      ]);
      if (mx.status === "fulfilled") signals.mxValid = mx.value;
      if (velo.status === "fulfilled") Object.assign(signals, velo.value);
      if (sdn.status === "fulfilled" && sdn.value.length) signals.sdnMatches = sdn.value;
    } catch (e) { errors.push("signals: " + String(e)); }

    // 3) Deterministic validation.
    const result = validateLead(lead, dup, signals);

    // 4) LLM executive summary (grounded; optional; times out to template).
    try {
      const llm = await llmExecutiveSummary(lead, result);
      if (llm) {
        result.execSummary = llm.summary;
        result.meta.summarySource = "llm";
        result.meta.model = llm.model;
        result.meta.promptVersion = llm.promptVersion;
      }
    } catch (e) { errors.push("llm: " + String(e)); }
    result.meta.errors = errors;

    // 5) Persist the validation report (structured + raw).
    try {
      await db("lead_validations", {
        method: "POST",
        body: JSON.stringify({
          lead_id: leadId, validation_score: result.overall, validation_grade: result.grade,
          priority: result.priority, identity_status: result.identity, completeness_score: result.completeness,
          consistency_status: result.consistency, financial_plausibility: result.financial, fraud_risk: result.fraudRisk,
          executive_summary: result.execSummary.join("\n\n"), flags: result.allFlags,
          reasoning: {
            identity: result.modules.identity.reasoning, completeness: result.modules.completeness.reasoning,
            consistency: result.modules.consistency.reasoning, financial: result.modules.financial.reasoning,
            fraud: result.modules.fraud.reasoning,
          },
          raw_ai_output: result, validation_version: result.meta.validationVersion,
          prompt_version: result.meta.promptVersion, model_used: result.meta.model,
          summary_source: result.meta.summarySource, validation_duration_ms: result.meta.durationMs,
          validation_errors: errors,
        }),
      });
    } catch (e) { errors.push("store: " + String(e)); console.error("validation store failed", e); }

    // 6) Internal email (scored).
    const parts = buildInternalEmail(lead, result);
    await sendInternalEmail(parts);
  } catch (e) {
    // Total validation failure -> failsafe email so the lead is never silently lost.
    console.error("validation pipeline failed", e);
    try { await sendInternalEmail(buildInternalEmail(lead, null, String(e))); } catch (_) { /* logged in sender */ }
  }

  return json({ success: true }, 200, origin);
});
