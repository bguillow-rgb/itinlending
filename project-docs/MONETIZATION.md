# Monetization

Revenue surfaces, **segmented by page intent** so they never cannibalize each
other: **lead generation** (highest value, now consolidated on `/apply`),
**Commission Junction affiliate links** (per product), and **always-on display
ads** — which as of 2026-06-15 are **Credit Karma units (Awin)**, not AdSense.
AdSense is **pending approval** and kept only as a dormant fallback.

## The core strategy: segment by intent, protect lead revenue

On a lending site a display-ad click pays cents while a lead-form submit or a CJ
apply-click pays dollars — but AdSense is unapproved, so every ad/lead-form slot
now runs a **topic-relevant Credit Karma display unit** (flat CPA) instead of
sitting empty. The lead form is consolidated on `/apply` (reached via the "Apply
Here" nav + every hero CTA button).

| Page type | Lead form | Affiliate CTA | Display ad (Credit Karma) |
|---|---|---|---|
| **Money pages** (pillar `itin-loans` + clusters) | No — hero now runs a CK ad; CTA buttons route to `/apply` | Per-product CJ deep link (`InlineCTA`) | **Hero (300×250) + one below-fold** (after FAQ), topic-matched to the page |
| **Articles** (research intent) | No (CTA only) | Generic `InlineCTA` | **Top (above fold) + end**, topic-matched |
| **Thank-you** (post-conversion) | — | Product-matched CTA via `?for=` param | Two inline CK units (score + finance) |
| **/apply** | **Yes — full lead form** (the form's only home) | — | None |
| Homepage / about / utility | CTA to /apply | — | Homepage hero = one CK unit; otherwise none |

This is a hard rule. Don't add in-content **AdSense** to money pages, the
homepage, /about, or utility pages (those AdSense slots stay dormant regardless).
The Credit Karma placements above are the current always-on ads. (Also recorded
in auto-memory.)

All of it is **env-gated** in `web/src/consts.ts` (`SITE.monetize`) and only fires
in a production build (`import.meta.env.PROD`) with the relevant value set —
nothing renders in dev or in a fork.

---

## How ads work (Google AdSense) — DORMANT (pending approval)

> **Status (2026-06-15):** AdSense is **not approved yet**, so `AdSlot` is no
> longer placed in any layout or page — the article, money-footer, and thank-you
> placements now render **Credit Karma units** instead (see the Credit Karma
> section below). The `AdSlot.astro` component and the `adSlots` config remain in
> the codebase as a **dormant fallback**: if/when AdSense approves, swapping a
> `<CreditKarmaAd>` back to an `<AdSlot>` re-lights it. The ownership-verification
> script + `<meta name="google-adsense-account">` **stay on every page** (that's
> what AdSense reviews for approval). The rest of this section documents that
> dormant system.

- **Publisher ID:** `PUBLIC_ADSENSE_ID` → `SITE.monetize.adsenseId`
  (live value `ca-pub-1426577294682977`, enabled site-wide). Empty disables all
  ad slots everywhere.
- **Loader:** the AdSense script is loaded site-wide (via `Analytics`/base head)
  gated on the publisher ID being present.
- **Site ownership verification:** the loader's `client=` ID is the primary
  signal; additionally `Analytics` emits `<meta name="google-adsense-account">`
  (same `enableAds` gate) as a backup verification method.
- **`ads.txt`** at the site root authorizes Google AdSense (`pub-1426577294682977`).
- **Ad units / slots:** each placement is a numbered ad-unit slot ID created in the
  AdSense dashboard and supplied by env. The four slots
  (`SITE.monetize.adSlots`):
  | Slot key | Env var | Placement |
  |---|---|---|
  | `articleTop` | `PUBLIC_ADSENSE_SLOT_ARTICLE_TOP` | Article, above fold, right after Quick Answer (highest RPM) |
  | `articleEnd` | `PUBLIC_ADSENSE_SLOT_ARTICLE_END` | Article, after body |
  | `moneyFooter` | `PUBLIC_ADSENSE_SLOT_MONEY_FOOTER` | Money page, after FAQ (the single below-fold unit) |
  | `thankYou` | `PUBLIC_ADSENSE_SLOT_THANKYOU` | Thank-you page, full-density |

  These slot IDs are **account-level and shared across all three sites.**
- **Rendering:** `src/components/AdSlot.astro` takes a `slot` prop and renders an
  `<ins class="adsbygoogle">` + the `adsbygoogle.push({})` call **only** when
  `import.meta.env.PROD && adsenseId && slot` are all truthy. Each placement in the
  layouts passes the matching slot from `SITE.monetize.adSlots`.

To add a new placement: create the ad unit in AdSense, add a slot key to
`adSlots` + its `PUBLIC_ADSENSE_SLOT_*` env var, then drop an `<AdSlot slot={…} />`
where it belongs (respecting the intent rules above). Document it here.

---

## How the lead form works (the "ad form")

File: `web/src/components/LeadForm.astro`. It is the **primary conversion CTA**,
now rendered **only on `/apply`** (EN + `/es`). Money-page/pillar heroes that used
to embed a `compact` form now show a Credit Karma ad; their CTA buttons route to
`/apply`, where this full form lives.

### Fields & UX
- **Lean (compact / hero):** full name, phone, email, "what do you need?" (loan type
  select), state (50 states + DC dropdown — cleaner data than free text). Kept short
  on money-page heroes to protect conversion.
- **Qualifiers (non-compact `/apply` only):** wrapped in a `qualify-block` that only
  renders when `!compact`, so the deeper questions never bloat the hero form:
  - **Lending** (the lead-sale site): amount, monthly income, credit-score range,
    ITIN-only vs ITIN+SSN, plus **conditionally revealed** fields — `time_in_business`
    (when purpose = business) and `down_payment` (when purpose = mortgage). Reveal is
    driven by inline JS keyed off the loan-type `<select>` option index
    (`data-intent` on the select, `data-when="business|mortgage"` on the fields).
  - **Credit Card / Credit Score:** minimal qualifiers only (credit-score range +
    ITIN status). No conditional reveal — these sites don't sell leads, so deeper
    qualification would only hurt conversion.
- **Phone auto-formats** to `555-123-4567` as you type (inline script), with a
  `pattern` for validation.
- Fully bilingual via `i18n/ui.ts` (`form.*` keys incl. `form.qualify.*`, `form.amount`,
  `form.income`, `form.score`, `form.itin`, `form.tib`, `form.down`, `form.select`);
  option arrays + error message localized inline.
- Trust copy + consent line linking to Privacy Policy and Advertiser Disclosure.
- **Honeypot** (`botcheck` checkbox, hidden) for spam filtering.

### Lead routing (Web3Forms CC)
The lead email goes to the Web3Forms account inbox by default. To route a copy to a
**lead-buyer or a working inbox**, set the **CC recipient(s) in the Web3Forms
dashboard** for the access key (`PUBLIC_WEB3FORMS_KEY`) — this is dashboard config,
**not code**. No code change is needed beyond the already-env-gated `access_key`.
Keep partner CCs in the dashboard so leads can be forwarded/copied without a deploy.

### Privacy / compliance (CCPA/CPRA)
Because qualified leads are now **shared with lenders for compensation**, the privacy
policy on all three sites (EN + `/es`, updated 2026-06-15) discloses this as a possible
"sale"/"sharing" under CCPA/CPRA and offers an email opt-out. The old "we do not sell
your personal information for money" line was removed — it became false once lead-sale
went live. See `web/src/pages/privacy.astro` + `es/privacy.astro` in each repo.

### Selling the leads
Partner targets, outreach templates, and the warm-forward ("sell the introduction")
flow live in [`LEAD-PARTNERS.md`](./LEAD-PARTNERS.md). Per-lead logging + buyer
pipeline is the local `~/Itin/research/lead-tracker.xlsx` (gitignored — holds PII).

### Submission flow
1. Posts to `SITE.monetize.leadFormEndpoint` (`PUBLIC_LEAD_ENDPOINT`) — a
   static-friendly handler (Web3Forms is wired; Formspree/Basin also work).
2. `web3formsKey` (`PUBLIC_WEB3FORMS_KEY`) is injected as the hidden `access_key`
   field; hidden `subject` and `from_name` fields tag the lead.
3. Submit is **AJAX** (inline script on `form[data-leadform]`): it validates,
   shows a busy state, `fetch`-POSTs `FormData`, and on `{success:true}`...
4. **Redirects to the thank-you page** (`localizedHref('/thank-you')`), appending
   `?for=<money-page-slug>` derived from the selected loan type (fixed option
   order maps EN/ES → slug). On failure it alerts and restores the button.
5. **Fallback:** if no `action`/endpoint is configured, the native (no-op) submit
   happens and nothing breaks — the form still renders fully.

### Thank-you page
`/thank-you` (+ `/es/thank-you`) reads the `?for=` param to show the
**product-matched affiliate CTA** and runs the full-density `thankYou` ad slot.

---

## How affiliate (Commission Junction) links work

- `src/components/InlineCTA.astro` is the conversion CTA dropped mid-article and at
  the end of money pages. It links to an **off-site affiliate apply URL** when
  configured, else to `/apply`. External links get `rel="sponsored nofollow"
  target="_blank"`.
- **Per-product routing:** `affiliateUrlFor(path)` in `consts.ts` resolves a money
  page's slug to its product-specific affiliate deep link
  (`SITE.monetize.affiliateUrls[slug]`), maximizing relevance/EPC. Resolution order:
  own slug link → **`AFFILIATE_FALLBACKS[slug]` chain** → global `affiliateApplyUrl`
  → `''` (callers route to `/apply`). The fallback chain means a slug with no
  dedicated program yet (e.g. ITIN mortgage/auto — no affiliate program exists)
  routes to a sensible sibling instead of a dead CTA.
- **Path B (thank-you affiliate CTA):** the lead form appends `?for=<slug>` to the
  thank-you redirect (slug mapped from the product `<select>` by fixed option
  order, EN/ES). `thank-you.astro` walks the same own→fallback→global resolution
  client-side and reveals a matched "continue your application" CTA. Lead email
  still fires via Web3Forms regardless. All 3 sites are at parity.
- Per-product env vars: `PUBLIC_AFFILIATE_URL_MORTGAGE`, `_AUTO`,
  `_CREDIT_CARDS`, `_PERSONAL`, `_BUSINESS`, `_LOANS`; global
  `PUBLIC_AFFILIATE_APPLY_URL`.
- **When adding a new money page:** point its CTA at a product-specific CJ link by
  adding a `affiliateUrls` key + env var. Do **not** route it to AdSense.

### CJ Promotional Properties (publisher account)

CJ uses a per-website "Promotional Property" model: each site must be registered as
its own property before applying to advertisers, so financial advertisers review an
on-topic, brand-safe property instead of an unrelated one. All three ITIN sites are
registered (2026-06-06) under the single shared CJ publisher account (PID
`pub-1426577294682977` family), each as type **Website**, primary model
**Content/Blog/Media**, status **Active**:

| Property | Domain | CJ Property ID |
|---|---|---|
| ITIN Lending | itinlending.net | 101772772 |
| ITIN Credit Card | itincreditcard.com | 101772770 |
| ITIN Credit Score | itincreditscore.com | 101772773 |

(The pre-existing `Perfume Picks` property, ID 101759456, remains the account's
*primary* property but is unrelated to these sites.) CJ creates properties **Active**
with no separate meta-tag verification gate — advertisers do their own review when
you apply per property. **Next step:** apply to ITIN-relevant advertiser programs
per property, then fill the matching `PUBLIC_AFFILIATE_URL_*` env vars with the
approved CJ deep links.

---

## How the Credit Karma ads work (Awin) — site-wide, topic-targeted

Credit Karma **300×250 display ads** (via Awin) are now the always-on ad surface
on **every page that has an ad/hero slot**, on all 3 sites, EN + `/es`. Each
placement shows the creative + CTA **relevant to that page's topic** (a cards page
shows the cards creative, a score/credit page the score creative, a loan/finance
page the finance creative). This replaced both the homepage-hero-only CK unit and
all the (unapproved) AdSense slots.

- **Component:** `web/src/components/CreditKarmaAd.astro` (identical across all 3
  repos). Props (all optional): `creativeId`, `cta`, `alt`, `topic`
  (`'finance'|'cards'|'score'`), `path`, `inline`. Resolution order for which
  ad to show: explicit `creativeId` → explicit `topic` → `path`-based → current
  pathname. `inline={true}` switches it to the centered in-body style
  (`.ck-ad--inline`); default is the hero-column style. It renders a localized CTA
  `<a>` + the 300×250 banner, both pointing at the same Awin click URL.
- **Topic targeting:** `ckTopicForPath()` in `consts.ts` keyword-matches a
  path/slug → topic (`card*`→cards; `score|credit-report|credit-bureau|build-credit|credit-history|improve-credit|credit-builder|check-credit`→score;
  `loan|mortgage|auto|personal|business|finance|income`→finance), falling back to
  the per-site `awin.defaultTopic`. `creditKarmaAdFor(path, lang)` returns the
  matching `{ creativeId, cta, alt, topic }`; copy lives in `CK_AD_COPY`.
- **Embed shape:** `https://www.awin1.com/cread.php?s=<creativeId>&v=<advertiserId>&q=<campaignId>&r=<publisherId>`
  for the click, and `cshow.php?...` (same params) as the impression pixel — which is
  also used as the banner `<img src>`, so a view = an impression and a click =
  `cread.php`. Only `creativeId` (`s`) varies.
- **Account constants** (in `SITE.monetize.awin`, shared across all 3 sites):
  publisher `r=2931103` (Timberline Ventures LLC), Credit Karma advertiser `v=66532`,
  campaign `q=475588`.
- **The 3 creatives** (campaign-level, shared across all 3 sites — keyed by topic in
  `awin.creatives`):
  | Topic | Creative `s` | EN CTA | ES CTA |
  |---|---|---|---|
  | `finance` | `3641184` | See how much you qualify for here | Mira cuánto puedes calificar aquí |
  | `cards` | `3641203` | Compare top credit cards here | Compara las mejores tarjetas aquí |
  | `score` | `3597059` | Check your credit score free here | Revisa tu puntaje de crédito gratis aquí |
- **Per-site `defaultTopic`** (for generic pages — homepage, about, articles with no
  topical keyword): Lending = `finance`, Credit Card = `cards`, Credit Score = `score`.
- **Where it's placed:**
  | Surface | Placement | Topic source |
  |---|---|---|
  | Money pages (`MoneyPageLayout`) | hero + below-fold (after FAQ) | page `path` |
  | Pillar pages (`itin-loans`, Lending only) | hero + below-fold | page `path` |
  | Articles (`ArticleLayout`) | top + end | page `path` |
  | Thank-you (EN+ES) | two inline units | explicit `topic="score"` then `topic="finance"` (CC uses `score` then `cards`) |
  | Homepage hero | one unit | site `defaultTopic` |
- **Env-gating:** the live banner only renders in a production build
  (`import.meta.env.PROD`) with a creativeId resolved; dev and forks show a sized
  300×250 placeholder so layout is preserved and no impressions/clicks fire.
- **Payout reality:** Credit Karma pays **flat CPA** ($7/new member, $4/dormant login,
  $0.30/offer-click, $0.20/marketplace-entry, $0.10/marketplace-view), **not** a
  percentage of any loan. 30-day cookie. The program **excludes social/SMS/email
  channels** — these units are for on-site placement only. Only 3 brand/score/cards
  creatives exist; CTAs are worded honestly to match what the click delivers.
- **Adding/swapping a creative:** pick a 300×250 unit in the Awin dashboard (Credit
  Karma, advertiser 66532), add its creative ID under the right topic key in
  `SITE.monetize.awin.creatives` (the system is extensible — more topics/creatives
  drop straight in), and update the table above + the CHANGELOG.

Bottom line: every ad/hero slot across all 3 sites is now a **topic-relevant,
always-on Credit Karma unit** — no slot sits empty waiting on AdSense. The AdSense
slots remain coded but dormant (see the dormant section above) and can be swapped
back in if AdSense approves.

## Paid traffic / arbitrage

Considering buying Google Ads traffic? See [`PAID-ARBITRAGE.md`](./PAID-ARBITRAGE.md).
Bottom line: Google Ads → **AdSense** arbitrage on finance keywords is a structural
loss + ban risk; the only winnable version is Google Ads → **lead/affiliate**, it's
blocked until affiliate/lead revenue is live, and its best margin pocket is
**Spanish-language keywords**.

## Current monetization state (keep updated)

- AdSense: **pending approval / dormant.** Ownership-verification script + meta tag
  stay on every page (`ca-pub-1426577294682977`); `ads.txt` live. `AdSlot` + the
  `adSlots` config remain in code but are **no longer placed anywhere** — kept as a
  fallback for if/when AdSense approves.
- Credit Karma (Awin): **live and site-wide** — topic-relevant 300×250 units in
  **every** hero/ad slot across all 3 sites (EN+ES): money-page heroes + below-fold,
  article top/end, thank-you, homepage hero. Publisher 2931103 / advertiser 66532,
  3 creatives keyed by topic. Flat-CPA payout. See the Awin section above.
- Lead form: **consolidated on `/apply`** (reachable via the "Apply Here" nav CTA and
  every hero CTA button). Wired to Web3Forms with AJAX submit + redirect to a
  dedicated thank-you page. No longer embedded in any page hero (replaced by CK ads).
- Affiliate: scaffolding in place (CJ per-product deep links via env); all 3 sites
  registered as CJ Promotional Properties (2026-06-06, see table above).
  **Applications submitted (2026-06-06)** to on-topic CJ programs across every
  vertical — credit cards (Venmo Credit Card, PayPal Cashback Mastercard), loans
  (LendingTree, Mortgage Research Center, myAutoloan.com), credit reporting/repair
  (Experian, Sky Blue Credit, Tradeline), banking (Axos Bank, BMO); 14 pending
  total. **Note:** CJ's apply flow has no per-application property picker — apps
  attach to the publisher account and advertisers review all registered properties
  during manual review. Fill the `PUBLIC_AFFILIATE_URL_*` vars as advertisers are
  approved.
