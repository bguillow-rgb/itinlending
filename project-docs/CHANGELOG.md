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

## 2026-06-06 — GA4 live on all 3 sites + CI build env fix
- **GA4 properties created/captured (all 3):** one property per domain under the
  itinlending.net GA4 account (8860001), each with a web stream + Enhanced
  Measurement ON. IDs: itinlending.net `G-YVKK4MXGVP` (prop 412653847),
  itincreditcard.com `G-TFJMHQLHMX` (prop 540443142, newly created today),
  itincreditscore.com `G-HDM7H448J9` (prop 413651450).
- **Wired `PUBLIC_GA4_ID`** into each repo's gitignored `web/.env` (per-site ID),
  rebuilt `/docs`, verified `gtag/js?id=G-…` baked into the HTML on all 3.
- **CI build env fix (latent bug):** `daily-content.yml`'s "Build + deploy" step
  ran `deploy-to-docs.sh` with no env, and `.env` is gitignored/absent in CI — so
  every CI rebuild stripped AdSense (and would have stripped GA4) from `/docs`.
  Added an `env:` block with all PUBLIC_* values (public identifiers already in the
  shipped HTML, so kept as literals, not secrets) to all 3 workflows.
- Docs updated: ANALYTICS-PLAN.md (status, GA4 properties table, credentials).
- Follow-ups: mark `generate_lead` + `affiliate_click` as Key Events in each GA4
  property (after first event seen); link AdSense + Search Console; then build the
  daily-report pipeline (still blocked on GA4 Data API SA key + AdSense OAuth +
  iMessage recipient).

## 2026-06-06 — Day-1 SEO rank baseline for all 3 sites + GSC daily tracking
- Created **`reports/seo-baseline-2026-06-06.md`** — the frozen Day-1 baseline:
  **top 20 target keywords + a 3–5 term quick-win watch set per site** (all 3),
  each mapped to target page / tier (pillar/cluster/detail) / intent / EN-ES, with
  an honest `pending GSC` rank column. Built from each repo's `consts.ts` topology.
- **Did not invent rankings** (per playbook). Ran live `site:` indexation checks
  instead — real Day-1 signal, recorded as an indexation snapshot: new Astro URLs
  **not yet indexed** on any site; itinlending.net + itincreditscore.com still show
  **legacy** pages; itincreditcard.com shows **nothing** of its own.
- Surfaced a migration gap: **site 3's `web/docs/redirects.csv` is empty** while it
  has indexed legacy URLs (`/credit-reports-with-itin`,
  `/f/understanding-itin-and-your-credit-score`, `/start-building-now`) → will 404
  on cutover. Site 1's indexed legacy URL is already covered. Suggested 301 targets
  recorded in the baseline file.
- Wired rank tracking into the **daily report**: GSC Search Analytics (avg position
  /impressions/clicks/CTR + Δ vs Day 1) added as a `gscRanks()` step; documented the
  3-domain GSC verification prerequisite. Decision: track daily, interpret weekly.
- Docs updated: `reports/seo-baseline-2026-06-06.md` (new), `ANALYTICS-PLAN.md`
  (GSC rank-tracking section + status rows), `SEO-AEO.md` (rank-tracking + baseline
  pointer + site-3 redirect gap).
- Follow-ups: (1) verify GSC on all 3 domains + submit sitemaps + request indexing;
  (2) build site 3's redirect map before cutover; (3) build `gscRanks()` in
  `daily-report.mjs` once GSC creds exist; (4) backfill the baseline rank columns
  once data lands.

## 2026-06-06 — Programmatic state pages for ITIN Lending (#10)
- Added `/itin-loans/<state>` (EN) + `/es/itin-loans/<state>` (ES) programmatic
  pages for the **top 15 ITIN states** (CA, TX, NY, FL, IL, NJ, WA, GA, MD, AZ,
  NC, VA, MA, PA, NV) — 30 new pages. Small/low-demand states intentionally
  omitted to keep every page above the quality bar.
- Data: `web/src/data/states.ts` holds real, sourced figures per state — 2022
  state & local taxes paid by undocumented immigrants + effective rate (ITEP,
  2024 report, Appendix Table 1) and driver's-license-regardless-of-status
  status + enactment year (NCSL). Three real data points per page; the DL status
  changes the auto-loan guidance, so pages genuinely differ (not boilerplate).
  Each renders ~400 article-body words, FAQPage + Breadcrumb schema, a per-page
  OG card, and correct canonical/hreflang. Builders `buildEn`/`buildEs` live in
  the data file; routes use `getStaticPaths`.
- Hub-and-spoke: pillar `/itin-loans` now links down to every state page (new
  "ITIN loans by state" section, EN+ES); each state page links to all siblings.
- `gen-og.mjs` updated to discover STATES and emit nested
  `/og/itin-loans/<state>.png` cards; sitemap auto-includes all 30.
- **Decision flagged for CC/CS:** state pages fit ITIN *lending* (state DL laws,
  local lenders, mortgage rules vary) but would be near-duplicate/thin for credit
  cards and credit score (federal products) — the scaled-content-abuse trap the
  playbook warns against. Held pending a credit-specific data angle (e.g.
  Experian average FICO by state for CS).
- Docs updated: ARCHITECTURE.md (state-page system), CHANGELOG.
- Follow-ups: decide CC/CS angle; monitor indexation (target ≥80%) and
  noindex/improve any zero-impression pages after 60 days.

## 2026-06-06 — Affiliate fallback chains + Path B parity + AdSense verified (all 3 sites)
- **Affiliate routing (#monetize):** added `AFFILIATE_FALLBACKS` to all 3
  `consts.ts` and rewrote `affiliateUrlFor()` to resolve own slug link → fallback
  chain → global apply URL → '' (callers route to `/apply`). So money pages with
  no dedicated program yet (ITIN mortgage/auto have none) route to a sensible
  sibling instead of a dead CTA.
- **Path B parity:** brought card + score `thank-you.astro` up to Itin's spec —
  lead form passes chosen product as `?for=<slug>`, thank-you page walks the
  fallback chain and reveals a matched affiliate CTA. Added `for=` slug mapping to
  card (`#card_type`) and score (`#goal`) LeadForms (Itin already had it).
- **Env docs:** annotated all 3 `.env.example` with which 2026-researched program
  goes in which `PUBLIC_AFFILIATE_URL_*` slot (Self/FlexOffers, OpenSky/credit.com,
  Credit Strong, Lendio, Sunwise; mortgage/auto = blank, fall back).
- **AdSense verified (no code change):** all 3 sites approval status "Getting
  ready", Auto ads/optimize OFF (correct), ad units live in built `/docs`,
  `ads.txt` reachable HTTP 200 with correct pub ID on all 3. AdSense "ads.txt not
  found" is crawl-timing only (sites added today) — no fix needed.
- Docs updated: MONETIZATION.md, this changelog.
- Follow-ups: user to finish Impact + FlexOffers (then CommissionSoup +
  credit.com) applications, then paste deep links into the env vars.

## 2026-06-06 — Per-page OG images, RSS feeds, branded favicons (all 3 sites)
- **Favicons (#fix):** all 3 sites previously shipped the same (wrong-brand)
  favicon. Rebuilt per-site `favicon.svg` "IN" monogram in each brand's colors,
  regenerated `favicon.png`/`icon-180.png`/`icon-512.png` via sharp, and added a
  multi-resolution `favicon.ico` (16/32/48) via ImageMagick. Added
  `<link rel="icon" href="/favicon.ico" sizes="any">` to `BaseLayout.astro`.
- **RSS (#12):** new hand-rolled RSS 2.0 endpoint `web/src/pages/rss.xml.js`
  (identical on all 3) emitting published articles newest-first; added
  `<link rel="alternate" type="application/rss+xml">` to every page head.
- **OG per-page images (#9):** build-time generator `web/scripts/gen-og.mjs`
  (wired via `prebuild` npm script + `sharp` dep) renders a branded 1200×630 PNG
  per page/article into `public/og/<slug>.png` (homepage → `home.png`). Layouts
  (`BaseLayout`, `ArticleLayout`, `MoneyPageLayout`) + homepages pass a per-page
  `ogImage` so `og:image`/`twitter:image` resolve to the right card; falls back
  to `/og.png`. Verified: IL 10 / CC 9 / CS 10 OG PNGs; per-page og:image,
  favicon.ico, and rss alternate all present in built HTML.
- Docs updated: ARCHITECTURE.md (OG/RSS/favicon build steps), CHANGELOG.
- Follow-ups: content engine (#11) + programmatic state pages (#10) next;
  re-run IndexNow after publish.

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
