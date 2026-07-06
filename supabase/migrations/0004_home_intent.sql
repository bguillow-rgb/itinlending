-- Lead Intelligence — capture home-ownership + buy-timeframe as first-class
-- columns (drives FHA-for-ITIN partner routing). Already arrive in raw_payload;
-- promoting them so they're queryable + shown in the dashboard/email.
alter table public.leads add column if not exists home_status   text;
alter table public.leads add column if not exists buy_timeframe text;

-- Recreate the dashboard view to include them. (Drop first: inserting columns
-- mid-list changes column order, which `create or replace view` rejects.)
drop view if exists public.lead_dashboard;
create view public.lead_dashboard as
select
  l.id, l.created_at, l.source_site, l.name, l.email, l.phone, l.state, l.loan_type,
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
