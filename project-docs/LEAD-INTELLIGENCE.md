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

## Roadmap (not in MVP)
- **M4** "Lead Intelligence" admin dashboard (view/sort/filter/search, raw output, CSV/Excel export, funded-vs-declined comparison).
- **M5** pluggable integrations: OFAC screening, disposable-email/phone-carrier APIs, IP/velocity/device fingerprint, Plaid, Socure/Persona/SentiLink.
- **M6** explicit 3-site rollout config + per-site tuning.
- ML **Funding Probability** once enough labeled outcomes exist.
