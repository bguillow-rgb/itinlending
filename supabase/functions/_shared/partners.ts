// Lead delivery — partner registry + eligibility.
//
// This is the routing table: who buys which leads, how they take delivery, and
// what a lead must contain to be sent to them. It carries NO secrets — every
// credential and every on/off switch is read from env at send time (see
// delivery.ts). A partner only ever fires when ALL of these are true:
//
//   1. the global kill switch LEAD_DELIVERY_ENABLED === "true"
//   2. the partner's own enableEnv === "true"
//   3. the partner's authEnv/emailToEnv secret is actually set
//   4. the lead is eligible (product × state × id-type × required fields × consent)
//
// So the whole layer is dormant by default: with no env set, nothing sends.

import type { LeadInput } from "./types.ts";

export type CanonicalProduct =
  | "mortgage" | "auto" | "personal" | "business" | "credit_card" | "unknown";

export type IdType = "itin_only" | "itin_plus_ssn" | "unknown";

export type DeliveryChannel = "api" | "ping_post" | "email";

export interface PartnerConfig {
  id: string;                       // stable slug, logged on every delivery row
  label: string;
  channel: DeliveryChannel;
  products: CanonicalProduct[];     // which products this partner buys
  /** Full US state names this partner accepts. Undefined/empty = nationwide. */
  states?: string[];
  acceptsItinOnly: boolean;         // true = will take a no-SSN (ITIN-only) lead
  requiresSsn: boolean;             // true = needs an SSN present to bid (we don't collect one yet, so these never match)
  requiresConsentCert: boolean;     // true = needs a TrustedForm/Jornaya token on the lead
  /** Canonical LeadInput keys that must be non-empty to send. */
  requiredFields: Array<keyof LeadInput>;
  // ---- runtime config, all resolved from env at send time (never hardcoded) ----
  enableEnv: string;                // must === "true" to activate this partner
  authEnv?: string;                 // env var holding the API key / token
  endpointEnv?: string;             // env var overriding the endpoint URL
  defaultEndpoint?: string;         // fallback endpoint if endpointEnv is unset
  emailToEnv?: string;              // env var holding the intake email (email channel)
  /** Generic API adapter: canonical LeadInput key -> partner's field name. */
  fieldMap?: Partial<Record<keyof LeadInput, string>>;
}

/** Map the form's loanType label (EN or ES) to a canonical product. */
export function productOf(loanType?: string): CanonicalProduct {
  const s = (loanType || "").toLowerCase();
  if (!s) return "unknown";
  if (s.includes("mortgage") || s.includes("home") || s.includes("hipoteca") || s.includes("casa")) return "mortgage";
  if (s.includes("auto") || s.includes("car") || s.includes("vehic")) return "auto";
  if (s.includes("business") || s.includes("negocio")) return "business";
  if (s.includes("credit card") || s.includes("tarjeta")) return "credit_card";
  if (s.includes("personal")) return "personal";
  return "unknown";
}

/** Derive SSN/ITIN status from the form's itin_status band (EN or ES). */
export function idTypeOf(itinStatus?: string): IdType {
  const s = (itinStatus || "").toLowerCase();
  if (!s) return "unknown";
  if (s.includes("ssn") || s.includes("seguro social")) return "itin_plus_ssn";
  if (s.includes("itin") || s.includes("solo itin")) return "itin_only";
  return "unknown";
}

export function hasConsentCert(lead: LeadInput): boolean {
  return Boolean((lead.trustedFormCertUrl || "").trim() || (lead.jornayaLeadId || "").trim());
}

export interface EligibilityResult {
  ok: boolean;
  reason?: string;   // why it was skipped (recorded on a "skipped" delivery row for auditability)
}

/** Pure routing decision — no I/O, no secrets. Given a lead and a partner,
 *  decide whether this lead may be sent to this partner. */
export function isEligible(
  p: PartnerConfig,
  lead: LeadInput,
  product: CanonicalProduct,
  idType: IdType,
): EligibilityResult {
  // Hard gate: every partner here contacts the borrower by phone/text/email, so
  // no lead is ever sent without TCPA express written consent on record.
  if (!lead.tcpaConsent) return { ok: false, reason: "no TCPA consent" };

  if (!p.products.includes(product)) return { ok: false, reason: `product ${product} not bought` };

  if (p.states && p.states.length && lead.state && !p.states.includes(lead.state)) {
    return { ok: false, reason: `state ${lead.state} out of area` };
  }
  // ITIN-only lead going to a partner that won't take no-SSN traffic.
  if (idType === "itin_only" && !p.acceptsItinOnly) return { ok: false, reason: "partner needs SSN; lead is ITIN-only" };
  // Partner needs an SSN to bid. We don't collect SSN yet, so unless the lead is
  // explicitly ITIN+SSN this never matches (kept for when SSN capture is added).
  if (p.requiresSsn && idType !== "itin_plus_ssn") return { ok: false, reason: "partner requires SSN, none present" };

  if (p.requiresConsentCert && !hasConsentCert(lead)) return { ok: false, reason: "missing consent cert (TrustedForm/Jornaya)" };

  const missing = p.requiredFields.filter((k) => !String(lead[k] ?? "").trim());
  if (missing.length) return { ok: false, reason: `missing ${missing.join(", ")}` };

  return { ok: true };
}

// ---------------------------------------------------------------------------
// The registry. Everything here is OFF until its enableEnv is "true" AND its
// secret env is set. Endpoints marked "confirm" are placeholders to be verified
// against the partner's live spec at integration time.
// ---------------------------------------------------------------------------
export const PARTNERS: PartnerConfig[] = [
  {
    id: "engine_moneylion",
    label: "Engine by MoneyLion",
    channel: "api",
    products: ["personal", "auto", "mortgage", "credit_card"],
    acceptsItinOnly: true,          // Engine lead creation is SSN-optional
    requiresSsn: false,
    requiresConsentCert: true,      // Engine requires certified TCPA consent before we send
    requiredFields: ["firstName", "lastName", "email", "phone", "state"],
    enableEnv: "ENGINE_ENABLED",
    authEnv: "ENGINE_API_KEY",
    endpointEnv: "ENGINE_API_URL",
    defaultEndpoint: "https://api.engine.tech/v2/leads", // confirm against Engine partner docs on approval
    fieldMap: {
      firstName: "first_name", lastName: "last_name", email: "email", phone: "phone",
      state: "state", zip: "zip", income: "monthly_income",
    },
  },
  {
    id: "rgr_marketing",
    label: "RGR Marketing (ping-post)",
    channel: "ping_post",
    products: ["mortgage", "auto"],
    acceptsItinOnly: true,
    requiresSsn: false,
    requiresConsentCert: true,
    requiredFields: ["firstName", "lastName", "email", "phone", "state", "zip"],
    enableEnv: "RGR_ENABLED",
    authEnv: "RGR_API_KEY",
    endpointEnv: "RGR_PING_URL",     // ping endpoint; post endpoint via RGR_POST_URL
  },
  {
    id: "apoyo_financiero",
    label: "Apoyo Financiero (email warm-forward)",
    channel: "email",
    products: ["personal"],
    acceptsItinOnly: true,
    requiresSsn: false,
    requiresConsentCert: false,      // email intro to a partner that agreed to receive; no cert token needed
    requiredFields: ["firstName", "lastName", "email", "phone", "state"],
    enableEnv: "APOYO_ENABLED",
    emailToEnv: "APOYO_EMAIL",       // set to contactus@apoyofin.com once a deal is agreed
  },
];
