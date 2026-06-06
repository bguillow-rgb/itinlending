# Paid-Traffic Arbitrage Plan (Google Ads → ITIN sites)

**Question on the table:** buy traffic with Google Ads and monetize it with AdSense
on the 3 ITIN sites, pocketing the spread.

**Short answer:** Google Ads → **AdSense** arbitrage on ITIN/finance keywords is a
structural money-loser **and** a policy-ban risk. Don't do it. There *is* a paid
arbitrage that can work on these sites — Google Ads → **lead/affiliate conversion**
— but it is tight, it only works *after* affiliate/lead revenue is actually live
(today it isn't — all CJ env vars are unset), and its best margin pocket is
**Spanish-language keywords**. This doc shows the math, real keyword targets, the
break-even model, and a sequenced test plan.

> **Data note:** the CPC and volume figures below are **industry-benchmark ranges
> for the US finance vertical**, not live Keyword Planner pulls (I don't have the
> Ads account connected). Finance/loans/mortgage is the single most expensive
> vertical in all of Google Ads, so these ranges are directionally reliable but
> must be replaced with real numbers (procedure in §6) before spending a dollar.

---

## 1. Why Google Ads → AdSense arbitrage cannot work here

The whole model lives or dies on one inequality, **per visit**:

```
profit/visit = (AdSense RPM / 1000)  −  CPC
```

- **What AdSense pays you per visit** = page RPM ÷ 1000. Finance content RPM in
  good US English traffic is roughly **$5–$20 per 1,000 views** (cold *paid*
  bounce traffic and Spanish traffic land at the low end, ~$3–$8). Call it
  **$0.005–$0.020 earned per visit**, optimistically $0.03.
- **What Google Ads charges you per visit** = the CPC. The *cheapest* ITIN
  keywords (pure informational, "what is an itin") are **$0.30–$2.00**; the
  commercial ones are **$2–$14**.

So you'd pay **$0.30–$14 to bring in a click and earn back $0.005–$0.03** from
AdSense. You recover **roughly 0.1%–6%** of spend. There is no ITIN keyword priced
anywhere near the ~$0.015 CPC you'd need to break even on AdSense alone. The spread
is inverted by 1–2 orders of magnitude. This isn't a tuning problem; it's
arithmetic.

Arbitrage-to-AdSense only works when you buy **sub-penny** traffic (display/native
pop/social in cheap geos) and send it to **very high-RPM** content. Buying
**search** clicks — the most expensive traffic that exists — to show display ads is
the worst possible version of it.

### And it's against the rules
- **Google AdSense** "valuable inventory" + invalid-traffic policies target
  "Made-for-Advertising" (MFA) pages and traffic bought purely to generate ad
  clicks. Same-platform arbitrage (Google Ads → Google AdSense, same Google login)
  is maximally visible to Google and a known account-ban pattern.
- **Google Ads** destination policy disapproves "bridge pages" / low-value pages
  whose main purpose is to show ads.

Both sides of this specific arbitrage are policy-hostile. Risking the
`ca-pub-1426577294682977` AdSense account (shared across **all three** sites + Perfume
Picks) to chase a negative spread is a bad trade.

---

## 2. The arbitrage that *can* work: paid → lead / affiliate

These sites aren't AdSense sites — per `MONETIZATION.md`, AdSense is the **lowest**
value surface (a backstop), and the real money is **lead gen** and **per-product
CJ affiliate** links. Those pay **dollars per action**, not fractions of a cent per
view. That changes the inequality to something winnable:

```
profit/click = (Value per conversion × conversion rate)  −  CPC
break-even conversion rate = CPC ÷ Value per conversion
```

Indicative conversion economics (validate with your own data):

| Surface | Value per conversion (V) | Notes |
|---|---|---|
| Mortgage lead | **$20–$80** | Highest-value finance lead; can be sold to multiple lenders |
| Personal / auto loan lead | **$5–$40** | Networks like LendingTree (already applied via CJ) |
| Credit-card affiliate (CPA) | **$30–$150 / approved card** | But you only earn on *approval*, not click |
| Secured card / credit-builder | **$10–$40** | Lower payout, higher approval rate |

Worked examples (cold paid traffic landing-page lead CR is realistically 2–8%):

- **Mortgage, EN:** CPC $8, V $40 → break-even CR = **20%**. Too high for cold
  traffic. *Negative unless V is much higher (multi-sell) or CR is exceptional.*
- **Credit-card CPA, EN:** CPC $5, payout $75, but click→approval ≈ 0.5–2% →
  EPC $0.38–$1.50. *Marginal; positive only at the top of the range.*
- **Mortgage, ES ("prestamos con itin"):** CPC **$1–$3**, V $40, CR 4% → EPC
  $1.60 vs CPC ~$2. *Roughly break-even-to-positive — the best pocket on the board.*

**The edge is Spanish.** The ITIN audience is heavily Spanish-speaking; advertiser
competition (and therefore CPC) on ES keywords is materially lower than EN, while
buyer intent is identical and these sites are already fully bilingual (`/es`). Same
lead value, ~⅓ the click cost.

---

## 3. Real keyword targets (estimated; validate in Keyword Planner)

CPC = estimated US top-of-page bid range. Vol = estimated US monthly searches.
Verdict assumes monetization is **lead/affiliate**, not AdSense.

### Site 1 — ITIN Lending (itinlending.net) → loans/mortgage/auto/personal/business

| Keyword | Vol (est) | CPC (est) | Intent | Verdict |
|---|---|---|---|---|
| itin loans | 2.4k–5k | $2.50–$6 | commercial | Test (EN core) |
| itin mortgage / itin home loan | 1k–3k | $5–$14 | high-value | Test only if multi-sell lead |
| itin personal loans | 800–2k | $2–$6 | commercial | Test |
| car loan with itin number / itin auto loan | 1k–2.5k | $2–$6 | commercial | Test |
| itin business loans | 300–900 | $3–$8 | commercial | Watch |
| loans for itin number / itin loans near me | — | $2–$6 | commercial+local | Test |
| **prestamos con itin** | 1k–3k | **$1–$3** | commercial (ES) | **Best bet** |
| **prestamos sin seguro social** | 1k–4k | **$1–$3** | commercial (ES) | **Best bet** |
| **prestamos para hipoteca con itin** | — | **$1–$4** | high-value (ES) | **Best bet** |

### Site 2 — ITIN Credit Card (itincreditcard.com)

| Keyword | Vol (est) | CPC (est) | Intent | Verdict |
|---|---|---|---|---|
| credit card with itin number / itin credit card | 2k–4k | $2–$7 | commercial | Test (CPA) |
| best credit cards for itin | — | $3–$9 | commercial | Test (CPA) |
| secured credit card itin | 500–1.5k | $2–$6 | commercial | Test |
| how to get a credit card with itin | — | $1–$4 | research | Watch |
| **tarjeta de credito con itin** | — | **$1–$3** | commercial (ES) | **Best bet** |

### Site 3 — ITIN Credit Score (itincreditscore.com)

| Keyword | Vol (est) | CPC (est) | Intent | Verdict |
|---|---|---|---|---|
| build credit with itin | 500–1.5k | $1–$4 | commercial-ish | Test |
| credit score with itin / itin credit report | — | $1–$5 | research | Watch |
| how to build credit without ssn | — | $1–$4 | research | Watch |
| check credit with itin number | — | $1–$5 | research | Watch |
| **como construir credito con itin** | — | **$0.50–$2** | commercial (ES) | **Best bet** |

### Cheap-but-low-value (informational) — **don't buy for monetization**
`how to get an itin`, `what is an itin`, `itin number`, `itin application` —
$0.30–$2 CPC, big volume, but near-zero commercial intent. Great for **organic
SEO**, terrible for paid (no conversion to recoup the click, and AdSense won't
cover it — see §1). These are exactly the pages your existing SEO playbook already
targets for free.

---

## 4. Realistic verdict per site (assuming all 3)

- **ITIN Lending** — the only site with a credible positive-margin path, via
  **ES mortgage/personal-loan lead gen** (highest V, lowest CPC). EN is break-even
  at best. Start here.
- **ITIN Credit Card** — depends entirely on a real **CPA card program** approving
  (CJ pending). CPA payout is high but you only earn on approval; cold-traffic
  approval rates are low. Second priority, ES-first.
- **ITIN Credit Score** — lowest commercial value (mostly research intent, fewer
  dollar-paying advertiser actions). **Do not** buy paid traffic here beyond a
  token ES test; keep it on organic.

Across all three, the expected outcome of an EN AdSense play is a **−90%+** return.
The expected outcome of a disciplined ES lead/affiliate test is **break-even ±**,
with upside only on proven winners scaled carefully.

---

## 5. Hard prerequisite (today this is a blocker)

**You cannot run this yet.** Right now the only live monetization is AdSense — every
`PUBLIC_AFFILIATE_URL_*` env var is unset (CJ programs still pending review, see
`MONETIZATION.md`), and there's no lead-buyer contract wired. So today, buying
traffic would monetize **only** through AdSense = guaranteed loss (§1).

Before any spend, one of these must be **live and paying**:
1. CJ advertiser(s) approved → fill the matching `PUBLIC_AFFILIATE_URL_*` vars, **or**
2. A lead-buyer / loan-affiliate network contract (e.g. LendingTree / Mortgage
   Research Center — already applied via CJ) that pays per lead.

---

## 6. Get the real numbers (replace §3 estimates)

1. **Google Ads → Tools → Keyword Planner → "Discover new keywords"**: paste each
   site's seed list. Read **Avg. monthly searches** + **Top of page bid (low/high)**.
   Add the ES seeds separately (set language = Spanish). Export.
2. Note **competition** (Low/Med/High) and seasonality.
3. **AdSense actual RPM for paid traffic:** don't trust organic RPM — it's measured
   on cold bounce traffic only by running a small live test.
4. **Compute current organic EPC per money page** from existing GA4 + AdSense data
   *before* buying — that's your baseline value-per-visit.

---

## 7. Test plan (only after §5 is satisfied)

**Phase 1 — Instrument (free, do now regardless):**
- Add Google Ads conversion tracking + GA4; import **lead-form submit** and
  **affiliate outbound click** as conversions, each with an assigned **value**.
- Enable auto-tagging (GCLID). Build a one-screen dashboard: spend, clicks, CPC,
  LP→lead CR, lead→affiliate, **EPC**, **ROAS**.
- Compute organic EPC per money page → your buy/no-buy threshold.

**Phase 2 — Micro-test (~$300–$500 total):**
- **One site (ITIN Lending), two ad groups: ES-mortgage and ES-personal-loan**
  (the best-margin pocket). Optional 1 EN control group.
- Match types: phrase + exact only (no broad). Heavy **negative keywords**
  (`free`, `irs login`, `jobs`, `status`, `form w-7 download`, etc.).
- Landing page = the existing money page (`/es/itin-mortgage`, `/es/itin-personal-loans`)
  — it already has the hero lead form + CJ CTA. Don't build bridge pages.
- Geo: US, weighted to high-ITIN states (CA, TX, FL, IL, NY, NJ, AZ).
- Daily cap low; ad schedule to waking hours.

**Phase 3 — Read & decide (per ad group, after ~100 clicks):**
- **Kill** if EPC < CPC with no realistic path to parity.
- **Scale** winners only: widen geo/keywords, lift budget stepwise, then replicate
  the pattern to the other two sites' best verticals (cards = CPA, score = skip/ES).

**Kill criteria (write them down before spending):** if blended ROAS < 1.0 after
the full micro-test budget and no single ad group is profitable, stop — the organic
strategy is the better use of capital for these sites.

---

## 8. One-paragraph summary

Don't arbitrage Google Ads into AdSense on finance keywords — the AdSense payout per
visit ($0.005–$0.03) is 10–100× below the CPC you'd pay, and it risks the shared
AdSense account. The only arbitrage worth testing is **paid search → lead/affiliate
conversion**, it's **blocked until CJ/lead revenue is actually live**, and its one
real edge is **Spanish-language keywords** (≈⅓ the CPC of English, identical intent,
sites already bilingual). Start with a $300–$500 ES mortgage/personal-loan test on
ITIN Lending only, fully instrumented, with pre-committed kill criteria.
