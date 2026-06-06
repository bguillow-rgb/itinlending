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
