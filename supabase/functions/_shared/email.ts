// Lead Intelligence — internal notification email (M3).
//
// The applicant NEVER sees this. It is optimized for fast review: score/grade/
// priority up top, module bars, executive summary, flags, lead details, full
// report. If AI validation was unavailable, a clear banner says so and the lead
// details are still delivered (failsafe — see index.ts).

import type { LeadInput, LeadValidationResult } from "./types.ts";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]!));
const gradeColor = (g?: string) => g === "A+" || g === "A" ? "#157C46" : g === "B" ? "#B07A1E" : g === "C" || g === "D" ? "#C2610C" : "#B3261E";

interface EmailParts { subject: string; html: string; text: string; }

/** result === null means AI validation failed entirely (failsafe email). */
export function buildInternalEmail(l: LeadInput, result: LeadValidationResult | null, aiError?: string): EmailParts {
  const site = l.source || "ITIN site";
  const detailRows: [string, string][] = [
    ["Name", l.name || ""], ["Phone", l.phone || ""], ["Email", l.email || ""],
    ["State", l.state || ""], ["Loan Type", l.loanType || ""], ["Requested Amount", l.amount || ""],
    ["Credit Band", l.score || ""], ["Monthly Income", l.income || ""], ["ITIN Status", l.itin_status || ""],
    ["Homeownership", l.home_status || ""], ["Buy Timeframe", l.buy_timeframe || ""],
    ["Time in Business", l.time_in_business || ""], ["Down Payment", l.down_payment || ""],
    ["Loan Purpose / Notes", l.notes || ""], ["Source Website", l.source || ""],
    ["Submitted", l.submittedAt || ""], ["IP", l.ip || ""],
  ];

  // ---------- failsafe (no AI) ----------
  if (!result) {
    const subject = `NEW ITIN LEAD (AI unavailable) — ${l.name || "unknown"} · ${l.state || ""}`;
    const detailsText = detailRows.filter(([, v]) => v).map(([k, v]) => `  ${k}: ${v}`).join("\n");
    const text = [
      "NEW ITIN LEAD RECEIVED", "=".repeat(40),
      "AI VALIDATION", "  Status: Unavailable", `  Reason: ${aiError || "Timeout / Error"}`,
      "  (Lead saved; validation can be re-run from the dashboard.)", "",
      "LEAD DETAILS", detailsText,
    ].join("\n");
    const detailsHtml = detailRows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:3px 12px 3px 0;color:#56627A">${esc(k)}</td><td style="padding:3px 0"><b>${esc(v)}</b></td></tr>`).join("");
    const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:640px">
      <h2 style="margin:0 0 4px">New ITIN Lead — ${esc(site)}</h2>
      <div style="background:#FBE3CC;border:1px solid #C2610C;border-radius:8px;padding:10px 14px;margin:12px 0">
        <b style="color:#B3261E">AI Validation: Unavailable</b><br>
        <span style="color:#56627A">Reason: ${esc(aiError || "Timeout / Error")}. Lead saved; re-run validation from the dashboard.</span>
      </div>
      <table style="border-collapse:collapse;font-size:14px">${detailsHtml}</table></div>`;
    return { subject, html, text };
  }

  // ---------- normal (scored) ----------
  const r = result;
  const modBar = (label: string, score: number, note = "") => {
    const w = Math.max(2, Math.min(100, score));
    return `<tr><td style="padding:4px 10px 4px 0;color:#10192B;white-space:nowrap">${esc(label)}</td>
      <td style="padding:4px 0;width:100%"><div style="background:#E8EDF5;border-radius:4px;height:10px"><div style="background:${gradeColor(r.grade)};height:10px;width:${w}%;border-radius:4px"></div></div></td>
      <td style="padding:4px 0 4px 10px;text-align:right"><b>${score}</b> ${note ? `<span style="color:#56627A">${esc(note)}</span>` : ""}</td></tr>`;
  };
  const subject = `[${r.priority} ${r.grade} ${r.overall}] ITIN lead — ${l.name || "unknown"} · ${l.loanType || ""} · ${l.state || ""}`;

  const flagsHtml = r.allFlags.length
    ? `<ul style="margin:6px 0;padding-left:20px">${r.allFlags.map((f) => `<li style="margin:2px 0">${esc(f)}</li>`).join("")}</ul>`
    : `<p style="margin:6px 0;color:#157C46"><b>No significant concerns detected.</b></p>`;
  const detailsHtml = detailRows.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:3px 12px 3px 0;color:#56627A">${esc(k)}</td><td style="padding:3px 0"><b>${esc(v)}</b></td></tr>`).join("");
  const m = r.modules;
  const reportHtml = ["identity","completeness","consistency","financial","fraud"].map((k) => {
    const mm = (m as Record<string, { status?: string; reasoning: string; confidence: number }>)[k];
    const label = { identity:"Identity & Contactability", completeness:"Completeness", consistency:"Consistency", financial:"Financial Plausibility", fraud:"Fraud Indicators" }[k];
    return `<p style="margin:6px 0"><b>${esc(label)}</b> <span style="color:#56627A">[${esc(mm.status)}]</span><br>${esc(mm.reasoning)} <span style="color:#8892A6">(confidence ${mm.confidence})</span></p>`;
  }).join("");

  const html = `<div style="font-family:system-ui,Arial,sans-serif;max-width:660px;color:#10192B">
    <h2 style="margin:0 0 2px">New ITIN Lead — ${esc(site)}</h2>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:10px 0">
      <div style="background:${gradeColor(r.grade)};color:#fff;border-radius:10px;padding:10px 16px">
        <div style="font-size:26px;font-weight:800;line-height:1">${r.overall}<span style="font-size:14px;font-weight:500">/100</span></div>
        <div style="font-size:12px;opacity:.9">Grade ${esc(r.grade)} · ${esc(r.priority)}</div>
      </div>
      <div style="background:#F4F6FA;border:1px solid #D8DFEA;border-radius:10px;padding:8px 14px;font-size:13px">
        <div>Lead-Quality Confidence: <b>${r.qualityConfidence}%</b> <span style="color:#8892A6">(rules-based)</span></div>
        <div>Fraud Risk: <b>${esc(r.fraudRisk)}</b> · Financial: <b>${esc(r.financial)}</b></div>
        <div>Reachability: <b>${esc(r.reachability)}</b> · Completion: <b>${r.completeness}%</b></div>
        <div style="color:#8892A6">Funding Probability: ${esc((r.fundingProbability as { message?: string }).message ?? r.fundingProbability)}</div>
      </div>
    </div>
    <table style="border-collapse:collapse;width:100%;font-size:13px;margin:8px 0">
      ${modBar("Identity & Contactability", m.identity.score, r.reachability)}
      ${modBar("Financial Plausibility", m.financial.score, String(r.financial))}
      ${modBar("Application Consistency", m.consistency.score)}
      ${modBar("Fraud Indicators", m.fraud.score, r.fraudRisk)}
      ${modBar("Application Completeness", m.completeness.score)}
    </table>
    <h3 style="margin:16px 0 4px">Executive Summary</h3>
    <p style="margin:4px 0">${esc(r.execSummary[0])}</p>
    <p style="margin:4px 0">${esc(r.execSummary[1])}</p>
    <h3 style="margin:16px 0 4px">Key Flags</h3>${flagsHtml}
    <h3 style="margin:16px 0 4px">Lead Details</h3>
    <table style="border-collapse:collapse;font-size:14px">${detailsHtml}</table>
    <h3 style="margin:16px 0 4px">AI Validation Report</h3>${reportHtml}
    <p style="margin:10px 0;color:#8892A6;font-size:12px">Recommendations: ${esc(r.recommendations.join(" · "))}<br>
      Engine v${esc(r.meta.validationVersion)} · summary via ${esc(r.meta.summarySource)}${r.meta.model ? " (" + esc(r.meta.model) + ")" : ""} · ${r.meta.durationMs}ms</p>
  </div>`;

  const text = [
    "NEW ITIN LEAD RECEIVED  —  " + site, "=".repeat(46),
    `AI LEAD SCORE   ${r.overall}/100    Grade ${r.grade}    Priority ${r.priority}`,
    `Lead-Quality Confidence: ${r.qualityConfidence}% (rules-based)`,
    `Fraud Risk: ${r.fraudRisk}  |  Financial: ${r.financial}  |  Reachability: ${r.reachability}  |  Completion: ${r.completeness}%`,
    `Funding Probability: ${(r.fundingProbability as { message?: string }).message ?? ""}`,
    "-".repeat(46),
    `Identity & Contactability  ${m.identity.score}`,
    `Financial Plausibility     ${m.financial.score} (${r.financial})`,
    `Application Consistency    ${m.consistency.score}`,
    `Fraud Indicators           ${m.fraud.score} (${r.fraudRisk})`,
    `Application Completeness   ${m.completeness.score}`,
    "-".repeat(46), "EXECUTIVE SUMMARY", " " + r.execSummary[0], " " + r.execSummary[1],
    "-".repeat(46), "KEY FLAGS",
    r.allFlags.length ? r.allFlags.map((f) => "  • " + f).join("\n") : "  No significant concerns detected.",
    "-".repeat(46), "LEAD DETAILS",
    detailRows.filter(([, v]) => v).map(([k, v]) => `  ${k}: ${v}`).join("\n"),
  ].join("\n");

  return { subject, html, text };
}

/** Send via Resend. Returns true on success; never throws (caller logs). */
export async function sendInternalEmail(parts: EmailParts): Promise<boolean> {
  const key = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("LEAD_EMAIL_FROM");
  const to = Deno.env.get("LEAD_EMAIL_TO");
  if (!key || !from || !to) { console.error("email not configured (RESEND_API_KEY/LEAD_EMAIL_FROM/LEAD_EMAIL_TO)"); return false; }
  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ from, to: to.split(",").map((s) => s.trim()), subject: parts.subject, html: parts.html, text: parts.text }),
    });
    if (!resp.ok) { console.error("resend error", resp.status, await resp.text()); return false; }
    return true;
  } catch (e) {
    console.error("resend exception", e);
    return false;
  }
}
