# Lead Router — target list, form audit, and build plan

Status: **BUILT (dormant) — 2026-07-12.** Form + router + adapters shipped; wired
into the live function but OFF until env switches are set. Created 2026-07-12.
Pairs with `LEAD-PARTNERS.md` (who we sell to) and the live Supabase function at
`supabase/functions/lead/index.ts` (what receives leads today).

## Build status (2026-07-12)
The delivery layer is implemented and inert. What shipped:
- **Form:** `LeadForm.astro` now collects `first_name` + `last_name` (split) and an
  optional `zip`, plus empty `xxTrustedFormCertUrl` / `universal_leadid` hidden
  fields ready for the consent scripts. EN + ES verified in the browser.
- **Server:** `_shared/types.ts` (new fields), `lead/index.ts` composes `name`,
  stores `first_name`/`last_name`/`zip`, and calls `deliverLead()` after the email.
- **Router:** `_shared/partners.ts` (registry + eligibility) and
  `_shared/delivery.ts` (router + API / ping-post / email adapters + logging).
- **DB:** migration `0005_lead_delivery.sql` adds the columns, the `lead_deliveries`
  log table, and refreshes `lead_dashboard`.
- **Config:** `supabase/.env.example` documents every switch.

### How to turn a partner ON (runbook)
Nothing sends until BOTH switches are true AND the partner's secret is set:
1. Apply and get approved by the partner; obtain the API key / posting URL (or
   agree an intake email for the email channel).
2. `supabase secrets set` the partner's key + endpoint (e.g. `ENGINE_API_KEY`,
   `ENGINE_API_URL`), set its `*_ENABLED=true`, and set `LEAD_DELIVERY_ENABLED=true`.
3. For any partner with `requiresConsentCert` (Engine, RGR), the lead ALSO needs a
   live TrustedForm/Jornaya token or the router skips it — add those scripts first.
4. Confirm each partner's exact field spec and flip its `fieldMap`/`defaultEndpoint`
   in `partners.ts` to match before enabling. Endpoints marked "confirm" are
   placeholders.
Every attempt (including skips, with the reason) is logged to `lead_deliveries`.

---

## 0. The reality that shapes everything: "API to all of them" isn't the model

The ask was "pipe leads into all these partner APIs, send to as many as we can."
The honest constraint, from the research:

- **The lenders worth the most for ITIN traffic mostly do NOT expose a lead API.**
  ITIN mortgage lenders take referrals through **broker/TPO portals**; ITIN auto
  goes through **dealer CRMs**; personal/ITIN lenders take **email or phone**. There
  is no public "POST a lead" endpoint for Oportun, Apoyo, Acra, Angel Oak, Lendbuzz,
  Carrington, etc.
- **The players WITH real lead APIs are the aggregator networks** — Round Sky,
  LeadsMarket, LeadNetwork, Engine/MoneyLion. Those underwrite on **SSN + credit
  pull** and reject pure-ITIN leads at the field level (Engine's spec literally
  blocks any SSN starting 900–999, which is every ITIN).

**Conclusion — build a multi-channel lead router, not an API fan-out.** For each
lead it decides *who* to send to and *how*:

1. **API POST** — to aggregators (monetizes your **SSN** leads) and to the few
   ITIN buyers that expose an endpoint (routers like Dream Home Financing; CRM-based
   auto like CarsDirect Spanish-Market).
2. **Automated email warm-forward** — to ITIN-native buyers with no API. This is
   just automating the warm-forward template already in `LEAD-PARTNERS.md`. **It
   needs no partner integration and can go live first.**
3. **Ping-post** — for aggregators that auction (ping for bids → post to winner).

This means your best leads (ITIN) monetize through channel 2 on day one, while the
API/ping-post channels (1 and 3) come online as consent infra + approvals land.

---

## 1. Target lenders (the list)

### Track A — API / aggregator buyers (for your SSN leads)
These have real programmatic ingestion. Apply once consent infra is live.

| Partner | Products | Delivery | ITIN? | Notes |
|---|---|---|---|---|
| **Round Sky** | Payday, personal | API + fallback widgets | SSN | Fastest onramp; widgets earn while API pending |
| **LeadsMarket** | Payday, personal, car-title, installment | API (ping-post) | SSN | One publisher acct, multi-product |
| **LeadNetwork** | Payday, personal | API (ping-post) | SSN | Large panel |
| **Engine by MoneyLion** | Personal, cards | REST API | **SSN only (900–999 blocked)** | Best credit-card channel; most mature API |
| **Dream Home Financing** | ITIN mortgage | Form/API-ish router | **ITIN** | Dedicated ITIN router — places borrowers; wire once relationship opens |

### Track B — ITIN-native buyers (the moat; mostly email/portal delivery)
This is where your ITIN traffic is worth more than commodity leads. Delivery column
is the honest mechanism — most are **email**, not API.

**Mortgage (non-QM ITIN)**
| Partner | Delivery | Verified contact |
|---|---|---|
| Carrington Wholesale *(top pick)* | Portal/email | `wholesalecontact@carringtonms.com` · 866-453-2400 |
| BuildBuyRefi (Federal Savings Bank) | Email | `info@buildbuyrefi.com` · 844-999-0639 |
| Acra Lending | Portal/phone | 888-800-7661 |
| Angel Oak Mortgage Solutions | Broker portal | angeloakms.com |
| A&D Mortgage | Broker portal | admortgage.com |
| Champions Funding ("ITIN for the Win") | TPO portal | champstpo.com |
| Gustan Cho Associates (NEXA) | Email | `alex@gustancho.com` · 800-900-8569 |
| McGowan Mortgages | Email | `info@mcgowanmortgages.com` |
| Non-Prime Lenders (United Mortgage) | Email | `info@nonprimelenders.com` |
| New American Funding | LO/phone | newamericanfunding.com |
| NMHL | Form/phone | nmhl.us/contact · 248-864-2200 |

**Auto (ITIN)**
| Partner | Delivery | Notes |
|---|---|---|
| **CarsDirect Spanish-Market** *(best-fit)* | **CRM/API (real-time)** | Lead spec has explicit **ITIN + SSN fields**; delivers to CRM/portal in real time — a genuine automated-feed candidate |
| Lendbuzz | Dealer-partnership / phone | 857-999-0250 |
| HispanicAutoLeads.com | Email/portal | Hispanic auto buyer |
| Lead Answer (Hispanic live-transfer) | Live transfer | |
| Local BHPH ITIN dealers | Email | Westway Ford (TX), Mossy (CA), etc. |

**Personal / installment (ITIN)**
| Partner | Delivery | Contact |
|---|---|---|
| Oportun | Partner inquiry / phone | oportun.com |
| Apoyo Financiero | Email | `contactus@apoyofin.com` · 800-891-2778 |
| Lendmark Financial | Form | lendmark.com |
| Embold Credit Union | Form/phone (**6 OR counties only**) | emboldcu.org |

**Business (ITIN)** — thin; research ongoing (ITIN business lenders / CDFIs).

**Cards (affiliate, not lead sale — CC/CS sites)**: Self Financial (live affiliate
~$12/acct), Firstcard, OpenSky, Capital One secured. Route via CJ affiliate, not the
lead router.

---

## 2. Form audit — what buyers require vs. what we collect

**Today the form collects** (`LeadForm.astro`): `name` (single field), `phone`,
`email`, `loanType`, `state`, `home_status`, `buy_timeframe`; full variant adds
`amount`, `score`, `income`, `itin_status` (SSN vs ITIN), `time_in_business`,
`down_payment`, `notes` — all bands, not raw values. Hidden: UTM/source/referrer.
Backend: Supabase function saves + scores + emails. **No address, no DOB, no SSN, no
TrustedForm/Jornaya, no TCPA checkbox.**

### Gap matrix (what each buyer type needs that we're missing)

| Field | Have? | Aggregator API (payday/personal) | ITIN mortgage | ITIN auto (CarsDirect) |
|---|---|---|---|---|
| First / Last name (split) | ❌ single `name` | **Required** | Required | Required |
| Email / Phone | ✅ | Required | Required | Required |
| Street address | ❌ | **Required** | Required (property + mailing) | Required |
| City | ❌ | **Required** | Required | Required |
| State | ✅ | Required | Required | Required |
| ZIP | ❌ | **Required** | **Required** (property ZIP) | Required |
| Date of birth | ❌ | **Required** (credit pull) | Often required | Sometimes |
| SSN | ❌ | **Required to get a bid** | n/a (ITIN track) | ITIN or SSN field |
| ITIN / id_type flag | ✅ `itin_status` | (excludes ITIN) | Required | Required |
| Income (numeric) | ⚠️ banded | **Required, often numeric** | Band OK | Numeric preferred |
| Employment: pay freq, next payday, employer, direct deposit | ❌ | **Required (payday)** | Some | Some |
| Credit band | ✅ `score` | Helpful | Required | Required |
| Loan amount | ✅ banded | Numeric preferred | Required | n/a |
| Down payment | ✅ (mortgage) | n/a | Required | n/a |
| Purchase vs refinance | ❌ | n/a | **Required** | n/a |
| Vehicle / trade-in | ❌ | n/a | n/a | Helpful |
| **TrustedForm cert URL** | ❌ | **Hard requirement** | Increasingly required | Required |
| **Jornaya LeadiD** | ❌ | **Hard requirement** | Sometimes | Sometimes |
| **TCPA express-consent checkbox** (names buyer) | ❌ (implied text only) | **Hard requirement** | Recommended | Recommended |
| CCPA "Do Not Sell/Share" | ❌ | Required for CA | Required for CA | Required for CA |

### The must-close list (ranked)
1. **TrustedForm + Jornaya scripts + cert capture** — no API buyer accepts a lead
   without these. Blocks all of Track A.
2. **TCPA express-written-consent checkbox** naming partner lenders. Blocks scaled
   call/text delivery; big legal exposure without it.
3. **Split name → `first_name` / `last_name`.** Trivial, universally required.
4. **Full address (street, city, ZIP).** Required by every API buyer + mortgage.
5. **DOB.** Required for any credit-pull buyer.
6. **SSN capture on the final step** (SSN/aggregator track only) — with the PII
   handling in §4. Without it, aggregators return zero bids.
7. **Numeric income + numeric loan amount** (keep bands as fallback).
8. **Employment block** (pay frequency, next pay date, employer, direct-deposit) —
   product-gated to payday/personal, shown only when relevant.
9. **Purchase-vs-refi** toggle for mortgage.
10. **CCPA opt-out** mechanism + link.

Already good: `itin_status` id-flag (the routing key) ✅, source/UTM attribution ✅,
consent disclosure text + Terms lead-sale disclosure ✅, honeypot + OFAC + scoring ✅.

---

## 3. Implementation plan (phased, builds on the Supabase function)

### Phase 0 — Compliance gate (BLOCKS any live API sending)
Legal-eagle pass done 2026-07-12; verdict **Tighten** (four must-fix items).
**Implemented 2026-07-12:**
- ✅ **TCPA express-consent checkbox** — required, unchecked, names this site + the
  linked partner list, authorizes autodialed/prerecorded calls + texts, states
  "consent is not a condition of any purchase." EN + ES. Stored per lead
  (`tcpa_consent`), and the router **refuses to deliver any lead without it**
  (`partners.ts::isEligible` hard gate).
- ✅ **TrustedForm capture** — client script gated on `PUBLIC_TRUSTEDFORM_ENABLED`,
  populates `xxTrustedFormCertUrl`; Jornaya `universal_leadid` field ready. Cert
  URLs stored per lead. (Turn on once the ActiveProspect account exists.)
- ✅ **Named partner list** — `/partners` (+ `/es/partners`), linked from the
  consent line and footer.
- ✅ **CCPA "Do Not Sell or Share My Personal Information"** — `/do-not-sell`
  (+ ES), footer link both locales, honors the browser **Global Privacy Control**
  signal, email opt-out.
- ✅ Free-text `notes` is **never** forwarded to buyers (not in any adapter payload).

**Still required before flipping live (owner: Bob / counsel):**
- TrustedForm/Jornaya **accounts** + turn on `PUBLIC_TRUSTEDFORM_ENABLED`.
- **Lawyer sign-off** on the exact TCPA wording + whether to hard-require the box;
  CCPA "sale" 50%-revenue-prong classification; state lead-gen/mortgage licensing.
- **Buyer contracts** repping consent-scope + downstream TCPA/UDAAP compliance.
- **Suppression list** populated (opt-outs/DNC) — the router gate exists; feed it.
- **GLBA written info-security program** (WISP).
- **Nothing sells to an API buyer until the above is done.** Email warm-forward to
  ITIN buyers can proceed in parallel (lower risk, human-reviewed).

### Phase 1 — Form completeness (conversion-safe)
- Split name; add address (street/city/ZIP), DOB, purchase-vs-refi, employment block.
- Keep it a **multi-step form**: contact + loanType + state first (so an abandon is
  still a sellable/contactable lead), identity/SSN/DOB on the **last** step.
- Add **numeric** income + amount inputs (retain bands as fallback).
- Extend `LeadInput` type + Supabase `leads` columns for the new fields.

### Phase 2 — Router core (inside the Supabase function)
- **Partner registry** — one config object per partner:
  `{ id, products[], accepts_itin, accepts_ssn, states[], delivery:'api'|'email'|'ping_post', endpoint, auth, field_map, required_fields, floor_price, exclusive:bool }`.
- **Routing engine** — after scoring, select eligible partners by
  `id_type × product × state × required-fields-present`, honoring exclusive vs
  non-exclusive (see decision D1).
- **Field mapper** — transform canonical lead → each partner's schema.
- **Suppression** — CCPA opt-outs, dupes, OFAC hits never route.

### Phase 3 — Delivery adapters
- **Email warm-forward adapter** *(ship FIRST — no approval needed)*: renders the
  warm-forward template, emails the matched ITIN buyer, logs it. Live day one.
- **API adapter**: generic authenticated POST + per-partner mapping + response
  parse (accepted/rejected/price). Wire 1–2 approved partners first.
- **Ping-post adapter**: ping eligible aggregators → collect bids → post to the
  winner → capture price. For Track A auction networks.

### Phase 4 — Tracking & reconciliation
- Log every delivery attempt: partner, channel, status, price, timestamp, cert.
- Accept/reject + payout reconciliation; extend the existing `dashboard` function
  with a partner-performance + revenue view. Feeds the daily report.

### Phase 5 — Get approved / go live
- Submit publisher applications to Round Sky, LeadsMarket, Engine (needs live
  consent infra + traffic description + privacy policy — most already in place).
- Turn on email warm-forward to Track B **now** (Apoyo, Carrington, Lendbuzz,
  CarsDirect first — verified contacts).

### Build vs. buy
Extend the **existing Supabase function** — it already has scoring, OFAC, dedup,
email, dashboard. Don't buy boberdoo/LeadsPedia/Phonexa yet. Revisit a platform only
once you're running real ping-post volume across many API buyers and need their
built-in TrustedForm/billing/exclusivity tooling.

### Recommended sequencing
Phase 0 (consent) + Phase 1 (fields) run together → Phase 3 **email adapter live
first** (monetizes ITIN leads immediately, zero partner dependency) → Phase 2 router
+ Phase 3 API/ping-post as aggregator approvals land.

---

## Decisions (settled 2026-07-12)
- **D1 — Non-exclusive.** Sell each lead to multiple matched buyers; router fans out
  to all eligible partners. Consent language must name "partner lenders" (plural) and
  the TCPA checkbox must cover multi-buyer contact.
- **D2 — SSN is optional, ITIN number is NOT collected.** Most borrowers have no SSN.
  ITIN-native buyers only need borrower profile (name, contact, state, purpose,
  amount, income, credit band) — **not the ITIN digits** — so we never collect or
  transmit the ITIN number (kills the biggest PII liability). Add an optional "Do you
  have an SSN?" on the last step; if yes, that lead ALSO routes to the SSN aggregators
  (best/most-lucrative Track A partners). If no, ITIN-track email-forward only.
- **D3 — Email warm-forward ships first**, but gated on the prerequisite below.

## The prerequisite the email adapter depends on
An automated forward only works **after a partner agrees to receive leads.** Emailing
borrower PII to a lender who never opted in gives leads away for free / is unsolicited.
So the true first step is **closing 1–3 lead-buying agreements** (per-lead price +
delivery method), using the outreach template in `LEAD-PARTNERS.md`.

- **Verified intake emails (ready on "yes"):** Apoyo Financiero
  `contactus@apoyofin.com`, Carrington `wholesalecontact@carringtonms.com`,
  BuildBuyRefi `info@buildbuyrefi.com`, Gustan Cho `alex@gustancho.com`, McGowan
  `info@mcgowanmortgages.com`, Non-Prime Lenders `info@nonprimelenders.com`.
- **Form/phone only (can't auto-email yet):** Acra, Angel Oak, Champions, Oportun,
  Lendbuzz, NMHL — need a confirmed intake email or portal first.
- **Real API/CRM feed candidate:** CarsDirect Spanish-Market (ITIN+SSN).

## Revised form gaps given D2 (ITIN number NOT collected)
Drop "collect ITIN number" entirely. For the **ITIN email-forward track**, the only
new must-adds are: split first/last name, city + ZIP (for buyer matching/geo), and
an optional SSN field on the last step (routes SSN-holders to Track A). Full address
+ DOB + TrustedForm/Jornaya/TCPA become required only once we turn on the **API/SSN
aggregator** track — they don't block launching ITIN email-forward to a consented
partner.
