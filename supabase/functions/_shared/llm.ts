// Lead Intelligence — LLM executive-summary layer (M2).
//
// The LLM does NOT score and does NOT approve/deny. It writes a concise, human
// executive summary GROUNDED STRICTLY in the deterministic engine findings, so it
// cannot fabricate. On any error/timeout it returns null and the caller falls back
// to the deterministic template summary — lead processing never blocks on the LLM.

import type { LeadInput, LeadValidationResult } from "./types.ts";

export const PROMPT_VERSION = "2026-07-05.1";
const DEFAULT_MODEL = "claude-haiku-4-5-20251001";
const TIMEOUT_MS = 6000;

const SYSTEM = `You write internal executive summaries for a lending lead-intake team.
You are given a lead's submitted fields and a DETERMINISTIC validation report (scores, statuses, flags).
Write EXACTLY two short paragraphs (2-4 sentences each) that help the owner decide how to prioritize.

HARD RULES:
- NEVER recommend approving or denying a loan. This is lead validation, not underwriting.
- NEVER invent facts. Use ONLY the provided fields and findings.
- Distinguish fact from estimate: things stated on the form are "reported"; your read of them is an inference; if data is missing say it is undeterminable.
- Explain WHY the lead scored as it did — reference the concrete flags/strengths. Do not just restate the number.
- Neutral, professional, concise. No greetings, no sign-off, no markdown headers.`;

interface LlmResult { summary: [string, string]; model: string; promptVersion: string; }

export async function llmExecutiveSummary(lead: LeadInput, result: LeadValidationResult): Promise<LlmResult | null> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return null; // not configured -> template fallback
  const model = Deno.env.get("LEAD_LLM_MODEL") || DEFAULT_MODEL;

  const payload = {
    lead: {
      name: lead.name, state: lead.state, loanType: lead.loanType, amount: lead.amount,
      creditBand: lead.score, income: lead.income, itinStatus: lead.itin_status,
      timeInBusiness: lead.time_in_business, downPayment: lead.down_payment, source: lead.source,
    },
    findings: {
      overall: result.overall, grade: result.grade, fraudRisk: result.fraudRisk,
      financialPlausibility: result.financial, identity: result.identity,
      completeness: result.completeness, consistency: result.consistency,
      flags: result.allFlags,
      moduleReasoning: {
        identity: result.modules.identity.reasoning,
        consistency: result.modules.consistency.reasoning,
        financial: result.modules.financial.reasoning,
        fraud: result.modules.fraud.reasoning,
      },
    },
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        system: SYSTEM,
        messages: [{
          role: "user",
          content: `Validation report (JSON):\n${JSON.stringify(payload)}\n\nReturn ONLY the two paragraphs, separated by a blank line.`,
        }],
      }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const text: string = (data?.content?.[0]?.text ?? "").trim();
    if (!text) return null;
    const paras = text.split(/\n\s*\n/).map((p: string) => p.trim()).filter(Boolean);
    const summary: [string, string] = [paras[0] ?? text, paras[1] ?? ""];
    return { summary, model, promptVersion: PROMPT_VERSION };
  } catch {
    return null; // timeout or network error -> template fallback
  } finally {
    clearTimeout(timer);
  }
}
