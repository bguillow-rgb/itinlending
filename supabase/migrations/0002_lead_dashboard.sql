-- Lead Intelligence — dashboard view (M4). Lead joined to its latest validation,
-- including the full raw AI output + per-module reasoning for the detail panel.
create or replace view public.lead_dashboard as
select
  l.id, l.created_at, l.source_site, l.name, l.email, l.phone, l.state, l.loan_type,
  l.amount, l.credit_band, l.income, l.itin_status, l.time_in_business, l.down_payment, l.notes,
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
