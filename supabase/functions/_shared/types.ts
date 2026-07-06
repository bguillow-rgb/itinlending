// Lead Intelligence — shared TypeScript interfaces.
// The validation engine is model-agnostic and isolated from submission logic.
// These types are the contract between the engine, the Edge Function, the DB,
// and (later) the admin dashboard.

/** Every field the lead form can submit today, plus metadata the server adds.
 *  Unknown/future fields are preserved in `extra` so new fields need no schema
 *  change (the brief's "future fields auto-supported" requirement). */
export interface LeadInput {
  name?: string;
  email?: string;
  phone?: string;
  state?: string;
  loanType?: string;            // "Personal loan" | "Business loan" | "Credit card" | ...
  amount?: string;              // banded, e.g. "$5,000-$10,000"
  score?: string;               // credit band, e.g. "620-680"
  income?: string;              // banded monthly, e.g. "$4,000-$6,000"
  itin_status?: string;         // "ITIN only" | "ITIN + SSN"
  time_in_business?: string;
  down_payment?: string;
  home_status?: string;         // "I own a home" | "No — I want to buy a home" | "No — not looking to buy"
  buy_timeframe?: string;       // "As soon as possible" | "3–6 months" | "6–12 months" (only if buying)
  notes?: string;
  source?: string;              // source site (itinlending.net | itincreditcard.com | itincreditscore.com)
  // server-added metadata (never from the client form fields directly):
  ip?: string;
  userAgent?: string;
  referrer?: string;
  landingPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  submittedAt?: string;         // ISO
  /** anything not explicitly modeled — preserved verbatim for forward-compat */
  extra?: Record<string, string>;
}

export type FactClass = "Verified from submitted information" | "Reasonable inference" | "Unable to determine";

export interface ModuleResult {
  status: string;               // PASS/WARNING/FAIL, or level (Low/Medium/High/Critical), or label
  score: number;                // 0-100
  reasoning: string;
  flags: string[];
  confidence: number;           // 0-1
  /** optional structured extras (missing fields, label, etc.) */
  [k: string]: unknown;
}

export type FraudLevel = "Low" | "Medium" | "High" | "Critical";
export type FinancialLabel = "Very Strong" | "Strong" | "Moderate" | "Weak" | "Very Weak" | "Insufficient" | "N/A";
export type Grade = "A+" | "A" | "B" | "C" | "D" | "F";

export type Reachability = "Excellent" | "Good" | "Fair" | "Poor";
export type PriorityLabel = "HIGH" | "MEDIUM" | "LOW" | "DISQUALIFIED";

/** Funding probability is the future ML layer. It is NOT part of the overall
 *  score and is unavailable until enough historical lender outcomes exist. */
export type FundingProbability =
  | { available: false; message: string }
  | { available: true; value: number; basis: string };

export interface LeadValidationResult {
  overall: number;              // 0-100 (deterministic, weighted per spec)
  grade: Grade;
  priority: PriorityLabel;      // HIGH / MEDIUM / LOW / DISQUALIFIED
  qualityConfidence: number;    // 0-100 "Lead-Quality Confidence (rules-based)"
  reachability: Reachability;
  fundingProbability: FundingProbability;  // separate; ML-only, unavailable now
  fraudRisk: FraudLevel;
  financial: FinancialLabel;
  identity: string;             // PASS/WARNING/FAIL
  completeness: number;         // %
  consistency: string;          // PASS/WARNING/FAIL
  modules: {
    identity: ModuleResult;
    completeness: ModuleResult;
    consistency: ModuleResult;
    financial: ModuleResult;
    fraud: ModuleResult;
  };
  execSummary: [string, string]; // two paragraphs
  allFlags: string[];
  recommendations: string[];
  /** provenance for auditability + ML */
  meta: {
    validationVersion: string;
    promptVersion: string | null;
    model: string | null;        // null when LLM not used (templated fallback)
    durationMs: number;
    errors: string[];
    summarySource: "llm" | "template";
  };
}

/** Batch/duplicate context passed into the engine (from DB or in-batch). */
export interface DuplicateContext {
  duplicatePhone: boolean;
  duplicateEmail: boolean;
}

/** M5 server-side screening signals, gathered by the edge function (DB + DNS).
 *  All optional: the engine scores without them (e.g. offline/tests). */
export interface ServerSignals {
  /** OFAC SDN individual names whose normalized form matched the applicant's
   *  first+last tokens. NAME-ONLY similarity — manual-review flag, never an
   *  auto-decline (high false-positive rate on common names). */
  sdnMatches?: string[];
  /** MX lookup on the email domain: true=has MX, false=none (undeliverable),
   *  null/undefined=lookup unavailable (never penalize on unavailable). */
  mxValid?: boolean | null;
  /** Prior submissions in the last 24h sharing this lead's IP / email / phone. */
  ipRepeats24h?: number;
  emailRepeats24h?: number;
  phoneRepeats24h?: number;
}
