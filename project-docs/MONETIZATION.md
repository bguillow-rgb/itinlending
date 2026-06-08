# Monetization

Three revenue surfaces, **segmented by page intent** so they never cannibalize
each other: **lead generation** (highest value), **Commission Junction affiliate
links** (per product), and **Google AdSense** (lowest value, used as a backstop).

## The core strategy: segment by intent, protect lead revenue

On a lending site an AdSense click pays cents **and** leaks a high-intent visitor
to a competitor, while a lead-form submit or a CJ apply-click pays dollars. So:

| Page type | Lead form | Affiliate CTA | AdSense |
|---|---|---|---|
| **Money pages** (pillar `itin-loans` + clusters) | Yes — hero + inline | Per-product CJ deep link (`InlineCTA`) | **One unit only, below the fold** (after FAQ) |
| **Articles** (research intent) | No (CTA only) | Generic `InlineCTA` | **Top (above fold) + end** — highest RPM |
| **Thank-you** (post-conversion) | — | Product-matched CTA via `?for=` param | Full-density display ad (nothing left to cannibalize) |
| Homepage / about / utility | CTA to /apply | — | **None** |

This is a hard rule. Don't add in-content AdSense to money pages, the homepage,
/about, or utility pages. (Also recorded in auto-memory.)

All of it is **env-gated** in `web/src/consts.ts` (`SITE.monetize`) and only fires
in a production build (`import.meta.env.PROD`) with the relevant value set —
nothing renders in dev or in a fork.

---

## How ads work (Google AdSense)

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

File: `web/src/components/LeadForm.astro`. It is the **primary conversion CTA** —
rendered in money-page heroes (`compact`) and on `/apply`.

### Fields & UX
- Full name, phone, email, "what do you need?" (loan type select), state (50
  states + DC dropdown — cleaner data than free text), optional notes (hidden when
  `compact`).
- **Phone auto-formats** to `555-123-4567` as you type (inline script), with a
  `pattern` for validation.
- Fully bilingual via `i18n/ui.ts` (`form.*` keys); loan-type options and error
  message are localized inline.
- Trust copy + consent line linking to Privacy Policy and Advertiser Disclosure.
- **Honeypot** (`botcheck` checkbox, hidden) for spam filtering.

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

## Paid traffic / arbitrage

Considering buying Google Ads traffic? See [`PAID-ARBITRAGE.md`](./PAID-ARBITRAGE.md).
Bottom line: Google Ads → **AdSense** arbitrage on finance keywords is a structural
loss + ban risk; the only winnable version is Google Ads → **lead/affiliate**, it's
blocked until affiliate/lead revenue is live, and its best margin pocket is
**Spanish-language keywords**.

## Current monetization state (keep updated)

- AdSense: enabled site-wide, `ca-pub-1426577294682977`; `ads.txt` live.
- Lead form: wired to Web3Forms with AJAX submit + redirect to a dedicated
  thank-you page (which carries ad slots).
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
