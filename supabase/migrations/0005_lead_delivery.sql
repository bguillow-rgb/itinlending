-- Lead delivery — promote split name + ZIP to first-class columns, and add the
-- lead_deliveries log (one row per partner send attempt) so we can reconcile
-- payouts and audit exactly where each lead went.

-- 1) New lead columns. They already arrive in raw_payload; promoting them so
--    they're queryable and shown in the dashboard/email.
alter table public.leads add column if not exists first_name text;
alter table public.leads add column if not exists last_name  text;
alter table public.leads add column if not exists zip        text;

-- 2) Delivery log. Every partner send attempt is recorded here, including the
--    ones we deliberately skipped (with the eligibility reason) for auditability.
create table if not exists public.lead_deliveries (
  id              uuid primary key default gen_random_uuid(),
  lead_id         uuid not null references public.leads(id) on delete cascade,
  partner_id      text not null,               -- registry slug, e.g. engine_moneylion
  channel         text not null,               -- api | ping_post | email
  status          text not null,               -- sent | accepted | rejected | error | skipped
  accepted        boolean,
  price           numeric(12,2),               -- payout / winning bid, when the partner returns one
  reason          text,                        -- skip/error reason
  http_status     int,
  request_payload jsonb,
  response_body   jsonb,
  created_at      timestamptz not null default now()
);
create index if not exists lead_deliveries_lead_id_idx on public.lead_deliveries(lead_id);
create index if not exists lead_deliveries_partner_idx  on public.lead_deliveries(partner_id, created_at desc);

-- 3) Recreate the dashboard view to surface the new lead columns. (Drop first:
--    inserting columns mid-list changes column order, which
--    `create or replace view` rejects.)
drop view if exists public.lead_dashboard;
create view public.lead_dashboard as
select
  l.id, l.created_at, l.source_site, l.name, l.first_name, l.last_name, l.email, l.phone,
  l.state, l.zip, l.loan_type,
  l.amount, l.credit_band, l.income, l.itin_status, l.time_in_business, l.down_payment, l.notes,
  l.home_status, l.buy_timeframe,
  l.utm_source, l.utm_medium, l.utm_campaign, l.ip,
  v.validation_score, v.validation_grade, v.priority, v.identity_status, v.completeness_score,
  v.consistency_status, v.financial_plausibility, v.fraud_risk, v.executive_summary,
  v.flags, v.reasoning, v.raw_ai_output, v.summary_source, v.model_used,
  v.validation_duration_ms, v.created_at as validated_at,
  v.future_funded, v.future_declined, v.future_default, v.future_notes
from public.leads l
left join lateral (
  select * from public.lead_validations v2 where v2.lead_id = l.id order by v2.created_at desc limit 1
) v on true;
