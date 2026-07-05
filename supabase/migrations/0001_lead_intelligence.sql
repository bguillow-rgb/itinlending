-- Lead Intelligence — schema (M1)
-- Two tables: raw leads + AI validation reports. Designed so historical outcomes
-- (funded/declined/default) can train future scoring. RLS is ON with no public
-- policies: only the Edge Function (service-role key) writes; the dashboard reads
-- via authenticated access added later.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- leads: one row per form submission, across all three sites.
-- raw_payload preserves EVERY submitted field (incl. future/unknown ones) so new
-- form fields never require a schema change.
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  submitted_at      timestamptz,
  source_site       text,                         -- itinlending.net | itincreditcard.com | itincreditscore.com
  name              text,
  email             text,
  phone             text,
  state             text,
  loan_type         text,
  amount            text,                          -- banded
  credit_band       text,
  income            text,                          -- banded monthly
  itin_status       text,
  time_in_business  text,
  down_payment      text,
  loan_purpose      text,
  notes             text,
  -- server-captured metadata
  ip                inet,
  user_agent        text,
  referrer          text,
  landing_page      text,
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,
  raw_payload       jsonb not null default '{}'::jsonb   -- every field verbatim
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx       on public.leads (lower(email));
create index if not exists leads_phone_idx       on public.leads (phone);
create index if not exists leads_state_idx       on public.leads (state);
create index if not exists leads_loan_type_idx   on public.leads (loan_type);
create index if not exists leads_source_idx      on public.leads (source_site);

-- ---------------------------------------------------------------------------
-- lead_validations: one AI validation report per lead (versioned; a lead can be
-- re-validated as the engine improves, so this is 1-to-many).
-- ---------------------------------------------------------------------------
create table if not exists public.lead_validations (
  id                    uuid primary key default gen_random_uuid(),
  lead_id               uuid not null references public.leads(id) on delete cascade,
  created_at            timestamptz not null default now(),

  -- headline scores (structured for sort/filter in the dashboard)
  validation_score      integer,                  -- 0-100
  validation_grade      text,                     -- A+ .. F
  priority              text,                     -- ★ stars
  identity_status       text,                     -- PASS/WARNING/FAIL
  completeness_score    integer,                  -- %
  consistency_status    text,
  financial_plausibility text,                    -- Very Strong .. Very Weak | Insufficient | N/A
  fraud_risk            text,                     -- Low/Medium/High/Critical
  executive_summary     text,

  -- full structured detail + raw model output (audit + ML features)
  flags                 jsonb not null default '[]'::jsonb,
  reasoning             jsonb not null default '{}'::jsonb,   -- per-module reasoning
  raw_ai_output         jsonb not null default '{}'::jsonb,   -- complete engine + LLM output

  -- provenance
  validation_version    text,
  prompt_version        text,
  model_used            text,
  summary_source        text,                     -- 'llm' | 'template'
  validation_duration_ms integer,
  validation_errors     jsonb not null default '[]'::jsonb,

  -- FUTURE OUTCOMES (populated later by you / partner feedback -> trains ML)
  future_outcome        text,                     -- free-form status label
  future_funded         boolean,
  future_approved       boolean,
  future_declined       boolean,
  future_default        boolean,
  future_notes          text
);

create index if not exists lv_lead_id_idx    on public.lead_validations (lead_id);
create index if not exists lv_score_idx       on public.lead_validations (validation_score desc);
create index if not exists lv_grade_idx       on public.lead_validations (validation_grade);
create index if not exists lv_fraud_idx       on public.lead_validations (fraud_risk);
create index if not exists lv_created_idx     on public.lead_validations (created_at desc);

-- Convenience view for the dashboard: latest validation joined to its lead.
create or replace view public.lead_intelligence as
select
  l.*,
  v.validation_score, v.validation_grade, v.priority, v.identity_status,
  v.completeness_score, v.consistency_status, v.financial_plausibility, v.fraud_risk,
  v.executive_summary, v.flags, v.summary_source, v.model_used, v.created_at as validated_at,
  v.future_funded, v.future_declined, v.future_default
from public.leads l
left join lateral (
  select * from public.lead_validations v2
  where v2.lead_id = l.id
  order by v2.created_at desc
  limit 1
) v on true;

-- ---------------------------------------------------------------------------
-- RLS: locked down. Service-role (Edge Function) bypasses RLS and can write.
-- No anon/public policies -> the tables are private until the dashboard adds
-- authenticated read policies.
-- ---------------------------------------------------------------------------
alter table public.leads enable row level security;
alter table public.lead_validations enable row level security;
