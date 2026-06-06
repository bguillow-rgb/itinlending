# Analytics & Daily Report Plan

How the three Itin sites track events and produce a single daily KPI report.
Decisions locked 2026-06-06: **iMessage delivery at 6:00am local · 3 separate GA4
properties · GA4 + AdSense revenue · GitHub Actions cron (+ local send).**

## Status

| Piece | State |
|---|---|
| GA4 base (page_view) | ✅ **Live** (2026-06-06) — `PUBLIC_GA4_ID` set + baked into `/docs` on all 3 sites (local .env + CI build env) |
| Custom event tracking | ✅ **Instrumented** (2026-06-06) in `Analytics.astro`, fires now that GA4 is on |
| GA4 properties / Measurement IDs | ✅ **Created** (2026-06-06) — all 3 (see table below) |
| GA4 Data API + AdSense API access | ⏳ user to provision credentials |
| GSC verification (3 domains) + Search Console API | ⏳ user to verify + provision (powers daily rank tracking) |
| Day-1 SEO rank baseline | ✅ **frozen 2026-06-06** — `reports/seo-baseline-2026-06-06.md` (20 targets + quick-win watch per site; ranks `pending GSC`) |
| Daily report script + workflow | ⏳ to build once credentials exist (incl. `gscRanks()` step) |
| Local 6am iMessage sender | ⏳ to build (launchd) |

## Event tracking (implemented)

Centralized + delegated in `web/src/components/Analytics.astro` (byte-identical
across all 3 repos) so it needs no edits to each site's bespoke components and
no-ops when GA4 is absent. `window.itrack(name, params)` wraps `gtag('event', …)`.

| Event | Fires when | Params | GA4 role |
|---|---|---|---|
| `lead_form_start` | first focus into `form[data-leadform]` (once/page) | `page_path` | funnel top |
| `generate_lead` ⭐ | thank-you page load (lead-submit destination) | `product` (from `?for=` slug) | **Key Event** |
| `thank_you_view` | thank-you page load | `product` | confirmation |
| `affiliate_click` ⭐ | click on `a[rel~="sponsored"]` (CJ deep links) | `link_url`, `page_path` | **Key Event** |
| `cta_click` | click on `.btn-primary` → `/apply` | `link_url`, `page_path` | mid-funnel |
| `page_view`, `scroll`, outbound | GA4 auto / Enhanced Measurement | — | engagement |

### GA4 properties (created 2026-06-06)

All three live under the **`itinlending.net` GA4 account (8860001)**, one property
per domain, each with one web data stream and Enhanced Measurement ON.

| Site | Measurement ID (`PUBLIC_GA4_ID`) | Property ID | Stream ID |
|---|---|---|---|
| itinlending.net | `G-YVKK4MXGVP` | 412653847 | 6305190948 |
| itincreditcard.com | `G-TFJMHQLHMX` | 540443142 | 15017092424 |
| itincreditscore.com | `G-HDM7H448J9` | 413651450 | 6327021740 |

The **Property IDs** above are what `daily-report.mjs` passes to the GA4 Data API.

**Done to activate:** `PUBLIC_GA4_ID` set in each repo's `.env` **and** in the
daily-content workflow build `env:` (the CI rebuild bakes PUBLIC_* into `/docs`;
they were previously dropped, which also silently stripped AdSense — now fixed).
`/docs` rebuilt + committed on all 3.

**Still to do in GA4:** mark `generate_lead` + `affiliate_click` as Key Events
(appears in Admin → Key events once each event has been seen at least once), then
link AdSense + Search Console. Enhanced Measurement is already ON.

## KPIs the daily report covers (per site + combined)

- **Traffic:** users, sessions, new vs returning, channel mix, **AI-referral
  sessions** (chatgpt/openai/perplexity/gemini/claude/copilot referrers).
- **Engagement:** engaged-session %, avg engagement time, scroll depth, top 5
  landing pages.
- **Conversions/KPIs:** `generate_lead` count, `affiliate_click` count, lead rate
  (leads/sessions), AdSense earnings + impressions + RPM.
- **Organic rank (GSC):** for every keyword in the Day-1 baseline
  (`reports/seo-baseline-2026-06-06.md`), **avg position, impressions, clicks, CTR**,
  and the **delta vs. the Day-1 baseline**. Plus newly-appearing queries not in the
  baseline (so we discover what we *start* ranking for). See "GSC rank tracking" below.
- **Content:** article(s) published that day (title, target query, URL) from the
  daily-content workflow / git.
- **Health:** carry over the site health-monitor pass/fail.

## GSC rank tracking (decided 2026-06-06)

Rankings are tracked **daily inside the same report** via the **GSC Search Analytics
API**, diffed against the frozen Day-1 baseline at `reports/seo-baseline-2026-06-06.md`.

- **Source of truth for "rank":** GSC **average position** (impression-weighted), not
  manual SERP checks (personalized/localized/non-reproducible) and not invented
  numbers. GSC is free and authoritative.
- **Per keyword tracked:** avg position, impressions, clicks, CTR + Δ vs Day 1.
- **Query→page pairs** come from the baseline file's `Target page` column; the report
  uses GSC's `query` + `page` dimensions to keep each keyword tied to its intended URL
  (catches cannibalization when the wrong URL ranks).
- **Cadence:** daily pull (low cost), but interpret on a weekly trend — daily position
  wobble is noise. The report flags only moves ≥ a threshold (e.g. ±3 positions or a
  keyword entering/leaving the top 10/20).
- **Backfill:** until each domain is GSC-verified and indexed, these fields read
  `pending GSC`. The new Astro URLs are **not yet indexed** as of the baseline (see the
  indexation snapshot in the baseline file).

### Prerequisite: verify GSC on all 3 domains (does the "connect GSC" step)

1. Add a **domain property** for each of itinlending.net, itincreditcard.com,
   itincreditscore.com (DNS-TXT verification preferred; the
   `PUBLIC_GSC_VERIFICATION` meta tag in `consts.ts` is the HTML-tag fallback).
2. Submit `sitemap-index.xml` for each; request indexing on each pillar + cluster URL
   via URL Inspection.
3. Add **Bing Webmaster Tools** too (feeds ChatGPT/Copilot).
4. Grant the daily-report's GA4 service account **read access** to the GSC properties
   (Search Console API uses the same service-account / OAuth identity), and enable the
   **Search Console API** in the GCP project. Store nothing new beyond the existing
   `GA4_SA_KEY` if the service account is reused.

### Build note for `daily-report.mjs`

Add a `gscRanks()` step alongside the GA4 + AdSense pulls: for each property, call
`searchanalytics.query` (dimensions `query`,`page`; last 1 day for the daily number,
last 7 days for the trend), filter to the baseline keyword set, compute Δ vs Day 1,
and render a per-site "Organic rank" table in `reports/daily-report-YYYY-MM-DD.md`.
Same blocked-on-credentials status as the rest of the pipeline.

## Daily report architecture (hybrid — required because of iMessage)

**iMessage can only be sent from the user's Mac** (Messages app + Apple ID); cloud
CI cannot. So:

1. **GitHub Actions cron `daily-report.yml` (~5:30am local equiv. in UTC)** —
   runs `web/scripts/daily-report.mjs`:
   - Pull yesterday's metrics per property via **GA4 Data API** (3 properties).
   - Pull earnings/RPM per site via **AdSense Management API** (OAuth).
   - Read the day's published article from git/the articles dir.
   - Compose `reports/daily-report-YYYY-MM-DD.md` (+ a `latest.md`) and commit it
     to `~/Itin` (keeps a historical log in-repo).
2. **Local `launchd` job at 6:00am (`com.itin.dailyreport`)** on the Mac —
   `git pull` in `~/Itin`, read `reports/latest.md`, send via iMessage. launchd
   uses local time so 6am is exact and DST-safe. Requires the Mac awake at 6am
   (add a `pmset repeat wake` if needed).

> Why not all-in-Actions: iMessage. Why not all-local: the user chose Actions for
> the data pull (secrets live there, runs even if the Mac is off; the Mac only
> does the final send).

## Credentials the user must provide

1. ~~3 GA4 Measurement IDs + 3 numeric Property IDs~~ ✅ **done** (2026-06-06) —
   see the "GA4 properties" table above.
2. **GA4 Data API:** a GCP service-account JSON key, added as Viewer on all 3
   properties. Store as the `GA4_SA_KEY` Actions secret.
3. **AdSense Management API:** OAuth client + one-time refresh token (AdSense does
   not support service accounts). Store client id/secret/refresh-token as secrets.
4. **iMessage recipient:** phone/handle to receive the report.

## Cross-site note

`Analytics.astro` is shared/identical — when it changes, copy to all 3 repos
(done for the instrumentation). `daily-report.mjs` will read all 3 properties in
one run, so it lives only in `~/Itin` and reports the whole family at once.
