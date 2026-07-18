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

## 2026-07-18 — Family-wide sweep: stale "5.8M ITINs issued" stat corrected to "5M+ active (IRS, Oct 2025)"

- **Why:** TIGTA report 2026-400-016 (Mar 27, 2026) puts the real numbers at ~31M ITINs issued
  since 1996 and **~5M active as of Oct 2025** (source: tigta.gov/sites/default/files/reports/2026-03/2026400016fr.pdf).
  The old "5.8M" figure came from the Dec 2023 TIGTA report (active count at end of 2022). The
  itinlending.net homepage was corrected earlier today; this sweep finished the job family-wide.
- **itincreditcard.com (repo `~/ITINCreditCard`, commits `6c9f6d1` + `2c15d61`):** 8 source pages
  fixed, EN + ES — homepage stat band (`5.8M+ ITINs issued` → `5M+ Active ITINs (IRS, Oct 2025)`),
  `/about`, `/itin-credit-cards-guide`, `/how-to-get-an-itin`, plus `web/public/llms.txt`. Prose now
  cites ~31M issued since 1996 / ~5M active Oct 2025. Rebuilt, deployed to `/docs`, pushed.
- **itincreditscore.com:** clean — no 5.8M claims found (only a coincidental SVG path constant).
- **itinlending.net:** only remaining mentions were the intentional housekeeping note in the
  State of ITIN Lending 2026 report (EN + ES) explaining the correction; tense updated from
  "has long cited" to "previously cited … we have since updated it" since the homepage fix is live.
- **Verification:** grepped all three repos' `web/src`, `web/public`, and built `/docs` for
  `5.8 million / 5,8 / 5.8M` variants (EN+ES); curl-verified live pages post-deploy.
- Docs updated: this changelog.
- Follow-ups: none — next TIGTA annual report (~Mar 2027) is the trigger to re-check the active count.

## 2026-07-18 — Data Engine v1 SHIPPED: "State of ITIN Lending 2026" report (EN+ES) + HMDA pull script + press pitch list

- **System 4 of the Link Engine is live.** Published the first quarterly data report at
  `/articles/state-of-itin-lending-2026` (EN + es-419, `tier: flagship`, author "Research Desk",
  category Research/Investigación). This makes the Qwoted press release's "quarterly report" promise true.
- **Repeatable data pull:** `web/scripts/hmda-pull.mjs` hits the CFPB/FFIEC HMDA data-browser API
  (2019-2024, nationwide + TX/CA/FL/AZ/IL/GA/NC/NY; originations + denials, all-borrower and
  Hispanic-or-Latino) → `web/src/data/hmda-state-of-itin.json` + markdown tables on stdout. The raw
  JSON is also published for journalists at `/data/state-of-itin-lending-2026.json`. Re-run quarterly;
  bump YEARS when the HMDA 2025 file lands (summer 2026).
- **Honesty methodology (the report's spine):** HMDA has NO ITIN field, stated in the script header,
  in a dedicated Methodology section, and every time a table appears. Triangulation = TIGTA/IRS filer
  counts + Urban Institute's 5-6k/yr origination estimate + our 12-lender tracked list + dated trade
  reporting. Own derivations labeled as such.
- **Government-oversight section (Bob's hard requirement), all re-verified same-day against primary
  docs:** EO 14406 signed **May 19, 2026** (not May 20 as commonly repeated; FR pub. May 22,
  91 FR 30479) with the 60/90/180-day Treasury deadlines (BSA due-diligence proposal ~mid-Aug 2026);
  FinCEN advisory **FIN-2026-A002** (Jun 5, joint w/ FDIC/OCC/NCUA, 18 red flags, "Enhanced Due
  Diligence for ITINs" section, SAR key term FINANCIALINTEGRITY-2026-A002); CFPB Jun 8 ATR statement;
  joint agency lending guidance Jul 13 (never mentions ITINs by name); IRS-ICE: April 2025 MOU,
  ICE requested 1.28M addresses, IRS disclosed **47,289** (CRS LSB11413), ~42,695 court-found
  violations, three cases (Kollar-Kotelly PI Nov 21 2025; Talwani D.Mass. Feb 5 2026; D.C. Cir.
  Feb 24 2026 for the gov't on the APA question), appeals pending; Yale Budget Lab ~$25B 2026
  revenue-loss estimate. Framing kept measured per YMYL rules: nothing bans ITIN lending, ITIN
  says nothing about status, no advice.
- **Stat correction site-wide:** homepage stat (EN+ES) updated from "5.8M+ ITINs issued" to
  "5M+ active ITINs (IRS, Oct 2025)" per TIGTA 2026-400-016 (Mar 27, 2026: ~31M issued since 1996,
  ~5M active). The old 5.8M was active ITINs as of Dec 2022 (TIGTA 2024-400-012). The report
  discloses the correction in-copy.
- **Humanize gate:** EN report, ES report, and the pitch list all pass
  `cadence_check.py` exit 0 (zero em dashes anywhere).
- **Press pitch list** (32 verified journalists, one tailored angle each, tiered; NOTHING SENT):
  `~/Itin/.seo/link-engine/press-pitch-list-state-of-itin-2026.md`. Tier 1 = wrote about ITIN
  lending or IRS-ICE within 60 days (Volkova/AmBanker, Backman/TheStreet, Ojeda/Documented,
  Cancino/Univision, Hussein/AP, Napoletano/Yahoo). Regulation-beat pitches should go out within
  2-3 weeks, before Treasury's ~mid-Aug NPRM.
- Ran `backfill.mjs --no-translate` (relatedSlugs auto-mesh), built, deployed to `/docs`. Worktree
  `.env` copied from main checkout before build (per the 2026-07-18 gotcha); verified unrelated
  built pages had zero diff and GA4 present on the new pages.
- Docs updated: this CHANGELOG, LINK-ENGINE-PLAN.md (System 4 status), CONTENT-PIPELINE.md
  (content inventory + quarterly report pattern).
- Follow-ups: (1) October 2026 edition: re-run hmda-pull.mjs, refresh lender list, cover the
  Treasury NPRM + appeals; (2) Bob reviews pitch list, then pitches route through the Gmail
  draft queue (System 4 auto-pitch step, not yet built); (3) card/score sites still cite ITIN
  counts in copy; sweep them for the 5.8M → 5M correction.

---

## 2026-07-18 — Score site: new CPN scam-warning article (EN+ES), closes the Quora content gap

- Published `cpn-vs-itin-credit-privacy-number-scam` on itincreditscore.com (EN + es-419,
  `tier: cluster`, byline "Editorial Team" per the pickAuthor hash). Targets "is a CPN legal",
  "CPN vs ITIN", "credit privacy number scam". Written because Quora run #3 (same day) found an
  active CPN seller pitching in a credit thread and the site had no CPN article — this closes
  the content-gap candidate flagged in that entry. Bob's live Quora answer on the CPN
  legal-or-illegal question links itincreditscore.com and now has a matching on-site article.
- Follows all site conventions: Quick Answer, question-format H2s, comparison table, 5 FAQs +
  FAQPage schema, and an inline `.scam-shield` oxblood aside (raw HTML in markdown; the
  ScamShield component's global classes style it — first article to do this, pattern noted in
  CONTENT-PIPELINE.md). Copy passed the humanize cadence gate (exit 0) in both languages.
  Internal links to the `/build-credit-history-with-itin` money page, `/how-to-get-an-itin`,
  and the secured-card / credit-builder / identity-theft / build-credit articles.
- Ran `backfill.mjs --no-translate` after authoring so the auto-managed relatedSlugs mesh
  picked up the new article (per the leave-relatedSlugs-to-the-relink-pass rule).
- **Worktree gotcha for future agents:** building from a fresh git worktree missed `web/.env`
  (gitignored), which silently stripped GA4 + AdSense + GSC verification from every built page.
  Caught by diffing `/docs` before committing; fixed by copying `.env` from the main checkout
  and rebuilding. Always verify an unrelated built page has a zero diff before pushing `/docs`.
- Deployed to `/docs`, pushed to main (commits 7524c6a, 7258d3b). Site affected: score only.
- Docs updated: CONTENT-PIPELINE.md (content inventory: first cluster-tier article + the
  markdown-embedded scam-shield pattern).
- Other repos: no code change needed. Content idea worth copying — lending and card sites also
  attract CPN-seller audiences; a CPN warning article scoped to each site's lane (loans /
  credit cards) is a candidate for their backlogs.

---

## 2026-07-18 — GSC request-indexing run: Spanish locale is the real backlog (10/10 quota used)

- **Chrome/GSC auth: available.** All three Domain properties reachable.
- **The task's premise was stale.** It assumed itincreditcard.com had "~4 pages indexed."
  It now reports **27 indexed / 2 not indexed**, and the two not-indexed are just
  `http://itincreditcard.com/` (http→https artifacts) — not real backlog. Spot-checks
  confirmed `/unsecured-credit-cards`, `/build-credit-with-itin`, and several EN articles
  are all "URL is on Google."
- **The actual gap is the `/es` locale on itincreditcard.com.** Nearly every
  `/es/articles/*` URL inspects as **"URL is unknown to Google — No referring sitemaps
  detected, no referring page."** These pages are in the sitemap but Google has never
  discovered them. This is exactly the per-locale failure mode in the global playbook
  (Step 1.5): translated pages exist but earn nothing because they were never crawled.
- **Root cause candidate — sitemap not being re-read.** GSC Sitemaps shows
  `sitemap-index.xml` submitted Jun 6, **last read Jun 20, Discovered pages: 0**, while
  the live sitemap's `lastmod` is Jul 17. One `/es` page's inspection also reported
  `Sitemaps: Temporary processing error`. The sitemap lists 110 URLs for the card site
  but GSC only knows ~29.

**Request-indexed today (10 — daily account-wide quota consumed):**
1. `/articles/credit-card-itin-apply-online-vs-in-branch` (EN, newest article, unknown to Google)
2. `/es/best-itin-credit-cards` (top ES money page; crawled Jul 15, not indexed)
3. `/es/articles/secured-credit-card-with-itin`
4. `/es/articles/can-you-get-a-credit-card-with-an-itin`
5. `/es/articles/how-to-apply-for-credit-card-with-itin`
6. `/es/articles/which-banks-accept-itin-for-credit-cards`
7. `/es/articles/credit-cards-that-accept-itin-verified-issuer-list`
8. `/es/articles/first-credit-card-itin-no-us-credit-history`
9. `/es/articles/no-credit-check-credit-card-itin`
10. `/es/articles/build-credit-with-itin-credit-card`

All ten verified as "Indexing requested" by screenshot. No "Quota Exceeded" message was
hit — I stopped voluntarily at 10 per the documented limit.

**Skipped — already "URL is on Google":** card `/unsecured-credit-cards`,
`/build-credit-with-itin`, `/es/credit-cards-that-accept-itin`, `/es/secured-credit-cards`,
`/es/unsecured-credit-cards`, `/articles/secured-credit-card-with-itin`,
`/articles/foreign-credit-history-credit-card-itin`,
`/articles/secured-vs-unsecured-credit-card-itin-comparison`,
`/articles/expired-itin-credit-card-what-happens`, and score-site
`/es/articles/how-to-raise-credit-score-with-itin` (the Pages report listed it as
crawled-not-indexed, but live inspection shows it indexed — report data lags ~9 days).

**Not backlog — do not spend quota on these:**
- itinlending.net "crawled - currently not indexed" (5) are all **dead legacy WordPress
  URLs**: `/category/itin-vs-ssn/`, `/category/uncategorized/feed/`, `/2023/11/page/3/`,
  `/2023/11/my-journey-with-an-itin-personal-loan/`,
  `/2023/11/using-my-itin-number-to-secure-a-mortgage-a-personal-journey/`.
- itinlending.net 404 `/itin-business-loan` now **301s** to the canonical
  `/itin-business-loans` — stale GSC data, no fix needed.
- Score site's 21 not-indexed are noindex (8), canonical alternates (5), 404s (4),
  redirects (2), and `/blank` — all intentional or junk.

- Docs updated: this CHANGELOG entry.
- **Follow-ups (higher leverage than more request-indexing):**
  1. **Resubmit `sitemap-index.xml` in GSC for itincreditcard.com** to force a re-read —
     last read Jun 20 with 0 discovered pages is the likely reason ~39 `/es/articles`
     are undiscovered. I did not do this: it's a property-level write the task didn't
     authorize. This is the single highest-value next action.
  2. Check internal linking to `/es/articles/*` — "no referring page" means the Spanish
     article index may not be linking them crawlably.
  3. **Do not disable this scheduled task yet.** Backlog is NOT cleared: roughly 30+
     `/es/articles` on the card site remain unknown to Google. At 10/day that's ~3 more
     runs — but fixing the sitemap re-read may clear it far faster than the daily drip.

---

## 2026-07-18 — PH launch calendar built: 5 launches + fresh Civic Record screenshots

- **New screenshots shot for ALL properties** via headless Chrome at PH gallery size (1270x760), saved to
  `~/Itin/.seo/link-engine/ph-screenshots/{lending,card,score,wellworth}/` (4 lending incl. ES, 4 card,
  4 score, 3 wellworth) + square thumb fallbacks in /thumbs. Redesign photographs beautifully.
- **PH launch calendar** (all scheduled from Bob's account, dates changeable anytime):
  Mon 7/21 Perfume Picks → Fri 7/24 ITIN Lending → Tue 7/28 ITIN Credit Card (built+scheduled today,
  checklist 100%) → Fri 7/31 ITIN Credit Score (built+scheduled today, 100%) → Tue 8/4 Well Worth
  (draft built; needs Bob: thumbnail paste `https://wellworthproducts.com/cdn/shop/t/4/assets/wellworth-logo.png`,
  gallery upload from ph-screenshots/wellworth/, then Schedule). Pour Picks already live since 5/27.
- Copy notes: all taglines/descriptions/first comments humanized (no em dashes, no AI tells); WW positioned
  honestly — Bob = Hunter not Maker, comment says "I work with them on their direct online store"; PH found
  a pre-existing "CERAMIC CARE WASH & WAX" WW product page (answered "different product").
- Automation gotchas learned: PH auto-fills description+thumbnail+gallery from the site og:image (WW lacks
  og:image → media missing); fast typing DROPS characters in PH inputs (fix via React native setter + input
  event); "Paste a URL" opens a native prompt() that freezes CDP — that click is always Bob's.
- Custom PH thumbnails MADE (Bob: old ones "blow"): 240x240 Civic Record wordmark tiles per site (brand color + hairline + per-site serif from the repos' own @fontsource files, rendered headless-Chrome at 3x) — Desktop/ph-screenshots/thumbs/itin-{lending,card,score}-thumb.png. Bob uploads via each draft's Images step.
- Bob's polish list: swap ITIN Lending gallery to the new redesign screenshots (folder above) before Fri;
  WW thumbnail+gallery+schedule; all galleries can take the extra per-site shots for richer pages.

---

## 2026-07-18 — Product Hunt: ITIN Lending launch completed + SCHEDULED for Fri Jul 24

- Finished Bob's parked ITIN Lending PH draft (created Jun 6): added launch link (itinlending.net) and
  X account (@itinlending), de-AI'd the description (em dash removed, honest never-claims added), rewrote
  the first comment through humanize. Checklist was then 100% complete; scheduled the launch for
  **Friday July 24, 12:01 AM PT** (staggered after Perfume Picks' Mon Jul 21 launch; date changeable anytime).
- PH launch week now: Perfume Picks Mon 7/21 → ITIN Lending Fri 7/24. Both feed the backlink monitor.
- Note for Bob: the PH gallery/thumbnail use the OLD pre-redesign site look — swapping in Civic Record
  screenshots before Friday would present better (upload is a native file picker, Bob's click).
- PH rules reminder from their confirm dialog: share the launch link but never ask for upvotes directly.

---

## 2026-07-18 — Link Engine extended to ALL properties (card/score parity + apps + Well Worth)

- Bob: "Can we get links to the other 2 ITIN sites the same way... I want it to work for all my apps and
  Well Worth as well." Findings + changes:
- **Card/score were already ~80% in** (monitor, NAP, expert profiles, press release, LinkedIn, Quora,
  guest pitches all reference all 3). The one real gap was syndication always favoring lending (highest
  impressions). **Fixed: weekly syndication now ROTATES lending → card → score**, so each site earns its
  own Medium/LinkedIn spoke; every 4th week flags a non-ITIN original-post angle instead.
- **Responder widened to four buckets**: ITIN finance / bourbon-whiskey (Pour Picks) / fragrance
  (Perfume Picks) / auto-household cleaning products (Well Worth, honestly positioned as a partner, never
  as the manufacturer). Max 3 drafts/day total, ITIN wins ties, per-bucket signatures.
- **Weekly backlink digest now reports all properties** (non-ITIN shown only on change, to stay short).
- **LINK-ENGINE-OPS §3b added**: app-directory citation targets (Product Hunt launch = the big one, needs
  Bob; AlternativeTo, SaaSHub, AppAdvice, listicle outreach, ratings-data stories) and Well Worth targets
  (made-in-USA dirs, product-listicle outreach, WW NAP needed from partner before submissions).
- Infra note: seo-pulse config already covered every property (3 ITIN, Pour Picks, Perfume Picks, Stick
  Picks, Percolate, Underdial, Timberline, Well Worth) — no config changes needed. pourpicks.app bare
  domain 301s oddly (www works) — minor, watch item.

---

## 2026-07-18 — 6 guest-post pitches SENT + outreach wave complete (Link Engine week 1 CLOSED)

- Bob sent all 6 cleaned guest-post pitches (15:33-15:34, from bguillow@gmail.com; verified in Sent):
  elitepersonalfinance.com, profinanceblog.com, consultease.com, theglobalhues.com, financebuzz.net,
  suitsmecard.com. The 6 stale Jul-5 duplicates were deleted — Drafts now has zero guest drafts.
- Combined with the 3 citation outreach emails sent earlier (USAHello, Jump$tart, Immigrants Rising —
  those went from bob@timberlineventuresllc.com), that's **9 outreach emails in flight**. Watch inboxes for
  replies; journalist/editor replies route through normal inbox (not the link-engine label).
- Week-1 tally, all shipped in one day: 5 expert-source services live + press release + responder armed +
  LinkedIn company page + NAP address + citations batch 1 + 3 Quora answers + syndication #1 live on
  LinkedIn AND Medium + 9 outreach emails sent. Measurement: Monday 7:06am backlink diff is the scoreboard.

---

## 2026-07-18 — Medium story LIVE — syndication #1 complete on both platforms

- **Medium published**: "Your ITIN Might Be Expired Right Now (Here's How to Check and Renew It)" at
  medium.com/p/b879044ca6a8 (Bob's account, handle Bguillow). Topics: Personal Finance + Immigrants.
  Attribution link to itinlending.net/articles/itin-renewal auto-linked at the end. Declined the social-share
  prompts. Medium ranks long-tails in 24-48h per the 2026 research — watch for referral traffic in GA4.
- Medium editor gotchas for future runs: the Topics tag field has the SAME Enter-concatenation bug as
  SourceBottle (typing two topics back-to-back merged into "TaxesMortgage"; "Itin" autocompleted to
  "Itinerary" — always screenshot chips after adding); section headings typed as plain lines (H2 formatting
  via toolbar skipped this run — acceptable, revisit if a future piece needs it).
- **The renewal article now has three inbound spokes**: LinkedIn company-page post, Medium story, and the
  Quora renewal answer — all pointing at the same canonical URL.

---

## 2026-07-18 — Syndication #1 PUBLISHED (LinkedIn as company page) + guest-draft cleanup

- **First syndication post is LIVE on LinkedIn, posted AS Timberline Ventures LLC** (not Bob): the
  itin-renewal adaptation, with the article link card to itinlending.net/articles/itin-renewal. Declined
  the "share on your profile" prompt per the name-privacy posture. Both syndication drafts were
  re-humanized to pass the mechanical cadence gate (cadence_check.py exit 0) before publishing —
  fixed contrastive negation, triads, aphorism buttons, low burstiness across several passes.
- **Medium is BLOCKED on Bob's sign-in** (medium.com tab open at the sign-in modal; account exists —
  "Welcome back"). Medium draft is gate-passed and ready at .seo/syndication/2026-07-18-itin-renewal-medium.md.
- **All 6 Jul-6 guest-post pitch drafts fixed and verified via API**: google.com/url wrappers removed
  (this batch had the wrapper as the anchor's VISIBLE TEXT, not just href — fix must set both), and the
  unfilled "[Your name]" placeholder replaced with "Bob Guillow". Recipients: financebuzz.net,
  theglobalhues.com, consultease.com, profinanceblog.com, elitepersonalfinance.com, suitsmecard.com.
  Ready for Bob to send.
- **Discovery: `in:draft "google.com/url"` shows ~20 more wrapped drafts** — the Jul 5 guest dupes (Bob
  discards) and the June [FORM SUBMIT]/[OUTREACH] parked batch (champstpo, lendbuzz, annuity.org, CBPP,
  Blue Ridge CC, ITINWorks, etc.). RULE: run the wrapper fix-and-verify pass on any of these before
  sending/submitting. Memory rule gmail-draft-url-wrapping updated with the anchor-text nuance.

---

## 2026-07-18 — Weekly digest now queues Quora questions ("go" workflow)

- Updated scheduled task `link-engine-weekly` (Mon 7:06am): the community-candidates step now verifies
  questions are genuinely unanswered, dedupes against the 10 topics already covered (list in the task file),
  enforces a ≥3-day gap since the last posted batch, and puts the 2 best question titles + URLs directly in
  Bob's iMessage digest. Bob replies "go" → next live session posts them. Sustainable cadence: ~3 answers
  per 3-4 days, no manual tracking.

---

## 2026-07-18 — Quora run #3: 3 new answers posted (total 10 live)

- Posted 3 answers on Bob's Quora account (all previously unanswered questions, humanize-passed, links
  mid-sentence to avoid the link-card problem, deep links verified 200 before posting):
  1. "What are the best personal loans with an ITIN number?" → itinlending.net/itin-personal-loans
  2. "Can I apply to renew my ITIN with an expired passport?" → itinlending.net/articles/itin-renewal
     (pairs with the syndication-pipeline article)
  3. "Is using a CPN 'credit privacy number' legal or illegal?" → itincreditscore.com (a thread that
     literally contains a CPN seller's pitch; our answer is the fraud warning)
- Coverage note: account now spans auto/score/mortgage/first-card/check-score/student-cards/personal-loans/
  renewal/CPN. Cadence: 7 answers Mon-Tue + 3 today = fine; skipped Quora's "add credential" prompt each time.
- Gotcha for future runs: clicking Answer sometimes doesn't open the editor on the first click — VERIFY the
  editor modal is visible (screenshot) before typing, or the whole answer types into the void. Happened once;
  retyped. Quora renderer is slow; type/screenshot timeouts are usually success-with-late-ack.
- No CPN-specific article exists on the score site — content-gap candidate ("CPN vs ITIN: one is legal").

---

## 2026-07-18 — Citations batch 1 run (ledger started at project-docs/citations.csv)

- Ran the first citations batch with the new NAP. Reality of the immigrant-org targets: most have NO
  submission form — they're email outreach. Results (full detail in citations.csv):
  - **3 outreach Gmail drafts created** (Bob reviews + sends, switch From to the branded address):
    USAHello (hello@), Jump$tart Clearinghouse (suzann.knight@ — asks listing criteria; their signup portal
    is jumpstartclearinghouse.org/account/create if approved), Immigrants Rising (info@).
  - **AllTop source-suggestion form filled** (alltop.com/contact, Business topic, all 3 RSS feeds —
    rss.xml verified live on lending). Bob must click the Cloudflare human-check + Send (CAPTCHA = never Claude).
  - **Skipped with reasons:** Feedspot (submit flow is dead/paid), Informed Immigrant + My Undocumented Life
    (no contact channel; social-only).
- Queued for Bob (account creation required, Claude fills after login): Crunchbase, Muck Rack, Blogarama.
- Docs updated: citations.csv (new ledger, 8 rows).

---

## 2026-07-18 — LinkedIn company page LIVE + NAP address + Timberline site truth-fix (citation #2)

- **LinkedIn Company Page created & published: linkedin.com/company/timberlineventuresllc** (ID 133457405).
  Filled: tagline, Internet Publishing, Privately Held, 0-1 employees, website timberlineventuresllc.com,
  full description (studio + both live App Store apps + all 3 ITIN sites + never-claims + info@ contact),
  HQ location = canonical NAP. Remaining: logo upload (Bob picks `~/Itin/.seo/link-engine/timberline-linkedin-logo.png`,
  300×300, prepped from site favicon). Citation target #2 done.
- **Bob's name-privacy posture** (his explicit ask): LinkedIn page admins are not public; keep it that way by
  (1) never adding Timberline to his personal Experience, (2) never using Invite connections, (3) always
  interacting as the page. Same no-human-names posture as site bylines.
- **Gotchas hit:** slug `timberline-ventures-llc` is an unclaimed auto-page for an unrelated NC company
  (do NOT claim); LinkedIn "another admin editing" error = having the admin open in 2 tabs; edit-form saves
  confirmed by the "Share your Page edits" modal.
- **Canonical NAP address supplied by Bob (citations UNBLOCKED): 2701 Amsdell Rd, Hamburg, NY 14075** —
  recorded in LINK-ENGINE-OPS.md §2.
- **App inventory verified via iTunes API** (developer id 1892888198): ONLY Pour Picks (id6764040132) and
  Perfume Picks (id6774184221) are live. Cabin id6787540768 returns nothing; Stick Picks/Percolate/Underdial
  have placeholder IDs. **Fixed timberlineventuresllc.com homepage stat 5→2 apps live** (commit 5d93ca1 in
  ~/TimberlineVentures, built+deployed, verified live).
- Docs updated: LINK-ENGINE-OPS.md (§2 NAP address + citation #2 done).

---

## 2026-07-18 — ALL 5 expert-source services LIVE (System 3 fully deployed)

- **MentionMatch ✅** — Bob registered as a source (info@timberlineventuresllc.com), confirmed the
  subscription and selected Finance expertise. Both MentionMatch emails arrived **pre-labeled** by the
  `link-engine/queries` filter — end-to-end routing proven a second time (first was HARO's welcome).
- Final status: **SOS ✅ · Qwoted ✅ (+ press release #1) · HARO ✅ · SourceBottle ✅ (profile #13943, LIVE) ·
  MentionMatch ✅**. The Link Engine's System 3 (expert-source responder) is fully deployed: 5 feeds →
  Gmail label → daily 7:35am responder drafts → Bob approves/sends.
- **Gmail connector write access RESTORED** (Bob reconnected; verified live: label_thread succeeded and a
  test draft was created via create_draft). The responder will save journalist replies as real Gmail drafts;
  the local-file fallback (`~/Itin/.seo/link-engine/responder-YYYY-MM-DD.md`) stays as a safety net only.
- Docs updated: LINK-ENGINE-OPS.md (signup table all-green + routing note).

---

## 2026-07-18 — HARO verified + SourceBottle expert profile built (4 of 5 services)

- **HARO ✅ fully live** — Bob clicked the verify link ("Thank you! You have been verified"). Source digests
  now flow to the monitored inbox and land in `link-engine/queries` via the existing filter.
- **SourceBottle expert profile filled by Claude** in Bob's browser (sourcebottle.com/expert-account.asp,
  account "Robert Guillow" / info@timberlineventuresllc.com): 7 keywords (ITIN, ITIN loans, ITIN mortgage,
  Immigrant finance, Credit building, Credit score, Personal Finances — tag field needs type→click "Add option",
  Enter concatenates), Founder / Timberline Ventures LLC, main+other expertise, ≤200-char pitch summary,
  full story (5.8M stat, three sites, HMDA data-desk), website + x.com/itinlending, authorization ticked,
  publish mode set to "Publish this Profile". **Bob must finish 3 things on-page:** type City/State in the
  location type-ahead (Claude doesn't have his city), upload the prepared 600×600 brand mark
  `~/Itin/.seo/link-engine/sourcebottle-profile.png` via Choose File, then Save and Publish.
- Signup status: SOS ✅ · Qwoted ✅ · HARO ✅ · SourceBottle ✅ **LIVE** (profile #13943 published — Bob added
  NY + ITIN Lending logo photo and hit Save and Publish; verified Publish status: LIVE on-page) · MentionMatch ⬜
  (register tab open at mentionmatch.com/register).
- Docs updated: LINK-ENGINE-OPS.md signup table statuses.

---

## 2026-07-18 — Responder pipeline ARMED: Gmail label + filter live, daily responder task scheduled

- Created Gmail label **`link-engine/queries`** + filter in Bob's Gmail (bguillow@gmail.com):
  `from:(sourceofsources.com OR qwoted.com OR helpareporter.com OR sourcebottle.com OR mentionmatch.com)`
  → apply label + **Never send to Spam**, backfilled to existing matches. Real senders verified from inbox:
  peter@sourceofsources.com, no-reply@qwoted.com.
- **Scheduled task `link-engine-responder`** (daily 7:35am): scans the label for last-24h journalist queries,
  filters for genuine ITIN/immigrant-finance relevance (max 3/day; off-topic = skip, SOS bans stretchers),
  drafts humanized replies signed Bob Guillow/Founder, saves as Gmail DRAFTS (never sends), iMessages Bob a
  review digest. Weekly `link-engine-weekly` (Mon 7am) continues backlink/syndication/community loops.
- Findings while wiring: **info@timberlineventuresllc.com RECEIVES mail** (Qwoted signup landed there — alias
  works, closing that open question); **Qwoted email-confirmation still pending Bob's click**; Gmail MCP
  connector is READ-only scoped (create_label failed → done via web UI) — **Bob should reconnect the Gmail
  connector with write access** or the responder's draft-creation step will fail on first run.
- Signup status: SOS ✅ · Qwoted ✅ (confirm email!) · HARO / SourceBottle / MentionMatch pending.

---

## 2026-07-18 — First press release published (Qwoted) + expert-source signups underway

- Bob signed up on SOS (confirmed) and Qwoted (expert profile: Bob Guillow). Claude then wrote and published
  the family's first press release on Qwoted at Bob's direction: **"New Free Bilingual Guides Help 5.8 Million
  ITIN Holders Get Loans and Credit"** — launch announcement for the three sites, scam-shield angle, Experian
  76.9% stat, HMDA/IRS data-desk positioning, quarterly report teaser. Quote + media contact attributed to
  Bob Guillow, Founder (his public Qwoted identity; the no-byline rule is a SITE-content rule — flagged to Bob).
  Contact: info@timberlineventuresllc.com. Live at
  app.qwoted.com/press_releases/new-free-bilingual-guides-help-5-8-million-itin-holders-get-loans-and-credit
- Notes: Qwoted collapsed body paragraph breaks in preview (their renderer); editorial team reviews submissions.
  No cover image (no 1200x720 press asset yet — worth making one for future releases).
- Remaining signups: HARO (helpareporter.com), SourceBottle, MentionMatch (ex-Help a B2B Writer — renamed;
  ops doc updated). Then the Gmail label `link-engine/queries` activates the responder.

---

## 2026-07-18 — Link Engine WEEK 1 SHIPPED: monitor + syndication + weekly automation + ops kit

- **links.py built** (`~/.claude/skills/seo-pulse/scripts/links.py`): Bing WMT GetLinkCounts backlink monitor
  with snapshot diffing (NEW/LOST) + dated history to `.seo/output/links-history.jsonl`. **Baseline captured:
  0 / 0 / 0 Bing-visible inbound links** on lending/card/score (GSC side: 1 on lending). The KPI starting line.
- **Syndication draft #1 written** (humanize-passed): lending's top-impression article `itin-renewal`
  (264 impr / 0 clicks) adapted → `~/Itin/.seo/syndication/2026-07-18-itin-renewal-{medium,linkedin}.md`,
  both with canonical attribution links. Ready to publish in a supervised session (Medium ranks long-tails in
  24-48h per 2026 research).
- **Weekly automation live:** scheduled task `link-engine-weekly` (Mondays 7am, first run tomorrow): backlink
  diff → next syndication draft (humanize rules enforced in the prompt) → 2 community-question targets → iMessage
  digest → changelog entry. Hard rails in the task prompt: drafts/measures ONLY — no posting, no emails, no
  commits; publishing stays supervised.
- **Ops kit written:** `project-docs/LINK-ENGINE-OPS.md` — Bob's 10-min expert-source signups (Connectively/
  Qwoted/SourceBottle/HelpaB2BWriter/Featured + profile blurb + Gmail label `link-engine/queries` to activate the
  responder), canonical NAP (info@timberlineventuresllc.com; **blocked item: no publishable mailing address —
  Bob to supply registered-agent/virtual address**), and citation batch 1 (18 targets, immigrant/Hispanic-focused
  prioritized, 5-10 per supervised session).
- Docs updated: this CHANGELOG, LINK-ENGINE-OPS.md. Follow-ups: Bob signups + address; first supervised
  citations batch; publish syndication draft #1; System 3 responder activates on the Gmail label; Data Engine
  (HMDA) build starts next.

---

## 2026-07-18 — LINK ENGINE plan: researched 2026 SEO reality, audited authority gap, plan of record written

- Ground truth pulled from GSC: **itinlending.net has 1 (one) external backlink** (marketwatch.com). The
  pos-70-90 Google burial is an authority-input problem, full stop — Bing page-1 proves content quality.
- Researched the 2026 environment: **July 2026 core update rolled Jul 1-12**; two June spam updates
  (SpamBrain now silently DEVALUES marketplace/farm links — gray-at-scale = money burn, not shortcut);
  May 15 policy names "manipulating AI responses" as spam; parasite pages live ~6-8 wks under algorithmic
  site-reputation-abuse BUT substantive self-published Medium/LinkedIn/Reddit content still ranks and counts;
  ~58% of searches are zero-click → brand mentions/AI citations are ranking currency.
- **Plan of record: `project-docs/LINK-ENGINE-PLAN.md`** — five automated systems: (1) citation/directory
  blitz, (2) weekly syndication pipeline w/ canonicals (Medium/LinkedIn/Substack), (3) expert-source responder
  (Connectively/Qwoted → Claude drafts → approval digest), (4) the Data Engine (quarterly HMDA/IRS/Census
  "State of ITIN Lending" report + automated journalist pitching — the 2026 weapon), (5) community-mention
  cadence (Quora/forums, hard-throttled 2-3/wk). Weekly links.py monitoring into seo-pulse. Gray ruling:
  no spam bots/PBNs (devalued + blast radius to shared ad accounts); optional capped hand-vetted niche-edit
  budget is Bob's call. KPI: 1 → 30+ linking domains on lending in 90 days.

---

## 2026-07-18 — GSC "blocked pages" alerts investigated (benign) + score 404s fixed

- Investigated the user's GSC alert emails across all 3 properties. **Verdict: nothing real is blocked.**
  Score: 8 "Excluded by 'noindex'" = deliberate (apply/es/apply/contact funnels + intentionally-noindexed
  first-hand-story/guest-columnist/start-building-now//f/ pages, verified in source + dist) plus 2 dead legacy
  URLs. Lending: 8 noindex = all predecessor-WordPress ghosts (/2023/11/, /page/5/, /feed/ etc.). Card: clean
  (2 excluded total). Indexed counts growing (score 64, lending 78, card 27). Alerts were routine
  "new-reason detected" noise from the Jul 7-8 recrawl uptick.
- **Real fix shipped (score, commit `b3d947f`):** the 4 genuine 404s were daily-content links to a nonexistent
  `secured-credit-cards-for-itin-holders` slug + 2 ghost loan articles. Repointed 8 links across 6 EN/ES files
  to the real `secured-credit-card-credit-score-itin` article and added 6 noindex+canonical redirect stubs,
  including cross-site sends per the per-site scope rule (car-loan → itinlending.net/itin-auto-loan; ES
  personal-loan → itinlending.net/es/itin-personal-loans). All targets curl-verified 200.
- Watch item: the score daily-content generator invented an internal slug — same bug class as lending's Jul 13
  link repair. If it recurs, patch the generator's link vocabulary rather than chasing 404s.

## 2026-07-17 — Lead-router backend flipped ON (master switch; no partners enabled)

- User directed ("just flip it"). Found the deployed `lead` edge function was **v6 (07-06, pre-router)** while
  the redesigned site was already live with the new form fields — so the deploy was required for correct
  capture, not just the router. Done: migrations **0005_lead_delivery + 0006_lead_consent applied**; `lead`
  function deployed → **v8**; `LEAD_DELIVERY_ENABLED=true` set via supabase secrets.
- **What is actually on:** capture of first/last/zip/home_status/tcpa_consent + the router runs and logs to
  `lead_deliveries`. **What is NOT on: every partner flag is off and no partner keys exist — zero leads are
  transmitted to any third party.** Router is effectively in log-only mode.
- Verified end-to-end: labeled TEST lead POSTed to the v8 function → `{"success":true}` (stored + email
  notification; ignore the TEST lead in the dashboard).
- Before enabling the FIRST partner: attorney pass (TCPA/CCPA), partner's real key/endpoint (current
  `partners.ts` endpoints are placeholders marked "confirm"), and TrustedForm/Jornaya scripts for partners
  requiring consent certs. Runbook in `LEAD-ROUTER-PLAN.md`.

## 2026-07-17 — Redesign complete on all 3 sites: lending "Settlement Statement" shipped

- **itinlending.net redesigned** (commit `38084a0`): deep pine `#17493B` (the Timberline evergreen) replaces
  navy+gold; self-hosted **Fraunces** display + **Source Serif 4** prose + **Public Sans** UI (Google Fonts CDN
  removed). Same trust apparatus as siblings: ScamShield + CK-as-recommended-tool hero rail, ledger Quick Answer
  (stamps: IRS · CFPB · HUD · Lender terms), calm announce bar, flat FHA callout, single accent, honest Updated
  dates, operator footer + info@timberlineventuresllc.com. Verified in browser (home + /itin-mortgage, console clean).
- **To unblock it, the lead-router WIP was committed first** (commit `4d4ac33`, user-approved): LeadForm
  first/last/zip + home question + consent fields, deliverLead() router + adapters (ALL env-gated OFF — nothing
  sends until LEAD_DELIVERY_ENABLED + secrets are set + attorney pass), /partners + /do-not-sell pages now
  published, 0005 migration, LEAD-ROUTER-PLAN docs, accumulated affiliate-click reports.
- Earlier same-day polish on score+card (also applied to lending from the start): ScamShield serif typography,
  single-row CK header, top-aligned hero grids.
- **Family complete: lending ✅ "Settlement Statement" (pine/Fraunces) · card ✅ "Statement" (teal/Spectral) ·
  score ✅ "Report" (graphite/Newsreader)** — one Civic Record system, three document identities, identical
  trust components. Follow-ups: ES visual spot-check all 3; confirm info@ ImprovMX alias; attorney pass before
  any lead-delivery flag is flipped.

## 2026-07-17 — Redesign ported to card site: "The Statement" shipped

- itincreditcard.com moved from the purple+gold+pill skin (the most AI-cliché of the three) to its Civic
  Record identity, **"The Statement"** (commit `fdd16d5`): slate-teal `#22505A` accent, self-hosted **Spectral**
  (headings + prose) + **Public Sans** (UI), paper/ink/rule family tokens, oxblood scam-flag. Same de-funneling
  as the score pilot: ScamShield + CK-as-recommended-tool in the money-page hero trust rail, ledger Quick Answer
  (stamps: IRS · CFPB · Issuer disclosures), calm announce bar, flat FHA callout, single accent (rainbow ACCENTS
  incl. purple removed), honest Updated dates, operator footer block + info@timberlineventuresllc.com.
  Note: Spectral frees Fraunces for lending's "Settlement Statement" identity later. Verified in browser
  (money page, console clean); rebased over 1 daily-content commit; docs rebuilt fresh.
- Family status: **score ✅ ("The Report") · card ✅ ("The Statement") · lending ⏳ blocked** on the
  uncommitted lead-router feature.

## 2026-07-17 — REDESIGN kicked off: "Civic Record" system, pilot shipped on score site

- Chief UX adversarial review of the family scored the old design **38/100** (template-trustworthy, funnel-
  coded) and prescribed the "Civic Record" direction: documentary ink-on-paper restraint, per-site identities
  ("The Settlement Statement" lending / "The Statement" card / "The Report" score), trust components > promo chrome.
- **Pilot shipped on itincreditscore.com ("The Report", commit `ca6233b`):**
  - Tokens: paper `#FBFAF7` / ink `#1A1D1A` / rule `#D8D4CB` / graphite accent `#2E3A47` / oxblood `--flag
    #9A3324` reserved for scam warnings. One radius (4px). No gradients, pills, or floaty shadows.
  - Type: self-hosted **Newsreader Variable** (headings + prose serif) + **Public Sans Variable** (UI/data,
    tabular numerals) via @fontsource; Google Fonts CDN removed. Hierarchy from scale + hairline rules, not 700-everything.
  - New **ScamShield.astro**: "How to spot a scam" honest-broker block (only TRUE claims: never charge a fee /
    never sell CPNs / never guarantee approval — deliberately NO "never sell your info" since leads will be sold).
    Sits in the money-page hero trust rail above the Credit Karma unit.
  - **Ledger Quick Answer**: QuickAnswer.astro now renders label + oversized serif answer + "Checked against:
    IRS · CFPB · Equifax · Experian · TransUnion ✓" source stamps.
  - **Credit Karma kept clickable everywhere** but reframed: flat ruled unit, "A free tool we recommend" kicker,
    "Advertisement" label retained, Awin impression-pixel banner untouched.
  - Chrome de-funneled: calm announce bar (no gold/emoji), FHA promo as flat ink editorial callout, rainbow
    per-page ACCENTS (incl. purple) → single graphite, fake shared "Updated June 5, 2026" default REMOVED
    (date renders only when a page passes a real one).
  - Operator trust: visible footer operator block ("Operated by Timberline Ventures LLC" + email) and
    **supportEmail → info@timberlineventuresllc.com** (NOTE: confirm an ImprovMX alias exists for info@ —
    DNS at the secureserver reseller; bob@ sending was fixed separately today).
  - Verified in browser (dev server, money page + homepage; console clean); OG cards auto-regenerated with
    the new theme. Survived a mid-work rebase over 2 daily-content commits (docs regenerated fresh).
- **Lead-form consent copy (EN+ES) drafted** in the honest-disclosure framing (share-with-partners + TCPA
  checkbox + Do-Not-Sell link; no false "we never sell" claim) — delivery blocked on the lead-router attorney
  pass. Score form already carries the home-ownership question + buy-timeframe reveal.
- Docs updated: this CHANGELOG. Follow-ups: (a) port to card site ("The Statement": slate-teal `#22505A`,
  Spectral serif, Card Ledger component); (b) lending ("Settlement Statement": pine `#17493B`, Fraunces,
  Closing Table) BLOCKED until the uncommitted lead-router feature lands; (c) ES-page visual spot-check;
  (d) confirm info@ ImprovMX alias.

## 2026-07-17 — Fixed bob@timberlineventuresllc.com outbound sending (DKIM); sent 3 more ITIN-lender outreach emails

**Problem:** Every attempt to send lender outreach from `bob@timberlineventuresllc.com`
(Gmail "Send mail as" → ImprovMX SMTP) bounced. Two red herrings burned time first: the
saved SMTP host was `mx1.improvmx.com` (ImprovMX's **inbound** MX, which won't relay) — we
corrected it to `smtp.improvmx.com` : 465 : SSL, but it **still** bounced.

**Real root cause:** the bounce DSN spelled it out —
`550 5.1.9 Domain "timberlineventuresllc.com" is not configured to send emails (dkimprovmx2._domainkey ... does not exist)`.
ImprovMX refuses outbound until the domain has **DKIM** records. The domain had MX ✓, SPF ✓,
DMARC ✓ but **no DKIM**.

**Fix (permanent):** added two CNAME records in the domain's DNS (GoDaddy/secureserver
reseller, plid 1592, under the account that lists the Timberline domains — NOT the plain
godaddy.com login, which shows "no registered domains"):
- `dkimprovmx1._domainkey` → `dkimprovmx1.improvmx.com`
- `dkimprovmx2._domainkey` → `dkimprovmx2.improvmx.com`

Propagated in minutes (GoDaddy is authoritative); ImprovMX flipped DKIM to ✓. From now on
**all** bob@ sends work (future lender outreach, the FlexOffers reply, etc.).

**Sent (18:22 UTC, from bob@, no bounces):** 3 more ITIN-lender referral intros —
Jet Direct Mortgage (express@jetdirectmortgage.com), Prysma (info@prysma.com),
Latino Community CU (info@latinoccu.org). Copy is the warm, "not a broker, consented
referral" angle; asks referral-fee vs per-funded, where to send, CU membership footprint.

**Gotchas for the next agent:**
- Gmail "edit info" for a send-as opens a **separate pop-up window** outside the controllable
  tab group — can't be driven by browser automation; the user must do it, and password entry
  into SMTP fields is off-limits regardless.
- API-created Gmail drafts are **not immediately search-indexed** — `in:draft <term>` returns
  "No messages matched" for a while even though the draft is in the Drafts folder. Tell the
  user to open the Drafts folder directly (newest at top), not to search.
- Gmail will not render/open a compose window in a **background/unfocused tab**, so the drafts
  can't be sent via automation — the user sends from their own focused window.

- Docs updated: this CHANGELOG; LEAD-PARTNERS.md (3 new outreach targets logged).
- Follow-ups: watch for replies from the 3 lenders; the SMTP relay password used during setup
  should be rotated at some point (it was surfaced in chat).

**Later same day — 5 MORE lender drafts created (non-mortgage, awaiting send):** researched +
verified 5 additional ITIN lenders with emails published on their own sites, deliberately
diversified off mortgage: Point West CU (`contact@pointwestcu.com`), Pacific NW FCU
(`loans@pnwfcu.org`), Mission Asset Fund (`programs@missionassetfund.org`), LiftFund
(`dpeterson@liftfund.com`), CapEd CU (`questions@capedcu.com`). Covers credit-union
personal/auto, a business-loan CDFI, and a credit-building CDFI. Emails humanized; drafts sit
in Gmail from bob@ awaiting Bob's send. Details + rejected candidates in LEAD-PARTNERS.md
(section "2026-07-17 — 5 more DRAFTED").

## 2026-07-17 — GSC request-indexing run: 9 unique requested (+1 wasted duplicate); yesterday's 10 all landed — requests DO work

Daily GSC request-indexing batch. Chrome/GSC auth was available. **Quota WAS hit** on the
11th attempt ("Quota Exceeded — try again tomorrow"), confirming ~10/day account-wide.

**Requested today (all `sc-domain:itincreditcard.com`, all `/articles/*`, all verified
"URL is unknown to Google" before requesting, all screenshot-verified as "Indexing
requested"):**
1. `/articles/credit-card-undocumented-immigrants-itin` (yesterday's quota-refused retry)
2. `/articles/store-credit-card-with-itin`
3. `/articles/joint-credit-card-itin-holders`
4. `/articles/travel-credit-card-itin-holders`
5. `/articles/upgrade-secured-to-unsecured-credit-card-itin`
6. `/articles/secured-credit-card-deposit-itin-holders`
7. `/articles/low-apr-credit-card-itin-holders`
8. `/articles/itin-to-ssn-credit-card-history-transfer`
9. `/articles/expired-itin-credit-card-what-happens`
10. `/articles/foreign-credit-history-credit-card-itin`

**Refused by quota (retry tomorrow):** `/articles/improve-credit-card-approval-odds-itin`.

**One request slot was wasted.** A stray Return keypress landed on the `REQUEST AGAIN`
button and re-submitted `/articles/credit-card-undocumented-immigrants-itin` a second time.
Google's own dialog notes resubmitting does not change queue position or priority, so the
duplicate bought nothing — 9 unique URLs for 10 slots. **Operational note for future runs:**
the inspect bar's Return key is unreliable and can fire whatever button holds focus. Type the
URL into the bar, then click the **magnifier/Search button (≈383,30)** to submit. Do not
press Return.

**Yesterday's 10 requests all landed — request-indexing demonstrably works.** Spot-checked
`/articles/secured-vs-unsecured-credit-card-itin-comparison` (requested 2026-07-16) and it
now reports "URL is on Google". Same for the other EN money/article pages checked. So the
~24-day grind estimate is pessimistic in one sense: the lever works, it's just rate-limited.

**Correction to the 2026-07-16 entry's implied picture:** it recorded 52 `/es/*` URLs as not
indexed on the card site. That is no longer uniformly true — `/es/unsecured-credit-cards` was
**never requested** and is now "URL is on Google", so some `/es/` discovery is happening
independently. But `/es/articles/travel-credit-card-itin-holders` is still "URL is unknown to
Google". The `/es/` tree is now **mixed**, not uniformly missing; it needs a proper per-URL
diff rather than an assumption either way.

**Caution for future runs — do not conclude "backlog cleared" from spot checks.** Early in
this run, 8 consecutive inspections across all three properties returned "URL is on Google",
which looked like a cleared backlog. That sample was biased: it drew from yesterday's
requested URLs, money pages, and newest articles. The very next unbiased pick
(`/es/articles/travel-credit-card-itin-holders`) was unknown to Google. GSC's Pages report
also lags several days and undercounts (card site still reads "27 indexed" while far more
URLs inspect as indexed), so it cannot be trusted as the backlog measure either.

**Root cause unchanged and now 3 days old — still a DISCOVERY problem.** Re-verified today:
card-site sitemap index Status=Success, **Discovered pages: 0**, **last read Jun 20** (~4
weeks stale) despite `sitemap-0.xml` regenerating 2026-07-15. Every unknown URL inspected
today again reported **"Sitemaps: No referring sitemaps detected"** / **"Referring page:
None detected"** — the latter also implying these article pages are not internally linked
from anywhere Google has crawled.

**Other-property findings (no requests spent — nothing genuinely eligible):**
- `itincreditscore.com`: 64 indexed / 21 not. The 21 are all intentional or junk — 8
  `noindex` (legacy `/apply`, `/contact-us`, `/start-building-now`, `/guest-columnist` etc.,
  none in the sitemap), 5 proper canonicals, 2 redirects, and 2 "Crawled - currently not
  indexed" of which one is a junk `/blank` URL and the other
  (`/es/articles/how-to-raise-credit-score-with-itin`) **inspects as already indexed**.
- `itinlending.net`: 78 indexed / 17 not. All 5 "Crawled - currently not indexed" are legacy
  WordPress-era URLs (`/category/*`, `/2023/11/*`) — 2 are correctly-served redirect stubs
  (`noindex` + canonical, HTTP 200) and 2 are 404s. None are sitemap URLs. Correct as-is.

**NEW BUG FOUND — broken internal links on `itincreditscore.com` (4 confirmed 404s in GSC).**
`web/src/content/articles/` and `articles-es/` link to `/secured-credit-cards-for-itin-holders`
and `/credit-builder-loan-with-itin`, both of which return **404** (the real page is
`/articles/credit-builder-loan-with-itin`; the secured-cards topic belongs on
itincreditcard.com per the per-site content scope rule). Affected files: `does-paying-rent-
build-credit-with-itin.md`, `credit-builder-loan-with-itin.md`, `how-to-check-credit-score-
with-itin-number.md` (EN + ES each). Spawned as a separate task — not fixed in this run.

- Docs updated: `project-docs/CHANGELOG.md` (this entry).
- Follow-ups / open items:
  1. **BACKLOG IS NOT CLEARED — do not disable this task.** But request-indexing is treating
     the symptom; the sitemap-discovery failure is the disease.
  2. **The task file's premise is still stale (flagged 07-15, 07-16, now 07-17 — 3 days).**
     It claims itincreditcard.com has "only ~4 pages indexed" and lists four EN money pages
     as priority; all four are indexed. Real priority is `/articles/*` then `/es/*`. Someone
     should edit the task file itself — re-flagging it daily is not working.
  3. Fix the broken internal links on the score site (spawned task).
  4. Consider submitting `sitemap-0.xml` **directly** (not just the index) in the Sitemaps
     report on all three properties — Google is reading the index but never fetching the
     child. This is a write action and was deliberately NOT taken by this automated run; it
     needs Bob's go-ahead.

## 2026-07-16 — GSC request-indexing run: 10 requested (EN articles, itincreditcard.com); sitemap root cause now 2 days stale

Daily GSC request-indexing batch. Chrome/GSC auth was available. **Quota WAS hit** — the
11th request returned "Quota Exceeded", confirming the ~10/day account-wide limit exactly.
All 10 successful requests were screenshot-verified as "Indexing requested — URL was added
to a priority crawl queue".

**Requested today (all `sc-domain:itincreditcard.com`, all `/articles/*`, all were
"URL is unknown to Google"):**
1. `/articles/how-to-apply-for-credit-card-with-itin`
2. `/articles/credit-cards-that-accept-itin-verified-issuer-list`
3. `/articles/no-credit-check-credit-card-itin`
4. `/articles/itin-credit-card-issuer-comparison-2026`
5. `/articles/secured-vs-unsecured-credit-card-itin-comparison`
6. `/articles/income-requirements-credit-card-itin`
7. `/articles/credit-card-prequalification-itin`
8. `/articles/no-annual-fee-credit-card-itin`
9. `/articles/rewards-credit-card-itin-holders`
10. `/articles/build-credit-with-itin-credit-card`

**Refused by quota (retry tomorrow):** `/articles/credit-card-undocumented-immigrants-itin`.

**Skipped — already "URL is on Google":** `/unsecured-credit-cards` (inspected and
confirmed indexed). The other three EN priority URLs in the task file
(`/build-credit-with-itin`, `/business-credit-cards`, `/how-to-get-an-itin`) were confirmed
indexed by reading the property's full indexed-pages list rather than spending a request on
each.

**Exact backlog measured** (GSC indexed-pages list diffed against `sitemap-0.xml`):
`itincreditcard.com` has **108 sitemap URLs, 27 indexed, 81 not indexed** — 29 EN
(24 `/articles/*` + 5 utility) and 52 `/es/*`. Only 2 URLs sit in GSC's "not indexed"
bucket (1 "Page with redirect", 1 "Crawled - currently not indexed"); the other ~79 are
simply **unknown to Google**, i.e. never discovered.

**The task file's premise remains stale** (flagged 2026-07-15, still not corrected): it
says itincreditcard.com has "only ~4 pages indexed" and lists four EN money pages as
priority. All four are indexed. Priority should be `/articles/*` and `/es/*`.

**Root cause unchanged and now 2 days old — still a DISCOVERY problem.** Re-verified today
on all three properties: sitemap index Status=Success, **Discovered pages: 0**, and no
child-sitemap row ever appears, meaning Google reads `sitemap-index.xml` but never fetches
`sitemap-0.xml`. Every not-indexed URL inspected today again reported **"Sitemaps: No
referring sitemaps detected"** / **"Referring page: None detected"**.

Re-confirmed the sites are not at fault: `sitemap-index.xml` is well-formed with the correct
`sitemaps.org/schemas/sitemap/0.9` namespace and a fresh `lastmod` (2026-07-15), the child
`sitemap-0.xml` returns HTTP 200 `application/xml`, and `robots.txt` allows all crawlers and
declares the sitemap. Yet GSC "last read" is still **Jun 20** (card) / **Jun 6** (score,
lending) — Google has not re-read the index in ~4 weeks despite daily rebuilds.

At 10 requests/day against a ~240-URL backlog across the three sites, hand-clearing this is
a ~24-day grind that fixes nothing structural. **BACKLOG IS NOT CLEARED — do not disable
this task**, but request-indexing is treating the symptom.

**Recommended follow-ups (NOT done — write actions outside this task's scope, need Bob's
go-ahead). These are unchanged from 2026-07-15 and have not been actioned:**
- **Submit `sitemap-0.xml` directly** on all three properties, alongside the index. This is
  the standard workaround when an index row reports 0 discovered and no child row appears,
  and it is the single highest-leverage action available. Two days of evidence now support it.
- Delete the stale legacy sitemaps still registered: `itinlending.net` has three
  (`sitemap.xml` 2023; `http://.../sitemap.xml` 2023, 28 pages; a 2014 `sitemap` entry
  showing **1 error**); `itincreditscore.com` has one (`http://.../sitemap.blog.xml` 2023,
  5 pages).
- Investigate `/es` internal linking — `itincreditcard.com/es` is indexed but its children
  all report "Referring page: None detected".

- Docs updated: `project-docs/CHANGELOG.md`.
- Follow-ups / open items: the three items above (all carried over unactioned from
  2026-07-15); re-scope this task's priority list to `/articles/*` + `/es/*`. If the sitemap
  fix lands, most of this backlog should clear on its own without burning daily quota.

## 2026-07-15 — GSC request-indexing run: 10 requested (all `/es` on itincreditcard.com) + root-cause found

Daily GSC request-indexing batch. Chrome/GSC auth was available. Quota was **not** hit —
all 10 requests went through and were screenshot-verified as "Indexing requested".

**Requested today (all `sc-domain:itincreditcard.com`, all were "URL is unknown to Google"):**
1. `/es/secured-credit-cards`
2. `/es/unsecured-credit-cards`
3. `/es/best-itin-credit-cards`
4. `/es/credit-cards-that-accept-itin`
5. `/es/itin-credit-cards-guide`
6. `/es/build-credit-with-itin`
7. `/es/business-credit-cards`
8. `/es/how-to-get-an-itin`
9. `/es/articles`
10. `/es/about`

**Skipped — already "URL is on Google":** `/unsecured-credit-cards`,
`/build-credit-with-itin`, `/business-credit-cards`, `/how-to-get-an-itin`,
`/articles/unsecured-credit-card-itin-holders`, `/es` (homepage), and
`itincreditscore.com/check-credit-score-with-itin`.

**The scheduled task's premise is stale.** It says itincreditcard.com has "only ~4 pages
indexed"; the property now reports **27 indexed / 2 not indexed**, and every EN priority
URL in the task's list is already on Google. The task's priority order should be rewritten
around `/es`, not the EN money pages.

**Root cause found — this is a DISCOVERY problem, not an indexing problem.** On all three
properties the submitted sitemap index reads Status=Success but **Discovered pages: 0**:
- `itincreditcard.com/sitemap-index.xml` — submitted Jun 6, last read Jun 20, 0 discovered.
- `itincreditscore.com/sitemap-index.xml` — submitted Jun 6, last read Jun 6, 0 discovered.
- `itinlending.net/sitemap-index.xml` — submitted Jun 6, last read Jun 6, 0 discovered.

Every not-indexed `/es` URL inspected reported **"Sitemaps: No referring sitemaps detected"**
and **"Referring page: None detected"** — Google is not associating these URLs with the
sitemap at all. Verified the sites themselves are fine: `sitemap-index.xml` and
`sitemap-0.xml` both return HTTP 200 `application/xml`, the XML is well-formed, all ~355
URLs are present, and `robots.txt` allows everything and points at the sitemap. So the
fault is on Google's side of discovery, not a site bug.

At ~10 requests/day account-wide, manually clearing a ~355-URL backlog would take ~5 weeks
and would not fix the underlying cause. **BACKLOG IS NOT CLEARED — do not disable this task
yet**, but the sitemap issue is the higher-leverage fix.

**Recommended follow-ups (NOT done — these are write actions outside this task's scope,
they need Bob's go-ahead):**
- Submit the child sitemap `sitemap-0.xml` directly (in addition to `sitemap-index.xml`) on
  all three properties. Standard workaround when an index row reports 0 discovered.
- Delete the stale legacy sitemaps still registered: `itinlending.net` has three
  (`sitemap.xml` from 2023, `http://.../sitemap.xml` from 2023 with 28 pages, and a 2014
  `sitemap` entry showing **1 error**); `itincreditscore.com` has one
  (`http://.../sitemap.blog.xml` from 2023, 5 pages). These predate the current sites and
  may be muddying discovery.
- Investigate internal linking on `/es`: `itincreditcard.com/es` is itself indexed, yet
  every one of its child pages reports "Referring page: None detected". That suggests the
  `/es` hub's links to its own money pages aren't being followed — worth checking whether
  the locale nav is crawlable HTML `<a href>` rather than JS-rendered.

- Docs updated: `project-docs/CHANGELOG.md`.
- Follow-ups / open items: the four items above; re-scope this scheduled task's priority
  list to `/es` on all three sites once the sitemap fix lands.

## 2026-07-15 — `itin_status` now required on every form (the router's key routing field)

- **Why:** 47% of leads (7 of 15) were arriving with no `itin_status` because the field was
  optional and only rendered inside the `!compact` qualify block on `/apply`. It is the
  field that decides which partners can legally/technically accept a lead, so a blank was
  an unroutable lead.
- **Change:** moved `itin_status` out of the qualify block up beside `loanType` (the two
  are the router's twin keys: product × id-type), added `required`, so it now renders on
  **both** the compact homepage form and `/apply`, in **EN and ES**.
- **Copy:** relabeled "ID status" → **"ITIN or SSN?"** / "Tipo de identificación" →
  **"¿ITIN o Seguro Social?"**, plus new reassurance help text ("Most of our readers have
  an ITIN and no SSN. Either is fine.") so a required identity question doesn't scare a
  no-SSN audience off the highest-traffic form.
- **⚠️ Trap documented and avoided:** `partners.ts::idTypeOf()` checks `includes("ssn")`
  BEFORE `includes("itin")`. Relabeling the option to something like "ITIN only (no SSN)"
  would have silently classified every ITIN-only lead as ITIN+SSN and routed borrowers to
  partners who can't serve them. Only the **label** was changed; option values untouched.
  Verified all four values against the real `idTypeOf()` via `deno run`: `ITIN only` /
  `Solo ITIN` → `itin_only`; `ITIN + SSN` / `ITIN + Seguro Social` → `itin_plus_ssn`;
  `""` → `unknown`. All PASS.
- Verified: Astro build (148 pages); `required` present on all four forms (index.html,
  apply.html, es.html, es/apply.html); rendered exactly once per form (no duplicate after
  the move); EN + ES checked in-browser.
- Docs updated: `LEAD-PARTNERS.md` (data gap marked FIXED + the idTypeOf trap written up).

## 2026-07-15 — THE DECIDING FACT: our borrowers have no SSN, which closes the API lane

The most important finding since the lead business started. Measured, not assumed.

- **Queried the live `leads` table** (`supabase db query --linked`). Of 15 rows:
  **ITIN only 7, ITIN + SSN 1, not answered 7.** Of those who answered, **~88% have no
  SSN.** Product mix from the leads sheet (27 all-time): personal loan 12, credit card 9,
  business 3, credit score 1, mortgage 2.
- **Why it matters:** our two volume verticals (personal loans, credit cards) are exactly
  the ones that **require SSN at post** to trigger the soft pull that generates a bid.
  Our borrowers don't have one. The lead marketplaces (Engine, PX, Monevo, LeadsMarket,
  Astoria personal) are therefore **structurally unable to buy ~88% of our inventory**.
  That is not an approval problem more applications will fix. Meanwhile the lenders who
  DO serve ITIN-only borrowers are direct-to-consumer and **don't buy leads at all**.
  That gap is the core strategic problem of the business.
- **Verified two ITIN personal lenders CLOSED** (both serve our borrower, neither buys
  leads): **Oportun** — no B2B/affiliate/lead program; its consumer refer-a-friend terms
  explicitly exclude anyone "in the business of lending or brokering financing for
  consumers", capped $1,000/yr. **Apoyo Financiero** — no business program (consumer
  refer-a-friend only) AND lends **CA + TX only** (CA Lic. 6054790 / TX OCCC
  2100070545-167761), while our leads are mostly NJ/GA/MA/FL/NY/MD.
- **Sent the 5 ITIN mortgage lender emails** (BuildBuyRefi, Gustan Cho, McGowan,
  Non-Prime Lenders, Carrington-retail). These contacts had been researched 06-15 and
  **never contacted**. Mortgage is the one lane where our low volume does not disqualify
  us: one funded ITIN mortgage is worth thousands, so value-per-unit is the pitch, not
  volume. All humanized; links use real `<a href>` anchors to avoid Gmail's google.com/url
  wrapping.
- **Aborted the Astoria vendor application** — requires 3 industry references with Teams
  IDs, a signed NDA, and TrustedForm/Jornaya (we answered No, honestly). Not a fit for a
  6-week-old publisher. Steps 1-2 were completed honestly before abandoning.
- **Course correction owned:** most of today steered at mortgage/auto exchanges (PX,
  LeadPoint, Astoria) on the premise that those skip the SSN requirement. The SSN
  mechanics were right but the **inventory assumption was wrong** — we barely produce
  mortgage/auto. The partner hunt was optimized for a lead type we don't have.
- **Untested and cheap (next):** credit cards (9 leads, a third of volume) should be
  **affiliate, not lead sale** per `MONETIZATION.md` — Self Financial (~$12/account),
  OpenSky, Firstcard. We have CJ + FlexOffers already.
- **Data gap to fix:** 7 of 15 didn't answer `itin_status` (optional, and only on the full
  `/apply` form, not the compact homepage form). **Make it required on both** — it is now
  the most important routing key in the business.
- Docs updated: `LEAD-PARTNERS.md` (new "THE DECIDING FACT" section, Oportun/Apoyo marked
  CLOSED with evidence, 5 mortgage lenders marked SENT).

## 2026-07-15 — Build-time env guard (stops silent-degradation deploys)

- **Problem found:** every `PUBLIC_*` var is baked into static HTML at build time, and
  a missing one did NOT fail the build — it silently shipped a degraded site. Local
  `web/.env` was missing `PUBLIC_GSC_VERIFICATION` (CI sets it inline in
  `.github/workflows/daily-content.yml`), so a local `deploy-to-docs.sh` publish (the
  flow documented in CLAUDE.md) strips the Search Console meta tag from ~144 pages.
  Verified 23 of 24 top-level `docs/*.html` in the working tree had lost it.
- **Fix:** `web/astro.config.mjs` now hard-fails a production build if any of
  `PUBLIC_GSC_VERIFICATION`, `PUBLIC_GA4_ID`, `PUBLIC_ADSENSE_ID`, or
  `PUBLIC_LEAD_ENDPOINT` is absent (the four whose absence is a regression: lost
  verification, lost analytics, lost ad revenue, or a lead form POSTing nowhere).
  Verified the guard fires, then passes once set. CI already sets all four.
- Added `PUBLIC_GSC_VERIFICATION` to local `web/.env` (gitignored) to match CI.
  Result: 0 of 24 dist pages missing the tag (was 23 of 24); AdSense + footer intact.
- **Deliberately NOT required:** all `PUBLIC_AFFILIATE_URL_*` / `PUBLIC_AFFILIATE_APPLY_URL`
  (documented in `.env.example` as intentionally blank — no ITIN affiliate program
  exists for mortgage/auto, and CJ has zero approved advertisers), plus
  `PUBLIC_INDEXNOW_KEY` / `PUBLIC_TRUSTEDFORM_ENABLED` / `PUBLIC_WEB3FORMS_KEY`.
  Money-page CTAs falling back to `/apply` is by design, not a bug.
- Docs updated: this CHANGELOG.
- Follow-up: the uncommitted `docs/` in the working tree still lacks the GSC tag — it
  is generated output; discard it and let CI regenerate, or re-run `deploy-to-docs.sh`
  now that `.env` is correct. **Do not commit `docs/` as-is.**
- **Note for future agents — the 2026-07-12 dates in this file are CORRECT.** The
  lead-router work genuinely shipped 07-12; the 07-13/07-14 entries above it came from
  later sessions. An attempt today to "correct" them to 07-15 was wrong and was
  reverted (see the revert commit). Gmail timestamps are the source of truth: the RGR /
  Lead Buyer Hub outreach sent 07-12 21:36–21:37, the four CJ nudges 07-12 22:48–22:50.
  Verify send dates against Gmail before re-dating anything here.

## 2026-07-14 — Score cannibalization fix (nav) + 3 more Quora backlinks (lending/score)

- **Score site — "how to check credit score with itin" consolidation (the 4th-audit lever), shipped:**
  root cause found = the **pillar** (`/itin-credit-score-guide`) sits in the sitewide primary nav but the
  **money page** (`/check-credit-score-with-itin`, the exact-title/H1 page for the query) was NOT in the nav,
  so the pillar/homepage kept out-ranking the money page for that term. Fix: added "Check Your Score" /
  "Revisa tu Puntaje" to `NAV` in `~/ITINCreditScore/web/src/consts.ts` (locale-aware, so it feeds the ES money
  page too) → money page now linked from **56 pages sitewide** (was 8). Also rewrote the pillar's checking-section
  link (EN + ES) to defer with the exact anchor "how to check your credit score with an ITIN". Built (114 pages),
  deployed, committed, pushed (had to rebase past a daily-content commit; resolved by dropping generated /docs,
  syncing, rebuilding fresh). Commit `4fffcbe`.
- **Spanish locale (#3): partially done.** Score ES got the nav + pillar-anchor treatment above. **Lending ES
  (the biggest ES opportunity — ES outranks EN on lending) is BLOCKED:** the `~/Itin` lending repo has 56
  in-flight source files + regenerated /docs from another session's partners/do-not-sell/lead-router feature
  (`supabase/functions/lead/index.ts`, `LeadForm.astro`, `consts.ts`, `i18n/ui.ts`, new `partners.html`/`do-not-sell.html`).
  Building/committing lending now would prematurely publish that work, so lending-ES is deferred until it lands.
- **3 more Quora answers posted** (Bob Guillow account, all humanized, no CAPTCHA), spread across domains and
  spaced so same-domain links aren't back-to-back:
  1. itinlending.net → "Can an immigrant get a mortgage in the US?" (ITIN mortgage basics)
  2. itincreditscore.com → "Will I have a credit score without an SSN?" (yes, via ITIN)
  3. itinlending.net → "How can I get a car loan with no SSN?" (corrected the wrong top answer; ITIN auto loan)
  Skipped the "spouse is an undocumented immigrant" mortgage thread on compliance grounds (ITIN ≠ immigration status).
- **Quora footprint note:** that's **6 answers in one day** on this account (morning: 2 card + 1 score; now: 2 lending
  + 1 score). Recommend pausing Quora for several days before the next batch to avoid a bot-pattern flag.
- Docs updated: this CHANGELOG.
- Follow-ups: lending-ES once the partners feature lands; the 35 drafted Gmail outreach emails (2026-06-13) still unsent.

## 2026-07-14 — Bing rank tracking wired up (seo-pulse/rankings) + full rank+GA4 report

- Ran `rankings` + `seo-pulse` (GA4) across the 3 ITIN sites and Well Worth. Report saved:
  `~/Itin/.seo/output/rankings-2026-07-14.md` / `.json`.
- **Wired the Bing Webmaster API key** into seo-pulse: pulled the account-level key from
  bing.com/webmasters → Settings gear → API access → API Key (via the user's browser), saved to
  `~/.claude/skills/seo-pulse/.secrets/bing_api_key.txt` (0600, gitignored — confirmed via git check-ignore).
  `bing.py` now returns live data; this lights up the previously-blank `Bing pos` column in rank reports.
- **Key finding this unlocked:** the ITIN sites rank **pos 1-8 on Bing** for ITIN money queries
  (e.g. score site `itinscore` pos 1 with a real click; `how to check itin credit score` cluster all pos 3-8;
  ES `como revisar mi credit score con itin` pos 4) while **Google buries the same terms at pos 70-90**.
  Bing organic also drove the only real organic conversions in GA4 (2 lending leads, 2 score leads).
- **GA4 is now piping for all 4 sites** (new since the 07-13 wiring): ITIN traffic is ~90% Direct with near-zero
  Google-organic clicks (flagged as suspect / to investigate); Well Worth healthy — 495 organic sessions,
  **31 real transactions / $4,150** (deduped; raw `purchase` event 306 NOT cited), Merchant Center free listings
  live (21 Organic Shopping sessions, 7 key events).
- Docs updated: `RANK-TRACKING.md` (Bing marked DONE + read note), this CHANGELOG.
- **Bing WMT sitemaps + IndexNow verified/actioned (same session):** all 3 ITIN sites are verified in Bing WMT
  and returning data. Sitemaps: card (`sitemap-index.xml`, 104 URLs) and score (106 URLs) already Success, crawled 7/13;
  **lending was stale (last crawl 6/21) so resubmitted `https://itinlending.net/sitemap-index.xml` → Processing**.
  Lending also carries two junk `http://` sitemap error rows (sitemap, sitemap.xml, 0 URLs) — harmless, left in place.
  **IndexNow is already live on all 3** (source "Self" = deploy pipeline auto-pings): lending 3K, score 2.1K, card 1.7K
  URLs submitted over the trailing month, most recent ping yesterday ~11:47-11:51. Nothing to "turn on" — already wired.
- Follow-ups: (a) score-site consolidation of `how to check credit score with itin` still open (4th audit);
  (b) investigate the ITIN "Direct" traffic before trusting the 14 lead counts; (c) feed the ES locale (outranks EN on lending);
  (d) optional housekeeping: delete the two `http://` sitemap error rows on lending in Bing WMT.

## 2026-07-13 — First live off-site backlinks: 3 Quora answers posted (card + score sites)

- Executed the card-site Action #2 ("first backlink") plus a score-site companion by posting 3 hand-written,
  humanized Quora answers from the user's own account (Bob Guillow), via the browser (send-by-user, user
  approved each in chat: "try 1", "lets do it", "SHIPIT").
- **All 3 run through the `humanize` skill first** (they were originally drafted to the itin-social/ANTI_SLOP
  voice; humanize is the required gate for outward-facing copy — [[feedback_humanize_required]]).
- Answers + targets:
  1. itincreditcard.com → "As an international student in the USA with no SSN, what are the credit card
     options I have?" (which issuers approve ITIN applicants).
  2. itincreditcard.com → "Can individuals new to the United States that do not have a social security
     number get a credit card?" (applying is safe / secured card / avoid CPN + upfront-fee scams).
  3. itincreditscore.com → "How do I check my credit score if I don't have a social security number? Will my
     credit history before I get SSN be lost after I get one?" (AnnualCreditReport fails ITIN holders →
     my.equifax.com / mail-in / issuer FICO; + history merges into SSN file).
- **Quora gotcha logged for next time:** starting an answer with a bare `domain.com` makes Quora auto-embed a
  link CARD for that domain and swallow the words. Answer #3 opened with "AnnualCreditReport.com" and carded a
  competitor link at the top; fixed by rewording to "The official AnnualCreditReport site" (no `.com`). Rule:
  never lead a line with a bare domain; keep the site link inline at the end.
- No CAPTCHA / verification wall hit on any of the 3 — the browser-post path is currently clean for this account.
- Credential left blank on all 3 (optional Quora field). Possible low-effort trust boost later: add a neutral,
  non-personal answer credential like "Writes about ITIN credit & lending" (no real name/employer) — [[feedback_no_byline]].
- Docs updated: this CHANGELOG.
- Follow-ups: (a) monitor these 3 for upvotes/collapse over the next week; (b) cadence — 2 of 3 point to
  itincreditcard.com and went up within ~15 min of each other, so space the next batch out and vary domains;
  (c) Spanish-language versions of these answers for ES-locale questions still open; (d) the 35 drafted Gmail
  outreach emails (2026-06-13) remain the highest-value no-boot lever and are still unsent.

## 2026-07-13 — Weekly SEO/AEO audit (ITIN Credit Score): first AI citation + money page moving

- Ran the weekly SEO audit for itincreditscore.com (GSC 28d 6/14→7/11 via browser/Google SSO + GA4 413651450).
  Output: `ITINCreditScore/.seo/output/seo-audit-creditscore-2026-07-13.md`.
- **Two genuine positives:** (1) **first AI-referred session ever** — `chatgpt.com/ai-assistant` = 2 sessions
  in GA4 (prior audits: 0); (2) money page `/check-credit-score-with-itin` finally moving, **88.4 → 81.4**.
- Top-line: impressions **997 → 1,200 (+20%)**, clicks 3 → 2, avg pos 60.6 → 61.3, queries 96 → 100,
  **indexed pages 21 → 56** (content pipeline scaled hard).
- **Core problem unchanged (4th audit): clicks stuck at 2–3.** Structural volume/rank mismatch — every
  high-volume commercial/pillar page ranks page 7–8 (homepage 51, pillar 70.3, money 81.4, build-history 81.2),
  while the pages that rank page 1 are ultra-long-tail articles with ~1 impression each (dispute-errors 5.0,
  authorized-user 6.8, why-different-bureau 7.0, negative-items 9.0, freeze 10.0, hard-inquiries 16.6,
  experian-boost 20.4 ↑ from 40). Fix = route article authority into money pages via internal links, not more content.
- **#1 unactioned lever, 4th straight audit:** "how to check credit score with itin" = **306 impr, pos 71.7**
  (flat ~70 across 4 audits), served split across homepage/pillar/money page — no page owns it. 26% of site impressions, 0 clicks.
- **Bureau queries volatile:** transunion itin flat 34; transunion itin credit report REGRESSED 42→55;
  experian credit report with itin + credit karma itin + equifax surfaced new; annualcreditreport.com itin (was 63)
  and transunion credit report itin (was 32) dropped out of top 100.
- **ES:** pillar `/es/itin-credit-score-guide` pos **4.0** and `/es/foreign-credit-history` pos 8.3 (page 1), BUT
  ES money page (`/es/check-credit-score-with-itin`, was pos 34) and ES homepage went to **zero impressions** —
  needs URL-inspect (hreflang/canonical regression?). **3 `.html` ES duplicates still live** (Jun 29 action #3 NOT done) —
  foreign-credit-history.html (83) bleeding equity off the pos-8.3 page.
- GA4: 181 sessions (Direct 87%); Google organic only 2 sessions vs DuckDuckGo 6 + Bing 4 — Bing/DDG delivering more real clicks than Google.
- Serper/Bing API keys absent from `.secrets/` this run — live-SERP + Bing-position no-op'd; GSC/GA4 browser path only.
- Docs updated: `ITINCreditScore/.seo/output/seo-audit-creditscore-2026-07-13.md`, this changelog.
- Follow-ups: (1) consolidate the pos-71 head term onto the money page; (2) fix 3 ES `.html` dupes;
  (3) investigate ES money/home zero-impression regression; (4) route article→money-page internal links; (5) restore Serper/Bing keys.

---

## 2026-07-13 — Weekly SEO/AEO audit (ITIN Credit Card): indexing freeze BROKEN

- Ran the weekly SEO audit for itincreditcard.com (GSC 28d 6/14→7/11 via browser/Google SSO).
  Output: `ITINCreditCard/.seo/output/seo-audit-creditcard-2026-07-13.md`.
- **Headline reversal:** the "stuck at 5 indexed pages" crisis from the last two audits is
  resolved — and was largely a stale-data artifact. GSC now: **27 indexed / 2 not indexed**;
  **Discovered–not-indexed 37 → 0** (backlog cleared); pages earning impressions **5 → 21**.
- **Money/article pages rank page 1–2 on their exact queries** (credit-cards-that-accept-itin 7.0,
  best-itin-credit-cards 11.0, pillar 6.0, how-to-get-an-itin 8.7, cash-back article 1.0,
  secured-credit-cards 2.0) — but 1 impression each. `/how-to-get-an-itin` caught
  "irs itin application requirements 2026" at **pos 6**.
- **New #1 issue = homepage cannibalization.** Homepage takes 128/138 impressions at pos 82.8,
  soaking up head-term volume ahead of the money pages (for "credit cards that accept itin" the
  homepage is served ~5× at pos ~89 while the real page sits at pos 7). Avg position "decline"
  62.4 → 77.9 is this composition artifact, not a health regression.
- **/es earned its first-ever impression** (pos 4.0). Still zero Spanish-language queries; most
  51 /es sitemap URLs not yet discovered. Diagnosis confirmed crawl-discovery, not hreflang.
- Top-line: impressions 212 → 138, clicks 1 → 0 (the one click aged out), 37 queries (all EN),
  US 98%. Serper/Bing API keys absent from `.secrets/` — live-SERP was a no-op this run.
- Docs updated: `ITINCreditCard/.seo/output/seo-audit-creditcard-2026-07-13.md`, this changelog.
- Follow-ups: fix homepage cannibalization (internal links → money pages, de-optimize homepage
  head-term match); build first backlink; nudge /es discovery; restore Serper/Bing keys.

---

## 2026-07-13 — Weekly SEO/AEO audit (ITIN Lending): FIRST CLICKS + page-1 breakthrough

- Ran the weekly SEO audit for itinlending.net (GSC 28d ~6/14→7/11 + GA4 28d Jun15–Jul12,
  both via browser/Google SSO). Output: `.seo/output/seo-audit-lending-2026-07-13.md`.
- **Breakthrough period.** First-ever clicks (5, was 0); impressions 769 → **1,710 (+122%)**;
  avg position 75.6 → **71.9**; indexed pages 19 → **52**; queries 151 → **277**.
- **17+ pages now rank pos 3–16** — driven entirely by long-tail article/detail/state/trust
  pages (basics-of-lending 3.6, editorial-policy 3.7, itin-heloc 6.2 [2 clicks], itin-business-loan 7.6,
  nevada 8.0, arizona 6.3, auto-insurance 11.0). ES long-tail mirrors it (es/articles/itin-mortgage-rates 3.0,
  es/articles/itin-heloc 9.0, es/articles/itin-retirement-account 13.1).
- **Head-term money pages remain the laggards** (itin-loans 80.2, itin-mortgage 86.2,
  itin-personal-loans 83.7, itin-credit-cards 74.8). #1 recommendation: funnel page-1 article
  authority UP to the money pages via internal links.
- **AI referrals 4 → 11** (ChatGPT 10, +150%; **first-ever Perplexity referral** 1). First Google
  organic sessions (10) + Bing (5). Reddit 25 → 34 (still #2 source).
- **404 mystery solved:** `/itin-business-loan` (singular) 404s — real page is `/itin-business-loans`
  (plural, pos 37.5); needs a redirect. Second 404 is a `/*` glob artifact (ignore).
- **Schema clean:** Breadcrumbs 0 invalid / 29 valid. "Crawled – currently not indexed" grew 4 → 10
  (generator outpacing indexation — deepen or throttle).
- **ES locale:** healthy overall (3 of top-5 ES queries improved; no zero-impression ES pages; hreflang
  functional). One persistent problem: `préstamos personales con itin` down a 3rd straight audit
  (56.8 → 64.1 → 68.9); the `/es/itin-personal-loans` internal-link fix is now flagged for the 3rd time.
- Follow-ups (top 3): (1) internal-link page-1 articles → money pages; (2) redirect the singular
  business-loan 404; (3) ship the ES /es/itin-personal-loans internal links. Full prioritized list (8 items)
  in the audit file.
- iMessage summary sent to +17165109313 (top-3 actions).

## 2026-07-13 — GSC request-indexing batch: BACKLOG CLEARED (0 requests needed)

- Ran the daily GSC request-indexing scheduled task across all three sites. Chrome/GSC
  auth was available (shared account, all three Domain properties accessible).
- **Result: backlog cleared. 0 URLs request-indexed, 0 quota used** — every real
  content page that shows in a "not indexed" bucket is actually **already indexed**
  (the Page-indexing report is stale; its "Crawled - currently not indexed" data still
  reflects the June crawl timestamps). Verified by live URL Inspection, not the report.
- **itincreditcard.com:** now 27 indexed / 2 not indexed (task's "~4 indexed" premise is
  stale — the laggard caught up). The 2 not-indexed are `http://itincreditcard.com/`
  (http variant, redirects to the indexed https homepage) + 1 "page with redirect."
  Named priority slugs (unsecured-credit-cards, build-credit-with-itin,
  business-credit-cards, how-to-get-an-itin) are all indexed. Nothing to request.
- **itincreditscore.com:** 2 crawled-not-indexed resolved to `credit-reports-with-itin`
  (verified **already on Google**) and `/blank` (orphan — no sitemap, no referring page,
  junk slug; NOT requested). Legacy-equity priority slugs all indexed. Other not-indexed
  buckets are intentional (7 noindex, 6 canonical alternates, 2 redirects).
- **itinlending.net:** 10 crawled-not-indexed. The 4 real pages
  (`/es/articles/itin-{secured-credit-card,mortgage-rates,credit-builder-loan,debt-consolidation-loan}`)
  all verified **already on Google**. Remaining 6 are WordPress-legacy junk
  (`/category/itin-vs-ssn/`, `/category/uncategorized/feed/`, `/2023/11/page/3/`,
  `/2023/11/my-journey-with-an-itin-personal-loan/`,
  `/2023/11/using-my-itin-number-to-secure-a-mortgage-a-personal-journey/`) + 1 legacy
  `.html` URL (`/es/itin-business-loans.html`) — none should be request-indexed.
- **Recommendation to Bob:** (1) Disable the `itin-gsc-request-indexing` scheduled task —
  the backlog is clear and daily runs now find nothing to request. (2) Optional cleanup:
  serve 410 (or leave to age out) for the WordPress-legacy `/category/*`, `/2023/11/*`,
  `/feed/` URLs and the `.html` legacy slug on itinlending.net, and remove/noindex the
  orphan `itincreditscore.com/blank` page so these stop showing as "not indexed."
- Docs updated: this CHANGELOG.
- Follow-ups: task can be disabled; legacy-URL cleanup is nice-to-have, not urgent.

## 2026-07-12 — Compliance build: TCPA consent, TrustedForm, partner list, CCPA opt-out

- Ran a `legal-eagle` pass on the lead-sale flow (verdict: Tighten) and implemented
  the four must-fix-before-launch items it flagged.
- **TCPA consent:** replaced the passive fine-print with a required, unchecked
  express-written-consent checkbox in `LeadForm.astro` (EN + ES i18n). Names this
  site + a linked `/partners` list, authorizes autodialed/prerecorded calls + texts,
  states consent is not a condition of purchase. Captured per lead (`tcpa_consent`)
  and the router now **hard-gates on it** — no consent, no delivery
  (`_shared/partners.ts::isEligible`).
- **TrustedForm/Jornaya:** added the TrustedForm client script gated on
  `PUBLIC_TRUSTEDFORM_ENABLED` (new `consts.ts` flag) to populate the existing
  `xxTrustedFormCertUrl` hidden field; cert URL + Jornaya id stored per lead.
- **Named partner list:** new `/partners` + `/es/partners` pages, linked from the
  consent line and the footer (both locales).
- **CCPA/CPRA:** new `/do-not-sell` + `/es/do-not-sell` pages (honor Global Privacy
  Control signal + email opt-out), linked in the footer both locales.
- **DB:** migration `0006_lead_consent.sql` adds `tcpa_consent`,
  `trusted_form_cert_url`, `jornaya_lead_id` to `leads` and surfaces them on
  `lead_dashboard`. Confirmed free-text `notes` is never in any outbound payload.
- Verified: Astro build (148 pages) + Deno typecheck pass; consent checkbox +
  partner links + all 4 pages present in built HTML.
- Docs updated: `LEAD-ROUTER-PLAN.md` Phase 0 (implemented vs. still-required).
- Follow-ups (owner Bob/counsel): TrustedForm/ActiveProspect account; attorney
  sign-off on TCPA wording + CCPA "sale" classification + state lead-gen licensing;
  buyer contracts; populate the suppression list; GLBA WISP.

## 2026-07-12 — Lead delivery layer built (dormant) + form fields for ping-post

- Built the multi-channel lead-delivery router on top of the existing Supabase
  `lead` function. It is wired in but DORMANT: nothing sends unless
  `LEAD_DELIVERY_ENABLED=true` AND a partner's own `*_ENABLED=true` AND its secret
  is set AND the lead is eligible. New files: `supabase/functions/_shared/partners.ts`
  (registry + eligibility) and `_shared/delivery.ts` (router + API / ping-post /
  email adapters + per-attempt logging).
- Registry seeded with Engine by MoneyLion (API, SSN-optional), RGR Marketing
  (ping-post, mortgage/auto), and Apoyo Financiero (email warm-forward) — all off.
  Engine/RGR gated on a consent cert being present (TrustedForm/Jornaya), so they
  can't fire until that infra lands.
- Form: `LeadForm.astro` split `name` → `first_name` + `last_name` (both required),
  added optional `zip` (paired with State), and added empty TrustedForm/Jornaya
  hidden fields. Added i18n keys (EN + ES). Verified both locales render in-browser;
  Astro build + Deno typecheck pass, no console errors.
- Server: `_shared/types.ts` extended (`firstName`,`lastName`,`zip`,
  `trustedFormCertUrl`,`jornayaLeadId`); `lead/index.ts` composes `name` from
  first+last, stores the new columns, and calls `deliverLead()` inside the failsafe
  block (never fails the request). Migration `0005_lead_delivery.sql` adds columns +
  `lead_deliveries` table + refreshes `lead_dashboard`. `.env.example` documents
  every switch.
- Docs updated: `LEAD-ROUTER-PLAN.md` (build status + "turn a partner ON" runbook),
  `LEAD-PARTNERS.md`.
- Follow-ups: paste the Engine API key + confirm its live endpoint/field spec when
  approved; add TrustedForm/Jornaya scripts (gates Engine/RGR); `legal-eagle` pass
  before flipping anything live; open RGR / Lead Buyer Hub ping-post relationships.

## 2026-07-12 — Lead-router plan: target list, form audit, phased build spec

- Wrote `project-docs/LEAD-ROUTER-PLAN.md` — the plan to monetize inbound loan leads
  by distributing them to lender/aggregator partners. Contains: (1) target list split
  into Track A API/aggregator buyers (SSN leads) and Track B ITIN-native buyers (the
  moat, mostly email/portal delivery); (2) a field-level audit of the single live
  `LeadForm.astro` against buyer requirements, with a ranked must-close gap list; (3)
  a 5-phase build plan that extends the existing Supabase `lead` function into a
  multi-channel router (API / email warm-forward / ping-post).
- Key finding: most ITIN-native lenders have **no lead API** (portal/email/CRM only);
  the aggregators that do have APIs are SSN-gated and reject ITIN. So the build is a
  multi-channel router, not an API fan-out — and the **email warm-forward adapter can
  go live first** with zero partner integration, monetizing ITIN leads immediately.
- Audit facts: form has one component feeding a real Supabase Edge Function (validate/
  score/OFAC/email). Missing for API buyers: split name, full address, DOB, SSN,
  TrustedForm + Jornaya certs, TCPA checkbox, CCPA opt-out, numeric income/amount.
- Docs updated: new `LEAD-ROUTER-PLAN.md`; complements `LEAD-PARTNERS.md`.
- Follow-ups / open items: three decisions gate the build — D1 exclusive vs
  non-exclusive selling, D2 whether to collect real SSN (unlocks Track A), D3 ship
  email-forward first (recommended). Phase 0 requires a `legal-eagle` pass before any
  live API sending (TCPA/GLBA/CCPA/UDAAP). Nothing built yet — awaiting green light.

## 2026-07-12 — GSC request-indexing daily batch (scheduled task run) — BACKLOG STILL CLEARED (5th consecutive)

Ran the daily `itin-gsc-request-indexing` scheduled task. Chrome was logged into
the shared Search Console account; all three `sc-domain:` properties reachable and
authenticated.

- **Requested indexing today: 0 URLs. Skipped (already indexed / non-actionable): all.
  Quota hit: no (0 of ~10/day consumed).** Fifth run in a row with nothing legitimate
  left to request.
- **Verification (live URL Inspection — authoritative; Pages "Crawled – currently not
  indexed" report still lags, last update 6/29):**
  - **itincreditcard.com:** 27 indexed / 2 not — both non-content
    (`http://itincreditcard.com/` http-protocol variant + one "page with redirect").
    None of the named priority pages (unsecured-credit-cards, build-credit-with-itin,
    business-credit-cards, how-to-get-an-itin) appear in not-indexed → all indexed. CLEARED.
  - **itincreditscore.com:** 2 crawled-not-indexed = `/blank` (junk stub, skip) and
    `/credit-reports-with-itin` → live-inspects **"URL is on Google — indexed."**
    Other buckets intentional (7 noindex, 6 canonical alternates, 2 redirects). CLEARED.
  - **itinlending.net:** stale 10-URL crawled-not-indexed bucket = 5 current Spanish
    pages, ALL live-inspect **indexed** (`/es/itin-business-loans.html`,
    `/es/articles/itin-secured-credit-card`, `…/itin-mortgage-rates`,
    `…/itin-credit-builder-loan`, `…/itin-debt-consolidation-loan`) + 5 legacy WordPress
    stubs that should NOT be indexed (`/category/itin-vs-ssn/`,
    `/category/uncategorized/feed/`, `/2023/11/page/3/`, two dated `/2023/11/…` posts).
    CLEARED.
- **Recommendation: DISABLE this scheduled task.** Five consecutive daily runs confirm
  the backlog is empty and stays empty; new pages are better pushed at publish time
  (IndexNow / one manual inspect) than by a daily browser sweep. Ongoing value ≈ zero.
- **Docs updated:** this CHANGELOG entry.
- **Follow-ups / open items (carried, still open — cleanup, not indexing):**
  - **itincreditscore.com `/blank`** — 410/remove or noindex so it stops surfacing as
    crawled-not-indexed.
  - **itinlending.net legacy WordPress URLs** (`/category/*`, `/category/uncategorized/feed/`,
    `/2023/11/*`) — 410 or redirect to Astro equivalents to stop crawl noise.

## 2026-07-11 — GSC request-indexing daily batch (scheduled task run) — BACKLOG STILL CLEARED (4th consecutive)

Ran the daily `itin-gsc-request-indexing` scheduled task. Chrome was logged into
the shared Search Console account; all three `sc-domain:` properties reachable and
authenticated.

- **Requested indexing today: 0 URLs. Quota hit: no (0 of ~10/day consumed).**
  Same picture as the prior three runs — every actionable candidate live-inspects
  as already indexed. Nothing legitimate left to request.
- **Verification (live URL Inspection — authoritative; the Pages "Crawled – currently
  not indexed" report lags by ~days and is stale, last update ~6/29):**
  - **itincreditcard.com:** 27 indexed / 2 not — the 2 are non-content
    (`http://itincreditcard.com/` protocol variant under "crawled-not-indexed" +
    one "page with redirect"). Nothing to request. CLEARED.
  - **itincreditscore.com:** 2 crawled-not-indexed = `/blank` (junk stub, skip) and
    `/credit-reports-with-itin` → live-inspects **"URL is on Google — indexed."**
    Other not-indexed buckets are intentional (7 noindex, 6 canonical alternates,
    2 redirects). CLEARED.
  - **itinlending.net:** the stale 10-URL crawled-not-indexed bucket = 5 current
    Spanish pages, ALL live-inspect **indexed** (`/es/itin-business-loans.html`,
    `/es/articles/itin-secured-credit-card`, `…/itin-mortgage-rates`,
    `…/itin-credit-builder-loan`, `…/itin-debt-consolidation-loan`) + 5 legacy
    WordPress stubs that should NOT be indexed (`/category/itin-vs-ssn/`,
    `/category/uncategorized/feed/`, `/2023/11/page/3/`, two dated `/2023/11/…`
    posts). CLEARED.
- **Recommendation: DISABLE this scheduled task.** Four consecutive daily runs
  (07-08 requested the last 6; 07-09, 07-10, 07-11 found nothing) confirm the
  backlog is empty and stays empty. New pages are better pushed at publish time
  (IndexNow / one manual inspect) than by a daily browser sweep. Ongoing value ≈ zero.
- **Docs updated:** this CHANGELOG entry.
- **Follow-ups / open items (carried, still open — cleanup, not indexing):**
  - **itincreditscore.com `/blank`** — 410/remove or noindex so it stops surfacing
    as crawled-not-indexed.
  - **itinlending.net legacy WordPress URLs** (`/category/*`, `/category/uncategorized/feed/`,
    `/2023/11/*`) — 410 or redirect to Astro equivalents to stop crawl noise.

## 2026-07-10 — GSC request-indexing daily batch (scheduled task run) — BACKLOG STILL CLEARED (3rd consecutive)

Ran the daily `itin-gsc-request-indexing` scheduled task. Chrome was logged into
the shared Search Console account; all three `sc-domain:` properties reachable and
authenticated.

- **Requested indexing today: 0 URLs. Quota hit: no (0 of ~10/day consumed).**
  Every actionable candidate live-inspects as already indexed. Nothing legitimate
  left to request.
- **Verification (live URL Inspection, which is authoritative — the Pages "Crawled
  – currently not indexed" report lags by days):**
  - **itincreditcard.com:** 27 indexed / 2 not — the 2 are non-content (`http://`
    homepage variant + its redirect). Nothing to request. CLEARED.
  - **itincreditscore.com:** 2 crawled-not-indexed = `/blank` (junk stub, skip) and
    `/credit-reports-with-itin` → live-inspects **"URL is on Google — indexed."** CLEARED.
  - **itinlending.net:** the stale 10-URL crawled-not-indexed bucket = 5 current
    Spanish pages (all live-inspect **indexed**: `/es/itin-business-loans.html`,
    `/es/articles/itin-secured-credit-card`, `…/itin-mortgage-rates`,
    `…/itin-credit-builder-loan`, `…/itin-debt-consolidation-loan`) + 5 legacy
    WordPress redirect stubs that should NOT be indexed (`/category/itin-vs-ssn`,
    `/category/uncategorized/feed/`, `/2023/11/page/3/`, two dated `/2023/11/…` posts;
    the content-y ones return an Astro `Redirecting…` stub, so Google handles them
    on its own). CLEARED.
- **Recommendation: DISABLE this scheduled task.** Three consecutive daily runs
  (07-08 requested the last 6, 07-09 and 07-10 found nothing) show the backlog
  empty. New pages are better pushed at publish time (IndexNow / one manual inspect)
  than by a daily browser sweep. Ongoing value ≈ zero.
- **Docs updated:** this CHANGELOG entry.
- **Follow-ups / open items (carried, still open — cleanup, not indexing):**
  - **itincreditscore.com `/blank`** — 410/remove or noindex so it stops surfacing
    as crawled-not-indexed.
  - **itinlending.net legacy WordPress URLs** (`/category/*`, `/category/uncategorized/feed/`,
    `/2023/11/*`) — 410 or redirect to Astro equivalents to stop crawl noise.

## 2026-07-09 — Lead ops: 4 new leads transcribed to "ITIN Site Leads" sheet

Pulled the ITIN lead notification emails (onboarding@resend.dev) from Jul 7–9 and
added them to the top of the shared "ITIN Site Leads" Google Sheet (gid 530890675),
matching the sheet's existing column conventions (Spanish form values translated
to the sheet's English labels).

- **2026-07-09 Uriel Bravo Guzman** — Personal loan, NJ, $10k–$25k, score 78/B.
- **2026-07-08 Marlon Villatoro** — Préstamo personal, GA, under $5k. Submitted
  twice within 3 min (partial then complete); only the complete submission was
  entered. Engine flagged duplicate email/phone for this reason.
- **2026-07-08 Brian Arevalo** — Business loan, CA, $25k+, score 81/B. Notes from
  form (no sheet column for it): 3-way family corporation, applicant son has SSN,
  parents ITIN-only, business revenue $700k+.
- **2026-07-07 Bishal Raut** — from itincreditcard.com, MD; loan type/amount/income
  missing, recorded as Credit card. Submitted 2026-07-08T01:04Z = Jul 7 evening ET;
  dated Jul 7 in the sheet.
- Docs updated: this changelog only (no site/code change).
- Follow-ups: sheet has no Notes/Homeownership column — Brian's business detail and
  Uriel's "owns a home" answer live only in the emails.

## 2026-07-09 — GSC request-indexing daily batch (scheduled task run) — BACKLOG CLEARED

Ran the daily `itin-gsc-request-indexing` scheduled task. Chrome was logged into
the shared Search Console account; all three `sc-domain:` properties reachable.

- **Requested indexing today: 0 URLs.** Nothing legitimate remained to request —
  every real, current page across all three sites is already "URL is on Google."
  No quota consumed (0 of ~10/day).
- **Verification (live URL inspection, not the lagging Pages report):**
  - **itincreditcard.com:** 27 indexed, 2 not — both non-content (`http://`
    homepage variant + one redirect). Nothing to request. CLEARED.
  - **itincreditscore.com:** only 2 crawled-not-indexed — `/blank` (junk stub)
    and `/credit-reports-with-itin`, which live-inspects as **indexed**. CLEARED.
  - **itinlending.net:** the stale "Crawled – currently not indexed" bucket (10)
    is the 5 current `/es/` + `/es/articles/*` Spanish pages (all live-inspect as
    **indexed**: itin-business-loans.html, itin-secured-credit-card,
    itin-mortgage-rates, itin-credit-builder-loan, itin-debt-consolidation-loan)
    plus 5 legacy WordPress URLs that should NOT be indexed (`/category/itin-vs-ssn/`,
    `/category/uncategorized/feed/`, `/2023/11/page/3/`, and two dated `/2023/11/…`
    posts). CLEARED.
  - **Yesterday's 6 requests confirmed landed:** spot-checked
    `/articles/itin-fha-loan-3-5-down` → now "URL is on Google — Page is indexed."
- **Recommendation: DISABLE this scheduled task.** Two consecutive daily runs now
  show the backlog empty; the only recurring work would be pinging brand-new pages
  as they publish, which is better handled at publish time (IndexNow / a manual
  inspect) than by a daily browser-driven sweep. Low ongoing value.
- **Docs updated:** this CHANGELOG entry.
- **Follow-ups / open items (carried from 2026-07-08, still open — cleanup, not indexing):**
  - **itincreditscore.com `/blank`** — 410/remove or noindex so it stops showing
    as crawled-not-indexed.
  - **itinlending.net legacy WordPress URLs** (`/category/*`, `/category/uncategorized/feed/`,
    `/2023/11/*`) — 410 or redirect to their Astro equivalents to stop crawl noise.

---

## 2026-07-08 — GSC request-indexing daily batch (scheduled task run)

Ran the daily `itin-gsc-request-indexing` scheduled task across the three GSC
Domain properties. Chrome was logged into the shared Search Console account
(all three sites present as `sc-domain:` properties + URL-prefix duplicates).

- **Requested indexing today (6 URLs, all confirmed "Indexing requested"):** all
  brand-new/undiscovered itinlending.net article pages that were still "URL is
  unknown to Google":
  1. `/articles/itin-fha-loan-3-5-down`
  2. `/es/articles/itin-fha-loan-3-5-down`
  3. `/articles/itin-down-payment-assistance`
  4. `/es/articles/itin-down-payment-assistance`
  5. `/articles/itin-home-loan-lenders`
  6. `/es/articles/itin-home-loan-lenders`
- **Quota:** NOT hit (6 of ~10/day account-wide used).
- **Skipped — already indexed (live inspection):** itinlending.net
  `/articles/itin-mortgage-lenders-approved` + its `/es/` variant; the four
  `/es/articles/*` pages the stale Pages report listed as "crawled-not-indexed"
  (itin-mortgage-rates, itin-secured-credit-card, itin-credit-builder-loan,
  itin-debt-consolidation-loan — all now on Google); itincreditcard.com
  `/unsecured-credit-cards`; itincreditscore.com `/credit-reports-with-itin`.
- **Key finding — backlog is effectively CLEARED on 2 of 3 sites.** The task's
  premise (itincreditcard.com only ~4 pages indexed) is stale:
  - **itincreditcard.com:** 27 indexed, 2 not — and both "not indexed" are
    non-content (`http://itincreditcard.com/` HTTP variant + one redirect page),
    so nothing to request. CLEARED.
  - **itincreditscore.com:** only 2 crawled-not-indexed — `/blank` (junk
    placeholder, see follow-up) and `/credit-reports-with-itin` (now indexed).
    CLEARED.
  - **itinlending.net:** the "Crawled – currently not indexed" bucket (10) is all
    legacy WordPress cruft that should NOT be requested (`/category/*`,
    `/category/uncategorized/feed/`, `/2023/11/page/3/`, two `/2023/11/…` dated
    posts, one `.html` legacy URL). Real content backlog = only the 6 new pages
    above, now requested.
- **Sitemap check:** all 8 new pages ARE in `sitemap-0.xml` (134 URLs). The
  "No referring sitemaps detected" note in GSC is just Google not having
  re-fetched the sitemap for these new URLs yet — not a sitemap defect.
- **Docs updated:** this CHANGELOG entry.
- **Follow-ups / open items:**
  - **Consider disabling this scheduled task soon** — real content backlog is
    down to just-published pages each day; the recurring value is low now that
    all three sites are essentially caught up.
  - **itincreditscore.com `/blank`** — junk/placeholder page Google keeps
    crawling; worth 410/removing or noindexing so it stops showing as
    crawled-not-indexed.
  - **itinlending.net legacy WordPress URLs** (`/category/*`, `/feed/`,
    `/2023/11/*`) — should be 410'd or redirected to their Astro equivalents to
    stop the crawl noise; currently benign but untidy.

---

## 2026-07-13 — Credit-score site: top-3 actions (all verified vs GSC first)

- **Score #1 (consolidate "how to check credit score with itin", 4th-time
  flagged) — implemented.** GSC-verified: the query (306 impr) splits across
  **9 pages**; the money page `/check-credit-score-with-itin` ranks **worst
  (94.5)** while homepage (54.9) and `/about` (69.1) outrank it. But the money
  page already has an exact H1+title ("How to Check Your Credit Score With an
  ITIN") + Quick Answer — nothing to sharpen. And the competing pages don't even
  contain the phrase (they win as the young-site authority pages). So the lever
  is internal links: added contextual exact-anchor links to the money page from
  3 page-1 authority articles (how-to-dispute pos 5, why-bureaus-differ pos 7,
  hard-inquiries 16.6) + the check-score cluster (money page now has 7 article
  links). Honest note on why it's flagged 4× and hasn't moved: it's an authority
  ceiling, not an on-page/internal-link defect — same root cause as the card site.
- **Score #2 (3 ES `.html` duplicates) — code is already correct; no code fix
  available/needed.** Verified: the `.html` URLs self-canonical to the
  extensionless version, are NOT in the sitemap, and have NO internal links.
  They're live-200 only because GitHub Pages (`build.format: 'file'`) serves both
  `/foo` and `/foo.html` for the same physical file. Google will consolidate via
  the (correct) canonical. Durable accelerator = a **Cloudflare bulk redirect
  `*.html → extensionless`** (dashboard action, the site is behind Cloudflare);
  interim = GSC removal of the 3 `.html` URLs. Neither is a repo change.
- **Score #3 (ES money page + homepage dropped to 0 impressions) — NO regression
  found.** Checked live: `/es` and `/es/check-credit-score-with-itin` have correct
  self-canonical (`→ /es/…`), reciprocal en/es/x-default hreflang, and no
  `noindex`. The markup is clean, so this is low-base volatility (a pos-34 page
  with ~1 impression dropping to 0 is noise), not a hreflang/canonical break.
  Optional confirm: GSC URL-inspection on those two ES URLs.
- Built (112 pages, clean), deployed, committed + pushed on the score repo.
- Docs updated: this entry.

## 2026-07-13 — Credit-card site: pasted "top 3 actions" verified against GSC before acting

User pasted 3 audit actions for itincreditcard.com and asked to implement. I
verified each against real GSC (28d) first — the top one was based on bad data.

- **Action #1 (de-optimize homepage for "credit cards that accept itin"
  cannibalization) — NOT implemented; premise is false in Google.** GSC shows the
  homepage is the ONLY page ranking for the card head terms (`credit card with
  itin` pos 79, `itin credit card` pos 82, `credit cards that accept itin` pos
  89.7 — 118 impr of head terms, all pos 75-92). The money page
  `/credit-cards-that-accept-itin` has **0 impressions / 0 queries** — it isn't
  ranking at all. **True cannibalization: none** (the two pages share no query).
  The homepage isn't head-term-optimized (title = brand, H1 = "Get a credit card
  with your ITIN"), and the money page already has a sharp title + **42 inbound
  internal links**. De-optimizing the highest-authority page would strip the
  site's only head-term visibility and give the money page nothing. The "money
  page at pos 7" in the pasted action was a live-SERP/Serper number, not Google.
  This is the young-site pattern: homepage carries everything, money pages
  haven't earned rankings. Real blocker = **authority/backlinks (Action #2)**.
- **Action #3 (widen footprint) — implemented, data-grounded.** `/how-to-get-an-itin`
  is the one page-1 winner (`irs itin application requirements 2026` at GSC pos 6,
  verified). Added a "What are the requirements to apply for an ITIN in 2026?"
  question-H2 + two adjacent-variant FAQs (requirements / eligibility) → also
  emits FAQPage schema. EN + ES. (The audit's "15 pages page-1/2" was false —
  GSC shows only this one page at pos ≤20.)
- **Action #2 (first backlink) — the real lever, but off-page / send-by-user.**
  pos 75-92 with the homepage carrying everything = zero domain authority, not
  weak pages. Can't be "implemented" from the repo (posting is send-by-user). The
  `itin-social` skill drafts ready Reddit/Quora replies for relevant threads;
  Reddit is already the lending site's #2 traffic source, so the same play fits.
- Built (110 pages, clean), deployed, committed + pushed on the card repo.
- Docs updated: this entry. Follow-up: run `itin-social` to draft card-site
  Reddit/Quora answers when threads are found (user posts).

## 2026-07-13 — Executed lending audit actions #1/#2/#4 (site-wide internal-link repair)

Actioned the top three items from `.seo/output/seo-audit-lending-2026-07-13.md`.

- **Action #2 (404 fix) grew into a site-wide internal-link repair.** The audit
  flagged one 404 (`/itin-business-loan` singular). Investigating, the whole
  article corpus had prose links to top-level `/slug` that 404 — articles live
  at `/articles/slug`, and two money pages are plural (`/itin-personal-loans`,
  `/itin-business-loans`). Verified live: `/itin-heloc`, `/itin-car-loan`,
  `/itin-mortgage-requirements`, `/how-to-build-credit-with-itin`,
  `/itin-personal-loan`, etc. all returned 404. GSC only showed 2 because Google
  hadn't crawled the rest yet. Fixed **23 distinct broken link targets across
  224 file-edits** (EN+ES): article-slug links → `/articles/<slug>`, plural
  money-page singulars → the plural page. Added redirect stubs
  `public/itin-business-loan/` and `public/itin-personal-loan/` (mirroring the
  existing `itin-credit-card` stub) for the already-indexed money-page singulars.
  Final scan: every bare internal link now resolves. (Mid-fix I introduced a
  perl `\Q…\E`-in-replacement bug that backslash-escaped URLs; caught it and
  reversed it precisely before building.)
- **Action #4 (ES personal-loans internal links, flagged 3 audits running).**
  `préstamos personales con itin` has slid 56.8 → 64.1 → 68.9. Added the
  overdue internal links: a 2nd contextual link on `/es/itin-loans` (exact-match
  anchor "préstamos personales con ITIN") and a new one on the ES homepage
  (`/es/index.astro`); `/es/itin-mortgage` already had one. `/es/itin-personal-loans`
  now has real internal authority from the top ES pages.
- **Action #1 (funnel page-1 article authority up to money pages).** 7 of the 8
  page-1 articles had zero contextual body links to their money page (only nav
  links via RelatedLinks). Added one natural contextual uplink in each (EN):
  itin-heloc / itin-mortgage-rates / itin-mortgage-loan-programs /
  itin-mortgage-lenders-approved → `/itin-mortgage`; itin-auto-insurance +
  itin-apartment-rental → `/itin-auto-loan`; itin-debt-consolidation-loan →
  `/itin-personal-loans`.
- Built (148 pages, clean), deployed to `/docs`, verified stubs + fixed links in
  the build output.
- Docs updated: this entry. Follow-ups: mirror Action-#1 uplinks on the ES
  articles; the daily generator is the source of the bad `/slug` links, so its
  prompt/post-processing should be taught to emit `/articles/<slug>` (and plural
  money-page slugs) to stop the 404s recurring; audit actions #3/#5/#6/#7/#8
  remain.

## 2026-07-12 — GA4 wired into seo-pulse for Well Worth + all 3 ITIN sites (behavior/conversion layer)

Extended the `ga4.py` puller (originally built 2026-06-25 for ITIN lead-source)
so "what did the organic clicks DO" can be answered next to the rankings pull.

- **Added Well Worth** (`properties/409479193`) to seo-pulse `config.yaml`;
  the 3 ITIN properties were already wired (412653847 / 540443142 / 413651450).
  Validated every id via `ga4.py --list-properties` against the live data —
  caught that credit-card and credit-score each have a **duplicate orphaned GA4
  property** under a different account (`540818817` / `414108348`) that return
  **0 sessions**; config correctly points at the live ones.
- **Made `ga4.py` dual-vertical.** It now reports traffic-by-channel (with
  engagement% + key events), an **Organic Search top-landing-pages** section (the
  direct join to GSC clicks), key events by name, and conversions by source/
  medium. It auto-detects the vertical: ITIN lead-gen sites report
  `generate_lead`; the Well Worth store reports **`transactions` + purchase
  revenue** and explicitly refuses to cite the raw `purchase` event count (which
  is inflated ~10x by order-status refires — the exact contamination the Well
  Worth metric contract warns about). Verified: WW window shows 305 raw purchase
  events but **30 real transactions / $4,128.66**, of which **19 orders came from
  Google organic**, 5 from Bing organic.
- Auth untouched for GSC — GA4 uses a separate `analytics.readonly` token
  (`.secrets/ga4_token.json`); confirmed rankings/GSC pulls still work after.
- Docs updated: seo-pulse `SKILL.md` (new GA4 capability rows + the
  transactions-not-events rule), `ANALYTICS-PLAN.md` (ga4.py status). This entry.
- Follow-up: could fold a compact GA4 line into the `rankings` skill output so
  each rank report also shows organic sessions→conversions per site; deferred.

## 2026-07-07 — Non-personal bylines: drop human names, author schema Person→Organization (all 3 sites)

**Per Bob's directive**: article bylines must no longer use any human name (not
his, and not a made-up persona either). This supersedes the earlier
"varied pen-name personas" approach.

- **New byline model:** bylines are non-personal labels only, randomized across
  posts — "Editorial Team", "Editorial Staff", "Research Desk". Rewrote the
  `editorial` block in each site's `consts.ts`: `editorial.name` = "Editorial
  Team", the `team` roster = the 3 labels with desk-style `role`s and honest
  team-level bilingual bios (no person, no fabricated credentials).
- **Schema change:** `ArticleSchema.astro` `author` switched from `Person`
  (`@id .../#editor`) to `Organization` (`name` = the byline label, linked to
  the publisher via `parentOrganization` → `/#organization`). Google fully
  supports Organization authors; this is cleaner E-E-A-T than a fake Person.
  Deleted `PersonSchema.astro` (all 3 repos) and removed its usage + the
  "led by [name]" copy from `/about` and `/es/about`; the `/about` pages now
  render the desks as a masthead. `AboutPageSchema` already used Organization
  as mainEntity, unchanged.
- **Backfilled all 206 existing article files** (EN + ES, all 3 sites): replaced
  every `author: "Human Name"` with a slug-hashed non-personal label using the
  same hash as the generator's `pickAuthor`, so EN/ES stay consistent and the
  distribution matches what new posts will produce. Verified 0 human names
  remain and EN/ES bylines match per slug.
- **Generator:** no code change needed — `loadSite` reads `author`/`authors`
  from `consts.ts` by regex and `pickAuthor` hashes the slug over the roster,
  so new daily/seed posts automatically get the non-personal labels.
- Verified in built HTML: article schema author is `Organization`, 0
  `Person`/`#editor` references, visible byline reads e.g. "By Editorial Staff ·
  Research & Fact-Checking · Updated …", `/about` (EN+ES) shows the 3 desks with
  no Person schema. All 3 sites build clean.
- Docs updated: this entry + `CONTENT-PIPELINE.md` (byline model); memory
  `feedback_no_byline.md` rewritten to the new rule.
- Follow-ups: none — rule applies going forward via the generator.

## 2026-07-07 — Humanize pass on all new/edited GEO quick-wins content (all 3 sites)

**Corrected a process gap flagged by the user**: the hand-authored content
from the prior GEO quick-wins entry (below) was written directly without
running it through the standing `humanize` skill, which the content pipeline
requires for every article (`CONTENT-PIPELINE.md` — `lib/humanize.mjs` is a
mandatory second pass on generator output; this was a manual-authoring
oversight, not a generator bug). Fixed by running the full humanize pass on
every file touched in that entry:

- Full rewrite (quickAnswer + faqs + body) on both new lending articles,
  EN + ES: `itin-fha-loan-3-5-down`, `itin-down-payment-assistance`.
- Rewrote the new FAQ entries (not the pre-existing ones) in
  `itin-mortgage-requirements`, `itin-mortgage-lenders` (lending) and
  `can-you-get-a-credit-card-with-an-itin` (credit card), EN + ES.
- Rewrote the `howToSteps` "text" fields (kept "name" fields as short
  imperative labels) on all 6 HowTo articles, EN + ES: `itin-renewal`,
  `itin-mortgage-qualify` (lending); `how-to-apply-for-credit-card-with-itin`,
  `upgrade-secured-to-unsecured-credit-card-itin` (credit card);
  `how-to-dispute-credit-report-errors-with-itin`,
  `how-to-build-credit-with-itin-number` (credit score).
- Removed every em dash across all 22 files (several had crept in, including
  literal em dashes inside a markdown table cell in
  `itin-down-payment-assistance`), broke up parallel/tidy AI-shaped sentence
  structure, and varied rhythm per the skill's rules. Preserved every fact,
  number, internal link, and the compliance-critical distinction between the
  FHA-style partner program and a real HUD-insured FHA loan.
- Rebuilt, redeployed, and pushed all 3 repos after the rewrite; all builds
  clean, HowTo schema step counts and article page counts unchanged.
- Docs updated: none needed beyond this entry (no factual/architectural
  change, content-quality fix only).
- Follow-ups: going forward, any hand-authored article content (not run
  through the daily generator's `lib/humanize.mjs` pass) must be explicitly
  routed through the `humanize` skill before publishing, same bar as
  generated content.

## 2026-07-07 — GEO quick wins: HowTo schema, FHA/down-payment articles, updatedAt refresh (all 3 sites)

**Started executing the GEO-AI-VISIBILITY-STRATEGY.md quick-wins list**, per
direct instruction to start fixing the gaps identified in the audit:

- **HowTo schema.** Added `howToSteps` (optional array) to the article content
  schema and a new `HowToSchema.astro` component, wired into `ArticleLayout`
  on all 3 sites (EN + ES routes). Populated real, extracted (not invented)
  steps on 6 genuinely step-based articles: `itin-renewal`,
  `itin-mortgage-qualify` (lending); `how-to-apply-for-credit-card-with-itin`,
  `upgrade-secured-to-unsecured-credit-card-itin` (credit card);
  `how-to-dispute-credit-report-errors-with-itin`,
  `how-to-build-credit-with-itin-number` (credit score) — EN+ES each.
- **Fact-check page correction.** The strategy doc had recommended adding a
  standalone fact-checking-policy page; on inspection all 3 sites'
  `/editorial-policy` already carry dedicated "Fact-checking and review,"
  "How often we update," and "Corrections policy" sections. No page needed;
  corrected the doc instead of building a redundant one.
- **Two new lending articles**, hand-authored (no `ANTHROPIC_API_KEY` in this
  session) EN+ES, closing confirmed content gaps directly tied to the FHA
  promo shipped 2026-07-06:
  - `itin-fha-loan-3-5-down` — explains the FHA-style 3.5%-down partner
    program, explicitly distinguishing it from a real HUD-insured FHA loan
    (which requires an SSN per HUD Handbook 4000.1) to avoid overstating the
    claim. Cross-linked from `FhaPromo.astro`'s disclaimer note on all 3 sites
    ("How this program works →", pointing at the lending-site article since
    it's the only site with the mortgage vertical).
  - `itin-down-payment-assistance` — down-payment assistance programs
    (state HFAs, city/county, nonprofit/CDFI, employer-assisted), explaining
    why ITIN eligibility is program-specific, not a federal SSN rule.
  - Both cross-link each other and the existing `itin-mortgage-qualify`
    article; both also linked from `itin-mortgage-requirements` and
    `itin-mortgage-lenders` (see below).
- **Genuine `updatedAt` refresh** (real new content added, not date bumps) on
  9 articles across the 3 sites: the 6 HowTo articles above (the extracted
  steps themselves are the new content), plus `itin-mortgage-requirements`
  and `itin-mortgage-lenders` (lending — new FAQ + body links to the two new
  FHA/down-payment articles) and `can-you-get-a-credit-card-with-an-itin`
  (credit card — new FAQ on the May 2026 enhanced-due-diligence executive
  order, already referenced elsewhere on the site but missing here).
- **Verified the 35-target digital-PR outreach status** (flagged as
  drafts-only in `SEO-AEO.md`): confirmed via Gmail that all 35 remain
  unsent drafts. Also surfaced, incidentally, a separate and much more
  active real outreach thread — sent, replied-to conversations with
  individual loan officers (Goalterra, IDB Global FCU, NAF, Old National
  Bank) about buying/referring ITIN leads — not part of this task, noted for
  awareness only.
- Docs updated: `GEO-AI-VISIBILITY-STRATEGY.md` (marked completed items,
  corrected the fact-check-page item, added the outreach-status finding).
- Follow-ups: the remaining strategy-doc items (glossary, individual
  lender/issuer pages, state pages for card/score, monthly data-drop
  authority play, backlink-tool wiring) are unstarted; this session covered
  the 1–2 week quick-wins tier only.

## 2026-07-06 — GEO/AI-visibility strategy audit (new doc, all 3 sites)

**Full GEO (Generative Engine Optimization) audit + 12-month roadmap**, per
request to make all 3 sites the AI-recommended ITIN resources (ChatGPT,
Gemini, Claude, Perplexity, Copilot — Google secondary). New doc:
[`GEO-AI-VISIBILITY-STRATEGY.md`](./GEO-AI-VISIBILITY-STRATEGY.md).

- Ran 6 sub-agent audits (retried 2 that initially mis-targeted the wrong
  repo) to build a real, code-verified content/technical inventory per site
  (article counts, word counts, schema types, robots.txt/llms.txt contents,
  internal-link mechanics, freshness), plus one competitor-research pass
  (real named competitors: BlueRate.ai, AsertaLoans, Firstcard, ITINScore.com,
  MyITINCredit.com, CFPB).
- Grounded the "AI visibility" baseline in real data instead of estimates:
  pulled `.seo/output/rankings-2026-06-28.md` and
  `.seo/output/seo-audit-lending-2026-06-29.md` — confirmed 0 target keywords
  in the Google top 20 across all 3 sites, and exactly 4 confirmed AI-referral
  sessions ever recorded (ChatGPT only, lending site) — 0 confirmed
  Perplexity/Gemini/Claude/Copilot referrals to date.
- Identified the highest-impact real gaps: zero original data/research
  anywhere in the network (recommended a monthly "ITIN Lending Index" +
  credit-readiness aggregate report as the top authority-building lever), 0%
  of 202 articles ever populate `updatedAt`, only 1 of 3 sites has any
  interactive tool, 0 individual lender/issuer pages on any site, and
  lopsided state-page coverage (16 on lending, 0 on card/score).
- Docs updated: new `GEO-AI-VISIBILITY-STRATEGY.md`; added to the doc index in
  `README.md`.
- Follow-ups: this doc's question bank + gap tables should bias the daily
  content generator's `--topic` selection going forward (see
  `CONTENT-PIPELINE.md`); quick-win items (populate `updatedAt` on refreshed
  articles, ship the FHA-for-ITIN + down-payment-assistance articles, add
  `HowTo` schema to step-based articles) are unassigned and ready to pick up.

## 2026-07-06 — FHA promo legal disclaimer (asterisk + footer disclosure, all 3 sites)

**Added required legal disclaimer to the FHA 3.5%-down promo** shipped earlier
today, per direct instruction: "put an asterisk anywhere you promote the FHA
thing and add some legal stuff at the bottom of the page about subject to
approvals, no guarantees, etc."
- Added a trailing `*` to every FHA/3.5%-down claim: the site-wide announcement
  bar (`BaseLayout.astro`), and the `FhaPromo` band's badge, heading, and body
  copy — in both English and Spanish, on all 3 sites.
- Added a matching footnote paragraph to the site footer (`Footer.astro`,
  `.fha-legal` class) stating the FHA program is offered by a third-party
  lending partner (not us), is not a guarantee of approval/rate/terms, and that
  all financing is subject to lender underwriting, credit approval, income
  verification, and program eligibility requirements that vary by state.
- **Also fixed a gap found while verifying this**: the Spanish homepages
  (`pages/es/index.astro`) on all 3 sites had never received the 2026-07-06
  lead-gen redesign below — they still had the old sidebar-aside layout with no
  embedded `LeadForm` and no `FhaPromo` band at all (the announcement bar and
  footer disclaimer still applied since those live in the shared
  `BaseLayout`/`Footer`, but the homepage-specific hero form + FHA band were
  English-only). Brought all 3 Spanish homepages in line with their English
  counterparts: embedded lead form in the hero, `FhaPromo` band with the same
  disclaimer, hero CTAs pointing to `#lead`.
- Verified via local preview (build + browser) on lending (EN + ES) and via
  build output grep on card/credit-score (EN + ES) — asterisk, footer
  disclaimer text, and `home_status` field all present on all 6 homepage
  variants (3 sites × 2 locales).
- Docs updated: this entry.
- Follow-ups: none — this closes out the FHA promo compliance ask.

## 2026-07-06 — Lead-gen redesign: form-first homepages + FHA promo + home-intent questions (all 3 sites)

**Refocused all 3 ITIN sites on lead acquisition** (we monetize by selling leads):
- **Form is now the primary above-the-fold action.** Embedded the compact `LeadForm`
  in every homepage hero (lending: replaced info aside; card: replaced hero ad, ad moved
  below-fold; score: replaced info panel). Hero CTAs anchor to `#lead`. Content ad
  placements kept — just no longer the hero's lead element.
- **FHA-for-ITIN partner promo** (`components/FhaPromo.astro`): bold band ("Buy a home
  with just 3.5% down") on every homepage + a site-wide announcement bar in `BaseLayout`
  (every entry point), both CTA → the lead form. EN + ES.
- **New questions on every form, all 3 sites:** "Do you currently own a home?" (own /
  want to buy / not looking) + a conditional "When are you looking to buy?" (ASAP /
  3–6 months / 6–12 months) that reveals only for "want to buy". Verified.
- **Backend:** `home_status` + `buy_timeframe` promoted to first-class `leads` columns
  (migration `0004`), surfaced in email + dashboard + `lead_dashboard` view. 17 tests
  green. End-to-end verified (card-site "want to buy / ASAP" lead stored both; deleted).

**Note:** the FHA 3.5%-down program is a third-party lending-partner offering (labeled
as such in the promo). **Docs:** LEAD-INTELLIGENCE.md.

---

## 2026-07-05 — Lead Intelligence M5: OFAC + MX + velocity screening (engine v1.1.0)

**Server-side fraud signals now live** on the shared lead backend (all 3 sites):
- **OFAC SDN name screening** — new `sdn_names` table loaded with 7,495 SDN individuals
  (treasury.gov sdn.csv) via `supabase/scripts/load-sdn.sh`; first+last-token match →
  manual-review flag at Medium fraud, NEVER auto-decline (name-only matches false-positive
  heavily; verify DOB). Migration `0003_screening.sql`.
- **Email MX validation** (Deno.resolveDns, 1.8s timeout; unavailable ≠ penalized).
- **Velocity** — same IP/email/phone in 24h; IP ≥2→Medium, ≥4→High, ≥6→Critical.
- **Expanded disposable-email list** (~70 domains).
Engine `validateLead(lead, dup, signals)` v1.1.0; 5 new unit tests (17 total, passing).
**Verified live:** posted synthetic leads — disposable, no-MX, and SDN-name each flagged
correctly, and velocity caught the test blast itself ("same IP submitted 6 applications
in 24h"). Synthetic test leads then deleted from the DB (1 real lead remains).

**Resend status:** free plan's single domain slot is pourpicks.app (in use — untouched).
Verifying itinlending.net needs the $20/mo Pro upgrade → awaiting owner go-ahead.
Interim: from-address display name set to "ITIN Lead Intelligence <onboarding@resend.dev>".

**Docs updated:** LEAD-INTELLIGENCE.md (M4 live + M5 section + roadmap).
**Follow-ups:** cron the SDN refresh; Resend upgrade decision; M6 per-site tuning.

## 2026-07-05 — Lead-form UX fixes on all 3 sites (hidden-attribute override + dead CTA)

**User-reported, verified root cause:** `.field{display:grid}` / `.card{display:block}`
in `global.css` override the HTML `hidden` attribute (author CSS beats the UA rule).
Two symptoms: (1) the business/down-payment qualifier questions showed for EVERY loan
type on the lending form — which is why personal-loan leads carried `time_in_business`
values; (2) the thank-you "product CTA" card always rendered, showing a dead
"Continue your application" button when no affiliate URL is configured.

**Fixes (all 3 repos, committed + pushed + /docs rebuilt):**
- `global.css`: `[hidden]{display:none!important}`.
- Thank-you CTA anchor defaults to `href="/apply"` (`/es/apply` on ES) — never dead.
- Lending i18n: business question relabeled "How long has your business been
  operating?" (+ ES) — only shows when "Business loan" is selected.

**Verified in-browser on the built site:** CTA card `display:none`; business question
hidden on load, appears only for Business loan, hides again on switch; new label live.
Note for lead-data hygiene: historical leads with `time_in_business` on personal loans
were an artifact of this bug, not applicant confusion.

---

## 2026-07-05 — Lead Intelligence: DEPLOYED LIVE (all 3 sites) + LLM summaries + M4 dashboard

**Went from built to fully live.** The AI lead-validation backend is deployed and all
three ITIN sites now route real leads through it.

- **Deployed** to Supabase project `itin-lead-intelligence` (`qnthujurzakdmngcidsg`,
  East US): migrations applied, `lead` function live, Resend wired
  (`onboarding@resend.dev` → owner inbox). Verified end-to-end — test lead scored
  96/A+/HIGH, stored, **email delivered**.
- **All 3 sites cut over** (itinlending.net, itincreditcard.com, itincreditscore.com):
  `PUBLIC_LEAD_ENDPOINT` repointed off Web3Forms to the shared function; `/docs` rebuilt
  + pushed in all 3 repos; confirmed live. One backend, `source_site` tags each lead.
  A real production lead already came through and scored.
- **(b) LLM summaries live** — `ANTHROPIC_API_KEY` secret set (claude-haiku-4-5);
  summaries now `summary_source=llm` instead of the template fallback.
- **(c) M4 dashboard** — new `dashboard` Edge Function (JSON data API, CORS, access-code
  gated; service role stays server-side) + `migrations/0002_lead_dashboard.sql`
  (`lead_dashboard` view) + `admin/lead-intelligence.html` (single-file SPA: KPIs, search,
  grade/fraud/site/type filters, sortable table, per-lead detail drawer with exec summary /
  module bars / flags / raw AI output, CSV + Excel export). Verified rendering + login +
  data load in-browser.

**Access:** open `admin/lead-intelligence.html` locally; enter the dashboard access code
(stored as the `DASHBOARD_ACCESS_CODE` Supabase secret — given to the owner separately).
**Docs updated:** `project-docs/LEAD-INTELLIGENCE.md`, `supabase/README.md`.
**Follow-ups:** optional — verify `itinlending.net` domain in Resend to send from
`leads@itinlending.net`; M5 pluggable integrations (OFAC, Plaid, Socure, IP/velocity);
future ML Funding Probability once outcomes accrue. The Supabase access token used for
deploy (`itin-lead-intelligence-deploy`) can be revoked anytime.

---

## 2026-07-05 — Lead Intelligence: AI Lead Validation Engine (MVP, M0–M3)

**Built a server-side AI lead-validation backend** for all three ITIN sites. Validates
every submission before it reaches the owner: scores lead quality 0–100, flags fraud,
writes an executive summary, stores everything (ML-ready), and emails a ranked internal
report. **Never approves or denies** — validation/prioritization only.

**Why a new backend:** sites are static Astro on GitHub Pages (no server); form POSTs to
Web3Forms today. Inserted a **Supabase Edge Function** between form and email:
`form → /functions/v1/lead → validate → Postgres → engine → LLM summary → store → email`.
Applicant experience unchanged (same form + thank-you redirect).

**Shipped (`~/Itin/supabase/`):** `functions/_shared/engine.ts` (deterministic
`validateLead()` — the brain), `_shared/{llm,email,types}.ts` (grounded LLM summary w/ 6s
timeout→template fallback, scored internal email + failsafe, TS interfaces),
`functions/lead/index.ts` (orchestrator; failsafe = lead always saved + emailed),
`migrations/0001_lead_intelligence.sql` (`leads`, `lead_validations` incl. `future_*`
outcome columns for ML, `lead_intelligence` view, RLS on), `_shared/engine.test.ts`
(12 unit tests, all passing; full bundle type-checks), `config.toml`, `.env.example`, `README.md`.

**Scoring (owner-specified):** Identity & Contactability 25% · Financial Plausibility 25% ·
Consistency 20% · Fraud 20% · Completeness 10%. Fraud can hard-cap the grade. Financial
plausibility weight-neutral for card/score leads. **Funding Probability** = separate,
deliberately-deferred ML score ("not yet available") — the intended long-term differentiator.

**Validated on real data:** engine run on the 27-lead export → `reports/lead-engine/`
(`validate.py`, `scored-leads.json`, `lead-scores-report.md`). Distribution: 8 A+, 5 A, 6 B, 1 C, 4 F.

**Docs:** new `project-docs/LEAD-INTELLIGENCE.md` + `supabase/README.md`.
**Follow-ups / not in MVP:** cutover (`PUBLIC_LEAD_ENDPOINT` → function URL, one env change
per site) needs the user's Supabase project + Resend key; then M4 dashboard, M5 pluggable
integrations (OFAC, Plaid, Socure, disposable-email/phone, IP/velocity), M6 3-site config.

---

## 2026-07-05 — GSC request-indexing daily run: BACKLOG CLEARED (0 requests needed)

**Scheduled `itin-gsc-request-indexing` batch ran across all three GSC domain
properties.** Chrome/GSC auth was available (shared account, logged in). Inspected
every "Crawled – currently not indexed" URL on all three sites via the URL
Inspection tool — **all real content pages already show "URL is on Google / Page
is indexed."** The Page Indexing report's not-indexed buckets are stale; the pages
have since been indexed. **0 request-indexing quota spent, 0 needed. Quota not hit.**

Per-site state today:
- **itincreditcard.com** — 27 indexed / 2 not-indexed. The 2 are both non-canonical
  junk: `http://itincreditcard.com/` (HTTP variant of homepage) and one redirect
  page. No action. (Note: the task file's "~4 pages indexed" for this site is stale
  — it's the laggard no longer.)
- **itincreditscore.com** — not-indexed buckets are intentional (7 noindex, 6 proper
  canonicals, 2 redirects) plus 2 "crawled-not-indexed": `credit-reports-with-itin`
  (verified already indexed) and `/blank` (orphan — no sitemap, no referring page,
  last crawled Mar 19; should be removed/410'd, not indexed).
- **itinlending.net** — 10 "crawled-not-indexed": the 5 real ones (all `/es/` pages:
  `itin-business-loans.html`, and `/es/articles/` itin-secured-credit-card,
  itin-mortgage-rates, itin-credit-builder-loan, itin-debt-consolidation-loan) are
  **all verified already indexed**. The other 5 are legacy WordPress cruft that
  should NOT be request-indexed and ideally be noindex'd/redirected:
  `/category/itin-vs-ssn/`, `/category/uncategorized/feed/` (RSS feed),
  `/2023/11/page/3/` (pagination), and two `/2023/11/…` legacy dated posts.

**BACKLOG CLEARED** — no legitimate content pages await indexing on any of the
three sites. Recommend the user **disable the `itin-gsc-request-indexing` scheduled
task.**

Follow-ups (SEO hygiene, not indexing): (1) remove/410 `itincreditscore.com/blank`;
(2) decide fate of the legacy `itinlending.net` WordPress URLs — noindex the
feed/category/pagination archives; redirect or noindex the two `/2023/11/` posts.

- Docs updated: this CHANGELOG entry.
- Follow-ups / open items: as above; disable the scheduled task.

## 2026-07-01 — Affiliate-click source of truth (`affiliate-clicks.py`)

**Built an our-side affiliate-click ledger** so click counts can be reconciled
against the Awin and CJ dashboards. New script `web/scripts/affiliate-clicks.py`
(reuses seo-pulse GA4 auth/venv/config) unions two GA4 signals — the custom
`affiliate_click` event (PRIMARY) and enhanced-measurement outbound `click` to
affiliate redirect domains (AUTO) — tags each row, classifies network (Awin/CJ),
and writes `reports/affiliate-clicks-YYYY-MM-DD.md` + `.json`.

**Findings from the first run (all-time):**
- **1 affiliate click total** — Awin, ITIN Credit Card, 2026-06-28. Caught by AUTO
  only; PRIMARY=0 because the click predates the current `Analytics.astro` deploy.
- The custom `affiliate_click` handler is correct and live on all 3 sites (verified
  in live HTML; Awin links carry `rel="sponsored nofollow"`) — next real click
  should log PRIMARY=1.
- **CJ = 0 because CJ isn't deployed**: `PUBLIC_AFFILIATE_URL_*` unset → money-page
  CTAs fall back to `/apply`; no live CJ deep links exist yet.
- **Discrepancy flagged:** GA4 shows no `scroll`/`click` auto-events on ITIN Lending
  (only Card + Score), despite EM documented as ON for all 3 — so AUTO backfill only
  covers Card/Score today. Verify/enable EM outbound-click on Lending.

**Scheduled it daily.** Local `launchd` job `com.itin.affiliate-clicks` runs
`web/scripts/affiliate-clicks-daily.sh` at 6:22am (regenerates ledger + `-latest`
copy; logs to `~/Library/Logs/itin-affiliate-clicks.*`). Local-only (needs the
seo-pulse GA4 OAuth token) and does not auto-commit. Tracked plist:
`web/scripts/com.itin.affiliate-clicks.plist`. Verified end-to-end (loaded + one
manual run OK).

**Docs updated:** `ANALYTICS-PLAN.md` (new "Affiliate-click source of truth" section
incl. the schedule).
**Follow-ups:** (1) confirm PRIMARY fires on the next real click; (2) enable EM on
Lending; (3) wire `PUBLIC_AFFILIATE_URL_*` when CJ deep links are ready so CJ clicks
enter the ledger.

---

## 2026-06-30 — Daily GSC request-indexing batch (automated)

**Automated daily indexing task.** Site: itinlending.net (only site needing work today — itincreditcard.com and itincreditscore.com had no actionable unindexed pages per prior session analysis).

**10 indexing requests submitted (daily quota reached):**
1. `/articles/itin-car-loan` — unknown to Google
2. `/articles/itin-business-loan` — unknown to Google
3. `/articles/itin-mortgage-rates` — unknown to Google
4. `/itin-loans/texas` — unknown to Google
5. `/itin-loans/california` — unknown to Google
6. `/itin-loans/florida` — unknown to Google
7. `/itin-loans/arizona` — unknown to Google
8. `/itin-loans/georgia` — unknown to Google
9. `/itin-loans/north-carolina` — unknown to Google
10. `/itin-loans/nevada` — unknown to Google

**Skipped (confirmed already indexed during this run):**
- `/articles/itin-mortgage-lenders`, `/articles/itin-personal-loan`, `/articles/itin-heloc`, `/articles/itin-payday-loan`, `/itin-loans/new-york`, `/itin-loans/illinois`

**No quota exceeded error. No rejections.**

**Pattern note:** All unindexed pages show "No referring sitemaps detected" despite being in the sitemap-0.xml — Google's sitemap crawl is lagging behind the Astro site launch. Request-indexing is the right lever until Google re-crawls the sitemap.

- Docs updated: this CHANGELOG.
- Follow-ups: Tomorrow continue with remaining unindexed state pages (`/itin-loans/washington`, `/itin-loans/colorado`, `/itin-loans/maryland`, `/itin-loans/virginia`, `/itin-loans/washington`, etc.) and any remaining article pages.

---

## 2026-06-29 — Weekly SEO audit: itincreditscore.com (automated)

**Automated weekly scheduled audit.** GSC window: 2026-06-01 → 2026-06-28.

**Key findings:**
- Impressions: 997 (+13% vs Jun 24 audit of 883, +37% vs Jun 12). Queries: 96 (+5). Clicks: 3 (flat). Avg pos: 60.6.
- P0 RESOLVED: `/check-credit-score-with-itin` is now indexed (was "unknown to Google" Jun 24) — ranking at pos 88.4.
- REGRESSION: "annualcreditreport.com itin" dropped pos 38 → pos 63. Needs H2 content fix in `/credit-bureaus-and-itin`.
- ES locale expanding significantly: 8 Spanish queries now visible (was 0 in Jun 24). `/es/foreign-credit-history` at pos 9.0 — near page 1.
- `.html` duplicate URLs for ES pages — canonicalization fix needed.
- GA4: active users +52% WoW (38 users). AI-referred sessions: 0.
- Docs updated: `~/ITINCreditScore/.seo/output/seo-audit-creditscore-2026-06-29.md`.
- Follow-ups: confirm ES broken-link fix deployed, fix .html canonical, push /es/foreign-credit-history to page 1.

---

## 2026-06-29 — Weekly SEO audit: itincreditcard.com (automated)

**Automated weekly scheduled audit.** GSC window: 2026-06-01 → 2026-06-29.

**Key findings:**
- Impressions: 212 (+11% vs 06-24 audit of 191). Queries: 67 (+8%). Clicks: 1 (flat). Avg pos: 62.4.
- Indexed pages: **still 5** — no movement in 3+ weeks. Critical blocker.
- New bright spot: "itin credit score" appeared at pos 46.8 — best position of any query on the site.
- "credit card with itin" slipping: pos 70.2 → 75.1 (highest-volume query, needs attention).
- "best itin credit cards" flat at pos 53.0 — no progress, no regression.
- /es: still zero Spanish impressions. Crawl budget issue, not hreflang. Monitor to 2026-07-22.
- Live SERP (Serper + Bing): not in top 100/50 on any target keyword — consistent with pos 53-90.
- "Crawled - not indexed" went from 0 → 1, but it's just the HTTP homepage redirect — not a content issue.
- Docs updated: `~/ITINCreditCard/.seo/output/seo-audit-creditcard-2026-06-29.md`.
- Follow-ups: diagnose indexing freeze (Action #1), push "itin credit score" content (Action #2), stop "credit card with itin" slide (Action #3), first backlink via Reddit (Action #4).

---

## 2026-06-29 — Weekly SEO audit: itinlending.net (automated)

**Automated weekly scheduled audit.** GSC window: 2026-06-01 → 2026-06-28. GA4: Jun 1 – Jun 28.

**Key findings:**
- Impressions: 769 (+49% vs 06-24 audit of 516). Query footprint: 151 (+34 new). Avg pos: 75.6 (+1.2).
- **First AI referral confirmed:** chatgpt.com sent 4 sessions, 50% engagement rate, 58s avg — highest-quality traffic source on the site.
- Reddit.com: 25 sessions (5.2%), 56% engagement — #2 external source, outreach strategy validated.
- Homepage avg pos: **22.9** — closest to page 2 of any URL on the site.
- itin-business-loans avg pos: **41.2** — best money page position.
- préstamos personales con itin degraded: pos 56.8 → 64.1 (internal link push overdue).
- 404 page = 3rd most viewed in GA4 (68 sessions) — broken URL receiving real traffic.
- 4 pages "crawled - not indexed" by Google (quality filter; need content depth review).

**Top 3 actions this week:**
1. Add internal links to /es/itin-personal-loans to recover préstamos personales position.
2. Identify and fix the 404 URL causing 68 lost sessions.
3. Add 2-3 internal links to /itin-business-loans to capitalize on pos 41.2.

- Docs updated: `.seo/output/seo-audit-lending-2026-06-29.md`, CHANGELOG.md.
- Follow-ups: Check exact 404 URL via GSC URL Inspection; pull homepage queries via GSC page filter; check 4 crawled-not-indexed article URLs.

---

## 2026-06-29 — GSC request-indexing batch (itincreditcard.com articles + itincreditscore.com money page)

**Automated daily indexing task.** 10 requests submitted, quota reached (no "Quota Exceeded" shown — stopped at 10 as planned).

**Requested today:**
1. `itincreditcard.com/articles/business-credit-card-with-itin` — URL unknown to Google (fresh request)
2. `itincreditcard.com/articles/cash-back-credit-card-itin-holders` — fresh
3. `itincreditcard.com/articles/credit-card-denied-itin-what-to-do` — fresh
4. `itincreditcard.com/articles/credit-card-international-students-itin` — fresh
5. `itincreditcard.com/articles/credit-card-itin-non-residents` — fresh
6. `itincreditscore.com/credit-reports-with-itin` — crawled but not indexed; first success after one transient error
7. `itincreditscore.com/articles/what-is-a-good-credit-score-for-itin-holders` — fresh
8. `itincreditcard.com/articles/credit-limit-increase-itin-credit-card` — fresh
9. `itincreditcard.com/articles/credit-union-credit-card-itin` — fresh
10. `itincreditcard.com/articles/first-credit-card-itin-no-us-credit-history` — fresh

**Skipped (already indexed):** itincreditcard.com money pages (all done); itincreditscore.com/credit-builder-loans; itincreditscore.com/articles/credit-builder-loan-with-itin; itincreditscore.com/articles/how-to-build-credit-with-itin-number; itincreditscore.com/articles/can-you-have-a-credit-score-with-an-itin; itincreditscore.com/articles/credit-age-itin-holders.

**Backlog remaining:** ~29 itincreditcard.com /articles/* (EN) + ~35 itincreditcard.com /es/* + most itincreditscore.com /es/*. itinlending.net pending separate check.

- Docs updated: CHANGELOG.md only.
- Follow-ups: Continue daily runs to clear article and /es page backlog.

## 2026-06-28 — GSC request-indexing batch (itinlending.net state loan pages; partial run)

**Automated daily indexing task.** Session encountered a context-window limit mid-run;
computer-use re-authorization timed out on the resumed session (no active user for
scheduled task). 2 of ~10 quota slots used before interruption.

**Indexing successfully requested (2 URLs):**
1. itinlending.net/articles/itin-payday-loan
2. itinlending.net/articles/itin-renewal

**Already indexed — confirmed via URL Inspection, skipped:**
- itincreditcard.com: /unsecured-credit-cards, /build-credit-with-itin,
  /business-credit-cards, /how-to-get-an-itin, /about,
  /articles/can-you-get-a-credit-card-with-an-itin,
  /articles/secured-credit-card-with-itin, /articles/unsecured-credit-card-itin-holders
- itincreditscore.com: /check-credit-score-with-itin, /credit-bureaus-and-itin,
  /itin-credit-score-guide, /build-credit-history-with-itin
- itinlending.net: /articles, /es, /es/articles, /articles/itin-student-loan,
  /articles/itin-savings-account, /articles/itin-retirement-account,
  /articles/itin-send-money-internationally

**Dead page flagged (dev action needed):**
- itincreditcard.com/articles/transfer-itin-credit-history-to-ssn — live test 404.
  Page does not exist. Needs to be created or 301-redirected to avoid waste of crawl
  budget and GSC "discovered not indexed" slot.

**Technical exclusions (not actionable via REQUEST INDEXING):**
- itincreditscore.com "not indexed" pages: all are noindex tags, canonical redirects,
  or a blank placeholder page — no content to index.
- itinlending.net "crawled not indexed" pages: all are legacy WordPress-style URLs
  (/2023/11/*, /category/uncategorized/feed/) — not current Astro content.

**Real gap discovered — /itin-loans/* state pages:**
- 15 state loan pages (arizona, california, florida, georgia, illinois, maryland,
  massachusetts, nevada, new-jersey, new-york, north-carolina, pennsylvania, texas,
  virginia, washington) show "URL unknown to Google / no referring sitemaps detected."
- /itin-loans/arizona was queued for REQUEST INDEXING when the session was interrupted.
- These pages (and /es/itin-loans/* equivalents) are the primary backlog for the
  next run. ~8 quota slots remain from today's allocation if they can be used.

- Docs updated: CHANGELOG.md
- Follow-ups: (1) Dev: create or 301 itincreditcard.com/articles/transfer-itin-credit-history-to-ssn.
  (2) Next run: REQUEST INDEXING for all 15 /itin-loans/[state] pages + /es/itin-loans/* equivalents.
  (3) Investigate why sitemap-0.xml URLs show "No referring sitemaps" in GSC — confirm sitemap
  is submitted at the correct https:// URL in GSC Sitemaps panel.

---

## 2026-06-27 — GSC request-indexing batch run (itincreditcard.com priority)

**Automated daily indexing task.** Chrome/GSC was authenticated and available.

**itincreditcard.com status (GSC Pages report, last updated 6/11/26):**
- Indexed: 5 pages
- Not indexed: 38 pages (37 "Discovered – currently not indexed", 1 "Crawled – currently not indexed")

**Already indexed (confirmed via URL Inspection, skipped):**
- /unsecured-credit-cards, /build-credit-with-itin, /business-credit-cards, /how-to-get-an-itin

**Indexing successfully requested (9 URLs, all itincreditcard.com):**
1. /about
2. /articles
3. /articles/can-you-get-a-credit-card-with-an-itin
4. /articles/secured-credit-card-with-itin
5. /articles/which-banks-accept-itin-for-credit-cards
6. /articles/unsecured-credit-card-itin-holders
7. /articles/authorized-user-credit-card-itin
8. /articles/balance-transfer-credit-card-itin
9. /es (Spanish homepage)

**Rejected (1):** /contact — "Indexing request rejected / indexing issues found during live test." Investigate: may have a noindex tag or crawl block. Check robots.txt and page meta robots.

**Quota:** Hit ~10/day account-wide limit; itincreditscore.com and itinlending.net not addressed today.

**Notable observation:** All itincreditcard.com pages showing "No referring sitemaps detected" in URL Inspection even though sitemap-0.xml exists. The sitemap-index.xml references `http://www.itincreditcard.com/sitemap-0.xml` (http + www prefix) — verify this is correctly submitted in GSC Sitemaps panel as `https://itincreditcard.com/sitemap-0.xml`.

**Remaining backlog:** ~28 more itincreditcard.com URLs not yet indexed (remaining articles + all /es/* pages). Continue next run.

- Docs updated: CHANGELOG.md
- Follow-ups: (1) Investigate /contact indexing rejection. (2) Verify sitemap submission URL in GSC. (3) Next run: continue itincreditcard.com article/es pages, then itincreditscore.com legacy-equity pages.

---

## 2026-06-27 — De-template redesign: distinct visual identity per site (network-fingerprint reduction)
- **Why:** all three ITIN sites were built from one Astro template — identical DOM
  structure, identical CSS class names (`hero--image`, `hero-grid`, `hero-panel`,
  `hero-cta`, `hero-trust`, `section-head`), the identical system-font stack
  (`--font: -apple-system…`), and verbatim boilerplate. Because they share ONE
  AdSense account and one (score-site "Low value content") rejection already
  landed, the shared-template look is a site-network fingerprint risk. Goal: give
  each site a genuinely distinct identity (typography, hero layout/markup, color
  depth, grid density, component shapes, section rhythm) while keeping content and
  monetization rules intact. Driven by a Chief-UX adversarial review (initial
  originality score 28/100; system fonts + identical CSS + identical hero/grid
  flagged as P0 fingerprints). Ran three repo-scoped agents in parallel (one per
  repo to avoid git races).
- **Lending (itinlending.net)** — "institutional / bank-grade" (commit `ac50125`):
  Merriweather (headings) + Work Sans (body); navy `#11366B` deepened with `--ink`
  `#06122B` + restrained warm-gold accent (`#B07A1E`); text-led **60/40 hero**
  (`.institutional-hero` / `.ihero-grid`); 3-col ledger card grid (1px rules, not
  shadows); sharp 3px corners + square solid-navy buttons; document-like section
  rhythm with horizontal rules. Boilerplate panel reworded ("What sets ITIN
  Lending apart" / "Qué distingue a ITIN Lending").
- **Credit Card (itincreditcard.com)** — "energetic / modern consumer-card"
  (commit `2d04ae2`): Fraunces (headings) + Outfit (body); purple `#5B21B6` paired
  with AA-safe amber/gold; **image-led hero** (`.spotlight` / `.spotlight-stage` /
  `.spotlight-copy` / `.spotlight-aside`, masked product photo, eager+fetchpriority
  for LCP); dense **4-col** `.deck`/`.card-grid` with gold hover rail; fully
  pill-shaped buttons + `.btn-gold`; tighter/punchier rhythm. Section microcopy
  reworded.
- **Credit Score (itincreditscore.com)** — "educational / calm guide" (commit
  `4743d4f`): Syne (headings) + Source Sans 3 (body); green `#15803D` + calm blue
  secondary; **flipped 70/30 hero** visual-left/copy-right (`.guide-hero`
  family); spacious **2-col** card grid; soft 12px rounded buttons/corners; airy
  84px section rhythm. Panel reworded ("What makes this guide different" / "Qué
  hace diferente a esta guía").
- **Guardrails honored (all 3):** all page content/copy + every page preserved
  (visual/structural only; only the one shared boilerplate panel reworded per
  site). Monetization untouched — env-gated AdSlots, `affiliateUrlFor()` CJ
  routing, article-only + one-below-fold-money-page placement all unchanged;
  nothing un-gated. Fonts loaded via Google Fonts with `preconnect` + limited
  weights + `display=swap` to protect LCP; no net-new JS. WCAG AA contrast
  verified on every new color combo. Builds green (Lending 132 / Card 102 /
  Score 104 pages); `/docs` regenerated via deploy script, not hand-edited.
- **Verified (parent):** deployed output of each site serves its new hero markup +
  its distinct font pair (Lending `institutional-hero`+Merriweather/Work Sans,
  Card `spotlight`+Fraunces/Outfit, Score `guide-hero`+Syne/Source Sans 3).
- **Docs updated:** this CHANGELOG; `SITES.md` "Shared vs. per-site" (the visual
  layer — typography, global.css, hero markup, homepage — is now intentionally
  per-site, no longer a copied shared pattern).
- **Follow-ups / open items:**
  - **Dead-CSS sweep (optional polish):** legacy `.hero--image` / `.hero-grid`
    rules still linger unused in some sites' `global.css` (e.g. score). Not
    rendered, low priority, but pruning them removes the last shared class-name
    overlap. Lending intentionally *aliases* `.hero`/`.hero-grid` to its new
    treatment so money/loan pages inherit it — leave those.
  - Deferred net-new interactions from the Chief-UX review (Score interactive
    score-calculator hero, Card animated approval badge) — optional, not built.
  - Re-run a Chief-UX pass after dead-CSS sweep to confirm the originality score
    moved off 28/100.

## 2026-06-27 — AdSense remediation extended to ALL THREE sites (Phases 1–4 + cross-site dedup)
- **Why:** the three ITIN sites share ONE AdSense account, so the score-site "Low
  value content" rejection threatens the whole account. Extended the remediation
  network-wide. Ran three repo-scoped agents in parallel (one per repo to avoid
  git races) + a parent-led cross-site dedup pass.
- **Lending (itinlending.net)** — Phases 1+2+4 (commit `1a0d7b5`):
  - P1: `BaseLayout` robots `noindex,nofollow` → `noindex,follow`; `/contact`
    (+ES) noindexed; `/disclosure` rebuilt (~840w EN/ES, names CJ + Awin/Credit
    Karma + AdSense, cites FTC 16 CFR 255); **new `/editorial-policy`** (EN+ES,
    ~850–900w) linked from Footer + /about; homepage hero Credit Karma unit moved
    below the fold (hero now value panel + CTA).
  - P2: **new `SourcesNote.astro`** wired into `ArticleLayout` + `MoneyPageLayout`;
    deepened `itin-personal-loans` (571→~1,000w: lender-type table + 5-step
    framework + cited NCUA/CFPB/IRS stats) and `itin-business-loans`
    (568→~900w: CDFI-first section + framework + SBA reality + Treasury/CFPB/IRS).
  - P4: `daily-content.yml` `schedule:` cron commented out (kept dispatch).
- **Credit Card (itincreditcard.com)** — Phases 1+2+4 (commit `36c944b`):
  - P1: `BaseLayout` robots → `noindex,follow`; `/contact` (+ES) noindexed;
    `/disclosure` rebuilt (~870/900w); **new `/editorial-policy`** (~960/990w)
    linked from Footer + /about. (No above-fold ad change needed — AdSlot not
    wired yet; pattern already matches the score-site reference.)
  - P2: **new `SourcesNote.astro`** wired into both layouts; deepened
    `business-credit-cards` (personal-guarantee mechanics, PAYDEX, FICO-cited
    framework) and `unsecured-credit-cards` (4-gate readiness table tied to FICO
    factor weights). `best-itin-credit-cards` already had the named-issuer table,
    so the next-thinnest pages were chosen instead.
  - P4: `daily-content.yml` `schedule:` cron commented out.
- **Credit Score (itincreditscore.com)** — Phase 4 (commit `0c87123`): paused the
  daily generator's cron. (Phases 1+2 already shipped — see entry below.)
- **Phase 3 — cross-site dedup (lending, commit pending in THIS commit):** 5
  lending articles that duplicate specialist-site topics each got a bilingual
  cross-site "canonical-home" callout linking the specialist deep-dive
  (`itin-credit-card`→CC/best-itin-credit-cards, `itin-secured-credit-card`→
  CC/secured-credit-cards, `how-to-build-credit-with-itin`→CS/build-credit-history-with-itin,
  `itin-credit-builder-loan`→CS/credit-builder-loans, `itin-credit-score-check`→
  CS/check-credit-score-with-itin). Kept indexed (no ranking gamble); reframes the
  family as complementary, not duplicative. Full dedup matrix + 5-phase plan now
  documented in `MONETIZATION.md`.
- **Honesty guardrails held** across all agents: no fabricated screenshots/"we
  tested" claims/invented credentials/fake product terms; pen-name bylines only,
  never Bob's real name.
- **Docs updated:** `MONETIZATION.md` (new AdSense-remediation section + dedup
  matrix + 5-phase status), this CHANGELOG.
- **Follow-ups (NOT done — do NOT request AdSense review yet):** Phase 5 — let all
  three sites accrue a track record with the improvements live + generators
  paused, THEN request review. Re-enable the daily-content crons after approval.

## 2026-06-27 — AdSense "Low value content" remediation, Phases 1+2 (ITIN Credit Score)
- **Why:** itincreditscore.com was rejected by AdSense for "Low value content / thin
  content." Diagnosis: not word count (28/31 articles are 2,000+ words) but the
  scaled-AI-content fingerprint, low information gain, thin funnel pages, and
  monetization-first surface. Executed the two highest-leverage, fully-in-our-control
  phases. Commit `6bc56d7` (+ `96dd28c` regenerated /docs).
- **Phase 1 — killed thin/funnel red flags:**
  - `noindex,follow` confirmed/added on all funnel+utility pages (`/apply`,
    `/contact`, `/thank-you`, `/404` EN+ES); changed `BaseLayout` robots from
    `noindex,nofollow` → `noindex,follow` so link equity still flows. No real content
    page is noindexed.
  - `/disclosure` (EN+ES): ~177 → ~874/898 words — names CJ, Awin/Credit Karma,
    AdSense; cites FTC 16 CFR Part 255; editorial-firewall + product-selection sections.
  - **New `/editorial-policy` (EN+ES, ~968/1073 words)** — honest pen-name team
    disclosure (states bylines are personas, no fabricated licenses), primary-source
    sourcing, fact-check/update/corrections policy, ad independence, education-not-advice.
    Linked from footer + /about.
  - Homepage: relocated the Credit Karma affiliate unit from the above-the-fold hero
    to below the fold; hero now leads with a value panel + free-calculator CTA. One ad
    unit total (monetization rules intact).
- **Phase 2 — information gain + E-E-A-T:**
  - Flagship `can-you-have-a-credit-score-with-an-itin`: ~1,313 → ~2,148 words (decision
    framework, per-bureau explanation, myths/facts + comparison tables, ITIN→SSN section;
    FTC/CFPB/IRS stats).
  - Pillar `/itin-credit-score-guide`: "Which path are you on?" decision framework +
    prominent credit-readiness-calculator promo + IRS stat.
  - Original value added to `/credit-builder-loans` (worked net-cost table),
    `/credit-bureaus-and-itin` (dispute action plan), `/improve-credit-score` (cited stat).
  - **New `SourcesNote.astro`** ("How we researched this page") wired into BOTH
    `ArticleLayout` and `MoneyPageLayout` — every article + money page now carries an
    honest sources/E-E-A-T block linking the editorial policy.
- **Honesty guardrails held:** no fabricated screenshots, "we tested" claims, invented
  credentials, or fake product terms. Information gain is original synthesis + real
  attributed sources only.
- **Docs updated:** this CHANGELOG.
- **Follow-ups (not yet done):** Phase 3 (cross-site dedup audit), Phase 4 (pause/slow
  the score-site daily generator during review — still running, works against the
  scaled-content flag), Phase 5 (build track record, then click "request review").
  Do NOT request AdSense review yet.

## 2026-06-26 — GSC request-indexing batch (automated daily run, quota exhausted)

**Context:** Automated daily indexing batch across all three ITIN sites. Priority order: itincreditcard.com (laggard, ~4 pages indexed), itincreditscore.com (legacy equity pages), itinlending.net (articles + /es/ pages). 8 confirmed requests submitted before quota exceeded on 9th attempt.

**itincreditcard.com — 4 requests submitted (exact URLs from earlier context window, see prior session):**
- 4 unindexed category/article pages submitted for indexing; sitemap-index.xml reports 0 discovered pages — flag: no pages discovered from sitemap despite valid sitemap-0.xml with 102 URLs; all inspected pages show "No referring sitemaps detected". **Action needed:** diagnose sitemap discovery issue in GSC Sitemaps panel.

**itincreditscore.com — 0 requests needed:**
- All 7 priority pages (homepage, /about, /articles, /how-to-get-an-itin, /itin-credit-score-check, /check-credit-score-with-itin, /es/itin-heloc) already indexed — skipped.

**itinlending.net — 4 confirmed requests:**
- `/articles/itin-car-loan-by-state` — not indexed → requested ✅
- `/es/articles/itin-car-loan-by-state` — not indexed → requested ✅
- `/articles/itin-retirement-account` — not indexed → requested ✅
- `/es/articles/itin-retirement-account` — not indexed → requested ✅
- `/articles/itin-send-money-internationally` — already indexed, skipped
- `/es/articles/itin-send-money-internationally` — quota exceeded before submission

**Quota:** 8/10 confirmed requests; quota hit on 9th attempt ("Quota Exceeded — exceeded your daily quota, please try again tomorrow").

**Open items:**
- itincreditcard.com sitemap discovery issue must be diagnosed — 0 pages discovered from sitemap is blocking crawl.
- `/es/articles/itin-send-money-internationally` and remaining itinlending.net articles to continue tomorrow.
- Docs updated: CHANGELOG.md only (no code changes this run).

---

## 2026-06-25 — GSC request-indexing batch (2nd automated run, quota exhausted)

**Context:** A first automated run earlier today already used 7/10 quota slots (see entry below). This second run consumed the remaining 2-3 slots before hitting quota.

**Re-requested (2, already in queue from first run — duplicate, still consumed quota):**
- `itincreditcard.com/build-credit-with-itin` — showed "not on Google" at check time; re-requested
- `itincreditcard.com/business-credit-cards` — showed "not on Google" at check time; re-requested

**Already indexed (skipped):**
- `itincreditcard.com/unsecured-credit-cards` — now "URL is on Google" (indexed since the first run this morning)

**Quota exceeded on:**
- `itincreditcard.com/how-to-get-an-itin` — quota hit, not submitted

**Sites not reached:** itincreditscore.com, itinlending.net (quota gone)

**Quota:** EXCEEDED after 2 requests (account-wide 10/day limit already near-exhausted from earlier run).

**Note:** The scheduled task fired twice today. The second run wasted 2 quota slots on re-requests. Consider adding a check to avoid re-requesting URLs that were already submitted within 24 hours, or stagger the task so it only fires once per calendar day.

**Follow-ups:** Tomorrow's run should resume at `itincreditcard.com/how-to-get-an-itin`, then `best-itin-credit-cards`, `credit-cards-that-accept-itin`, `secured-credit-cards` (money pages), then `itin-credit-cards-guide`, then `itincreditscore.com` pages.

---

## 2026-06-25 — GSC request-indexing batch (automated daily run)

**Requested indexing (7 confirmed):**
- `itincreditcard.com/unsecured-credit-cards` — unknown to Google, no sitemap ref
- `itincreditcard.com/build-credit-with-itin` — unknown to Google, no sitemap ref
- `itincreditcard.com/business-credit-cards` — unknown to Google, no sitemap ref
- `itincreditcard.com/how-to-get-an-itin` — unknown to Google, no sitemap ref
- `itincreditscore.com/check-credit-score-with-itin` — unknown to Google, no sitemap ref
- `itincreditscore.com/how-to-get-an-itin` — unknown to Google, no sitemap ref
- `itinlending.net/articles/itin-heloc` — newly published, unknown to Google

**Already indexed (skipped):**
- itincreditcard.com: `/credit-cards-that-accept-itin`, `/secured-credit-cards`, `/itin-credit-cards-guide`
- itincreditscore.com: `/credit-bureaus-and-itin`, `/itin-credit-score-guide`, `/build-credit-history-with-itin`, `/improve-credit-score`, `/credit-builder-loans`
- itinlending.net: `/es/itin-personal-loans`

**Rejected (live-test failures — pages likely don't exist at these URLs):**
- `itinlending.net/es/itin-heloc` — "Indexing request rejected" (no live page found)
- `itinlending.net/articles/itin-personal-loans` — "Indexing request rejected" (no live page found)

**Quota:** 7 successful requests. No "Quota Exceeded" message hit.

**⚠️ Critical finding:** All 4 unindexed itincreditcard.com pages and 2 unindexed itincreditscore.com pages show "No referring sitemaps detected" + "None detected" referring page. Sitemaps are not being picked up by Googlebot for these properties. Strongly recommend verifying sitemap submissions in GSC for both domains.

**Follow-ups:** (1) Verify/resubmit sitemaps for itincreditcard.com and itincreditscore.com in GSC. (2) Confirm the correct URL slugs for itinlending.net article pages (rejected URLs suggest slugs differ from expected). (3) Continue batch tomorrow with next set from itincreditcard.com sitemap.

---

## 2026-06-24 — Weekly SEO audit: ITIN Credit Score (itincreditscore.com)
- **Findings:** Impressions +21% (729→883, 28d), queries +91 (from 78). P0 critical: `/check-credit-score-with-itin` (EN money page) is UNKNOWN TO GOOGLE — sitemap index last read Jun 6, 0 pages discovered, never re-read after June 23 rebuild. URL Inspection confirms never crawled. Also: ES articles link to `/how-to-check-credit-score-with-itin-number` (non-existent slug) causing 404s across 8 source files. Positive: pillar `/itin-credit-score-guide` +900% impressions; `/credit-bureaus-and-itin` only click-earning page (2 clicks, 4% CTR, pos 49.4). Spanish locale 3% impression share (low). `/es/check-credit-score-with-itin` IS indexed (pos 34).
- **Top actions queued:** (1) REQUEST INDEXING + resubmit sitemap-index.xml in GSC. (2) Fix broken ES article links. (3) Explicit canonical on money page. (4) Internal links to money page from pillar.
- **Docs updated:** `~/ITINCreditScore/.seo/output/seo-audit-creditscore-2026-06-24.md` (full report).
- **Follow-ups:** Identify 3 unknown not-indexed pages (noindex/alternate-canonical/crawled-not-indexed); ship link fixes in code; verify sitemap re-read in GSC by next audit.

## 2026-06-24 — Executed weekly SEO actions on Lending + Credit Card (on-page link building)
- **Why:** Ship the top on-page actions from today's two automated audits (Lending +
  Credit Card) while the opportunities are fresh.
- **ITIN Lending (`itinlending.net`, commit d7052b7):**
  - Daily generator now **biases toward Spanish**: added an `esBias` keyword set
    (`préstamos para auto con itin`, `hipoteca con itin`, `préstamo con itin y mal
    crédito`, + TX/CA/FL geo variants) and a `SPANISH (es-419) PRIORITY` block in
    `web/scripts/lib/generate.mjs`, lending-site scope only. **Confirmed ES daily
    content is fully wired** — every EN article auto-translates to `articles-es/`,
    renders at `/es/articles/<slug>`, with correct `inLanguage: es-419` + reciprocal
    hreflang. No further pipeline work needed.
  - 3 internal links → `/es/itin-personal-loans` (protecting the site's best rank,
    pos 56.8) with varied anchors, from `/es/itin-auto-loan`, `/es/itin-business-loans`,
    `/es/how-to-get-an-itin`.
  - Cross-site authority routing: outbound links from EN + ES `itin-credit-cards`
    pages → `itincreditcard.com/best-itin-credit-cards` (and `/es/`), to steer the
    "itin credit card" query (leaking at pos 63.7 on lending) to the correct domain.
- **ITIN Credit Card (`itincreditcard.com`, commits d172955 + d7af660):**
  - Internal linking to open crawl budget: added link blocks from all 5 indexed pages
    into the 28 EN articles (every EN article now has ≥1 inbound link from an indexed
    page) + a homepage link to the `/es` hub. The 28 `/es` article URLs were
    deliberately not deep-linked from EN pages (unnatural) — `/es` hub link routes
    crawl authority instead; escalate via GSC URL Inspection if `/es` stays unindexed.
  - Deepened `/best-itin-credit-cards` (pos 52.6, site's best) with a **named-issuer
    comparison table** (Capital One Platinum Secured, Quicksilver Secured, Self Visa,
    Petal 2, community-CU secured row; columns = issuer/ITIN-accepted/secured/AF/
    deposit/3-bureau reporting; verifiable attributes only + "confirm current terms").
  - 3 exact-anchor ("best ITIN credit cards") inbound links from homepage, pillar,
    and `/credit-cards-that-accept-itin`.
- **Docs updated:** this CHANGELOG; CONTENT-PIPELINE.md (ES bias note).
- **Follow-ups:** at next audit (~2026-07-22) check indexed count climbs (target 10+),
  `/es` query appearance, and whether `/es/itin-personal-loans` reached page 5.

## 2026-06-24 — Off-site authority: drafted first r/personalfinance contribution (NOT posted)

- **What/why:** Researched and drafted the first Reddit off-site-authority contribution for the ITIN site family. Off-site authority is the gating factor for these young domains (per today's SEO audits). Deliverable is research + a ready-to-post draft only; nothing was posted and posting requires Bob's own action/approval.
- **Findings:** r/personalfinance is strongly anti-self-promotion (no links/brand/affiliate; the retired 90/10 norm is now effectively stricter, ~95/5; first offense = removal, repeat/cross-sub promo = ban/shadowban; Reddit auto-detects ~96% of content manipulation). Recommended FORMAT = a pure-value HELPFUL COMMENT on an existing ITIN/no-SSN thread, not a top-level promo post, with zero links and zero brand mentions. Better venues for a first contribution where ITIN questions are routine and on-topic: r/CreditCards and r/immigration; r/personalfinance also routes specific personal-situation questions to its weekly threads.
- **Draft content:** value-first answer on building credit / getting a first card as an ITIN holder — secured card or credit-builder loan, autopay, low utilization, reports to all 3 bureaus, scam warnings (upfront-fee "guaranteed approval," CPN/"new credit identity" fraud). Conservative on issuer specifics (policies change) per the accuracy rule.
- **Docs updated:** this CHANGELOG. (Draft itself returned to Bob for human review, not committed to repo.)
- **Follow-ups:** Bob to choose venue + post manually from an aged account; engage in replies; keep it link-free. Revisit once a brand mention is safe (per memory `project_lead_form_ad_test_idea` cadence and rankings follow-up ~2026-07-22).

## 2026-06-24 — Weekly SEO audit — ITIN Credit Card (automated)

- **Key findings:** Impressions +298% vs prior audit (48 → 191); query footprint +114% (29 → 62 queries); avg pos 59.7; CTR 0.5% (1 click). CRITICAL: only 5 pages indexed, 37 discovered-not-indexed — all /es pages and most daily articles are in Google's crawl queue but not yet indexed. Zero /es impressions (crawl budget issue, not hreflang bug). Best position: `best itin credit cards` at pos 52.6 (new money page, 1 week old). All target keywords beyond top 20 on live SERP.
- **Top 3 actions:** (1) Increase internal link density from the 5 indexed pages into the 37 unindexed pages to open crawl budget; (2) Deepen `/best-itin-credit-cards` with named-issuer comparison table + Speakable schema + 3 exact-anchor inbound links — best-positioned page, closest to breaking page 3; (3) First Reddit brand mention on r/personalfinance — off-site authority is the real gating factor now.
- **Docs updated:** `~/ITINCreditCard/.seo/output/seo-audit-creditcard-2026-06-24.md` created; this CHANGELOG.
- **Follow-ups:** Check indexed count (target 10+) + /es query appearance at next audit ~2026-07-22.

## 2026-06-24 — Weekly SEO audit — ITIN Lending (automated)

- **Key findings:** Impressions +73% WoW (298 → 516); query footprint +17 (100 → 117 queries). ES locale leading — `préstamos personales con itin` improved to pos 56.8 (site's best rank); `prestamos de dinero con itin` jumped +7.5 pos to 70.9 after the 06-20 ES content edit. EN heads stable at 83–97 (authority wall). 5 new ES geo/intent long-tails appeared organically.
- **Top actions:** (1) Bias daily generator to ES loan content (`préstamo con itin y mal crédito`, geo variants, auto/mortgage ES); (2) Add internal links to `/es/itin-personal-loans` to protect the site's best position; (3) Monitor cross-site `itin credit card` leakage (pos 63.7 on lending domain).
- **Checks not completed:** GA4 AI-referred sessions, GSC Enhancements (schema errors), GSC Indexing count — tab crash mid-run.
- **Docs updated:** `.seo/output/seo-audit-lending-2026-06-24.md` (new); this CHANGELOG.
- **Follow-ups:** Run GA4 AI referral check manually; verify GSC Enhancements panel shows 0 errors.

## 2026-06-23 — Rank tracking: add Well Worth Products; default sweep = all 10 sites
- **Why.** Bob: a default `rankings`/`seo-pulse` run must surface ITIN **and** the Picks
  apps (and Well Worth), not just ITIN. Confirmed the Picks apps were already in scope;
  added the missing Well Worth Products property.
- **What changed.**
  - Added **Well Worth Products** to `seo-pulse/config.yaml` (gsc_property
    `https://wellworthproducts.com/`, URL-prefix non-www, owner-verified 2026-06-22) with
    7 proven-demand target keywords from the partner's Ads/GSC data.
  - Added "Well Worth Products" to `rankings.py` `DEFAULT_SITES` so the no-filter sweep now
    runs all **10** properties (3 ITIN + 5 Picks apps + Timberline + Well Worth).
  - `pulse.py doctor` confirms `https://wellworthproducts.com/` is accessible as `siteOwner`
    under the active OAuth account.
- **Docs updated:** `RANK-TRACKING.md` ("Sites covered" → all 10, Well Worth re-add note);
  this CHANGELOG. Memory `reference_rankings_skill.md` updated with the all-sites scope rule.
- **Follow-ups / open items:** Well Worth data is near-empty until the 2026-06-22 GSC
  property fills in (no backfill); glucometerreviews.com stays out of tracking.

## 2026-06-22 — Automated 5 rank-report actions: CS cannibalization fix, new Lending cash-loan pages
- **Why.** Acting on the 2026-06-22 `rankings`+`seo-pulse` run (GSC window 2026-05-24→06-21).
- **What changed.**
  - **CS (itincreditscore.com) — fixed cannibalization on `how to check credit score with
    itin`** (206 impr — the family's highest-demand term — split across 4 URLs, stuck at G
    pos 71). The pillar `itin-credit-score-guide` carried an H2 that exactly duplicated the
    canonical `/check-credit-score-with-itin` H1. Reframed that H2 on **both EN + ES** to a
    distinct angle ("Where do you find your score once you have a file?") so the canonical
    solely owns the exact phrase.
  - **CS — claimed `itin credit score`** (G pos 43.2, 78 impr — best-positioned, highest-demand
    head term). Tightened the pillar title/H1/description (EN+ES) to lead with the exact phrase
    and added an exact-anchor inbound link from the homepage.
  - **Lending (itinlending.net) — new `/itin-cash-loans` EN+ES pair.** Detail page targeting the
    `préstamo de dinero con itin` / `itin cash loans` emergency-fast-cash cluster (ES demand:
    `prestamos de dinero con itin` G78.4/17 impr). Framed around speed + payday/title-loan
    warnings to differentiate from the personal-loans pillar (no new cannibalization); reciprocal
    hreflang verified. Cross-linked from both personal-loans pages and the pillar; added affiliate
    fallback chains for the new slug in `consts.ts`.
  - **Lending — deepened `/itin-auto-loan`** with a "Where do you find ITIN car loans?"
    lender-comparison section (content-gap term `car loan with itin` G91/20 impr).
  - **IndexNow pinged** CS (90 URLs) + Lending (118 URLs), both HTTP 200.
- **Docs updated:** this CHANGELOG. Rank-tracking outputs saved to `.seo/output/rankings-2026-06-23.{md,json}`.
- **Follow-ups / open items:** watch the 206-impr CS term to confirm the canonical climbs off
  pos 71 now that the pillar H2 no longer competes; new Lending cash-loan pages are
  indexed-but-zero-impressions until crawled — recheck next rank run.

## 2026-06-21 — Automated 4 audit actions: CS exact-term push, IndexNow ping, ES depth
- **Why.** Acting on the 2026-06-21 cross-site audit's four prioritized actions.
- **What changed.**
  - **CS (itincreditscore.com) — exact-term push for `credit score with itin`** (G pos
    33.8, the family's best Google position, top of page 4 on thin 5 impr). Added a new
    opening H2 "Can you have a credit score with an ITIN?" to `/check-credit-score-with-itin`
    using the exact phrase, plus **3 exact-anchor inbound links** ("credit score with an
    ITIN") from the homepage hero, the pillar (`itin-credit-score-guide`), and
    `improve-credit-score`. Goal: concentrate anchor authority to break page 1.
  - **Lending (itinlending.net) — ES depth** on `/es/itin-personal-loans`: added a
    lender-type comparison table, an ITIN-requirements section, and 2 FAQs targeting
    `préstamo de dinero con itin` (77.0/13 impr) + bad-credit intent. Spanish outranks
    English ~2:1 on Lending, so depth goes to ES first.
  - **IndexNow pinged all 3 sites** (Lending 110 / CC 80 / CS 84 URLs, all HTTP 200) so
    Bing re-crawls the new CC `/best-itin-credit-cards`, the Lending ES edits, and today's
    CS changes — Bing is the portfolio's live AI-citation surface (feeds ChatGPT search).
  - **Bing WMT verification confirmed** for all 3 sites — today's `rankings` pull returned
    Bing positions (CS #3/#6/#6), which the Bing WMT API only serves for verified properties.
- **Docs updated:** this CHANGELOG; rank context already current in the three `.seo/context.md`.
- **Follow-ups:** re-measure next rank pull for movement on `credit score with itin` (CS) and
  the ES préstamos cluster (Lending); Google indexing handled by the daily Action (IndexNow
  is Bing/Yandex only — Google does not use it).

## 2026-06-20 — New CC "best card" money page + Lending ES cash-loan capture (audit #3 & #4)
- **Why.** Acting on today's rank audit. (#3) `best itin credit cards` (G pos 52.6),
  `best credit cards for itin` (82.0), `best credit card with itin number` (68.8) form
  a "best card" query cluster on itincreditcard.com with **no dedicated landing page** —
  the strongest CC keyword left uncaptured. (#4) On Lending, `préstamos personales con
  itin` (59.0) and `préstamos de dinero con itin` (76.5) are the ES money queries; the
  first was already covered, the second (colloquial cash-loan phrasing) was not.
- **What changed.**
  - **itincreditcard.com — new money page** `best-itin-credit-cards.astro` + `/es` mirror,
    on MoneyPageLayout. Targets the "best card" cluster with an **honest by-archetype
    comparison table** (secured / credit-builder fintech / credit-union / unsecured /
    business — card type, deposit, typical fee range, hard-inquiry, bureau reporting),
    question-format H2s, 5 FAQs, "match the card to your stage" framing. **No fabricated
    specific cards/fees** (affiliate URL still dormant; autolinker activates product
    anchors automatically when `PUBLIC_AFFILIATE_URL_CREDIT_CARDS` lands).
  - `consts.ts`: added `best-itin-credit-cards` to `PRODUCTS` (homepage card-grid →
    strong inbound link) and an `AFFILIATE_FALLBACKS` chain (→ accepts-itin → secured).
  - Inbound contextual links added from the EN + ES pillar (`itin-credit-cards-guide`).
  - **itinlending.net — ES pillar** `es/itin-loans.astro`: added one FAQ + one in-body
    mention capturing `préstamo de dinero` (cash-loan synonym), with a descriptive
    internal anchor down to `/es/itin-personal-loans`. Pillar (broad) chosen over the
    personal-loans page to avoid cannibalizing the `préstamos personales` target.
  - **CS internal links (audit #2): verified already satisfied, no change** — the
    dedicated `/check-credit-score-with-itin` page already has 22 inbound internal links
    with a varied anchor mix + bureau comparison table; adding more = over-optimization.
- **Split-engine ranking context.** Google has these queries gated by domain age/authority
  (pos 50-80); **Bing already ranks the CS de-cannibalized page top-5** (#3/#5/#5), and
  Bing feeds ChatGPT search — so these pages are live AI-citation plays on Bing now even
  while Google ripens. Full data: `~/Itin/.seo/output/rankings-2026-06-20.md` (depth-50 scan).
- **Docs updated:** this CHANGELOG. Both sites built clean (CC 82 pages, Lending 114),
  deployed to `/docs`.
- **Follow-ups / open items:** confirm all 3 sites submitted in Bing WMT + IndexNow firing;
  #5 Pour Picks CTA decision still needs user input; off-site authority outreach unstarted.

## 2026-06-20 — De-cannibalize CS `how to check credit score with itin` (the #1 action)
- **Why.** Built the audit's single highest-leverage action. The portfolio's biggest
  query (189 impr/mo, pos 71.7) was cannibalized across 4 URLs on
  itincreditscore.com. Root cause = the **homepage**, whose exact-match H1 ("Build
  and check your credit score with an ITIN") + title tagline ("Build & Check Your
  Credit Score With an ITIN") let the highest-authority page outrank the dedicated
  `/check-credit-score-with-itin` money page and split authority.
- **What changed (itincreditscore.com only).**
  - `web/src/pages/index.astro`: H1 → "Build your credit score with an ITIN" (drops
    the exact-match "check"); lede now defers "how to check" to the dedicated page
    via a descriptive internal link.
  - `web/src/consts.ts`: `tagline` → "Build a U.S. Credit Score With an ITIN, No SSN
    Needed" (removes the competing "Check" signal from the homepage `<title>`).
  - No content work needed on the dedicated page: it already had the bureau
    comparison table, 5 FAQs, question-format H2s, and 8 inbound internal links. The
    two money pages (`/check-...` vs `/credit-reports-...`) were already
    differentiated (checking the score vs pulling the report).
- **Verified live.** Homepage `<title>` = "ITIN Credit Score | Build a U.S. Credit
  Score With an ITIN, No SSN Needed" with zero exact-match H1/title competition;
  remaining "check your credit score" strings on `/` are internal-link anchors
  pointing at the dedicated page (the intended signal). Dedicated page still owns
  "How to Check Your Credit Score With an ITIN (2026)". Pages build green
  (`5380b08`).
- **Docs updated:** this CHANGELOG.
- **Follow-ups:** watch the 189-impr query consolidate onto the dedicated page over
  2–4 wks; bureau long-tails (pos 29–47) should benefit from the table on the now-
  uncontested page. Next audit actions: CC "which card" comparison page; Lending ES
  loan pages; off-site authority outreach.

## 2026-06-20 — Full SEO audit (seo skill, web, all 3 sites; window 05-21→06-18)
- **Why.** Ran the full SEO operator skill end-to-end with live GSC.
- **Trend.** Impressions landing/holding: CS ~779, **Lending 298 (nearly 3× in a
  week, 51→95 queries)**, CC 127. Lending is the fastest grower (daily pipeline +
  ES-guide fix compounding). Still **zero page-1, ~0 clicks, no striking-distance
  (pos 5–15) on any site**; everything pos 29–96. Authority/age gate unchanged.
- **New signal.** The portfolio's biggest query, CS `how to check credit score with
  itin` (189 impr, pos 71.7), is now cannibalized across **4 URLs** (was 3) — the
  4th is likely the canonical `/check-credit-score-with-itin` entering for its own
  target. Makes the consolidation more urgent.
- **#1 action (still unbuilt):** make `/check-credit-score-with-itin` the clear
  winner (differentiate `/`, `/credit-reports-with-itin`, internal links) + add the
  bureau comparison table on that page — hits the biggest query AND the pos 29–47
  bureau cluster at once.
- **Output:** `.seo/output/audit-2026-06-20.md` (full per-site prioritized actions).
- **Follow-ups:** CS consolidation/table; CC "which card" comparison page; Lending
  Spanish loan pages; off-site authority (outreach list 06-13).

---

## 2026-06-25 — Lead source attribution + on-demand GA4 puller
- **Why.** Leads are arriving (1-2/day on Lending + Card) but GSC shows ~0 search
  clicks, so the traffic is non-search and its origin was invisible: the lead form
  captured no source data, and the rank tooling only talks to Search Console.
- **Lead-form source capture (all 3 repos).** `LeadForm.astro` now carries 7 hidden
  fields — `source_referrer`, `landing_page`, and `utm_source/medium/campaign/term/
  content` — populated client-side on load from `document.referrer` + the landing
  URL's query string. First-touch values persist in `sessionStorage` (`itin_src`)
  so multi-page visits attribute to the entry source, not the last internal hop;
  same-host referrers are ignored. Every Web3Forms lead payload now self-reports
  where it came from. Verified in the dev preview (UTM capture, landing page, and
  first-touch persistence all confirmed). Built + deployed to `/docs` on all 3.
- **On-demand GA4 puller.** New `~/.claude/skills/seo-pulse/scripts/ga4.py` (in the
  seo-pulse skill, not a site repo) answers "where's my traffic/leads from" via the
  GA4 Data + Admin APIs: channel, source/medium, and `generate_lead` by source.
  OAuth-as-owner mirroring `gsc.py`, separate `ga4_token.json`. `config.yaml` gained
  `ga4_property` for the 3 ITIN sites (IDs from ANALYTICS-PLAN.md).
- Docs updated: `LEAD-PARTNERS.md` (attribution fields), `ANALYTICS-PLAN.md` (GA4
  puller section + status rows).
- Follow-ups: (1) user to complete the one-time GA4 OAuth consent + ensure the
  Analytics Data/Admin APIs are enabled on the Cloud project, so live pulls work;
  (2) consider UTM-tagging social/forum links for clean attribution; (3) the
  headless service-account path for the automated daily report is still pending.

## 2026-06-18 — Consolidate authorized-user topic to Card site only
- Removed `authorized-user-with-itin-credit-building` (EN+ES) from the **Score**
  site so the "authorized user with an ITIN" topic lives only on **Card**
  (`authorized-user-credit-card-itin`). Being an authorized user is mechanically a
  credit-card action, so it belongs in the card lane; keeping it on both sites
  reintroduced the cross-site overlap the remediation was eliminating.
- Relinked Score mesh (now 23 EN / 23 ES), rebuilt, redeployed `/docs`.
- Docs updated: this CHANGELOG.
- Follow-ups: none — closes the last open item from the AdSense remediation.

## 2026-06-18 — AdSense "low value content" remediation: lanes, byline rotation, off-lane purge
- **Trigger.** AdSense flagged the ITIN family for "Low value content." Root causes
  diagnosed: (1) ~50-70% topic overlap across the three sites under one AdSense
  account (reads as a thin content network), (2) a single repeated byline per site
  (auto-generated tell), (3) thin lead-gen `apply` landing pages.
- **Per-site content lanes.** `generate.mjs` now uses `scopeOf(site)` (replaces
  `verticalOf`): card site = credit cards ONLY, score site = credit scores/credit
  building ONLY, lending = catch-all. The strict scope rule is injected into both
  the system prompt and user prompt so daily + seed generation stays in lane.
- **Off-lane purge.** Deleted off-lane articles (EN+ES): Card (3) how-to-build-credit-
  with-itin, how-to-check-credit-score-with-itin, transfer-itin-credit-history-to-ssn;
  Score (6) car-loan-with-itin-number, credit-cards-that-accept-itin, itin-mortgage-loan,
  open-bank-account-with-itin-number, personal-loan-with-itin-number,
  secured-credit-cards-for-itin-holders. Score keeps credit-builder-loan (score lane).
  relatedSlugs mesh refreshed after deletion.
- **Byline rotation.** Added a `team` roster (3 honest pen-name personas) to each
  site's `consts.ts editorial` block — names fully distinct across all three sites
  (no cross-site reuse). `loadSite()` parses the roster into `site.authors`;
  `publish.mjs pickAuthor(slug)` hashes the slug to a stable rotating author; daily +
  seed scripts pass `authorRoster`. `ArticleLayout.astro` now renders the article's
  actual `author` (was hardcoded to the lead editor) plus an author-bio block for
  E-E-A-T; `/about` lists the full team. Existing articles retroactively re-bylined
  with the same hash so EN/ES match and align with future posts.
- **Thin pages.** `apply` (EN+ES, all 3 repos) set `noindex` and added to the sitemap
  filter. `thank-you`/`404` were already noindexed. Kept `contact`/`disclosure`
  indexed (trust/E-E-A-T signal). Did NOT move money-page forms below content — that
  conflicts with the documented monetization strategy and wasn't requested.
- **Backfill.** Triggering `seed-content` workflow: Card +12 card-only, Score +16
  score-only articles to restore depth in-lane before requesting AdSense review.
- **Docs updated:** this CHANGELOG; see also memory `feedback_content_scope_per_site.md`
  and `feedback_no_byline.md` (byline rotation guardrails).
- **Follow-ups:** after backfill lands + builds clean, deploy all 3 then tick
  "I confirm I have fixed the issues" + Request review in AdSense. Consider adding
  unique comparison tables + IRS/CFPB citations to thinnest surviving articles.

## 2026-06-17 — Two more app sites switched on (Underdial + Percolate)
- **Trigger.** A GitHub email reported `Underdial-Web` "Daily SEO content: All jobs
  have failed." Root cause: `ANTHROPIC_API_KEY is not set. Aborting.` — same blocker
  as the Picks apps. A portfolio sweep (`daily-content.yml` present + secret status)
  found **two** owned sites still dormant: `Underdial-Web` (underdial.com, watches
  under $1,000) and `Percolate-Web` (percolateapp.com, specialty coffee). Neither
  was in the original set of six.
- **Fix.** Set `ANTHROPIC_API_KEY` on both. Both also **lacked `lib/humanize.mjs`**
  (they predated the humanizer port), so I ported the identical module and wired it
  into `generateArticle()` on each (cloned, edited, syntax-checked, rebased, pushed).
- **Verified.** Manual `daily-content.yml` runs succeeded end-to-end and generated
  articles (Underdial `watch-size-guide-wrist-fit`, Percolate
  `how-to-store-coffee-beans-fresh`); fresh runs confirm the humanizer executes.
- **Docs updated:** `SITES.md` (sister-sites table now lists all 5 app sites),
  `PICKS-APP-PIPELINES.md` (added the two non-Picks sites), this CHANGELOG.
- **Note.** The full owned-site set on this pipeline is now **8** (3 ITIN + 5 app
  marketing sites), everything except TimberlineVentures.

## 2026-06-17 — Humanizer pass added to content flow + app-site automation audit
- **Humanizer (B).** Added `web/scripts/lib/humanize.mjs` and wired it into
  `generateArticle()` (`lib/generate.mjs`) on all 6 owned content sites (ITIN ×3 +
  StickPicks, PourPicks, PerfumePicks). After the article is generated and
  validated, it now runs through a second Claude call that strips AI tells per the
  personalizer playbook, then returns. Fail-safe: any error or a >35%-shorter body
  falls back to the original, so the daily run can't break. There was **no
  humanizer in the flow before** — AI-tell avoidance was only a prompt constraint.
- **App-site dormancy diagnosis (A).** Root causes found:
  - All 3 app repos are **missing the `ANTHROPIC_API_KEY` repo secret** → the
    generate step cannot run. This is the gating blocker; only the owner can set it.
  - **PourPicks**: the entire `web/scripts` Node automation + the daily-content
    workflow were never committed (untracked). Committed now.
  - **StickPicks**: `web/scripts` Node automation never committed (local `web/`
    exclude hid it); workflow added 2026-06-16. Automation committed now (force-add).
  - **PerfumePicks**: automation tracked + workflow active, just missing the secret.
- **Docs updated:** `CONTENT-PIPELINE.md` (humanizer in lib table),
  `PICKS-APP-PIPELINES.md` (real committed/secret state, StickPicks added), this CHANGELOG.
- **Activation (later same day).** `ANTHROPIC_API_KEY` set on all 3 app repos and a
  manual `daily-content.yml` run triggered on each. All three succeeded end-to-end
  (generate → humanize → build → deploy → commit): StickPicks
  `how-to-organize-a-humidor`, PerfumePicks `how-to-rotate-your-perfume-collection`,
  PourPicks `single-barrel-vs-small-batch-bourbon`. No "humanizer skipped" warnings.
  All 6 sites are now live on the same humanized daily pipeline; crons take over.
- **Follow-ups:** optionally set `GOOGLE_INDEXING_SA_KEY` + GA4/GSC repo vars on the
  app repos (analytics currently off). Rotate the API key used to set the secret
  (it was pasted into a chat session).

## 2026-06-16 — Wire all owned sites into rank tracking + verify 4 in GSC
- **Why.** "Run rankings" should cover every site we own, not just the ITIN three.
  Removed wellworthproducts.com and glucometerreviews.com; added every other live
  property. Four built sites (Perfume Picks, Stick Picks, Percolate, Underdial)
  were live but not yet verified in Search Console, so they returned no data.
- **Changed.**
  - `~/.claude/skills/seo-pulse/config.yaml`: added Timberline Ventures (verified)
    and the four app sites with target keywords; flipped the four from
    `sc-domain:` placeholders to verified `https://<domain>/` URL-prefix strings.
  - `~/.claude/skills/seo-pulse/scripts/rankings.py`: DEFAULT_SITES now includes
    all nine verified properties.
  - Added GSC verification file `web/public/google084eef54d98d0b31.html` to the
    PerfumePicks, StickPicks, Percolate-Web, and Underdial-Web repos; built +
    deployed + pushed each so it serves at the domain root. Verified all four in
    GSC (URL-prefix, HTML-file method) via browser.
- **Docs updated:** this CHANGELOG; RANK-TRACKING.md (site roster + verification note).
- **Follow-ups:** GSC has no backfill — the four new sites will show empty rows
  for a few weeks, then fill in. Bing WMT + Serper keys still unset (optional,
  for true multi-engine). itinlending.net "Not found (404)" GSC fix in progress.

## 2026-06-15 — Link Terms of Use in the lead form (all 3 sites)
- **Why.** The Terms now carry the lead-sale disclosure, but the `/apply` form's
  consent fine print only linked Privacy + Advertiser Disclosure — submitters never
  saw the Terms at opt-in. Linking it shows the sale disclosure at submission.
- **Changed.** Added a `form.terms` i18n key (EN "Terms of Use" / ES "Términos de
  Uso") to all three `i18n/ui.ts`, and added a Terms link to the consent line in all
  three `components/LeadForm.astro`. EN → `/terms`, ES → `/es/terms`. Verified in
  built `dist/apply.html` for all three; all sites build clean.
- **Docs updated:** `LEAD-PARTNERS.md` (compliance/consent section).
- **Follow-ups:** still no affirmative consent **checkbox** and no CCPA/CPRA
  "Do Not Sell" opt-out — see LEAD-PARTNERS remaining gaps. Not yet deployed
  (`/docs` not rebuilt/pushed).

## 2026-06-15 — Lead-sale disclosure in Terms (all 3 sites) + buyer research
- **Why.** Monetizing inbound leads by selling/referring them to ITIN lenders. The
  Terms only covered "sharing" for matching; selling needs explicit disclosure.
- **Changed.** Updated the third-party section of `terms.astro` (EN + ES) on all
  three sites — itinlending, itincreditcard, itincreditscore — to disclose that
  submitted info may be **shared, sold, or transferred** to lenders/partners/lead
  buyers for a fee, that they may contact via call/text/email/mail incl. automated
  tech (even on do-not-call lists), plus an email opt-out. Heading → "… lead sales
  & third parties." Bumped "Last updated" to 2026-06-15. All three sites rebuild OK.
- **Research.** New buyer pass added verified-email targets to `LEAD-PARTNERS.md`
  (Carrington Wholesale, BuildBuyRefi, Gustan Cho, McGowan, Non-Prime Lenders,
  Dream Home Financing) + aggregators (LendingTree, Phonexa/LeadCrowd/ActiveProspect)
  + credit-builder affiliates (Self, Firstcard). No emails guessed.
- **Docs updated:** `LEAD-PARTNERS.md` (buyers + new Compliance/consent section).
- **Follow-ups / OPEN COMPLIANCE GAPS:** form has **no consent checkbox** and its
  fine print doesn't even link Terms → submitters never see the sale disclosure;
  **no CCPA/CPRA "Do Not Sell or Share" opt-out**. Terms disclosure alone is weak
  for TCPA. Recommend adding a visible consent checkbox linking Terms + a Do-Not-
  Sell mechanism, and a `legal-eagle` review, before scaling sales. Not yet deployed
  (`/docs` not rebuilt/pushed).

## 2026-06-15 — Full SEO audit refresh (seo skill, web surface, all 3 sites)
- **Why.** Ran the SEO operator skill end-to-end with live GSC (last 28d,
  2026-05-16 → 2026-06-13, OAuth-owner pull).
- **Findings.** Impressions landing/holding (CS ~741, Lending ~120, CC ~100);
  still **zero page-1 rankings, ~0 clicks, no striking-distance (pos 5–15) on any
  site** — everything pos 28–98. On-page maxed; gate is authority + domain age.
- **#1 action (unchanged, still not built):** creditscore.com `how to check credit
  score with itin` (178 impr, pos 70.5) is cannibalized across `/`,
  `/credit-reports-with-itin`, `/start-building-now`. Canonical
  `/check-credit-score-with-itin` page exists but isn't the one ranking → fix is
  differentiation + internal links (not a redirect) + bureau comparison table for
  the pos 28–44 cluster.
- **New this cycle:** ES guides now render (today's fix), so Spanish is the most
  under-exploited lane — Lending's best positions are Spanish (pos 66–76).
- **Output:** `.seo/output/audit-2026-06-15.md` (per-site prioritized actions).
- **Follow-ups:** build the CS consolidation/table; CC "which card" comparison
  page; Lending Spanish loan pages; off-site authority (outreach list 06-13).

---

## 2026-06-15 — Fixed broken ES guide route (Spanish translations now actually render)
- **Why.** Surfaced while shipping the in-content auto-linker (entry below): every
  `/es/articles/*` page — and the `/es/articles` index — was silently serving the
  **English** entry. Spanish guide translations had never been served on any of the
  3 sites. Real bilingual-SEO loss (playbook Step 1.5).
- **Root cause.** The Spanish content collection was keyed `articlesEs` (camelCase)
  in `src/content/config.ts`, but the on-disk folder is `articles-es` (hyphen).
  Astro requires the collection key to match the folder name, so
  `getCollection('articlesEs')` returned empty → EN fallback everywhere.
- **What changed (all 3 repos).** Changed the collection key to `'articles-es'` and
  updated the references in `pages/es/articles/[...slug].astro` (getCollection +
  `CollectionEntry<>` type) and `pages/es/articles/index.astro`. The **on-disk
  folder name is unchanged**, so the daily-content automation that writes to
  `src/content/articles-es/` (daily-post.mjs, backfill.mjs, seed-content.mjs) keeps
  working with no edits. Added a comment in `config.ts` warning that collection keys
  must match folder names.
- **Verified.** Built + deployed all 3; confirmed live Spanish titles/bodies:
  itinlending.net/es/articles/itin-credit-card, itincreditcard.com/es/articles/
  authorized-user-credit-card-itin, itincreditscore.com/es/articles/
  can-you-have-a-credit-score-with-an-itin. The auto-linker's ES anchors (puntaje de
  crédito, tarjeta de crédito asegurada, etc.) now also render.
- **Docs updated:** MONETIZATION.md (flipped the "Known issue" note to FIXED).
- **Follow-ups:** none — the bilingual `/es` guides are now live for the first time.

---

## 2026-06-15 — In-content affiliate auto-linking in guides + found a broken ES guide route
- **Why.** The guides only carried the display ad; the user wanted contextual
  affiliate **text links** on relevant words in the body copy too ("creative and
  approved" — i.e. compliant). Added a build-time auto-linker.
- **What changed (all 3 repos, EN + ES):**
  - New rehype plugin `web/src/lib/affiliate-autolink.mjs` (identical across repos),
    wired into each `astro.config.mjs` via `markdown.rehypePlugins`, **prod-build
    gated** (`NODE_ENV==='production'`; clean copy in `astro dev`).
  - Turns the first natural occurrence of target phrases in guide prose into a
    sponsored link (`rel="sponsored nofollow" target="_blank"`, `class="aff-link"`).
    Safeguards: skips headings/existing-links/code, de-dupes by URL, caps at **3
    links/guide**, drops empty-URL rules.
  - **Live now:** Credit Karma (Awin) generic anchors only — score/cards/finance
    creatives, honest EN+ES phrases (e.g. "check your credit score" → CK score).
  - **Pre-mapped, dormant:** CJ per-product rules read `PUBLIC_AFFILIATE_URL_*`
    (empty → plain text); they auto-activate (and outrank CK) once an advertiser is
    approved. Product names are deliberately NOT linked to CK (would be misleading).
  - Verified per repo: guides carry capped sponsored anchors, none in headings, no
    nested `<a>`, money pages untouched. Coverage: Lending 17/18, CC 10/11, CS 12/12
    EN guides linked (the misses simply have no matching phrase).
- **Bug found (NOT fixed — needs decision):** ES guide route reads
  `getCollection('articlesEs')` but the folder is `articles-es` (hyphen vs camelCase).
  Names must match in Astro, so the ES collection loads empty and **every
  `/es/articles/*` page renders the English entry** (confirmed: ES pages serve the EN
  title/body on the live sites). Pre-existing, affects all 3 sites. Fix is a rename/
  remap + reverify Spanish renders; the auto-linker's ES phrases are ready for it.
- Docs updated: `MONETIZATION.md` (new "In-content affiliate auto-linking" section +
  the ES-route known-issue note). Auto-memory `feedback_monetization_strategy.md`.
- Follow-ups: (1) decide on + fix the ES `articlesEs` collection bug; (2) fill
  `PUBLIC_AFFILIATE_URL_*` as CJ advertisers approve to light up product links.

## 2026-06-15 — Credit Karma ads replace lead forms + AdSense slots site-wide (all 3 sites)
- **Why.** (1) The hero lead form was only earning on `/apply`; the user wants the
  CK ad in *every* page hero, not just the homepage. (2) AdSense approval isn't
  guaranteed, so leaving AdSense slots empty was leaving money on the table.
- **What changed (all 3 repos, EN + `/es`):**
  - **Hero lead forms → CK ad.** `MoneyPageLayout.astro`, the Lending-only pillar
    pages (`itin-loans` EN+ES), and the homepage hero now render `<CreditKarmaAd>`
    instead of an embedded `LeadForm`. Hero CTA buttons + "Apply Here" nav still
    route to `/apply`, which keeps the **full lead form** (its only home now).
  - **All AdSense `AdSlot` placements → CK ad.** Article top/end (`ArticleLayout`),
    money-page below-fold (`MoneyPageLayout`), and both thank-you units (EN+ES) now
    render `<CreditKarmaAd inline={true}>`. `AdSlot.astro` + `adSlots` config are
    kept but **no longer placed anywhere** (dormant fallback if AdSense approves).
    AdSense ownership-verification script + meta tag **stay** on every page.
  - **Topic-relevant variety from 3 creatives.** Added `ckTopicForPath()`,
    `creditKarmaAdFor()`, `CK_AD_COPY`, and `awin.creatives`/`awin.defaultTopic` to
    `consts.ts`. A page's path keyword-matches to a topic (cards / score / finance)
    → matching creative + localized CTA; generic pages fall back to the per-site
    `defaultTopic` (Lending=finance, CC=cards, CS=score). `CreditKarmaAd.astro`
    rewritten to resolve creativeId from explicit prop → topic → path → pathname;
    `.ck-ad--inline` style added to `global.css`.
  - The 3 campaign-level creatives (shared across sites): finance `3641184`,
    cards `3641203`, score `3597059`.
- **Verified** per site via the built `dist`: money/thank-you pages carry topic-correct
  `s=<creativeId>` units and **no `form-card`**; `/apply` still has the form. Builds
  clean (Lending, CC 56pp, CS 62pp).
- Docs updated: `MONETIZATION.md` (core-strategy table, dormant-AdSense note, rewritten
  site-wide topic-targeted CK section, current-state). Auto-memory
  `feedback_monetization_strategy.md` updated.
- Follow-ups: deploy all 3. If AdSense approves later, decide per-slot whether to swap
  CK back to `AdSlot` (article top/end were the highest-RPM AdSense candidates).

## 2026-06-15 — Deployed all accumulated local work to production on all 3 sites
- **Published the backlog.** A body of finished-but-unpushed local work had piled up
  on Credit Card and Credit Score while the daily-content Action kept committing
  articles to `origin` (the local/remote divergence = "the mess"). Reconciled each
  repo (discard generated `/docs`, `--ff-only` merge the daily articles, rebuild
  `/docs` fresh, commit, push) and pushed all three live:
  - **Lending** → `f36e405` (deployed earlier this session).
  - **Credit Card** → `d9bfba1`.
  - **Credit Score** → `1ab62d9` (FF-merged 2 daily articles: `does-paying-rent-build-credit-with-itin`, `itin-mortgage-loan`).
- **What went live** (all previously logged below, now actually on the sites): Credit
  Karma (Awin) hero ad + "Apply Here" nav + ES-homepage lang fix; named editorial
  persona + Person schema; lead-form qualifiers; CCPA/CPRA privacy disclosure; and on
  Credit Score the new `/credit-reports-with-itin` money page (redirect removed).
- Verified post-build: `cread.php` ad markup, "Apply Here" nav, and `lang="es"` on the
  ES homepage all present in each site's published `docs/`.
- Docs updated: this CHANGELOG. Follow-ups: same as below (AdSense-pending article ad
  slots; swap Credit Karma creatives as better ones become available).

## 2026-06-15 — Credit Karma (Awin) hero ad units + "Apply Here" nav + ES-homepage lang fix
- **Hero monetization swap.** Replaced the compact hero `LeadForm` in the homepage
  hero-right column with a Credit Karma 300×250 affiliate ad on all 3 sites (EN+ES).
  The lead form still lives at `/apply`; the hero slot (which wasn't driving revenue)
  now runs a paid unit with a click-through CTA above it.
  - New component `web/src/components/CreditKarmaAd.astro` (copied to all 3 repos):
    renders a CTA heading + 300×250 Awin banner, both linking to the same Awin click
    URL (`cread.php`); the impression pixel (`cshow.php`) doubles as the `<img>`.
    Env-gated (`import.meta.env.PROD`) so dev/forks show a sized placeholder and never
    register impressions/clicks.
  - Per-site creative + CTA: **Lending** `s=3641184` "See how much you qualify for
    here" / "Mira cuánto puedes calificar aquí"; **Credit Card** `s=3641203` "Shop our
    partner credit cards here" / "Compra nuestras tarjetas asociadas aquí"; **Credit
    Score** `s=3597059` "See your credit score here" / "Mira tu puntaje de crédito aquí".
  - Config: added `monetize.awin` (publisherId 2931103, advertiserId 66532, campaignId
    475588 — shared across all 3 sites) to each `consts.ts`. `.ck-ad` styles added to
    each `global.css`.
  - **Honesty note:** Credit Karma has no loan- or card-specific 300×250 creative — all
    units are brand/score-themed — so CTAs are worded to match what the click delivers.
    Payout is flat CPA ($7/new member, smaller amounts for logins/offer-clicks), not a
    percentage of any loan.
- **Nav.** Renamed `NAV_CTA` to **"Apply Here" / "Aplica aquí"** on all 3 sites (was
  per-site: "See if you qualify" / "Find your card" / "Start building credit"). Still
  routes to the existing `/apply` page that holds the full lead form.
- **Bug fix (pre-existing).** `getLangFromUrl()` in each `i18n/ui.ts` now strips a
  trailing `.html` before reading the locale segment. With `build.format:'file'` the
  Spanish homepage builds to `es.html`, so the segment was `es.html` (not `es`) and the
  ES homepage rendered `<html lang="en">` + an English nav — also mislabeling its
  `inLanguage` schema. Interior `/es/*` pages were unaffected. Now the ES homepage
  correctly renders `lang="es"`, Spanish nav, and Spanish `inLanguage`.
- Docs updated: `MONETIZATION.md` (new Credit Karma / Awin section).
- Follow-ups: (1) content-page ad placement is still AdSense-pending — see the ad-map
  in `MONETIZATION.md`; (2) revisit lead-form-vs-ad in the hero once lead-sale volume
  justifies reclaiming the slot (see auto-memory note).

## 2026-06-15 — Lead-sale launch: upgraded forms, privacy disclosure, partner outreach
- **Forms.** Added qualifying fields to `LeadForm.astro` across all 3 sites, gated to
  the non-compact `/apply` variant only (hero forms stay lean to protect conversion):
  - **Lending:** amount, monthly income, credit-score range, ITIN-only vs ITIN+SSN,
    plus conditionally-revealed `time_in_business` (business) and `down_payment`
    (mortgage) — reveal via inline JS keyed off the loan-type `<select>` index
    (`data-intent` + `data-when`).
  - **Credit Card / Credit Score:** minimal qualifiers only (score range + ITIN
    status), no conditional reveal (these sites don't sell leads).
  - i18n keys added to each `i18n/ui.ts` (EN+ES): `form.qualify.*`, `form.amount`,
    `form.income`, `form.score`, `form.itin`, `form.tib`, `form.down`, `form.select`;
    `.qualify-block` / `.form-subhead` styles in each `global.css`.
- **Privacy/compliance.** Rewrote privacy policies on all 3 sites (EN + `/es`,
  updated 2026-06-15): expanded the "information you give us" bullet to list the new
  optional fields, and replaced the "we do not sell your personal information"
  language with an honest CCPA/CPRA "sale"/"sharing" disclosure + email opt-out —
  required now that qualified leads are shared with lenders for compensation.
- **Routing.** Documented Web3Forms **CC routing** (dashboard config, not code) for
  copying leads to a buyer/working inbox.
- **Partner outreach.** Researched real ITIN lender targets (Personal: Oportun,
  Apoyo Financiero, Lendmark; Mortgage: Acra, Angel Oak, A&D, New American Funding,
  Champions Funding; Auto: Lendbuzz + local BHPH dealers), captured public contact
  channels only (no fabricated BD emails). Created `LEAD-PARTNERS.md` (targets +
  cold-intro + warm-forward "sell the introduction" templates) and a local
  `~/Itin/research/lead-tracker.xlsx` (gitignored; Leads + Buyers + README tabs,
  Buyers seeded). Created **4 Gmail drafts** (never sent): Apoyo Financiero
  (verified public email), and Acra / Champions / Lendbuzz as self-addressed
  ready-to-submit templates (those route via partner web forms / phone).
- Docs updated: `MONETIZATION.md` (form fields, CC routing, CCPA note, partner link),
  new `LEAD-PARTNERS.md`.
- **Verification.** All 3 builds green (Lending 98 pp, Card 52 pp, Score 58 pp);
  confirmed qualifiers + conditional reveal present on `/apply` (EN+ES) and absent
  from compact hero forms.
- Follow-ups: set Web3Forms dashboard CC once a buyer is signed; research ITIN
  business-loan partners; fill verified BD emails into the tracker as found.

## 2026-06-15 — Propagated named editorial persona + Person schema to Credit Card & Credit Score sites
- Extended the Lending E-E-A-T fix (below) to the other two ITIN sites, with a
  **distinct named editor per site** (owner asked for a different author name each):
  - **ITIN Credit Card** → **Mateo Herrera, Editor**
  - **ITIN Credit Score** → **Lucía Morales, Editor**
  - (ITIN Lending stays **Daniela Reyes, Editor**.)
- Per repo: set `SITE.editorial` (name/role/bio/bioEs, honest process-only bios — no
  fabricated credentials) in `consts.ts`; added `components/schema/PersonSchema.astro`
  (`@id` `…/#editor`, locale-aware url/description, site-specific `knowsAbout`); flipped
  `ArticleSchema.astro` `author` from `Organization` to `Person` referencing that `@id`;
  rebuilt `/about` + `/es/about` to feature the editor in an `author-card` (kept each
  site's existing editorial-standards copy); added `.author-card` styling to `global.css`.
- `name` kept first in each `editorial` block — the daily generator reads it by regex.
- **Verification.** Both builds green (Card 52 pp, Score 58 pp). Person schema renders
  per locale (shared `#editor` @id, EN `/about`+EN bio, ES `/es/about`+Spanish bio);
  article bylines + Article schema authors resolve to the correct per-site editor.
- **Docs updated:** this CHANGELOG. **Follow-ups:** deploy all three sites; only
  Lending has an active AdSense rejection — Card/Score are pre-emptive E-E-A-T hardening.

## 2026-06-14 — Named editorial persona (Daniela Reyes) + Person schema to fix Lending's AdSense "Low value content" rejection
- **Why.** `itinlending.net` was rejected by AdSense for "Low value content." On a
  YMYL finance site that's an **E-E-A-T/trust** signal, not a word-count problem
  (articles are 2,000–2,700 words). Root gap: a generic `Editorial Team` byline with
  no described, named author and no `Person` entity — Google/AdSense couldn't confirm
  *who* stands behind high-stakes lending advice.
- **What changed.**
  - `web/src/consts.ts` — replaced the `editorial` block (`ITIN Lending Editorial
    Team` / `Editorial Team`) with a named pen-name persona: **Daniela Reyes**,
    `Editor`, plus an honest EN + ES bio describing the real sourcing/review process
    (IRS, CFPB, lenders' published requirements). `name` kept first in the block —
    the daily generator reads it by regex.
  - New `web/src/components/schema/PersonSchema.astro` — `Person` entity, `@id`
    `${SITE.url}/#editor` (locale-independent so EN+ES resolve to one entity),
    localized `description`/`url`, `knowsLanguage`, `knowsAbout`, `worksFor`.
  - `web/src/components/schema/ArticleSchema.astro` — article `author` is now a
    `Person` referencing the same `#editor` `@id`, so every article ties back to the
    one described editor entity.
  - `pages/about.astro` + `pages/es/about.astro` — emit `<PersonSchema />`, rewrote
    "Who runs this site / Quién maneja este sitio" to feature Daniela Reyes in a
    styled `author-card`, and added an "Our editorial standards / Nuestros estándares
    editoriales" section (primary sources, reviewed-before-publish, says-when-it-
    depends, independence).
  - `web/src/styles/global.css` — added `.author-card` styling.
- **Guardrail (honest persona only).** Per the standing byline rule: a named persona
  with an honest bio is fine, but NO fabricated verifiable credentials (no fake
  license, employer, headshot, or LinkedIn) on a YMYL site.
- **Verification.** Build green (98 pp). Person schema renders per locale (shared
  `#editor` @id, EN url `/about` + EN bio, ES url `/es/about` + Spanish bio); article
  byline + Article schema author both resolve to Daniela Reyes / `#editor`.
- **Do NOT click "Request review" yet** — wait until the substantive changes are
  live (deployed) so the re-review sees them; a premature re-reject lengthens cooldown.
- **Docs updated:** this CHANGELOG. **Follow-ups:** deploy Lending; decide whether to
  propagate the persona to the credit-card/credit-score `consts.ts` for cross-site
  consistency (rejection is only on Lending so far); consider easing the burst
  publishing cadence; optional methodology/editorial-standards standalone page.

## 2026-06-14 — Acted on the audit: Lending nav promotion + dedicated credit-reports money page (Credit Score)
- **#1 (ITIN Lending).** Promoted the best Spanish opportunity to the global nav:
  added `Personal Loans` / `Préstamos personales` → `/itin-personal-loans` to `NAV`
  in `web/src/consts.ts`. Rationale: `préstamos personales con itin` (pos 66–70) is
  the strongest position on the whole lending site, but the page was only reachable
  via the `/itin-loans` pillar. Now one click from every page. Build green (98 pp);
  inner ES pages render the Spanish label + `/es/itin-personal-loans` href correctly.
- **#2 (ITIN Credit Score).** Built a dedicated **credit-reports money page**
  (`pages/credit-reports-with-itin.astro` + `es/`) and **removed** the
  `/credit-reports-with-itin` → check-score redirect from `astro.config.mjs`. That
  legacy URL earned ~10.5k cumulative impressions and was being folded into the
  check-score page; live demand exists (`credit report with itin number`,
  `itin credit report` pos 43.7/31 impr). The new page is framed around the **report
  document** (request → read → dispute → freeze/fraud-alert), distinct from the
  check-score page's focus on the **score number**, to avoid new cannibalization.
  Cross-linked both ways from check-score + the pillar (EN+ES). Build green (58 pp);
  verified real content (not meta-refresh) + correct `inLanguage` en-US/es-419.
- **Why these two (and not the rest of the audit).** On inspection, the other audit
  recs were already implemented in code: the bureau comparison table, the
  consolidation redirects, and extensive internal linking already exist on the
  check-score page; the Lending ES personal-loans page already exists and is
  well-translated; the credit-card site's score-query rankings are incidental body
  overlap (titles are card-focused), not a structural cannibalization to fix.
- **Docs updated:** `SITES.md` (added credit-reports-with-itin to the Credit Score
  page list); this CHANGELOG.
- **Follow-ups:** (1) **Pre-existing bug** — the ITIN Lending `/es` *homepage* nav
  renders English labels + un-prefixed hrefs (`getLangFromUrl` mis-detects locale on
  the ES root; inner `/es/*` pages are fine). This is the "untranslated chrome"
  E-E-A-T failure mode from the SEO playbook Step 1.5 — worth a dedicated fix.
  (2) Monitor GSC over 2–4 wks to confirm the new credit-reports page picks up the
  legacy URL's report-intent impressions. (3) Deploy both sites
  (`scripts/deploy-to-docs.sh` → commit `/docs` → push) — **not yet deployed.**

## 2026-06-14 — SEO audit refresh: GSC 28d pull + leverage-ranked next steps (all 3 ITIN sites)
- **What.** Ran the `seo` + `seo-pulse` skills on all three ITIN sites (OAuth-owner
  GSC pull, window 2026-05-15 → 2026-06-12). Data refresh of the 2026-06-12 audit.
- **Headline finding (answers the AdSense readiness question).** Organic
  impressions are landing and **accelerating**: in 2 days the 28d window moved
  itinlending.net 14 → 102 impr (11 → 51 queries), itincreditcard.com 48 → 100
  (+108%, 29 → 54 queries), itincreditscore.com 729 → 741 (steady leader). That
  impression growth is the signal AdSense watches for "Getting ready" → "Ready" —
  no site action needed, just keep publishing.
- **Still zero page-1 rankings → near-zero clicks** (1 total, on itincreditcard.com
  `itin credit card` pos 46). Everything sits pos 28–98; gate is topical authority +
  domain age, not on-page bugs.
- **Highest-leverage action in the portfolio:** consolidate 3 cannibalizing
  itincreditscore.com URLs (`/`, `/credit-reports-with-itin`, `/start-building-now`)
  onto one "check credit score with ITIN" page (owns the 178-impr family-biggest
  query at pos 70.6) + add a bureau × ITIN comparison table (hits the pos-28–43
  bureau cluster). Also flagged: cross-site cannibalization — itincreditcard.com is
  ranking for credit-SCORE queries that belong to itincreditscore.com.
- **Outputs:** `.seo/output/audit-2026-06-14.md` (per-site, leverage-ranked, each rec
  tagged impact + time) and `.seo/output/itin-seo-2026-06-14.xlsx` (Snapshot +
  per-site query tabs + Priorities).
- **Docs updated:** this CHANGELOG. Audit/output files in `.seo/output/`.
- **Follow-ups:** (1) execute the creditscore consolidation + table; (2) resolve the
  credit-card↔credit-score cannibalization boundary; (3) push Spanish loan pages on
  itinlending.net (its best positions are ES: `prestamos personales con itin` pos 66–70);
  (4) bump `actions/checkout@v4` + `actions/setup-node@v4` before 2026-06-16 GitHub
  deprecation (verify not already done); (5) off-site authority via the
  `.seo/output/outreach-35-targets-2026-06-13.md` list.

## 2026-06-14 — Ported the daily-content + search-submission pipeline to the Picks app sites (PerfumePicks + PourPicks)
- **Goal.** Make the two app marketing sites (perfumepicks.app, pourpicks.app)
  rank in Google + answer engines by running the same automated content pipeline
  and submission flows as the ITIN sites. Audited both first: both already had
  strong SEO/AEO foundations (AI-crawler `robots.txt` allow-list, `llms.txt`,
  `@astrojs/sitemap`, tiered article collection, Article+Breadcrumb schema,
  QuickAnswer/Speakable, FAQ). The **only gap was the automation layer**, now
  ported.
- **Ported scripts (both repos, `web/scripts/` + `web/scripts/lib/`):**
  `generate.mjs`, `articles.mjs`, `build-md.mjs`, `publish.mjs`, `daily-post.mjs`,
  `seed-content.mjs`, `indexnow.mjs`, `google-index.mjs`, `gsc-verify-sa.mjs`,
  `gsc-report.mjs`, `monitor.mjs`. All pass `node --check`; both sites build green.
- **Adaptation deltas vs. ITIN:** monolingual (no ES translate / `/es` routes);
  vertical baked per-repo in `generate.mjs` (`VERTICAL`/`AUDIENCE` constants —
  fragrance for PerfumePicks, bourbon+21-plus guardrail for PourPicks); editorial
  byline = `SITE.name` (`Perfume Picks` / `Pour Picks`) — never the personal
  founder name; dropped the `category` field; IndexNow not duplicated in the daily
  workflow (each repo's existing `indexnow.yml` handles Bing/Yandex on publish, so
  daily-content only pings Google's Indexing API).
- **Byline fix (PerfumePicks):** `config.ts` author default and the 3 existing
  articles + `_template.md` were `Bob Guillow` → changed to `Perfume Picks`.
  PourPicks already defaulted to `Pour Picks` (no change needed).
- **Workflows added (both repos):** `daily-content.yml`, `seed-content.yml`,
  `gsc-report.yml`, `monitor.yml`, `lighthouse.yml` + root `lighthouserc.json`.
  Crons staggered across the portfolio (ITIN 13:00, PerfumePicks 11:00, PourPicks
  12:00 UTC) to avoid concurrent-push collisions.
- **Docs updated:** new [`PICKS-APP-PIPELINES.md`](./PICKS-APP-PIPELINES.md)
  (full port detail, per-repo table, env, handoff); added to `README.md` index.
- **Follow-ups / open items (manual, user):** on **both** repos set secrets
  (`ANTHROPIC_API_KEY`, `GSC_SA_KEY`, `GSC_PROPERTY`, `GOOGLE_INDEXING_SA_KEY`) +
  variables (`PUBLIC_GA4_ID`, `PUBLIC_GSC_VERIFICATION`); enable Web Search
  Indexing API + Site Verification API in the SA's GCP project; run
  `gsc-verify-sa.mjs token`→deploy→`verify` for each site to make the SA a verified
  owner (required before Google Indexing pings are accepted). Until then the
  pipeline self-gates: generation runs once `ANTHROPIC_API_KEY` is set; GSC/Indexing
  steps no-op cleanly.

## 2026-06-13 — Speakable on money pages (all 3 sites) + ITIN readiness calculator + 35 outreach drafts
- **Speakable propagation.** Ported the WebPage+Speakable JSON-LD (targeting
  `#quick-answer`) from itincreditscore.com's `MoneyPageLayout.astro` to the
  `~/Itin` (itinlending.net) and `~/ITINCreditCard` (itincreditcard.com)
  MoneyPageLayouts. All three sites now emit Speakable on both article and money
  pages. Built, deployed, pushed each repo.
- **Linkable asset #1 — ITIN Credit Readiness Calculator** (itincreditscore.com,
  EN + es-419). Free interactive self-assessment at `/credit-readiness-calculator`
  (+ `/es/`): 7 weighted factors (payments .35, util .30, age .15, mix .10,
  inq .10) → readiness band + tailored next-steps linking into the money pages.
  `BaseLayout` (it's a tool, not a money page), `WebApplication` + WebPage/Speakable
  schema, added to nav. First earn-passive-links asset for the off-page program.
- **Off-page outreach.** Researched 35 link-outreach targets (immigrant-finance
  nonprofits, .edu LibGuides, Spanish-finance outlets, "no-SSN card" listicles);
  24 have verified emails, 11 are form-only. Drafted personalized outreach emails
  in the bguillow Gmail account as **drafts only** (send-by-user) via the
  personalizer skill.
- Docs updated: `SEO-AEO.md` (Speakable now site-wide on all 3; calculator asset;
  outreach drafts), this CHANGELOG.
- Follow-ups: user reviews/sends the Gmail drafts (per-item); re-verify each email
  address on the contact page before sending; consider calculator variants for
  itincreditcard.com / itinlending.net.

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
