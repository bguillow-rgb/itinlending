-- Lead consent — capture the TCPA express-written-consent checkbox and the
-- certified-consent tokens (TrustedForm / Jornaya) as first-class columns so the
-- consent paper trail is queryable and lives next to the lead it belongs to.
-- Delivery is blocked unless tcpa_consent is true (see _shared/partners.ts).
alter table public.leads add column if not exists tcpa_consent          boolean not null default false;
alter table public.leads add column if not exists trusted_form_cert_url text;
alter table public.leads add column if not exists jornaya_lead_id       text;

-- Surface consent on the dashboard so a reviewer can see, per lead, whether it
-- carried consent + a certificate before it was ever eligible for delivery.
drop view if exists public.lead_dashboard;
create view public.lead_dashboard as
select
  l.id, l.created_at, l.source_site, l.name, l.first_name, l.last_name, l.email, l.phone,
  l.state, l.zip, l.loan_type,
  l.amount, l.credit_band, l.income, l.itin_status, l.time_in_business, l.down_payment, l.notes,
  l.home_status, l.buy_timeframe,
  l.tcpa_consent, l.trusted_form_cert_url, l.jornaya_lead_id,
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
