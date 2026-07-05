// Lead Intelligence — engine unit tests.  Run:  deno test supabase/functions/_shared/
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { validateLead, moduleConsistency, moduleFinancial, WEIGHTS } from "./engine.ts";
import type { LeadInput } from "./types.ts";

const strong: LeadInput = {
  name: "Maria Gonzalez", email: "maria.gonzalez@gmail.com", phone: "737-368-1530", state: "Texas",
  loanType: "Personal loan", amount: "Under $5,000", score: "620-680", income: "$4,000-$6,000",
  itin_status: "ITIN only", source: "itinlending.net",
};

Deno.test("weights sum to 1", () => {
  const s = WEIGHTS.identity + WEIGHTS.financial + WEIGHTS.consistency + WEIGHTS.fraud + WEIGHTS.completeness;
  assertEquals(Math.round(s * 100) / 100, 1);
});

Deno.test("clean lead scores high, passes identity, low fraud", () => {
  const r = validateLead(strong);
  assert(r.overall >= 85, `expected >=85 got ${r.overall}`);
  assertEquals(r.identity, "PASS");
  assertEquals(r.fraudRisk, "Low");
  assert(["HIGH", "MEDIUM"].includes(r.priority));
});

Deno.test("gibberish + fake domain => Critical fraud, F, capped <=12", () => {
  const r = validateLead({ name: "gdgdtdh", email: "cccc@hhh.com", phone: "cccc", state: "ny", loanType: "Auto loan" });
  assertEquals(r.fraudRisk, "Critical");
  assertEquals(r.grade, "F");
  assert(r.overall <= 12);
});

Deno.test("placeholder name => High fraud minimum", () => {
  const r = validateLead({ ...strong, name: "John Doe" });
  assert(["High", "Critical"].includes(r.fraudRisk));
  assert(r.overall <= 45);
});

Deno.test("duplicate phone penalizes identity + raises fraud", () => {
  const r = validateLead(strong, { duplicatePhone: true, duplicateEmail: false });
  assert(r.modules.identity.flags.some((f) => f.includes("duplicate")));
  assert(["Medium", "High", "Critical"].includes(r.fraudRisk));
});

Deno.test("card lead: financial is N/A and NOT penalized (weight redistributed)", () => {
  const card: LeadInput = { name: "Luis Andrade", email: "luis@gmail.com", phone: "210-612-4426", state: "Texas", loanType: "Credit card", score: "620-680", itin_status: "ITIN only" };
  const r = validateLead(card);
  assertEquals(r.financial, "N/A");
  // financial (0) must not drag it down: a clean card lead should still grade well
  assert(r.overall >= 80, `card lead unfairly penalized: ${r.overall}`);
});

Deno.test("loan lead missing amount/income => Insufficient (real gap, still counts)", () => {
  const r = validateLead({ ...strong, amount: "", income: "" });
  assertEquals(r.financial, "Insufficient");
  assertEquals(r.modules.financial.score, 50);
});

Deno.test("consistency: business loan with no operating history flags", () => {
  const m = moduleConsistency({ loanType: "Business loan", time_in_business: "Not open yet" });
  assert(m.flags.some((f) => f.toLowerCase().includes("business loan")));
  assert(m.score < 100);
});

Deno.test("consistency: amount far above income flags", () => {
  const m = moduleConsistency({ loanType: "Personal loan", amount: "$25,000+", income: "Under $2,000" });
  assert(m.flags.some((f) => f.includes("high vs income")));
});

Deno.test("financial: strong ask reads Very Strong/Strong", () => {
  const m = moduleFinancial({ loanType: "Personal loan", amount: "Under $5,000", income: "$6,000+", score: "680+" });
  assert(["Very Strong", "Strong"].includes(m.label as string));
});

Deno.test("engine never approves or denies", () => {
  const r = validateLead(strong);
  const text = (r.execSummary.join(" ") + " " + r.recommendations.join(" ")).toLowerCase();
  assert(!/\bapprove\b|\bdeny\b|\bdenied\b|\bapproved\b/.test(text), "must not recommend approval/denial");
});

Deno.test("result carries ML-ready provenance", () => {
  const r = validateLead(strong);
  assert(r.meta.validationVersion.length > 0);
  assertEquals(r.fundingProbability.available, false);
});

// ---------------- M5 server-signal tests ----------------

Deno.test("M5: no MX records penalizes identity + raises fraud to Medium", () => {
  const r = validateLead(strong, undefined, { mxValid: false });
  assert(r.modules.identity.flags.some((f) => f.includes("no MX")), "expected MX flag");
  assert(["Medium", "High", "Critical"].includes(r.fraudRisk));
});

Deno.test("M5: mxValid null/undefined never penalizes", () => {
  const a = validateLead(strong, undefined, { mxValid: null });
  const b = validateLead(strong);
  assertEquals(a.overall, b.overall);
});

Deno.test("M5: IP velocity escalates (2->Medium, 4->High, 6->Critical)", () => {
  assertEquals(validateLead(strong, undefined, { ipRepeats24h: 2 }).fraudRisk, "Medium");
  assertEquals(validateLead(strong, undefined, { ipRepeats24h: 4 }).fraudRisk, "High");
  assertEquals(validateLead(strong, undefined, { ipRepeats24h: 6 }).fraudRisk, "Critical");
});

Deno.test("M5: SDN name match flags for manual review at Medium (never auto-decline)", () => {
  const r = validateLead(strong, undefined, { sdnMatches: ["GONZALEZ, Maria"] });
  assertEquals(r.fraudRisk, "Medium");
  assert(r.allFlags.some((f) => f.includes("OFAC")), "expected OFAC flag");
  assert(r.recommendations.some((f) => f.includes("OFAC")), "expected OFAC recommendation");
  // never nukes the lead outright — manual review, not auto-decline
  assert(r.overall >= 55, `SDN name-only match should not auto-fail (got ${r.overall})`);
});

Deno.test("M5: expanded disposable list catches new domains", () => {
  const r = validateLead({ ...strong, email: "x@sharklasers.com" });
  assert(r.modules.identity.flags.some((f) => f.includes("disposable")));
  assert(["High", "Critical"].includes(r.fraudRisk));
});
