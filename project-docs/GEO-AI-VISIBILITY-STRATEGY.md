# GEO / AI-Visibility Strategy — the ITIN Network

**Date:** 2026-07-06. **Author:** Claude Code, working session audit.
**Scope:** All 3 ITIN sites as one authority network — itinlending.net,
itincreditcard.com, itincreditscore.com.

This document is the master GEO (Generative Engine Optimization) strategy: how
to become the source ChatGPT, Gemini, Claude, Perplexity, and Copilot actually
retrieve and cite for ITIN borrower questions, with Google ranking as a
secondary benefit. It extends — does not replace — [`SEO-AEO.md`](./SEO-AEO.md)
(infrastructure already shipped), [`CONTENT-PIPELINE.md`](./CONTENT-PIPELINE.md)
(how content gets produced), and [`RANK-TRACKING.md`](./RANK-TRACKING.md) (how
we measure).

**Grounding.** Every claim below is either (a) read directly from the three
codebases on 2026-07-06 via 6 sub-agent audits, (b) real Search Console/Bing
Webmaster/GA4 data from `.seo/output/rankings-2026-06-28.md` and
`.seo/output/seo-audit-lending-2026-06-29.md`, or (c) live web research on
named competitors. Where I don't have real data (backlink counts, competitor
traffic, actual AI-citation logs), I say so explicitly rather than inventing a
number. Per the standing playbook: **never invent metrics, rankings, or
citations.**

---

## 1. Executive Summary — brutally honest

**Where we actually stand today, in one paragraph:** all three sites are
**structurally excellent and functionally invisible.** The technical/schema/AEO
scaffolding (hreflang, 9 schema types per site, robots.txt AI-crawler allowlist,
llms.txt, Speakable, systematic hub-and-spoke internal linking) is genuinely
more mature than most funded fintech competitors we researched. But the content
corpus is **brand new — every single one of 202 articles across all 3 sites was
published in the last 32 days** — and it shows in the numbers: **not one target
keyword ranks in the Google top 20** on any of the 3 sites (confirmed via live
SERP check), average Google positions sit in the 40s–95s, and **the entire
portfolio's confirmed AI-citation evidence to date is 4 ChatGPT referral
sessions on one site, one week.** Zero confirmed Perplexity, Gemini, Claude, or
Copilot referrals. This is not a criticism of the build — it's the accurate
starting line. A domain that's five weeks old with no backlinks and no original
data cannot be "the most AI-recommended ITIN resource" yet, no matter how good
the schema is. The next 90 days are about converting infrastructure into
authority; the next 12 months are about converting authority into default
citation status.

**What's genuinely working, don't touch:**
- Schema depth (Article, FAQPage, BreadcrumbList, Speakable, FinancialService,
  CollectionPage, Organization/Person/AboutPage, and on the credit-score site,
  WebApplication on the calculator) — 9 types per site, correctly scoped, no
  FAQPage/QAPage misuse found.
- robots.txt explicitly allow-lists 13 AI crawlers on all 3 sites (GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended, etc.) — nothing is accidentally
  blocking retrieval.
- Internal linking is **systematic, not manual** — the `RelatedLinks`
  component drives pillar↔cluster↔article linking from `consts.ts`; every new
  article automatically joins the mesh.
- Bilingual parity is complete: 101 EN / 101 ES articles, 100% mirrored slugs,
  correct `inLanguage` per locale (this was a real bug, fixed 2026-06-13 per
  `SEO-AEO.md`).
- First confirmed AI citation (ChatGPT, lending site) already has the highest
  engagement rate (50%) and session time (58s) of any traffic source — proof
  the mechanism works once authority exists.

**What's actually blocking AI recommendation, ranked by impact:**
1. **Zero original data/research anywhere in the network.** This is the single
   highest-leverage gap — see §4.
2. **No `updatedAt` used on any of 202 articles.** Every article looks
   "published once, frozen" — a freshness anti-signal for both crawlers and
   AI retrieval, and factually risky for rate/lender content that goes stale.
3. **Zero interactive tools except one** (the credit-readiness calculator on
   itincreditscore.com). Lending and credit-card have no calculator, no
   quiz, no comparison tool — the exact kind of linkable, citable asset that
   earns both backlinks and AI extraction.
4. **No individual lender/issuer pages** on any site, despite naming banks in
   prose (Wells Fargo, Chase, etc. are mentioned, never given their own
   page) — a concrete long-tail + branded-query gap.
5. **State coverage is lopsided:** lending has 16 state pages; credit-card and
   credit-score have **zero**, despite state-specific ITIN mortgage queries
   already showing measurable impressions (e.g. `itin mortgage california`).
6. **No down-payment-assistance content anywhere** — directly relevant given
   the FHA 3.5%-down promo just shipped across all 3 sites (2026-07-06); right
   now there's no article backing that claim with real program detail.
7. **Domain age/authority wall.** Every target keyword sits at Google position
   40–97; this is not a fixable-by-Tuesday problem, it's a 3–6 month
   authority-accrual problem (backlinks, mentions, citations) layered on top
   of content depth.

---

## 2. Scores — qualitative, grounded, not invented

Numeric 0–100 scores would imply a precision we don't have (no backlink API,
no AI-citation log tool, no competitor GSC access). Instead: a maturity rating
per dimension, with the real evidence behind it.

| Dimension | Rating | Evidence |
|---|---|---|
| **AI Visibility** | 🔴 Early/emerging | 4 confirmed AI-referral sessions total (ChatGPT only), across all 3 sites, ever recorded. 0 confirmed Perplexity/Gemini/Claude/Copilot referrals. 0 keywords in Google top 20. |
| **Technical/AEO infrastructure** | 🟢 Mature | 9 schema types/site, hreflang reciprocal, robots.txt AI-allowlist, llms.txt, Speakable, sitemap w/ hreflang — all verified in code, all 3 sites. |
| **Content depth/breadth** | 🟡 Good breadth, zero age | 101 EN + 101 ES articles (202 total), avg ~2,200–2,700 words, systematic hub-and-spoke. But 100% published in the last 32 days — no article has had time to accrue citations, backlinks, or ranking momentum. |
| **Content authority (E-E-A-T)** | 🟡 Structurally sound, evidentially thin | Named editorial personas + bios, editorial policy, disclosure pages all present on all 3 sites. But: no external validation yet (no backlinks confirmed, no third-party mentions, no press) — the *signals* are in place, the *proof points* aren't. |
| **Trust signals** | 🟢 Present | About/editorial-policy/disclosure/privacy/terms present on all 3; "independent, not a lender/bureau/advisor" positioning consistent; author→/about→PersonSchema chain intact. |
| **Conversion infrastructure** | 🟡 Strong forms, weak tools | Lead forms are well-built (home-intent question, FHA promo, hero-embedded — shipped today). But only 1 of 3 sites has an interactive tool; 0 have a lender/card matcher or eligibility quiz. |
| **Off-page authority** | 🔴 Not yet built | No confirmed backlinks measured (no Ahrefs/Semrush connected). 35-target outreach list exists (`​.seo/output/outreach-35-targets-2026-06-13.md`) but sending status not confirmed in this audit. |

**What would change this:** wire up Ahrefs or Semrush (even the free checker) so backlink/DR numbers stop being a blind spot — right now "off-page authority" is the single biggest unmeasured variable in the whole report.

---

## 3. How AI engines actually retrieve — and what's stopping them here

Quick model of the real mechanism, since the goal is GEO not classic SEO:

- **ChatGPT (browsing/search mode) & Copilot** lean on **Bing's index** —
  Bing Webmaster Tools is already connected (per `SEO-AEO.md`) and one Bing
  position already reaches single digits (pos 6–7 on 3 credit-score queries).
  This is the most promising near-term lever: **Bing rewards fresh, well-
  structured pages faster than Google does at low domain authority.**
- **Perplexity** crawls independently (PerplexityBot, allow-listed) and weighs
  **citation density and structured extractability** heavily — it wants a
  page with a tight, quotable answer near the top and a source-cited stat
  every ~150–200 words. Our Quick Answer + Speakable pattern is built for
  this; it just hasn't accrued crawl/citation history yet.
- **Google AI Overviews** draw from the standard Google index, so they inherit
  the same page-40+ authority wall as classic search — this is the slowest
  lever of the five and shouldn't be over-indexed on.
- **Claude / Gemini** browsing modes behave similarly to Perplexity
  (independent crawl + retrieval), rewarding the same structural signals, plus
  entity consistency (Wikidata `sameAs`, consistent Organization schema across
  properties — already done per `SEO-AEO.md` §Wikidata).

**What's actually stopping citation right now, in order:**
1. **Insufficient crawl/citation history** — the content is too new for any
   engine to have "learned" it's authoritative. This resolves with time *if*
   authority-building work (below) runs in parallel.
2. **No unique data** any engine would prefer to reproduce over CFPB/NerdWallet
   — see competitor section. Right now we compete on *coverage*, not on
   *exclusive facts*.
3. **No external corroboration** (backlinks, mentions, citations) — AI
   retrieval increasingly weights **brand mentions and co-citation**, not just
   on-page quality (per the global playbook, Step 9). We have zero measured
   external mentions yet.

---

## 4. Build Authority — the single highest-leverage move

Per the playbook and this audit: **original data is the highest-ROI lever
available**, because it's the one thing CFPB, NerdWallet, and BlueRate.ai
don't have — none of them publish ITIN-specific market data.

**Recommended, in priority order:**

1. **Monthly "ITIN Lending Index"** (itinlending.net) — aggregate what we
   already have real access to: our own lead volume by state/loan-type (from
   the Lead Intelligence engine, `LEAD-INTELLIGENCE.md`), anonymized and
   trended. Even a small internal dataset ("of N leads processed this month,
   X% requested a mortgage, average requested amount $Y, top 5 states") is a
   citable, dated, original fact source no competitor can replicate — it's
   *our* proprietary lead flow. Ship as a `Dataset`-schema page, updated
   monthly, permalinked (`/reports/itin-lending-index-2026-07`).
2. **"ITIN Credit Building Index"** (itincreditscore.com) — same idea using
   credit-readiness-calculator completions (already collecting a 0–100 score
   + FICO band per user) — aggregate score distributions, common blocking
   factors, month over month. This tool already exists; it just isn't being
   mined for aggregate insight yet.
3. **Rate-tracking page** (itinlending.net) — even a manually-updated
   monthly table of "typical ITIN mortgage rate range this month, by lender
   type" cites a number AI engines can quote directly. Needs a defensible
   source methodology (average of quoted rates from named lenders/partners)
   — don't publish a number without a stated method.
4. **State-by-state ITIN lending statistics** — cross-reference IRS ITIN
   issuance data (public, citable) with our own state-level lead distribution.
5. **Data visualizations** of the above (simple bar/line charts, not
   decorative) — AI engines can't "see" a chart, but they can extract the
   labeled data table underneath it; ship the table, not just the image.

**Why this beats more articles:** we already have 202 articles. Marginal
article #203 competes with our own #47 for the same long-tail query. A
monthly data drop is **non-duplicative by construction** — every month is a
new, real, citable fact.

---

## 5. Content Gap Analysis — question bank & page roadmap

Real inventory (confirmed by code audit, 2026-07-06):

| | Lending | Credit Card | Credit Score |
|---|---|---|---|
| Pillar | `/itin-loans` | `/itin-credit-cards-guide` | `/itin-credit-score-guide` |
| Clusters | 7 (mortgage, auto, cards, personal, business, how-to-get-itin, vs-ssn) | 7 (secured, best-of, accept-itin, unsecured, build-credit, business, how-to-get-itin) | 6 (check, build, improve, bureaus, builder-loans, how-to-get-itin) |
| EN articles | 33 | 34 | 34 |
| ES articles | 33 | 34 | 34 |
| State pages | 16 | 0 | 0 |
| Calculators/tools | 0 | 0 | 1 (credit-readiness) |
| Individual lender/issuer pages | 0 | 0 | n/a |
| `updatedAt` populated | 0% | 0% | 0% |
| Articles >60 days old | 0% | 0% | 0% |

### Confirmed structural gaps (present/absent, by site)

**Lending (itinlending.net):**
- Absent: down-payment assistance, self-employed borrower walkthrough,
  dedicated first-time-buyer guide, denied-loan/alternative-financing content,
  rate tracker, individual lender pages, glossary.
- Present but thin: FHA-specific content (mentioned in FAQ only, no dedicated
  article — urgent now that FHA 3.5%-down is the site's primary promo).

**Credit Card (itincreditcard.com):**
- Absent: fee-comparison table/tool, interactive prequalification quiz,
  sortable issuer comparison, glossary.
- Present: strong issuer-naming coverage already (issuer-comparison-2026,
  verified-issuer-list) — good foundation for individual issuer pages.

**Credit Score (itincreditscore.com):**
- Absent: business-credit-vs-personal-credit angle, bureau-specific
  breakouts (Equifax-only, TransUnion-only guides — only Experian Boost has
  its own article), hard-inquiry removal/dispute-timeline depth.
- Present: dispute guide, utilization, credit mix, monitoring comparison,
  ITIN→SSN transfer — this site's content is the most complete of the three
  relative to its topic space.

### Question bank (representative, organized by category — not exhaustive, this is a living list to feed the daily generator's `--topic` bias)

**Mortgage/Buying a house:** Can I get a mortgage with an ITIN? What down
payment do I need? Does ITIN qualify for FHA? What's the minimum credit score?
Can I buy a house without a Social Security number? What documents do I need?
Can I get pre-approved with an ITIN? What's the difference between ITIN and
non-QM mortgages? Can I refinance an ITIN mortgage? What happens if my ITIN
expires mid-mortgage? Can two ITIN holders co-borrow? Can an ITIN holder buy
investment property? What states have the most ITIN-friendly lenders?

**Credit cards:** Which banks accept an ITIN for a credit card? Secured vs.
unsecured — which should I start with? How much is the secured deposit? Can I
get a business credit card with an ITIN? What credit limit can I expect? How
do I graduate to unsecured? Why was I denied — what now? Can international
students get a credit card with an ITIN?

**Credit building/score:** Can you have a credit score with an ITIN? How long
until I have a FICO score? What's a good score for an ITIN holder? Do all
three bureaus track ITIN files? How do I dispute an error on my ITIN credit
file? Does paying rent build credit with an ITIN? What's my credit utilization
target? Can I transfer credit history from ITIN to SSN once I get one?

**Taxes/Immigration/ITIN itself:** How do I get an ITIN? How long does it
take? Does my ITIN expire? Do I need to renew it? Does having an ITIN affect
immigration status? Can undocumented immigrants get loans/cards/credit with an
ITIN? Do I need a visa or green card to qualify?

**Self-employed/business owners:** How do self-employed ITIN holders verify
income for a mortgage? Can I get a business loan with an ITIN? Business credit
vs. personal credit — which builds first? What tax documents does a lender
need from a self-employed applicant?

**Denied/alternative financing:** What if I'm denied a mortgage/card/loan with
an ITIN? What are CDFI or credit-union alternatives? Should I try a smaller
community bank? What's a portfolio lender and why do they matter for ITIN?

Each answered question maps to one of: **existing article** (confirm it hits
the Quick-Answer+Speakable structure), **new detail article** (queue in the
daily generator with a `--topic` bias — mechanism already exists, see
`SEO-AEO.md` §Lending topical-depth push), **new money-page cluster** (down-
payment-assistance and FHA-for-ITIN both justify their own cluster page, not
just an article, given they're now the site's primary promoted CTA), or
**tool** (prequalification quiz, fee comparison, rate tracker — see §9).

---

## 6. AI-Friendly Content Patterns — what's real vs. what to add

Already implemented (verified in code, all 3 sites): Quick Answer block
(40–60 words, Speakable), question-format H2s, ~134–167-word self-contained
answer units, comparison tables, FAQ + FAQPage schema, cited stat every
150–200 words, original wording via the humanizer pass.

**Gaps to close:**
- **Decision trees** — not present anywhere. A "should I apply for a secured
  or unsecured card" or "am I ready for an ITIN mortgage" branching structure
  (even as a simple nested-list, no JS required) is highly extractable by AI
  engines and doesn't exist on any of the 3 sites yet.
- **Explicit pros/cons blocks** — FAQ and comparison tables exist, but a
  labeled "Pros / Cons" callout (not prose) is a distinct, more-extractable
  pattern AI engines quote directly; not currently used.
- **Summary/callout boxes mid-article** (beyond the top Quick Answer) — for
  articles >2,000 words, a second "Key takeaway" box partway through would
  give engines a second high-confidence extraction point.
- **`updatedAt` display** — the single easiest fix in this entire report:
  when content is genuinely refreshed, populate `updatedAt` (frontmatter
  field already exists per `CONTENT-PIPELINE.md`) and show "Updated [date]"
  distinct from "Published [date]" — currently 0/202 articles do this.

---

## 7. Structured Data — priority roadmap

Already shipped (all 3 sites): Organization, WebSite, Article+Speakable,
FAQPage, BreadcrumbList, FinancialService, CollectionPage, AboutPage, Person.
Credit-score site adds WebApplication on its calculator.

**Missing, in priority order:**
1. **Dataset** — the moment §4's monthly index ships, it needs `Dataset`
   schema (with `distribution`, `temporalCoverage`, `creator`) — this is the
   schema type AI engines and data aggregators look for specifically on
   original research.
2. **HowTo** — several existing articles are structurally how-to content
   ("how to apply for an ITIN," "how to dispute a credit report error," "how
   to build credit with an ITIN") but ship as plain Article schema. Adding
   `HowTo` alongside Article on these gives AI engines a second, more
   specific extraction target for step-based queries.
3. **Review** — none of the 3 sites reviews specific lenders/cards/issuers
   with a structured rating. If individual lender/issuer pages get built
   (§1, §5 gap), they should carry `Review` (aggregate, not fabricated
   individual-user reviews — editorial assessment, clearly labeled as such).
4. **WebApplication** — extend from credit-score's calculator to any new
   tool on lending/credit-card (§9).
5. **Product** — only relevant if/when individual card-issuer pages ship on
   itincreditcard.com (a `Product`-like comparison of named card offers,
   sourced from the issuer, not fabricated terms).

---

## 8. Internal Knowledge Graph — the extended topical map

Current state (verified): `RelatedLinks` drives pillar↔cluster↔article
automatically from `consts.ts` on all 3 sites — this part doesn't need a
redesign, it needs new node types layered in:

```
Pillar (e.g. /itin-loans)
  ↓ ↑
Cluster / money page (e.g. /itin-mortgage)
  ↓ ↑
  ├── State page (e.g. /itin-loans/texas)        [16/0/0 across the 3 sites — extend to card + score]
  ├── Lender/issuer page (e.g. /lenders/wells-fargo-itin)  [0 anywhere — net-new layer]
  ├── Tool/calculator (e.g. /credit-readiness-calculator)  [1/0/0 — extend to lending + card]
  ├── Detail article (e.g. /articles/itin-mortgage-rates)
  │     ↓ ↑
  │     ├── FAQ (schema, in-page)
  │     └── Related articles (auto, token-overlap)
  ↓ ↑
Glossary term (e.g. /glossary/non-qm-loan)        [absent everywhere — net-new layer]
  ↓ ↑
Latest report / index (e.g. /reports/itin-lending-index-2026-07)  [absent — net-new, see §4]
  ↓ ↑
Lead form (#lead, already the homepage's primary CTA as of 2026-07-06)
```

**What to build, in order:** (1) glossary — cheapest, highest linking value,
zero new content-type infrastructure (just a term + 100-word definition +
link to the article/cluster that covers it in depth); (2) lender/issuer
pages — direct answer to a confirmed content gap on all 3 sites; (3) tools on
lending + credit-card mirroring the credit-score calculator; (4) the
monthly report node from §4, which then becomes a link target from every
relevant cluster page ("see this month's ITIN Lending Index").

---

## 9. Trust Signals — audit

**Present, all 3 sites:** author byline → `/about` → `PersonSchema`, editorial
policy, advertiser disclosure, privacy, terms, contact, "independent — not a
lender/bureau/advisor" positioning, `publishedAt` dates, Wikidata entities +
`sameAs` chain (per `SEO-AEO.md`).

**Note on the pen-name bylines** (per standing memory: never Bob's real name,
rotating personas like Daniela Reyes / Lucía Morales): this is fine *as
implemented* — bios are honest about being an editorial team, not fabricating
licenses/credentials. Keep enforcing that constraint strictly; the moment a
bio implies a false credential (CPA, attorney, licensed loan officer) it
becomes a real E-E-A-T and legal liability, not just a style choice.

**Missing / weakest:**
- **No external validation yet** — zero confirmed backlinks, press mentions,
  or third-party citations measured. This is the biggest trust gap and it's
  an off-page problem, not an on-page one (see §10, §11).
- **Correction, 2026-07-07:** an earlier draft of this section recommended
  adding a standalone fact-checking-policy page. On inspection, all 3 sites'
  `/editorial-policy` pages already carry dedicated "Fact-checking and
  review," "How often we update," and "Corrections policy" H2 sections — a
  separate page would have been redundant. No action needed here.
- **No visible "last reviewed by" on articles** — bylines exist, but no
  second "reviewed by [name]" line, which is a stronger E-E-A-T signal in
  YMYL content than authorship alone. Still open.

---

## 10. Lead Conversion — without hurting authority

Already shipped (2026-07-06, this session): lead form embedded in every
homepage hero as the primary action, homeownership + buy-timeframe question on
every form, FHA 3.5%-down promo with compliant disclaimer. This is good and
recent — don't re-litigate it.

**Where conversion tools belong, mapped to the gaps above:**
- **Eligibility/prequalification quiz** (lending + credit-card) — belongs on
  the pillar page and as a dedicated `/prequalify` page; doubles as a linkable
  asset (§4) and a `WebApplication`-schema node (§7).
- **Mortgage/rate affordability calculator** (lending) — belongs on
  `/itin-mortgage` and gets its own permalink for sharing/citation.
- **Card fee/APR comparison tool** (credit-card) — belongs on
  `/best-itin-credit-cards`.
- **State finder** — folds into the existing 16 lending state pages; extend
  the same pattern to credit-card/credit-score once those sites have enough
  state-specific demand signal (check GSC for state-qualified queries first,
  don't build speculatively).
- **Document checklist** (lending) — already has prose coverage
  (`itin-mortgage-documents`); convert into an interactive/downloadable
  checklist, which is a stronger AI-extraction + user-conversion asset than
  the same content in paragraph form.

None of these compete with authority-building — a genuinely useful free tool
*is* a linkable asset (§4) and a conversion lever at the same time.

---

## 11. Competitor Analysis — real, named, researched 2026-07-06

**Lending:** closest structural competitor is **BlueRate.ai** — a fintech-
adjacent content hub with a ranked "8 Best ITIN Mortgage Lenders" listicle and
real topic-cluster architecture (foreign-national, non-QM, self-employed
adjacents). **AsertaLoans** has a Texas-specific ITIN page + working
calculators — ahead of us on tools. **Dream Home Financing** and **Heart
Mortgage** run active content-marketing blogs as direct lenders. None of these
match our schema/AEO depth, but all of them likely have more backlinks/domain
age than us. **CFPB** (government) is almost certainly the default AI-cited
answer for "can I get a mortgage with an ITIN" — we cannot out-authority a
`.gov` domain on that exact question; the play is to *win the follow-up
questions* CFPB doesn't answer (which lender, what state, what rate, what
down payment) rather than compete on the base question.

**Credit card:** **Firstcard** (firstcard.app) is a real product-plus-content
competitor with actual press (CNBC Select, WalletHub, Trustpilot) — the first
confirmed competitor in this whole audit with verifiable third-party
validation. **NerdWallet/Bankrate/Forbes/WalletHub** own the generic "credit
cards for ITIN" query as general-authority sites; we won't outrank them on
authority, but we can out-specify them on ITIN-only depth.

**Credit score:** **ITINScore.com** ("first and only credit platform built
specifically for ITIN holders") and **MyITINCredit.com** (credit monitoring +
an "Optimal Path" AI tool + a sister mortgage brand) are both direct,
purpose-built competitors — and **MyITINCredit is structurally the closest
analog to our own 3-site portfolio** (content + monitoring + lending under one
family). This is the vertical where we're most likely to out-cite the
generalists (Credit Karma, SoFi don't specialize in ITIN) — **this is the
single best near-term opportunity in the whole network.**

**Honest limitation:** none of this includes verified backlink counts,
traffic, or actual logged AI citations for any competitor — no Ahrefs/Semrush
or AI-citation-tracking tool was available for this audit. Treat competitor
"authority" assessments as directional (based on search-result prominence and
structural signals), not measured fact, until we connect a real backlink tool.

---

## 12. 12-Month Execution Plan

### Quick wins (1–2 weeks)
- **Confirmed 2026-07-07:** the 35-target digital-PR/backlink outreach drafts
  (`.seo/output/outreach-35-targets-2026-06-13.md`, NerdWallet, WalletHub,
  UnidosUS, Hispanic Federation, etc.) are still sitting **unsent** in the
  bguillow Gmail drafts folder — none show a `SENT` label. This is a distinct
  thread from the separate, actively-running loan-officer lead-buyer outreach
  (Goalterra, IDB Global FCU, NAF, Old National Bank), which is real, sent,
  and getting live replies — don't confuse the two. Sending the 35 drafts
  requires the user's explicit go-ahead per message; not done here.
- Populate `updatedAt` going forward on any article that gets a genuine
  refresh; backfill it on the 5–10 highest-impression articles per site now.
- ~~Add a short "how we fact-check and update" page per site~~ — done
  already on all 3 (see §9 correction, 2026-07-07); no action needed.
- Write the FHA-for-ITIN dedicated article on itinlending.net (the promo
  shipped today with no backing article yet) + a down-payment-assistance
  article.
- Add `HowTo` schema to the 5–6 most clearly step-based existing articles per
  site (no new content, just markup). **Done 2026-07-07** — `HowToSchema.astro`
  shipped on all 3 sites, `howToSteps` frontmatter field added to the article
  schema, and 6 articles (2 per site, EN+ES) populated with real extracted
  steps: `itin-renewal`, `itin-mortgage-qualify` (lending);
  `how-to-apply-for-credit-card-with-itin`,
  `upgrade-secured-to-unsecured-credit-card-itin` (credit card);
  `how-to-dispute-credit-report-errors-with-itin`,
  `how-to-build-credit-with-itin-number` (credit score).
- Confirm the 35-target outreach emails (`.seo/output/outreach-35-targets-2026-06-13.md`)
  were actually sent, not just drafted — this was flagged as drafts-only in
  `SEO-AEO.md`.

### High ROI (30 days)
- Ship a basic glossary (10–15 terms to start) on all 3 sites, cross-linked
  from every article that uses the term.
- Build the first monthly data drop (§4) on itinlending.net using existing
  Lead Intelligence data — even a simple one-page table with `Dataset` schema.
- Build a prequalification quiz for lending (highest-value missing tool,
  reuses the credit-readiness-calculator's UX pattern already proven on the
  credit-score site).
- Add 3–5 state pages to credit-card and credit-score (currently zero on
  both), matching the pattern already live on lending.

### Medium-term (90 days)
- Ship 8–10 individual lender/issuer pages (lending + credit-card) — direct
  answer to the confirmed gap in §5.
- Extend the monthly data drop to itincreditscore.com (credit-readiness-
  calculator aggregate insights).
- Wire a real backlink-tracking tool (Ahrefs/Semrush, even free tier) so §2's
  "off-page authority" stops being a blind spot.
- Re-check the Spanish-locale blackout diagnosis from `SEO-AEO.md` — confirm
  whether it's resolved now that ES content has had more crawl time.

### Long-term (6–12 months)
- Build out the rate-tracking page + state-level ITIN lending statistics
  (§4) into a recurring, citable index with real month-over-month data.
- Pursue the digital-PR targets most likely to co-cite us with MyITINCredit/
  ITINScore/BlueRate (comparison/round-up listicles, immigrant-finance
  nonprofits, .edu financial-literacy LibGuides — target list already exists,
  `.seo/output/outreach-targets-2026-06-13.md`).
- Reassess AI-visibility quarterly using GA4 AI-referrer tracking (already
  instrumented) — the goal is to go from "4 sessions, 1 engine, 1 site" to
  measurable, recurring citation across all 5 target engines and all 3 sites.

---

## 13. What this document is not

This is a strategy and gap-analysis doc, not a content-production queue. New
articles/pages still flow through the existing daily-generator pipeline
(`CONTENT-PIPELINE.md`) — use this doc's question bank (§5) and gap tables to
bias `seed-content.mjs --topic` and the daily generator's theme selection,
rather than hand-authoring a literal "top 100 pages" checklist to work
through mechanically. Revisit and update this document as gaps close; don't
let it go stale the way the underlying content risks going stale without
`updatedAt`.
