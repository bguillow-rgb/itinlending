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
citations"*), the **`GSC pos (pending)`** column in each table is intentionally
`— (pending GSC)`. These are **not** fabricated positions. They get backfilled from
GSC Search Analytics once Console is verified and the sites index (see "How to fill
this in" at bottom).

**Manual Day-1 snapshot (added on request):** a one-off live Google web-search check
was run for every tracked keyword on 2026-06-06 and is recorded in a "Manual Day-1
snapshot" block under each site. ⚠️ Treat it as a rough, one-time sample, **not** the
tracked metric: web-search results are personalized/localized and don't reproduce
GSC's impression-weighted average position. Where a site doesn't appear, it's recorded
as *not in top 10* (could be page 2+, or simply not indexed yet). GSC remains the
authoritative recurring number.

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
1. **301 redirect coverage of *actually-indexed* legacy URLs** (verified against the
   redirect maps today):
   - **Site 1 ✅ covered** — `itinlending.net/2023/10/how-to-change-itin-to-ssn-with-irs-online-a-simple-guide/`
     is explicitly mapped → `/itin-vs-ssn` in `web/docs/redirects.csv`.
   - **Site 3 ❌ GAP** — `~/ITINCreditScore/web/docs/redirects.csv` is **empty/missing**,
     so the indexed legacy URLs (`/credit-reports-with-itin`,
     `/f/understanding-itin-and-your-credit-score`, `/start-building-now`) have **no
     301** and will 404 on cutover, dumping their ranking signal. **Build site 3's
     redirect map before/at cutover.** Suggested targets: `/credit-reports-with-itin`
     → `/credit-bureaus-and-itin`; `/f/understanding-itin-and-your-credit-score` →
     `/itin-credit-score-guide`; `/start-building-now` → `/build-credit-history-with-itin`.
   - **Site 2** — nothing indexed, so no legacy-URL signal to preserve.
2. **Request indexing** of each new pillar + cluster URL in GSC URL Inspection.
3. **Competitor set for site 2** discovered in the SERP (track these as the field to
   beat): Firstcard, Bankrate, NerdWallet, Capital One, Stilt, Taxsym.

---

## Site 1 — ITIN Lending · itinlending.net

Pillar `/itin-loans`. Clusters: itin-mortgage, itin-auto-loan, itin-credit-cards,
itin-personal-loans, itin-business-loans, how-to-get-an-itin, itin-vs-ssn.

### Top 20 target keywords

| # | Keyword | Lang | Target page | Tier | Intent | GSC pos (pending) |
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

| Keyword | Lang | Why it's a quick win | GSC pos (pending) |
|---|---|---|---|
| itin lending / itinlending.net | EN | Brand navigational — should rank #1 once indexed | — (pending GSC) |
| itin loan with bad credit | EN | Low-competition long-tail with a dedicated detail article | — (pending GSC) |
| itin car loan | EN | Long-tail, dedicated content, weak SERP competition | — (pending GSC) |
| can i buy a car with itin number | EN | Question long-tail, strong AEO/Quick-Answer fit | — (pending GSC) |
| itin vs ssn for loans | EN | Informational long-tail, low difficulty | — (pending GSC) |

### Manual Day-1 snapshot — Site 1 (web search, 2026-06-06)

⚠️ One-off Google web-search sample, not the tracked GSC metric.

- **Only ranking presence = brand.** `itinlending.net` returns its **own homepage at
  #1** and the legacy `/2023/10/how-to-change-itin-to-ssn…` page at **#2**.
- **All 20 commercial/informational targets: not in top 10.** SERPs are dominated by
  credit unions + aggregators (Embold CU, Fibre FCU, WalletHub, NerdWallet,
  CrossCountry, FNBA, Guild, Lendbuzz, dealership pages).
- The indexed legacy article does **not** rank for its own topic query
  ("how to change itin to ssn" → ein-itin.com, IRS, FreedomTax rank; itinlending.net
  absent), i.e. legacy content holds the index slot but no useful position.
- **Field to beat:** emboldcu.org, fibrecu.com, wallethub.com, nerdwallet.com,
  crosscountrymortgage.com, lendbuzz.com.

---

## Site 2 — ITIN Credit Card · itincreditcard.com

Pillar `/itin-credit-cards-guide`. Clusters: credit-cards-that-accept-itin,
secured-credit-cards, unsecured-credit-cards, business-credit-cards,
build-credit-with-itin, how-to-get-an-itin.

### Top 20 target keywords

| # | Keyword | Lang | Target page | Tier | Intent | GSC pos (pending) |
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

| Keyword | Lang | Why it's a quick win | GSC pos (pending) |
|---|---|---|---|
| itin credit card / itincreditcard.com | EN | Brand navigational | — (pending GSC) |
| credit cards that accept itin number | EN | Core long-tail with dedicated cluster page | — (pending GSC) |
| capital one itin credit card | EN | Issuer-specific long-tail, low difficulty | — (pending GSC) |
| secured credit card with itin no ssn | EN | Specific long-tail, strong content match | — (pending GSC) |
| best itin credit cards 2026 | EN | Year-qualified listicle intent, AEO-friendly | — (pending GSC) |

### Manual Day-1 snapshot — Site 2 (web search, 2026-06-06)

⚠️ One-off Google web-search sample, not the tracked GSC metric.

- **Zero ranking presence — not even brand.** A search for `itincreditcard.com`
  itself returns **only competitors** (Capital One, Firstcard, Bankrate, NerdWallet,
  Finder, Yendo, Taxsym). The domain is **not indexed**.
- **All 20 targets: not in top 10.** This is the cleanest "Day 1 = zero" of the three
  — every position is open.
- **Field to beat:** firstcard.app (ranks repeatedly + owns "credit cards that accept
  itin"), capitalone.com, bankrate.com, nerdwallet.com, discover.com, wallethub.com,
  cnbc.com/select. Also note adjacent competitor **itinscore.com** (a Site 3 rival).
- **First action:** indexation is the blocker — verify GSC + request indexing before
  any keyword tracking is meaningful here.

---

## Site 3 — ITIN Credit Score · itincreditscore.com

Pillar `/itin-credit-score-guide`. Clusters: check-credit-score-with-itin,
build-credit-history-with-itin, improve-credit-score, credit-bureaus-and-itin,
credit-builder-loans, how-to-get-an-itin.

### Top 20 target keywords

| # | Keyword | Lang | Target page | Tier | Intent | GSC pos (pending) |
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

| Keyword | Lang | Why it's a quick win | GSC pos (pending) |
|---|---|---|---|
| itin credit score / itincreditscore.com | EN | Brand navigational | — (pending GSC) |
| check credit score with itin number | EN | Core long-tail with dedicated cluster page | — (pending GSC) |
| experian itin number | EN | Bureau-specific long-tail, low difficulty | — (pending GSC) |
| credit builder loan itin | EN | Niche long-tail, dedicated page | — (pending GSC) |
| does an itin have a credit score | EN | Question long-tail, strong Quick-Answer/AEO fit | — (pending GSC) |

### Manual Day-1 snapshot — Site 3 (web search, 2026-06-06)

⚠️ One-off Google web-search sample, not the tracked GSC metric.

- **One real ranking presence (legacy page):** the old
  `itincreditscore.com/credit-reports-with-itin` page ranks **~#7 for the query
  "credit reports with itin"** — the only top-10 result any of the 3 sites holds for a
  non-brand term today. **This query is not in the target-20**, so it's added to the
  "already ranking" set below to track over time.
- **All 20 targets: not in top 10.** The new Astro topology isn't indexed yet; for
  head terms (itin credit score, credit score with itin number, check credit score
  with itin, etc.) the SERP is Experian, Self.inc, Credit Karma, myFICO, Taxsym.
- **Brand miss:** a plain `itincreditscore.com` query surfaces only competitors,
  though `site:` confirms 3 legacy URLs are indexed.
- **Field to beat:** experian.com, self.inc, creditkarma.com, ficoforums.myfico.com,
  taxsym.com, and direct rivals **itinscore.com / myitincredit.com / meetava.com**.

### Already ranking today (Site 3) — track for movement

| Query | URL ranking | Approx Manual Day-1 | Note |
|---|---|---|---|
| credit reports with itin | `/credit-reports-with-itin` (legacy) | ~#7 | Legacy page. Will move to `/credit-bureaus-and-itin` on redirect — preserve the signal (see redirect gap above). |

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
