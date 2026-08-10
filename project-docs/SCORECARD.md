# Weekly Scorecard — all three ITIN properties

**Why this exists (2026-08-10):** the weekly audits were paragraphs of narrative.
This is the fix: five metrics per property that we are explicitly trying to move
each week, with the before/after numbers side by side. The audit still explains
*why* things moved; this page says *whether* they moved.

## The 5 core metrics

| # | Metric | Owning system / method | Why it's one of the 5 |
|---|---|---|---|
| 1 | **Leads** (`generate_lead` events, all sources) | GA4 Data API, live properties: lending `412653847`, score `413651450`, card `540443142` | The output the business exists for. ⚠️ **GA4 is the analytics mirror, not the ledger.** The owning system is the Supabase `leads` table (`functions/v1/lead` → Postgres, see LEAD-INTELLIGENCE.md); no service-role key exists on this machine, so the scorecard uses GA4 events with this caveat. If the Supabase count ever differs, **Supabase wins** (data-integrity rule 1). Follow-up: add a read path so the scorecard pulls the ledger. |
| 2 | **Articles published** | `publishedAt` frontmatter in each repo's content collection (target: 3/site/week, Mon/Wed/Fri) | The one input fully under our control; every pipeline failure shows up here. |
| 3 | **Google clicks** | GSC Search Analytics API, property-level total (never summed query rows) | Organic traction. |
| 4 | **Google impressions** | GSC property-level total | The visibility pipeline that precedes clicks. |
| 5 | **Indexed pages** | GSC (UI reading or URL Inspection sweep — method + date noted per number) | The unlock we grind at daily via request-indexing; Google can't rank what it hasn't indexed. |

**Watch metrics** (reported, not core): GA4 sessions, Bing rolling-window
clicks/queries (Bing's `GetQueryStats` has no date range, so it is a snapshot
comparable only to the previous identical pull), and AI-assistant referral leads.

**Well Worth Products (wellworthproducts.com)** is on the card too, with the 5
adapted for e-commerce: **revenue** and **purchases** (GA4 ecommerce) replace
leads, and **content shipped** (PDP `custom.seo_content` pages, per the
wellworth-content skill) replaces the article count. GSC property is the apex
`https://wellworthproducts.com/` — the `www` property is dead (≤4 impr/wk).
GA4 property: `properties/409479193`.

## Windows

GSC lags 2–3 days, so the scorecard week is the latest **complete** Mon–Sun-ish
window, currently Fri→Thu aligned: **"last week" = Aug 1–7** vs **"prior week" =
Jul 25–31**. Anything published/measured after the window end (e.g. the 8/10
publishes) belongs to next week's card. GA4 uses identical windows for
comparability. Indexed-page readings are point-in-time and dated individually.

## Cadence

The Sunday/Monday weekly audit **must end with this scorecard filled in** for all
three properties, appended below (newest first), and the summary table pasted at
the TOP of the audit file. Numbers are pulled fresh from the owning systems at
scorecard time — never carried from the audit prose.

---

# 2026-08-10 scorecard — week of Aug 1–7 vs Jul 25–31

All GSC/GA4 numbers pulled fresh from the APIs 2026-08-10 ~16:20 EDT.
Windows end 2026-08-07 (complete). Bing pulled 16:25 EDT (rolling window).

## itinlending.net

| Metric | Jul 25–31 | Aug 1–7 | Δ | Read |
|---|---|---|---|---|
| Leads | 9 | **13** | ▲ +4 | Best week on record. Sources: direct 8, ChatGPT 3, Bing 1, Google 1. |
| Articles published | 1 | **5** | ▲ +4 | 3 slots + recovery; pipeline healthy. |
| Google clicks | 2 | **0** | ▼ −2 | **Zero.** Google contributed ~nothing while leads rose. |
| Google impressions | 626 | **631** | ▬ +1% | Flat. Avg pos 67.4 → 62.3 (derived, impression-weighted). |
| Indexed pages | — | **124 of 168** (8/9 sweep; 123 on 8/10, flat) | n/a | First full sweep was 8/9 — no prior-week baseline exists. Backlog 44 → 43. |
| *Watch: sessions* | *182* | *135* | *▼ −26%* | *Leads up on falling sessions = better-qualified traffic.* |
| *Watch: Bing (rolling)* | *n/a* | *203 queries / 51 clicks / 341 impr* | *first pull* | *Baseline for next week.* |

## itincreditcard.com

| Metric | Jul 25–31 | Aug 1–7 | Δ | Read |
|---|---|---|---|---|
| Leads | 0 | **3** | ▲ +3 | First leads ever. **All 3 from ChatGPT referrals.** |
| Articles published | 1 | **1** | ▬ | 2 of 3 slots lost to the check-links defect — fixed + shipped green 8/10 (`c407c8e`). |
| Google clicks | 0 | **1** | ▲ +1 | The first-ever Google click (8/5, Brazil). |
| Google impressions | 63 | **57** | ▼ −10% | Noise at this volume. |
| Indexed pages | 66 *(8/3 UI)* | **104** *(8/10 UI)* | ▲ +58% | The 8/4 sitemap/`lastmod` work landed. |
| *Watch: sessions* | *72* | *43* | *▼ −40%* | — |
| *Watch: Bing (rolling)* | *n/a* | *54 queries / 6 clicks / 114 impr* | *first pull* | — |

## itincreditscore.com

| Metric | Jul 25–31 | Aug 1–7 | Δ | Read |
|---|---|---|---|---|
| Leads | 0 | **3** | ▲ +3 | Sources: itinlending referral 2, Bing 1. Zero from Google. |
| Articles published | 1 | **3** | ▲ +2 | 8/7 slot lost to API credit. **8/10 PM run failed on the same link defect card had — port the fix.** |
| Google clicks | 0 | **1** | ▲ +1 | — |
| Google impressions | 333 | **291** | ▼ −13% | Softening while Bing triples. |
| Indexed pages | 75 *(8/3 UI)* | **106** *(8/10 UI)* | ▲ +41% | IndexNow repair (`58161e4`) paid off. |
| *Watch: sessions* | *42* | *106* | *▲ +152%* | *Largely cross-site referral from lending.* |
| *Watch: Bing (rolling)* | *60 q / 4 clicks (8/3 audit pull)* | *155 q / 12 clicks / 289 impr* | *▲ ~2.6×* | *All 155 page-1. Bing is this site's real channel.* |

## wellworthproducts.com (e-commerce card)

| Metric | Jul 25–31 | Aug 1–7 | Δ | Read |
|---|---|---|---|---|
| Revenue | $1,758 | **$1,977** | ▲ +12% | On fewer orders: AOV $147 → $282 (derived; n of 7–12, treat as noisy). |
| Purchases | 12 | **7** | ▼ −5 | Small-n week-to-week noise until proven otherwise. |
| Google clicks | 212 | **123** | ▼ −42%* | *Prior week held a one-day 62-click spike (7/30, ~3× median). Ex-spike the drop is −18% and the daily floor is a steady ~20/day. Not a collapse.* |
| Google impressions | 27,311 | **28,463** | ▲ +4% | Best days in the series landed 8/6–8/7 (4,575 / 4,390). Avg pos 11.5 → 10.9. |
| Content shipped (PDP seo_content) | n/a | n/a | — | No counter exists yet — follow-up: count shipped `custom.seo_content` blocks at scorecard time. |
| *Watch: sessions* | *380* | *750* | *▲ +97%†* | *†Entirely a Direct spike (146 → 578); **organic sessions FELL 215 → 130**, consistent with GSC. Untagged campaign or bot traffic until shown otherwise — do not read as growth.* |
| *Watch: Bing (rolling)* | *n/a* | *550 queries (536 page-1) / 295 clicks / 2,321 impr* | *first pull* | *Bing again rivals Google (295 rolling vs 123/wk).* |

**Read:** Well Worth is a different class of property — ~28k Google impressions/wk
at position ~11 vs the ITIN family's ~1k at position ~65. Its lever is CTR and
position (title/meta + content work), not indexation. Revenue held up on a weaker
click week.

## Portfolio totals (ITIN family — WW reported separately, leads and revenue don't mix)

| Metric | Jul 25–31 | Aug 1–7 | Δ |
|---|---|---|---|
| **Leads (all sites)** | 9 | **19** | ▲ **+111%** |
| Articles published | 3 | 9 | ▲ +6 |
| Google clicks | 2 | 2 | ▬ |
| Google impressions | 1,022 | 979 | ▼ −4% |
| Sessions | 296 | 284 | ▬ −4% |

## The three reads that matter

1. **Leads doubled while Google did nothing.** 19 leads: direct 8, ChatGPT 6,
   cross-site referral 2, Bing 2, Google 1. **ChatGPT is the #2 lead channel**
   and card's only one. Google produced 2 clicks across ~1,000 impressions at
   positions in the 60s — it is currently a pipeline bet, not a channel.
2. **Bing >> Google right now.** Rolling-window Bing clicks across the family
   (69) are ~35× a Google week (2). Score's Bing tripled after the IndexNow
   repair. The Bing/IndexNow lever is cheap and proven — keep feeding it.
3. **Publish cadence is the metric that predicts the others** — card published 1
   article and got 1/3 the leads-growth of its siblings. Both pipeline failure
   modes (API credit, link defect) are now fixed or fixable; 9/9 slots is the
   floor for next week.

## Targets for next week's card (Aug 8–14, scored ~Aug 17)

| Metric | Target |
|---|---|
| Leads (portfolio) | ≥ 20 (hold the doubled level) |
| Articles published | **9/9 slots** (card fix is live; score needs the same port) |
| Google clicks | > 0 on **every** property (lending had zero) |
| Google impressions | lending > 631; score stop the slide (> 291); card > 57 |
| Indexed pages | lending backlog 43 → ≤ 32 (~11/day request-indexing continues); card ≥ 110; score ≥ 110 |
| Well Worth | revenue ≥ $2,000; clicks back ≥ 150; identify the 7/30 spike query; build the PDP content counter; explain the Direct spike |
