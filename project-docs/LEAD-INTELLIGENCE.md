# Lead Intelligence — AI Lead Validation Engine

Server-side AI validation for every lead submitted on any of the three ITIN sites.
It validates the submission, flags fraud indicators, scores lead quality 0–100, writes
an executive summary, stores everything (ML-ready), and emails a ranked internal
report. **It never approves or denies a loan** — validation/prioritization only.

**Code + full deploy guide:** `~/Itin/supabase/` (see `supabase/README.md`).
**Reference prototype + scored output of the first 27 leads:** `reports/lead-engine/`
(`validate.py`, `scored-leads.json`, `lead-scores-report.md`).

## Why it exists / where it sits
The sites are static Astro on GitHub Pages — no server. Today the form POSTs straight
to Web3Forms (email relay). This adds a Supabase Edge Function between the form and
the email: `form → /functions/v1/lead → validate → DB → engine → LLM summary → store →
internal email`. The applicant sees zero difference (same form, same thank-you redirect).

## Architecture (MVP = milestones M0–M3)
- **M0 Engine** (`supabase/functions/_shared/engine.ts`) — deterministic `validateLead()`.
  The score is deterministic (reproducible, testable, ML-ready); the LLM only writes prose.
- **M1 Backend** (`functions/lead/index.ts` + `migrations/0001_lead_intelligence.sql`) —
  Supabase Edge Function + Postgres (`leads`, `lead_validations`, `lead_intelligence` view).
- **M2 LLM summary** (`_shared/llm.ts`) — grounded Anthropic call, 6s timeout, template fallback.
- **M3 Email** (`_shared/email.ts`) — scored internal email + "AI Unavailable" failsafe.

**Failsafe:** the lead is always saved and an email always sent; AI/LLM/email failures
degrade gracefully. Lead processing never fails because AI fails.

## Scoring (owner-specified, 2026-07-05)
| Module | Weight | Measures |
|---|---|---|
| Identity & Contactability | 25% | can we reach them? (email/phone valid, area↔state, dup, reachability) |
| Financial Plausibility | 25% | is the ask reasonable vs income/credit? (estimate only) |
| Application Consistency | 20% | do the answers agree? (contradictions) |
| Fraud Indicators | 20% | fake/dup/test/suspicious signals (Low→Critical; can hard-cap grade) |
| Application Completeness | 10% | enough info to follow up? |

Overall 0–100 → grade (A+…F) → priority (HIGH/MEDIUM/LOW/DISQUALIFIED). Financial
plausibility is **weight-neutral for card/score leads** (no loan amount to assess).
A **"Lead-Quality Confidence %"** (rules-based, labeled as such) accompanies the score.

**Funding Probability** is a *separate* score, deliberately **not calculated yet** —
shown as "Not yet available (requires historical lender outcome data)." The
`lead_validations.future_funded/declined/default` columns collect outcomes to train it.
This is the intended long-term differentiator (outcome-based, not rules-based).

## Cutover (one env change per site, no code change)
`PUBLIC_LEAD_ENDPOINT` → the function URL; clear `PUBLIC_WEB3FORMS_KEY`. `LeadForm.astro`
already POSTs to `PUBLIC_LEAD_ENDPOINT`. Rebuild `/docs`.

## M4 — dashboard (LIVE 2026-07-05)
`functions/dashboard/index.ts` = JSON data API (CORS, access-code gated; the service
role never reaches the browser — Supabase forces text/plain+sandbox CSP on function
responses, so the UI can't be served from a function). UI = `admin/lead-intelligence.html`
(open locally, e.g. `cd admin && python3 -m http.server 8765`). Access code lives in the
`DASHBOARD_ACCESS_CODE` Supabase secret. View: `migrations/0002_lead_dashboard.sql`.

## M5 — server-side screening signals (LIVE 2026-07-05, engine v1.1.0)
Gathered per-lead in the edge function (parallel, best-effort — a failed check
contributes nothing rather than blocking), passed into `validateLead(lead, dup, signals)`:
- **OFAC SDN name screen** — `sdn_names` table (7,495 individuals, INDIVIDUAL rows of
  treasury.gov `sdn.csv`), loaded/refreshed by `supabase/scripts/load-sdn.sh` (re-run
  monthly). Match = first+last token both in a normalized SDN name → **manual-review
  FLAG at Medium fraud, never an auto-decline** (name-only matching false-positives
  heavily on common Hispanic names; verify DOB before acting).
- **MX validation** — `Deno.resolveDns(domain,"MX")`, 1.8s timeout. No MX → identity
  −45 + Medium fraud; timeout/unavailable → no penalty.
- **Velocity** — prior-24h submissions sharing IP / email / phone. IP: ≥2→Medium,
  ≥4→High, ≥6→Critical. Email/phone repeats: ≥1→Medium, ≥3→High.
- **Expanded disposable-email list** (~70 domains + aliases).
All verified live post-deploy (disposable/MX/SDN/velocity each fired correctly);
synthetic test leads deleted afterward.

## Roadmap (remaining)
- **M6** per-site tuning config (three sites already share the backend via `source_site`).
- Paid-vendor integrations when volume justifies: Plaid (bank/cash-flow), Socure/Persona
  (doc/ITIN verify), SentiLink (synthetic ID), phone-carrier + email-reputation APIs.
- ML **Funding Probability** once enough labeled outcomes exist (`future_*` columns).
- SDN refresh automation (cron the loader; currently manual re-run).
