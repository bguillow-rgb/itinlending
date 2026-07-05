// Lead Intelligence — deterministic validation engine (M0).
//
// This is the reusable, model-agnostic scoring core. It NEVER approves or denies
// a loan. It validates submitted data, finds inconsistencies, flags fraud
// indicators, and scores lead quality 0-100. The SCORE is deterministic
// (reproducible + testable + ML-ready); the LLM (llm.ts) only writes prose FROM
// these structured findings, so it cannot fabricate the number.
//
// Ported 1:1 from the reference implementation validated against 27 real leads.
// Pure TypeScript, no runtime deps — runs in Deno, Node, or the browser.

import type {
  LeadInput, ModuleResult, LeadValidationResult, DuplicateContext,
  FraudLevel, FinancialLabel, Grade,
} from "./types.ts";

export const VALIDATION_VERSION = "1.0.0";

// ---- reference data (extend freely; unknown area codes -> soft flag) ----
const AREA_STATE: Record<string, string> = {
  "720":"CO","303":"CO","404":"GA","470":"GA","678":"GA","305":"FL","786":"FL","850":"FL",
  "754":"FL","954":"FL","407":"FL","408":"CA","510":"CA","213":"CA","351":"MA","978":"MA",
  "617":"MA","832":"TX","713":"TX","737":"TX","512":"TX","210":"TX","214":"TX","347":"NY",
  "332":"NY","212":"NY","718":"NY","931":"TN","615":"TN","815":"IL","312":"IL","803":"SC",
  "704":"NC","919":"NC","202":"DC",
};
const STATE_ABBR: Record<string, string> = {
  colorado:"CO", georgia:"GA", florida:"FL", california:"CA", massachusetts:"MA",
  texas:"TX", "new york":"NY", tennessee:"TN", illinois:"IL", "south carolina":"SC",
  "north carolina":"NC", wyoming:"WY", ny:"NY",
};
const DISPOSABLE = new Set(["mailinator.com","guerrillamail.com","10minutemail.com","tempmail.com","trashmail.com","yopmail.com"]);
const FAKE_DOMAINS = new Set(["hhh.com","ccc.com","test.com","example.com","aaa.com"]);
const PLACEHOLDER_NAMES = new Set(["john doe","jane doe","test","asdf","na","n/a"]);
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const digits = (s?: string) => (s || "").replace(/\D/g, "");
const clamp = (n: number) => Math.max(0, Math.min(100, n));

function isGibberish(s?: string): boolean {
  const t = (s || "").toLowerCase().replace(/[^a-z]/g, "");
  if (!t) return true;
  if (new Set(t).size === 1) return true;                 // "ffff", "ccccc"
  if (t.length <= 8 && !/[aeiou]/.test(t)) return true;   // "gdgdtdh"
  return false;
}
function amtMid(a?: string): number | null {
  return ({ "under $5,000":3000, "$5,000-$10,000":7500, "$10,000-$25,000":17500, "$25,000+":30000 } as Record<string,number>)[(a||"").toLowerCase()] ?? null;
}
function incMid(i?: string): number | null {
  return ({ "under $2,000":1500, "$2,000-$4,000":3000, "$4,000-$6,000":5000, "$6,000+":7000 } as Record<string,number>)[(i||"").toLowerCase()] ?? null;
}
const nn = (s?: string) => (s || "").trim();

// ---------------- MODULE 1 — Identity ----------------
export function moduleIdentity(l: LeadInput, dup: DuplicateContext): ModuleResult {
  const flags: string[] = []; let score = 100; let conf = 0.9;
  const email = nn(l.email); const dom = email.includes("@") ? email.split("@").pop()!.toLowerCase() : "";
  const name = nn(l.name); const low = name.toLowerCase();
  const ph = digits(l.phone); let ac = ph.length >= 10 ? ph.slice(0, 3) : "";
  const stFull = nn(l.state).toLowerCase();
  const st = STATE_ABBR[stFull] ?? (stFull ? stFull.toUpperCase().slice(0, 2) : "");

  if (!EMAIL_RE.test(email)) { flags.push("invalid email syntax"); score -= 100; }
  else if (DISPOSABLE.has(dom)) { flags.push(`disposable email domain (${dom})`); score -= 60; }
  else if (FAKE_DOMAINS.has(dom) || !dom.includes(".")) { flags.push(`fake/unresolvable email domain (${dom})`); score -= 70; }

  if (ph.length !== 10) { flags.push(`invalid phone (${JSON.stringify(l.phone)})`); score -= 60; ac = ""; }
  else if (ac && !(ac in AREA_STATE)) { flags.push(`unrecognized/unassigned area code (${ac})`); score -= 25; conf = 0.7; }
  else if (ac && st && AREA_STATE[ac] && AREA_STATE[ac] !== st) { flags.push(`area code ${ac} (${AREA_STATE[ac]}) ≠ stated state (${st})`); score -= 10; conf = 0.75; }

  if (isGibberish(name)) { flags.push(`implausible/gibberish name (${JSON.stringify(name)})`); score -= 70; }
  else if (PLACEHOLDER_NAMES.has(low)) { flags.push(`placeholder name (${JSON.stringify(name)})`); score -= 55; }
  else if (/\d$/.test(name)) { flags.push("name has trailing digit (form artifact)"); score -= 5; }

  const local = email.includes("@") ? email.split("@")[0].toLowerCase() : "";
  const toks = low.split(/[^a-z]+/).filter((t) => t.length >= 3);
  if (toks.length && local && !toks.some((t) => local.includes(t))) {
    flags.push("email local-part does not match applicant name"); score -= 8; conf = Math.min(conf, 0.7);
  }
  if (dup.duplicatePhone) { flags.push("duplicate phone on file"); score -= 25; }
  if (dup.duplicateEmail) { flags.push("duplicate email on file"); score -= 25; }

  const note = nn(l.notes).toLowerCase();
  if (note.includes("test")) { flags.push("flagged as test entry (metadata)"); score -= 40; }
  if (note.includes("duplicate")) { flags.push("flagged as duplicate (metadata)"); score -= 20; }

  score = clamp(score);
  const status = score >= 70 ? "PASS" : score >= 40 ? "WARNING" : "FAIL";
  // "Identity & Contactability" — reachability read (can we actually reach them?)
  const reachability = score >= 90 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "Poor";
  return { status, score, flags, reachability, reasoning: flags.length ? flags.join("; ") : "Identity signals clean; contact information looks reachable.", confidence: Number(conf.toFixed(2)) };
}

// ---------------- MODULE 2 — Completeness ----------------
export function moduleCompleteness(l: LeadInput): ModuleResult {
  const req = ["name","phone","email","loanType","state"];
  const prod = nn(l.loanType).toLowerCase();
  let qual = ["amount","score","income","itin_status"];
  if (prod.includes("business")) qual.push("time_in_business");
  if (prod.includes("mortgage")) qual.push("down_payment");
  if (prod.includes("card")) qual = ["score","itin_status"];
  if (prod.includes("credit score")) qual = [];
  const fields = [...req, ...qual];
  const filled = fields.filter((f) => nn((l as Record<string, string>)[f]));
  const pct = Math.round((100 * filled.length) / fields.length);
  const missingReq = req.filter((f) => !nn((l as Record<string, string>)[f]));
  const missingOpt = qual.filter((f) => !nn((l as Record<string, string>)[f]));
  const flags = missingReq.length ? [`missing required: ${missingReq.join(", ")}`] : [];
  let reasoning = `${filled.length}/${fields.length} relevant fields provided (${pct}%).`;
  if (missingOpt.length) reasoning += ` Missing qualifiers: ${missingOpt.join(", ")}.`;
  return {
    status: pct >= 80 ? "PASS" : pct >= 50 ? "WARNING" : "FAIL",
    score: pct, flags, reasoning, confidence: 1.0,
    missing_required: missingReq, missing_optional: missingOpt,
  };
}

// ---------------- MODULE 3 — Consistency ----------------
export function moduleConsistency(l: LeadInput): ModuleResult {
  const flags: string[] = []; let score = 100;
  const prod = nn(l.loanType).toLowerCase();
  const a = amtMid(l.amount); const im = incMid(l.income);
  const tib = nn(l.time_in_business).toLowerCase();
  if (a && im) {
    const ratio = a / (im * 12);
    if (ratio >= 1.0) { flags.push(`requested amount high vs income (~$${a.toLocaleString()} vs ~$${(im*12).toLocaleString()}/yr)`); score -= 20; }
  }
  if (prod.includes("business") && (tib === "not open yet" || tib === "less than 1 year")) {
    flags.push(`business loan but time in business = ${JSON.stringify(tib)}`); score -= 20;
  }
  if (prod.includes("personal") && tib) {
    flags.push("time-in-business answered on a personal-loan lead (field mismatch)"); score -= 5;
  }
  if (prod.includes("card") && nn(l.amount)) {
    flags.push("credit-card lead carries a loan amount (product/field mismatch)"); score -= 10;
  }
  const dp = nn(l.down_payment).toLowerCase();
  if ((dp === "20%+" || dp === "10-20%") && im && im <= 3000 && a && a >= 17500) {
    flags.push("large down payment inconsistent with modest income"); score -= 15;
  }
  score = clamp(score);
  return {
    status: score >= 80 ? "PASS" : score >= 50 ? "WARNING" : "FAIL",
    score, flags, reasoning: flags.length ? flags.join("; ") : "No contradictions found.", confidence: 0.8,
  };
}

// ---------------- MODULE 4 — Financial Plausibility (estimate only) ----------------
export function moduleFinancial(l: LeadInput): ModuleResult {
  const prod = nn(l.loanType).toLowerCase();
  const a = amtMid(l.amount); const im = incMid(l.income); const cr = nn(l.score).toLowerCase();
  // Non-loan products have no "requested amount" — financial plausibility does not
  // apply and must NOT penalize the lead. Return N/A; validateLead redistributes
  // the 25% financial weight across the other modules for these products.
  if (prod.includes("credit score")) {
    return { status: "N/A", score: 0, flags: [], reasoning: "Credit-score-check lead — no loan to assess (financial plausibility not applicable).", confidence: 1.0, label: "N/A" };
  }
  if (prod.includes("card")) {
    return { status: "N/A", score: 0, flags: [], reasoning: "Credit-card lead — loan-amount plausibility not applicable.", confidence: 1.0, label: "N/A" };
  }
  if (!a || !im) {
    return { status: "WARNING", score: 50, flags: ["missing amount and/or income"], reasoning: "Unable to determine — requested amount and/or income not provided.", confidence: 0.5, label: "Insufficient" };
  }
  const ratio = a / (im * 12);
  let base = ratio < 0.3 ? 90 : ratio < 0.6 ? 75 : ratio < 1.0 ? 55 : 30;
  if (cr.includes("680+")) base += 8;
  else if (cr.includes("580-620")) base -= 8;
  else if (cr.includes("under 580")) base -= 18;
  else if (cr.includes("not sure") || !cr) base -= 6;
  if (prod.includes("business")) {
    const tib = nn(l.time_in_business).toLowerCase();
    base += tib === "2+ years" ? 6 : (tib === "not open yet" || tib === "less than 1 year") ? -10 : 0;
  }
  base = Math.max(5, Math.min(98, base));
  const label: FinancialLabel = base >= 85 ? "Very Strong" : base >= 70 ? "Strong" : base >= 50 ? "Moderate" : base >= 32 ? "Weak" : "Very Weak";
  const reasoning = `Requested ~$${a.toLocaleString()} against ~$${(im*12).toLocaleString()}/yr income (loan≈${Math.round(ratio*100)}% of annual income), credit band ${cr || "unstated"}. Estimate only — not an approval.`;
  return { status: "PASS", score: base, flags: [], reasoning, confidence: 0.7, label };
}

// ---------------- MODULE 5 — Fraud Indicators ----------------
export function moduleFraud(l: LeadInput, dup: DuplicateContext, ident: ModuleResult): ModuleResult {
  const idf = ident.flags.join(" ").toLowerCase();
  const note = nn(l.notes).toLowerCase();
  const flags = ident.flags.filter((f) =>
    ["gibberish","fake","disposable","invalid phone","placeholder","duplicate","test","unassigned"].some((k) => f.toLowerCase().includes(k)));
  const crit = idf.includes("gibberish") || idf.includes("fake/unresolvable") || note.includes("test");
  const high = idf.includes("disposable") || idf.includes("placeholder name");
  const med = dup.duplicatePhone || dup.duplicateEmail || note.includes("duplicate") || idf.includes("unrecognized/unassigned area code");
  const level: FraudLevel = crit ? "Critical" : high ? "High" : med ? "Medium" : "Low";
  const score = { Low: 92, Medium: 62, High: 32, Critical: 6 }[level];
  return {
    status: level, score, flags,
    reasoning: level === "Low" && !flags.length ? "No fraud indicators." : `${level} risk: ${(flags.length ? flags : ["heuristic signals"]).join("; ")}`,
    confidence: 0.85,
  };
}

// ---------------- MODULE 6 — Lead Quality Score ----------------
// Weights mirror a loan officer's first-pass triage (owner-specified):
//   Identity & Contactability 25% · Financial Plausibility 25%
//   Application Consistency 20% · Fraud Indicators 20% · Completeness 10%
export const WEIGHTS = { identity: 0.25, financial: 0.25, consistency: 0.20, fraud: 0.20, completeness: 0.10 };

function gradeOf(s: number): Grade { return s >= 93 ? "A+" : s >= 85 ? "A" : s >= 70 ? "B" : s >= 55 ? "C" : s >= 40 ? "D" : "F"; }
function priorityOf(s: number): "HIGH" | "MEDIUM" | "LOW" | "DISQUALIFIED" {
  return s >= 85 ? "HIGH" : s >= 70 ? "MEDIUM" : s >= 40 ? "LOW" : "DISQUALIFIED";
}

/** Templated executive summary (deterministic fallback; the LLM layer replaces
 *  the prose in production but is grounded in exactly these findings). */
export function templateSummary(l: LeadInput, r: Omit<LeadValidationResult, "execSummary" | "recommendations" | "meta" | "allFlags">): [string, string] {
  const name = nn(l.name) || "Applicant"; const prod = nn(l.loanType) || "loan"; const st = nn(l.state);
  const fin = r.modules.financial;
  const comp = r.modules.completeness;
  const parts1 = [`${name} submitted a ${prod.toLowerCase()} request from ${st || "an unspecified state"} via ${nn(l.source) || "the site"}.`];
  parts1.push(comp.reasoning);
  if (r.financial !== "N/A" && r.financial !== "Insufficient") parts1.push(`Financial plausibility reads ${r.financial.toLowerCase()}: ${fin.reasoning}`);
  else if (r.financial === "Insufficient") parts1.push("Financial plausibility is undeterminable from the data provided.");
  const p1 = parts1.join(" ");

  const concerns: string[] = [];
  if (r.identity !== "PASS") concerns.push(...r.modules.identity.flags);
  concerns.push(...r.modules.consistency.flags);
  if (r.fraudRisk !== "Low") concerns.push(`${r.fraudRisk.toLowerCase()} fraud risk`);
  let p2: string;
  if (concerns.length) {
    const uniq = [...new Set(concerns)];
    const tail = r.overall < 40 ? "treat as low-priority / likely junk." : r.overall < 70 ? "verify the flagged items before follow-up." : "a solid lead worth prompt follow-up despite minor notes.";
    p2 = `Concerns to note before prioritizing: ${uniq.join("; ")}. Overall this scores ${r.overall}/100 (grade ${r.grade}); ${tail}`;
  } else {
    p2 = `No identity, consistency, or fraud concerns were detected. Overall this scores ${r.overall}/100 (grade ${r.grade}) — a strong, clean lead that should receive prompt follow-up.`;
  }
  return [p1, p2];
}

function recommendationsOf(r: Omit<LeadValidationResult, "execSummary" | "recommendations" | "meta" | "allFlags">): string[] {
  const recs: string[] = [];
  if (r.fraudRisk === "Critical") recs.push("Do not pursue — critical fraud/test indicators.");
  else if (r.fraudRisk === "High") recs.push("Verify identity before any outreach.");
  if (r.modules.identity.flags.some((f) => f.includes("duplicate"))) recs.push("Check for an existing record before creating a new contact.");
  if (r.financial === "Insufficient") recs.push("Missing amount/income — a follow-up call can complete the profile.");
  if (r.modules.identity.flags.some((f) => f.includes("area code"))) recs.push("Confirm the applicant's current state (area code / state differ).");
  if (!recs.length) recs.push("No blockers — prioritize per score.");
  return recs;
}

/** The public service entry point. Deterministic; LLM summary is layered on
 *  separately by the Edge Function via llm.ts. */
export function validateLead(l: LeadInput, dup: DuplicateContext = { duplicatePhone: false, duplicateEmail: false }): LeadValidationResult {
  const started = Date.now();
  const identity = moduleIdentity(l, dup);
  const completeness = moduleCompleteness(l);
  const consistency = moduleConsistency(l);
  const financial = moduleFinancial(l);
  const fraud = moduleFraud(l, dup, identity);

  // When financial plausibility is N/A (card / credit-score leads), drop its 25%
  // and renormalize the remaining modules so the lead isn't penalized for lacking
  // a loan amount. Loan leads missing amount/income keep "Insufficient" (a real gap).
  const finApplicable = financial.label !== "N/A";
  const w = finApplicable
    ? WEIGHTS
    : { identity: 0.25/0.75, financial: 0, consistency: 0.20/0.75, fraud: 0.20/0.75, completeness: 0.10/0.75 };
  let overall = Math.round(
    w.identity * identity.score +
    w.financial * financial.score +
    w.consistency * consistency.score +
    w.fraud * fraud.score +
    w.completeness * completeness.score);
  if (fraud.status === "Critical") overall = Math.min(overall, 12);
  else if (fraud.status === "High") overall = Math.min(overall, 45);

  const grade = gradeOf(overall);
  const priority = priorityOf(overall);
  // Lead-Quality Confidence (rules-based, NOT an empirical probability). Discounts
  // the score slightly when the modules that fed it were low-confidence.
  const avgConf = (identity.confidence + completeness.confidence + consistency.confidence + financial.confidence + fraud.confidence) / 5;
  const qualityConfidence = clamp(Math.round(overall * (0.75 + 0.25 * avgConf)));
  const reachability = (identity as ModuleResult & { reachability: string }).reachability as LeadValidationResult["reachability"];
  // Funding Probability is the future ML layer — unavailable until lender outcomes exist.
  const fundingProbability: LeadValidationResult["fundingProbability"] = {
    available: false,
    message: "Not yet available (requires historical lender outcome data).",
  };
  const modules = { identity, completeness, consistency, financial, fraud };
  const partial = {
    overall, grade, priority, qualityConfidence, reachability, fundingProbability,
    fraudRisk: fraud.status as FraudLevel,
    financial: (financial.label as FinancialLabel) ?? "N/A",
    identity: identity.status, completeness: completeness.score, consistency: consistency.status,
    modules,
  };
  const execSummary = templateSummary(l, partial);
  const allFlags = [...new Set([...identity.flags, ...completeness.flags, ...consistency.flags, ...financial.flags, ...fraud.flags])].sort();
  const recommendations = recommendationsOf(partial);

  return {
    ...partial,
    execSummary,
    allFlags,
    recommendations,
    meta: {
      validationVersion: VALIDATION_VERSION,
      promptVersion: null,
      model: null,
      durationMs: Date.now() - started,
      errors: [],
      summarySource: "template",
    },
  };
}
