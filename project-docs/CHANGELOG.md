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

## 2026-06-13 — Credit-score cluster: de-cannibalization + Speakable on money pages
- **On-page (itincreditscore.com).** Two pages were competing for the same query
  with the *identical* title "How to Check Your Credit Score With an ITIN (2026)":
  the `/check-credit-score-with-itin` money page and the
  `/how-to-check-credit-score-with-itin-number` article (ranked ~pos 72, 216 impr).
  - Retargeted the **article** (EN + es-419) to own a distinct intent — "get your
    free credit **report**, all 3 bureaus" — vs. the money page's "check your
    **score**." Changed title, description, targetQuery, relatedQueries,
    quickAnswer, intro, and lead FAQ; kept the slug to preserve indexed equity;
    intro now hands "score" intent up to the money page.
  - Added **WebPage+Speakable** JSON-LD to `MoneyPageLayout.astro` targeting
    `#quick-answer` (ServiceSchema/FinancialService can't host `speakable`; articles
    already emit it via `ArticleSchema.astro`). Now both page types are Speakable.
  - Built, deployed to `/docs`, pushed (itincreditscore.com).
- **Off-page.** Wrote `.seo/output/outreach-targets-2026-06-13.md` — Tier-1 "best of"
  listicle targets (per site, where competitors rank and we're absent), Tier-2
  community threads, Tier-3 linkable assets to build (free calculator, data drop,
  bilingual hub). Documented the hard boundary: **no automated link placement**;
  outreach/posting is draft-by-me, send-by-user (per-item approval).
- Docs updated: `SEO-AEO.md` (cannibalization fix + Speakable-on-money-pages note +
  off-page program section), this CHANGELOG.
- Follow-ups: optionally propagate the money-page Speakable change to `~/Itin` and
  `~/ITINCreditCard` MoneyPageLayouts; pick first linkable asset to build
  (calculator recommended).

## 2026-06-13 — Lending topical-depth push: targeted seeding (rank action ⑤)
- Acted on rank action ⑤. Lending's head terms (`itin loans/loan/mortgage/home
  loans`) rank pos 83–92 with real impressions but 0 clicks — an authority/depth
  problem. Clean content gaps: `itin lender(s)` and mortgage-programs/guidelines
  long-tails.
- Added a **`--topic` theme hint** to `web/scripts/seed-content.mjs` (threaded to
  the generator's existing `topicHint`, detail-tier only) and exposed it as a
  `topic` input on the **Seed content (one-shot)** workflow
  (`.github/workflows/seed-content.yml`). Lets a seed batch target a cluster gap
  while the model still picks distinct, non-duplicate target queries.
- Dispatched a targeted seed batch toward the lending gaps to kick off the
  3–6-month authority play (daily pipeline continues compounding the detail layer).
- Docs updated: `SEO-AEO.md` (new "Lending topical-depth push" section with the
  gap table + the `--topic` mechanism), this CHANGELOG.
- Follow-ups: re-run `rankings` in ~2–4 wks to measure the lending-cluster and
  Credit Score movement; keep seeding lending-gap themes.

## 2026-06-13 — Spanish-locale (`/es`) blackout diagnosis (rank action ③)
- Acted on rank action ③. The `/es` locale earns ~0 impressions (2 Spanish query
  rows vs 117 English in the 2026-06-13 report). Audited the full on-site i18n
  layer across the sites: hreflang reciprocity, self-canonicals, schema
  `inLanguage=es-419` (locale-derived, not hardcoded), native body translation,
  and sitemap inclusion — **all correct**. Ruled out an on-page defect.
- Diagnosis: it's indexation/authority/demand, not markup. Remaining split
  (crawled-not-indexed vs indexed-but-no-authority) needs GSC **URL Inspection**
  on a few `/es` money pages — the one step that requires the user's browser.
- Docs updated: `SEO-AEO.md` (new "Spanish-locale blackout — diagnosis" section
  with the full audit + the user-browser next step), this CHANGELOG.
- Follow-ups: user runs GSC URL Inspection on `/es` money pages; then either
  request-indexing (case 1) or start a Spanish authority/content push (case 2).
  Item ⑤ (Lending topical depth) still queued.

## 2026-06-13 — Cross-site canonical-owner hand-off links (rank action ④)
- Acted on rank action ④ (resolve cross-site keyword overlap). Decision (per user):
  **keep all money pages on every site, add a few natural contextual hand-offs** —
  deliberately restrained to avoid a PBN/link-network footprint. ~2–3 links per
  site, each in body content (never as the primary CTA), each genuinely useful to
  the reader at that point in the page.
- Each site now hands traffic to whichever sibling *owns* the topic the reader is
  about to need next:
  - **ITIN Lending** (`~/Itin`): `itin-credit-cards.astro` → itincreditscore.com
    (check score) + itincreditcard.com (card guides); `itin-mortgage.astro` →
    itincreditscore.com (build score before applying). 3 links.
  - **ITIN Credit Card** (`~/ITINCreditCard`): `build-credit-with-itin.astro` →
    itincreditscore.com (check score at month 6); `itin-credit-cards-guide.astro`
    → itinlending.net (ITIN mortgage once credit is strong). 2 links.
  - **ITIN Credit Score** (`~/ITINCreditScore`): `build-credit-history-with-itin.astro`
    → itincreditcard.com (compare secured cards); `improve-credit-score.astro` →
    itinlending.net (ITIN mortgage rate impact at 740). 2 links.
- All three repos rebuilt + deployed to `/docs` and pushed.
- Docs updated: this CHANGELOG. (Cross-domain linking rule already in monetization
  memory: cross-site links live in body content, not the CTA.)
- Follow-ups: items ③ (Spanish-locale diagnosis) and ⑤ (Lending topical depth)
  still queued. Re-run `rankings` in ~2–4 wks.

## 2026-06-13 — Credit Score: internal-link consolidation onto money page + pillar (rank action ①+②)
- Acted on the 2026-06-13 rank report: ITIN Credit Score is the leader with a
  pos-34–72 cluster within striking distance, but internal links were leaking to
  the wrong target.
- **Cannibalization fix:** 4 articles linked exact-match "check your credit score
  with an ITIN" anchors at the competing *detail article*
  (`/how-to-check-credit-score-with-itin-number`) instead of the *money page*
  (`/check-credit-score-with-itin`). Repointed all of them to the money page so
  exact-match anchor equity flows to the conversion/canonical page. Zero body
  links to the competing article now remain.
- **Hub-and-spoke:** added an "up" link to the `/itin-credit-score-guide` pillar
  from all 9 articles (previously 0 articles linked to the pillar). The competing
  article now also funnels up to the money page from its intro.
- Files: `web/src/content/articles/*.md` in `~/ITINCreditScore` (9 articles).
  Rebuilt + deployed (`/docs`), rebased on the daily-pipeline content that landed
  mid-task (new car-loan/credit-builder articles + a remote SEO commit adding a
  per-bureau table + homepage link — complementary, no conflict in source).
- Docs updated: this CHANGELOG. (Linking strategy already described in `SEO-AEO.md`
  hub-and-spoke section; no new doc needed.)
- Follow-ups: items ④ (cross-site canonical-owner linking), ③ (Spanish-locale
  diagnosis), ⑤ (Lending topical depth) still queued. Re-run `rankings` in ~2–4
  wks to measure movement on the Credit Score cluster.

## 2026-06-13 — On-demand rank tracking: new `rankings` skill + multi-engine scripts
- Built a "show me where we rank" reporting system across all 3 ITIN sites,
  free, on demand. Two layers: Layer 1 = where you already rank (Google Search
  Console + Bing Webmaster, exact avg position); Layer 2 = absolute live-SERP
  position for any target keyword (Serper.dev free tier).
- Extended the existing **seo-pulse** skill rather than duplicating its auth/venv/
  config. New scripts in `~/.claude/skills/seo-pulse/scripts/`: `bing.py`
  (Bing WMT GetQueryStats, aggregated per query), `serper.py` (absolute SERP rank,
  Google+Bing, 12h cache), `rankings.py` (orchestrator: merges GSC+Bing+Serper per
  target keyword + full GSC EN/ES dump for all 3 sites, prints markdown + saves
  `~/Itin/.seo/output/rankings-YYYY-MM-DD.{md,json}`). Degrades to `n/a` when
  Bing/Serper keys absent.
- Added new front-door skill `~/.claude/skills/rankings/SKILL.md` with trigger
  phrases ("show me the rankings", "where do we rank", etc.) and baked-in OUTPUT
  REQUIREMENTS: (A) full actual data tables, (B) summary, (C) prioritized action
  items (impact + time-to-result), bilingual reported per locale.
- Updated `config.yaml`: added `url:` per ITIN site (Bing siteUrl + Serper domain
  match) and expanded `target_keywords` to match the richer `.seo/context.md`.
- Tested end-to-end on a GSC-only run (ITIN Credit Score): works, files written,
  Bing/Serper columns show `n/a` as designed.
- Docs updated: new `RANK-TRACKING.md`; `README.md` index.
- Follow-ups: user to add 2 optional keys to enable Bing + Serper columns —
  `bing_api_key.txt` and `serper_api_key.txt` in seo-pulse `.secrets/` (sites must
  be verified in Bing WMT first).

## 2026-06-13 — SEO skill run (web surface, all 3 sites): builder pass — mostly verification
- Ran the `seo` skill (Gate-driven) against all three ITIN sites. Surface = web.
- Created `.seo/context.md` source-of-truth files in all 3 repos (`~/Itin`,
  `~/ITINCreditCard`, `~/ITINCreditScore`) so future SEO runs never re-do intake.
- Did NOT re-run the data audit: a full real-data GSC audit ran 2026-06-12
  (`~/Itin/.seo/output/audit-2026-06-12.md`); GSC lags 2–3 days so a same-window
  re-pull would only reprint it. (`GSC_SA_KEY` repo secret is unset → headless
  `gsc-report.yml` no-ops; yesterday's data came via browser/Google SSO.)
- Verified the 2026-06-12 audit's codebase-actionable recommendations are
  **already implemented** — no edits made (don't fix what's correct):
  - Organization schema `publisher.url` → `https://timberlineventuresllc.com` on
    all 3 (consts.ts:24). Entity anchor resolves HTTP 200; all 3 sites HTTP 200.
  - `inLanguage: localeFor(lang)` (es-419) across every schema component on all 3
    — locale-aware, not hardcoded en-US.
  - hreflang en/es/x-default emitted on every page (BaseLayout, shared pattern).
  - creditscore `/check-credit-score-with-itin` already has the bureau-by-bureau
    table + a "ways to check" table.
  - creditcard `/credit-cards-that-accept-itin` already has issuer-type +
    card-type comparison tables.
- Did NOT name specific card products / annual fees / deposit amounts on the
  creditcard money page: no current verified source → would violate the
  no-guessing + YMYL E-E-A-T rules.
- Docs updated: this CHANGELOG; new `.seo/context.md` in each repo.
- Follow-ups / open items:
  - **Off-site authority is the real unlock** (carried from 2026-06-12): brand
    mentions + links (Reddit/Quora answers, "best ITIN [loan/card]" roundups).
    ~90-day horizon. Not a codebase task.
  - **Workflow action bump** (`actions/checkout@v4` / `setup-node@v4` → v5 for
    node24) — FLAGGED, intentionally NOT auto-applied: bumping CI action majors
    across the live daily-content pipeline in 3 repos is risky and the pipeline
    ran clean on v4 on 2026-06-12. Apply deliberately + watch the next run.
  - Set `GSC_SA_KEY` + `GSC_PROPERTY` repo secrets to enable headless weekly
    `gsc-report.yml` (currently no-ops; the indexing SA already exists).

## 2026-06-11 — Timberline Ventures /contact indexing ping attempt (blocked on SA ownership)
- Tried to fire a Google Indexing API ping at `https://timberlineventuresllc.com/contact`
  to accelerate discovery of the "URL unknown to Google / lastCrawl=never" page flagged
  in GSC. Reused the portable `web/scripts/google-index.mjs` JWT flow.
- Result: 403 "Failed to verify the URL ownership." The indexing service account
  `itin-indexing@itin-499113.iam.gserviceaccount.com` is a verified owner of the 3 ITIN
  GSC properties but was NEVER added to `sc-domain:timberlineventuresllc.com`. The API
  itself is enabled and the key is valid — ownership is the only gap.
- Also confirmed the seo-pulse fallback SA (`seo-pulse-gsc@perfume-picks`) cannot be used:
  its GCP project has the Web Search Indexing API disabled (403 SERVICE_DISABLED).
- Follow-ups: to wire Timberline up like the ITIN sites, add the SA email above as an
  **Owner** under the Timberline property's Settings → Users and permissions, then re-run
  the ping. Until then, the GSC URL-inspection "Request Indexing" button is the manual
  equivalent. The page is benign and the sitemap will surface it regardless — low priority.

## 2026-06-12 — SEO audit + internal-linking/comparison-table pass on all 3 sites
Ran a full SEO audit (surface: web) against live GSC data (28d). All three sites are
technically sound — the gating factor is domain age/authority, everything ranks pos
30–90. GSC standings: itincreditscore.com **729 impr / 78 queries** (leader, several
queries pos 32–43), itincreditcard.com **48 impr / 29 / 1 click**, itinlending.net
**14 impr / 11 / pos 82–97** (hardest niche). Audit report saved to
`~/Itin/.seo/output/audit-2026-06-12.md`. Highest-leverage fixes implemented +
deployed to all three:
- **itincreditscore.com:** added a "How does each credit bureau handle an ITIN?"
  comparison table (Experian / TransUnion / Equifax / AnnualCreditReport.com) on
  `/check-credit-score-with-itin` — targets bureau-specific queries already ranking
  pos 32–38 (`transunion credit report itin`, `annualcreditreport.com itin`). Added a
  homepage descriptive-anchor link into that page (its biggest query,
  `how to check credit score with itin` = 183 impr at pos 70, had no homepage link).
- **itincreditcard.com:** added a "Which is the best ITIN credit card for your
  situation?" card-type decision table (secured / unsecured / builder / business) on
  `/credit-cards-that-accept-itin` (ranks pos 37 for `best itin credit cards`), plus a
  homepage descriptive link into it. No specific named cards/fees invented (YMYL).
- **itinlending.net:** added descriptive money-page links from the 5 research articles
  that had none (business-loan→/itin-business-loans, home-equity→/itin-mortgage,
  bad-credit→/itin-loans, mortgage-requirements→/itin-mortgage,
  personal-loan→/itin-personal-loans) to concentrate authority on converting pages.
- Deployed via `deploy-to-docs.sh` per site, passing `PUBLIC_GSC_VERIFICATION` inline
  (local `web/.env` lacks it — see note below). IndexNow + Google Indexing fire on the
  next daily run; all changes are bilingual via the existing /es pipeline.
- **Note for future deploys:** local `web/.env` is missing `PUBLIC_GSC_VERIFICATION`,
  so a bare `deploy-to-docs.sh` would drop the GSC ownership meta tag from live pages.
  Either add it to each repo's `.env` or pass it inline. Tokens are in `OPERATIONS.md`.
- Off-site authority (Reddit/Quora answers, "best ITIN X" roundup inclusion) is the
  real next unlock — flagged in the audit as the ~90-day lever; not code-side.
- Docs updated: this CHANGELOG; audit detail in `.seo/output/audit-2026-06-12.md`.
- Follow-ups: monitor GSC over 2–4 wks for the creditscore cannibalization to
  consolidate and for the pos-32–43 queries to move; pivot lending's daily topic queue
  toward low-comp long-tails; Node-24 GitHub Actions bump before 2026-06-16.

## 2026-06-11 — Indexing API ACTIVATED on all 3 sites via Site Verification API (supersedes the HTML-tag entry below)
The HTML-tag plan in the entry below was **wrong** and is now superseded. Adding an
HTML-tag verification did **not** resurface an "Add an owner" control: Google has
**removed the delegated-owner ("Add an owner") UI entirely** for properties that are
auto-verified via a Domain (DNS) parent — which all three sites are. Confirmed by
direct inspection of every "Ownership verification details" dialog (only lists
verification methods + DONE) and the legacy
`www.google.com/webmasters/verification/*` pages (now redirect to Overview). "Add
User" only ever grants Full/Restricted, never Owner. **There is no UI path.**
- **Working fix — the service account verifies *itself*.** New script
  `web/scripts/gsc-verify-sa.mjs` (copied into all three repos) uses Google's **Site
  Verification API** (FILE method): `token` mints a `google<hex>.html` token and
  writes it to `web/public/` (served at site root like the IndexNow key file);
  `verify` polls the live file then calls `webResource.insert` so the SA becomes a
  **standalone verified owner** — no delegation needed. The token file is permanent.
  Reads ORIGIN from `consts.ts`, so it's portable across all three repos unedited.
- **Orchestrated by one-off `activate-indexing.yml`** (per repo): mint token → build
  + deploy to `/docs` → commit/push → poll the live file → verify → confirm
  `google-index.mjs` returns `URL_UPDATED` (not 403).
- **Prereqs:** in the SA's GCP project (itin-499113), enable **both** the *Web Search
  Indexing API* **and** the *Site Verification API* (the latter had to be turned on
  during this work), plus the `GOOGLE_INDEXING_SA_KEY` secret in each repo.
- **Verified live on all three (403 → `URL_UPDATED`, 2 URLs EN+ES submitted, 0
  failed):** itincreditcard.com (Actions run 27356843866), itinlending.net
  (27357132955), itincreditscore.com (27357135225) — each printed
  `VERIFIED — service account is now an owner of https://<site>/`.
- The per-site `PUBLIC_GSC_VERIFICATION` HTML-tag tokens stay wired into
  `daily-content.yml` for **Bob's own GSC ownership**, but they are **not** what
  authorizes the SA (that's the Site Verification API token file).
- Docs updated: `OPERATIONS.md` (rewrote the Google Indexing API ownership section
  with the removed-UI reality + the Site Verification API method + `gsc-verify-sa.mjs`).
- Follow-ups: deleted the one-off `activate-indexing.yml` (all 3 repos) +
  `test-indexing.yml` (ITINCreditCard) now that activation is confirmed; daily
  pipeline keeps pinging via `google-index.mjs`.

## 2026-06-11 — GSC HTML-tag verification to unlock Indexing API delegated owner
**[SUPERSEDED — see the entry above. The "Add an owner" UI does not exist for these
properties; the HTML-tag step did not work. Kept for history.]**
The Google Indexing API kept returning **403 "Failed to verify the URL ownership"**
because the service account (`itin-indexing@itin-499113.iam.gserviceaccount.com`)
could not be added as a Search Console **owner**. Root cause: every property
(Domain `sc-domain:…` + the URL-prefix `https://…/`) is verified only by **DNS
("Domain name provider")**, and the URL-prefix property is "Automatically verified
via" its Domain parent. DNS-verified / auto-verified properties expose **no "Add an
owner" control** — only a token COPY button — so delegation is impossible. Google's
Indexing API requires the service account to be a **delegated owner**, and that
button only appears for properties verified by **HTML tag / HTML file**.
- **Fix:** added an HTML-tag verification on top of DNS for each URL-prefix property.
  The site already emits `<meta name="google-site-verification">` when
  `PUBLIC_GSC_VERIFICATION` is set (`web/src/components/Analytics.astro:19`,
  `consts.ts:46`), so wired each site's token into the **`Build + deploy to /docs`**
  env block of `daily-content.yml` (public identifier, sits with the other
  `PUBLIC_*` literals):
  - itinlending.net → `CvVq2ULyJsWJwR6FRFS9VAH45TO2nuQQ3YF9sL9tRyE`
  - itincreditcard.com → `pxWBVK2JLcqCm9SiLFhVnJzHIWa1ifynMkxnbY0V8hA`
  - itincreditscore.com → `tWSzgjecKJKlPKcnZIZ5GztpFb68K5G67-bnNP_AOBw`
- **Remaining manual steps (owner does these — Claude won't change access controls):**
  1. Deploy each site so the meta tag is live on the homepage.
  2. Search Console → property → Settings → Ownership verification → **HTML tag** →
     **Verify**.
  3. Same dialog → **Add an owner** (now present) → paste the service-account email.
  4. Re-run the daily workflow → Google step returns `URL_UPDATED` 200, not 403.
- Docs updated: `OPERATIONS.md` (Google Indexing API section — added the
  GSC-ownership/HTML-tag activation detail + `PUBLIC_GSC_VERIFICATION` per-site
  values).
- Follow-ups: none code-side; activation is owner-driven in the Search Console UI.

## 2026-06-11 — GA4 fix: "no data" on the 2 newer properties was an unpublished Reports view
User reported GA4 "isn't setup right" / "no data" for itincreditcard.com +
itincreditscore.com. **Data collection was never broken** — both sites were
collecting the whole time. The real issue was a GA4 *reporting* gap, plus cosmetic
cleanup. Verified + fixed:
- **Collection is healthy** (confirmed, not the problem): Measurement IDs match
  across code (`PUBLIC_GA4_ID` in the daily-content/seed-content workflow `env:`),
  `ANALYTICS-PLAN.md`, and GA4 admin — itincreditcard.com `G-TFJMHQLHMX` (property
  540443142, stream 15017092424) and itincreditscore.com `G-HDM7H448J9` (413651450,
  stream 6327021740). Live HTML on all 3 domains serves the correct `gtag/js?id=G-…`
  snippet (HTTP 200). Both streams show "Receiving traffic in past 48 hours." All 3
  properties live under the `itinlending.net` account (8860001).
- **ROOT CAUSE of "no data": the Reports snapshot was never set up on the two newer
  properties.** They were created via GA4's "business objectives" onboarding flow,
  which builds an objectives-based nav (Generate leads / Drive sales / …) and leaves
  the standard **Reports snapshot stuck on a "choose a template" empty screen** — so
  the home/Reports view looked blank even though data existed. **Fix:** published the
  **"User behavior"** snapshot template on both. They now show real data (last 28d):
  itincreditscore.com = **23 users / 106 events**; itincreditcard.com = **22 users /
  99 events**, with top-pages tables. (itinlending.net already had its snapshot set
  up, which is why only it "worked.")
- **Renamed all 3 properties** to a consistent `ITIN <X> / <domain>` pattern
  (lending's was the messy `http://itinlending.net - GA4`). Saving the lending rename
  forced GA4 to require the empty **Business details** fields — set to Industry
  **Finance**, size **Small (1–10)**, objectives **Generate leads + Understand web/app
  traffic** (accurate + reversible). Card/score already had business details.
- **Orphan account noted:** a stray **Timberline Ventures LLC** GA4 account
  (540524872) appears in the picker; current login has "Missing permissions" and
  **none of the 3 sites report to it** — ignore/delete via its owning login. The
  `41x` vs `540x` property-ID prefixes are creation-date timing, not a misconfig.
- **Aligned reporting time zones:** card + score were on LA time; set both to
  **(GMT-04:00) New York** to match lending + the playbook standard (US/Eastern). GA4
  warns the change only affects data going forward (possible flat spot/spike at the
  shift) — historical data is not reprocessed.
- Docs updated: `ANALYTICS-PLAN.md` (root-cause note, snapshot-setup gotcha for new
  properties, orphan-account note, property renames).
- Follow-ups (optional): delete the orphan Timberline account (needs its owning
  login); numbers are small because the sites are days old — revisit once traffic
  grows.

## 2026-06-08 — Google Indexing API: spider each new article ASAP (all 3 sites)
IndexNow only reaches Bing/Yandex/Naver/Seznam; Google ignores it and rediscovers
articles via sitemap crawl (slow). Added a Google-side push so each new daily post
gets crawled immediately.

- New `web/scripts/google-index.mjs` — pings Google's Indexing API
  (`urlNotifications:publish`, `URL_UPDATED`) with the new article's EN + ES URLs
  only. Reuses the `node:crypto` RS256 JWT pattern from `gsc-report.mjs`. Origin
  read from `consts.ts` (portable). Env-gated on `GOOGLE_INDEXING_SA_KEY` (falls
  back to `GSC_SA_KEY`); clean no-op until set. Replicated to all 3 repos.
- `daily-content.yml` — new "Ping Google Indexing API" step after IndexNow, gated
  on `steps.write.outputs.slug != ''` (fires only when a new article was written),
  non-fatal (`|| true`).
- **⚠ Policy caveat (documented in code + OPERATIONS.md):** Google officially
  scopes the Indexing API to JobPosting/BroadcastEvent pages. Works in practice for
  articles and widely used that way, but unsanctioned — may be ignored/rate-limited
  (200 URLs/day quota). Sitemap stays the supported path; this is an accelerant.
- **To activate:** create a GCP service account, enable the Web Search Indexing
  API, add its email as a **verified Owner** in Search Console, set the
  `GOOGLE_INDEXING_SA_KEY` secret per repo. Until then the step no-ops.
- Docs updated: OPERATIONS.md (new section + workflow-table row). Verified: origin
  regex resolves correctly for all 3 sites; no-key path no-ops cleanly.

## 2026-06-08 — Harden daily generator JSON parsing (fixes whole-run failures)
The daily content generator did a bare `JSON.parse` on model output, so a single
unescaped control char (typically a literal newline inside `bodyMarkdown`) threw
`Expected ',' or '}' ...` and aborted the entire day's run with no retry. On the
first scheduled run after the 2026-06-07 buildout, this killed **2 of 3 sites**
(itinlending, itincreditcard) — neither published, deployed, nor pinged IndexNow.
Confirmed pre-existing (the parse path was byte-identical before the refactor),
just model-output variance.

- `web/scripts/lib/generate.mjs`: `parseJsonBlock` now self-heals — on parse
  failure it escapes control chars **inside string literals only** (tracks string
  context so structural whitespace is untouched) and reparses. `generateArticle`
  retries the whole API call up to 3× for genuinely malformed output the
  sanitizer can't fix. Replicated to all 3 repos.
- Validated in production: the itinlending rerun logged
  `generateArticle: attempt 1/3 failed: ... position 7914` then recovered and
  published `itin-personal-loan` (IndexNow: 72 URLs). itincreditcard published
  `which-banks-accept-itin-for-credit-cards` (38 URLs). Both manual reruns green.
- Docs updated: this changelog. Pipeline behavior otherwise unchanged.
- Follow-ups / open items: IndexNow reaches Bing/Yandex/Naver/Seznam, **not
  Google** (by design — Google discovers via sitemap). GitHub frequently delays
  the 13:00 UTC cron by hours; that's best-effort scheduling, not a bug.

## 2026-06-08 — AdSense readiness audit + `google-adsense-account` meta tag (all 3 sites)
- **Audited AdSense setup** for all three sites after console showed "Getting
  ready" / ads.txt "Not found." Verified live: `ads.txt` (HTTP 200, correct
  `pub-1426577294682977`), AdSense loader in `<head>` (`async` + `crossorigin`),
  and top/end article ad units. Conclusion: nothing broken — the console statuses
  are Google crawl lag (files published Jun 6, last crawl Jun 6).
- **Added `<meta name="google-adsense-account">`** to `Analytics.astro` in all
  three repos (Itin, ITINCreditCard, ITINCreditScore), gated on the same
  `enableAds` (prod + `PUBLIC_ADSENSE_ID`) condition as the loader, as a
  belt-and-suspenders ownership signal alongside the loader. Built + deployed to
  each repo's `/docs`.
- Docs updated: this CHANGELOG; `project-docs/MONETIZATION.md` (verification note).
- Follow-ups: wait for Google re-crawl to flip "Getting ready" → "Ready" and
  ads.txt "Not found" → "Authorized" on all three. No further action needed.

## 2026-06-07 — @itinlending: account live, intro pinned, 10 follows, Week 1 scheduled
- **Profile applied + verified** on X: bio option #1, location United States,
  website https://itinlending.net, avatar + banner live.
- **Pinned intro** "why follow" post published and pinned (serves as Day 1's live
  post since launch was mid-day).
- **Followed 10 vetted, active, on-topic accounts** (paced for a freshly-flagged
  new account): @WeAreUnidosUS, @UnidosUS_Econ, @UnitedWeDream, @Remitly,
  @selfhelpcu, @ProsperityNow, @IRSnews, @SABEResPODER, @YourVoiceAtIRS,
  @felixpago. Skipped dead/dormant/wrong-entity handles (e.g. @NILC, Novacredit
  SOFOM, @welcometech=personal) and several guessed handles that 404'd
  (@AmerImmCouncil, @AccionOppFund, @MAFvoices) — need real-handle lookup later.
- **Fixed a weekday bug in SOCIAL-CALENDAR-2026-06.md:** Jun 7 2026 is a Sunday,
  not Saturday; every weekday label was off by one. Corrected all 30 date headers
  and the ~13 in-body weekday openers ("Sunday reminder", "Domingo", "Monday
  move", etc.) to the real weekday of each date.
- **Week 1 fully scheduled via X native composer** (9:00 AM / 6:00 PM ET) — 13
  posts: Day 1 AM → Tue Jul 7 9:00 AM (tail, Day 1's live slots had passed) and
  Days 2–7 AM+PM on their real dates (Jun 8–13). Each confirmed via the "Will
  send on…" dialog before submitting.
- **280-char overflow resolved by trimming** (user decision: trim to fit, not
  Premium). Spanish/EN value posts that ran over the non-Premium 280 limit
  (URL = 23 chars) were tightened in-composer AND in the calendar doc: Day 2 PM,
  Day 4 PM ("de forma honesta"→"honesto"), Day 5 PM, Day 6 PM, Day 7 PM.
- **Pace decision (user):** schedule Week 1 now, then pause for a check-in before
  loading Weeks 2–4 onto a freshly-flagged new account.
- Docs updated: SOCIAL-CALENDAR-2026-06.md (weekday fix, scheduling status block,
  Day 4 PM trim), this CHANGELOG.
- Follow-ups: (1) on user go-ahead, schedule Weeks 2–4 (Days 8–30) + Day 1 PM
  (tail Jul 7 6 PM), trimming the remaining over-280 Spanish posts first;
  (2) real-handle lookup for the follow targets that 404'd.

## 2026-06-07 — @itinlending X account: brand assets, profile copy, 30-day calendar, follow plan
- Designed brand-matched **avatar** (1000x1000) + **header/banner** (1500x500) for
  the @itinlending X account, saved to `~/Downloads` (navy #11366B→#0C2750 +
  green #1B9E5A, same letterform mark as favicon). Generated via Pillow.
- New `project-docs/SOCIAL.md`: profile fields (display name, website
  itinlending.net, location), 3 bio options (≤160), a pinned "why follow" post
  (EN + ES), and a **compliant follow strategy** + categorized target list.
- New `project-docs/SOCIAL-CALENDAR-2026-06.md`: 30-day starter calendar, 60
  posts (2/day, 42% Spanish), written to the `itin-social` voice/compliance rules.
  URL included on 24/60 posts (40%, per request); rest are pure value. 0 em dashes
  in post bodies.
- Updated `itin-social` skill with the live handle @itinlending and lending-first
  scope note. Indexed both new docs in `README.md`.
- **Declined** the requested auto-follow bot (10 follows/30 min for 48h ≈ 480
  follows). Reason: violates X platform-manipulation/spam policy and is a top
  suspension trigger for new accounts. Documented the safe manual alternative in
  SOCIAL.md instead.
- Account is lending-only for now (links itinlending.net), per the @itinlending
  branding — not the original all-3-sites design.
- Docs updated: SOCIAL.md (new), SOCIAL-CALENDAR-2026-06.md (new), README.md,
  itin-social skill.
- Follow-ups: (1) apply profile copy + schedule posts on X (manual or via
  Claude-in-Chrome while logged in); (2) optional: web-search a vetted list of
  confirmed @handles for the follow targets; (3) confirm whether the account
  should stay lending-only or expand to all 3 ITIN sites.

## 2026-06-07 — New `itin-social` skill: one bilingual social voice for all 3 ITIN sites
- Created `~/.claude/skills/itin-social/SKILL.md`, modeled on the `pour-picks`
  social-reply skill but adapted for the ITIN family. Drives **one** social
  account (X/IG/FB/Reddit/TikTok/Threads) that writes human, value-first replies
  and original posts for ITIN holders.
- Routes the ~30% of replies that get a link to the single most relevant of the
  three sites by topic: loans/mortgages → itinlending.net, cards →
  itincreditcard.com, scores/building → itincreditscore.com (uses `/es` paths
  for Spanish replies). The other ~70% are pure-value, no link.
- Bilingual: replies in Spanish when the post is in Spanish.
- Bakes in YMYL/immigrant-finance compliance guardrails: no approval/rate
  guarantees, no immigration/legal advice, never assume immigration status
  (ITIN ≠ undocumented), no invented lender/rate facts, and active scam warnings
  (upfront-fee "guaranteed approval," CPN/"new credit identity" fraud).
- Org-account voice only — no personal byline (per standing no-byline rule).
- Trigger phrases: "ITIN reply", "reply as ITIN", "ITIN post", "ITIN social", etc.
- Docs updated: this CHANGELOG.
- Follow-ups: confirm the actual social handle(s) once the account exists so the
  skill can reference it; consider an `itin-social` section in a future SOCIAL.md
  if a content calendar/cadence gets formalized.

## 2026-06-07 — SEO automation buildout: bilingual pipeline, internal-link mesh, schema, content velocity, GSC report (all 3 ITIN sites)
Implemented the 5 ranked recommendations from the 2026-06-07 audit across
itinlending, itincreditcard, itincreditscore. All shipped to all 3 repos.

1. **Spanish articles are now real translations, not English-with-Spanish-chrome.**
   Split the single `articles` collection into two collections sharing one
   `articleSchema`: `articles` (EN) + `articlesEs` (es-419, `articles-es/<slug>.md`,
   same slug). `/es/articles/[...slug].astro` now builds one page per EN slug and
   serves the ES twin if present, else **falls back to the EN entry** (no 404s
   pre-backfill). New `lib/translate.mjs` does a second (no-tools) Claude call →
   es-419. Fixes the P1 from the audit.
2. **Internal-link mesh.** `relatedSlugs` is now auto-populated via
   `lib/articles.mjs` `computeRelated` (token-overlap + same-category, ITIN-aware
   stop words). `daily-post.mjs` and new `backfill.mjs` relink the full EN + ES
   dirs after every write. Backfilled all existing articles.
3. **Schema gaps.** New `ServiceSchema.astro` (FinancialService) on every
   `MoneyPageLayout`; new `CollectionPageSchema.astro` (CollectionPage + ItemList)
   on `/articles` and `/es/articles`. Verified in built HTML on all 3 sites.
4. **Content velocity + pillar.** New `seed-content.mjs` (`--count N` detail
   articles `+ --pillar`) + `seed-content.yml` (manual dispatch). All current
   articles are `tier: detail`; pillar still needs a one-shot run per site.
5. **Weekly GSC EN/ES diff.** New `gsc-report.mjs` (last-7d-vs-prior-7d, EN/ES
   split, JWT via `node:crypto`, no googleapis) + `gsc-report.yml` (Mondays).
   Env-gated on `GSC_SA_KEY`/`GSC_PROPERTY` — no-ops until wired.

Refactor: shared `web/scripts/lib/` (generate, translate, build-md, articles,
publish) so all content scripts are portable across the 3 repos (site identity
read from `consts.ts`). `daily-content.yml` gained a backfill step + a
content-change detector and now commits all of `web/src/content`.

- Docs updated: `CONTENT-PIPELINE.md` (two collections, shared lib, backfill,
  seed, mesh), `SEO-AEO.md` (Service/CollectionPage schema, GSC report).
- Verified: all 3 sites build clean; FinancialService + CollectionPage + ItemList
  present in dist; relatedSlugs populated on all existing articles.
- Follow-ups / open items: **translations run in CI only** — no local
  `ANTHROPIC_API_KEY`, so ES twins are currently EN-fallback until the next daily
  run's backfill step generates them. Run `seed-content.mjs --pillar` once per
  site to add the pillar. Wire `GSC_SA_KEY`/`GSC_PROPERTY` to activate the report.

## 2026-06-07 — Full cross-site SEO/AEO audit (4 sites) + bilingual playbook dimension
- Added a **bilingual/multilingual reporting dimension** to the global SEO playbook
  (`~/.claude/CLAUDE.md`): new Step 1.5 (run every web-track step per locale), a
  per-locale callout in Step 2, an `inLanguage`-must-match-locale check in Step 5,
  and a per-locale split in the Step 7 weekly loop. Reason: site-wide GSC averages
  hide the failure mode where one language ranks and the other is dead weight.
- Ran a code-level SEO/AEO/schema/bilingual/technical audit across all 4 sites
  (itinlending, itincreditcard, itincreditscore, pourpicks) via parallel agents.
- **Headline finding (P1, all 3 ITIN sites):** `/es/articles/[slug]` routes render
  the EN-only article collection — Spanish article URLs serve English BODY content
  with Spanish chrome. hreflang/`inLanguage` now claim `es-419` but the body is
  English → duplicate-content + undercuts the Spanish-ranking goal. NEEDS verify+fix.
- Other recurring P1/P2s: money pages lack Product/Service/SoftwareApplication
  schema; `/articles` index lacks CollectionPage+ItemList; thin content (2–3
  articles/site); some long titles (itincreditcard) / >160-char meta descriptions.
- PourPicks (EN-only app site): P1 SearchAction points at non-existent `/search`;
  AASA deep links incomplete; og:image is a 96px icon. Localization deferred (correct).
- Docs updated: this CHANGELOG. Full findings live in conversation; fixes pending
  owner prioritization (not yet implemented).
- Follow-ups: confirm + fix the ES-article-body issue first (highest leverage for
  Spanish ranking); then schema gaps on money/index pages; then content depth.

## 2026-06-07 — Fix schema `inLanguage` per page + sitemap hreflang alternates (3 ITIN sites)
- Bug: every schema component hardcoded `inLanguage: SITE.locale` (the site's EN
  locale), so `/es` pages were labeled `en-US` in their JSON-LD — telling Google
  the Spanish content was English and undercutting Spanish-query ranking.
- Fix: schema language now follows the page. Added a `locales` map + `localeFor()`
  helper to `i18n/ui.ts` (en→`en-US`, es→`es-419` Latin-American Spanish), and
  `WebSiteSchema`, `AboutPageSchema`, `ArticleSchema` (all 3 repos) now derive
  the locale from the URL via `getLangFromUrl`. `WebSiteSchema` also swaps to
  `SITE.descriptionEs` on ES pages; `AboutPageSchema` URL now points at `/es/about`
  on ES.
- Enhancement: sitemap now emits reciprocal `<xhtml:link rel="alternate">`
  (en/es/x-default) per URL via a `serialize()` hook in `astro.config.mjs` (all 3
  repos) — belt-and-suspenders on the in-`<head>` hreflang. Built-in `i18n` option
  doesn't fit because EN is un-prefixed and ES is path-prefixed.
- Verified in built output: EN about→`en-US`, ES about→`es-419`; sitemaps carry
  3 hreflang links per URL. All 3 sites build clean.
- Docs updated: SEO-AEO.md (hreflang + new inLanguage bullet), this CHANGELOG.
- Follow-ups: not yet deployed to `/docs` or pushed — awaiting owner go-ahead.

## 2026-06-07 — Daily content reformatted as reader Q&A with varied depth (3 ITIN sites)
- Rewrote the `daily-post.mjs` system-prompt structure block (all 3 repos) so daily
  articles read as a Q&A between real readers and the editorial team: H2s are now
  first-person reader-style questions, with rotating italic lead-ins
  (*"A question we hear often:"* etc.) on about half the sections.
- Explicitly forbids fabricated names/personas/testimonials (authenticity + avoids
  QAPage-schema misuse and FTC fake-endorsement risk on YMYL finance content).
- Added answer-depth variation: most sections ~134–167 words, but 2–3 sections run
  two full paragraphs (~250–320 words); raised target length to 1000–1600 words.
- Script change only — runs in GitHub Actions; no site rebuild needed.
- Docs updated: CONTENT-PIPELINE.md (structure description), this CHANGELOG.
- Follow-up: the *real* version (genuine reader questions → valid QAPage schema) is
  still the goal once a backlog of actual submitted questions exists.

## 2026-06-06 — Remove personal byline from all published content (3 ITIN sites)
- Standing rule from owner: never put his personal name/byline on published content
  unless explicitly told. Replaced the individual byline everywhere with the
  org-level editorial team anchor (`SITE.editorial.name`).
- `ArticleLayout.astro` (all 3 repos): visible byline + `ArticleSchema` author now
  hard-coded to `SITE.editorial.name`, so no frontmatter `author` can leak a personal
  name regardless of the article source.
- `web/scripts/daily-post.mjs` (all 3 repos): author now derived from the `editorial`
  block in consts (falls back to site name), not the `founder` name — future daily
  posts never embed a personal name in frontmatter.
- Cleaned existing article frontmatter (5 files) from `Bob Guillow` to each site's
  editorial team name.
- Built + deployed all 3 sites to `/docs`.
- Docs updated: this CHANGELOG. Memory: added standing rule `feedback_no_byline`.
- Follow-ups: ENTITY-SHEET.md and Organization/founder schema still reference the
  owner as the legal/entity anchor (intentional, not a content byline) — left as-is.

## 2026-06-07 — Indexation audit (`site:` operator) across 4 domains + legacy-redirect verification
- Ran Google `site:` searches (with `&num=100`) for all 3 ITIN sites + pourpicks.app to
  enumerate what Google has actually indexed. Counts:
  - **itinlending.net = 16** (8 new + 8 legacy WordPress URLs).
  - **itincreditcard.com = 4** (home + only the 3 pages request-indexed on 2026-06-06; the
    rest of the cluster is not yet picked up — confirms the sitemap-only crawl is slow).
  - **itincreditscore.com = 10** (3 new + 7 legacy GoDaddy/`/f/` URLs).
  - **pourpicks.app = 14** (all current pages, zero legacy cruft — cleanest of the four).
- **Legacy-redirect audit — both ITIN sites already correct, NO changes made:**
  - itinlending.net: all 8 indexed legacy URLs (`/itin-credit-card`, `/basics-of-lending`,
    `/itin-application-2`, `/category/itin-vs-ssn`, `/what-is-an-itin`,
    `/apply-for-an-itin-loan`, `/2023/11/…`, `/page/5`) resolve via the physical directory
    stubs in `web/public/` — correct, because these WordPress URLs are indexed WITH a
    trailing slash (GH Pages serves `<path>/index.html`).
  - itincreditscore.com: all 7 indexed legacy URLs are GoDaddy-builder paths indexed
    WITHOUT a trailing slash (confirmed by reading the result hrefs — e.g.
    `/credit-reports-with-itin`, `/f/understanding-itin-and-your-credit-score`). The Astro
    `redirects` in `astro.config.mjs` emit `<path>.html`, which GH Pages serves for the
    no-slash form. Verified live: no-slash → HTTP 200 (meta-refresh fires); trailing-slash
    → 404, but Google indexed the no-slash form, so the redirects work as indexed.
  - Takeaway for future agents: the two sites correctly use DIFFERENT redirect mechanisms
    because their prior CMSes had different trailing-slash conventions (WordPress = slash →
    directory stubs; GoDaddy = no slash → `.html` redirects). Don't "unify" them.
- **Request-indexing still BLOCKED:** retried the 2026-06-06 follow-up (itincreditcard.com
  /unsecured-credit-cards) on the new calendar day — still "Quota Exceeded." The ~10/day
  account-wide cap resets on a rolling window, not at local midnight, so it had not freed up.
  The tomorrow USER TASK below still stands.
- Docs updated: this CHANGELOG. Follow-ups: the 2026-06-06 request-indexing USER TASK list
  is unchanged (retry once the rolling quota frees up); consider eventually 410-ing rather
  than 301-ing the lowest-value legacy URLs if they keep consuming crawl budget.

## 2026-06-06 — Google Search Console: resubmitted sitemaps + request-indexed top URLs (all 3 ITIN sites)
- Fulfills the **USER TASK** flagged in the 2026-06-06 internal-linking entry (Google
  request-indexing is UI-only). Done via the GSC web UI on the shared account; all three are
  Domain properties (`sc-domain:<domain>`).
- **Sitemaps resubmitted** (nudges re-crawl) on all 3: `sitemap-index.xml` — itinlending.net
  (68 pages), itincreditcard.com (34), itincreditscore.com (36). All "Success".
- **URL Inspection → Request Indexing** run on the highest-value pages (priority crawl queue):
  - **itinlending.net (7):** itin-loans, itin-mortgage, itin-personal-loans, itin-auto-loan,
    itin-credit-cards, itin-business-loans, how-to-get-an-itin. Homepage already indexed.
  - **itincreditcard.com (3):** itin-credit-cards-guide, secured-credit-cards,
    credit-cards-that-accept-itin.
  - **itincreditscore.com (0):** quota hit before any could be requested.
- **Daily quota hit:** Google's request-indexing cap is ~10/day **account-wide** (not
  per-property). After 10 successful requests (7 + 3), the 11th (itincreditcard.com
  /unsecured-credit-cards) returned "Quota Exceeded — try again tomorrow." Sitemaps are the
  scalable path and already cover every page, so the rest will still be crawled.
- Operational note for future agents: the **REQUEST INDEXING** button frequently needs a
  second click — the first often doesn't register (status stays "REQUEST INDEXING"). Always
  screenshot-verify "Indexing requested" before moving on.
- Docs updated: this CHANGELOG. **Follow-ups (USER TASK, tomorrow — quota resets daily):**
  request-index the remainder — itincreditcard.com: unsecured-credit-cards,
  build-credit-with-itin, business-credit-cards, how-to-get-an-itin; itincreditscore.com
  (prioritize legacy-equity pages): check-credit-score-with-itin, credit-bureaus-and-itin,
  itin-credit-score-guide, build-credit-history-with-itin, improve-credit-score,
  credit-builder-loans, how-to-get-an-itin. Stagger across days (~10/day account-wide).

---

## 2026-06-06 — Per-cluster accent hero (all 3 ITIN sites): fix "every page looks the same"
- **Problem (user-reported):** navigating between money pages felt like staying on the same
  page — every hero was the same oversized blue full-bleed template (same composition, same
  `rgba(12,39,80)` overlay, same lead form). Not a scroll bug; sites have no view transitions,
  so reloads correctly reset to top — the above-the-fold was just identical everywhere.
- **Fix (targeted, chosen over a full redesign):** each money page now renders a distinct
  hero identity with **zero per-page edits**:
  - `MoneyPageLayout.astro` derives a per-cluster **accent color** (curated 6-color fintech
    palette, cycled by the page's index in `PRODUCTS` so siblings never collide) and the
    matching **product icon**, then sets `--hero-accent` inline + adds the `hero--accent`
    class. Pages not in `PRODUCTS` fall back to a stable per-slug hash.
  - `global.css`: the photo overlay (`.hero--accent.hero--image::after`) is re-tinted with
    the accent via `color-mix`, fading to alpha on the right so the hero photo still shows
    through (no wasted LCP). Added an accent top stripe + a colored `.hero-badge` icon chip
    above the eyebrow. Hero padding trimmed `64/56 → 48/44` (addresses "hero is so large").
- Applied identically to all 3 repos (Itin, ITINCreditCard, ITINCreditScore); verified in
  the browser (mortgage = blue, credit-cards = violet, etc., photo visible, contrast intact).
- Docs updated: this CHANGELOG. Follow-ups: none — homepage hero unchanged (it's the home).

---

## 2026-06-06 — Internal-linking pass for indexing (all 3 ITIN sites) + Pour Picks P4 page
- **Problem:** interior pages across all 3 ITIN sites sit at "Discovered – currently not
  indexed" — a crawl-budget/authority issue. Fix = strong internal links from the already-
  indexed homepage (highest authority) + request-indexing.
- **All 3 ITIN homepages** (`web/src/pages/index.astro`): added a "Latest guides" section
  that pulls the 3 newest published articles via `getCollection('articles')` and links each
  article URL directly, so interior article URLs get a crawl path from the homepage.
- **itinlending.net only:** de-orphaned `itin-vs-ssn` by adding it to `PRODUCTS` in
  `web/src/consts.ts` (now surfaces in the homepage product grid + nav/footer).
- **Request-indexing:** ran `scripts/indexnow.mjs` on all 3 sites (Bing/Yandex) —
  itinlending 68 URLs, itincreditcard 34, itincreditscore 36, all HTTP 200. Google
  request-indexing is UI-only (see follow-up).
- **Pour Picks P4** (`~/PourPicks/web/src/pages/bourbon-inventory-app.astro`): new product-
  intent page targeting "bourbon inventory app" / "bourbon collection app" demand surfaced
  in GSC (`bourbon inventory app` 1 impr / pos 44). Quick Answer block, question-format H2s,
  Pour-Picks-vs-spreadsheet comparison table, FAQ + FAQPage schema, MobileApplication +
  Breadcrumb schema; linked from the homepage features section. Built, in sitemap, IndexNow-
  pinged (21 URLs, HTTP 200).
- Docs updated: this CHANGELOG. Follow-ups: (1) **USER TASK** — Google request-indexing is
  UI-only: in each property's GSC, use URL Inspection → Request Indexing on the homepage +
  top interior URLs (or resubmit the sitemap). (2) **USER TASK** — itinlending.net is an
  aged/re-registered domain (2019 WordPress legacy); check GSC → Security & Manual Actions
  for any inherited manual action that would explain the indexing drought.

---

## 2026-06-06 — Legacy-URL 404 recovery via redirects (itincreditscore + itinlending)
- **Root cause found via GSC + URL Inspection:** both sites were rebuilt onto Astro
  with all-new paths, so **every URL Google still indexes/ranks now 404s.** This was
  bleeding the sites' entire residual organic equity (~16k cumulative impressions on
  itincreditscore alone, led by `/credit-reports-with-itin` at 10,461 impr / pos 63).
  Homepages are indexed; interior pages are "Discovered – currently not indexed".
- **itincreditscore.com (11 URLs):** added an Astro `redirects` block in
  `web/astro.config.mjs`. Static build emits per-source meta-refresh + canonical +
  noindex HTML. Works here because the legacy URLs have **no trailing slash**, which
  matches `build.format:'file'` output (`/slug.html`).
- **itinlending.net (11 URLs):** legacy WordPress URLs are indexed **with trailing
  slashes** (date permalinks, `/category/`, `/page/N`). `format:'file'` would emit
  `/slug.html`, which GitHub Pages does NOT serve for `/slug/` requests — so instead
  added physical redirect stubs at `web/public/<path>/index.html` (covers both the
  slash and no-slash forms via GH Pages' own normalization). NOT using Astro
  `redirects` here (see note left in `web/astro.config.mjs`).
- Each dead URL maps to its closest **live (200)** intent-equivalent page; verified all
  targets resolve and all 22 legacy URLs now serve the redirect. Mappings were
  validated against Wayback content where snapshots existed (e.g. `credit-agencies`
  → `/credit-bureaus-and-itin`; the `/2023/..` personal-journey posts → mortgage /
  personal-loan / how-to-get-an-itin as topically matched).
- **itincreditcard.com:** zero impressions in 16 months — no legacy URLs to recover;
  its problem is pure indexing/authority (interior pages never crawled). Still open.
- Docs updated: this CHANGELOG. Follow-ups: (1) internal-linking pass homepage→interior
  on all 3 sites + request-indexing to fix "Discovered – not indexed"; (2) consider a
  dedicated `/credit-reports-with-itin` money page given its proven 10.5k-impr demand
  (currently consolidated to `/check-credit-score-with-itin`); (3) itinlending is an
  aged/re-registered domain (2019 legacy sitemaps) — check GSC → Manual Actions.

## 2026-06-06 — `seo-pulse` switched to OAuth (property-owner) auth — now live
- Switched `seo-pulse` GSC auth from the service account to **OAuth as the property
  owner** (`bguillow@gmail.com`). Reason: adding the new service-account email as a GSC
  user kept failing with "email not found" (Google identity propagation lag). OAuth
  authenticates as the owner, who already has access to every property, so **no
  per-property Add-User step is needed** and all Timberline properties are visible
  immediately.
- GCP (project `perfume-picks`): published the OAuth consent screen to **Production**
  (Testing-mode refresh tokens expire after 7 days) and created a **Desktop** OAuth
  client named `seo-pulse`. Saved to `.secrets/oauth_client.json` (chmod 600); the
  refreshed user token is cached at `.secrets/token.json` (chmod 600). Service-account
  key `.secrets/gsc.json` retained as a fallback.
- Code: `gsc.py` `_service()` now prefers OAuth (`InstalledAppFlow` → refresh →
  `token.json`) and falls back to the service account; `pulse.py doctor` reports auth
  mode + OAuth/SA presence; `requirements.txt` gained `google-auth-oauthlib` (installed
  in the venv).
- Verified live: `doctor` lists all owned properties as `siteOwner`; real GSC pulls
  succeed (e.g. itinlending.net "what is itn" pos 97; pourpicks.app has ~10 ranked
  queries). New sites legitimately show near-zero impressions — not an auth issue.
- Docs updated: `SEO-AEO.md` (seo-pulse pointer now describes OAuth, not the
  service-account key).
- Follow-ups: app is unverified in Production — owner sees the "Google hasn't verified
  this app" screen once and proceeds via Advanced; no verification submission needed for
  owner-only read-only use.

## 2026-06-06 — Added `seo-pulse` on-demand SEO skill + doc pointer
- New Claude skill at `~/.claude/skills/seo-pulse/` for ad-hoc realtime SEO pulls
  (separate from the scheduled daily report): free-only GSC rankings/longtail,
  Google Trends direction, Autocomplete keyword ideas, plus opportunity /
  cannibalization / content-gap analyzers. Never invents CPC/AdSense/volume (`n/a`).
- One shared service-account JSON key (`.secrets/gsc.json`) added as a Restricted
  user on every GSC property → **one key covers all Timberline sites**, not per-project.
- Docs updated: `SEO-AEO.md` ("Rank tracking & the Day-1 baseline" — added the
  on-demand `seo-pulse` pointer with triggers).
- Follow-ups: create the GCP service account + JSON key, add its `client_email` as a
  Restricted user on each property, then `pulse.py doctor` to confirm access.

## 2026-06-06 — Contact email → gmail mailto, address hidden behind labels
- The `hello@<domain>` contact addresses on all 3 sites were never real mailboxes.
  Repointed `SITE.supportEmail` in each repo's `consts.ts` to `bguillow@gmail.com`
  so the existing `mailto:` links deliver to a real inbox at no cost.
- **Visible address hidden:** every place that previously rendered the literal
  address now shows a generic label instead (Footer "Contact"; contact page
  "Email us" / ES "Escríbenos"; privacy/terms inline links "contacting us" /
  "Email us" / ES "escribiéndonos" / "Escríbenos"). The `mailto:` href is
  unchanged, so clicking still opens a pre-addressed compose window.
- **Schema/crawler exposure reduced:** removed `email: SITE.supportEmail` from
  `OrganizationSchema.astro` (JSON-LD) on all 3 sites, and changed the `llms.txt`
  Contact line from the email to the `/contact` page URL — so the personal gmail
  isn't broadcast in structured data or to AI crawlers.
- **Caveat (not solved):** `mailto:` still places `bguillow@gmail.com` in the page
  HTML href, so spam scrapers can harvest it. A forwarder (ImprovMX Premium /
  Cloudflare Email Routing) is the only way to keep a branded `hello@` address;
  deferred by the user in favor of this free approach.
- Docs updated: this CHANGELOG (contact email is separate from the Web3Forms lead
  pipeline in MONETIZATION, which is unaffected).
- Follow-ups: if spam becomes a problem, revisit a branded forwarder; remember the
  ImprovMX free tier is already used by pourpicks.app (3 ITIN domains would need
  Premium).

## 2026-06-06 — Corporate-anchor schema + IndexNow expansion + entity sheet
- **Corporate anchor (#2):** wired the Timberline corporate URL + Wikidata into all
  3 ITIN sites' nested-publisher Organization schema. Added `publisher.url` /
  `publisher.wikidata` to each `consts.ts`; `OrganizationSchema.astro` now emits the
  publisher Org with corporate `url` + Timberline `sameAs`. Site self-identity (own
  url + own-QID `sameAs`) left intact. Closes the SITES.md corporate-anchor follow-up.
- **IndexNow (#1):** added IndexNow automation to PourPicks, StickPicks, PerfumePicks,
  and TimberlineVentures, mirroring ITIN's setup but using each repo's existing `.sh`
  script style. New `indexnow.yml` per repo (build → ping on `docs/**` push +
  `workflow_dispatch`); generated missing public keys + key files; created Timberline's
  two `.sh` scripts from scratch (host timberlineventuresllc.com).
- **Entity sheet (#3):** wrote `ENTITY-SHEET.md` — canonical name/description/URL/`sameAs`
  facts per property for verbatim use on Crunchbase/LinkedIn/OpenCorporates/Product
  Hunt/Bing profiles. No fabricated dates (only real Pour Picks 2026-05-09 inception).
- **Verification:** all 4 builds compile clean (ITIN 72/CC 38/CS 40 pages; Timberline
  6 pages + `dist/sitemap-0.xml` produced).
- **Docs updated:** SEO-AEO.md (corporate-anchor + IndexNow-expansion + entity-sheet
  sections), new ENTITY-SHEET.md.
- **Follow-ups:** not yet committed/pushed (awaiting user OK). Off-site profile
  creation (Crunchbase/LinkedIn/OpenCorporates/Product Hunt/Bing) + GSC sitemap
  submission are user-executed; the real notability fix for the new Wikidata items.

## 2026-06-06 — Paid-traffic arbitrage analysis written (PAID-ARBITRAGE.md)
- **Why:** evaluated a proposed Google Ads → AdSense arbitrage across all 3 ITIN
  sites. Wrote up a numbers-driven deep dive.
- **Findings:** Google Ads → **AdSense** arbitrage on finance keywords is a
  structural loss (AdSense pays ~$0.005–$0.03/visit vs $0.30–$14 CPCs = recover
  ~0.1–6% of spend) **and** a policy/ban risk for the shared `ca-pub-1426577294682977`
  account. The only winnable version is Google Ads → **lead/affiliate** conversion,
  whose best margin pocket is **Spanish-language keywords** (~⅓ the CPC of EN,
  identical intent, sites already bilingual).
- **Blocker noted:** can't run any test yet — all `PUBLIC_AFFILIATE_URL_*` env vars
  are unset (CJ pending) and there's no lead-buyer, so paid traffic today would
  monetize via AdSense only = guaranteed loss. Prereq: CJ approval or a lead-buyer
  contract live first.
- **Deliverable:** real (benchmark-estimated) keyword + CPC tables per site,
  break-even model, Keyword Planner procedure to get live numbers, and a
  $300–$500 ES-first micro-test plan with pre-committed kill criteria.
- Docs updated: `PAID-ARBITRAGE.md` (new file), `README.md` (index entry),
  `MONETIZATION.md` (cross-reference note).
- Follow-ups: instrument Ads/GA4 conversions + compute organic EPC per money page
  (free, can do now); revisit paid testing once affiliate/lead revenue is live.

## 2026-06-06 — Timberline corporate site fully launched + new-site playbook written

- **Timberline Ventures corporate site** (`timberlineventuresllc.com`) launched end-to-end:
  - GitHub repo: `bguillow-rgb/timberline-ventures` (public)
  - GitHub Pages enabled, built from `main /docs`
  - DNS: 4× A records (185.199.108–111.153) + www CNAME → `bguillow-rgb.github.io`
  - GA4 property G-S39L4K4RRB (property 540524872, stream 15017547029) wired + rebuilt
  - GSC: DNS TXT record `google-site-verification=b2OqNi0lhDcUm5lfQYRDprwqxZHC0FYGzDd1-9mXXPM` added to GoDaddy DNS and propagated. **Pending:** manual verify click in GSC (one-time; Angular blocks JS isTrusted clicks). URL: `https://search.google.com/search-console/ownership?resource_id=sc-domain:timberlineventuresllc.com`
  - HTTPS enforcement: pending SSL cert provisioning by GitHub (~20 min after DNS propagated). Retry: `gh api --method PUT repos/bguillow-rgb/timberline-ventures/pages --field https_enforced=true`
  - Sitemap pending submission after GSC verified.
- **New-site playbook** written at `project-docs/NEW-SITE-PLAYBOOK.md` — covers all 10 phases: repo → GitHub Pages → DNS → build/deploy → GA4 → GSC (including TXT token extraction technique) → HTTPS → schema → entity graph → ITIN extras → post-launch checklist.
- Docs updated: `SITES.md` (Timberline anchor section), `README.md` (playbook entry), `NEW-SITE-PLAYBOOK.md` (new file), `ANALYTICS-PLAN.md` (add Timberline GA4 property — still pending).

## 2026-06-06 — Strengthened Wikidata items + wired picks-app QIDs into their repos
- **Why:** reduce Wikidata deletion (notability) risk on the brand-new self-created
  items, and finish the entity-graph wiring for the 3 picks apps.
- **What changed (Wikidata):**
  - Added a `reference URL` (P854 = the site itself) to the `official website` (P856)
    statement on all 7 items, so each is sourced.
  - Pour Picks (`Q140083291`, the only live app): added `App Store app ID` (P3861 =
    6764040132, sourced with the App Store URL) + `inception` (P571 = 2026-05-09).
  - Deduped: a throttled retry had silently created a 2nd P3861 claim server-side;
    removed the duplicate so Pour Picks has exactly one.
  - Did **not** fabricate founding dates / coverage for the ITIN sites or the two
    unlaunched apps — real external refs to be added as they materialize.
- **What changed (repos):** wired each picks app's QID into its own
  `OrganizationSchema` via `SITE.orgSameAs` — `~/PourPicks` (appended to existing
  `orgSameAs`), `~/StickPicks` + `~/PerfumePicks` (added a new `orgSameAs` field and
  pointed the schema at it; previously their Org `sameAs` reused the founder's).
- **Docs updated:** `SEO-AEO.md` (Wikidata section — references, Pour Picks rows,
  throttle/dup note, picks-repo wiring, notability status).
- **Follow-ups:** add referenced statements (App Store IDs once Stick/Perfume launch,
  third-party coverage) to keep items above the notability bar.

## 2026-06-06 — Added official website (P856) to Timberline Wikidata item
- Timberline Ventures LLC (`Q140082434`) was missing `official website`; added
  `https://timberlineventuresllc.com` (P856). The 6 brand items already had theirs.
- Docs updated: `SEO-AEO.md` (Wikidata table — Timberline row).

## 2026-06-06 — Wikidata entities created for all 7 properties + wired into sameAs
- **Why:** Wikidata is a primary Knowledge-Graph input and the top `sameAs` target
  AI engines reconcile against. Giving each brand its own item plus a Timberline
  parent item makes the ownership graph machine-readable and closes the
  Organization `sameAs` chain (entity/AEO lever).
- **What changed:**
  - Created 7 Wikidata items (account `User:Bg23318`): Timberline Ventures LLC
    `Q140082434` (P31 business enterprise, P1454 LLC, P17 US); children each with
    P31 / P856 official website / P127 owned-by-Timberline — ITIN Lending
    `Q140082776`, ITIN Credit Card `Q140083128`, ITIN Credit Score `Q140083287`,
    Stick Picks `Q140083289`, Perfume Picks `Q140083290`, Pour Picks `Q140083291`
    (3 picks apps as P31 mobile app).
  - Statements applied via the MediaWiki `wbeditentity`/`wbcreateclaim` API through
    the logged-in browser session (UI click-path was unreliable).
  - Wired each ITIN site's own QID + the Timberline QID into `publisher.sameAs`
    in `consts.ts` for all 3 ITIN repos (`~/Itin`, `~/ITINCreditCard`,
    `~/ITINCreditScore`); `OrganizationSchema` emits them on the Org node.
- **Docs updated:** `project-docs/SEO-AEO.md` (new "Wikidata entities" section).
- **Follow-ups / open items:**
  - Notability/deletion risk on bare self-created commercial items — strengthen
    with referenced statements (App Store IDs, founding date, third-party coverage).
  - Wire the 3 picks-app QIDs into their own repos' schema (tracked per-app, not here).
  - Account creation was done by the user (Bg23318); agent does not create logins.

## 2026-06-06 — Timberline Ventures LLC corporate site built (timberlineventuresllc.com)
- **Why:** Timberline Ventures needed a public entity anchor so AI engines and
  Google can confirm who operates the 6-brand portfolio. E-E-A-T / entity-graph
  hygiene requires a consistent publisher URL across all ITIN sites' JSON-LD and
  all 3 Picks apps' schema.
- **What was built** (repo: `~/TimberlineVentures`):
  - Dark-premium Astro static site at `timberlineventuresllc.com`. Same pattern
    as the ITIN/Picks sites; builds to `/docs` for GitHub Pages.
  - Pages: `/` (hero + 6-brand portfolio grid + values + FAQ), `/about` (entity
    anchor), `/contact`, `/privacy`, `/terms`, `/404`.
  - Free hero imagery: Unsplash forest photos downloaded locally to
    `web/public/assets/` (no hotlinks; LCP-safe).
  - Branded SVG favicon + 512px PNG icon (forest-green bg, gold pine-tree mark).
  - **Schema:** `Organization` listing all 6 brands as `subOrganization` +
    `owns`; `WebSite`; `Person` (founder); `AboutPage`; `BreadcrumbList`;
    `FAQPage` (5 Q&As on homepage).
  - **AEO:** `robots.txt` allow-list for all major AI crawlers, `llms.txt`
    (portfolio + citation notes), auto-generated `sitemap-index.xml`.
  - `Analytics.astro` gated on `PUBLIC_GA4_ID` env var (not yet set; add after
    creating a GA4 property for this domain).
  - Build verified: 6 pages, zero errors, `.nojekyll` present.
- **Portfolio listed:** ITIN Lending, ITIN Credit Card, ITIN Credit Score,
  Pour Picks (live App Store link), Stick Picks, Perfume Picks.
- Docs updated: SITES.md (add corporate site row), CHANGELOG.md (this entry).
- Follow-ups:
  1. Create a GitHub repo for `~/TimberlineVentures` (public, so Pages deploys free).
  2. Enable GitHub Pages → source: `main /docs`.
  3. Set DNS: A records for `timberlineventuresllc.com` → GitHub Pages IPs
     (185.199.108-111.153); bind custom domain in Pages settings.
  4. Create a GA4 property + set `PUBLIC_GA4_ID`, rebuild, push.
  5. Add GSC domain property + submit `sitemap-index.xml`.
  6. Update all 3 ITIN sites' `Organization` schema `url` field to reference
     `https://timberlineventuresllc.com` as the publisher entity URL.

## 2026-06-06 — Applied to CJ advertiser programs across all 3 ITIN verticals
- **Why:** with the 3 ITIN sites now registered as CJ Promotional Properties, the next
  step is securing approved advertiser relationships so the `PUBLIC_AFFILIATE_URL_*`
  env vars can eventually be filled with real CJ deep links (per-product money-page
  CTAs, see `MONETIZATION.md`).
- **Mechanism discovered:** CJ's Find Advertisers "APPLY TO PROGRAM" flow submits the
  application directly with **no per-application property picker** — applications attach
  to the publisher account, and advertisers review *all* registered properties (now
  including the 3 ITIN sites) during their manual review. So registering the properties
  was the enabling step; there is no per-app property selection to get wrong. All
  programs are "Manual application review."
- **What changed (this session):** applied to 2 on-topic US consumer credit-card
  programs for the previously-thin card vertical — **Venmo Credit Card** (7729262) and
  **PayPal Cashback Mastercard** (7754063). Filtered via Category → Financial Services →
  Credit Cards; deliberately skipped the 3 APAC (Singapore/Malaysia) and 1 UK card
  programs as wrong-geo, and skipped debit cards / excellent-credit-only premium cards
  as poor fit for an ITIN credit-builder audience.
- **Pending-application inventory (14 total) after this session**, grouped by site:
  - Credit cards (itincreditcard.com): Venmo Credit Card, PayPal Cashback Mastercard.
  - Loans (itinlending.net): LendingTree, Mortgage Research Center, myAutoloan.com.
  - Credit reporting/repair (itincreditscore.com): Experian, Sky Blue Credit, Tradeline
    Supply Company.
  - Banking (cross-site): Axos Bank, BMO.
  - Non-US / unrelated leftovers (no action): Fairstone Canada Personal Loans (CA),
    Sainsbury's Bank (UK), FragranceX.com + Heliumking (prior Perfume Picks work).
- **Docs updated:** `MONETIZATION.md` (CJ application-status note under current state).
- **Follow-ups:** wait on manual advertiser review (varies per advertiser); as programs
  approve, pull the CJ deep link per product and fill the matching
  `PUBLIC_AFFILIATE_URL_*` var in `web/src/consts.ts`; consider FlexOffers + Bankrate
  publisher program as more accessible routes for any verticals that get declined. Do
  **not** misrepresent property/traffic to force approvals.

## 2026-06-06 — Registered all 3 ITIN sites as CJ Promotional Properties
- **Why:** the CJ publisher account only had the unrelated `Perfume Picks` property
  (ID 101759456), so any financial advertiser (e.g. Capital One) reviewing an
  application saw a fragrance site and would decline on relevance/brand-safety
  grounds. CJ requires each website to be registered as its own property before
  applying to advertisers.
- **What changed:** created 3 new Promotional Properties via the CJ members UI, each
  type Website / primary model Content/Blog/Media / status Active, with on-topic
  bilingual descriptions and tags:
  - ITIN Lending — itinlending.net — Property ID 101772772
  - ITIN Credit Card — itincreditcard.com — Property ID 101772770
  - ITIN Credit Score — itincreditscore.com — Property ID 101772773
- CJ creates properties Active with no separate meta-tag verification step;
  advertisers do their own review on application.
- **Docs updated:** `MONETIZATION.md` (new "CJ Promotional Properties" table +
  current-state note).
- **Follow-ups:** apply per property to ITIN-relevant advertiser programs
  (secured-card/fintech issuers; consider FlexOffers + Bankrate publisher program as
  more accessible routes than Capital One); then fill `PUBLIC_AFFILIATE_URL_*` env
  vars in `web/src/consts.ts` with the approved CJ deep links. Do **not**
  misrepresent property/traffic to force approvals (CJ terms / ban risk).

## 2026-06-06 — Submitted all 3 sites to Google + Bing; one-off IndexNow ping
- **Why:** new Astro URLs weren't indexed yet (Day-1 `site:` check). Getting all 3
  sites into GSC + Bing Webmaster Tools is the foundation for indexation, rank
  tracking, and AEO (Bing feeds ChatGPT/Copilot).
- **Google Search Console:** all 3 domains verified (auto via existing Cloudflare
  DNS) and `sitemap-index.xml` submitted. itinlending = Success; itincreditcard +
  itincreditscore showed transient "Couldn't fetch" (all 3 sitemaps live at HTTP 200).
- **Bing Webmaster Tools:** account created via Sign in with Google
  (bguillow@gmail.com); the 3 ITIN sites added via one-click **Import from GSC**
  (grants Bing View-only GSC access). Deliberately excluded the 3 unrelated GSC
  properties on that account (glucometerreviews.com, pourpicks.app,
  wellworthproducts.com). Submitted the correct `https://<domain>/sitemap-index.xml`
  manually for itinlending + itincreditcard (the import carried stale `http://.../sitemap`
  + `/sitemap.xml` URLs that error harmlessly); itincreditscore's import already had
  the correct one (Success).
- **IndexNow:** already automated in `daily-content.yml`; fired a one-off manual ping
  for all 3 (68 / 34 / 36 URLs, HTTP 200).
- Docs updated: SEO-AEO.md (new "Search-engine submission status" section).
- Follow-ups: re-check GSC sitemap status (should flip Success once Google refetches);
  optionally delete the stale Bing sitemap Error rows for itinlending; start the weekly
  GSC/GA4 audit loop once real traffic appears.

## 2026-06-06 — Site 3 (itincreditscore.com) 301 redirect map built
- **Why:** Site 3 had an empty/missing redirect map, so its only indexed legacy
  URLs would 404 on cutover and lose all ranking signal. The user's hard rule:
  *any page currently in Google has to redirect so we don't lose it.*
- **Day-1 indexation truth (`site:itincreditscore.com`, 2026-06-06):** exactly
  **3 legacy URLs** indexed. All three now 301'd in
  `~/ITINCreditScore/web/docs/redirects.csv`:
  - `/credit-reports-with-itin` → `/credit-bureaus-and-itin` — **the only ranking
    page** (~#7 for "credit reports with itin" in the manual Day-1 snapshot);
    highest-priority redirect.
  - `/f/understanding-itin-and-your-credit-score` → `/itin-credit-score-guide`.
  - `/start-building-now` → `/build-credit-history-with-itin`.
  - Catch-all `/f/*` → `/itin-credit-score-guide` (after the specific rules).
- Also created `~/ITINCreditScore/web/docs/MIGRATION.md` (mirrors site 1's guide,
  records the Day-1 indexed set + the GSC reconciliation step).
- Docs updated: SEO-AEO.md (closed the "Site 3 empty redirects.csv" open item),
  CHANGELOG.md (this entry).
- Follow-ups: after Site 3 is GSC-verified, reconcile this map against the GSC
  **Pages report** (the public `site:` set is not exhaustive) and add any indexed
  URL not yet mapped before cutover. Stage all rows in Cloudflare Bulk Redirects.

## 2026-06-06 — Fix flaky daily-content failures (JSON truncation)
- **Symptom:** `daily-content` run on itincreditscore failed with
  `daily-post: could not parse JSON from model output`; the next run succeeded.
- **Root cause:** the Claude response in `daily-post.mjs` was truncated at
  `max_tokens: 8000`. The model spends tokens on web-search narration + a prose
  preamble before emitting the JSON, so a verbose run gets cut off mid-field
  (failed run cut off in `"description"`), leaving no closing ``` fence →
  `JSON.parse` throws. Terser runs fit under the cap, hence the intermittency.
- **Fix:** raised `max_tokens` 8000 → 16000 in all 3 copies of
  `web/scripts/daily-post.mjs` (byte-identical across the family) so a ~900-1500
  word article JSON + narration can't hit the ceiling.
- Docs updated: CHANGELOG.md (this entry).
- Follow-ups: none. If a future failure recurs above 16000, prefer trimming the
  prose preamble over raising the cap further.

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
- **Manual Day-1 snapshot added on request:** ran a live Google web-search check for
  every tracked keyword (clearly labeled a one-off sample, not the GSC metric).
  Results per site recorded in the baseline. Findings: Site 1 ranks only its **brand**
  (#1 homepage); Site 2 has **no presence — domain not indexed** (brand query returns
  only competitors); Site 3's legacy `/credit-reports-with-itin` ranks **~#7** for
  "credit reports with itin" — the only non-brand top-10 result across all 3, now
  tracked in an "already ranking" table. Competitor fields-to-beat captured per site.
- Follow-ups: (1) verify GSC on all 3 domains + submit sitemaps + request indexing;
  (2) **build site 3's redirect map before cutover — the ~#7 `/credit-reports-with-itin`
  page has no 301 and would 404, losing its ranking** (suggested targets in baseline);
  (3) build `gscRanks()` in `daily-report.mjs` once GSC creds exist; (4) backfill the
  baseline rank columns once data lands.

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
