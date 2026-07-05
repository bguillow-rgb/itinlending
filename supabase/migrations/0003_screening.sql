-- Lead Intelligence M5 — screening infrastructure.
-- OFAC SDN individuals list (refreshed by scripts/load-sdn.sh). Name-only
-- matching is a FLAG for manual review, never an auto-decline: name-similarity
-- alone has high false-positive rates (especially for common Hispanic names);
-- OFAC compliance requires human verification against DOB/identifiers.

create table if not exists public.sdn_names (
  ent_num   integer primary key,
  name      text not null,
  name_norm text not null            -- lowercased, punctuation stripped
);
create index if not exists sdn_name_norm_idx on public.sdn_names (name_norm);

alter table public.sdn_names enable row level security;
-- no public policies: service-role only (edge function + loader).

comment on table public.sdn_names is
  'OFAC SDN list, individuals only. Source: treasury.gov sdn.csv. Loaded by supabase/scripts/load-sdn.sh. Name-match = manual-review flag, never auto-decline.';
