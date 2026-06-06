# Analytics & Daily Report Plan

How the three Itin sites track events and produce a single daily KPI report.
Decisions locked 2026-06-06: **iMessage delivery at 6:00am local · 3 separate GA4
properties · GA4 + AdSense revenue · GitHub Actions cron (+ local send).**

## Status

| Piece | State |
|---|---|
| GA4 base (page_view) | Code wired (`Analytics.astro`), **not live** — `PUBLIC_GA4_ID` unset on all 3 sites |
| Custom event tracking | ✅ **Instrumented** (2026-06-06) in `Analytics.astro`, no-ops until GA4 on |
| GA4 properties / Measurement IDs | ⏳ user to create (3 separate) |
| GA4 Data API + AdSense API access | ⏳ user to provision credentials |
| Daily report script + workflow | ⏳ to build once credentials exist |
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

**To activate:** create the GA4 property, set `PUBLIC_GA4_ID` (CI secret + `.env`)
in each repo, rebuild/deploy. Then in GA4 mark `generate_lead` + `affiliate_click`
as Key Events, enable Enhanced Measurement, and link AdSense + Search Console.

## KPIs the daily report covers (per site + combined)

- **Traffic:** users, sessions, new vs returning, channel mix, **AI-referral
  sessions** (chatgpt/openai/perplexity/gemini/claude/copilot referrers).
- **Engagement:** engaged-session %, avg engagement time, scroll depth, top 5
  landing pages.
- **Conversions/KPIs:** `generate_lead` count, `affiliate_click` count, lead rate
  (leads/sessions), AdSense earnings + impressions + RPM.
- **Content:** article(s) published that day (title, target query, URL) from the
  daily-content workflow / git.
- **Health:** carry over the site health-monitor pass/fail.

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

1. **3 GA4 Measurement IDs** (`G-…`) + **3 numeric Property IDs** (one per domain).
2. **GA4 Data API:** a GCP service-account JSON key, added as Viewer on all 3
   properties. Store as the `GA4_SA_KEY` Actions secret.
3. **AdSense Management API:** OAuth client + one-time refresh token (AdSense does
   not support service accounts). Store client id/secret/refresh-token as secrets.
4. **iMessage recipient:** phone/handle to receive the report.

## Cross-site note

`Analytics.astro` is shared/identical — when it changes, copy to all 3 repos
(done for the instrumentation). `daily-report.mjs` will read all 3 properties in
one run, so it lives only in `~/Itin` and reports the whole family at once.
