# Changelog

**Append a dated entry here on every unit of work** (newest at top). This is part
of the documentation rule in the root `CLAUDE.md` — if a change isn't logged here
and reflected in the relevant doc, the task isn't done.

Format:
```
## YYYY-MM-DD — short title
- What changed and why.
- Docs updated: <which project-docs file(s)>.
- Follow-ups / open items: <if any>.
```

---

## 2026-06-06 — Instrument event tracking on all 3 sites + analytics plan
- Audit finding: no analytics were live — GA4 wired but `PUBLIC_GA4_ID` unset on
  all 3 sites; zero custom events.
- Added centralized, delegated event tracking to `web/src/components/Analytics.astro`
  (identical file copied to all 3 repos): `window.itrack()` + events
  `lead_form_start`, `generate_lead`, `thank_you_view`, `affiliate_click`,
  `cta_click`. No-ops until GA4 is turned on; needs no edits to bespoke components.
- Added `project-docs/ANALYTICS-PLAN.md`: event table, KPIs, and the daily report
  architecture. Decisions: iMessage @ 6am local, 3 separate GA4 properties, GA4 +
  AdSense, GitHub Actions cron for the data pull + a local launchd job for the
  iMessage send (cloud CI cannot send iMessage).
- Affects: all 3 repos (Analytics.astro). Docs: ANALYTICS-PLAN.md (new), README.
- Follow-ups (blocked on user): 3 GA4 Measurement+Property IDs, GA4 Data API
  service account, AdSense OAuth refresh token, iMessage recipient. Then build
  `daily-report.mjs` + `daily-report.yml` + the launchd sender.

## 2026-06-06 — Document all three sites + cross-repo doc pointers
- Confirmed the family is THREE real, separate repos (not "planned"): ITIN Lending
  (`~/Itin`, itinlending.net), ITIN Credit Card (`~/ITINCreditCard`,
  itincreditcard.com), ITIN Credit Score (`~/ITINCreditScore`, itincreditscore.com).
- Added `project-docs/SITES.md` (per-site domains, repos, folders, money-page
  topology, shared-vs-per-site, the generator's vertical branching).
- Updated README, ROADMAP, and root CLAUDE.md to name all three sites concretely
  and point at SITES.md; `~/Itin/project-docs/` is the central docs hub for all 3.
- Added pointer `CLAUDE.md` to `~/ITINCreditCard` and `~/ITINCreditScore` so agents
  there load the documentation rule and find the hub.
- Docs updated: SITES.md (new), README.md, ROADMAP.md, root CLAUDE.md, two sibling
  CLAUDE.md.

## 2026-06-06 — Establish internal docs + documentation rule
- Created `project-docs/` (README, ARCHITECTURE, MONETIZATION, SEO-AEO,
  CONTENT-PIPELINE, OPERATIONS, ROADMAP, CHANGELOG) documenting everything built
  to date: the Astro/GitHub Pages stack, page types & layouts, EN/ES i18n,
  monetization (AdSense placement strategy, the lead form, CJ affiliate routing),
  SEO/AEO infrastructure, the automated daily content generator, and the three
  GitHub Actions workflows.
- Added root `CLAUDE.md` carrying the **documentation rule** (every agent updates
  the relevant doc + this changelog) and a hard warning that `/docs` is generated
  output (wiped on deploy — never hand-edit).
- Docs updated: all of `project-docs/`.
- Follow-ups: confirm site #2/#3 domains+verticals; parameterize hardcoded
  `itinlending.net` in monitor/indexnow/workflows before multi-site; fill GA4 +
  affiliate env vars.

<!-- Recent code history before docs existed (from git log, for context):
  425ab40 Lead-form validation: state dropdown + phone format
  3cec7fb Live-site health monitor + Lighthouse CI workflows
  e7311ad Hub-and-spoke internal linking + publisher entity in llms.txt
  818bf91 Wire AdSense ad-unit slot IDs into ad slots
  a7800f4 Publisher entity → Timberline Ventures LLC + editorial byline
  efb4566 Lead form → dedicated thank-you page with ad slots
  cdb70d7 IndexNow key + ping script
  19a7325 Lead form → Web3Forms AJAX submit + success state
  60dbea0 AdSense loader site-wide (ca-pub-1426577294682977)
  4e1bf10 Bilingual itinlending.net with Spanish /es
  699bf60 Build itinlending.net: Astro + SEO/AEO + monetization scaffolding
-->
