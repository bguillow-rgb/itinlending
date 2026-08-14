# itin-finance-mcp — the combined MCP server (AEO)

_Created 2026-08-14. Playbook run #4 of the Timberline MCP AEO playbook
(`~/TimberlineVentures/dna-layer/planning/mcp-aeo-playbook.md`), first
content-site property._

## What it is

One MCP server covering all three ITIN sites, giving AI assistants (Claude,
ChatGPT, etc.) direct, citable access to the network's editorial content. The
strategic point: these sites rank 44–95 on Google because crawl budget is
authority-gated, but MCP distribution bypasses domain authority entirely — an
AI engine calls the tool and gets our answer regardless of SERP position.

- **Code**: `mcp-server/` in this repo (TypeScript stdio server, npm
  `itin-finance-mcp`, registry `io.github.bguillow-rgb/itin-finance`).
- **Data flow**: each site's Astro build emits `/api/guides.json`
  (this repo also emits `/api/lenders.json` + `/api/states.json`). The server
  live-fetches with a 15-minute cache, so the 3x/week content pipeline keeps
  the MCP surface fresh with no npm republish.
- **8 bilingual tools**: search_guides, get_guide, faq_lookup,
  find_itin_lenders, get_lender_details, can_i_get_this_loan, itin_state_info,
  how_to_get_an_itin. All read-only, deterministic scoring, `lang: en|es`.

## The lender registry (the crown-jewel dataset)

`web/src/data/lenders.json` — canonical institutions extracted from the
flagship verified-list articles across all three repos, then **re-verified
against each institution's own pages** (full sweep 2026-08-14, seven research
agents). Every entry carries `verdict` (verified_yes / verified_no /
unverified), citation URLs with accessed dates, and our article URLs.

Rules:
- Only `verified_yes` entries are presented as ITIN-accepting; everything else
  is labeled unverified in every tool response (data-integrity rule 5).
- Numeric terms (down payments, APRs, credit minimums) appear ONLY when
  published on the institution's own pages, with the citation.
- Re-verification cadence: quarterly, or when a discrepancy report flags a
  change. The 2026-08-14 sweep found material article errors (see
  `seo/lender-verification-2026-08-14/discrepancies.md`) — the sweep is not
  optional.

## Compliance framing (read before touching tool copy)

Lead generation was shut down 2026-08-11 on multistate-licensing risk. This
server must stay strictly on the publisher side of that line:
- Read-only editorial publishing. No lead capture, no applications, no
  "apply through us", no arranging/steering language.
- Responses link only to our canonical article URLs and to institutions' own
  public pages as citations. **No affiliate links in MCP responses** (Bob,
  2026-08-14) — the CJ links live on-site only.
- Every response carries a disclaimer: educational information, not a lender
  or broker, verify terms with the institution.

## Telemetry

`mcp_call_logs` in the ITIN Supabase project (migration
`supabase/migrations/0007_mcp_call_logs.sql`, applied 2026-08-14): write-only
drop box, anon INSERT with DB CHECK constraints, service-role-only reads,
90-day pg_cron purge. Numbers from this table are **unauthenticated
telemetry** and must be labeled as such in any report.

## Ops

Ship a change: edit `mcp-server/src/`, `npm run build`, bump versions
(package.json + server.json + SERVER_VERSION), commit, sync the public mirror
repo (bguillow-rgb/itin-finance-mcp), republish npm (Bob's passkey) +
`mcp-publisher publish`. The /api endpoints redeploy with the normal site
deploy — no action needed for content-only changes.
