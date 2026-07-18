# The Link Engine — automated authority plan for the ITIN family

_Created 2026-07-18. Trigger: GSC shows **1 external backlink** on itinlending.net
(marketwatch.com), ~0 on the siblings, while all money terms sit pos 70-90 on
Google and page-1 on Bing. Diagnosis confirmed: content is fine (Bing proves it);
Google-visible AUTHORITY is the missing input. This doc is the plan of record
for automating its acquisition._

## Ground truth (verified 2026-07-18)

- itinlending.net: **1** external link total (marketwatch.com, bare-URL anchor).
- Sites indexed and growing (78/64/27 indexed), zero technical blocks (GSC audit
  2026-07-18 — the "blocked pages" alerts were benign noindex-by-design).
- Bing: page-1 (multiple #1s). Google: pos 70-90 across ~430 queries, 0 clicks.
- Conclusion: every on-page lever is done or in motion; the binding constraint
  is links + brand mentions. Nothing else moves Google until this does.

## 2026 environment (researched 2026-07-18; sources in CHANGELOG entry)

- **July 2026 core update** rolled Jul 1-12 (continuation of June). Topical
  authority + freshness + visible E-E-A-T weigh heavier than ever.
- **Two June 2026 spam updates** (Jun 19 unconfirmed, Jun 24-26 confirmed).
  SpamBrain now *devalues* (not penalizes) marketplace links, exchanges, farms —
  meaning bought-at-scale gray links are mostly a silent money burn, not a
  ranking shortcut and usually not even a penalty.
- **May 15, 2026**: "manipulating generative AI responses" added as a named spam
  policy. Site-reputation-abuse (parasite) enforcement is algorithmic since Aug
  2025; spammy parasite pages now live ~6-8 weeks. BUT self-published,
  substantive content on Medium/LinkedIn/Reddit still ranks and still counts as
  brand presence ("white-hat parasite works better than ever").
- **~58% of US searches are zero-click.** Value shifts to being the cited/
  mentioned brand in AI Overviews + LLM answers. Brand mentions and
  co-citations are ranking inputs, not vanity.
- What the 2026 sources agree earns links for new sites: **digital PR on
  original data**, **100-200 clean citations/directories**, **linkable assets**,
  HARO-style expert sourcing, and resource-page/listicle outreach.

## The gray-hat ruling (eyes open)

User accepts "a little gray." Position taken:
- **Won't build:** comment/forum spam bots, mass fake-account creation, PBNs.
  Not a morals lecture — the June updates devalue these in weeks, platforms ban
  the accounts, and automated abuse of third-party sites risks the whole family
  (shared AdSense + Awin + CJ accounts). Bad ROI, real blast radius.
- **Will do (gray-adjacent, defensible):** aggressive syndication with canonicals,
  self-serve high-DR platform publishing (Medium/LinkedIn/Substack), directory
  volume, templated-at-scale outreach, Reddit/Quora presence at a human cadence.
- **User's call (budgeted gray):** hand-vetted niche edits/link buys from real
  sites (relevance + real traffic + outbound-link sanity). Cap ~$300-500/mo,
  lending site only, monthly link-profile review. Claude can vet candidates and
  track; purchase decisions stay with Bob.

## The engine — five automated systems

### System 1 — Citation & directory blitz (fully automatable, week 1)
Target: 75-150 clean listings per the 2026 baseline. Lists to hit: Hispanic/
immigrant chambers of commerce, financial-literacy directories, ES-language
business directories, credit/finance resource lists, standard NAP citations
(operator = Timberline Ventures LLC, info@timberlineventuresllc.com).
Automation: Claude-in-Chrome fills forms from a canonical NAP JSON; queue of
submissions with a per-site status ledger in `project-docs/citations.csv`.
Human step: none except CAPTCHA/email-verify clicks.

### System 2 — Syndication pipeline (fully automatable, week 1)
Weekly: take the best-performing article (by GSC impressions) per site →
auto-adapt (shortened, first-person desk voice, humanize pass) → publish to
Medium + LinkedIn (company/article) + Substack with canonical/attribution links
back to the original. LinkedIn is explicitly ranking for B2B-adjacent and
comparison queries in 2026; Medium ranks long-tails in 24-48h. This is the
compliant "white parasite" play: substance, own accounts, no paid placement.
Automation: GitHub Actions cron drafts + browser-automation publish with a
one-tap approval (iMessage digest, same pattern as the daily KPI report).

### System 3 — Expert-source responder (semi-auto, week 1-2)
Sign up: Connectively (ex-HARO), Qwoted, SourceBottle, Help a B2B Writer,
Featured.com. Automation: inbound query emails hit a parser (Gmail label →
script) → Claude filters for ITIN/immigrant-finance/credit relevance → drafts
expert answers as "the ITIN Lending Research Desk (Timberline Ventures)" →
morning approval digest → send from bob@. Journalist replies = DR60-90
editorial links, the exact kind SpamBrain can't devalue. Expected: 1-4
links/mo at steady state.

### System 4 — The Data Engine (the 2026 weapon; build in weeks 2-4)

**STATUS 2026-07-18: v1 SHIPPED.** Edition #1 "State of ITIN Lending 2026" live at
`/articles/state-of-itin-lending-2026` (EN+ES, flagship, Research Desk byline) with
downloadable raw data at `/data/state-of-itin-lending-2026.json`. Pull script:
`web/scripts/hmda-pull.mjs` (quarterly re-run). 32-journalist pitch list ready for
Bob's review at `.seo/link-engine/press-pitch-list-state-of-itin-2026.md`; the
auto-pitch Gmail-queue step is NOT built yet. Next edition: Oct 2026 (HMDA 2025
file + Treasury NPRM coverage). Details in CHANGELOG 2026-07-18.
Original research is the #1 link magnet and AI-citation magnet of 2026, and
this niche has UNTAPPED public data:
- **HMDA** (mortgage disclosure data): ITIN-proxy lending patterns by state/year.
- **IRS SOI**: ITIN issuance/filing statistics.
- **Census/ACS**: unbanked/underbanked + foreign-born household finance.
Quarterly auto-built report ("State of ITIN Lending, Q3 2026") on itinlending.net:
script pulls data → tables/charts → humanized narrative → dated, citable URL.
Then the **auto-pitch**: journalist/blogger list (personal-finance, immigration,
fintech beats) + per-story angles → drafted pitches into Gmail queue → approve →
send. One good data story = more authority than a year of directory links, and
it feeds AI-Overview citations directly.

### System 5 — Mention & community cadence (semi-auto, ongoing)
Reddit is off (user gets booted); Quora + niche forums (myFICO etc.) are proven
(6 answers live, no friction). Automation: weekly batch — Serper finds fresh
unanswered ITIN questions → Claude drafts (humanize pass, ~30% link rule) →
approval digest → Claude-in-Chrome posts 2-3/week MAX (cadence is the ban-risk
variable, so the throttle is hard-coded). Mentions feed the LLM-citation loop
that the May 2026 policy makes dangerous to fake but rewarding to earn.

### Monitoring loop (automate week 1)
- Weekly: GSC Links API + Bing WMT backlinks pulled into seo-pulse (`links.py`),
  diffed — new/lost links land in the daily iMessage digest.
- Monthly: link-profile review (esp. if the gray budget is used) + rankings diff.
- KPI: external linking DOMAINS per site (now: 1 / ~0 / ~0). Target: 30+ real
  domains on lending in 90 days; first DR60+ editorial link within 60 days.

## Sequencing

| Week | Ship |
|---|---|
| 1 | Citations blitz begins; syndication pipeline live; expert-source signups; links.py monitoring |
| 2 | Responder digest live; listicle/resource-page outreach engine (Serper→draft→Gmail queue); send the 35 parked outreach drafts |
| 3-4 | Data Engine v1 (HMDA state report) + journalist pitch list |
| ongoing | 2-3 community answers/wk; weekly syndication; monthly review; optional vetted gray budget |

_Everything runs on existing rails: GitHub Actions crons, Resend/Gmail send-as,
iMessage approval digests (launchd), Claude-in-Chrome for form/publish steps,
seo-pulse for measurement. No new paid tools required to start; optional later:
Serper credits (have), Featured.com paid tier, link-vetting data source._
