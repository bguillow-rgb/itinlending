# ITIN Lead Intelligence — backend (Supabase)

AI Lead Validation Engine for all three ITIN sites. Validates every submitted lead
**server-side** before it reaches you: scores quality, flags fraud, writes an
executive summary, stores everything, and emails you a ranked internal report. It
**never approves or denies** a loan — it validates and prioritizes.

The applicant experience is unchanged: the form POSTs here, gets `{success:true}`,
and redirects to `/thank-you` exactly as before.

## Layout
```
supabase/
  config.toml                     # lead function is public (verify_jwt=false)
  migrations/0001_lead_intelligence.sql   # leads + lead_validations (+ view), RLS on
  functions/
    lead/index.ts                 # POST endpoint: validate -> DB -> engine -> LLM -> store -> email
    _shared/
      types.ts                    # TypeScript interfaces
      engine.ts                   # deterministic scoring engine (validateLead) — the brain
      engine.test.ts              # unit tests (deno test)
      llm.ts                      # grounded LLM executive summary (Anthropic) + timeout/fallback
      email.ts                    # scored internal email (Resend) + failsafe template
```

## How it works
```
form submit -> /functions/v1/lead
  1. parse + honeypot + required-field guard
  2. INSERT into leads            (must succeed; else 500)
  --- from here, failsafe: lead is saved, nothing else can fail the request ---
  3. duplicate check (phone/email already on file)
  4. validateLead()               deterministic 0-100 score + modules + flags
  5. llmExecutiveSummary()         grounded prose; 6s timeout -> template fallback
  6. INSERT into lead_validations (structured + raw JSON, ML-ready)
  7. send internal email          scored; if pipeline threw -> "AI Unavailable" email
  8. return { success: true }
```

## Deploy
```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push                                   # applies migrations
supabase secrets set --env-file supabase/.env      # from .env.example
supabase functions deploy lead --no-verify-jwt
```
The function URL will be:
`https://<project-ref>.functions.supabase.co/lead`  (or `.../functions/v1/lead`)

## Cut the form over (the ONLY app change — zero applicant impact)
Set each site's build env var to the function URL and clear the Web3Forms key:
```
PUBLIC_LEAD_ENDPOINT=https://<project-ref>.functions.supabase.co/lead
PUBLIC_WEB3FORMS_KEY=        # leave empty
```
`web/src/components/LeadForm.astro` already POSTs to `PUBLIC_LEAD_ENDPOINT` and
expects `{success:true}` — no code change. Rebuild + redeploy `/docs`. The form,
fields, and thank-you redirect are identical for the applicant.

## Test
```bash
deno test supabase/functions/_shared/                     # engine unit tests (12)
# smoke-test the endpoint:
curl -X POST https://<project-ref>.functions.supabase.co/lead \
  -H 'content-type: application/json' \
  -d '{"name":"Maria Gonzalez","email":"maria@gmail.com","phone":"737-368-1530","state":"Texas","loanType":"Personal loan","amount":"Under $5,000","score":"620-680","income":"$4,000-$6,000","itin_status":"ITIN only"}'
```

## Scoring (owner-specified weights)
Identity & Contactability 25% · Financial Plausibility 25% · Consistency 20% ·
Fraud Indicators 20% · Completeness 10%. Fraud can hard-cap the grade (Critical→F).
Financial plausibility is weight-neutral for card/score leads (no loan amount).
**Funding Probability** is a separate, ML-only score — shown as "not yet available"
until historical lender outcomes (the `future_*` columns) accumulate.

## Not in this MVP (next milestones)
M4 Lead Intelligence dashboard · M5 pluggable integrations (OFAC, disposable-email/
phone APIs, IP/velocity/device, Plaid, Socure) · M6 explicit 3-site rollout config.
