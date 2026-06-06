# SEO Rank Baseline — Day 1 (2026-06-06)

**This is the frozen Day-1 baseline for the 3-site ITIN family.** Every future rank
report diffs against this file. It is a snapshot in time — do **not** edit the rank
columns retroactively; create a new dated report instead.

## Honest data caveat (read first)

As of 2026-06-06 there is **no live ranking data source connected**:
- GA4 is not live (`PUBLIC_GA4_ID` unset on all 3 sites).
- Google Search Console is **not yet verified** on any of the 3 domains.
- No Ahrefs/Semrush export exists.
- All 3 sites are **brand-new** (just replaced the old WordPress site).

Per the SEO playbook (`~/.claude/CLAUDE.md`: *"Does not invent metrics, rankings, or
citations"*), the **Day-1 Rank** column below is intentionally `— (pending GSC)`.
These are **not** fabricated positions. They get backfilled from GSC Search Analytics
once Console is verified and the sites index (see "How to fill this in" at bottom).

Realistic Day-1 truth: a fresh site ranks for **nothing** for days–weeks except its
own brand terms and any URLs that inherited signal via the Cloudflare 301s from the
old WordPress site. The "quick-win watch" sets are the terms most likely to surface
first — confirm in GSC, don't assume.

## Indexation snapshot (2026-06-06)

The one honest, real signal available today: a live `site:<domain>` check (a **sample**,
not the full index — GSC's Pages/Coverage report is authoritative). Findings:

| Site | `site:` result | Interpretation |
|---|---|---|
| itinlending.net | **Old WordPress pages only** — homepage + `/2023/10/how-to-change-itin-to-ssn-with-irs-online-a-simple-guide/` | New Astro pillar/cluster URLs **not yet indexed**; legacy WP content still holds the index slot. |
| itincreditcard.com | **No own-domain pages** — only competitors (Firstcard, Bankrate, NerdWallet, Capital One, Stilt) | Not indexed / not discoverable yet. |
| itincreditscore.com | **Old-site pages only** — `/credit-reports-with-itin`, `/f/understanding-itin-and-your-credit-score`, `/start-building-now` | New Astro topology **not yet indexed**; legacy CMS URLs still in index. |

**Action items this surfaces (do alongside GSC verification):**
1. **Confirm the 301 redirect map covers the *actually-indexed* legacy URLs** —
   notably `itinlending.net/2023/10/how-to-change-itin-to-ssn-with-irs-online-a-simple-guide/`
   and `itincreditscore.com/{credit-reports-with-itin, f/understanding-itin-and-your-credit-score, start-building-now}`.
   Cross-check against `web/docs/redirects.csv`. The catch-all `/2023/* → /itin-loans`
   covers site 1's dated URL, but `/how-to-change-itin-to-ssn` deserves a dedicated
   target (it's a real ranking query).
2. **Request indexing** of each new pillar + cluster URL in GSC URL Inspection.
3. **Competitor set for site 2** discovered in the SERP (track these as the field to
   beat): Firstcard, Bankrate, NerdWallet, Capital One, Stilt, Taxsym.

---

## Site 1 — ITIN Lending · itinlending.net

Pillar `/itin-loans`. Clusters: itin-mortgage, itin-auto-loan, itin-credit-cards,
itin-personal-loans, itin-business-loans, how-to-get-an-itin, itin-vs-ssn.

### Top 20 target keywords

| # | Keyword | Lang | Target page | Tier | Intent | Day-1 Rank |
|---|---|---|---|---|---|---|
| 1 | itin loans | EN | /itin-loans | Pillar | Commercial | — (pending GSC) |
| 2 | loans with itin number | EN | /itin-loans | Pillar | Commercial | — (pending GSC) |
| 3 | can you get a loan with an itin number | EN | /itin-loans | Pillar | Info | — (pending GSC) |
| 4 | what banks accept itin number for loans | EN | /itin-loans | Pillar | Commercial | — (pending GSC) |
| 5 | itin mortgage | EN | /itin-mortgage | Cluster | Commercial | — (pending GSC) |
| 6 | itin mortgage loans | EN | /itin-mortgage | Cluster | Commercial | — (pending GSC) |
| 7 | can i get a mortgage with an itin number | EN | /itin-mortgage | Cluster | Info | — (pending GSC) |
| 8 | itin home loan requirements | EN | /itin-mortgage | Cluster | Info | — (pending GSC) |
| 9 | itin auto loan | EN | /itin-auto-loan | Cluster | Commercial | — (pending GSC) |
| 10 | car loans with itin number | EN | /itin-auto-loan | Cluster | Commercial | — (pending GSC) |
| 11 | itin personal loans | EN | /itin-personal-loans | Cluster | Commercial | — (pending GSC) |
| 12 | personal loans with itin number | EN | /itin-personal-loans | Cluster | Commercial | — (pending GSC) |
| 13 | itin business loans | EN | /itin-business-loans | Cluster | Commercial | — (pending GSC) |
| 14 | business loans with itin number | EN | /itin-business-loans | Cluster | Commercial | — (pending GSC) |
| 15 | credit cards with itin number | EN | /itin-credit-cards | Cluster | Commercial | — (pending GSC) |
| 16 | how to get an itin | EN | /how-to-get-an-itin | Cluster | Info | — (pending GSC) |
| 17 | how to apply for an itin number | EN | /how-to-get-an-itin | Cluster | Info | — (pending GSC) |
| 18 | itin vs ssn | EN | /itin-vs-ssn | Cluster | Info | — (pending GSC) |
| 19 | itin loan with bad credit | EN | /articles/itin-loan-with-bad-credit | Detail | Long-tail | — (pending GSC) |
| 20 | préstamos con número itin | ES | /es/itin-loans | Pillar | Commercial | — (pending GSC) |

### Quick-win watch (3–5 terms most likely to rank first — confirm, don't assume)

| Keyword | Lang | Why it's a quick win | Day-1 Rank |
|---|---|---|---|
| itin lending / itinlending.net | EN | Brand navigational — should rank #1 once indexed | — (pending GSC) |
| itin loan with bad credit | EN | Low-competition long-tail with a dedicated detail article | — (pending GSC) |
| itin car loan | EN | Long-tail, dedicated content, weak SERP competition | — (pending GSC) |
| can i buy a car with itin number | EN | Question long-tail, strong AEO/Quick-Answer fit | — (pending GSC) |
| itin vs ssn for loans | EN | Informational long-tail, low difficulty | — (pending GSC) |

---

## Site 2 — ITIN Credit Card · itincreditcard.com

Pillar `/itin-credit-cards-guide`. Clusters: credit-cards-that-accept-itin,
secured-credit-cards, unsecured-credit-cards, business-credit-cards,
build-credit-with-itin, how-to-get-an-itin.

### Top 20 target keywords

| # | Keyword | Lang | Target page | Tier | Intent | Day-1 Rank |
|---|---|---|---|---|---|---|
| 1 | itin credit card | EN | /itin-credit-cards-guide | Pillar | Commercial | — (pending GSC) |
| 2 | best credit cards for itin holders | EN | /itin-credit-cards-guide | Pillar | Commercial | — (pending GSC) |
| 3 | can i get a credit card with itin number | EN | /itin-credit-cards-guide | Pillar | Info | — (pending GSC) |
| 4 | credit cards for immigrants without ssn | EN | /itin-credit-cards-guide | Pillar | Commercial | — (pending GSC) |
| 5 | credit cards that accept itin | EN | /credit-cards-that-accept-itin | Cluster | Commercial | — (pending GSC) |
| 6 | credit cards for itin number | EN | /credit-cards-that-accept-itin | Cluster | Commercial | — (pending GSC) |
| 7 | credit card with itin no ssn | EN | /credit-cards-that-accept-itin | Cluster | Commercial | — (pending GSC) |
| 8 | what banks give credit cards with itin | EN | /credit-cards-that-accept-itin | Cluster | Commercial | — (pending GSC) |
| 9 | capital one itin credit card | EN | /credit-cards-that-accept-itin | Cluster | Long-tail | — (pending GSC) |
| 10 | amex itin credit card | EN | /credit-cards-that-accept-itin | Cluster | Long-tail | — (pending GSC) |
| 11 | secured credit card itin | EN | /secured-credit-cards | Cluster | Commercial | — (pending GSC) |
| 12 | secured credit cards for itin holders | EN | /secured-credit-cards | Cluster | Commercial | — (pending GSC) |
| 13 | secured card no ssn | EN | /secured-credit-cards | Cluster | Commercial | — (pending GSC) |
| 14 | unsecured credit card with itin | EN | /unsecured-credit-cards | Cluster | Commercial | — (pending GSC) |
| 15 | business credit card with itin | EN | /business-credit-cards | Cluster | Commercial | — (pending GSC) |
| 16 | build credit with itin | EN | /build-credit-with-itin | Cluster | Info | — (pending GSC) |
| 17 | how to build credit with itin number | EN | /build-credit-with-itin | Cluster | Info | — (pending GSC) |
| 18 | credit cards no ssn required | EN | /credit-cards-that-accept-itin | Cluster | Commercial | — (pending GSC) |
| 19 | how to get an itin | EN | /how-to-get-an-itin | Cluster | Info | — (pending GSC) |
| 20 | tarjetas de crédito con itin | ES | /es/itin-credit-cards-guide | Pillar | Commercial | — (pending GSC) |

### Quick-win watch (3–5)

| Keyword | Lang | Why it's a quick win | Day-1 Rank |
|---|---|---|---|
| itin credit card / itincreditcard.com | EN | Brand navigational | — (pending GSC) |
| credit cards that accept itin number | EN | Core long-tail with dedicated cluster page | — (pending GSC) |
| capital one itin credit card | EN | Issuer-specific long-tail, low difficulty | — (pending GSC) |
| secured credit card with itin no ssn | EN | Specific long-tail, strong content match | — (pending GSC) |
| best itin credit cards 2026 | EN | Year-qualified listicle intent, AEO-friendly | — (pending GSC) |

---

## Site 3 — ITIN Credit Score · itincreditscore.com

Pillar `/itin-credit-score-guide`. Clusters: check-credit-score-with-itin,
build-credit-history-with-itin, improve-credit-score, credit-bureaus-and-itin,
credit-builder-loans, how-to-get-an-itin.

### Top 20 target keywords

| # | Keyword | Lang | Target page | Tier | Intent | Day-1 Rank |
|---|---|---|---|---|---|---|
| 1 | itin credit score | EN | /itin-credit-score-guide | Pillar | Commercial | — (pending GSC) |
| 2 | credit score with itin number | EN | /itin-credit-score-guide | Pillar | Info | — (pending GSC) |
| 3 | can you have a credit score with an itin | EN | /itin-credit-score-guide | Pillar | Info | — (pending GSC) |
| 4 | does itin have credit score | EN | /itin-credit-score-guide | Pillar | Info | — (pending GSC) |
| 5 | credit score for immigrants without ssn | EN | /itin-credit-score-guide | Pillar | Info | — (pending GSC) |
| 6 | check credit score with itin | EN | /check-credit-score-with-itin | Cluster | Commercial | — (pending GSC) |
| 7 | how to check credit score with itin | EN | /check-credit-score-with-itin | Cluster | Info | — (pending GSC) |
| 8 | check credit score with itin number | EN | /check-credit-score-with-itin | Cluster | Commercial | — (pending GSC) |
| 9 | how to get credit score without ssn | EN | /check-credit-score-with-itin | Cluster | Info | — (pending GSC) |
| 10 | check credit score without ssn | EN | /check-credit-score-with-itin | Cluster | Commercial | — (pending GSC) |
| 11 | build credit history with itin | EN | /build-credit-history-with-itin | Cluster | Info | — (pending GSC) |
| 12 | how to build credit with itin | EN | /build-credit-history-with-itin | Cluster | Info | — (pending GSC) |
| 13 | improve credit score with itin | EN | /improve-credit-score | Cluster | Info | — (pending GSC) |
| 14 | how to raise credit score with itin | EN | /improve-credit-score | Cluster | Info | — (pending GSC) |
| 15 | credit bureaus itin | EN | /credit-bureaus-and-itin | Cluster | Info | — (pending GSC) |
| 16 | experian itin number | EN | /credit-bureaus-and-itin | Cluster | Long-tail | — (pending GSC) |
| 17 | transunion itin | EN | /credit-bureaus-and-itin | Cluster | Long-tail | — (pending GSC) |
| 18 | credit builder loan itin | EN | /credit-builder-loans | Cluster | Commercial | — (pending GSC) |
| 19 | how to get an itin | EN | /how-to-get-an-itin | Cluster | Info | — (pending GSC) |
| 20 | puntaje de crédito con itin | ES | /es/itin-credit-score-guide | Pillar | Info | — (pending GSC) |

### Quick-win watch (3–5)

| Keyword | Lang | Why it's a quick win | Day-1 Rank |
|---|---|---|---|
| itin credit score / itincreditscore.com | EN | Brand navigational | — (pending GSC) |
| check credit score with itin number | EN | Core long-tail with dedicated cluster page | — (pending GSC) |
| experian itin number | EN | Bureau-specific long-tail, low difficulty | — (pending GSC) |
| credit builder loan itin | EN | Niche long-tail, dedicated page | — (pending GSC) |
| does an itin have a credit score | EN | Question long-tail, strong Quick-Answer/AEO fit | — (pending GSC) |

---

## How to fill this in (turns `— (pending GSC)` into real numbers)

1. **Verify each domain in Google Search Console** (domain property via DNS TXT, or
   the `PUBLIC_GSC_VERIFICATION` meta tag already wired in `consts.ts`). Do all 3:
   itinlending.net, itincreditcard.com, itincreditscore.com.
2. **Submit `sitemap-index.xml`** for each in GSC, and request indexing on the pillar
   + each cluster page (URL Inspection → Request Indexing).
3. **Add Bing Webmaster Tools** too (feeds ChatGPT/Copilot citations).
4. Once GSC has ≥2–3 days of data, the daily report's GSC step (see
   `project-docs/ANALYTICS-PLAN.md`) pulls **avg position, impressions, clicks, CTR**
   for every keyword in this file and writes a dated rank report that diffs vs. Day 1.
5. Terms that show no impressions after ~60 days = either not indexed or no demand —
   flag for content work or drop from the tracked set.

**Metric tracked per keyword going forward:** GSC average position (primary),
impressions, clicks, CTR. "Rank" = GSC avg position for that query→page pair.
