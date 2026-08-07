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

## 2026-08-07 — /es/conectar branded SMS redirect built + deployed
- New page `web/src/pages/es/conectar.astro` (commit `d4b1e3f`): the URL that
  goes in lead texts instead of the raw trkmcl.com tracking link. Fires GA4
  `affiliate_click` (network=marketcall, medium=`?src=` default `sms`) then
  forwards to `PUBLIC_MARKETCALL_PERSONAL_ES`; noindex; no-JS meta-refresh +
  button fallback; falls back to /es/apply if the env var is unset.
- Verified in build output: tracking link present 3× in `dist/es/conectar.html`
  (trailing-slash path is the usual redirect stub — check the extensionless URL).
- ⚠️ First deploy (`d4b1e3f`) silently FAILED: the postbuild link checker exits
  nonzero when a page's hreflang EN alternate doesn't exist, and piping the
  deploy script through `tail` masked the exit code — /docs was never updated.
  Fixed in `9988ffc` by adding the EN counterpart `web/src/pages/conectar.astro`
  (plain forward to /apply until an EN SMS-approved offer exists). Lesson for
  future agents: never pipe `deploy-to-docs.sh` through tail/head without
  checking `$?` — the link checker is a hard gate.
- Docs updated: `SMS-LEADS-PLAN.md` (marked built), this changelog.
- Follow-ups: awaiting Lidya's OK on Offline SMS for #350784 (message sent by
  Bob 2026-08-07) before any text goes out; then pull the qualifying lead list
  from Supabase (≥2026-07-15, tcpa_consent=true, allowed states).

## 2026-08-07 — SMS-to-old-leads plan (MarketCall link) drafted; NOT yet sendable
- Bob asked to text past lead-form submitters a "matched you with a lender"
  message with the MarketCall tracking link. Full plan written with two hard
  gates: (1) MarketCall must approve Offline SMS as a source on campaign
  #350784 (currently SEO-only; offer 9809 allows Offline SMS but new sources
  need pre-launch review — ask Lidya), and (2) only leads submitted on/after
  2026-07-15 with `tcpa_consent=true` (the date the express-consent checkbox
  shipped, commit f56f9b1) may be texted — earlier leads had fine-print implied
  consent only and are permanently off the SMS list (TCPA $500–$1,500/text).
- Proposed copy rewritten: "we have matched you with a lender" is deceptive
  (UDAP/UDAAP risk with a vulnerable audience); truthful ES/EN drafts + STOP
  opt-out + quiet hours + logging requirements are in the plan.
- Link mechanics: branded redirect page on itinlending.net firing GA4
  `affiliate_click` (medium=sms) before forwarding to the tracking link — no
  raw trkmcl.com links in texts. Sending: manual from Bob's phone at this
  volume (~10–15 qualifying leads); explicitly NOT Twilio/10DLC (lead-gen SMS
  is carrier-restricted content).
- Docs updated: `SMS-LEADS-PLAN.md` (new), this changelog.
- Follow-ups: message Lidya (add SMS source + name an EN offer accepting SMS);
  build redirect page; query Supabase for the qualifying list.

## 2026-08-07 — FIX: MarketCall ES swap was NOT actually live — env var missing from `web/.env`; rebuilt + redeployed with link baked in; `affiliate_click` events now carry a `network` param

**The bug:** commit `7304e59` ("deploy: MarketCall ES swap LIVE") shipped **no rebuilt
HTML** — it only touched `docs/rss.xml`, docs, workflow, and OG images. Root cause:
`PUBLIC_MARKETCALL_PERSONAL_ES` was added to the **CI** env (`daily-content.yml`) but
never to **`web/.env`**, so the local build that was deployed rendered the dormant
state (no `trkmcl.com` link anywhere in `/docs`). Live-site curl confirmed 0 matches.
Lesson reinforced: *verify live state before claiming done* — the prior session's
"verified in the output" claim was false.

**The fix:**
- Added `PUBLIC_MARKETCALL_PERSONAL_ES=https://trkmcl.com/wy8om1m43k/z41kkw99nm`
  (campaign #350784) to `web/.env` with a comment that it must match the CI env block.
- Rebuilt + deployed. Verified in `/docs`: link present on `es.html` (homepage form),
  `es/apply.html`, `es/itin-personal-loans.html`, `es/itin-cash-loans.html`; **zero
  occurrences on EN pages**. Note: `es/itin-loans.html` (pillar guide, BaseLayout)
  intentionally has no direct link — its CTAs funnel to `/es/apply`, which swaps.
- **Click tracking (Bob's ask):** the existing delegated `affiliate_click` GA4 event
  already fires on every `rel="sponsored"` click (MarketCall anchors carry it).
  Enhanced `Analytics.astro` to add a `network` param (`marketcall` when the href
  contains `trkmcl.com`, else `cj`) so MarketCall vs CJ clicks separate cleanly in
  GA4. MarketCall's own dashboard (campaign Stats tab) remains the source of truth
  for clicks → qualified leads → payout.
- Docs updated: this file; `LEAD-PARTNERS.md` MarketCall entry corrected (campaign
  #350784 + live link; #350598 was the earlier attempt).
- Follow-ups: fold `affiliate_click network=marketcall` into the daily 6 AM report;
  Lidya approval still gates (a) email traffic to old leads, (b) sister-site sources.

**Campaign #350906 CREATED + SUBMITTED same session** (Bob present, approved):
"itincreditscore.com ES credit repair - SEO" on offer 7618 (Spanish Credit Repair,
$20/95s call). Tracking number **(844) 833-2056** rented + attached; promo material
#91538 (itincreditscore.com/es/) in Manager Moderation; campaign state Moderation.
When approved: build ES credit-repair content on the score site around that number
(call hours to display: M–F 10am–9pm, Sat 10am–5pm ET; Spanish-speaking callers).

**English expansion finding — MarketCall's EN loan offers do NOT allow SEO traffic.**
Checked every English personal-loans CPL offer's Allowed Traffic (sources) tab:
9963 Personal Loans = Social only; 12648 Personal Loans (II) = Social only;
12682 Personal Loans 5k = Paid Search + Social; 11677 Personal Loans 10k = Social
only. English debt-settlement calls: 8449 Bundle 10k = Social only AND paused
7/3; 12816 Debt 10K 90s ($61/call) = Paid Search + Social, "No Spanish callers."
⚠️ The offer *Rules* text sometimes says "all except incentivized" but the
**sources tab / campaign form is the authority** (9963 proved it). So: no EN
MarketCall campaign is possible on our approved SEO model today. Paths: (1) ask
Lidya to whitelist SEO on an EN personal-loans offer (our SEO-only ES approval is
precedent) — RECOMMENDED, add to the existing thread with the email question;
(2) optionally submit an EN campaign declaring Social and distribute via the ITIN
social accounts (itin-social skill) — low volume but legit; (3) "Offer request"
form asking for EN personal loans w/ SEO. Spanish offers 9693 & 9962 are other
Spanish Personal Loans merchants — possible ES diversification later.

**Offer intel gathered same session (for next campaigns):**
- **Email is NOT an allowed source on either offer** (checked Allowed Traffic tabs
  in-dashboard): offer 9809 (Spanish Personal Loans) allows SEO / Paid Search /
  Native-Display / Social Media / Offline SMS; offer 7618 (Spanish Credit Repair)
  allows SEO / Social Media only. Emailing old leads the tracking link would
  violate offer rules → voided earnings. Ask Lidya for an email-allowed path.
- **Offer 7618 Spanish Credit Repair** (for itincreditscore.com): $20/target call,
  95s min, M–F 10am–9pm + Sat 10am–5pm ET, 20 calls/day test cap, concurrency 8,
  7-day hold, repeat callers unpaid, qualified = Spanish speaker seeking credit
  repair, **pre-approval: all creatives must be approved before launch**. Campaign
  creation reached the form (name, SEO source, phone-number provisioning, promo
  material) but the agent's permission layer blocks form entry on MarketCall in
  autonomous mode — **Bob must be present (approve prompts) or fill the form**.
  Note: a Calls campaign also needs ES credit-repair content on the score site
  carrying the provisioned tracking number — content task, not just a dashboard task.

## 2026-08-07 — GSC request-indexing: **10 URLs requested, evenly split (score 4 / card 4 / lending 2)**; quota refused on the 11th; **no 8/6 run was ever logged**, which is why quota was available; card's 41-day-stale `/articles` hub finally pushed

Daily scheduled request-indexing run (`itin-gsc-request-indexing`). Chrome/GSC auth was
available (`bguillow@gmail.com`, all three Domain properties reachable). **10 URLs
successfully request-indexed**; the 11th returned **"Quota Exceeded — please try
submitting this again tomorrow,"** which is the normal daily ceiling, not an error.

**Per-site split: itincreditscore.com 4 / itincreditcard.com 4 / itinlending.net 2.**
This is the most balanced run so far and was deliberate — see "Allocation" below.

### Why there was quota today (and a gap in the record)

There is **no 8/6 request-indexing entry in this changelog** — the run either did not
fire or did not complete. That 24h of unspent quota is what made today's 10 possible,
and it incidentally broke the self-perpetuating truncation described in the 8/5 entry
(a full-spend day pushes the next day's earliest availability later). The 8/5
recommendation to **add a second afternoon fire window** still stands; it is the fix
that does not depend on a run being skipped.

### Requested today (all verified by screenshot as "Indexing requested")

| # | Site | URL | State before |
|---|---|---|---|
| 1 | score | `/articles/self-employed-itin-credit-score` | URL unknown to Google |
| 2 | score | `/es/articles/self-employed-itin-credit-score` | URL unknown to Google |
| 3 | score | `/articles/late-payment-on-credit-report-itin-holders` | Discovered – not indexed |
| 4 | score | `/es/articles/late-payment-on-credit-report-itin-holders` | Discovered – not indexed |
| 5 | lending | `/es/articles/itin-mortgage-bad-credit` | URL unknown to Google |
| 6 | card | `/articles` (**hub**) | Indexed, last crawled **2026-06-27 (41 days)** |
| 7 | card | `/es/articles/store-credit-card-with-itin` | Discovered – not indexed |
| 8 | card | `/es/articles/improve-credit-card-approval-odds-itin` | Discovered – not indexed |
| 9 | card | `/es/articles/itin-credit-card-credit-bureau-reporting` | Discovered – not indexed |
| 10 | lending | `/articles/itin-business-loan-lenders` | URL unknown to Google |
| — | lending | `/es/articles/itin-business-loan-lenders` | **REFUSED — Quota Exceeded** |

### Allocation reasoning

- **Tier 1 (fresh content, all three sites) took items 1-5.** Everything published in the
  last 10 days that was not yet indexed. Note item 5: the EN twin
  `/articles/itin-mortgage-bad-credit` was already `Submitted and indexed` (crawled 8/6)
  while its ES twin was still `unknown to Google` — the EN/ES split on the same article
  keeps recurring on lending.
- **Item 6 is a deliberate deviation from "skip URLs already on Google."** It acts on
  follow-up #3 from the 8/5 entry: card's `/articles` hub had not been crawled since
  Jun 27 (**41 days**), so the ~49 articles it links to have no live referring page. One
  request that refreshes the link graph for 49 articles beats one request per article.
  Worth re-checking its `lastCrawlTime` in a few days to see whether hub requests
  actually move the crawl date — if they do, this becomes a standing tactic and the
  other two hubs (lending `/articles` 19 days, score `/articles` 20 days) follow.
- **Tier 2 was interleaved card-then-lending rather than run per-site**, so the site that
  got starved would be the one holding the *lowest-value* remainder. Card led Tier 2 this
  run (lending led on 8/4); score is next to lead.

### Verified queue for tomorrow (ordered — start here)

Built from a live URL Inspection API sweep of all three sitemaps this morning (83 URLs
probed, `lastmod >= 2026-07-24` plus all hubs), so these states are current, not from
GSC's ~11-day-stale Pages report:

| # | URL | State |
|---|---|---|
| 1 | `itinlending.net/es/articles/itin-business-loan-lenders` | unknown — **refused today, do first** |
| 2 | `itinlending.net/articles/itin-manufactured-home-loan` | URL unknown to Google |
| 3 | `itinlending.net/es/articles/itin-manufactured-home-loan` | URL unknown to Google |
| 4 | `itincreditscore.com/articles/read-dispute-credit-report-itin-bureau-by-bureau` | URL unknown to Google |
| 5 | `itincreditscore.com/es/articles/read-dispute-credit-report-itin-bureau-by-bureau` | Discovered – not indexed |
| 6 | `itinlending.net/articles` (hub) | indexed, crawled 7/19 (19 days) |
| 7 | `itincreditscore.com/articles` (hub) | indexed, crawled 7/18 (20 days) |
| — | `itincreditscore.com/es/articles/itin-credit-score-check-every-method-2026` | **pending 8/4 request — do NOT re-request** |

Anything published on 8/7 (Friday is a publish day on all three sites) outranks this list
under Tier 1 — the newest `lastmod` anywhere at run time was still 8/5, so today's content
had not shipped yet when the sweep ran.

### Method notes (additions to the 8/5 notes)

- **After switching properties, the first click on the inspect bar is always swallowed.**
  A batch of `navigate → click → click → type` reliably types into nothing: the bar looks
  focused but is not. Cost one wasted round trip per property switch (3 today). Reliable
  pattern: navigate, wait 8s, then a **separate** call that clicks twice and types, and
  **screenshot to confirm the text is in the bar before pressing Return.**
- The venv matters: run inspection scripts with
  `~/.claude/skills/seo-pulse/.venv/bin/python`, not bare `python3` — the system python
  has no `googleapiclient` and every probe fails with a misleading `No module named`
  error rather than an auth error.
- `ThreadPoolExecutor(max_workers=12)` finished 83 inspections in well under a minute;
  one URL timed out and needed a single re-probe. Threading is essential (see 8/5).
- The dismiss-toast "Dismiss" link shifts by a few pixels between pages (y≈447-450);
  screenshot-confirm the toast is gone rather than assuming the click landed.

**BACKLOG NOT CLEARED — keep this task enabled.**

- Docs updated: this entry.
- Follow-ups / open items:
  1. **Add a second daily fire window (~3:00 PM ET) to `itin-gsc-request-indexing`.**
     Carried from 8/5, still the top item. Changing the task's own schedule is outside a
     run's remit, so this needs Bob or a task that owns scheduling.
  2. **Investigate why no 8/6 run is logged.** Either it never fired or it died before
     writing the changelog. Worth a look at the scheduled-task history — a silently
     skipped run is indistinguishable from a quota-refusal day in the record.
  3. **Resubmit `itinlending.net/sitemap-0.xml` in GSC → Sitemaps.** Carried from 8/4 and
     8/5, still not done. Left for a human or a task that owns sitemap writes.
  4. **Re-check card `/articles` `lastCrawlTime` in ~3 days** to test whether hub
     request-indexing actually refreshes the link graph (see Allocation above).
  5. Two card targets still have no `/articles/` counterpart and need a human decision
     (retarget or delete): `/how-to-build-credit-with-itin`,
     `/transfer-itin-credit-history-to-ssn`. Carried from 8/2, 8/3, 8/4, 8/5.
- Nothing committed or pushed; no site changes made.

---

## 2026-08-04 — www HTTPS cert fix + trailing-slash redirect stubs (all 3 sites)

Root cause of the MarketCall campaign rejection ("url is not working"): two
separate URL-spelling failures, both now fixed.

- **www.itinlending.net had no HTTPS.** A www CNAME now exists in DNS (points at
  the apex; sister sites point at `bguillow-rgb.github.io` — both route to Pages
  correctly), but GitHub's cert was provisioned before the record existed, so it
  covered `["itinlending.net"]` only — www worked on HTTP (301 → apex) and
  failed TLS. Sister-site certs cover apex + www. Fix: removed and re-added the
  custom domain via the Pages API (`PUT repos/bguillow-rgb/itinlending/pages`
  with `cname: null` then `cname: itinlending.net`) to retrigger provisioning —
  the GitHub-documented remediation. This produced two commits on main
  ("Delete CNAME"/"Create CNAME") — expected, harmless. Verify with
  `gh api repos/bguillow-rgb/itinlending/pages` → `https_certificate.domains`
  must list both apex and www.
- **`/es/` (and every trailing-slash URL) 404'd on all three sites.**
  `build.format: 'file'` emits `es.html`, and GitHub Pages only serves `/es/`
  from `es/index.html`. Evaluated switching to `build.format: 'directory'` and
  rejected it: Pages would then 301 every slash-LESS URL to the slash form — a
  sitewide URL migration of everything indexed in GSC, mid-backlog. Instead:
  new `web/scripts/gen-trailing-slash-stubs.mjs` (chained into npm `postbuild`
  before check-links, so CI's deploy-to-docs.sh gets it too) writes a
  `foo/index.html` noindex + canonical + meta-refresh stub next to every built
  `foo.html` — same pattern as the legacy WordPress stubs in `public/`, which
  are never overwritten. Canonicals, sitemap, and indexed URLs are untouched.
  Shipped to all three repos (itinlending, itincreditcard, itincreditscore).
- Docs updated: `ARCHITECTURE.md` (build-config bullet + stub mechanism, with
  the do-not-switch-to-directory warning), this changelog.
- Follow-ups: resubmit the MarketCall campaign URL once www HTTPS works.
  **REQUIRED, blocked on Bob's secureserver login:** change the itinlending
  www CNAME value from `itinlending.net` to `bguillow-rgb.github.io` at the
  secureserver reseller (plid 1592) — a 30-min watch confirmed GitHub will NOT
  add www to the cert while the CNAME targets the apex (sister sites use the
  github.io target and their certs cover www). After the DNS edit, re-run the
  remove/re-add of the custom domain via the Pages API to retrigger
  provisioning, then verify `https://www.itinlending.net` returns 301 → apex.

---
## 2026-08-06 — Link Engine responder: 2 drafts created (Well Worth cleaning, Posh Lifestyle brand feature)

Daily expert-source run. Swept 8 unique digests from the last 24h (SOS x2, HARO x3,
SourceBottle x3; ~60 opportunities total, several digests duplicated across bob@ and
info@). Two qualified and are drafted in Gmail, unsent:
- **Yahoo Creators / Ann Dunning** — vinegar + baking soda sink method, wants cleaning
  experts. Pitched from the Well Worth Products bucket (working-with framing, no
  chemistry credentials claimed). Deadline **3:00 AM ET Aug 7** — tightest one.
- **Posh Lifestyle & Beauty Blog / Carla Snuggs** — "Small Brands, Big Ideas" founder-led
  brand feature. Submitted Pour Picks + Perfume Picks. Deadline **Aug 11**.

Flagged for Bob rather than drafted: **Parade rum roundup** (best rums under $30, deadline
Aug 10/11) — spirits bucket but needs Bob's own bottle picks, and drafting them would mean
inventing tasting experience; **NerdWallet "deinfluencing"** (deadline 5 PM ET Aug 6) —
explicitly prefers non-AI answers and standing is thin (general consumer spending, not ITIN).

- Docs updated: this changelog only (no system/process change).
- Follow-ups: both drafts contain bare domains, not `https://` links, because of the
  Gmail URL-wrapper block — Bob should confirm links look right in the compose window
  before sending. Nothing committed or pushed.

### 2026-08-07 correction — connector drafts rejected, rebuilt in browser compose

Bob flagged the two connector-created drafts as unusable (wrapped links, missing To).
Both were rebuilt from scratch in the Gmail browser compose editor (typed natively, so
nothing gets wrapped), with a humanize pass on the copy first:
- "Cleaning experts query - what vinegar and baking soda actually do in a sink" →
  reply+67f8...@helpareporter.com, from bob@timberlineventuresllc.com. NOTE: the query's
  3:00 AM ET Aug 7 deadline has now passed; Bob's call whether to send late.
- "Small Brands, Big Ideas - Pour Picks and Perfume Picks (solo founder, Timberline
  Ventures)" → reply+f4ae...@helpareporter.com. Deadline Aug 11, still open.
Both verified via connector readback: To/From/subject/body correct, zero google.com/url
wrappers. The old connector drafts no longer exist (already deleted).

**Process change (also written to auto-memory gmail-draft-url-wrapping):** the responder
task must NEVER save outreach drafts through the connector create_draft again — browser
compose only, humanize before composing, verify the saved draft before reporting.
- Follow-up: update the link-engine-responder scheduled-task SKILL.md step 4 to point at
  the browser-compose procedure instead of create_draft.

## 2026-08-05 — GSC request-indexing: **ZERO requests — quota refused on the first attempt of the day**; yesterday's 6 lending requests all **indexed within 24h**; new finding: **the article hub pages are barely being crawled** (card `/articles` last crawled Jun 27, 39 days)

Daily scheduled request-indexing run (`itin-gsc-request-indexing`). Chrome/GSC auth was
available (`bguillow@gmail.com`, all three Domain properties reachable). **0 URLs
request-indexed.** The very first `REQUEST INDEXING` click of the day returned
**"Quota Exceeded — you've exceeded your daily quota. Please try submitting this again
tomorrow."** Nothing was spent, and nothing was lost to duplicates — there was simply no
quota to draw on.

**Per-site split: itinlending.net 0 / itincreditcard.com 0 / itincreditscore.com 0.**

### Why the quota was empty — and why yesterday's "fire earlier" advice was backwards

The cap is a **rolling ~24h window pinned to the timestamps of the individual requests**,
not a calendar-day allowance that resets at midnight. Yesterday's run spent all 11 over a
span starting mid-run; today's run reached its first request at roughly the same
wall-clock offset, i.e. just *before* the oldest of those 11 aged out.

This makes the truncation **self-perpetuating**: a run that spends its quota between T and
T+40min sets the next day's earliest availability to T+24h, so a next-day run that starts
at T is always at or behind the boundary, and every full-spend day nudges the boundary
later. Yesterday's follow-up #4 proposed *shifting the fire time earlier* as the durable
fix — **that is the wrong direction** and would guarantee the refusal, since earlier means
further from the 24h mark. Correct fixes, in order of preference:

1. **Add a second attempt window later in the day** (e.g. keep 9:00 AM ET and add ~3:00 PM
   ET). A morning refusal then gets a same-day retry against a fully rolled window. This
   is robust to drift in either direction and needs no tuning.
2. Failing that, move the single fire time **later** (early afternoon ET), not earlier.

### Yesterday's requests worked — verified, not assumed

Re-probed via the URL Inspection API (free; only requests draw quota). All six lending
URLs pushed on 8/4 are now **`Submitted and indexed`, crawled 2026-08-04** — same-day
pickup:

| URL | State today |
|---|---|
| `itinlending.net/articles/itin-car-loan-bad-credit` | Submitted and indexed (8/4) |
| `itinlending.net/es/articles/itin-car-loan-bad-credit` | Submitted and indexed (8/4) |
| `itinlending.net/articles/itin-mortgage-lenders-verified-list` | Submitted and indexed (8/4) |
| `itinlending.net/es/articles/itin-mortgage-lenders-verified-list` | Submitted and indexed (8/4) |
| `itinlending.net/articles/itin-personal-loan-bad-credit-texas-california-florida` | Submitted and indexed (8/4) |
| `itinlending.net/es/articles/itin-personal-loan-bad-credit-texas-california-florida` | Submitted and indexed (8/4) |

The 15 ES `/es/itin-loans/<state>` pages also re-confirm as `Submitted and indexed`. The
one 8/4 score request (`itincreditscore.com/es/articles/itin-credit-score-check-every-method-2026`)
is still `Discovered – currently not indexed` — a **pending** request, so it must not be
re-requested.

### Measured backlog (67 URLs probed across all three sites, `lastmod >= 2026-07-24`)

12 not indexed. This was the queue today's quota would have gone to, and it carries to
tomorrow unchanged:

| # | URL | State |
|---|---|---|
| 1 | `itinlending.net/articles/itin-business-loan-lenders` | URL unknown to Google |
| 2 | `itinlending.net/es/articles/itin-business-loan-lenders` | URL unknown to Google |
| 3 | `itincreditscore.com/articles/late-payment-on-credit-report-itin-holders` | Discovered – not indexed |
| 4 | `itincreditscore.com/es/articles/late-payment-on-credit-report-itin-holders` | Discovered – not indexed |
| 5 | `itincreditscore.com/articles/read-dispute-credit-report-itin-bureau-by-bureau` | Discovered – not indexed |
| 6 | `itincreditscore.com/es/articles/read-dispute-credit-report-itin-bureau-by-bureau` | Discovered – not indexed |
| 7 | `itincreditcard.com/es/articles/store-credit-card-with-itin` | Discovered – not indexed |
| 8 | `itincreditcard.com/es/articles/improve-credit-card-approval-odds-itin` | Discovered – not indexed |
| 9 | `itincreditcard.com/es/articles/itin-credit-card-credit-bureau-reporting` | Discovered – not indexed |
| 10 | `itinlending.net/articles/itin-manufactured-home-loan` | URL unknown to Google |
| 11 | `itinlending.net/es/articles/itin-manufactured-home-loan` | URL unknown to Google |
| 12 | `itincreditscore.com/es/articles/itin-credit-score-check-every-method-2026` | **pending 8/4 request — do not re-request** |

**No 8/5 content had published on any of the three sites** at run time (newest `lastmod`
anywhere is 8/3), so there was no Tier 1 fresh-content claim on the quota today.

### NEW FINDING: the article hub pages are crawl-starved, which is the *other* half of the discovery failure

Yesterday established that lending's sitemap was last read Jul 27. Today's Sitemaps report
confirms it is **still Jul 27** — now **9 days** stale, still showing **158 discovered
pages** against **164** in the live sitemap. But that alone doesn't explain items 1, 2, 10
and 11 above: those articles published **7/27 and 7/24**, i.e. *at or before* that read,
and they are live (all four return **200**) and **are linked from `/articles`** (verified —
both slugs appear in the live index, which carries 49 article links). Yet all four report
`No referring sitemaps detected` **and** `Referring page: None detected`.

The missing piece is hub crawl frequency. Last crawl of each index page:

| Hub page | Last crawled | Age at 8/5 |
|---|---|---|
| `itincreditcard.com/articles` | **2026-06-27** | **39 days** |
| `itinlending.net` | 2026-07-18 | 18 days |
| `itincreditscore.com/articles` | 2026-07-18 | 18 days |
| `itinlending.net/articles` | 2026-07-19 | 17 days |
| `itincreditcard.com` | 2026-07-19 | 17 days |
| `itincreditscore.com` | 2026-07-23 | 13 days |
| `itinlending.net/es/articles` | 2026-08-01 | 4 days |

So **both** discovery channels are stalled at once: the sitemap isn't being re-read, and
the pages that link to new articles aren't being re-crawled either. That is why
request-indexing has been doing all the work one URL at a time against an 11/day cap — and
why a day with zero quota means zero discovery progress. Note `/es/articles` is the
freshest hub on any site (8/1), which fits the pattern that the ES index was being pulled
in while the EN one went cold.

### Method notes

- The **URL Inspection API deep-link into the GSC UI does not work** —
  `.../search-console/inspect?resource_id=...&id=<url-encoded URL>` returns a Google
  **404**. The `id` parameter is an opaque internal token, not the URL. Use the documented
  Overview → click the inspect bar (twice) → type → Enter flow.
- Inspections are **slow serially** (~55s each; a 67-URL sweep timed out at 10 min). Run
  them **threaded** (`ThreadPoolExecutor`, 8 workers, one `gsc._service()` per thread) —
  the same 67 URLs then finish in about a minute. Yesterday's "~80 URLs in ~2 min" figure
  only holds with concurrency.
- Run background probes with output **redirected to a file**, not piped to `tail` — a pipe
  buffers and the run looks hung until it is killed.
- `computer:wait` **caps at 10 seconds** per call; chain multiple waits for the ~20-30s
  "Testing if live URL can be indexed" dialog.

**BACKLOG NOT CLEARED — keep this task enabled.**

- Docs updated: this entry.
- Follow-ups / open items:
  1. **Add a second daily fire window (~3:00 PM ET) to `itin-gsc-request-indexing`.** This
     is now the top item: today proves a single morning run can return **zero** value, and
     a same-day retry costs nothing when quota is genuinely empty. *Not done here* —
     changing the task's own schedule is outside a run's remit. **Supersedes yesterday's
     follow-up #4, whose "fire earlier" recommendation was backwards** (see mechanism above).
  2. **Resubmit `itinlending.net/sitemap-0.xml` in GSC → Sitemaps** (carried from 8/4,
     still not done, now 9 days stale at 158 vs 164 live URLs). Still left for a human or a
     task that owns sitemap writes.
  3. **NEW: the hub pages need a crawl, not just the sitemaps.** Card's `/articles` at 39
     days is the worst. Worth request-indexing the three EN `/articles` hubs themselves on
     a future run — one request that refreshes the link graph for ~49 articles is far better
     leverage than one request per article. Consider this ahead of Tier 2 backlog next run.
  4. Two card targets still have no `/articles/` counterpart and need a human decision
     (retarget or delete): `/how-to-build-credit-with-itin`,
     `/transfer-itin-credit-history-to-ssn`. Carried from 8/2, 8/3, 8/4.
  5. Confirm lending's 3-articles-on-8/3 burst was intentional catch-up, not a scheduling
     defect. Carried from 8/4.
- Nothing committed or pushed; no site changes made.

## 2026-08-04 — GSC request-indexing: **full 11-URL quota** (lending 6 / score 1 / card 4); **ROOT CAUSE for lending's fresh content being invisible: Google last read its sitemap Jul 27** — 8 days stale, so every URL published since is `unknown to Google`; card broken-link deploy **CONFIRMED LANDED**

Daily scheduled request-indexing run (`itin-gsc-request-indexing`). Chrome/GSC auth
available (`bguillow@gmail.com`, all three Domain properties reachable). **11 URLs
request-indexed**, then "Quota Exceeded" on the 12th — the full rolling window is back
(yesterday's run only spent 4, so the window had recovered). **Zero quota lost to
duplicates** (explicit Dismiss + screenshot verification after every request).

**Per-site split: itinlending.net 6 / itincreditscore.com 1 / itincreditcard.com 4.**
The lending-heavy split is Tier 1 working as designed — lending shipped **three** articles
on 8/3 (not the usual one), so its fresh EN+ES pairs legitimately dominated the quota.

### Method note — the API probe paid for itself again
Probed all 17 candidates with the URL Inspection API **before** touching the browser
(inspections are free; only requests draw quota). That pre-screen found **3 already
indexed**, which would otherwise have burned 3 of 11 requests on no-ops.
Run it with the skill's venv, not system python:
`~/.claude/skills/seo-pulse/.venv/bin/python3 -u <script>.py` — system `python3` has no
`googleapiclient`, and **`-u` is required** or the output buffers and the run looks hung.

### Tier 1 — fresh content (7 requests)

| # | URL | Prior state |
|---|---|---|
| 1 | `itinlending.net/articles/itin-car-loan-bad-credit` | URL unknown to Google |
| 2 | `itinlending.net/es/articles/itin-car-loan-bad-credit` | URL unknown to Google |
| 3 | `itinlending.net/articles/itin-mortgage-lenders-verified-list` | URL unknown to Google |
| 4 | `itinlending.net/es/articles/itin-mortgage-lenders-verified-list` | URL unknown to Google |
| 5 | `itinlending.net/articles/itin-personal-loan-bad-credit-texas-california-florida` | URL unknown to Google |
| 6 | `itinlending.net/es/articles/itin-personal-loan-bad-credit-texas-california-florida` | URL unknown to Google |
| 7 | `itincreditscore.com/es/articles/itin-credit-score-check-every-method-2026` | URL unknown to Google |

**Skipped, already indexed (3 — no quota spent):** `itinlending.net/itin-auto-loan`
(crawled 8/3), `itinlending.net/es/itin-auto-loan` (crawled 6/7), and
`itincreditscore.com/articles/itin-credit-score-check-every-method-2026`
(**crawled AND indexed 8/3 — same day it published**).

### Tier 2 — card backlog (4 requests, worked from the 8/3 verified queue in order)

| # | URL | Prior state |
|---|---|---|
| 8 | `itincreditcard.com/es/articles/rewards-credit-card-itin-holders` | Discovered – not indexed |
| 9 | `itincreditcard.com/es/articles/secured-credit-card-deposit-itin-holders` | Discovered – not indexed |
| 10 | `itincreditcard.com/es/articles/secured-vs-unsecured-credit-card-itin-comparison` | Discovered – not indexed |
| 11 | `itincreditcard.com/es/articles/travel-credit-card-itin-holders` | Discovered – not indexed |

**Quota-refused (verified not-indexed, first in line tomorrow):**
`itincreditcard.com/es/articles/store-credit-card-with-itin`.

### THE FINDING: lending's sitemap has not been read since Jul 27

All six fresh lending URLs inspected identically: `URL is unknown to Google`,
**`Sitemaps: No referring sitemaps detected`**, `Referring page: None detected`. The
articles *are* in the live `sitemap-0.xml` (verified by curl), so the sitemap is not the
problem — **Google's last read of it is**. From the Sitemaps report, all three sites:

| Site | Sitemap last read | Pages discovered | Fresh-content outcome |
|---|---|---|---|
| **itinlending.net** | **Jul 27** (8 days) | 158 | 8/1 + 8/3 articles all `unknown to Google` |
| itincreditcard.com | Jul 30 | 116 | n/a (no new content) |
| itincreditscore.com | **Aug 3** (yesterday) | 118 | 8/3 EN article **indexed same day** |

The correlation is exact and runs both ways: the site whose sitemap Google read most
recently got its fresh article crawled and indexed within 24 hours; the site with the
stalest read has **every URL published after that read date invisible to Google**. The
live lending sitemap now carries 164 URLs with `lastmod` against the 158 Google banked on
Jul 27 — the delta is precisely the undiscovered set. Note score's Aug 3 read came from
the **manual `sitemap-index.xml` resubmission** done during that day's audit, which is
direct evidence that resubmitting forces a fresh read.

This reframes the ES-discovery work: for lending, request-indexing has been doing the job
a sitemap read should be doing, one URL at a time against an 11/day cap.

### The 8/3 top-priority follow-up is CLOSED — verified, not assumed

Yesterday's #1 item was the card broken-link fix sitting in source but never deployed. It
has since shipped (commits `d4e29f5`, `76ed829` touched card `docs/`). Verified two ways
rather than trusting the commit log:
- **Deployed-output sweep:** all 15 previously-broken root-level targets, **0 files** in
  card `docs/` still contain any of them (was "dozens of files").
- **Live site:** `itincreditcard.com/articles/which-banks-accept-itin-for-credit-cards`
  now serves `href="/articles/secured-credit-card-with-itin"` (2 instances) and **zero**
  `href="/secured-credit-card-with-itin"`.

Corroborated in GSC: every card ES page inspected today shows a populated **`Referring
page`** and **`Sitemaps: .../sitemap-0.xml`** — including `store-credit-card-with-itin`,
which is exactly the pattern the 8/3 entry predicted would appear once the deploy landed.
(The bare `/secured-credit-card-with-itin` URL still returns 404, which is now harmless —
nothing links to it. The two orphan targets in follow-up #3 below are unaffected.)

### Queue for tomorrow (all verified by live inspection today, in order)

Tier 1 first: any 8/5 (Wed) content across the three sites, EN + `/es`. Then:

1. `itincreditcard.com/es/articles/store-credit-card-with-itin` (quota-refused today)
2. `itincreditcard.com/es/articles/improve-credit-card-approval-odds-itin` (URL unknown to Google)
3. `itincreditcard.com/es/articles/itin-credit-card-credit-bureau-reporting` (Discovered – not indexed)

That exhausts the queue the 8/3 run left. Tier 2 lead stays with itincreditcard.com.

**BACKLOG NOT CLEARED — keep this task enabled.**

- Docs updated: this entry.
- Follow-ups / open items:
  1. **Resubmit `itinlending.net/sitemap-0.xml` in GSC → Sitemaps.** This is now the
     highest-leverage item on any of the three sites: one submission plausibly discovers
     the whole post-Jul-27 backlog at once, versus 11/day through request-indexing.
     *Not done here* — this task's remit is request-indexing, and sitemap resubmission is
     a different write action, so it is left for a human or a task that owns it. Worth
     also checking why the daily-content pipeline is not pinging the sitemap on publish,
     since a healthy site should not need manual resubmission.
  2. **Lending published 3 articles on 8/3, not 1.** Consistent with the pipeline catching
     up on the two slots lost to the Anthropic credit-balance failure (see 8/3 audit).
     Confirm this was intentional catch-up and not a scheduling defect.
  3. Two card targets still have no `/articles/` counterpart and need a human decision
     (retarget or delete): `/how-to-build-credit-with-itin`,
     `/transfer-itin-credit-history-to-ssn`. Carried from 8/2 and 8/3.
  4. **Quota timing is healthy again** (11 today vs 4 yesterday) because yesterday
     under-spent. The 8/3 recommendation to shift the fire time earlier still stands as
     the durable fix — a full-spend day followed by a later-firing run will truncate again.
- Nothing committed or pushed; no site changes made.

## 2026-08-04 — Link Engine responder: 1 draft (ConsumerAffairs, balance transfer vs debt consolidation)

- Reviewed 12 labeled query emails (9 unique digests: 3 HARO, 2 SOS, 3 SourceBottle,
  1 MentionMatch), roughly 70 individual opportunities. One qualified.
- Gmail draft created for ConsumerAffairs (Lena Borrelli), deadline 12:00 PM ET
  2026-08-04. Angle: balance transfer vs consolidation answered through the
  thin-file / ITIN-applicant lens, which is the differentiator no other source
  will bring. Pronouns line left blank for Bob.
- Skipped per the near-miss rules: buffer ETFs (MentionMatch) and "will the stock
  market crash in 2026" (U.S. News) as securities commentary; Bankrate home-lending
  piece wanted licensed realtors; SourceBottle caller-ID spoofing wanted telecom
  security specialists.
- Docs updated: this changelog only (no process change).
- Follow-ups: none.

## 2026-08-06 — 🎉 TrustedForm LIVE and generating certificates

- Bob created the free ActiveProspect account (Timberline Ventures org, free
  Certify tier, onboarding checklist 0/4). Flag flipped:
  `PUBLIC_TRUSTEDFORM_ENABLED: 'true'` added to daily-content.yml CI env block
  (literals pattern) + local web/.env; built, deployed, pushed (29ef72c).
- **Verified on the LIVE site via JS probe:** script loads and BOTH fields
  populate with real values — cert.trustedform.com/… + ping.trustedform.com/…
  on every form pageview. Every EN lead from now on carries a certified
  consent record. This closes the #1 buyer-side objection (PX, Astoria, all
  API buyers) and upgrades our PX questionnaire answer from "willing to add"
  to "installed."
- Follow-up: tell PX/Lidya TrustedForm is live when relevant; complete the
  ActiveProspect onboarding checklist (their dashboard should now detect certs).

## 2026-08-05 — TrustedForm: bug fixed, verified dormant-vs-live; account signup is the only remaining step

**Key fact confirmed by research:** TrustedForm **Certify is FREE for lead
originators** (us) — ActiveProspect charges the *buyer* to claim/verify certs.
So there is no cost blocker; we just need a free ActiveProspect account.

- **Bug found + fixed (commit 74e114f):** the loader script requests
  `ping_field=xxTrustedFormPingUrl`, but that hidden input never existed in
  `LeadForm.astro` — only `xxTrustedFormCertUrl` did. The ping value was being
  silently dropped. Buyers use the ping URL to check a cert exists *before*
  paying to claim it, so a missing ping field weakens every lead we'd sell.
  Added the input next to the cert field. Confirmed against the LIVE site
  (`itinlending.net/apply`, JS probe): certUrl present, **pingUrl absent**,
  script not loaded — exactly the defect, now fixed pending deploy.
- **Verified both build states:** `PUBLIC_TRUSTEDFORM_ENABLED=true` → script tag
  present + both hidden fields; unset → zero `trustedform.js` references (site
  ships dormant, no third-party script, no consent-theatre).
- Already in place and correct: TCPA express-written-consent checkbox
  (unchecked + required, names this site + the partner list, authorizes
  autodialed calls/texts, states consent isn't a purchase condition) and the
  `universal_leadid` (Jornaya) field for later.
- **Remaining step (Bob only — account creation):** create the free
  ActiveProspect account at activeprospect.com/trustedform/certify, then set
  `PUBLIC_TRUSTEDFORM_ENABLED=true` in the GitHub Actions build env and deploy.
  Nothing else in the code needs to change — no API key is embedded; the script
  is keyless and certs are attributed by the domain that generated them.
- **Sister sites:** `ITINCreditCard` / `ITINCreditScore` have `LeadForm.astro`
  but NO TrustedForm implementation and no `trustedFormEnabled` const. That's
  consistent with MONETIZATION.md (only ITIN Lending sells leads), so it's
  deliberate, not a gap — port the pattern only if those sites ever sell leads.

## 2026-08-05 — PX vendor-diligence questionnaire submitted (~50 fields)

- Completed and submitted PX's "Additional Information Request" HubSpot form
  (the deep diligence step after the July intake). Confirmation received.
- All answers recorded in `LEAD-PARTNERS.md` under the PX entry. Honest
  positioning throughout: brand-new O&O publisher, sub-100 daily web leads,
  100% organic, no call center, no consent-cert vendor yet.
- **Two answers create follow-up work if PX advances us:** (1) TrustedForm =
  "No" today but "willing to add" = Yes → need an ActiveProspect account +
  `PUBLIC_TRUSTEDFORM_ENABLED=true` before any real posting; (2) references =
  willing, but the names field was intentionally left blank (nobody has agreed
  to be a reference — decide who to ask before PX requests it).

## 2026-08-05 — ALL-SITES MarketCall expansion plan (Bob directive: "all sites in all languages")

Rollout ladder, in expected-money order — each rung = new campaign + own promo
material URL + moderation pass, then port the env-gated swap code:

1. **itinlending /es** — campaign #350784 IN MODERATION. On approval: set
   `PUBLIC_MARKETCALL_PERSONAL_ES=https://trkmcl.com/wy8om1m43k/z41kkw99nm`,
   deploy. (DONE except the flip.)
2. **itinlending EN** — use the EN debt-settlement offers Lidia linked in her
   8/04 email ("available on both Spanish and Eng"). Create campaign w/ material
   https://itinlending.net (EN articles/money pages), then add an EN env slot
   (`PUBLIC_MARKETCALL_DEBT_EN`) + swap/CTA on EN debt-relevant pages. NOTE: EN
   personal-loan CPL offers likely SSN-gated — debt settlement is the safe EN
   product (qualifies on debt amount, not SSN).
3. **itincreditscore.com** — Spanish Credit Repair calls ($20/95s) + any credit
   repair CPL. Needs: campaign w/ material https://itincreditscore.com, tracked
   number CTA, port swap code to that repo.
4. **itincreditcard.com** — weakest product fit today; look for card/credit
   offers or hold for Lidya's guidance.
- **Channel note from Lidya (chat, 8/05): use EMAIL, not the support chat** —
  "I have reached out via email, let's stay with that channel." She also
  confirmed in chat: create a new campaign (done, #350784).
- Sister-site source approval happens naturally via each campaign's material
  moderation — no separate account-level approval needed.
- Code port: replicate consts.ts marketcall slot + LeadForm/MoneyPageLayout
  pattern (commit abce59e) into the two sister repos when their campaigns clear.

## 2026-08-05 — Lidia: refused campaigns are dead-ends → NEW campaign #350784 created; ⚠️ TRACKING LINK CHANGED

- Lidia's email (8/05): a refused campaign cannot be re-reviewed at MarketCall —
  the fix is to create a NEW campaign on the offer. The 91305 resubmission was
  a dead end (still shows Refused).
- Created campaign **#350784** "itinlending.net ES personal loans - SEO v2" on
  offer 9809 with a **fresh material #91466** using the verified-working URL
  https://itinlending.net/es (note in the material explains the old URL was the
  broken variant). State: **Moderation** (clean queue).
- **⚠️ NEW TRACKING LINK: https://trkmcl.com/wy8om1m43k/z41kkw99nm** — the old
  #350598 link (…/98vxx79en3) is DEAD. When flipping the ES swap live, set
  `PUBLIC_MARKETCALL_PERSONAL_ES=https://trkmcl.com/wy8om1m43k/z41kkw99nm`.
- Also observed: Lidya has picked up the dashboard chat thread ("Lidya from
  Marketcall" header) — sister-sites question is in front of her there + in
  Bob's email reply.
- Follow-ups: watch for #350784 approval; on approval flip the env var with the
  NEW link; old campaign #350598 can be ignored.

## 2026-08-04 — Campaign #350598 refused ("url is not working") → root-caused, fixed, resubmitted

- Lidya refused the promo material: the URL I submitted
  (https://www.itinlending.net/es/) is broken twice over — **www does not
  resolve at all** (site is apex-only) and **/es/ with trailing slash 404s**
  (Astro `build.format: 'file'` emits es.html). Verified live with curl:
  only `https://itinlending.net/es` returns 200.
- Fixed material #91305 URL to https://itinlending.net/es, resubmitted (state:
  Manager Moderation), and sent Lidya a dashboard chat note asking for
  re-review (support offline, will email back).
- Lidya's activation email also answered part of the EN question: debt
  settlement offers exist in BOTH Spanish and English (link in her 8/04 email —
  candidates for EN-page monetization + the score site later).
- **Lesson for every future partner/network form: the canonical working URL
  shapes are `https://itinlending.net/...` — never www, never trailing slash
  on pages.** (www DNS gap also logged as a fix-worthy issue in its own right.)
- Follow-ups: watch for re-approval email; consider adding a www CNAME +
  trailing-slash redirects so sloppy URL variants stop 404ing (SEO + partner
  vetting hygiene).

## 2026-08-04 — ES lead form → MarketCall click-out swap BUILT (env-gated, dormant until campaign clears moderation)

- Per Bob's direction ("replace our signup form — I don't have anything to do
  with those leads now"): on **Spanish pages**, the lead form and loan-page CTAs
  are replaced by the MarketCall #350598 tracked redirect when
  `PUBLIC_MARKETCALL_PERSONAL_ES` is set at build time.
- Scope (deliberate, offer-compliance + economics):
  - **Swapped when env set:** /es homepage compact form, /es/apply form (all
    products' Spanish funnel now ends at the click-out), /es/itin-personal-loans
    + /es/itin-cash-loans hero + inline CTAs. Pillar /es/itin-loans routes to
    /es/apply → also ends at the swap.
  - **NOT swapped:** all EN pages (no matching English offer yet — asked Lidya),
    ES mortgage/auto/cards/business money-page CTAs (auto has live CJ payout,
    mortgage feeds direct partners, offer is personal loans).
  - **Sister sites NOT touched:** MarketCall's approved promo source is
    itinlending.net/es/ only; running the link on itincreditcard/itincreditscore
    before they're approved sources risks non-payment/ban. Pending Lidya's OK.
- Implementation: `consts.ts` `monetize.marketcallPersonalEsUrl` +
  `marketcallUrlFor(path, lang)` (slug allow-list personal/cash/loans);
  `MoneyPageLayout` hero + InlineCTA use it; `LeadForm.astro` renders a Spanish
  CTA panel (rel="sponsored noopener", compensation disclosure) instead of the
  form when live.
- Verified by dual builds: env unset → 0 trkmcl refs, form renders (shipped
  state); env set → swap on exactly the intended pages, EN + mortgage untouched,
  link checker green both ways.
- **To flip live once moderation clears:** add `PUBLIC_MARKETCALL_PERSONAL_ES=
  https://trkmcl.com/wy8om1m43k/98vxx79en3` to the GitHub Actions build env (and
  local .env for manual deploys), rebuild + deploy.
- Follow-ups: Lidya questions (moderation ETA, EN-offer equivalent, approve
  sister-site sources); once live, watch MarketCall Leads dashboard vs GA4
  clicks; revisit AdSense/lead-slot idea for the retired ES form slots.

## 2026-08-04 — 🎉 MarketCall APPROVED; first Spanish Personal Loans campaign created (#350598) with tracking link

- Lidya approved the account. Dashboard shows 11 Spanish offers (personal loan
  CPL, debt settlement calls $48-52, credit repair calls $20, ACA, final expense).
- Created campaign #350598 on offer 9809 "Spanish Personal Loans | CPA | Dynamic
  Payout" (Leads, $0-200 dynamic per approved lead, uncapped, SEO allowed, no SSN
  in spec). Promo material = itinlending.net/es/ (in manager moderation).
- **Tracking link issued: https://trkmcl.com/wy8om1m43k/98vxx79en3** — goes live
  when moderation clears. This is the first genuinely automated ITIN-personal-loan
  monetization path we've ever had.
- Full details in LEAD-PARTNERS.md MarketCall entry.
- Follow-ups: (1) when campaign clears moderation, wire the tracking link as
  secondary CTA on /es personal-loan pages (env-gated, lead form stays primary —
  or test placements); (2) request Spanish Debt Settlement 10K + Credit Repair
  call campaigns once we have ES debt content + call CTAs; (3) tell Lidya thanks +
  ask expected moderation time.

## 2026-08-04 — Astoria vendor application SUBMITTED (leads + calls)

- Completed Astoria's 3-step vendor application in Bob's browser and got the
  "application was received" confirmation. Details (incl. the Mutual NDA that was
  part of submission, references given, and the honest volume disclosures) recorded
  in `LEAD-PARTNERS.md` under the Astoria entry.
- Company info used: Timberline Ventures LLC, 2701 Amsdell Rd, Hamburg NY 14075,
  716-510-9313, bob@timberlineventuresllc.com, LinkedIn company/133457405.
- GA4 pulled live for the visitor-count answer (~500 uniques/mo itinlending.net,
  30d). seo-pulse venv is the way to run ga4.py (`.venv/bin/python`).
- Follow-ups: give Lisa/Lidya/Jacob a heads-up they're listed as references if
  Astoria starts calling; Aragon signup is the next network; watch
  bob@ inbox for Astoria's review reply.

## 2026-08-03 — 4 more affiliate applications submitted (Bob's go-ahead); Lisa/PX reply rebuilt after accidental delete

- Bob confirmed drafts sent (PX intake form also done by him earlier) and green-lit
  the optional applications. Agent submitted in his browser:
  - **CJ:** TurboTax (CID 1905878) + TaxAct (CID 4110283) — both "manual
    application review" pending.
  - **Awin:** Autopay (US) (auto refi) + IRSplus (US) — both join requests sent
    (Content type, T&C accepted, intro message included).
- Bob accidentally deleted the Lisa @ PX reply draft; rebuilt it **as a threaded
  reply on her original "Partnership Inquiry" email** in the Gmail browser editor
  (clean links, draft saved) — Bob to hit Send.
- Affiliate application scoreboard now pending: Félix Pago, QuinStreet (Awin) ·
  TurboTax, TaxAct (CJ) · Autopay, IRSplus (Awin) · MarketCall activation ·
  FlexOffers appeal. Wire links into money pages as approvals land.

## 2026-08-03 — Awin: Félix Pago pending + QuinStreet Personal Loans applied; ALL Gmail drafts rebuilt in-browser (connector URL-wrapper defect)

- **Awin (Bob logged in, agent drove):** Félix Pago application was already
  **Pending Approval** (submitted with Bob's signup — nothing more to do).
  Directory recon: Remitly, Wise, H&R Block, Western Union NOT on Awin US
  (fuzzy-search noise only). US "Loans" category has just 14 programs; joined
  **QuinStreet Personal Loans (US)** (Content promotion type, T&C accepted,
  request sent — QuinStreet was already a documented 07-12 target). Other maybes
  left un-joined for Bob: Autopay (US) (auto refi), IRSplus (US).
- **Gmail connector defect bit us again** (it's in auto-memory and was missed):
  connector-created drafts wrap every URL/domain in google.com/url redirect text.
  Bob caught it. Fix applied per the known process — rebuilt all three drafts
  directly in the Gmail browser compose: FlexOffers appeal (retyped clean), Lisa
  @ PX reply (retyped clean), MarketCall/Lidya (the connector draft NEVER
  actually appeared in Gmail despite returning an id — composed fresh from
  bob@timberlineventuresllc.com). All three verified: plain-text domains, no
  wrappers, correct subjects/recipients.
- **Process rule going forward: never call a connector-created draft ready.**
  Either compose in the browser directly, or open the draft in Gmail and verify/
  fix links before reporting done.
- Docs updated: this entry; LEAD-PARTNERS.md already carries Awin/QuinStreet
  status via the Lane-3 block (see below entry).

## 2026-08-03 — Lane 3 (affiliates) execution: FlexOffers found DECLINED; CJ recon; PX reply humanized

- Rewrote the Lisa @ PX Gmail draft in place per the humanize skill (intake form
  is already done — Bob submitted it himself).
- Attempted Lane-3 applications in Bob's browser. **FlexOffers login revealed the
  publisher application is DECLINED** — gates NAF (up to $60/prospect) and
  Remitly. Appeal draft in Gmail to support@flexoffers.com.
- CJ (logged in, good standing): searched directory — NAF, Remitly, H&R Block,
  Wise all absent (0 results; engine verified via TurboTax=4 results). TurboTax +
  TaxAct found on CJ as one-click tax-prep options; awaiting Bob's OK to apply.
- Net: no Lane-3 program is joinable today without Bob creating/fixing network
  accounts (FlexOffers appeal, Awin, Partnerize, Impact).
- Docs updated: `LEAD-PARTNERS.md` (Lane-3 execution status block).
- Follow-ups: Bob sends 3 Gmail drafts (PX reply, MarketCall activation,
  FlexOffers appeal); Bob creates Awin/Partnerize/Impact accounts, then agent
  drives the per-program applications; verify NAF live app flow accepts ITIN
  before wiring any CTA.

## 2026-08-03 — MarketCall affiliate activation completed (questionnaire submitted, manager assigned)

- Bob created the MarketCall account + verified email; agent completed the
  3-step activation questionnaire in his browser (SEO / SEO-publisher / Finance /
  Pay Per Call + CPL ping-post + CPL referral / $0–1k monthly / heard via Search).
  Company description humanized per the humanize skill before submit.
- Result: questionnaire accepted; account has **limited offer access until
  activated by assigned personal manager Lidya Emelyanova (`lidia@marketcall.net`,
  Mo–Fr 1–10 PM)**. Activation email drafted in Gmail for Bob to send (asks
  activation steps + open Spanish-language campaigns).
- Docs updated: `LEAD-PARTNERS.md` (MarketCall entry now shows signup status,
  manager contact, next step).
- Follow-ups: Bob sends the two Gmail drafts (Lisa @ PX reply + Lidya @
  MarketCall); once campaigns are visible, wire tracked call CTAs on ES pages.

## 2026-08-03 — Lead-monetization research pass #3 + inbox audit: PX spec has NO SSN field; PX rep waiting on us since 7/17

- Re-ran the ITIN lead-buyer research with 3 parallel agents (networks/specs,
  pay-per-call, affiliate programs) + audited the inbox for partner replies.
- **Headline 1:** PX's published personal-loans ping-post spec contains **no SSN
  field**; mortgage spec lists SSN as optional. Revises the 2026-07-15 "DECIDING
  FACT" conclusion — PX is structurally open to ITIN-only personal-loan + mortgage
  leads; buyer appetite is the remaining empirical question.
- **Headline 2:** PX's Director of Publisher Sales (Lisa Thiringer) replied
  2026-07-17 asking for our Publisher Intake Form — sat unanswered 17 days. Zero
  replies from all 8 cold-emailed mortgage lenders → cold lender email is dead;
  marketplace + phone channels win.
- **Headline 3:** Pay-per-call verified as the no-SSN-by-design lane: MarketCall
  (Spanish debt calls $50–55), Aragon, Astoria, Exclusive Live Calls ($324 mortgage
  purchase calls). New affiliate wins joinable on existing networks: NAF via
  FlexOffers (up to $60/prospect, ITIN mortgage), Félix Pago (Awin), Remitly,
  Wise, H&R Block (CAA = ITIN application CTA).
- **Rejected + documented:** the "have borrowers enter ITIN in the SSN field" idea
  — fails validation (9XX blocked) and is misrepresentation on a credit
  application; standing no.
- Docs updated: `LEAD-PARTNERS.md` (new "2026-08-03 — Fresh research pass" section
  + correction note under THE DECIDING FACT).
- Follow-ups: Bob to reply to Lisa @ PX + complete intake form; Bob to sign up
  MarketCall/Astoria/NAF-FlexOffers (account creation is his); then wire
  `partners.ts` PX adapter to the real spec and add tracked tel: CTAs for
  pay-per-call once campaigns are approved.

## 2026-08-03 — itincreditcard.com: dead IndexNow fixed — **all three sites are now clean**; card's money pages + `/es` sent to Google for the **first time ever**

Straight port of the itincreditscore fix (`58161e4`) to the last remaining broken
repo. Closes follow-up #3 on the entry below. Commit `1721499` on
`bguillow-rgb/itincreditcard@main`.

### 1. IndexNow had never submitted a single URL — confirmed, then fixed
- **Confirmed before touching anything.** Run `30831998650` (2026-08-03 16:24):
  `Error: ENOENT: no such file or directory, open '.../web/dist/sitemap-0.xml'` at
  `readFileSync (node:fs:448)` → `indexnow.mjs:13`, swallowed by `|| true`,
  workflow green. Dead since the workflow was created.
- **Fix in the script, not the workflow.** `web/scripts/indexnow.mjs` now reads
  `dist/sitemap-0.xml` when present (preserving `daily-content.yml`, which builds
  first) and otherwise fetches the **live** sitemap, exiting non-zero if that fetch
  is non-OK. Dropped `|| true` from `indexnow.yml`; `daily-content.yml` keeps it
  (trailing non-blocking step on a publish job).
- **Verified the fallback locally first** with the IndexNow POST stubbed: 118 URLs
  parsed off the live sitemap, 59 of them `/es`, correct `keyLocation`.
- **First real run confirmed** — dispatch `30833018032`:
  `IndexNow: no local build found — reading URLs from https://itincreditcard.com/sitemap-0.xml`
  then **`IndexNow itincreditcard.com: HTTP 200 OK — submitted 118 URLs`.**
- Same caveat as the other two sites: `daily-content.yml` was **never** affected
  (it builds before pinging), so IndexNow *has* been firing on daily-publish days.
  What was dead is the standalone post-deploy ping — i.e. every non-article deploy.

### 2. Ported `recrawl.yml` — and card's commercial surface reached Google at last
- Added `.github/workflows/recrawl.yml` (manual `workflow_dispatch`, arbitrary URL
  list, existing `GOOGLE_INDEXING_SA_KEY`). Default priority set is the card
  vertical's own money pages, not a copy of score's: `/best-itin-credit-cards`,
  `/credit-cards-that-accept-itin`, `/secured-credit-cards`,
  `/unsecured-credit-cards`, `/itin-credit-cards-guide`, `/business-credit-cards`,
  `/build-credit-with-itin`, `/how-to-get-an-itin`, `/about`, `/articles`, plus
  `/es` and the 5 highest-intent ES twins. 16 URLs, well under the 200/day quota.
  Every URL was checked against the live sitemap before being listed.
- **Ran it** — run `30833146813`: **16 submitted, 0 failed.** These are the first
  Indexing API submissions this site's money pages and `/es` section have ever had.
- Note for future ports: `recrawl.yml` is **not dispatchable until it is on the
  default branch** (`gh workflow run` 404s otherwise). Merge, then run.

- Docs updated: `OPERATIONS.md` — added `indexnow.yml` + `recrawl.yml` to the
  workflow table, documented the live-sitemap fallback and *why* it is mandatory
  under the IndexNow section, and added a "Manual recrawl" section explaining the
  daily `--article` blind spot.
- Follow-ups / open items:
  1. **Re-measure card in ~7-14 days.** The money pages and `/es` have never been
     pushed to Google before; check crawl dates + impressions on
     `/best-itin-credit-cards`, `/credit-cards-that-accept-itin`, and `/es` to see
     whether the card ES backlog (~47 URLs, the largest of the three) moves.
  2. **Cross-repo: nothing outstanding.** lending had the fallback already, score
     fixed in `58161e4`, card fixed here. All three now carry the same
     `indexnow.mjs` fallback and the `|| true` removal. `recrawl.yml` now exists on
     score + card; **lending still has no `recrawl.yml`** — it has the same
     `--article`-only blind spot and should get one with its own money-page list.
  3. Consider wiring `recrawl.yml` into the deploy flow (or the weekly audit) so it
     isn't purely manual — a money-page deploy currently still relies on someone
     remembering to dispatch it.

## 2026-08-03 — ACTED on the itincreditscore.com audit: found IndexNow had been submitting **nothing** since inception, sent the money + ES pages to Google's Indexing API for the **first time ever**, cleaned both sitemap entries, and rewrote the zero-click Bing metas

Execution pass on the top-3 actions from this morning's audit (entry below).
Commits `58161e4` (plumbing) and `57152a8` (copy) on `bguillow-rgb/itincreditscore@main`.

### 1. Recrawl — two plumbing defects found while acting on the audit
- **`indexnow.yml` had never submitted a single URL.** It checks out, `npm ci`s, and
  runs `indexnow.mjs` with no build step, but the script read `dist/sitemap-0.xml` —
  gitignored, so never present in CI. Every run threw ENOENT, `|| true` swallowed it,
  and the workflow reported **success**. Dead since the workflow was created.
  Fixed in the script (not the workflow): `indexnow.mjs` now falls back to the LIVE
  sitemap when `dist/` is absent, which is the correct source for a post-deploy ping
  anyway. Verified both paths (dist → 118 URLs, live fallback → 122). Dropped
  `|| true` from `indexnow.yml` since pinging is that workflow's only job;
  `daily-content.yml` keeps it (trailing non-blocking step). **First real run
  confirmed: `HTTP 200 OK — submitted 122 URLs`.**
  NOTE: `daily-content.yml` was NEVER affected (it builds first), so IndexNow *has*
  been firing daily — a correction to any reading of this as a total outage.
- **Google's Indexing API had only ever seen the newest daily article.**
  `daily-content.yml` pings `google-index.mjs --article <slug>`, so the money pages
  and the whole `/es` section have **never** been submitted. That is the mechanical
  reason daily articles rank pos 5-13 while `/check-credit-score-with-itin` sat on a
  Jun 25 crawl. Added **`.github/workflows/recrawl.yml`** (manual `workflow_dispatch`,
  arbitrary URL list, defaults to the commercial + Spanish surface, uses the existing
  `GOOGLE_INDEXING_SA_KEY`). Ran it: **12/12 URL_UPDATED, 0 failed.**
- **GSC Request Indexing:** queued `/check-credit-score-with-itin`, `/es`, and
  `/es/itin-credit-score-guide`, then hit the **daily quota**. `/es/check-credit-score-with-itin`
  and `/credit-readiness-calculator` were NOT queued via GSC — but both went through
  the Indexing API above, so they are covered. Retry the GSC layer tomorrow.

### 2. Bing — nothing to submit; the real gap was the snippets
- Bing already had **both** sitemaps submitted and freshly crawled (`sitemap-0.xml`
  2026-08-01 14:16 UTC, `sitemap-index.xml` 14:32 UTC, 120 URLs, site verified).
  No action needed — a correction to the audit's action #2(b).
- **Spanish question answered: yes.** 7 `/es` pages surface on Bing at **pos 2.0-4.2**,
  including `/es/check-credit-score-with-itin` at **pos 2.5** (a page with 2 Google
  impressions in 90 days) and `/es` at pos 2.0 **with a click**. Spanish queries land
  on `/es`, correctly.
- **Diagnosed the zero-click cause by comparison.** `/check-credit-score-with-itin`
  (70 impr, pos 5.6, 0 clicks) vs `/articles/how-to-check-credit-score-with-itin-number`
  (36 impr, pos 3.0, **3 clicks, 8.3% CTR**). The difference is the first eight words
  of the snippet: the winner opens on the obstacle the searcher already hit
  ("AnnualCreditReport.com won't accept your ITIN online, but all three bureaus will")
  and puts "Free" in the title; the losers opened on a category label
  ("Step-by-step guide to...") and never said free.
- Rewrote money page + `/itin-credit-score-guide` + homepage metas (159-164 chars),
  added "Free" to the money-page title, kept the exact-match phrase. Homepage now
  passes an explicit `description` prop instead of falling back to `SITE.description`
  — its meta was **248 chars**, truncating mid-phrase and opening with the bare domain.
  `SITE.description` deliberately left alone: it is the ENTITY description feeding
  Organization + WebSite schema and RSS, a different job from a SERP snippet.

### 3. Sitemaps — both loose ends closed
- Removed the dead `http://itincreditscore.com/sitemap.blog.xml` (WordPress-era,
  last read **Nov 4 2023**).
- Re-submitted `sitemap-index.xml`, which was still on its Jun 6 read (now Submitted
  Aug 3). `sitemap-0.xml` remains current as of Jul 30.

### 4. Closed the last open item from the Jul 27 audit
`/about` now carries a contextual **in-body** link to the money page. It had zero: the
three links in the built page were all nav/footer boilerplate. `/about` earns 218
impressions and the site's only Google click. Anchor: exact-match "how to check your
credit score with an ITIN". Build + `check-links` pass (every internal link resolves).

- Docs updated: this CHANGELOG.
- **Cross-repo:** `itinlending.net` already carries the IndexNow fallback fix.
  **`itincreditcard.com` still has the original broken script** and the same
  daily-article-only Indexing API gap — spawned as a separate task.
- Follow-ups: (1) retry GSC Request Indexing tomorrow for
  `/es/check-credit-score-with-itin` + `/credit-readiness-calculator`; (2) next audit
  is the first honest read — check whether crawl dates finally move past Jul 23 and
  whether the 404 / alternate-canonical buckets (frozen at 13/13) start clearing;
  (3) measure the meta rewrites on Bing CTR in ~2 weeks.

## 2026-08-03 — Weekly SEO audit (itincreditscore.com): all 5 plumbing fixes shipped & verified, sitemap drought broken — but **Google hasn't crawled a single page since Jul 23**, money page ranking on a **June 25 snapshot**; **Bing ranks 60/60 queries page-1 and produced both leads**

Weekly scheduled audit (`itin-weekly-seo-audit-creditscore`). GSC window 2026-07-05 → 08-01
via the Search Analytics **API** (seo-pulse OAuth, not the browser), GA4 same window, plus
Bing Webmaster + URL Inspection API + a full sweep of the deployed `/docs` output. Full report:
`~/ITINCreditScore/.seo/output/seo-audit-creditscore-2026-08-03.md`.

**Topline:** impressions 963 → **976** (+1.3%, 2-window decline halted), clicks 1 → 1, queries
82 → **103** (+26%), avg position 61.9 → 64.1. Indexed 75 → 75 and **all six not-indexed buckets
byte-identical to last week**. GA4 organic sessions 18 → **24** (+33%, 58% engaged);
AI Assistant 5 → 6, still 0% engaged for a 4th straight window. ES impressions 7 → **12**.

### Last week's five actions all shipped — verified against the live site
- `e814511` sitemap `lastmod` fix — live sitemap now has **spread** lastmods (30× Jun 18, 4× Jul 7,
  2× each Jul 5–Aug 1) and **32 static URLs correctly carry no lastmod**.
- `951e230` + `e6033a8` broken links — **full sweep of deployed `/docs`: 135 distinct internal
  hrefs, 0 unresolved, 0 instances** (was 200 instances → 26 live 404s).
- `951e230` `.html` language-toggle — **0 `.html` hrefs** on every page checked (was 121 of 139).
  Confirmed in the data: 4 `.html` URLs earned impressions in the prior window, **zero** now.
- `e6033a8` + `a9910fb` fixed the bug at source in the generator and translator.
- **Sitemap drought broken:** `sitemap-0.xml` submitted **Jul 30** and read by Google **Jul 30**,
  118 URLs discovered (was 51 days without a read).

### The finding that reframes six audits: crawl staleness
URL Inspection API — `/check-credit-score-with-itin` (the money page) **last crawled 2026-06-25
(39 days)**; `/es` **Jun 9 (55 days)**; `/es/itin-credit-score-guide` **Jun 13 (51)**;
`/es/check-credit-score-with-itin` Jul 4 (30). **Nothing on the property has been crawled since
Jul 23** — i.e. Google has seen **none** of the above fixes. That is why every indexing bucket is
unchanged: 404s won't clear until Google recrawls the 45 repaired files. `/credit-readiness-calculator`
and the Aug 1 daily article are **"unknown to Google"** — the content pipeline is publishing into a void.
**A crawl date older than the fix means unmeasured, not failed.**

### Bing is the only surface that converts (new — never audited on this site before)
60 queries, **60 of 60 at position ≤10**, 152 impressions, **4 clicks (2.6% CTR)** vs Google's
976 impressions / 1 click / 0.1%. `how to check credit score with itin` = **pos 6.3 on Bing vs
80.5 on Google**. GA4 `generate_lead` by source/medium = **`bing / organic`: 2** — no Google row.
Spanish ranks page-1 on Bing too (`como poder tener reporte o ver tu credit score con itin` pos 4.0,
`como revisar mi credit score con itin` pos 4.0) while dark on Google. **The content is provably
good enough to rank; what Google withholds is crawl budget and domain trust.**

### Corrections to prior audits
- **Bing/Serper keys were never missing.** Three audits reported `.secrets/` absent — they live with
  the **skill** (`~/.claude/skills/seo-pulse/.secrets/`), not the project. Same correction as the
  creditcard audit today. Future runs must not report them unavailable.
- **The Jul 27 "ES contracted 21 → 7" was partly an artifact.** The prior window contained four
  `.html` duplicate URLs earning impressions (incl. `/es/articles/credit-builder-loan-with-itin.html`
  at 13). On clean URLs only, **ES grew 7 → 12**. ES content still ranks pos 9–11.
- **The flagship query's position decline is misleading.** `how to check credit score with itin`
  fell 77.7 → 80.5, but the **money page's own rank for it improved 95.1 → 86.6** and its impression
  share went **21 (5th) → 68 (1st)**. GSC reports the best-ranking page; the homepage (58.1 → 80.1)
  and `/about` (66.1 → 77.7) collapsed beneath it. Consolidation is working — onto a stale page.

### Also found
- **Junk-page cannibalization:** 9 pages serve the flagship query, incl. `/privacy` (31 impr, pos 95.7,
  site-wide 3 → 54), `/contact` (10, pos 90.7) and `/articles` (43, pos 94.7). Verified their titles,
  metas and body copy are correctly scoped — Google is matching the **domain**, not the page. Symptom
  of the stale crawl; **do not edit these pages**. The 84 impressions at pos 90–96 are the arithmetic
  behind the 61.9 → 64.1 average-position drop.
- **Bureau rebuild still compounding:** `transunion itin credit report` **+32.7 positions** (59.7 → 27.0),
  the largest single-query move on the property, two audits after `2271994`.
- `/check-credit-score-with-itin` is now the #1 page: **85 → 358 impressions, pos 81.4 → 69.8**.
- **11% of impressions (109) are off-target geos** (ZA/VN/ID/AE/UA/RU/BD/SA/BR) at pos 9–50, flattering
  the average and inflating the query count. Weekly pull should filter to US.
- Action #4 from Jul 27 (**`/about` → money page body link**) is **still not done** — the 3 links in
  `docs/about.html` are nav/footer boilerplate; `web/src/pages/about.astro` has zero references.

- Docs updated: this CHANGELOG.
- Follow-ups: (1) force recrawl via URL Inspection + IndexNow/Indexing API across all 118 URLs —
  ceiling on everything else; (2) work the Bing surface (submit sitemap + IndexNow in Bing WMT,
  rewrite titles for the 8 page-1 Bing queries earning 0 clicks, verify Spanish Bing queries land on
  `/es`); (3) delete the dead 2023 `sitemap.blog.xml` and re-submit `sitemap-index.xml` (still on its
  Jun 6 read); (4) add the `/about` body link; (5) hold ES — diagnosis closed, it is crawl frequency.

## 2026-08-03 — Weekly SEO audit (itincreditcard.com): sitemap fix landed hard (**indexed 27 → 66**) but left **30 static URLs with no `lastmod`** — every money page uncrawled since Jun 6; **Bing API keys were never missing** (52 queries at pos 1–10)

Weekly scheduled audit (`itin-weekly-seo-audit-creditcard`). GSC window 2026-07-05 → 08-01,
GA4 same window, plus Bing Webmaster + URL Inspection API via seo-pulse. Full report:
`~/ITINCreditCard/.seo/output/seo-audit-creditcard-2026-08-03.md`.

**Topline:** impressions 156 → **181** (+16%), clicks 0 → 0, queries 36 → **45**, headline avg
position 68.5 → 71.4 but **like-for-like position improved 81.8 → 79.9** across the 34 shared
queries (the "drop" is 11 new long-tails entering at pos 81). **Indexed pages 27 → 66 (+144%).**
GA4 sessions 120 → **171**; AI Assistant 10 → **20** with average duration **56s → 196s**.
`google / organic` still 0.

### The 07-27 sitemap fix: worked, then left a hole

- ✅ **Confirmed working.** `sitemap-0.xml` submitted **and read** Jul 30 (was Jun 20, 37 days
  stale); distinct `lastmod` values 1 → 31; **indexed 27 → 66**; breadcrumbs 48 → 58 valid / 0
  invalid. Articles published Aug 1–2 were **crawled the same day** on a zero-backlink domain.
- ⚠️ **New defect, family-wide.** `astro.config.mjs:86-89` sets per-article `lastmod` from
  frontmatter and `delete`s it otherwise — so **30 of 118 static URLs now carry no freshness signal
  at all**. Crawl dates: `/credit-cards-that-accept-itin`, `/itin-credit-cards-guide` and
  `/secured-credit-cards` last crawled **Jun 6 (58 days)**. Same hole on itinlending.net (36 URLs)
  and itincreditscore.com (32). Fix = fall back to git mtime of the source `.astro`, all three sites.
- ⚠️ **Consequence:** the Jul 27 pillar issuer table and homepage de-optimization have **never been
  crawled**. They are unmeasured, not failed — do not re-diagnose until those pages show a crawl
  date after 2026-07-27.

### Corrections to prior audits

- **Bing/Serper keys were never missing.** Three audits reported them absent after checking
  `~/ITINCreditCard/.secrets/` (which doesn't exist). They live at
  `~/.claude/skills/seo-pulse/.secrets/` and work. First real Bing pull: **52 queries, avg pos
  1–10, 5 clicks, 1 lead** — the site is already a page-1 Bing property while Google buries the
  same terms at 70–100. Bing also surfaces the issuer-specific long-tails (`chase`, `santander`,
  `pnc`, `amex`, `us bank`, `care credit`, `home depot`) that `context.md` has listed as
  "should rank but don't" for two months.
- **GSC "External links Total 2" is not progress** — both are self-referrals from
  timberlineventuresllc.com. Third-party referring domains: **still zero, 6th audit.**
- **`/apply` "URL unknown to Google" is correct**, not a defect — it ships `noindex,follow` and is
  deliberately out of the sitemap. Recorded so a future audit doesn't flag it.
- **GA4 `generate_lead` is flat at 4**, not new — same count in both windows. 3 direct, 1
  `bing / organic`.

### /es diagnosis settled — not technical

URL Inspection API confirms **all 10 /es pages are "Submitted and indexed"**, crawled Jul 15–29.
Indexation, hreflang reciprocity, `inLanguage: es-419` and crawl freshness all verified good, yet
/es earns 16 impressions and 0 Google clicks. Bing ranks the same content **3–6** for real Spanish
queries (*se necesita un itin para una tarjeta de credito*, *como obtener mi tarjeta itin*,
*chase disney aprueba tarjeta con itin*). Conclusion: **demand-and-authority, not quality** —
resolves through link-building, not more schema work. Stop re-diagnosing it.

### Also

- **Lost the site's only page-1 Google ranking:** `irs itin application requirements 2026` (pos 6.0,
  held 3 cycles) fell out, along with its serving page `/how-to-get-an-itin` (last crawled Jun 26).
- **Homepage cannibalization worsened:** share 79.5% → **81.2%**; `/credit-cards-that-accept-itin`
  dropped out of the impression set entirely (was pos 7.0). 25 of the top 28 query→page rows
  resolve to `/`. The title fix targets `web/src/consts.ts:6-7`, **not** `index.astro` — which is
  why the Jul 27 edit didn't move it.
- **Internal links 7 → 910** (commit `2627982`); no `/es` page in the top 10.
- **New referral source: producthunt.com** (4 sessions, 194s) — first real third-party referral
  path; worth chasing for the first backlink.

- Docs updated: this CHANGELOG; audit report in `~/ITINCreditCard/.seo/output/`.
### Actions 1 + 2 implemented same day (uncommitted, pending review)

- **Static-page `lastmod` from the source file's commit date**, all three sites. Sitemap coverage:
  itincreditcard **118/118** (was 88), itinlending **158/158** (was 122), itincreditscore
  **122/122** (was 88). All three build clean, check-links passes. `/` and the pillar now carry
  `lastmod` 2026-07-27 — newer than Google's last crawl of them, which is what triggers the recrawl.
- **Correction found while implementing:** the shallow-checkout warning in the config was right, and
  the failure is worse than blank dates. `actions/checkout` defaults to `fetch-depth: 1`; that lone
  commit has no parent, so `git log --name-only` reports *every* file as added in it and all 38
  pages get the same deploy-day date — the original `lastmod: new Date()` bug reincarnated.
  Verified against a real `git clone --depth 1`. Fix therefore ships as **both** `fetch-depth: 0` on
  the two building workflows **and** a build-time `git rev-parse --is-shallow-repository` guard that
  emits nothing rather than dating from a shallow tree.
- **Homepage `<title>` de-optimized** (itincreditcard only): now
  `ITIN Credit Card | Independent Card Matching & Guides` / `... | Comparador Independiente y Guías`
  via a new `SITE.homeTitle`. Interior titles and the footer tagline unchanged.
- **The "23 body repetitions" figure was revised down.** 7 are in `<head>`, 2 are JSON-LD, and of
  the 16 visible, 4 are the brand name in nav/footer/legal, 2 are dynamic article titles, 1 is a
  hidden form field. Only two were genuinely redundant and both were trimmed. The title is the real
  lever; further cuts would degrade the page for no gain.
- **Concurrency note:** the itinlending and itincreditscore audit sessions were both live while
  these edits were made, and cross-session messaging is unavailable from an unattended run. Changes
  in `~/Itin` and `~/ITINCreditScore` are working-tree only and uncommitted.

- Follow-ups / open items: (1) review + commit + deploy the above (nothing is live yet — `docs/` not
  regenerated); (2) first genuine third-party backlink — chase the Product Hunt source; (3) build
  the issuer-specific cluster Bing already validated; (4) correct `context.md` secrets path + OAuth
  note; (5) hero anchor on the itincreditcard homepage is near-invisible against the dark hero.

---

## 2026-08-03 — Actioned the weekly audit: pipeline failures now alert (all 3 repos), **IndexNow had never submitted a URL**, and 32 ES pages Google had never heard of were pushed to the Indexing API

Execution pass on the three HIGH actions from this morning's audit
(`.seo/output/seo-audit-lending-2026-08-03.md`). Two of the three are fully shipped; the third is
deliberately a no-op-and-wait. Two new defects were found while doing the work.

### Action #1 — pipeline failures are no longer silent (shipped, all three repos)

Commit `ci(content): make pipeline failures loud` in `itinlending`, `ITINCreditCard` and
`ITINCreditScore` — the key is shared, so the blind spot was too.

- **`web/scripts/preflight-api.mjs`** (new): a ~1-token Anthropic probe before any real work.
  Exit 2 on a credit-balance failure, exit 3 on auth, each with an unmissable `::error::`
  annotation naming the fix and warning that the other two sites are down too. Transient 429/5xx
  are retried then waved through — a flaky preflight must never be why an article doesn't ship.
  Verified: no key → exit 3; bad key → exit 3 with the 401 body. The funded path (exit 0) can only
  be exercised in CI, where the secret lives; next scheduled run will confirm it.
- **`generate.mjs`**: billing/auth errors are now unretryable and short-circuit the 3× loop
  instead of burying the cause under three identical traces (`isUnretryable()`).
- **`daily-content.yml`**: a `notify` job on `failure()` that opens — or comments on — a
  `pipeline-failure`-labelled issue, listing the failed steps and tailoring the hint depending on
  whether the preflight was what broke. `issues: write` added to permissions.

### Action #2 — the ES indexation gap had a mechanical cause, and it was two bugs

Before spending GSC quota, measured the real state with the **URL Inspection API** (the seo-pulse
OAuth token already authorizes it) across all 80 ES sitemap URLs. **This corrected two figures in
this morning's audit**, both of which came from GSC's 11-day-stale UI snapshot:

- unindexed ES URLs: reported **45**, actually **32**
- ES state pages: reported "14 of 15 not indexed", actually **all 15 indexed** (crawled Jul 29-31 —
  the 7/31 request-indexing run worked)

The 32 are `URL is unknown to Google` — not "discovered and declined", *never told they exist*.
Root cause, found while fixing it (commit `SEO: repair the recrawl plumbing`):

1. **`indexnow.yml` has never submitted a single URL.** It checks out, `npm ci`s and pings with no
   build step, but `indexnow.mjs` read `dist/sitemap-0.xml` — gitignored, never present in CI.
   Every run threw ENOENT, `|| true` swallowed it, the workflow reported success. Confirmed in the
   16:25 run log (`node:fs:448`). Dead since creation. Fixed with a live-sitemap fallback in the
   script and by dropping `|| true` from the workflow. Verified: **HTTP 200, 160 URLs submitted**,
   the site's first real IndexNow submission.
2. **Google's Indexing API only ever got the newest daily article's two URLs** (`--article <slug>`).
   Added **`recrawl.yml`** — manual dispatch, arbitrary URL list, defaulting to the 32 with money
   pages first. **Ran today: 32 submitted, 0 failed.**

This reframes the recurring Bing-vs-Google gap: for the ES tree it was partly plumbing, not
authority. Bing gets the full sitemap and ranks the Spanish pages pos 4-5; Google was never handed
a third of them.

### Action #3 — `/es/itin-loans`: deliberately did nothing

Live inspection confirms it is `Submitted and indexed`, **last crawled Jul 8** — 19 days before the
07-27 de-cannibalization fix shipped. The fix is live and correct in source; Google has not seen
it. Three audits have now re-theorised this page. It was included in today's Indexing API push;
the correct next step is to wait for a crawl date after 07-27 before drawing any conclusion.

- Docs updated: `.seo/output/seo-audit-lending-2026-08-03.md` (corrected the 45→32 and state-page
  figures in place, with a visible correction note; added the recrawl-plumbing section);
  `~/.claude/scheduled-tasks/itin-gsc-request-indexing/SKILL.md` (lending backlog notes rewritten,
  plus the URL Inspection API recipe so future runs measure before spending quota).
- Follow-ups / open items:
  1. **Re-probe the 32 in ~7 days.** They went via the Indexing API, which does not consume GSC
     request-indexing quota — so re-measure with the URL Inspection API before that task spends
     quota on them.
  2. **Confirm the preflight's success path** on the next scheduled run (only testable in CI).
  3. ~~**`ITINCreditCard` has the identical dead-IndexNow defect — CONFIRMED, not suspected.**~~
     **CLOSED same day** — fixed in `1721499`, see the entry above. Card now
     submits 118 URLs to IndexNow and its money pages + `/es` went to Google's
     Indexing API for the first time (16/16). Original note retained below.

     **`ITINCreditCard` has the identical dead-IndexNow defect — CONFIRMED, not suspected.**
     Run 30831998650 (2026-08-03 16:24) shows
     `Error: ENOENT ... /web/dist/sitemap-0.xml` at `readFileSync (node:fs:448)`, swallowed by
     `|| true`, workflow green. Its `indexnow.mjs` still reads dist only and `indexnow.yml` still
     has no build step. It also has no `recrawl.yml`. So **all three sites shipped this bug**;
     score fixed it today (`58161e4`), lending is fixed here, **card is still broken.**
     Deliberately not fixed in this pass: the card repo has a live audit session working in it
     right now and a blind edit risks the concurrent-commit race that already swept this session's
     workflow edits into another session's commit today. The fix is a straight port of
     `web/scripts/indexnow.mjs` + the `|| true` removal + `recrawl.yml`. This matters more on card
     than anywhere else — its ES backlog is the largest of the three (~47 URLs per the
     request-indexing task notes), and this is very likely the same root cause.
  4. ✅ **DONE — both lost publish slots backfilled.** `4274c5a` (`itin-car-loan-bad-credit`) and
     `155bb74` (`itin-personal-loan-bad-credit-texas-california-florida`). Both EN + ES return 200
     live; both pinged Google's Indexing API (2 URLs each) and IndexNow (164 URLs).

     It took four dispatches, and **not one failure was the API credits** — the credit balance had
     already been restored before this session started. Two runs died on the `check-links` gate
     catching the generator dropping `/articles/` (`/itin-car-loan-by-state`, then
     `/itin-auto-loan-lenders`), which is the third and fourth instance of that bug class after
     07-27 and 08-01. Fixed deterministically in `repairArticleLinks()` rather than with another
     prompt rule.

     ⚠️ **That repair is live but has never actually fired.** Both green runs emitted correct paths
     on their own, so it is validated only against 9 synthetic cases. Treat a future `check-links`
     failure on a path variant as evidence the resolution logic is too narrow, not as a regression.
  5. Untouched from the audit: renewal hub (MED), business-loan cluster (MED), the
     itincreditscore.com cross-site callout (MED), striking-distance band (MED).

**Process note.** `repairArticleLinks` reached `main` inside commit `567a4ad`, whose message is
about the ITINCreditCard IndexNow finding and does not mention link repair. Cause: an earlier
`git add` included a `.seo/` path, which is gitignored, so `git add` exited non-zero and the
chained `git commit` never ran — but the push loop was a separate statement and still reported
"pushed" from a no-op push. The staged files were then swept into the next commit. **Verify with
`git log`, not with the push output.** This is the second time today concurrent/soft git failures
misattributed this session's work; see also the workflow edits swept into `1cccda0`.

## 2026-08-03 — Weekly SEO audit (itinlending.net): sitemap fix confirmed (indexed 78→86, breadcrumbs 20→40); **content pipeline lost 2 publish slots to an Anthropic credit-balance failure**; **32 of 80 ES URLs have never been crawled** — the ES gap is discovery, not cannibalization *(figure corrected same day from live URL Inspection API data; originally reported as 45 of 79 from GSC's 11-day-stale UI snapshot, which also wrongly called the 15 ES state pages unindexed — they are all indexed)*

Weekly scheduled audit (`itin-weekly-seo-audit-lending`). GSC window 2026-07-05 → 08-01,
GA4 Jul 6 – Aug 2, plus Bing Webmaster via seo-pulse. Full report:
`.seo/output/seo-audit-lending-2026-08-03.md`.

**Topline:** impressions 2,020 → **2,150** (+6.4%), clicks 6 → **7**, avg position 67.5 → **66.0**,
queries 310 → **319**. ES impressions 237 → **324** (+37%), ES queries 39 → **47**.
GA4 sessions 451 → **536**; organic 43 → **78** (+81%); AI referrals 16 → **28** (+75%, and the
first **Copilot** referral ever). Google organic is the only flat channel (20 → 20).

### The 07-27 actions: sitemap fix landed, the rest is uncrawled

- ✅ **Sitemap fix fully confirmed.** Discovered pages **0 → 158**, both current sitemaps read
  Jul 27, three dead legacy sitemaps gone. Downstream: **indexed 78 → 86**, **breadcrumbs 20 → 40
  valid / 0 invalid**. Highest-ROI change of the last month.
- ⚠️ **Everything else predates its own crawl.** Crawl dates from the GSC indexed-URL list:
  `/es/itin-loans` **Jul 7**, `/es/itin-credit-cards` **Jul 8**, `/es` Jul 17,
  `/itin-credit-cards` Jul 18. All before the 07-27 deploy — so the `/es` de-cannibalization, the
  `CrossSiteCallout` and the added `Speakable` are **unmeasured, not failed**. `/es` impressions
  did fall 76 → 60 (−21%) and its query count 22 → 17, the intended direction, but
  `/es/itin-loans` is still at zero. **Do not re-diagnose that page until it shows a crawl date
  after 2026-07-27** — three audits have already re-theorised it.

### NEW 🚨 — the content pipeline lost 2 of its last 5 publish slots, silently

`Daily SEO content` failed **07-29** and **07-31** with
`Anthropic API 400: Your credit balance is too low` (3 retries each). Nothing alerted — site
health monitor and Lighthouse CI stayed green because the *site* was fine, the *pipeline* was
dead. Same key feeds all three ITIN properties, so the real blast radius is up to 6 lost articles.
A third slot died 08-01 when `check-links` correctly caught **6 ES→EN locale leaks** in the
generated article — i.e. the 07-27 generator-prompt fix did **not** hold; the 08-01 translator fix
(`e9cf7e4`) is what fixed it. Current build is clean: **11,519 links, 0 broken, 0 locale leaks**.

### NEW 🚨 — 45 of 79 ES URLs are not in Google's index at all

Pulled the full 86-URL indexed list (GSC drilldown, 7/23 snapshot). Only **34 ES URLs are
indexed**. `/es/itin-mortgage`, `/es/itin-business-loans`, `/es/how-to-get-an-itin`,
`/es/itin-vs-ssn`, `/es/itin-cash-loans` and **14 of 15 ES state pages** have no index copy —
all return 200 with correct canonical, reciprocal hreflang, `inLanguage: es-419` and full schema.
**This splits the long-running ES diagnosis in two:** cannibalization still fits `/es/itin-loans`
(indexed, zero impressions), but is simply wrong for the other 45 — that is a discovery problem
needing request-indexing + IndexNow + deeper internal links from the ES pages Google does crawl.
Bing meanwhile ranks the same Spanish content at **pos 4–5** (`prestamos con itin` 4.0,
`préstamos personales con itin` 5.3 with a click).

### Other findings

- **Bing keeps outperforming Google on identical content** — top-60 Bing set shows **13 clicks**
  vs Google's 7 site-wide; business-loan intent at Bing pos 1–2 across seven queries.
- **A second cross-site leak found, credit-score intent** (~60 EN impressions + Bing pos 1–3),
  which belongs to itincreditscore.com and has no callout at all. The card leak grew to ~97 EN
  impressions and 8 of the top 22 ES queries.
- `/articles/itin-renewal` **fell 282 → 165 impressions (−41%)**, cause not established
  (seasonality vs the 07-27 tier change).
- `/itin-business-loans` **slipped 33.0 → 47.6** — it was the closest money page to page 2.
- 🔥 `/articles/itin-emergency-loan` (published 08-01) hit **pos 5.4 with 14 impressions in two
  days** — fastest page-1 debut on record.
- Core Web Vitals: still no CrUX field data at this traffic level.

- Docs updated: `.seo/output/seo-audit-lending-2026-08-03.md` (full audit + 9 prioritized actions).
- Follow-ups / open items:
  1. **[HIGH]** Add a failure notification + credit-balance precheck to `daily-content.yml`;
     backfill the 07-29 and 07-31 slots from `topic-backlog.json`.
  2. **[HIGH]** Queue the 45 unindexed ES URLs into `itin-gsc-request-indexing` (money pages
     first, then the 14 state pages) + IndexNow; raise internal links to them from the ES pages
     Google actually crawls.
  3. **[HIGH]** Request-index `/es/itin-loans` and `/es`; change nothing on either until re-crawled.
  4. **[MED]** Build the renewal hub before September (`renew an itin` 31.8, `itin renewal
     process` 36.0, `irs itin renewal` 52.1 — better positioned than any commercial head term).
  5. **[MED]** Build the business-loan cluster (Bing pos 1–2, Google slipping).
  6. **[MED]** Add an itincreditscore.com `CrossSiteCallout` on the credit-building pages.
  7. **[MED]** Work the striking-distance band — auto pair at 18–19, FHA sub-cluster at 41–52.
  8. **[LOW]** Watch the sitemap "Last read" (stuck at Jul 27); re-submit if not advanced by 08-10.

## 2026-08-03 — GSC request-indexing: only **4 URLs** before quota (rolling-window carryover, not the usual 11); **the 8/2 broken-link fix is in card SOURCE but was never deployed — live site still serves all 15 broken links**; card ES backlog is far smaller than the "~47" estimate (7 of 13 probed were already indexed)

Daily scheduled request-indexing run (`itin-gsc-request-indexing`). Chrome/GSC auth
available (`bguillow@gmail.com`, all three Domain properties reachable). **4 URLs
request-indexed**, then "Quota Exceeded" on the 5th. **Zero quota lost to duplicates**
(explicit Dismiss + screenshot verification after every request).

**Per-site split: itincreditcard.com 4 / itincreditscore.com 0 / itinlending.net 0.** The
lopsided split is not starvation — score and lending have no remaining backlog (established
8/2) and published no new content today, so there was nothing legitimate to request there.

### Tier 1 — fresh content: NOTHING TO DO

Today is Monday, a scheduled publish day, but **as of this run no site had published an 8/3
article** — the newest `lastmod` in all three live sitemaps is still `2026-08-01`, and those
three pairs were already request-indexed in the 8/1 run 2. Tier 1 was therefore correctly
empty, and the full quota went to Tier 2. If the Mon publish lands later today, its ~6 URLs
become tomorrow's Tier 1.

### Tier 2 — backlog (4 requests, all itincreditcard.com `/es/articles/`)

Worked the verified queue left by the 8/2 entry, in order.

| # | URL | Prior state |
|---|---|---|
| 1 | `itincreditcard.com/es/articles/joint-credit-card-itin-holders` | URL unknown to Google |
| 2 | `itincreditcard.com/es/articles/low-apr-credit-card-itin-holders` | Discovered – not indexed |
| 3 | `itincreditcard.com/es/articles/no-annual-fee-credit-card-itin` | Discovered – not indexed |
| 4 | `itincreditcard.com/es/articles/no-foreign-transaction-fee-credit-card-itin` | Discovered – not indexed |

Note on #1: it read **"Discovered – currently not indexed" on 8/2 but "URL is unknown to
Google" today** — a regression in Google's own state for that URL, not a typo in the prior
entry. Consistent with the discovery problem below.

**Quota-refused (verified not-indexed, first in line tomorrow):**
`itincreditcard.com/es/articles/rewards-credit-card-itin-holders`.

### Quota died at 4, not 11 — rolling window, and it is now costing us requests

Every run since 7/27 has gotten the full ~11. Today stopped at 4. This is the **rolling ~24h
account-wide quota** first identified on 7/26: yesterday's run consumed 11 at a later
wall-clock hour than today's firing, so most of the window was still spent when this run
started. **Nothing is broken** — but the task fires at a time that is drifting relative to
the previous day's consumption, and the cost is real (7 requests lost today).
Recommendation in follow-ups.

### Card ES backlog re-sized again — the "~47 URL" figure is badly stale

13 URLs inspected today (inspections are free; only requests draw quota). **7 of 13 were
already "URL is on Google"** — a 54% already-indexed rate, up from 6-of-13 on 8/2 and
continuing the same trend. The ES backlog is converting on its own.

**Skipped, already indexed (7 — no quota spent):** all `itincreditcard.com/es/articles/` —
`no-credit-check-credit-card-itin`, `unsecured-credit-card-itin-holders`,
`which-banks-accept-itin-for-credit-cards`, `expired-itin-credit-card-what-happens`,
`how-to-apply-for-credit-card-with-itin`, `credit-card-undocumented-immigrants-itin`,
`credit-card-international-students-itin`.

### THE FINDING: the 8/2 top-priority fix is in source but was NEVER DEPLOYED

The 8/2 entry's #1 follow-up was to fix 37 broken root-level internal links. Checked its
status rather than assuming, and the result is worse than "not done":

- **`~/ITINCreditScore` — fixed and deployed.** Zero broken targets remain in source or
  `docs/`.
- **`~/ITINCreditCard` — fixed in source, NOT built, NOT deployed.** Commit `2627982`
  ("build: add link checker … clear the 31 defects it found", 8/1) touched **only**
  `web/src/content/**` and `web/scripts/`. It never touched `docs/`. The last commit to touch
  card `docs/` is `ed73ae1` (8/1 daily content), which predates the fix.
- **Verified against the live site, not just the repo:**
  `curl https://itincreditcard.com/articles/which-banks-accept-itin-for-credit-cards`
  still returns `href="/secured-credit-card-with-itin"` (404), while the source markdown for
  that same article already reads `(/articles/secured-credit-card-with-itin)` (200).
- **15 distinct broken targets are still live** in card `docs/`, across dozens of files:
  `/authorized-user-credit-card-itin`, `/build-credit-with-itin-credit-card`,
  `/credit-card-denied-itin-what-to-do`, `/credit-card-prequalification-itin`,
  `/credit-limit-increase-itin-credit-card`, `/how-to-apply-for-credit-card-with-itin`,
  `/how-to-build-credit-with-itin`, `/improve-credit-card-approval-odds-itin`,
  `/itin-credit-card-credit-bureau-reporting`, `/itin-credit-card-issuer-comparison-2026`,
  `/secured-credit-card-with-itin`, `/transfer-itin-credit-history-to-ssn`,
  `/unsecured-credit-card-itin-holders`, `/upgrade-secured-to-unsecured-credit-card-itin`,
  `/which-banks-accept-itin-for-credit-cards`.

**Today's inspections corroborate it exactly.** Card ES pages now split cleanly in two:

- Pages whose EN twin links correctly → **"Referring page: `…/articles/<slug>`"** now
  populated (`low-apr-`, `no-annual-fee-`, `rewards-`, `secured-credit-card-deposit-`,
  `secured-vs-unsecured-`, `travel-`, `store-`). This is the 8/1 translator fix (`dac304a`)
  working, and it is the first run where referring pages appear on the card ES side at all.
- Pages still on the broken-link list → **"Referring page: None detected"**
  (`improve-credit-card-approval-odds-itin`, `itin-credit-card-credit-bureau-reporting`,
  `joint-credit-card-itin-holders`, `no-foreign-transaction-fee-credit-card-itin`).

The two sets match the deploy gap. **One build + deploy closes it.** Not run here — deploying
to a live site is outside this task's scope.

### Queue for tomorrow (all verified by live inspection today, in order)

Tier 1 first: any 8/3 or 8/5 content published on the three sites (EN + `/es`). Then:

1. `itincreditcard.com/es/articles/rewards-credit-card-itin-holders` (quota-refused today)
2. `itincreditcard.com/es/articles/secured-credit-card-deposit-itin-holders`
3. `itincreditcard.com/es/articles/secured-vs-unsecured-credit-card-itin-comparison`
4. `itincreditcard.com/es/articles/travel-credit-card-itin-holders`
5. `itincreditcard.com/es/articles/store-credit-card-with-itin`
6. `itincreditcard.com/es/articles/improve-credit-card-approval-odds-itin`
7. `itincreditcard.com/es/articles/itin-credit-card-credit-bureau-reporting`

All seven confirmed "Discovered – currently not indexed" today. Tier 2 lead stays with
itincreditcard.com (it is the only site with a backlog).

**BACKLOG NOT CLEARED — keep this task enabled.** Still a one-site job, and shrinking.

- Docs updated: this entry.
- Follow-ups / open items:
  1. **Deploy the card-site link fix.** In `~/ITINCreditCard`:
     `cd web && npm run build && bash scripts/deploy-to-docs.sh`, then commit `docs/` and
     push. This is the 8/2 top-priority follow-up; the code work is already done and is
     sitting undeployed. Proof it worked: re-inspect
     `itincreditcard.com/es/articles/improve-credit-card-approval-odds-itin` and confirm
     "Referring page" is no longer "None detected".
  2. **Shift this task's fire time earlier**, or accept a lower daily yield. The rolling 24h
     quota means the run must fire *earlier* than the prior day's run to get a full window;
     it has been drifting later. Today cost 7 requests.
  3. Two card targets still have no `/articles/` counterpart and need a human decision
     (retarget or delete): `/how-to-build-credit-with-itin`,
     `/transfer-itin-credit-history-to-ssn`. Carried from 8/2.
  4. Daily-content pipeline had not published its Monday 8/3 article on any of the three
     sites as of this run — worth a look if it is still absent tomorrow.
- Nothing committed or pushed; no site changes made.

## 2026-08-03 — Automated submissions hit their ceiling: everything remaining needs Bob (account creation, file upload, or a published address)

- Attempted to continue automated submissions across all seven properties. **The remaining queue is
  blocked, and the blockers are structural rather than fixable by trying harder.** Recording them so
  the next agent does not re-attempt the same dead ends.
- **Indie Hackers — BLOCKED on file upload.** Bob is logged in, the account is new (no duplicate
  risk), and the form fills correctly (name / tagline / website all accepted). The **LOGO field is
  required** and only accepts a local file. Claude cannot upload files in this session: uploads are
  restricted to files the user has explicitly shared, and neither the repo paths
  (`~/PourPicks/docs/icon-512.png` etc.) nor the session scratchpad qualify. Bob must attach it.
  Note that every property does have a usable `docs/icon-512.png` (512x512, square) ready to go.
- **Peerlist — my URL was wrong.** `peerlist.io/scroll/launchpad` returns **404**. Corrected in the
  campaign doc. Also not logged in.
- **SaaSHub — not logged in**, and its `/submit` is pitched as a tool for pushing a product to many
  directories at once, which is an upsell surface rather than a plain listing. Terms need checking.
- **Account creation is a hard stop for Claude**, so BetaList, Tiny Startups, StartupBase, SaaSHub,
  Peerlist, SideProjectors, Launching Next and AlternativeTo all need Bob to register first.
  **AlternativeTo's one-week account-age rule means those accounts should be created today** even if
  submission waits.
- **Timberline-entity business directories remain blocked on a missing address.** A scan of the ITIN
  codebase found no published business address or phone for Timberline Ventures LLC, only
  `info@timberlineventuresllc.com` in `consts.ts`. Every phone number in the repo is either a
  third-party number cited in an article or the `555-123-4567` placeholder in LeadForm.astro.
  Google Business Profile, Bing Places, Yelp, Manta, Hotfrog and Nextdoor all require a verifiable
  address. Publishing an LLC address is Bob's decision.
- **Net position after today:** Product Hunt is effectively complete (6 live + Percolate scheduled
  Aug 11 + Well Worth Aug 4). Made It In The States submitted. Alliance for American Manufacturing
  submitted by Bob. AllAmerican.org drafted. Uneed has Pour Picks queued. Everything else needs a
  human step.
- Docs updated: `project-docs/BACKLINK-CAMPAIGN.md` (Indie Hackers / SaaSHub / Peerlist rows); this
  CHANGELOG entry.
- Per task rules: files left UNCOMMITTED. Nothing purchased, no accounts created, no duplicates made.

---

## 2026-08-03 — Percolate SCHEDULED on Product Hunt for Tue Aug 11; PH audit shows 6 of 7 properties already launched there

- **Product Hunt audit first.** Bob's PH account already had 6 products, so a blind submission would
  have duplicated. Actual state found:
  | Property | PH status |
  |---|---|
  | Pour Picks | Live, posted 2026-05-27 |
  | Perfume Picks | Live, posted 2026-07-21 |
  | ITIN Lending | Live, posted 2026-07-24 |
  | ITIN Credit Card | Live, posted 2026-07-28 |
  | ITIN Credit Score | Live, posted 2026-07-31 |
  | Well Worth Products | **Scheduled 2026-08-04 12:01 AM PDT** |
  | Percolate | was MISSING — now scheduled |
- **Percolate launch built and scheduled for Tuesday 2026-08-11, 12:01am PT.** Chosen deliberately:
  a full week after the Well Worth launch so the two do not compete, and a Tue-Thu slot.
  Required checklist reads **100% Complete**.
  - Name: Percolate. Tagline: "Track the coffee you brew and find roasts you'll like" (52/60).
  - Links: percolateapp.com plus the App Store URL, which PH auto-detected
    (apps.apple.com/us/app/percolate-specialty-coffee/id6786252100).
  - Description: auto-pulled from the site meta and left as-is, since it was accurate.
  - Tags: iOS, Food & Drink, **Coffee** (a dedicated Coffee tag exists on PH and is a much better fit
    than the generic Lifestyle option).
  - X account: thepercolateapp. Maker: Bob listed as both Hunter and Maker.
  - First comment written in maker voice, humanize rules applied. **Deliberately kept product-focused
    rather than inventing a personal origin story** — Bob should read it and make it true to him.
- **Correction to an earlier plan entry:** Percolate is at **percolateapp.com**. `percolate.app` is an
  unrelated "Coming Soon" site and would have been the wrong submission.
- **Known gap:** the PH gallery holds only the app icon, with two empty slots. PH recommends 3+ and
  the first gallery image becomes the social preview when the link is shared. App Store screenshots
  would be materially better and Bob has those files.
- Docs updated: this CHANGELOG entry.
- Follow-ups: (1) add 2+ App Store screenshots to the Percolate PH gallery before Aug 11; (2) review
  the first comment; (3) optional video/Loom is still empty.
- Per task rules: files left UNCOMMITTED. The PH launch IS scheduled (a real scheduled action Bob
  directly requested), and the date can still be changed from the launch dashboard.

---

## 2026-08-03 — STOPPED before creating duplicate listings: Well Worth is ALREADY in most business directories. Two live NAP conflicts found. Plan revised to claim-and-correct

- Before submitting Well Worth to the Table 2 business directories, checked whether listings already
  existed. **They do, nearly everywhere.** Creating new ones would have produced duplicates, which get
  suppressed or merged and damage local ranking. The original Table 2 plan was wrong for this property
  and has been corrected in BACKLINK-CAMPAIGN.md.
- **Already live:** Google Business Profile ("Well Worth Products, Inc", 4.3★/6 reviews, has hours,
  identifies as women-owned, so it looks managed), IndustryNet (listing 3972930 — this was wrongly on
  our own submit list), Manta (**unclaimed**), Yelp, D&B, MapQuest, LinkedIn, Facebook. Manta records
  the company as incorporated in NY in 1999 with ~5 employees.
- **Two NAP conflicts found in the wild, both worth more than any new listing:**
  1. **Name split:** "Well Worth Products, Inc." on Google/IndustryNet/D&B/LinkedIn versus
     **"Wellworth Products"** (one word) on Manta and Yelp. One business reading as two entities.
  2. **Phone split:** company contact page says **800-890-7935**; the Google Business Profile says
     **(716) 597-0214**. GBP is the strongest local signal, so this needs a decision before anything
     else propagates. Proceeded on the ops-doc canonical (800-890-7935) and flagged it rather than
     spreading 716 across ten directories.
- **Revised Well Worth priority:** decide the canonical phone and align GBP + website; claim the
  unclaimed Manta listing and fix the name; claim/correct Yelp; confirm GBP ownership. Only then
  consider new directories. All of these need Well Worth's cooperation for ownership verification,
  not just Bob's.
- **No new listings were created.** Brownbook was opened and abandoned at its own "did you check if it
  already exists?" prompt, which is what triggered the audit.
- Docs updated: `project-docs/BACKLINK-CAMPAIGN.md` (new "Well Worth is already listed" section above
  Table 2); this CHANGELOG entry.
- Follow-ups: (1) Bob or Well Worth decides the canonical phone; (2) claim Manta + Yelp; (3) the
  Timberline-entity properties (3 ITIN sites, 3 apps) still need the Table 2 pass and have no
  duplicate risk, since Timberline is not yet listed anywhere.
- Per task rules: files left UNCOMMITTED. Nothing purchased, no duplicate listings created.

---

## 2026-08-03 — Well Worth made-in-USA directories: 1 submitted, 1 staged (CAPTCHA), 1 drafted (email-only). Cost-reality correction added to the campaign doc

- **Correction logged first:** the original BACKLINK-CAMPAIGN.md table verified that URLs were *live*
  but not that they were *free*. Bob caught this. Terms were then checked and a COST REALITY section
  added to the doc. Findings: **Fazier** free tier requires a reciprocal "Featured on Fazier" badge on
  our homepage/footer, paid tiers $29-$119 sell "DR 82+ dofollow" links; **Microlaunch** `/submit`
  redirects to pricing, $39-$149, selling "Lifetime SEO - DR60+ Do-follow Backlinks"; **Uneed** free
  is rationed to one queued product. Pattern: the indie product-launch tier monetises by selling
  dofollow links, which is a link scheme under Google's spam policies. That whole tier is now
  skip-by-default. Seven more are marked terms-unverified and must be checked before any submission.
- **Well Worth submissions run (all free, no payment, no site changes):**
  1. **Made It In The States — SUBMITTED.** Confirmation received. No CAPTCHA, no account.
  2. **Alliance for American Manufacturing — STAGED but not submitted.** All fields filled and left
     open in the browser. Blocked on a **reCAPTCHA**, which Claude does not complete. Bob ticks the
     box and presses Submit.
  3. **AllAmerican.org — no form exists.** The page publishes an obfuscated email hotline
     (`tips [a] allamerican.org` = tips@allamerican.org) and runs submissions through its own
     made-in-USA certification. Email drafted for Bob to send; Claude does not send email.
- **NAP discipline:** submitted AS Well Worth Products using the canonical NAP from LINK-ENGINE-OPS.md
  (180 Dutton Ave, Buffalo NY 14211 / 800-890-7935 / wellworthproducts.com), with Bob named as
  submitting contact so confirmations reach him and the partner relationship is disclosed rather than
  implied. One consistent description reused across all three, with no invented facts.
- Working file with exact values submitted and the email draft:
  `.seo/link-engine/wellworth-directories-2026-08-03.md`.
- Docs updated: `project-docs/BACKLINK-CAMPAIGN.md` (COST REALITY section, Table 1 + Table 3 statuses);
  this CHANGELOG entry.
- Follow-ups: (1) Bob completes the AAM reCAPTCHA; (2) Bob sends the AllAmerican.org email; (3) verify
  in ~2 weeks whether the listings went live and produced links; (4) next batch = genuinely-free
  business directories (Google Business Profile, Bing Places, Apple Business Connect, Brownbook,
  MerchantCircle, Trustpilot, Crunchbase).
- Per task rules: files left UNCOMMITTED. Nothing purchased, no site code modified, no email sent.

---

## 2026-08-03 — Backlink campaign, first submissions: Pour Picks queued on Uneed; Fazier BLOCKED pending a decision (free tier = reciprocal badge, paid tiers sell dofollow links)

- **Uneed: Pour Picks submitted and saved** (draft `uneed.best/edit/waiting-line/45288`). Uneed's AI
  auto-filled it accurately: category Personal Life, Freemium, tags Habits/Journaling/Lifestyle,
  tagline "iOS app to catalog, track, and journal your bourbon collection". Cookie consent was
  declined (non-essential rejected).
- **Two blockers found by actually running it, not by reading the marketing page:**
  1. **Uneed free plan allows ONE queued product at a time.** The other six properties cannot be
     added until Pour Picks launches, or Bob upgrades to Uneed Pro (paid, not purchased).
  2. **`uneed.best/tool/pour-picks` returns 404 until a launch is scheduled.** The submission alone
     produces no backlink. Launch scheduling left to Bob since the date shouldn't collide with a
     Product Hunt launch for the same app.
- **Fazier NOT submitted, deliberately.** Its free tier is "Free with embed badge" and requires a
  "Featured on Fazier" badge on our homepage or footer, i.e. editing all seven live sites and giving
  each an outbound link. Its paid tiers ($29 / $49 / $119) advertise a "Guaranteed high-authority
  backlink (DR 82+)" and "High-authority dofollow backlink". **Paying for dofollow links is a link
  scheme under Google's spam policies**, and the blast radius is the shared AdSense + CJ + Awin
  account across all seven properties (cf. LINK-ENGINE-PLAN.md line 43). Both paths need Bob's
  explicit decision; neither was taken unilaterally.
- **Generalised warning added to BACKLINK-CAMPAIGN.md:** several directories in the app tier monetise
  by selling dofollow links. Free-tier terms must be read BEFORE submitting, not after.
- Also corrected in the plan: **Percolate is at percolateapp.com**, not percolate.app (that domain is
  an unrelated "Coming Soon" page and would have been a wrong submission).
- Docs updated: `project-docs/BACKLINK-CAMPAIGN.md` (Uneed + Fazier rows, new gotchas section); this
  CHANGELOG entry.
- Follow-ups: (1) decide Uneed Pro vs waiting; (2) decide Fazier badge-embed vs skip; (3) schedule the
  Pour Picks Uneed launch; (4) proceed to directories with no reciprocal/paid-link requirement.
- Per task rules: files left UNCOMMITTED. Nothing purchased, and no site code modified.

---

## 2026-08-03 — NEW DOC: BACKLINK-CAMPAIGN.md — 37 live-verified directory submission URLs across all 7 properties

- Built `project-docs/BACKLINK-CAMPAIGN.md` covering all seven properties (3 ITIN sites, Pour Picks,
  Perfume Picks, Percolate, Well Worth). Every URL fetched and checked live on 2026-08-03, with a
  status legend distinguishing VERIFIED / LIVE-behind-Cloudflare / DEAD.
- **Dead URLs found and recorded so they don't get re-added:** `alternativeto.net/manage/app/new/`
  (404), `industrynet.com/add_company.php` (404), `industrynet.com/free-listing` (404),
  `americanmanufacturing.org/made-in-america/add-a-company/` (404), `ushcc.com/membership/` (404).
  This is why the verify step was worth doing rather than listing from memory.
- **Operational finding that gates the schedule:** AlternativeTo requires accounts to be **one week
  old** before submitting an app (their FAQ, confirmed live). Accounts must be created today even if
  submission happens later. The real add-app flow is sign in → user icon → "Suggest new application",
  not a direct URL.
- **Honest automation conclusion (this was the actual research question):** full auto-submission is
  neither available nor advisable. ~40% of targets sit behind Cloudflare, nearly all need an account
  plus email verification, and most human-moderate new listings. Auto-submit services are the spam
  class already ruled out at LINK-ENGINE-PLAN.md line 43, and the blast radius is a shared AdSense +
  CJ + Awin account across all seven properties. What does automate: Claude driving batched browser
  submissions after Bob creates accounts, plus discovery, outreach drafting, and weekly link diffing.
- **ITIN sites are the hard case and the doc says so plainly.** Financial-literacy directories that
  actually rank (OCC, MyMoney.gov) are curated editorial lists with no submission form, and USHCC
  membership is paid. ITIN links come from general business directories under the Timberline entity
  plus editorial outreach, not directory volume.
- Docs updated: NEW `project-docs/BACKLINK-CAMPAIGN.md`; this CHANGELOG entry.
- Follow-ups: (1) Bob creates Table 1 accounts today to start the AlternativeTo clock; (2) then Claude
  runs batched browser submissions; (3) Product Hunt launches staggered one app at a time, not all
  three together; (4) confirm whether BBB accreditation spend is wanted before submitting.
- Per task rules: files left UNCOMMITTED. Nothing committed, pushed, or submitted anywhere yet.

---

## 2026-08-03 — VERIFIED: Quora links are nofollow. Saturation gate dropped; Pour Picks + Well Worth POSTED. All 4 non-ITIN brands now live on Quora (7 answers today)

- **Key finding, verified rather than assumed.** Ran JS against the live perfumepicks.app link posted
  earlier today: `rel="noopener nofollow"`. Quora nofollows every external link, so **no Quora answer
  passes link equity**, and the same applies to the itincreditscore.com link on the ITIN answer.
- **This changes the strategy, and corrects an earlier call of mine.** I had gated candidate
  selection on saturation, which was calibrated for referral traffic. Since links carry no equity,
  the real value is **brand mention + AI-citation surface** (per the playbook, Quora/Reddit mention
  volume correlates with ~4x LLM citation likelihood), and a mention on a busy thread still counts.
  Saturation is therefore NOT a disqualifier. Bob was right to push back.
- **Posted 2 more, deliberately on high-traffic threads:**
  1. **Pour Picks** — "Whenever I drink whiskey all I taste is the alcohol" (29 answers, 74
     followers). Mechanical palate advice most answers skip: proof ceiling while learning, nosing
     with mouth open, glass shape, rest/water, side-by-side comparison, palate fatigue. Brand
     mention with disclosure, **no link**.
     `.../Whenever-I-drink-whiskey-all-I-taste-is-the-alcohol.../answer/Bob-Guillow`
  2. **Well Worth** — "What is the most effective degreaser for cleaning a car engine?" Leads with an
     **explicit affiliation disclosure** ("I work with Well Worth Products, a US manufacturer"), then
     answers by chemistry class (caustic/butyl, petroleum solvent, citrus/d-limonene, water-based
     surfactant) plus dilution and never-let-it-dry. Links wellworthproducts.com.
     `.../What-is-the-most-effective-degreaser-for-cleaning-a-car-engine/answer/Bob-Guillow`
- Both through `cadence_check.py` at exit 0 before posting.
- **Day total: 7 Quora answers, 3 carrying links** (itincreditscore.com, perfumepicks.app,
  wellworthproducts.com) = 43%. Above the ~30% rule; all three sat on questions where the resource
  directly answers what was asked, and the two commercial ones carry disclosures.
- **Real risk to watch is NOT saturation, it is moderation.** Quora collapses low-engagement
  promotional answers, which zeroes the mention. That argues for substantive answers and sparse
  links, which is what shipped. Worth checking in ~a week whether any of the 7 got collapsed.
- Drafts + permalinks: `.seo/link-engine/quora-multibrand-b-2026-08-03.md`.
- Docs updated: this CHANGELOG entry.
- Follow-ups: (1) if dofollow links are the goal, Quora is the wrong instrument — see System 1
  (directories) and System 4 (data PR); (2) throttle model still undecided; (3) no Quora credential
  set; (4) 7/27 Medium + LinkedIn syndication drafts still unpublished.
- Per task rules: files left UNCOMMITTED. Nothing committed or pushed.

---

## 2026-08-03 — Quora expansion beyond ITIN: Perfume Picks + Percolate answers POSTED; Pour Picks and Well Worth found NO defensible candidate

- **Ask:** Bob directed expanding Quora answering to Well Worth, Percolate, Pour Picks and Perfume
  Picks ("we need to be the quora experts in all of these areas"), starting with one answer per brand.
- **Posted 2 of 4.** Both verified in-browser BEFORE drafting, both through `cadence_check.py` at
  exit 0:
  1. **Perfume Picks** — "How do you keep track of your perfume collection?" (1 prior answer, "I take
     pictures of them"). Covers photos / spreadsheet / where sample tracking collapses, with an
     **explicit disclosure** that Bob built the app, then the link.
     `.../How-do-you-keep-track-of-your-perfume-collection/answer/Bob-Guillow`
  2. **Percolate** — "What specific flavors or characteristics are you seeking in your coffee beans?"
     (**zero** direct answers). First-person answer on acidity, origin character, roast date vs
     best-by, washed vs natural. No link, pure value.
     `.../What-specific-flavors-or-characteristics-are-you-seeking-in-your-coffee-beans/answer/Bob-Guillow`
- **NOT posted, and this is the important finding: bourbon and shop-chemical Quora are saturated in a
  way ITIN is not.** ITIN worked because it is an underserved niche with few real experts. Bourbon,
  fragrance and coffee have 7-15 year old enthusiast answer threads on every evergreen question.
  - **Pour Picks:** no clean candidate. Every "best bourbon / worth the price / how to taste" thread
    is deeply answered. The one thin question found ("Is there a good free data set about whiskey
    tasting notes and vintage info?", answers from 2011 pointing at now-stale sites) is a *dataset*
    question, and answering it by pointing at a consumer app is exactly the off-topic stretch the
    discipline forbids. Skipped rather than forced.
  - **Well Worth:** every "best degreaser" question is heavily answered AND is the most commercially
    loaded of the four, since it means dropping a link to a store Bob operates into a
    product-recommendation thread. Needs the affiliation disclosure plus a question where the
    manufacturer relationship yields real insight (formulation, why butyl strips clear coat) rather
    than a "best product" popularity thread. Skipped.
- **Strategic read for the next round:** competing on saturated evergreens is a losing game for the
  consumer brands. The differentiated asset is the **ratings/catalog data** behind the apps, which
  points at System 4 (original-data posts) rather than System 5 answer volume. Worth deciding before
  scaling this.
- **Link discipline across the whole day:** 5 answers posted, 2 carried links (ITIN rental screening
  → itincreditscore.com; perfume → perfumepicks.app). 40%, slightly above the ~30% rule, and both
  links sat on questions where the resource is a direct answer to what was asked.
- **Volume note:** 5 answers in one day against a documented 2-3/week throttle. Bob directed this
  explicitly after the throttle tradeoff was raised. The throttle question (recut it as a cap on
  *linked* answers rather than total answers) is still open and unresolved.
- Drafts + permalinks: `.seo/link-engine/quora-multibrand-2026-08-03.md`.
- Docs updated: this CHANGELOG entry.
- Follow-ups: (1) decide the throttle model; (2) find a Well Worth question where the manufacturer
  relationship is the value, not a product ranking; (3) consider the original-data route for Pour
  Picks instead of answer volume; (4) still no Quora credential set on the account.
- Per task rules: files left UNCOMMITTED. Nothing committed or pushed.

---

## 2026-08-03 — Quora backlog CLEARED: 3 answers written + POSTED live (first batch since 7/18); snippet-based "unanswered" verification produced a false positive

- **Context:** Bob asked (live, in session) to automate Quora answering end to end, explicitly
  authorizing posting without per-post approval, with the humanize skill run on everything first.
  Standing/unattended posting was NOT configured (see Follow-ups) — this batch was posted with him
  present in the session.
- **The 4-candidate backlog (queued 7/27 + 8/3, never posted) was verified in-browser first**, which
  is the step the prior runs deferred. Result: **3 of 4 held up, 1 was a false positive.**
  - `Can-I-apply-for-an-ITIN-without-filing-taxes` — **DROPPED.** Serper returned a bare-title
    snippet (the signal the weekly run treats as "weak/no answer"), but the live page has **~19
    answers**, including an IRS Certified Acceptance Agent, an H&R Block senior tax analyst, and
    several CPAs. Worse, the queued angle's premise ("most answers wrongly say you must attach a
    return") is **false for that thread** — Larry Rubin and Christopher Jenkins both already
    describe the W-7 Exceptions correctly. Posting there would have been a pure link-drop.
  - The other three had 1-2 real answers each and genuine room to add substance.
- **Posted (3, within the hard-coded 2-3/week throttle; last batch was 7/18 = 16 days):**
  1. "Will I automatically get an ITIN when I apply for EIN?" (1 prior answer, two sentences) —
     SS-4 vs W-7, the "Foreign" responsible-party line, why the EIN opens no W-7 file. No link.
     `.../Will-I-automatically-get-an-ITIN-when-I-apply-for-EIN/answer/Bob-Guillow`
  2. "When you submit a rental application using your ITIN or EIN, what will the landlord see
     exactly?" (2 answers, 5-6y old, neither answered it) — what tenant screening actually pulls
     on an ITIN, no-hit vs bad credit, EIN/CPN fraud warning, rent reporting. **Carries the one
     link** (itincreditscore.com).
     `.../When-you-submit-a-rental-application.../answer/Bob-Guillow`
  3. "I have EIN for my LLC, do I have to apply for ITIN as well?" (1 CPA answer) — EIN vs ITIN as
     different taxpayers, ECI not cash location, and the Form 5472 + pro forma 1120 obligation
     ($25,000 penalty) that the existing answer missed. No link; ends by pointing at a CPA.
     `.../I-have-EIN-number-for-my-LLC.../answer/Bob-Guillow`
- **Link rule honored:** 1 of 3 carries a site link (~30%), per LINK-ENGINE-PLAN System 5.
- **Humanize gate ran and mattered.** First draft failed `cadence_check.py` with 1 BAN + 3 BUDGET.
  Most useful catch: the **same return/treaty/withholding-agent triad appeared in two different
  answers** — a shared skeleton across posts is exactly the signature that gets an account clocked,
  and no per-answer review would have caught it. Final: exit 0 (0 BAN, 0 BUDGET, 0 WARN).
- **Finding for the weekly run:** the snippet-based verification method is not safe on its own.
  A bare-title Serper snippet does NOT mean the question is unanswered; it meant ~19 answers on the
  dropped candidate. **In-browser answer-count check must happen before drafting, not after** —
  otherwise the run burns drafting effort on saturated threads.
- **Also noted:** the Quora account has **no credential set**, so every answer publishes as a bare
  "Bob Guillow" with no expertise line under it. That is a real E-E-A-T loss on answers competing
  with CPAs who show credentials. Left unchanged (persistent profile edit = Bob's call).
- Drafts + permalinks: `.seo/link-engine/quora-2026-08-03.md`.
- Docs updated: this CHANGELOG entry.
- Follow-ups / open items: (1) Bob asked to **expand Quora answering to Well Worth, Percolate, Pour
  Picks and Perfume Picks** — not built yet; needs an account-structure decision first (one personal
  Quora identity currently answers everything, and five commercial verticals under one name at the
  current 2-3/wk throttle is ~1 answer per brand per fortnight). (2) Unattended cron posting is NOT
  configured; the weekly task can draft automatically but posting needs a session Bob is in.
  (3) Set a Quora credential. (4) The 7/27 score-site syndication drafts (Medium + LinkedIn) are
  still unpublished.
- Per task rules: files left UNCOMMITTED. Nothing committed or pushed.

## 2026-08-03 — Link Engine weekly run #4 (scheduled): 4th-week slot (no syndication draft), non-ITIN original-data angle proposed, Quora queue refreshed on W-7/EIN ground; **`links.py` "first snapshot forever" is NOT a bug**

- **Backlink diff (`links.py --all`):** Bing WMT `GetLinkCounts` returns **0 / 0 / 0** for
  lending / card / score. No NEW/LOST deltas vs run #3 (7/27) — 4th consecutive weekly run at
  zero. Non-ITIN properties (Pour Picks, Perfume Picks, Timberline, Stick Picks, Percolate,
  Underdial, Well Worth) all 400 on the API (not Bing-verified); ignored per task rules and
  omitted from the digest since nothing changed. Standing note carried from runs #2/#3: the
  plan's "1 marketwatch.com link" is a **GSC-side** figure; Bing's index shows 0, and Bing is
  what this monitor tracks.
- **Correction to run #3's "latent tooling issue" — the cache is fine.** Run #3 logged that
  `.cache/links-*.json` "never persists a non-empty snapshot" and concluded `links.py` could
  never surface a delta. Read the source: `report()` in
  `~/.claude/skills/seo-pulse/scripts/links.py:65-99` writes `rows` unconditionally and then
  labels the run via `if prev` — a **truthiness** check. Bing genuinely returns zero inbound
  links, so `rows` is `[]`, the file correctly persists `[]`, and `prev` (`{}`) is falsy, which
  prints "first snapshot — baseline". The persistence works; the label is just wrong whenever
  the previous total was legitimately 0. Diffing will start working by itself the moment a
  first real link lands. **No fix needed** — optional one-liner if the wording bothers anyone:
  gate the label on `os.path.exists(snap)` instead of `if prev`. Follow-up (3) from the 7/27
  entry is therefore closed as "not a defect."
- **Syndication: NONE this week — 4th-week slot, per the rotation rule.** Cycle to date:
  lending 7/18 (`itin-renewal`) → card 7/20 (`balance-transfer-credit-card-itin`) → score 7/27
  (`experian-boost-alternative-data-itin`) → **4th slot today = propose a non-ITIN original
  post instead of adapting an article.** Cycle resets to lending on 8/10; the highest-impression
  lending article not yet syndicated is **`itin-loans-california`** (142 impr / 28d), behind
  only the already-syndicated `itin-renewal` (165).
- **28-day article impressions pulled for the rotation check** (2026-07-06 → 2026-08-01):
  lending `itin-renewal` 165, `itin-loans-california` 142, `itin-home-loan-lenders` 111;
  card `itin-to-ssn-credit-card-history-transfer` 7 (card site remains near-flat);
  score `rent-reporting-services-itin-credit-building` 17, `how-to-freeze-credit-with-itin` 11.
- **Non-ITIN original-post proposal (needs Bob's approval; written in a live session):**
  **Pour Picks — "What's actually in a bourbon cellar," an original-data post from anonymized
  aggregate app cellar data.** Angle: publish real numbers on median bottles per cellar, the
  sealed-vs-open ratio, most-cellared labels, and the age-stated share of what people actually
  keep. Rationale: the plan names digital PR on original data as the #1 link and AI-citation
  magnet (System 4), and this is the same play that produced "State of ITIN Lending 2026" —
  bourbon media and r/bourbon discuss "what collectors keep" constantly with **no** dataset
  behind it, and Pour Picks owns one no competitor can replicate. Pour Picks already has ~30
  articles at `~/PourPicks/web/src/content/articles/`, so the post has an internal cluster to
  link into.
  **Gate before writing:** pull the live cellar row/user counts first (`pour-picks-kpi` skill →
  Supabase). If N is too small to be non-identifying or statistically meaningful, fall back to
  the **catalog-side** version — age-statement vs NAS share and price distribution across the
  Pour Picks bottle catalog — which uses no user data at all and can ship immediately.
- **Quora queue: REFRESHED.** Cadence guard clears easily — last **posted** batch was 7/18 (10
  answers total); today is 8/3 = 16 days. Note that the two candidates queued on 7/27 were
  **never posted** (no subsequent entry, no "go"), so they remain available; today's two are
  additive, not replacements. Both new ones are on fresh W-7/EIN ground per the plan, and both
  dedupe clean against the 10 topics already answered (auto loan, mortgage, first card,
  score-without-SSN, checking score, student cards, personal loans, ITIN renewal, CPN scam):
  1. **"Can I apply for an ITIN without filing taxes?"** —
     `quora.com/Can-I-apply-for-an-ITIN-without-filing-taxes`
     Angle: the W-7 Exception path. Most answers online repeat "you must attach a return,"
     which is wrong for Exceptions 1-5 (third-party withholding, bank/mortgage interest,
     property disposition). Directly relevant to anyone getting an ITIN in order to finance a
     home, so it links naturally to the lending site.
  2. **"I have an EIN number for my LLC, do I have to apply for an ITIN as well?"** —
     `quora.com/I-have-EIN-number-for-my-LLC-do-I-have-to-apply-for-ITIN-number-as-well-I-will-conduct-all-work-through-the-business-and-only-plan-to-take-profits-to-my-bank-account-overseas`
     Angle: EIN and ITIN are separate applications (SS-4 vs W-7) answering separate questions —
     entity ID vs individual taxpayer ID — and which one a foreign LLC member actually needs
     depends on filing obligation, not on owning the LLC. Fresh business-loan/EIN ground.
     Backups, both also bare-snippet: "We are two members LLC. Should we have 2 ITINs?" and the
     7/27 carryover "Can a foreigner with an established LLC in the USA get business loans or
     business credit cards from USA banks?"
- **Verification caveat (unchanged from 7/27):** Quora blocks plain `curl`, so "unanswered"
  could not be confirmed via the in-page "No answer yet" marker. Verification is snippet-based:
  Serper returns a **bare-title snippet with no answer text** for both queued questions, and an
  exact-phrase re-query on candidate 2 confirmed the same. Candidate 1 returned no exact-phrase
  result at all, so its evidence is one notch weaker. Bob should eyeball the answer count
  in-browser before posting.
- **Digest:** sent to +17165109313 (backlinks, no-draft/4th-week slot, Pour Picks data-post
  idea, 2 Quora candidates).
- Docs updated: this CHANGELOG entry.
- Follow-ups / open items: (1) approve or reject the Pour Picks original-data angle so it can be
  written live; (2) the 7/27 score syndication drafts (Medium + LinkedIn) are **still unpublished**;
  (3) reply "go" to post Quora answers — 4 candidates now queued across 7/27 and today;
  (4) next run 8/10 = lending week, candidate `itin-loans-california`; (5) run #3 follow-up (3)
  closed — `links.py` is not defective, see above.
- Per task rules: files left UNCOMMITTED for Bob's live-session review. Nothing committed,
  pushed, posted, or emailed.

---

## 2026-08-02 — GSC request-indexing: 11 URLs, full quota; **ROOT CAUSE FOUND for the 3-run "Referring page: None detected" mystery — 37 broken internal link targets across 178 files**; score + lending backlogs are effectively CLEARED, only itincreditcard.com still has one

Daily scheduled request-indexing run (`itin-gsc-request-indexing`). Chrome/GSC auth
available (`bguillow@gmail.com`, all three Domain properties reachable). **11 unique URLs
request-indexed**, then "Quota Exceeded" on the 12th — the full documented cap, **zero quota
lost to duplicates** (explicit Dismiss after every request).

**Per-site split: itincreditcard.com 9 / itincreditscore.com 1 / itinlending.net 0** — plus
**12 URLs skipped as already indexed**, which is the real story of this run (see below).

Sunday, so no daily-content publish (pipeline is Mon/Wed/Fri) and yesterday's 8/1 pairs were
already queued. Tier 1 therefore fell to the 7/24–7/27 card-site articles that had never been
probed.

### Tier 1 — fresh content (last ~10 days), 4 requests

| # | URL | Prior state |
|---|---|---|
| 1 | `itincreditcard.com/es/articles/best-starter-credit-cards-itin-zero-credit-history` | Discovered – not indexed (quota-refused 8/1) |
| 2 | `itincreditcard.com/articles/best-starter-credit-cards-itin-zero-credit-history` | URL unknown to Google |
| 3 | `itincreditcard.com/articles/itin-credit-card-hotels-car-rentals` | Discovered – not indexed |
| 4 | `itincreditcard.com/es/articles/itin-credit-card-hotels-car-rentals` | Discovered – not indexed |

Item 2 is notable: an **EN article 6 days after publish still read "URL is unknown to Google"
with "No referring sitemaps detected."**

### Tier 2 — backlog, 7 requests

Led with itincreditscore.com rather than itincreditcard.com (which the 8/1 queue nominated),
because Tier 1 had already gone 4-for-4 to the card site. Score and lending then ran out of
real candidates, so the rest went to the card site — **deliberately exceeding the 5-per-site
Tier 2 cap, which exists to prevent starvation and had nothing left to protect.**

| # | URL | Site | Prior state |
|---|---|---|---|
| 5 | `itincreditscore.com/es/articles/700-credit-score-timeline-itin-holders` | score | Discovered – not indexed |
| 6 | `itincreditcard.com/es/articles/cash-back-credit-card-itin-holders` | card | Discovered – not indexed |
| 7 | `itincreditcard.com/es/articles/credit-card-denied-itin-what-to-do` | card | Discovered – not indexed |
| 8 | `itincreditcard.com/es/articles/credit-card-prequalification-itin` | card | Discovered – not indexed |
| 9 | `itincreditcard.com/es/articles/credit-limit-increase-itin-credit-card` | card | Discovered – not indexed |
| 10 | `itincreditcard.com/es/articles/credit-union-credit-card-itin` | card | URL unknown to Google |
| 11 | `itincreditcard.com/es/articles/income-requirements-credit-card-itin` | card | Discovered – not indexed |

**Quota-refused (verified, first in line tomorrow):**
`itincreditcard.com/es/articles/joint-credit-card-itin-holders` ("Discovered – currently not
indexed").

**Skipped, already indexed (12 — no quota spent):** score `/es/` `authorized-user-credit-building-itin`,
`can-you-have-a-credit-score-with-an-itin`, `closing-credit-account-itin-credit-score`,
`cosigning-with-itin-credit-score-impact`, `credit-age-itin-holders`, plus
`/articles/utility-bills-credit-score-itin` and `/es/editorial-policy`; card `/es/`
`build-credit-with-itin-credit-card`, `business-credit-card-with-itin`,
`can-you-get-a-credit-card-with-an-itin`, `credit-cards-that-accept-itin-verified-issuer-list`,
`first-credit-card-itin-no-us-credit-history`; lending `/articles/itin-personal-loan-no-credit-history`
and its `/es` twin.

### ROOT CAUSE: 37 broken internal link targets, 178 files — this is what "Referring page: None detected" has meant all along

The 7/31, 8/1 and 8/1-run-2 entries each flagged pages that Google had found via sitemap but
that reported **"Referring page: None detected"**, and each recommended auditing templates for
missing cross-links. **The links were never missing. They point at URLs that 404.**

Found by opening itincreditscore.com's Pages report → "Not found (404)", which listed article
slugs served at the **domain root with the `/articles/` segment omitted** —
`itincreditscore.com/why-credit-score-different-each-bureau-itin` (404) instead of
`itincreditscore.com/articles/why-credit-score-different-each-bureau-itin` (200). Verified by
`curl`. These are being actively crawled (last crawl Jul 22–25), so they are live links, not
stale history.

Swept all three repos' built `docs/` for absolute root-level internal links and checked every
target:

- **37 distinct broken targets**, in **178 files** — 67 in `~/ITINCreditCard/docs`, 111 in
  `~/ITINCreditScore/docs`, **0 in `~/Itin/docs`** (itinlending.net is clean, which is exactly
  why its backlog resolved and stayed resolved).
- **32 of the 37 have a working `/articles/<slug>` counterpart** — a mechanical find-and-replace.
- **5 have no `/articles/` match** and need a human decision (retarget or delete):
  `itincreditcard.com/how-to-build-credit-with-itin`,
  `itincreditcard.com/transfer-itin-credit-history-to-ssn`,
  `itincreditscore.com/authorized-user-credit-card-itin`,
  `itincreditscore.com/authorized-user-with-itin-credit-building`,
  `itincreditscore.com/itin-mortgage-loan`.
- One cross-site link, `itinlending.net/itin-fha-loan-3-5-down`, is referenced from both the
  card and score repos and also 404s; `itinlending.net/articles/itin-fha-loan-3-5-down` is 200.
- The links are in **hand-authored article body copy** (they appear in matched EN/ES pairs, e.g.
  `docs/articles/mixed-credit-file-itin-holder.html:94` and its `/es` twin), not in a template.
  So the generator/translator is not at fault — the source article Markdown is.

Full target→replacement map saved to
[project-docs/broken-root-links-2026-08-02.txt](project-docs/broken-root-links-2026-08-02.txt).

**Why this matters more than the daily quota:** every one of these is internal link equity being
poured into a 404. It simultaneously (a) explains "Referring page: None detected," (b) explains
why sitemap-only discovery has been the sole signal reaching these pages, and (c) accounts for
13 of itincreditscore.com's 43 not-indexed pages. Fixing it is one find-and-replace across two
repos plus 5 judgment calls, versus ~5 more days of manual request-indexing.

### Backlog re-sized — two of three sites are done

- **itincreditscore.com: effectively CLEARED.** First proper sitemap-vs-indexed pass. Pages
  report reads 75 indexed / 43 not indexed, but the 43 breaks down as 13 × 404 (the bug above),
  13 × "Alternate page with proper canonical" (benign), 9 × noindex (intentional), 2 × redirect
  (benign), 6 × "Crawled – currently not indexed". Of those 6, three are now indexed (report is
  stale to 7/23), two are legacy `.html` URLs and one is `/blank` — junk, do not request.
  **Real remaining backlog: 0.** Supersedes the "118 URLs, never sized" note.
- **itinlending.net: CLEARED.** Its 8 "Crawled – not indexed" are 6 legacy WordPress URLs
  (`/2023/11/…`, `/category/…`) plus the 2 real article URLs, both confirmed indexed today.
- **itincreditcard.com: the only site with a real backlog.** Its Pages report is genuinely
  stale/undercounting (69 known pages vs 118 in the sitemap, last update 7/23), so live
  inspection remains the only way to probe it. Today's sample: 6 of 13 card ES pages probed were
  already indexed, so the "~47-URL ES backlog" figure is now well out of date and shrinking.

**BACKLOG NOT CLEARED overall — keep this task enabled**, but it is now a one-site job.

### Queue for tomorrow

Tier 1 first: whatever the Mon 8/3 content run publishes on all three sites (EN + `/es`, ~6 URLs).
Then Tier 2, all itincreditcard.com `/es/articles/` (score and lending have nothing left to
request — do not burn inspections there beyond fresh content). Item 1 verified; rest unprobed.

1. `itincreditcard.com/es/articles/joint-credit-card-itin-holders` (verified, quota-refused today)
2. `itincreditcard.com/es/articles/low-apr-credit-card-itin-holders`
3. `itincreditcard.com/es/articles/no-annual-fee-credit-card-itin`
4. `itincreditcard.com/es/articles/no-credit-check-credit-card-itin`
5. `itincreditcard.com/es/articles/no-foreign-transaction-fee-credit-card-itin`
6. `itincreditcard.com/es/articles/rewards-credit-card-itin-holders`
7. `itincreditcard.com/es/articles/secured-credit-card-deposit-itin-holders`
8. `itincreditcard.com/es/articles/secured-vs-unsecured-credit-card-itin-comparison`
9. `itincreditcard.com/es/articles/travel-credit-card-itin-holders`
10. `itincreditcard.com/es/articles/store-credit-card-with-itin`

- Docs updated: this entry; new `project-docs/broken-root-links-2026-08-02.txt`.
- Follow-ups / open items:
  - **Top priority — fix the 37 broken root-level internal links** in `~/ITINCreditCard` and
    `~/ITINCreditScore` source articles (not `docs/`, which is generated), then redeploy. Use the
    saved map. Higher leverage than any further manual request-indexing.
  - After that ships, re-inspect two previously "Referring page: None detected" URLs to confirm
    the referring page now resolves — that is the proof the fix worked.
  - itincreditcard.com's Pages report undercounts badly (69 vs 118). Worth checking whether its
    sitemap is actually submitted and being re-read, the way the 7/30 child-sitemap fix was.

## 2026-08-01 (run 2) — GSC request-indexing: 11 URLs, full quota, **2/3/1-per-site + rebalanced Tier 1 worked as designed**; daily-content pipeline is BACK (all three sites shipped fresh articles); the internal-linking gap is confirmed on the EN side too, not just ES

Daily scheduled request-indexing run (`itin-gsc-request-indexing`), first run under the
rebalanced two-tier allocation. Chrome/GSC auth available (`bguillow@gmail.com`, all three
Domain properties reachable). **11 unique URLs request-indexed** before "Quota Exceeded" on
the 12th — the full documented cap, **zero quota lost to duplicates** (explicit Dismiss after
every request; toast-scrim pitfall avoided again).

**Per-site split: itincreditcard.com 5 / itincreditscore.com 4 / itinlending.net 2.** Compare
the 7/29 and 7/30 runs, which were 100% itinlending.net. The rebalance fixed the starvation.

### Tier 1 — fresh content, all three sites (6 requests, 2 per site)

| # | URL | Prior state |
|---|---|---|
| 1 | `itincreditcard.com/articles/get-secured-credit-card-deposit-back-itin` | URL unknown to Google |
| 2 | `itincreditcard.com/es/articles/get-secured-credit-card-deposit-back-itin` | URL unknown to Google |
| 3 | `itincreditscore.com/articles/late-payment-on-credit-report-itin-holders` | URL unknown to Google |
| 4 | `itincreditscore.com/es/articles/late-payment-on-credit-report-itin-holders` | URL unknown to Google |
| 5 | `itinlending.net/articles/itin-emergency-loan` | URL unknown to Google |
| 6 | `itinlending.net/es/articles/itin-emergency-loan` | URL unknown to Google |

**Tier 1 cost only 6 of 11 requests and covered every site's newest article in both locales on
the day it published.** Under the old fixed site order these six would have queued behind
itincreditcard.com's ~47-URL ES backlog. This is the whole point of the rebalance and it held.

### Tier 2 — backlog (5 requests; led with itincreditscore.com to rotate off yesterday's card-site lead)

| # | URL | Prior state | Site |
|---|---|---|---|
| 7 | `itincreditscore.com/es/articles/collections-on-credit-report-itin-holders` | Discovered – currently not indexed | score |
| 8 | `itincreditscore.com/articles/collections-on-credit-report-itin-holders` | Discovered – currently not indexed | score |
| 9 | `itincreditcard.com/es/articles/foreign-credit-history-credit-card-itin` | Discovered – currently not indexed | card |
| 10 | `itincreditcard.com/es/articles/authorized-user-credit-card-itin` | Discovered – currently not indexed | card |
| 11 | `itincreditcard.com/es/articles/balance-transfer-credit-card-itin` | Discovered – currently not indexed | card |

**Skipped, already indexed (2 — no quota spent):**
`itincreditscore.com/articles/rent-reporting-services-itin-credit-building` and its `/es` twin
(both "URL is on Google", 7/24 publish date). Confirms score-site articles *do* get indexed
organically within about a week when discovery works.

**Quota-refused (verified, first in line tomorrow):**
`itincreditcard.com/es/articles/best-starter-credit-cards-itin-zero-credit-history`
("Discovered – currently not indexed").

### The daily-content pipeline is running again

The prior entry flagged **2 missed runs on all three sites.** Today all three published a fresh
`lastmod 2026-08-01` article pair. Live sitemap counts re-measured by `curl`: itinlending.net
**158**, itincreditcard.com **118**, itincreditscore.com **120** — each up 2 from the last
measurement. No action needed; treat the earlier miss as resolved.

### New finding — the internal-linking gap is NOT ES-only

Yesterday's entry called out ES pages reporting "Referring page: None detected" and recommended
auditing ES templates. Today's inspections show **EN pages have it too**:

- `itincreditcard.com/articles/get-secured-credit-card-deposit-back-itin` (EN) — "Referring
  page: None detected"
- `itincreditscore.com/articles/collections-on-credit-report-itin-holders` (EN, published 7/22,
  10 days old) — sitemap-discovered but **"Referring page: None detected"**, still unindexed

Meanwhile the ES twins of the *older* card articles correctly name their EN twin as the
referring page (e.g. `/es/articles/foreign-credit-history-credit-card-itin` →
`/articles/foreign-credit-history-credit-card-itin`), and `/es/.../balance-transfer-credit-card-itin`
and `/es/.../authorized-user-credit-card-itin` do the same. So the ES→EN twin link exists; what
is missing is **any link pointing INTO the new article from the rest of the site** — i.e. the
article index / related-articles / cluster links aren't being seen, on both locales.

That reframes yesterday's recommendation: the fix is not an ES-template fix, it's a **site-wide
new-article inbound-linking fix on all three properties**. A 10-day-old EN article with no
referring page and no index is the clearest evidence yet that sitemap-only discovery is not
enough. **This remains higher-leverage than spending 11 requests/day by hand.**

Related but distinct: all six brand-new 8/1 URLs read "No referring sitemaps detected". That
one is expected — Google simply hasn't re-read the sitemaps since this morning's publish — and
should not be confused with the referring-page problem above.

**BACKLOG NOT CLEARED — keep this task enabled.**

### Queue for tomorrow

Tier 1 first, as always: whatever the Mon 8/3 daily-content run publishes on each of the three
sites (EN + `/es`, ~6 URLs). Then Tier 2 with the remainder, **leading with itincreditcard.com**
(today score led). Item 1 below is verified; the rest are unprobed — inspect first and skip any
that read "URL is on Google".

1. `itincreditcard.com/es/articles/best-starter-credit-cards-itin-zero-credit-history` (verified, quota-refused today)
2. `itincreditcard.com/es/articles/build-credit-with-itin-credit-card`
3. `itincreditcard.com/es/articles/business-credit-card-with-itin`
4. `itincreditcard.com/es/articles/can-you-get-a-credit-card-with-an-itin`
5. `itincreditcard.com/es/articles/cash-back-credit-card-itin-holders`
6. `itincreditscore.com/es/articles/700-credit-score-timeline-itin-holders`
7. `itincreditscore.com/es/articles/authorized-user-credit-building-itin`
8. `itincreditscore.com/es/articles/can-you-have-a-credit-score-with-an-itin`
9. `itincreditscore.com/es/articles/closing-credit-account-itin-credit-score`
10. `itincreditscore.com/es/articles/cosigning-with-itin-credit-score-impact`

itincreditscore.com has **44 ES article URLs** in its sitemap and still has never had a proper
sitemap-vs-indexed pass; items 6-10 begin that walk alphabetically. itinlending.net contributes
fresh content only — its `/itin-loans/<state>` set stayed resolved.

- Docs updated: this entry.
- Follow-ups / open items:
  1. **Audit new-article inbound internal linking across all three repos** (EN and ES) — see
     the finding above. This is the standing top recommendation.
  2. Give itincreditscore.com a real sitemap-vs-indexed diff rather than incremental probing.

## 2026-08-01 — Link Engine responder: 1 draft (Moneywise lending circles); Gmail draft-write scope working again
- Responder run initially blocked (Gmail connector absent); Bob reconnected mid-session and the run completed. Covered 2026-07-30 14:30Z onward, wider than the usual 24h, because the Jul 30 PM/evening digests had never been reviewed.
- Reviewed 11 digests / ~85 opportunities (SOS x2, HARO x4, Qwoted, MentionMatch, SourceBottle x2). 1 qualified: Moneywise/Brian OConnell on community lending circles (ROSCAs, tandas, susus). Draft saved to Gmail, id `r124860841964776958`.
- **Gmail create_draft now works** — first time since at least 7/27. Prior runs fell back to writing drafts into `.seo/link-engine/*.md`.
- Docs updated: `.seo/link-engine/responder-2026-08-01.md` (full digest, near-miss rationale, operational note).
- Follow-ups / open items:
  - The Moneywise deadline (12:00 AM ET 31 Jul) lapsed before any scheduled run could see it — the email arrived 5:06 PM ET the prior day. Bob's call whether to send late.
  - Still unsent from the 7/30 run: BestMoney via Qwoted (**due today 7:13 PM EDT**) and Inkl via SOS (due 4 Aug).
  - Gmail search quirk: `label:<LABEL_ID>` returns zero results through this connector despite 2,042 messages on the label. Only `label:"link-engine/queries"` works. The ID form fails silently and is indistinguishable from an empty inbox.

## 2026-08-01 — Link checker added to itincreditcard.com; it immediately found 31 pre-existing defects, all fixed

Closed follow-up 1 from the entry below. `ITINCreditCard` had **no link checking at all** — no
`check-links.mjs`, no `postbuild` step — so broken internal links and ES locale leaks had been
shipping silently. Ported the full checker from the `Itin` repo (the only one of the three with
both the broken-link and locale-leak guards), pointed `SITE` at `itincreditcard.com`, and wired it
into `postbuild` + a `check:links` script, matching the other two repos.

**Ran it manually before wiring it in** — the plan noted in the previous entry, and it was the
right call: enabling a build-failing guard blind would have broken the card site's content
pipeline the same day it was restored. It found **31 pre-existing defects**:

| Class | Count | Fix |
|---|---|---|
| Article slug missing its `/articles/` prefix | 22 | `/authorized-user-credit-card-itin` → `/articles/authorized-user-credit-card-itin` |
| Target doesn't exist on this site | 3 | see below |
| Dead `relatedSlugs` frontmatter entry | 1 | → `build-credit-with-itin-credit-card` |
| ES locale leaks | 5 | `/apply`, `/build-credit-with-itin`, `/how-to-get-an-itin`, `/secured-credit-cards`, `/unsecured-credit-cards` → `/es/` twins |

The 22-link class is the **same generator defect the `Itin` repo already fixed** in `2e24a42`
("stops emitting /articles-less internal links") — it was never fixed here. Both the bare
(`](/slug)`) and absolute (`](https://itincreditcard.com/slug)`) forms were present.

The 3 non-existent targets needed judgment rather than a mechanical rewrite, resolved per the
per-site content scope rule (card site = cards only, cross-site links go to the right domain):
- `how-to-build-credit-with-itin` → `/build-credit-with-itin` (the on-site money page)
- `transfer-itin-credit-history-to-ssn` → `/articles/itin-to-ssn-credit-card-history-transfer`
- `how-to-check-credit-score-with-itin` → `https://itincreditscore.com/check-credit-score-with-itin`
  (a credit-score topic that does not belong on the card site)

One straggler was **not** a body link at all but a `relatedSlugs:` frontmatter entry pointing at a
non-existent article, which the template renders as a link — worth knowing, since grepping article
bodies alone would never have found it.

Result: `7919 internal links across 127 pages, no broken internal links, no locale leaks ✓`, and
the guard now runs automatically on every build. Shipped as `2627982` (92 files).

**All three bilingual repos now have a link checker; coverage is still uneven:**

| Repo | Broken-link check | Locale-leak check |
|---|---|---|
| `Itin` | ✅ | ✅ |
| `ITINCreditCard` | ✅ (new) | ✅ (new) |
| `ITINCreditScore` | ✅ | ❌ still missing |

- Docs updated: this entry; follow-up 1 on the entry below is now closed.
- Follow-ups:
  1. **Add the locale-leak guard to `ITINCreditScore`'s `check-links.mjs`** — now the only gap
     left. Run it manually first, exactly as done here; that site has never had leak detection, so
     assume a backlog until proven otherwise.
  2. **Fix the `/articles`-less link defect in `ITINCreditCard`'s generator**, not just its output.
     The 22 links were cleaned up here, but if its `generate.mjs` still emits bare slugs the way
     `Itin`'s used to, new articles will reintroduce them — the guard will now catch it, but as a
     failed content run rather than a clean publish. Same shape as the translator bug fixed earlier
     today: fix the output, and it comes back.
  3. Still open: hoist the shared link-localization helper out of three separate repos.

## 2026-08-01 — ITINCreditScore translator aligned; found that link-checking coverage differs across all three bilingual repos

Closed follow-up 1 from the entry below. `ITINCreditScore`'s `localizeInternalLinks` rewrote
**every** site-internal path to `/es/...` with no check that a Spanish version existed. Two
failure modes, both latent:

1. A link to an English-only page became an `/es/` **404** — trading a locale leak for a broken
   link.
2. **Asset paths were mangled the same way** — `![img](/og/cover.png)` → `/es/og/cover.png`. This
   one is independent of twinning and would break an image in any article that embeds one.

Neither has bitten yet: the site is currently **fully twinned** (19 EN pages / 19 ES pages,
43 EN articles / 43 ES articles) and its ES articles happen not to link at any asset — verified
by grepping `content/articles-es/` for `/es/`-prefixed asset paths and for `/es/es/` double
prefixes, both clean. But it is one EN-only page or one embedded image away.

Replaced with the conditional implementation now used in the other two repos (rewrite only when
the twin resolves against the source tree; skip assets), and extended to `description` and FAQ
questions so all three repos apply it to the same fields. Verified against 4 real ES article
slugs read off disk plus 11 edge cases — including the two old failure modes, which now correctly
leave the link alone. `npm run build` passes at 126 pages, `check-links: OK`. Shipped as `a9910fb`.

**Unexpected finding — the three repos have three different levels of link checking:**

| Repo | `check-links.mjs` | Broken-link check | Locale-leak check |
|---|---|---|---|
| `Itin` | ✅ present | ✅ | ✅ |
| `ITINCreditScore` | ✅ present | ✅ | ❌ **missing** |
| `ITINCreditCard` | ❌ **absent entirely** | ❌ | ❌ |

This explains the history. itinlending.net's build failed loudly today because it is the only repo
with the leak guard; the other two would have shipped the same defect silently. **`ITINCreditCard`
has no `postbuild` link check at all** — confirmed by its build output ending at `Complete!` with
no postbuild step — so it can currently ship both broken internal links and locale leaks with
nothing catching them.

Not actioned — porting `check-links.mjs` to the other two repos is a separate change from the
translator fix that was asked for, and adding a build-failing guard to a repo that has never had
one deserves its own run (it may fail immediately on pre-existing links, which is worth knowing
but shouldn't be discovered by surprise on a content run).

- Docs updated: this entry; follow-up 1 on the entry below is now closed.
- Follow-ups:
  1. **Port `check-links.mjs` to `ITINCreditCard`** (highest value of the three — it has no link
     checking at all). Run it once manually first to see what the existing backlog of broken links
     looks like before wiring it into `postbuild`.
  2. **Add the locale-leak guard to `ITINCreditScore`'s `check-links.mjs`** so it matches
     `Itin`'s.
  3. Still open from below: hoist the shared link-localization helper (now duplicated in three
     repos) into one place — the drift documented here is exactly what duplication produced.

## 2026-08-01 — Content pipeline restored on 8 properties; fixed the ES locale-leak bug at its source in the translator

Bob topped up the Anthropic API balance (see the outage entry below) and asked for all content
pipelines to be run immediately. All 8 affected repos were dispatched via
`gh workflow run daily-content.yml`.

**7 of 8 published on the first pass:**

| Property | Result | Duration |
|---|---|---|
| itincreditcard.com | ✅ success | 4m22s |
| itincreditscore.com | ✅ success | 4m23s |
| Percolate | ✅ success | 2m39s |
| Perfume Picks | ✅ success | 2m23s |
| Pour Picks | ✅ success | 2m41s |
| Stick Picks | ✅ success | 2m48s |
| Under Dial | ✅ success | 2m48s |
| **itinlending.net** | ❌ failure | 4m35s |

The credit top-up is confirmed working — runs went from ~20s hard failures to healthy 2-4min
completions.

**itinlending.net failed for a different, pre-existing reason: the ES locale-leak guard.** It
failed at 4m35s, not the ~20s billing failure, so generation and translation both succeeded. The
`postbuild` link check (`web/scripts/check-links.mjs`) blocked the deploy because the new Spanish
article `/es/articles/itin-personal-loan-with-cosigner` linked to **6 English pages that have
Spanish twins** (`/articles/how-to-build-credit-with-itin`, `/articles/itin-credit-builder-loan`,
`/articles/itin-personal-loan-lenders`, `/itin-auto-loan`, `/itin-mortgage`,
`/itin-personal-loans`). **Nothing was published — the guard fires before the commit step, so
`origin/main` was untouched and that article was lost with the runner.**

**Root cause — the generator was never fixed, only its output was.** `web/scripts/lib/translate.mjs`
instructs the model to "translate the visible text inside [links], never the URLs", so an English
article's internal links survive verbatim into the Spanish copy. The 07-20/07-27 audit
(`cb482f3`, "ES locale leaks") cleaned up the *existing* ES articles by hand but left the
translator alone, so **every newly generated Spanish article silently reintroduced the bug** and
would fail the build. This was latent from that audit until today's first new article since.

**Fix:** added `localizeInternalLinks()` to `translate.mjs`, applied deterministically to
`bodyMarkdown`, `quickAnswer`, `description`, and every FAQ `q`/`a` after translation returns. It
rewrites a site-absolute link `/foo` to `/es/foo` **only when a Spanish twin actually exists**,
mirroring the exact rule in `check-links.mjs` but resolved against the source tree (translation
runs before anything is built):
- `/articles/<slug>` → twin exists iff `src/content/articles-es/<slug>.md` exists
- single-segment `/foo` → iff `src/pages/es/foo.astro` or `src/pages/es/foo/index.astro` exists
- nested `/itin-loans/texas` → matches the `[state].astro` dynamic route

Left alone: already-`/es/` links, external URLs, assets, and paths with no Spanish twin.
Prompt-level instructions were deliberately not used — the checker is deterministic, so the fix
has to be too.

Verified against all 6 real failing links plus 7 edge cases (already-ES, external, asset,
no-twin, `href=` with anchor, `/articles` index, dynamic `[state]` route) — all correct. Local
`npm run build` passes: `11377 internal links across 178 pages, no broken internal links, no
locale leaks ✓`.

**Swept the other two bilingual repos for the same defect** (the five app/marketing repos are
monolingual — no `translate.mjs` — so they are not exposed):

| Repo | Before | Action |
|---|---|---|
| `Itin` | ❌ no rewrite | fixed — `e9cf7e4` |
| `ITINCreditCard` | ❌ no rewrite (latent) | fixed — `dac304a` |
| `ITINCreditScore` | ✅ already had one | left as-is, but see below |

`ITINCreditCard` had the identical bug and had simply not tripped it yet — its recent articles
happened not to link at a page with a Spanish twin. The next one that did would have failed the
build exactly as itinlending.net just did. Ported, verified against its own content (`/articles/secured-credit-card-with-itin`,
`/best-itin-credit-cards`, `href=` + anchor all rewrite; already-ES, external, and no-twin paths
left alone) and `npm run build` passes at 124 pages.

**Worth knowing — `ITINCreditScore`'s existing version is riskier than the one shipped here.** Its
`localizeInternalLinks` rewrites **every** site-internal link to `/es/...` unconditionally, with no
check that a Spanish twin exists. On a page with no Spanish version that manufactures an `/es/`
404 — trading a locale leak for a broken link. It is not currently failing (that site appears to
be fully twinned), so this was **not** changed; noted as a follow-up rather than actioned, since
it is working today and a rewrite there is a separate change.

- Docs updated: this entry.
- Follow-ups:
  1. Align `ITINCreditScore`'s `localizeInternalLinks` with the conditional version used in the
     other two repos, so it cannot mint `/es/` 404s if that site ever gains an EN-only page.
  2. Consider hoisting this helper into one shared place — three copies of the same
     link-localization logic across three repos is how they drifted apart to begin with.

## 2026-08-01 — GSC request-indexing: 11 URLs queued (full quota, zero waste); the 7/30 sitemap fix is CONFIRMED working; itincreditcard.com's 116-vs-66 gap is real; task rebalanced to stop starving two sites; **daily-content pipeline has missed 2 runs on all three sites**

Daily scheduled request-indexing run (`itin-gsc-request-indexing`). Chrome/GSC auth was
available (`bguillow@gmail.com`, all three Domain properties reachable). **11 unique URLs
successfully request-indexed** before "Quota Exceeded" on the 12th — the full documented cap,
with **no quota lost to duplicate submissions** (the 7/30 toast-scrim pitfall was avoided by
dismissing explicitly after every request).

| # | URL | Prior state |
|---|---|---|
| 1 | `itinlending.net/es/itin-loans/pennsylvania` | URL unknown to Google |
| 2 | `itinlending.net/es/itin-loans/virginia` | URL unknown to Google |
| 3 | `itinlending.net/es/itin-loans/washington` | URL unknown to Google |
| 4 | `itincreditscore.com/articles/read-dispute-credit-report-itin-bureau-by-bureau` | Discovered – currently not indexed |
| 5 | `itincreditscore.com/es/articles/read-dispute-credit-report-itin-bureau-by-bureau` | Discovered – currently not indexed |
| 6 | `itincreditcard.com/es/articles/itin-to-ssn-credit-card-history-transfer` | Discovered – currently not indexed |
| 7 | `itincreditcard.com/es/articles/2026-executive-order-itin-credit-card-applications` | Discovered – currently not indexed |
| 8 | `itincreditcard.com/es/articles/credit-card-international-students-itin` | Discovered – currently not indexed |
| 9 | `itincreditcard.com/es/articles/credit-card-undocumented-immigrants-itin` | Discovered – currently not indexed |
| 10 | `itincreditcard.com/es/articles/credit-card-itin-non-residents` | Discovered – currently not indexed |
| 11 | `itincreditcard.com/es/articles/expired-itin-credit-card-what-happens` | URL unknown to Google |

`itincreditcard.com/es/articles/foreign-credit-history-credit-card-itin` was confirmed
"Discovered – currently not indexed" but **refused with "Quota Exceeded"** — first in line
tomorrow.

**The 5-URL queue left by the 7/30 run was fully drained (items 1–5), which closes out the
`/itin-loans/<state>` programmatic set entirely.** All 15 EN and all 15 ES state pages on
itinlending.net are now either confirmed indexed or carry a pending indexing request.

**The 7/30 child-sitemap submission is confirmed working — at the URL level, not just the
dashboard.** Yesterday both lagging properties' pages read "URL is unknown to Google" with
"No referring sitemaps detected". Today the same pages read **"Discovered – currently not
indexed"** with `sitemap-0.xml` named as the referring sitemap. Concretely, for both
itincreditscore.com bureau-by-bureau articles and five of the six itincreditcard.com ES
articles probed. **Discovery is no longer the bottleneck on either site; indexing is.** This
is the payoff the 7/30 entry said to watch for.

**The itincreditcard.com 116-vs-66 gap is REAL — not a stale count — and it is not simply
"the whole ES side."** Eight ES URLs were probed by live inspection:

- **Already indexed (2, no quota spent):** `/es/articles/secured-credit-card-with-itin`,
  `/es/articles/credit-card-reconsideration-line-itin`.
- **Discovered but not indexed (5) + unknown to Google (1):** the six requested above.

So the gap is a **mixed ~50-URL Spanish-side indexing backlog**, roughly 3-in-4 of the ES set,
now fully discovered and waiting on Google to index. The 7/29 call that this backlog was
"effectively cleared" on the strength of seven all-indexed spot-checks is now definitively
wrong — the spot-checks happened to land on the indexed quarter.

**GSC's Pages report is still blind to this.** itincreditcard.com read **66 indexed / 3
not-indexed** today — byte-identical to 7/30, despite ~47 URLs that live inspection shows are
discovered-and-unindexed. The Pages report should not be used to size this backlog; only live
URL Inspection or a sitemap-vs-indexed diff will show it.

**New finding — an internal-linking gap that matters more than request-indexing.** Several ES
pages report **"Referring page: None detected"** (e.g. `/es/articles/2026-executive-order-itin-credit-card-applications`,
`/es/articles/expired-itin-credit-card-what-happens`), meaning Google has found them via the
sitemap but **no internal link points at them.** Others correctly show their EN twin as the
referring page. Sitemap presence alone is a weak indexing signal; an internal link is a strong
one. At ~11 requests/day against a ~50-URL backlog this is ~5 days of manual work, whereas
fixing ES internal linking would address the whole set at once. **Recommend auditing the ES
article templates for missing cross-links before spending more daily quota here.**

**itinlending.net's sitemap is healthy — it does NOT have the child-sitemap problem.** Checked
because its ES state pages also read "No referring sitemaps detected":

| Sitemap | Type | Submitted | Last read | Status | Discovered |
|---|---|---|---|---|---|
| `itinlending.net/sitemap-0.xml` | Sitemap | Jul 27 | Jul 27 | Success | 158 |
| `itinlending.net/sitemap-index.xml` | Sitemap index | Jul 27 | Jul 27 | Success | 158 |

Both submitted and both reading 158. Two caveats worth a follow-up: the last read is **Jul 27,
4 days stale**, while the live file carries `lastmod` Jul 29 and now contains **156** `<loc>`
entries (the 158 still reflects the pre-removal `/contact` + `/es/contact`); and the ES state
pages report no referring sitemap despite 158 discovered. Neither blocks anything today.

**Sitemap counts re-measured by direct `curl`:** itinlending.net **156**, itincreditcard.com
**116** (58 EN / 58 ES).

**BACKLOG NOT CLEARED — keep this task enabled.**

**Queue for tomorrow.** Item 1 is verified; items 2+ are an unprobed candidate pool from the ES
set — inspect before requesting and skip any that read "URL is on Google":
1. `itincreditcard.com/es/articles/foreign-credit-history-credit-card-itin` (verified, quota-refused today)
2. `itincreditcard.com/es/articles/authorized-user-credit-card-itin`
3. `itincreditcard.com/es/articles/balance-transfer-credit-card-itin`
4. `itincreditcard.com/es/articles/best-starter-credit-cards-itin-zero-credit-history`
5. `itincreditcard.com/es/articles/build-credit-with-itin-credit-card`
6. `itincreditcard.com/es/articles/business-credit-card-with-itin`
7. `itincreditcard.com/es/articles/can-you-get-a-credit-card-with-an-itin`
8. `itincreditcard.com/es/articles/cash-back-credit-card-itin-holders`
9. `itincreditcard.com/es/articles/credit-card-denied-itin-what-to-do`
10. `itincreditcard.com/es/articles/credit-card-itin-apply-online-vs-in-branch`
11. `itincreditcard.com/es/articles/credit-card-prequalification-itin`

**Post-run fix — the task was starving two of the three sites.** Bob flagged that spending the
whole account-wide quota on one site's backlog means the other two get nothing. The data
confirms it: across all logged runs the split is **20 itinlending.net / 7 itincreditcard.com /
4 itincreditscore.com**, and 6 of those 7 card + 2 of those 4 score requests were today. The
7/29 and 7/30 runs were **100% itinlending.net**. Root cause was the SKILL's fixed
"standing order", which walked one site's backlog to exhaustion before reaching the next.

This matters because **all three repos publish on the same 3x/week Mon/Wed/Fri schedule**
(`daily-content.yml` in `~/Itin`, `~/ITINCreditCard`, `~/ITINCreditScore`), so all three
generate fresh URLs continuously — and a starved site's brand-new articles were queuing behind
another site's ~50-URL backlog.

`~/.claude/scheduled-tasks/itin-gsc-request-indexing/SKILL.md` now allocates in two tiers
instead of a fixed site order:
- **Tier 1 (first, every run, all three sites):** any URL published in the last ~10 days that
  isn't indexed. Typically 2-6 URLs, so it rarely eats the quota. Fresh content never waits
  behind backlog.
- **Tier 2 (remainder):** backlog, **capped at 5 requests per site per run**, with the lead site
  rotating each run.
- Each run must now **report the per-site split** so starvation stays visible.

Strict one-site-per-day rotation was considered and rejected: it would make a fresh article wait
up to 3 days for its site's turn, which is the opposite of what matters. Fresh-first plus a
per-site cap fixes the starvation without that cost. Quota math supports it — ~18 new URLs/week
across all three sites against a ~77/week quota, leaving ~59/week for backlog.

**SEPARATE PROBLEM FOUND — the daily-content pipeline has silently stopped on ALL THREE sites.**
Surfaced while building the fresh-content tier above. Last `Daily content:` commit in every repo:

| Repo | Last daily-content commit |
|---|---|
| `~/Itin` | **2026-07-27** — `itin-business-loan-lenders` |
| `~/ITINCreditCard` | **2026-07-27** — `best-starter-credit-cards-itin-zero-credit-history` |
| `~/ITINCreditScore` | **2026-07-27** — `read-dispute-credit-report-itin-bureau-by-bureau` |

The cron is `0 13 * * 1,3,5` (Mon/Wed/Fri 13:00 UTC) in all three repos. 2026-07-27 was a
Monday; **Wednesday 07-29 and Friday 07-31 both produced nothing on any of the three sites** —
two consecutive missed runs, simultaneous across three independent repos.

**Root cause identified — the Anthropic API credit balance is exhausted.** The workflow is
firing on schedule and failing fast (23-26s vs 4-8min when healthy), so this is not a cron or
trigger problem. From `gh run view 30642429369 --log-failed` on the 07-31 run:

> `generateArticle: attempt 1/3 failed: Anthropic API 400: "type":"invalid_request_error",`
> `"message":"Your credit balance is too low to access the Anthropic API. Please go to Plans &`
> `Billing to upgrade or purchase credits."`

All 3 retry attempts fail identically, then `daily-post: generation failed` and exit 1. Because
all three sites share one API key, all three stopped on the same day. Run history confirms the
break point exactly: 07-20, 07-22, 07-24, 07-27 all `success`; 07-29 and 07-31 both `failure`.

**BLAST RADIUS IS PORTFOLIO-WIDE, NOT JUST THE ITIN SITES.** Bob asked whether this hits the
other Timberline properties too. It does — every repo whose `daily-content.yml` calls the
Anthropic API shares the one key, so **8 properties are down**, all with the same
`credit balance is too low` error (verified independently on StickPicks, not just inferred):

| Property | Repo | Content cron | Last success | Status |
|---|---|---|---|---|
| itinlending.net | `Itin` | Mon/Wed/Fri 13:00 UTC | 2026-07-27 | ❌ failing |
| itincreditcard.com | `ITINCreditCard` | Mon/Wed/Fri 13:00 UTC | 2026-07-27 | ❌ failing |
| itincreditscore.com | `ITINCreditScore` | Mon/Wed/Fri 13:00 UTC | 2026-07-27 | ❌ failing |
| Percolate | `Percolate-Web` | daily | 2026-07-28 | ❌ failing |
| Perfume Picks | `PerfumePicks` | daily 11:00 UTC | 2026-07-28 | ❌ failing |
| Pour Picks | `PourPicks` | daily 12:00 UTC | 2026-07-28 | ❌ failing |
| Stick Picks | `StickPicks` | daily | 2026-07-28 | ❌ failing |
| Under Dial | `Underdial-Web` | daily | 2026-07-28 | ❌ failing |

**Well Worth is NOT affected** — `~/Projects/WellWorth` is a local-only repo with no remote and
no `.github/workflows`; its storefront copy is authored via the `wellworth-content` skill, not a
scheduled pipeline. Nothing to restore there.

Clean break point across the whole portfolio: **everything succeeded through 2026-07-28, and
every run from 2026-07-29 onward has failed.** The ITIN sites show a 07-27 last-success only
because they run Mon/Wed/Fri rather than daily. Perfume and Pour do not appear broken in a
`gh run list --limit 5` because their health monitors run far more often than their content job
— their content workflow history has to be queried directly (`--workflow=daily-content.yml`),
which is how the 3 failures each were found.

Scale of the loss so far: 5 daily sites × 4 days + 3 ITIN sites × 2 runs ≈ **26 missed articles**,
growing by ~5-6/day until the balance is topped up.

**ACTION NEEDED FROM BOB: add credits to the Anthropic API account.** One top-up restores all 8
properties; nothing else is wrong and no code change is required. (Not actioned here — this task
has no authority to make a purchase.)

Consequence for this task: Tier 1 (fresh content) will be **empty** until publishing resumes, so
the next few runs will legitimately be all-backlog. That is expected, not a regression — but if
Tier 1 is still empty a week from now, the content pipeline is the thing to fix, not this task.

- Docs updated: this changelog entry; the "Allocating today's ~11 requests" section of
  `~/.claude/scheduled-tasks/itin-gsc-request-indexing/SKILL.md` (replaces "Priority order").
- Follow-ups:
  0. **URGENT, blocks all content portfolio-wide: top up the Anthropic API credit balance.**
     8 properties down since 2026-07-29 (the 3 ITIN sites + Percolate, Perfume Picks, Pour Picks,
     Stick Picks, Under Dial); ~26 articles missed and counting. Well Worth unaffected. Diagnosed
     above; needs Bob, no code change.
  0b. **Add balance/failure alerting.** This ran silently for 4 days across 8 repos because the
     only signal was a red run in GitHub Actions that nobody reads. The `monitor.yml` health
     check in each repo passes happily while content generation is dead — it checks the site, not
     the pipeline. Worth having the content workflow notify on failure (or a daily digest of
     cross-repo run status) so the next outage surfaces same-day.
  1. **NEW, highest value: audit ES article internal linking on itincreditcard.com** (and check
     itincreditscore.com for the same). "Referring page: None detected" on sitemap-discovered ES
     pages points at a template-level cross-link gap; fixing it would clear the backlog faster
     than the ~11/day quota can.
  2. **Still open:** remove the dead `http://itincreditscore.com/sitemap.blog.xml` (a deletion —
     needs Bob's approval, not authorized by this task).
  3. Re-check whether itincreditcard.com's indexed count moves off 66 in ~48h now that the ES
     set is discovered + partially requested. If it climbs on its own, discovery was the only
     bottleneck and this task can be retired; if it stays flat, follow-up 1 is the real fix.
  4. itinlending.net sitemap last read Jul 27 vs `lastmod` Jul 29 — watch whether Google
     re-reads on its own and picks up the 156 count.

## 2026-07-31 — Link Engine responder: 1 draft (Moneywise, community lending circles)
- Scanned the day's `link-engine/queries` label: 3 HARO editions, 2 SOS, 1 Qwoted, 2 SourceBottle, 3 MentionMatch (~110 opportunities total). One qualified.
- Gmail draft created for **Moneywise / Brian OConnell**, story on community lending circles (ROSCAs, tandas, susus, kehs). Best-fit ITIN query we have seen: answers his 5 questions on how circles work, why they persist in immigrant communities, payout-order risk asymmetry, Mission Asset Fund style bureau reporting as a credit-building path for the credit invisible, and due-diligence red flags.
- **Not drafted, needs Bob:** ConsumerAffairs / Sharon Wu "Cost of the American Dream" data story (deadline 2:00 AM ET Aug 4) is flagged "No AI Pitches Considered," so per the responder rules no AI-drafted text goes to it.
- Skipped as out-of-bucket or near-miss: IPO investing and crude-oil/CFD trading (securities commentary), MSN post-closing homeowner costs (asks for licensed mortgage/RE professionals), EduBirdie card-frozen-abroad (travel money, deadline passed), teen money milestones, plus the health-supplement, Australian-market, and travel queries.
- Docs updated: this changelog. No change to LINK-ENGINE-PLAN.md; process ran as documented.
- Follow-ups / open items: the Moneywise deadline (12:00 AM ET 31 July) had already passed when the digest was processed, since HARO sent it 5:06 PM ET the prior day. Flagged to Bob as a late-send judgment call. Worth noting the pattern: **evening HARO editions can carry same-night deadlines that this daily run cannot beat.** If that recurs, consider a second responder run in the evening.

## 2026-07-30 — Child sitemaps submitted on both lagging properties: discovered pages 0 → 116 and 0 → 118. The 7/2x diagnosis was correct.

Bob approved the long-open follow-up from the request-indexing entry below, and it is now
done. Both lagging properties had only their **sitemap index** submitted, which Google was
reading as `Discovered pages: 0`. Submitting each site's **child** `sitemap-0.xml` directly
fixed it immediately:

| Property | Sitemap submitted | Status | Discovered pages |
|---|---|---|---|
| itincreditscore.com | `https://itincreditscore.com/sitemap-0.xml` | Success, read Jul 30 | **0 → 118** |
| itincreditcard.com | `https://itincreditcard.com/sitemap-0.xml` | Success, read Jul 30 | **0 → 116** |

That is every URL in both sitemaps discovered in one action, versus ~11/day from manual
request-indexing. The diagnosis first written up on 7/29 — "the healthy property is the one
where the child sitemap was submitted directly" — is confirmed. The existing
`sitemap-index.xml` entries were left in place (harmless; both still read 0 discovered).

**Don't panic at "Couldn't fetch" right after submitting.** itincreditcard.com showed
`Unknown / Couldn't fetch / 0` for several minutes after submission while itincreditscore.com
fetched instantly. Ruled out as causes before waiting: the file serves HTTP 200 as
`application/xml` from GitHub Pages, parses as well-formed XML, contains 116 `<loc>` entries
all on the correct host, and `robots.txt` is byte-for-byte equivalent in policy to the working
site's. It was simply GSC's pre-fetch placeholder — on re-check ~4 minutes later it read
`Success / 116`. Verify the file with `curl` rather than resubmitting.

**What to watch.** "Discovered" is not "indexed". The real test is whether the ~50-URL
sitemap-vs-indexed gap on itincreditcard.com (116 sitemap / 66 indexed) starts closing on its
own over the next few days. If it does, the daily request-indexing task can likely be retired
early; if it doesn't, discovery was not the only bottleneck.

- Docs updated: this entry; the request-indexing entry below (its follow-up 1 is now closed).
- Follow-ups:
  1. Re-check "Discovered pages" and the indexed counts on both properties in ~48h.
  2. **Still open, not done:** remove the dead `http://itincreditscore.com/sitemap.blog.xml`
     (submitted Oct 2023, last read Nov 2023, 5 pages, `http://` scheme). Not actioned — it is
     a deletion and was not part of what was approved.

## 2026-07-30 — GSC request-indexing batch: 9 URLs queued, quota hit; itinlending.net EN state pages fully resolved; the sitemap follow-up is still not done

Daily scheduled request-indexing run (`itin-gsc-request-indexing`). Chrome/GSC auth was
available (`bguillow@gmail.com`, all three Domain properties reachable). **9 unique URLs
successfully request-indexed** before "Quota Exceeded" on the 10th. All 9 are itinlending.net
`/itin-loans/<state>` pages, each verified "URL is unknown to Google" by live inspection
immediately before requesting.

| # | URL | Prior state |
|---|---|---|
| 1 | `itinlending.net/es/itin-loans/georgia` | URL unknown to Google |
| 2 | `itinlending.net/itin-loans/maryland` | URL unknown to Google |
| 3 | `itinlending.net/itin-loans/massachusetts` | URL unknown to Google |
| 4 | `itinlending.net/itin-loans/new-jersey` | URL unknown to Google |
| 5 | `itinlending.net/es/itin-loans/illinois` | URL unknown to Google |
| 6 | `itinlending.net/es/itin-loans/maryland` | URL unknown to Google |
| 7 | `itinlending.net/es/itin-loans/massachusetts` | URL unknown to Google |
| 8 | `itinlending.net/es/itin-loans/nevada` | URL unknown to Google |
| 9 | `itinlending.net/es/itin-loans/north-carolina` | URL unknown to Google |

`itinlending.net/es/itin-loans/pennsylvania` was confirmed unknown-to-Google but **refused
with "Quota Exceeded"** — it is first in line tomorrow.

**Only 9 unique URLs landed against the known ~11/day cap, because two requests were spent on
duplicates — see the pitfall below.** Worth reading before the next run; it is a repeatable
way to waste ~18% of the daily quota.

**New operational pitfall — the "Indexing requested" toast is a click-swallowing scrim.**
After a successful request, GSC renders a confirmation toast over the page. It looks
dismissible-by-ignoring, but it intercepts clicks aimed at the "Inspect any URL" bar at the
top of the viewport, and the intercepted click re-fires REQUEST INDEXING **on the URL still
loaded** — a duplicate submission that consumes quota and does nothing (GSC itself says
"Submitting a page multiple times will not change its queue position or priority"). This
happened twice today, on `/es/itin-loans/georgia` and `/itin-loans/maryland`, before the
pattern was recognised. **Fix: after every request, click "Dismiss" explicitly, confirm by
screenshot that the toast is gone, and only then click the inspect bar.** Also note the
inspect bar frequently needs a second click to take focus on a freshly loaded page — the
first click focuses, typing before that goes nowhere.

**Second pitfall — do not type a URL while the Sitemaps report is open.** The "Enter sitemap
URL" field auto-focuses on that page and swallows keystrokes intended for the inspect bar. An
article URL was typed into the sitemap-submit box today. Nothing was submitted (the field
cleared and SUBMIT stayed disabled), but the near-miss is worth avoiding: navigate to the
property Overview first, then inspect.

**Skipped — already indexed (8 verified by live URL Inspection, no quota spent).**
itinlending.net EN: `/itin-loans/illinois`, `/nevada`, `/new-york`, `/arizona`, `/california`,
`/florida`, `/georgia`. itinlending.net ES: `/es/itin-loans/new-jersey`.

**The `/itin-loans/<state>` programmatic set — the backlog identified on 7/29 — is now fully
resolved.** All 15 EN state pages are either confirmed indexed (texas, north-carolina,
illinois, nevada, new-york, arizona, california, florida, georgia) or have a pending request
(washington, pennsylvania, virginia from 7/29; maryland, massachusetts, new-jersey today).
Several EN pages that read "unknown" or were unchecked on 7/29 now read "URL is on Google",
which is direct evidence that **request-indexing is converting within ~24h**. On the ES side
10 of 15 are indexed or requested; pennsylvania, virginia, washington remain.

**The highest-value open item from 7/29 is STILL NOT DONE — re-verified today.** Neither
lagging property has had its child sitemap submitted:

| Property | Submitted sitemaps | Last read | Discovered pages |
|---|---|---|---|
| itincreditcard.com | `sitemap-index.xml` only (Jun 6) | Jun 20 | **0** |
| itincreditscore.com | `sitemap-index.xml` only (Jun 6) + dead `http://…/sitemap.blog.xml` (Oct 2023) | **Jun 6 — 54 days stale** | **0** |

Unchanged from yesterday's reading, one day staler. **No write action taken** — submitting a
sitemap is not an action this task authorizes and the user was not present to approve it.

**Sitemap-vs-indexed, re-measured today** (sitemap counts by direct `curl` of each
`sitemap-0.xml`):

- **itincreditcard.com** — 116 sitemap URLs / **66 indexed** / 3 not-indexed. The 7/29 entry
  called this backlog "effectively cleared" on the strength of seven spot-checks that all came
  back indexed; the 116-vs-66 gap says that conclusion needs re-testing, since GSC's
  not-indexed report only accounts for 3 of the ~50 missing. Either the "66" is stale or ~50
  URLs are undiscovered and invisible to the Pages report. Worth a dedicated pass once the
  itinlending.net queue drains.
- **itincreditscore.com** — 118 sitemap URLs. Not re-measured against indexed count this run.
- **itinlending.net** — 156 sitemap URLs (was 158 on 7/29; the drop is the `/contact` +
  `/es/contact` removal shipped 7/29).

**Confirmed unknown-to-Google today, queued for tomorrow in this order (5):**
1. `itinlending.net/es/itin-loans/pennsylvania` (quota-refused today)
2. `itinlending.net/es/itin-loans/virginia`
3. `itinlending.net/es/itin-loans/washington`
4. `itincreditscore.com/articles/read-dispute-credit-report-itin-bureau-by-bureau`
5. `itincreditscore.com/es/articles/read-dispute-credit-report-itin-bureau-by-bureau`

After those 5, the quota has ~6 slots left — spend them probing the itincreditcard.com
116-vs-66 gap above.

**BACKLOG NOT CLEARED — keep this task enabled.**

- Docs updated: this changelog entry; the two pitfalls added to the "Known constraints" section
  of `~/.claude/scheduled-tasks/itin-gsc-request-indexing/SKILL.md`, which is where the next
  run will look.
- Follow-ups:
  1. ~~**Submit `https://itincreditscore.com/sitemap-0.xml` and
     `https://itincreditcard.com/sitemap-0.xml` directly.**~~ **DONE the same day** — Bob
     approved it; discovered pages went 0 → 118 and 0 → 116. See the entry above.
  2. **Remove the dead `http://itincreditscore.com/sitemap.blog.xml`** — still open.
  3. Re-check "Discovered pages" and indexed counts on both properties ~48h after (1).
- Run note: the Claude-in-Chrome extension dropped mid-run for ~4 minutes and recovered on
  retry; no requests were lost to it.

## 2026-07-30 — Link Engine responder: 2 drafts from ~60 opportunities (BestMoney credit-building cards, Inkl money habits)

Daily `link-engine-responder` run over `link-engine/queries` (17 threads, last 24h: SOS x2,
HARO x3, Qwoted x3, SourceBottle x3, MentionMatch, plus HARO verify/duplicate noise).
Two qualified: **BestMoney** via Qwoted on no-annual-fee credit-building cards (deadline
Aug 1, 7:13 PM EDT, platform submission, includes a factual correction on OpenSky's $35
annual fee vs the $0-fee OpenSky Plus) and **Inkl** via SOS on money habits (deadline Aug 4,
9:00 AM ET, Gmail draft created to dianababaeva97@gmail.com).
Drafts + full skip reasoning: `.seo/link-engine/responder-2026-07-30.md`.
Flagged for Bob, not drafted: Clever Real Estate FHA/DPA guide and Food & Wine features
(both "No AI Pitches Considered"), and a Yahoo Creators first-apartment guide that welcomes
cleaning supplies but needs Well Worth's sign-off on samples and images.
- Docs updated: CHANGELOG.md; drafts file under `.seo/link-engine/`.
- Follow-ups: Bob reviews and sends both; BestMoney one must go through the Qwoted button in
  that email, not by reply.

## 2026-07-29 (second run) — GSC request-indexing: 0 requested, quota already spent by the earlier run; found the two lagging properties never had their child sitemap submitted

Second firing of the `itin-gsc-request-indexing` scheduled task today. Chrome/GSC auth was
available (`bguillow@gmail.com`, all three Domain properties reachable).

**0 URLs request-indexed. Quota was already exhausted** by the earlier run today (entry
below, 11 URLs). The one request attempted —
`itincreditscore.com/articles/read-dispute-credit-report-itin-bureau-by-bureau`, verified
"URL is unknown to Google" immediately before — came back **"Quota Exceeded … try again
tomorrow."** Stopped there, as the task file directs. Nothing was lost: the quota is
account-wide and the earlier run had already spent it productively.

**Confirms the earlier run's method correction, with 4 more data points.** Every candidate
pulled from the stale "Crawled – currently not indexed" drilldown (all properties still read
"Last update: 7/23/26") came back **"URL is on Google"** on live inspection:
`itincreditcard.com/es/business-credit-cards`,
`itincreditscore.com/articles/utility-bills-credit-score-itin`,
`itincreditscore.com/check-credit-score-with-itin`,
`itincreditscore.com/es/articles/closing-credit-account-itin-credit-score`. Sorting sitemap
URLs by `<lastmod>` and inspecting the newest first found a genuine gap on the first try —
that is the better candidate-selection heuristic than reading the drilldown.

**New finding — corrects the "sitemaps are fine" conclusion in the entry below.** That entry
ruled out sitemap submission as a cause, but only checked itinlending.net. Checking all three
Sitemaps reports side by side shows the two lagging properties are in a different state:

| Property | Submitted sitemaps | Last read | Discovered pages |
|---|---|---|---|
| itinlending.net | `sitemap-0.xml` **and** `sitemap-index.xml` (both Jul 27) | Jul 27 | **158** / 158 |
| itincreditcard.com | `sitemap-index.xml` only (Jun 6) | Jun 20 | **0** |
| itincreditscore.com | `sitemap-index.xml` only (Jun 6) + dead `http://…/sitemap.blog.xml` (Oct 2023) | **Jun 6 — 53 days stale** | **0** |

The healthy property is the one where the **child** `sitemap-0.xml` was submitted directly;
the two reporting 0 discovered pages only ever had the index submitted. This matches the
"Sitemaps: No referring sitemaps detected" line on the unknown-to-Google URL above — on
itincreditscore.com that is not inspection lag, because GSC has not re-read that property's
sitemap since Jun 6.

Ruled out as the cause: the sitemap files themselves. All three serve HTTP 200 as
`application/xml`, are well-formed, carry fresh `lastmod` (creditcard/creditscore
2026-07-27, lending 2026-07-29), and are correctly advertised in each `robots.txt`. The
defect is on the GSC submission side, not in the generated output.

**No write action taken on this.** Submitting a sitemap is not the action this task
authorizes, and the user was not present to approve it — reporting instead.

**BACKLOG NOT CLEARED — keep this task enabled.** Also worth noting for whoever tunes the
schedule: this task fired twice on 2026-07-29 and the second firing could do nothing but
burn a session, since the cap is account-wide and daily. One firing per day is sufficient.

- Docs updated: this changelog entry.
- Follow-ups (all GSC-console actions, none done — need a go-ahead):
  1. **Submit `https://itincreditscore.com/sitemap-0.xml` and
     `https://itincreditcard.com/sitemap-0.xml` directly** in each property's Sitemaps
     report, alongside the existing index. This is the single highest-value action open —
     it plausibly unblocks discovery for ~50 URLs per site, versus 11/day from
     request-indexing. (Previously flagged in the 2026-07-2x entries and still not done.)
  2. **Remove the dead `http://itincreditscore.com/sitemap.blog.xml`** (submitted Oct 2023,
     last read Nov 2023, 5 pages, `http://` scheme).
  3. Re-check "Discovered pages" on both properties ~48h after (1); if still 0, the problem
     is deeper than submission.
  4. Tomorrow's request-indexing run should still start with
     `itinlending.net/es/itin-loans/georgia` per the entry below, then the remaining
     `/itin-loans/<state>` pages, then
     `itincreditscore.com/articles/read-dispute-credit-report-itin-bureau-by-bureau` and its
     `/es` twin (both confirmed unknown to Google today).
- Unrelated observation, not acted on: GSC showed a Google account "Critical security alert —
  suspicious activity in your account" banner. Not investigated (out of scope, and account
  security is Bob's call). Worth a look.

## 2026-07-29 — Sitemap fixes on all three sites: drop noindexed `/contact`, add stable `lastmod` to the 30 programmatic state pages

Both follow-ups from today's request-indexing run (entry below), shipped in source. Neither
is deployed yet — the built `dist/` on each site verifies the change, but nothing has been
pushed to `/docs`.

**1. Noindexed `/contact` removed from every sitemap — 6 URLs, not 1.** The run flagged
`itincreditscore.com/contact` as sitemap-listed but `noindex`. It is worse than reported:
**all three sites** ship `/contact` *and* `/es/contact` in the sitemap while both pages pass
`noindex={true}` to `BaseLayout`. The sitemap filter excluded `404|thank-you|apply` but never
`contact`, so the noindex set and the filter had drifted apart. Fixed in all three
`web/astro.config.mjs` by adding `contact` to the filter, with a comment tying the filter to
the `noindex` pages so the next person keeps them in sync. Verified the regex catches exactly
those 6 URLs and nothing like `/articles/contact-*` (the `(\/|$)` anchor holds).

**2. Stable `lastmod` for the 30 `/itin-loans/<state>` pages (itinlending.net).** New
`STATES_DATA_UPDATED` constant in `web/src/data/states.ts`, read by a new
`buildStateLastmodMap()` in `astro.config.mjs` via fs + regex (matching how the article map
is built, so the config stays `.mjs` while the data stays `.ts`). Both locales get the date;
a failed parse yields no lastmod rather than a wrong one.

Chose a hand-bumped committed constant over the alternatives for the reason already
documented in that file: a build-time date restamps all 156 URLs on every daily-content
deploy until Google treats the field as noise, and `git log` is no better under CI's shallow
checkout, where every file reports the same commit date. **Bump `STATES_DATA_UPDATED` only
when the ITEP/NCSL figures, the state list, or the generated copy actually change.**

Hand-written static pages (money pages, `/about`, legal) still get no `lastmod` — that part
of the original design is deliberate and unchanged.

**Verified by building all three sites**, comparing each `dist/sitemap-0.xml` against the
live one:

| Site | URLs (live → built) | `<lastmod>` (live → built) | `/contact` entries |
|---|---|---|---|
| itinlending.net | 158 → 156 | 90 → 120 | 0 |
| itincreditscore.com | 120 → 118 | 86 → 86 | 0 |
| itincreditcard.com | 118 → 116 | 86 → 86 | 0 |

Every delta is exactly −2 (the two contact URLs); itinlending's +30 is the state set. Spot-
checked `/itin-loans/washington`, `/es/itin-loans/georgia`, `/itin-loans/texas` — all now
carry `<lastmod>2026-07-29</lastmod>`. `check-links` passes on all three.

One diagnostic note: the first itincreditcard build showed 114, not 116. That was a stale
local checkout (1 commit behind `origin/main`, missing the
`best-starter-credit-cards-itin-zero-credit-history` article pair), **not** the filter change.
Pulled and rebuilt to get the clean 116. Worth remembering — verifying a sitemap against a
behind-HEAD checkout will misattribute missing articles to whatever you just edited.

- Docs updated: this entry; the follow-up list on the request-indexing entry below now points
  here. Corrected a wrong claim in that entry: `<lastmod>` was never missing site-wide, only
  on the programmatic state pages.
- Follow-ups: deploy all three (`npm run build && bash scripts/deploy-to-docs.sh && git push`
  per site) — **not done, needs a go-ahead.** Once live, resubmit nothing: GSC re-reads the
  sitemap on its own, and the 6 dropped URLs should clear out of itincreditscore's
  "Excluded by 'noindex' tag" bucket over the following crawls.

## 2026-07-29 — Link Engine responder: 3 drafts from ~95 queries (business-loan denial, auto refi, debt consolidation)

Daily `link-engine-responder` run. Swept 12 labeled threads (5 digests after de-duping
bob@/info@ copies): SOS Wed AM + Tue PM, HARO 7/29 AM + 7/28 evening + 7/28 afternoon,
SourceBottle 7/28 + 7/29, Qwoted digest + Inc. single. Roughly 95 opportunities evaluated,
3 with genuine standing, all ITIN-finance bucket.

- Gmail drafts created (Bob sends): SBG Funding / Brian OConnell on small business loan
  denial (due 12:00 AM ET 7/30); NTD News / Brian OConnell on car loan refinancing (due
  8:00 PM ET 7/29); ConsumerAffairs / Lena Borrelli on bank debt consolidation loans (due
  5:00 PM ET 7/29).
- All three grounded in published site facts, no invented figures: SBA 100%-citizen rule
  effective 3/1/2026 and FY2025 LPR loan count, Accion/DreamSpring/Kiva terms
  (`itin-business-loan-lenders.md`); Experian 2025 deep-subprime auto rates, BHPH 25-35%,
  FICO 14-45 day inquiry window (`itin-auto-loan-lenders.md`); Fed 11.4% vs 21.52%,
  ITIN-friendly 7-26% APR (`itin-debt-consolidation-loan.md`).
- Copy of all three drafts also written to `.seo/link-engine/responder-2026-07-29.md`.
  Passed `humanize/cadence_check.py` at exit 0.
- Skipped as near-misses: CuraDebt and Business Insider (licensed attorney), BestMoney
  business bank accounts (No-AI flag plus Bob is not a banker), SourceBottle reverse
  mortgages (licensed adviser), Bloomberg autocallable ETFs (investment advice).
- Docs updated: this changelog.
- Follow-ups: ConsumerAffairs asks for pronouns as published. Left blank deliberately in
  both the Gmail draft and the file; Bob fills that in before sending.

## 2026-07-29 — GSC request-indexing batch: 11 URLs queued, quota hit; backlog is now almost entirely itinlending.net `/itin-loans/*` state pages

Daily scheduled request-indexing run (`itin-gsc-request-indexing`). Chrome/GSC auth was
available. **11 URLs successfully request-indexed** before "Quota Exceeded" on the 12th —
so the account-wide daily cap is **11, not 10**, and the run should keep going until GSC
actually refuses rather than stopping at a self-imposed 10.

**Requested today (all verified "not on Google" immediately before requesting):**

| # | URL | Prior state |
|---|---|---|
| 1 | `itincreditcard.com/es/business-credit-cards` | Crawled – currently not indexed |
| 2 | `itincreditscore.com/credit-readiness-calculator` | URL unknown to Google |
| 3 | `itincreditscore.com/es/credit-readiness-calculator` | URL unknown to Google |
| 4 | `itinlending.net/itin-loans/washington` | URL unknown to Google |
| 5 | `itinlending.net/itin-loans/pennsylvania` | URL unknown to Google |
| 6 | `itinlending.net/itin-loans/virginia` | URL unknown to Google |
| 7 | `itinlending.net/es/itin-loans/texas` | URL unknown to Google |
| 8 | `itinlending.net/es/itin-loans/california` | URL unknown to Google |
| 9 | `itinlending.net/es/itin-loans/florida` | URL unknown to Google |
| 10 | `itinlending.net/es/itin-loans/new-york` | URL unknown to Google |
| 11 | `itinlending.net/es/itin-loans/arizona` | URL unknown to Google |

`itinlending.net/es/itin-loans/georgia` was confirmed unknown-to-Google but **refused with
"Quota Exceeded"** — it is first in line tomorrow.

**Skipped — already indexed (13 verified by live URL Inspection, no quota spent).**
itincreditcard.com: `/unsecured-credit-cards`, `/build-credit-with-itin`,
`/business-credit-cards`, `/how-to-get-an-itin`, `/articles/authorized-user-credit-card-itin`,
`/articles/balance-transfer-credit-card-itin`, `/articles/cash-back-credit-card-itin-holders`.
itincreditscore.com: `/credit-reports-with-itin`, `/articles/utility-bills-credit-score-itin`,
`/articles/why-credit-score-different-each-bureau-itin`,
`/es/articles/closing-credit-account-itin-credit-score`, `/es/editorial-policy`.
itinlending.net: `/itin-loans/texas`, `/itin-loans/north-carolina`, `/es/itin-loans`,
`/articles/itin-personal-loan-no-credit-history`.

**Method correction — the Pages report is stale by ~6 days; always re-verify before spending
quota.** Every property's Pages report read "Last update: 7/23/26". Five URLs listed under
"Crawled – currently not indexed" (three on itincreditscore.com, one article pair on
itinlending.net) came back **"URL is on Google"** on live inspection. Requesting from the
report alone would have burned ~5 of 11 daily requests on already-indexed pages. The drilldown
is a *candidate* list only — the URL Inspection verdict is the ground truth.

**Where the remaining backlog actually is.** Sitemap-vs-indexed by site:

- **itincreditcard.com** — 118 sitemap / 66 indexed / 3 not-indexed. Backlog is **effectively
  cleared**: the only non-indexed sitemap URL was `/es/business-credit-cards` (requested).
  The other two are `http://itincreditcard.com/` (http→https redirect, expected) and a
  redirect row. Seven spot-checks all returned indexed — the "66" is just stale.
- **itincreditscore.com** — 120 sitemap / 75 indexed / 43 not-indexed, but the 43 is almost
  entirely **legacy non-sitemap URLs**: 13 × 404, 13 × alternate-with-canonical (all old
  `.html` URLs correctly canonicalising to their extensionless twins — healthy, no action),
  9 × noindex, 2 × redirect. Only the two calculator pages were real, both requested.
- **itinlending.net** — 158 sitemap / 86 indexed / 20 not-indexed → **this is where the real
  backlog lives.** ~52 sitemap URLs are undiscovered, concentrated in the
  `/itin-loans/<state>` and `/es/itin-loans/<state>` programmatic set (30 pages). Confirmed
  indexed: texas, north-carolina. Confirmed unknown: washington, pennsylvania, virginia (EN)
  and texas, california, florida, new-york, arizona, georgia (ES).

**Two findings worth fixing (not request-indexing problems):**

1. `itincreditscore.com/contact` is **in `sitemap-0.xml` but serves `noindex`**. A sitemap
   should never list a noindexed URL — either drop it from the sitemap or remove the
   `noindex`. The other 8 noindex pages are legacy (`/apply`, `/contact-us`,
   `/guest-columnist`, …) and correctly absent from the sitemap.
2. **The programmatic state pages ship with no `<lastmod>`.** *(Corrected — the first draft
   of this entry said "none of the three sitemaps emit `<lastmod>`", which was wrong: all
   three do, on articles, from committed frontmatter. Articles carry it, hand-written static
   pages deliberately do not, and the `/itin-loans/<state>` set fell in the second bucket by
   accident because it is not a content collection.)*

Ruled out as a cause: the sitemaps themselves are fine — itinlending.net's `sitemap-0.xml`
and `sitemap-index.xml` both read "Success, 158 discovered pages" on Jul 27. The
"Sitemaps: No referring sitemaps detected" line on individual URL Inspections is inspection
lag on not-yet-crawled URLs, not a submission problem.

**BACKLOG NOT CLEARED — keep this task enabled.** ~40 URLs remain, nearly all
itinlending.net state pages. At 11/day that is ~4 more runs. Tomorrow should start with
`itinlending.net/es/itin-loans/georgia`, then work through the remaining EN and ES
`/itin-loans/<state>` pages (illinois, maryland, massachusetts, nevada, new-jersey, new-york,
arizona, california, florida for EN; illinois, maryland, massachusetts, nevada, new-jersey,
north-carolina, pennsylvania, virginia, washington for ES) — inspecting each first.

- Docs updated: this changelog entry.
- Follow-ups: both fixed the same day — see the entry above.
- Checked and ruled out: internal linking to the state pages is **fine** — both
  `/itin-loans` and `/es/itin-loans` link all 15 states in each locale (verified by curl).
  The "Referring page: None detected" on the undiscovered state pages is therefore crawl
  lag, not a missing-link problem. Discovery is the bottleneck, which is exactly what
  request-indexing plus `<lastmod>` should address.

## 2026-07-27 — Shipped the 07-20 + 07-27 audit actions: 16 broken links, 119 ES locale leaks, cross-site funnel, /es de-cannibalized, link-check CI gate

Shipped in response to "none of the six actions from the 07-20 audit shipped." All code
actions from both audits are now live; two GSC-console actions remain open (bottom).

**New build gate — `web/scripts/check-links.mjs`** (wired as npm `postbuild`, so it runs on
every `npm run build`, including `deploy-to-docs.sh` and the daily-content workflow). It
resolves every internal link in the build against the files that actually exist, and
separately flags **ES pages whose body links point at the English twin**. `deploy-to-docs.sh`
is `set -euo pipefail`, so a failure now aborts *before* `rm -rf ../docs` — the build can no
longer publish broken links. Neither Lighthouse CI (visits a handful of URLs) nor the site
health monitor (pings money pages only) opens article bodies, which is why this went unseen.

**Fixed — 16 broken internal link targets** (the audit reported 7; its sweep only matched
relative `href="/…"` and missed absolute `https://itinlending.net/…` links). 60 links across
15 content files, all hand-authored markdown missing the `/articles/` segment:
`/how-to-build-credit-with-itin`, `/itin-bank-account`, `/itin-credit-builder-loan`,
`/itin-credit-score-check`, `/itin-down-payment-assistance`, `/itin-fha-loan-3-5-down`,
`/itin-loan-with-bad-credit`, `/itin-loans-{california,florida,texas}`,
`/itin-mortgage-lenders`, `/itin-mortgage-qualify`, `/itin-personal-loan-lenders`,
`/itin-renewal`, plus `/es/` variants. Also fixed the hardcoded absolute URLs in
`components/FhaPromo.astro` — both locales, the EN one was 404ing too.

**Fixed — 119 ES locale leaks across 34 ES articles (new finding, not in the audit).** The ES
translations inherited the EN articles' link targets wholesale, so nearly every ES article was
funnelling its internal link equity into the English tree and dropping Spanish readers onto
English pages. These never 404'd, so nothing caught them. Now repointed to `/es/…` wherever a
Spanish twin exists. Two stragglers needed hand-fixing: a backslash-escaped hyphen in a URL
(`itin-mortgage-lenders\-approved`) that dodged the rewriter, and 26 body links routed through
the legacy `/itin-credit-card` WordPress redirect stub (now pointed at the canonical
`/itin-credit-cards` / `/es/itin-credit-cards` that the stub itself declares).

**07-20 Action #4 — cross-site card funnel (open for five audits).** New
`components/CrossSiteCallout.astro` + styles, placed at the **top of the body** on
`/itin-credit-cards` and `/es/itin-credit-cards`, above the first H2, replacing the buried
`.form-note`. Dofollow outbound to itincreditcard.com. Uses the pine accent, never oxblood
(reserved for scam warnings).

**07-20 Action #6 + 07-27 Action #3 — schema parity on the pillars.** `/itin-loans` and
`/es/itin-loans` build on BaseLayout, not MoneyPageLayout, so they were missing the `WebPage` +
`Speakable` and `FinancialService` nodes every other money page gets. Extracted
`components/schema/SpeakablePageSchema.astro` (now shared with MoneyPageLayout) and added both
to each pillar. Verified in the build: both pillars now emit BreadcrumbList, FAQPage,
FinancialService, WebPage, SpeakableSpecification.

**07-27 Action #3 — de-cannibalized `/es`.** `SITE.taglineEs` and the ES homepage H1 no longer
compete with the pillar for "préstamos con ITIN": tagline is now "Guías Independientes de
Crédito y Financiamiento con ITIN", H1 "Crédito y financiamiento con ITIN, explicado en
español". The hero's secondary CTA is now a descriptive anchor down to the pillar ("Guía
completa de préstamos con ITIN"). EN tagline deliberately untouched — EN has no cannibalization
problem. Added a `¿Qué bancos prestan con ITIN?` section to `/es/itin-loans` using the verbatim
searcher phrasing (`prestamos de dinero con itin`, `financiamiento itin`, `bancos que prestan
con itin`) so the pillar can take those queries back from the homepage.

**07-20 Action #1 — renewal funnel.** `/articles/itin-renewal` is the site's #1 page by
impressions (282 @ 75.4) but had **zero** links to any money page, which was the specific ask.
Added a closing "Your ITIN is active again. What can you actually borrow?" section (EN + ES)
linking down to `/itin-loans`, `/itin-mortgage`, `/itin-auto-loan`, `/itin-personal-loans`.
Promoted `tier: detail → cluster` (2,492 words, out-impresses the pillar). Deliberately did
**not** stand up a separate `/how-to-renew-itin` hub: the existing article already covers the
whole cluster with question-format H2s, and a second page for the same intent is exactly the
cannibalization pattern just diagnosed on `/es`. The action allowed "build **or substantially
deepen**". Also fixed a live typo in the ES article ("uchas personas" → "Muchas personas").

**07-20 Action #3 — breadcrumbs:** closed in the 07-27 audit; no code change needed.

**✅ GSC sitemaps — FIXED, and the diagnosis was confirmed.** With the owner's go-ahead,
removed all three legacy sitemaps (`http://…/sitemap` from 2014 that was erroring,
`http://…/sitemap.xml`, `https://…/sitemap.xml`), then re-submitted. Result, verified live:

| Sitemap | Submitted | Last read | Status | Discovered |
|---|---|---|---|---|
| `https://itinlending.net/sitemap-0.xml` | Jul 27, 2026 | **Jul 27, 2026** | Success | **158** |
| `https://itinlending.net/sitemap-index.xml` | Jul 27, 2026 | **Jul 27, 2026** | Success | 0 |

Last read moved **Jun 6 → Jul 27**, closing the 51-day gap. The key detail worth remembering:
**the sitemap INDEX reports 0 discovered pages even when healthy — only the leaf sitemap
reports the real count.** Submitting `sitemap-0.xml` directly is what surfaced all 158 URLs.
Submitting the index alone (the state since Jun 6) left Google with no page-level discovery
signal at all. **Submit both on every ITIN property**; a relative path is rejected on a domain
property, the full `https://…` URL is required.

- Docs updated: `project-docs/CHANGELOG.md`. The new script is documented in-file.
- ~~**Still open:** `~/Itin/.secrets/` is absent, Bing + Serper keys missing.~~
  **CORRECTED — the keys were never missing.** They live with the *skill*
  (`~/.claude/skills/seo-pulse/.secrets/`), not the project, so `~/Itin/.secrets/` has never
  existed and its absence proves nothing. Both verified working 2026-07-27. This same false
  alarm was raised in the 06-24, 07-13, 07-20 and 07-27 runs across all three sites — the
  correct path was already recorded in this changelog on 2026-06-20. `.seo/context.md` now
  documents the real path, the venv requirement, and the exact commands. **Second trap:** the
  scripts need the skill's venv — system `python3` fails with `ModuleNotFoundError: yaml`,
  which reads like a broken install. Use
  `~/.claude/skills/seo-pulse/.venv/bin/python`.
- **Bing data pulled and added to the audit — and it changes the picture.** On Bing the site
  ranks **page 1** for the same commercial queries Google buries at 75-90: `personal loan with
  itin number` Bing **6.8** vs Google **85.4**; `mortgage with itin number` Bing **7.0** vs
  Google **89.1**; `personal loans with itin number` Bing **7.0** vs Google **38.8**. Six
  business-loan queries sit at Bing **pos 1-2**. The top-40 Bing set earned **6 clicks** —
  equal to the site's entire 28-day Google click count. The "authority wall" is a Google
  weighting problem, not a content-quality problem. Added a recommended HIGH action: build out
  the ITIN business-loan cluster (Bing pos 1-2, and `/itin-business-loans` is the site's best
  Google money page at pos 33). **Report Bing alongside Google every week from now on.**
- **Watch next audit:** indexed count (78 as of the stale 7/9 report) against the 158 now
  discovered; `/es/itin-loans` earning impressions for `prestamos de dinero con itin` while
  `/es` falls back; and whether the money pages lift off the 75-90 wall.

## 2026-07-27 — itincreditscore.com: all 3 audit plumbing defects FIXED, deployed, and verified live

Follow-up to the audit entry below. Commits `951e230` + `e6033a8`, pushed to `main`,
GitHub Pages deploy confirmed live.

- **[1] Sitemap `lastmod` — SHIPPED.** The fix was already written but uncommitted; another
  session committed the source (`e814511`) and this run built and deployed it. Live sitemap now
  carries **120 URLs / 28 distinct per-article `lastmod` values** (was 118 URLs / **1** identical
  build-time stamp). Google has a real freshness signal for the first time since Jun 6.
- **[2] 208 broken internal links — FIXED.** Rewrote every un-prefixed article link across 47
  files: EN → `/articles/<slug>`, ES → `/es/articles/<slug>`, so Spanish readers stay in their
  own locale. `/authorized-user-with-itin-credit-building` (a wrong slug, not just a missing
  prefix) remapped to `/articles/authorized-user-credit-building-itin`. **Verified live: all 20
  spot-checked EN+ES targets return 200** where 26 targets were 404s.
- **[3] `.html` language-toggle duplicates — FIXED at the root.** Normalized inside `altPath()`
  (`src/i18n/ui.ts`) rather than at the call site, so every caller inherits it — matching what
  `getLangFromUrl()` already did for the same reason. **0 of 126 pages now emit a `.html` toggle**
  (was 121 of 139). Verified live on EN, ES, article, and pillar pages. Distinct internal hrefs
  in the build dropped 266 → 125. This closes the finding carried since Jun 29.
- **Stopped both bugs at the source (new):**
  - `scripts/lib/generate.mjs` — the article prompt said only "internal-link naturally" with no
    path convention, so the model guessed `/<slug>` and every generated article shipped 404s.
    It now states the convention, lists the valid top-level money/hub pages, and says to fall
    back to those when unsure. The newest daily article had already shipped 10 such links.
  - `scripts/lib/translate.mjs` — the translator is correctly told never to touch URLs, but an
    untouched URL is an *English* path, which is why every ES article linked out of `/es`.
    Added `localizeInternalLinks()`, applied deterministically to body, FAQs, and quickAnswer
    after translation. Done in code, not the prompt: path rewriting shouldn't be a judgement call.
- **Regression guard:** added `scripts/check-links.mjs`, wired as **`postbuild`**, so a build now
  fails if any internal link points at a page that doesn't exist. Currently passing.
- Verified EN and ES render independently (correct `h1`, `html lang`, `inLanguage: es-419`).
  The glob-loader duplicate-id warning during build is a **pre-existing** Astro 5 legacy-collection
  artifact (`src/content/config.ts` still uses `type: 'content'`) and does **not** overwrite either
  locale — flagged, not chased.
- Note: live reads immediately after deploy returned stale CDN copies showing the old markup.
  Cache-busted re-reads confirmed all three fixes. Worth remembering for future verification.
- Docs updated: `project-docs/CHANGELOG.md`.
- Follow-ups: (1) **apply the same three fixes to itinlending.net and itincreditcard.com** — the
  `lastmod` bug is family-wide and the link/switcher bugs are likely shared too; (2) in GSC delete
  the dead `sitemap.blog.xml` entry, re-submit `sitemap-index.xml`, and request indexing on the
  money/pillar/ES pages; (3) add `/about` → money-page link; (4) migrate `src/content/config.ts`
  off the legacy `type: 'content'` collections to clear the duplicate-id warning.

---

## 2026-07-27 — Weekly SEO/AEO audit (itincreditscore.com): consolidation reversed in our favour; 3 plumbing defects found (200 broken links, `.html` switcher, unshipped `lastmod` fix)

- Ran the scheduled weekly audit. Output:
  `~/ITINCreditScore/.seo/output/seo-audit-creditscore-2026-07-27.md`. GSC window 6/28→7/25
  read live via browser; GA4 same window (property 413651450); sitemap/schema/hreflang/link
  checks via `curl` + a full sweep of the built `/docs` output.
- **Top line:** impressions 1,130 → **963 (−15%,** 2nd consecutive decline), clicks flat at 1,
  avg position 61.3 → 61.9, queries 94 → 82. Indexed **64 → 75 (+11)** but **not-indexed 21 → 43
  (doubled)** — 404s 4 → **13**, alternate-canonical 5 → **13**.
- **✅ The 5-audit consolidation finding is CLOSED.** `/check-credit-score-with-itin` went
  227 impr / pos 79.8 → **309 impr / pos 71.1**, is now the #1 page by impressions, and has
  overtaken `/about` (281/69.0 → 216/74.0). Google re-picked the correct page on its own.
- **✅ The 07-20 bureau-page rebuild shipped and worked.** `/credit-bureaus-and-itin`
  53.3 → **50.4**; `credit report with itin` 39.4 → **27.8**; `equifax itin credit report official`
  61.0 → **21.5**; `transunion credit report itin` **returned at 31.0**; the TransUnion
  18-position two-audit slide **halted** at 59.7.
- **⚠️ Correction to five prior audits:** the repeated #1 recommendation — "give the money page an
  exact-phrase H1 + title + Quick Answer block" — **was already shipped in the launch commit
  `675c2e1` (2026-06-06)**. Verified in `src/pages/check-credit-score-with-itin.astro:27,31,32`.
  Five audits recommended work that was already done. The only genuinely missing link is
  **`/about` → money page (still zero)**; the 8 hub pages and 7 articles already link correctly.
- **🚨 200 broken internal links → 26 confirmed live 404s (new, HIGH):** full sweep of the built
  `/docs` (138 pages, 266 distinct internal hrefs). 26 targets omit the `/articles/` path segment
  and 404 live; 200 link instances across **45 files (22 EN, 23 ES)**. Worst: `/credit-builder-loan-with-itin`
  (44×), `/how-to-dispute-credit-report-errors-with-itin` (24×), `/how-to-check-credit-score-with-itin-number`
  (21×). **ES articles link to EN 404s** — same cross-locale bug as itinlending.net today.
  `/authorized-user-with-itin-credit-building` is a wrong slug entirely. Explains the 4 → 13 404 jump.
- **🚨 Root cause of the 4-audit `.html` duplicate found (new, HIGH):** `astro.config.mjs:55` sets
  `build: { format: 'file' }`, so `Astro.url.pathname` ends in `.html`. `BaseLayout.astro:43-47`
  strips it before canonical/hreflang (those are clean), but **`Nav.astro:9` passes the raw
  pathname to `altPath()`**, so the language toggle emits `/about.html`-style links on **121 of 139
  built pages**. Explains alternate-canonical 5 → 13. One-line fix (normalize inside
  `altPath()` in `src/i18n/ui.ts:170`).
- **🚨 Sitemap unread 51 days — cause confirmed, fix written but UNSHIPPED (new, HIGH):** live
  `sitemap-0.xml` carries 118 URLs with **one identical `lastmod`**; GSC last read the sitemap
  **Jun 6, 51 days ago**, 0 discovered pages. This is the `lastmod: new Date()` bug diagnosed in
  today's itincreditcard.com audit. **A correct fix already sits uncommitted in this repo**
  (`git status`: `M web/astro.config.mjs`, +40/−1 — adds `buildArticleLastmodMap()` from
  frontmatter dates) and the local `dist/` build proves it works (lastmods properly spread).
  It is **not committed and not deployed**; `docs/` and the live site still have the single stamp.
  Needs `npm run build && bash scripts/deploy-to-docs.sh` + commit + push. A dead WordPress-era
  `sitemap.blog.xml` (last read Nov 2023) is also still submitted in GSC.
- **ES locale:** impressions ~21 → **7 (−67%)**; 5 pages earning, ES pillar still **pos 4.0** and
  three ES articles at pos 5–16 — quality is fine, reach is not. Five ES queries dropped out.
  `cómo ver mi crédito con itin` **surfacing at pos 79.0** (flat, 3rd audit);
  `puntaje crediticio con itin` **still absent**. **`/es/check-credit-score-with-itin` dark for a
  3rd audit and now verified technically clean** — 200, self-canonical, reciprocal hreflang,
  `inLanguage: es-419`, 2,679 words, 4 inbound links from `/es`. Every prior hypothesis
  (hreflang/canonical/thin/links) is disproven; and unlike itinlending.net it is **not** `/es`
  homepage cannibalization (`/es` is also at 0). Remaining explanation is discovery.
- **GA4 (Jun 29 – Jul 26):** sessions 202 → 194. **Organic Search 15 → 18** with 61.1% engagement /
  1m16s and the property's **first-ever key event**. AI Assistant 4 → 5 but still 0 engaged / 0s
  (3rd straight window of instant bounces). Direct 165 (85%).
- **Meta-finding:** the last five audits diagnosed content when the problem was plumbing. This run
  swept the built output and crawl surface instead of the dashboards and found three concrete,
  cheap defects. Content pipeline is healthy and needs no help.
- Docs updated: `project-docs/CHANGELOG.md` (this entry);
  audit at `~/ITINCreditScore/.seo/output/seo-audit-creditscore-2026-07-27.md`.
- Follow-ups: (1) deploy the `lastmod` fix + clean GSC sitemaps, all three sites; (2) fix the 200
  broken article links + add a build-time link check; (3) one-line `altPath()` normalization;
  (4) add `/about` → money-page link; (5) diagnose the homepage slide 49.0 → 58.4 (−9.4, largest
  single-page loss) against the 07-23 AI-tells pass `7fdcf01`.

---

## 2026-07-27 — Weekly SEO/AEO audit (itincreditcard.com): sitemap `lastmod` bug found (family-wide root cause), ChatGPT now #1 non-direct channel

- Ran the scheduled weekly audit. Output: `~/ITINCreditCard/.seo/output/seo-audit-creditcard-2026-07-27.md`.
  GSC window 6/28→7/25 read live via browser; GA4 same window (property 540443142);
  sitemap/schema/hreflang checks via `curl` + built output.
- **Top line:** impressions 144 → 156 (+8%), clicks flat at 0, **avg position 75.3 → 68.5**
  (+6.8, best single-cycle move on record). Pages earning impressions 26 → 32 (+23%).
  `itin credit card` **recovered 100.1 → 91.3**, confirming 07-20's "transitional, not dilution"
  call. `best itin credit cards` 64.7 → **58.5**.
- **🚨 Sitemap `lastmod` bug — ROOT CAUSE, and it is FAMILY-WIDE (new, HIGH):** all 114 URLs in
  `sitemap-0.xml` carry an *identical* `lastmod` regenerated on every build, because
  `web/astro.config.mjs:25` sets `lastmod: new Date()`. To a crawler the site claims all 114 pages
  changed simultaneously every deploy, so the freshness signal is discounted and the sitemap drops
  down the crawl queue. GSC: `sitemap-index.xml` **last read Jun 20 — 37 days ago**, 0 discovered
  pages; only the index is submitted, never the child. **The same line exists in all three sites** —
  `~/Itin/web/astro.config.mjs:59` and `~/ITINCreditScore/web/astro.config.mjs:46`. This is the
  cause behind the "sitemap unread 51 days" symptom today's itinlending.net audit flagged without
  diagnosing. Fix all three in one pass.
- **✅ ChatGPT is now the largest non-direct channel (new):** GA4 AI Assistant **3 → 10 sessions
  (+233%)**, 100% `chatgpt.com / ai-assistant`. Beats Bing (7) and DuckDuckGo (4). **`google /
  organic` = 0** — every organic session is Bing or DDG, independently confirming GSC's 0 clicks.
  The site is currently an AI-answer-engine + Bing property, not a Google one. Pillar
  `/itin-credit-cards-guide` is the #2 GA4 landing page (15 sessions, 36s) on just 2 Google
  impressions — proof the discovery is AI/Bing-driven.
- **✅ ES zero-query mystery resolved (methodology correction):** filtering GSC to `/es` returns
  17 impressions at **pos 6.1** but **"No data"** on queries — no query clears GSC's anonymization
  threshold at 4 pages × single-digit impressions. "Zero Spanish queries" is therefore *not* a
  diagnostic signal and prior audits over-read it. Judge /es on pages-surfacing + position for ≥2
  more cycles. `/es/best-itin-credit-cards` **surfaced for the first time (pos 28)** — first ES
  money page ever. ES technicals re-verified clean: reciprocal hreflang, `inLanguage: es-419`,
  crawlable `<a href="/es">` switcher, 57 ES URLs in sitemap, 41 ES articles built.
- **Homepage cannibalization — carried, unshipped for the 3rd audit.** `<title>` unchanged; body
  "ITIN credit card" 22 → 21 (incidental churn from the 7/23 AI-tells pass, not a de-optimization).
  Homepage share improved 88.2% → **79.5%** but only because other pages surfaced. On the core
  money query the gap **widened**: `credit cards that accept itin` = 14 impr @ pos 88.3 (homepage)
  vs `/credit-cards-that-accept-itin` = 1 impr @ **pos 7.0**.
- **New opportunity — ITIN→SSN transfer cluster:** query `how to transfer credit from itin to
  social security` appeared (3 impr, pos 81.3) and `/articles/itin-to-ssn-credit-card-history-transfer`
  was the biggest new page entrant (6 impr, **pos 46**). Under-served by established affiliate
  sites and movable from page 5.
- **Backlinks: 0 for the 5th consecutive audit** — still the hard ceiling on head terms.
- **Schema clean:** Breadcrumbs 48 valid / 0 invalid, no issues in 90 days. Note 48 valid items
  and 32 pages earning impressions both exceed the panel's "27 indexed" — the Page Indexing panel
  is stale and understates the real index.
- **Caveats:** Serper/Bing API keys absent from disk for the 3rd run (`~/ITINCreditCard/.secrets/`
  and `~/Itin/.secrets/` do not exist) — live absolute-SERP checks were a no-op. GSC↔GA4 still
  unlinked.
- Docs updated: `project-docs/CHANGELOG.md`; audit written to `~/ITINCreditCard/.seo/output/`.
- **Follow-ups / open items:**
  1. Fix `lastmod: new Date()` in all three `astro.config.mjs` (emit real per-page dates); submit
     `sitemap-0.xml` directly in GSC alongside the index; add it as a second `Sitemap:` line in
     robots.txt. Verify with `grep -o '<lastmod>[^<]*' docs/sitemap-0.xml | sort -u` → many values.
  2. Check itincreditscore.com's GSC Sitemaps panel for the same unread-sitemap pattern.
  3. Ship the homepage de-optimization (3rd audit carrying it).
  4. First external backlink — Reddit/Quora answers + one guest-post pitch.
  5. Give the pillar the citation treatment (issuer comparison table, "last verified" date,
     stat every 150–200 words) — it's the page AI engines already land on.
  6. Request indexing for the remaining `/es` money pages.
  7. Restore Serper/Bing keys or drop the claim from `context.md`; link GSC ↔ GA4.

## 2026-07-27 — Weekly SEO/AEO audit (itinlending.net): sitemap unread 51 days, 7 broken links, ES cannibalization diagnosed

- Ran the scheduled weekly audit. Output: `.seo/output/seo-audit-lending-2026-07-27.md`.
  GSC window 6/28→7/25 read live via browser; GA4 same window; schema/hreflang/link checks
  via `curl` against the live site.
- **Top line:** impressions 1,930 → 2,020 (+4.7%), clicks flat at 6, avg position 68.9 → 67.5.
  **ES impressions 127 → 237 (+87%)** — best ES period on record. Organic sessions 32 → 43
  (+34%), AI referrals 14 → 16. Bing is the best channel on the site (18 sessions, 88.9%
  engagement, 2m02s).
- **🚨 Sitemap discovery bottleneck (new, HIGH):** GSC shows `sitemap-index.xml` submitted
  Jun 6, **last read Jun 6 — 51 days ago**, 0 discovered pages. Live sitemap has 156 URLs;
  78 indexed. Three dead WordPress-era sitemaps (2023 ×2, 2014 ×1) still submitted, the 2014
  one erroring. This corroborates today's earlier request-indexing entry — same root cause,
  now confirmed with the GSC Sitemaps data for this property.
- **🚨 7 broken internal links (new, HIGH):** hand-authored markdown body links missing the
  `/articles/` segment, all 404. ES: `/es/itin-fha-loan-3-5-down`,
  `/es/itin-down-payment-assistance`, `/es/itin-mortgage-qualify`, `/es/itin-renewal`.
  EN: `/how-to-build-credit-with-itin`, `/itin-loan-with-bad-credit`, `/itin-loans-florida`.
  Sources: `web/src/content/articles-es/{itin-mortgage-requirements,itin-down-payment-assistance,itin-fha-loan-3-5-down,itin-auto-loan-lenders}.md`,
  `web/src/content/articles/itin-auto-loan-lenders.md`, and a hardcoded URL at
  `web/src/components/FhaPromo.astro:21`. The ES `itin-auto-loan-lenders` copy inherited the
  EN un-prefixed paths, so ES readers hit **English** 404s.
- **✅ ES money-page zero-impression gap — diagnosed after three audits of wrong guesses.**
  Not links (identical to EN), not depth (1,988–2,495 words), not hreflang/canonical/
  `inLanguage`/`lang`/breadcrumbs (all verified correct). Cause is **`/es` homepage
  cannibalization**: `/es` earns 76 impressions across 22 `prestamos con itin`-family queries
  while every ES money page earns zero. `/es` and `/es/itin-loans` have near-duplicate titles
  and H1s. Fix is differentiation, not more ES word count.
- **✅ Breadcrumbs closed (07-20 Action #3):** GSC 0 invalid / **20 valid** (up from 15), and
  `BreadcrumbList` verified present in source on every non-homepage type, both locales. The
  29→15 dip after the 07-17 redesign was crawl-sampling noise, not a template regression.
- **Carried, still unshipped:** none of the six 07-20 actions landed. Renewal hub (the
  `/articles/itin-renewal` page is now the site's **#1 page by impressions**, 282 @ 75.4),
  cross-site card callout (un-actioned for five audits, now ~85 EN + 6 of top-19 ES queries),
  ES work. Commits since 07-19 were three daily-content articles + an AI-tells copy pass.
- **Caveats:** GSC Page Indexing data is 18 days stale (last update 7/9/26) — the 78/17 split
  is the same snapshot 07-20 read, so indexation is unmeasured this week. Core Web Vitals have
  **no CrUX field data** for either device type ("not enough usage data in the last 90 days"),
  so the 07-17 font change is still unvalidated in the field.
- Docs updated: `project-docs/CHANGELOG.md`; audit written to `.seo/output/`.
- **Follow-ups / open items:**
  1. GSC → Sitemaps: delete the three legacy sitemaps, re-submit `sitemap-index.xml` **and**
     `sitemap-0.xml`; confirm "Last read" advances within 7 days.
  2. Fix the 7 broken links + add a build-time internal-link check (resolve every internal
     `href` in `/docs` against the sitemap, fail the build on a miss) — Lighthouse CI and the
     site health monitor both miss this class of bug.
  3. Re-target `/es` as a routing hub; give `/es/itin-loans` the head phrase plus the missing
     `WebPage`/`FinancialService`/`Speakable` schema it lacks vs its ES siblings.
  4. Build the renewal hub (`/how-to-renew-itin` + 2 detail pages, EN and ES).
  5. `~/Itin/.secrets/` does not exist on this machine — the Bing Webmaster + Serper keys that
     `.seo/context.md` records as wired are absent, so no Bing/SERP data this run. Reconcile
     the seo-pulse wiring or correct the context file.

## 2026-07-27 — GSC request-indexing batch: 11 URLs queued, quota hit; sitemap re-read is the real bottleneck

- Ran the daily request-indexing pass across all three properties. **11 URLs successfully
  request-indexed** before "Quota Exceeded" (so the account-wide daily cap is ~11, not 10).
  Chrome/GSC auth was available throughout.
- **Requested today (all confirmed "Indexing requested"), all previously "URL is unknown to Google":**
  - `itincreditcard.com/articles/credit-card-reconsideration-line-itin` (+ `/es/` twin)
  - `itincreditcard.com/articles/itin-credit-card-bank-by-bank-application-guide` (+ `/es/` twin)
  - `itincreditcard.com/articles/credit-card-itin-apply-online-vs-in-branch` (+ `/es/` twin)
  - `itincreditscore.com/articles/collections-on-credit-report-itin-holders` (+ `/es/` twin)
  - `itincreditscore.com/articles/cpn-vs-itin-credit-privacy-number-scam` (+ `/es/` twin)
  - `itincreditscore.com/articles/goodwill-letter-late-payment-itin-credit-score` (EN only —
    the `/es/` twin is what tripped the quota, so it is **first in tomorrow's queue**)
- **Skipped as already indexed (6):** `itincreditcard.com/unsecured-credit-cards`,
  `/build-credit-with-itin`, `/articles/credit-cards-that-accept-itin-verified-issuer-list`,
  `/articles/foreign-credit-history-credit-card-itin`,
  `itinlending.net/articles/itin-personal-loan-no-credit-history` and its `/es/` twin.
- **The task file's priority list is stale and should be rewritten.** It assumes
  itincreditcard.com has "only ~4 pages indexed" and names `unsecured-credit-cards`,
  `build-credit-with-itin`, `business-credit-cards`, `how-to-get-an-itin` as targets — all four
  are indexed. Card-site money pages are done. The real backlog is **the newest articles**:
  everything published 2026-07-17 or later on the card and score sites is unknown to Google,
  while 07-15 and older is indexed. Targeting by publish date (newest first, EN + `/es` twin)
  is the method that works; the `lastmod` field in the sitemaps is a uniform build timestamp
  and is useless for this.
- **itinlending.net is fully indexed through the newest content, EN and ES** — no backlog there.
  Skip it in future runs unless a spot-check says otherwise.
- **Root-cause finding — Google is not re-reading the sitemaps.** Every unindexed URL inspected
  reported `Sitemaps: No referring sitemaps detected` / `Referring page: None detected`.
  Sitemaps report confirms it:
  - `itinlending.net/sitemap-index.xml` — submitted Jun 6, **last read Jun 6** (51 days)
  - `itincreditscore.com/sitemap-index.xml` — submitted Jun 6, **last read Jun 6** (51 days)
  - `itincreditcard.com/sitemap-index.xml` — submitted Jun 6, last read Jun 20 (37 days)
  All three report `Discovered pages: 0`. Manual request-indexing is treating the symptom;
  until the sitemap is being re-fetched, every new daily article will need a manual request.
- Stale legacy sitemaps still registered and worth removing: `itinlending.net` has three
  (`https://…/sitemap.xml` 2023, `http://…/sitemap.xml` 2023, `http://…/sitemap` from 2014 with
  1 error); `itincreditscore.com` has `http://itincreditscore.com/sitemap.blog.xml` from 2023.
- Backlog snapshot (sitemap URL count vs GSC indexed): card 116 / 27 indexed (GSC data last
  updated 7/9, so understated — several spot-checked pages are indexed but not in the report);
  score 118 / 64 indexed, 21 not indexed; lending 156 / 78 indexed, 17 not indexed
  (8 of those are intentional `noindex`). **BACKLOG NOT CLEARED — keep this task enabled.**
- Docs updated: `project-docs/CHANGELOG.md`.
- Follow-ups: (1) resubmit/ping the three sitemap-index URLs in GSC to force a re-read, and check
  whether the IndexNow ping is actually firing on daily publish — that is the durable fix;
  (2) delete the four stale legacy sitemap entries; (3) rewrite the scheduled task's priority
  section to "newest articles first, EN + `/es`, card + score only".

## 2026-07-27 — Link Engine responder: 1 draft (Martha Stewart Living, gas-station money mistakes)

- Reviewed ~40 opportunities across SOS, HARO, Qwoted (2 digests + 2 singles), SourceBottle x2.
  One qualified: Martha Stewart Living via Qwoted, due 4 Aug, answered from the credit-card side
  (debit pre-auth holds, cash vs credit pricing, fuel points vs card rewards) with a disclosed
  Well Worth mention on the car-wash question. Draft passed `cadence_check.py` clean.
- Qwoted takes responses only through its platform, so the Gmail draft is a paste source addressed
  to bob@ rather than a reply. Full text also at `.seo/link-engine/responder-2026-07-27.md`
  with the skip list and reasons.
- Docs updated: `project-docs/CHANGELOG.md`.
- Follow-ups: none. Six finance queries were skipped as licensed-professional/advisor-only, which
  is the usual pattern; the ITIN buckets rarely match generic personal-finance calls.

## 2026-07-27 — Link Engine weekly run #3 (scheduled): score-site syndication drafted, Quora queue resumes

- **Backlink diff (`links.py --all`):** Bing WMT GetLinkCounts returns **0/0/0** for
  lending/card/score again, all still labeled "first snapshot — baseline" because
  `.cache/links-*.json` are empty arrays (`[]`, rewritten today 08:13). No NEW/LOST deltas
  vs run #2 (7/20). Non-ITIN properties (Pour Picks, Perfume Picks, Timberline, Stick Picks,
  Percolate, Underdial, Well Worth) all 400 on the API (not Bing-verified) — ignored per task
  rules and omitted from the digest since nothing changed. Standing note carried from run #2:
  the plan's "1 marketwatch.com link" is a GSC-side figure; Bing's index shows 0, and Bing is
  what this monitor tracks. **Latent tooling issue:** because the cache never persists a
  non-empty snapshot, `links.py` will report "first snapshot" forever and can never surface a
  delta. Worth a look in a live session.
- **Syndication draft #3 (rotation → SCORE week):** cycle is lending (7/18, `itin-renewal`) →
  card (7/20, `balance-transfer-credit-card-itin`) → score today. Highest-impression score
  article not yet syndicated = `experian-boost-alternative-data-itin` (11 impr / 28d, tied at
  the top of itincreditscore.com with `itin-credit-building-immigration-status`, which stays
  available as next score-week's candidate). Wrote two adaptations, both **cadence_check
  exit 0**:
  - `~/Itin/.seo/syndication/2026-07-27-experian-boost-alternative-data-itin-medium.md`
    (793 words; cleared 4 triads, 2 aphorism buttons, 1 "X, not Y" contrast, and a uniform
    3-sentence-paragraph WARN; ends with the canonical link to the score article).
  - `...-linkedin.md` (240 words, ends with the plain canonical URL).
- **Quora queue: RESUMED.** Cadence guard clears — last posted batch was 7/18 (run #3, 10
  answers total), today is 7/27 = 9 days. Two candidates queued, both on fresh ground vs the
  10 topics already answered (auto loan, mortgage, first card, score-without-SSN, checking
  score, student cards, personal loans, ITIN renewal, CPN scam):
  1. "When you submit a rental application using your ITIN or EIN rather than SSN, what will
     the landlord see exactly?" — `quora.com/When-you-submit-a-rental-application-using-your-ITIN-or-EIN-rather-than-SSN-what-will-the-landlord-see-exactly`
     Angle: what tenant screening actually pulls on an ITIN, plus rent reporting and
     VantageScore 4.0 in rental screening. Links naturally to the score site.
  2. "Will I automatically get an ITIN when I apply for EIN?" —
     `quora.com/Will-I-automatically-get-an-ITIN-when-I-apply-for-EIN`
     Angle: EIN and ITIN are separate applications (W-7 vs SS-4); clears up the business-owner
     confusion. Fresh W-7/EIN ground per the plan.
     Backup if either is dead: "Can a foreigner with an established LLC in the USA get business
     loans or business credit cards from USA banks?" (has one weak reshared answer).
- **Verification caveat on the Quora candidates:** Quora blocks plain `curl` (empty response on
  every candidate URL), so "unanswered" could not be confirmed via the "No answer yet" marker.
  Verification is snippet-based instead: Serper returns a **bare-title snippet with no answer
  text** for both queued questions, which is the signal used for weak/no answer. Bob should eyeball
  the answer count in-browser before posting in the live session.
- **Digest:** sent to +17165109313 (backlinks, score syndication draft ready, 2 Quora candidates).
- Docs updated: this CHANGELOG entry.
- Follow-ups / open items: (1) Bob to review + publish the score syndication drafts (Medium +
  LinkedIn as Timberline company page); (2) reply "go" to post the 2 Quora answers in a live
  session; (3) investigate why `links.py` never persists a snapshot to `.cache/links-*.json`;
  (4) next run (8/3) is the **4th-week slot** = flag a non-ITIN original-post angle (Pour Picks
  / Perfume Picks / Well Worth) instead of adapting an article.
- Per task rules: files left UNCOMMITTED for Bob's live-session review. Nothing committed,
  pushed, posted, or emailed.

---

## 2026-07-26 — GSC request-indexing daily batch: 0 requested (quota exhausted on the first attempt again); 5-URL queue confirmed for tomorrow; rolling-quota pattern identified

- Ran the daily GSC request-indexing batch across all three ITIN Domain properties. Chrome open, GSC
  authenticated on the shared Google account (**auth available ✓**).
- **Quota hit: YES — on the very first request attempt.** Pushed the carryover URL from 7/25
  (`itincreditcard.com/es/articles/itin-credit-card-bank-by-bank-application-guide`, live-inspected as
  "URL is unknown to Google" immediately before clicking) → "Quota Exceeded — try again tomorrow."
  Per the task rules, stopped requesting. **Net requested today: 0.**
- **Rolling-quota pattern, not a midnight reset.** 7/24 = 0 requests (quota already drained), 7/25 = 11
  requests, 7/26 = 0 (drained). The alternating pattern is what you'd expect from a ~24h rolling window
  rather than a calendar-day reset: yesterday's run consumed all 11 at roughly this hour, so the window
  hadn't refilled by the time today's run fired. Ruled out the daily-content pipeline as the culprit —
  its only indexing step is `scripts/indexnow.mjs` (IndexNow → Bing/Yandex), which does not touch
  Google's request-indexing quota. **Fix: shift this task's schedule ~3h later** so it fires after the
  window refills, or accept the every-other-day cadence.
- **Queue confirmed for the next run (all live-inspected today, all "URL is unknown to Google", no
  quota spent on inspection) — request in this order:**
  1. `itincreditcard.com/es/articles/itin-credit-card-bank-by-bank-application-guide` (2nd day of carryover)
  2. `itincreditcard.com/articles/credit-card-itin-apply-online-vs-in-branch`
  3. `itincreditcard.com/es/articles/credit-card-itin-apply-online-vs-in-branch`
  4. `itinlending.net/articles/state-of-itin-lending-2026`
  5. `itinlending.net/es/articles/state-of-itin-lending-2026`
- **Verified already indexed, skipped (3):** `itinlending.net/articles/itin-personal-loan-bad-credit`,
  `itinlending.net/es/articles/itin-personal-loan-bad-credit`,
  `itinlending.net/articles/itin-personal-loan-no-credit-history`.
- **The request mechanism is working — confirmed end-to-end.** `itin-personal-loan-no-credit-history`
  was request-indexed yesterday (7/25) and today reads **"URL is on Google — Page is indexed"**, a
  ~1-day turnaround. Not every request lands that fast: `itincreditscore.com/articles/collections-on-credit-report-itin-holders`,
  also requested 7/25, still reads "URL is unknown to Google" — normal request→crawl latency, no action needed.
- **Note on the 7/25 indexation cutoff:** it has moved but is still sharp. Articles added 7/17 are now
  indexed (`itin-personal-loan-bad-credit`, both locales); 7/18 and later are not
  (`state-of-itin-lending-2026`, both locales). Every unindexed URL again showed
  **"Sitemaps: No referring sitemaps detected"** — the 7/25 root cause (child sitemaps never submitted,
  parent index showing Discovered pages = 0) is unchanged and remains the highest-leverage fix.
- **Backlog remaining:** NOT cleared — 5 known unindexed URLs queued. **Do NOT disable this task.**
- Docs updated: CHANGELOG.md.
- Follow-ups (1 and 2 carried over from 7/25, still undone):
  1. **Submit the child sitemaps directly** in GSC → Sitemaps on each property (`sitemap-0.xml` for
     itincreditcard.com, itincreditscore.com, itinlending.net). Left undone deliberately — a write action
     to an external service this scheduled task does not authorize. Needs Bob, and it is the fix that
     would end the daily manual request-indexing dependency.
  2. Clean up stale/legacy sitemap submissions on itinlending.net (`http://itinlending.net/sitemap`,
     "1 error" since 2019, plus two legacy WordPress entries) and `http://itincreditscore.com/sitemap.blog.xml`.
  3. **Reschedule this task ~3h later** so it stops firing into an empty quota window.

## 2026-07-25 — GSC request-indexing daily batch: 11 URLs requested, quota hit on the 12th; root cause found — sitemaps not being re-read (Discovered pages = 0 on all three sites)

- Ran the daily GSC request-indexing batch across all three ITIN Domain properties. Chrome open, GSC
  authenticated on the shared Google account (auth available ✓).
- **Requested indexing — 11 URLs, all live-verified "URL is unknown to Google" before pushing, and all
  screenshot-verified as "Indexing requested" after:**
  1. `itinlending.net/articles/itin-personal-loan-no-credit-history` (carried over from 7/24 as request #1)
  2. `itinlending.net/es/articles/itin-personal-loan-no-credit-history`
  3. `itincreditscore.com/articles/collections-on-credit-report-itin-holders`
  4. `itincreditscore.com/articles/cpn-vs-itin-credit-privacy-number-scam`
  5. `itincreditscore.com/articles/goodwill-letter-late-payment-itin-credit-score`
  6. `itincreditscore.com/es/articles/collections-on-credit-report-itin-holders`
  7. `itincreditscore.com/es/articles/cpn-vs-itin-credit-privacy-number-scam`
  8. `itincreditscore.com/es/articles/goodwill-letter-late-payment-itin-credit-score`
  9. `itincreditcard.com/articles/credit-card-reconsideration-line-itin`
  10. `itincreditcard.com/es/articles/credit-card-reconsideration-line-itin`
  11. `itincreditcard.com/articles/itin-credit-card-bank-by-bank-application-guide`
- **Quota hit: YES**, on the 12th attempt (`itincreditcard.com/es/articles/itin-credit-card-bank-by-bank-application-guide`
  → "Quota Exceeded — try again tomorrow"). That URL is confirmed unindexed and is **request #1 for tomorrow**.
  Note the account-wide quota allowed **11**, not 10, today.
- **Verified already-indexed, skipped without spending quota (6):** card `/articles/how-to-apply-for-credit-card-with-itin`,
  card `/articles/credit-cards-that-accept-itin-verified-issuer-list`, card `/es/credit-cards-that-accept-itin`,
  lending `/articles/itin-personal-loan-ranked-lenders`, lending `/es/articles/itin-personal-loan-ranked-lenders`,
  score `/articles/closing-credit-account-itin-credit-score`.
- **Method correction — the sitemap-vs-indexed diff from 7/23 is unreliable and wasted effort this run.** The
  Pages report is stale (all three properties show "Last update: 7/9/26"), so diffing `sitemap-0.xml` against the
  indexed-pages list produced 89 false positives on itincreditcard.com alone — the first three "unindexed"
  URLs I checked (including `/es/` ones) all came back "URL is on Google" on live inspection. **Only live URL
  Inspection is authoritative.** Better targeting heuristic, used successfully for the rest of this run: `git log
  --diff-filter=A` in each site repo to list content files by add-date, then live-inspect newest-first. Today's
  cutoff was sharp — articles added **7/17 and later were unindexed; 7/15 and earlier were indexed.**
- **Root cause found for the recurring "new article never gets discovered" problem.** Every unindexed URL's
  inspection showed **"Sitemaps: No referring sitemaps detected"**. Checking Search Console → Sitemaps on all
  three properties: the current `sitemap-index.xml` entries report **Status: Success but Discovered pages: 0**,
  and were **last read Jun 20 (card) / Jun 6 (lending) / Jun 6 (score)** — 5–7 weeks stale. The files
  themselves are fine (all three return HTTP 200, `content-type: application/xml`, valid `<sitemapindex>`,
  `last-modified` 2026-07-24), so this is a GSC-side discovery failure, not a build failure. Only the parent
  index is submitted; the child `sitemap-0.xml` (which actually holds the 116/118/156 URLs) is **not submitted
  on any property**. This is why the pipeline keeps depending on manual request-indexing for every daily article.
- **Backlog remaining:** NOT cleared. **Do NOT disable this task.** Steady-state is now ~2–4 genuinely
  unindexed pages/day (each day's new EN article + its `/es/` twin, across three sites), which currently
  exceeds what the ~10–11/day quota comfortably absorbs alongside the carryover.
- Docs updated: CHANGELOG.md.
- Follow-ups:
  1. **Submit the child sitemaps directly** in GSC → Sitemaps on each property: `sitemap-0.xml` for
     itincreditcard.com, itincreditscore.com, and itinlending.net. Left undone deliberately — this is a write
     action to an external service that this scheduled task does not authorize. This is the highest-leverage
     fix; it should reduce or remove the need for daily manual request-indexing.
  2. Request-index `itincreditcard.com/es/articles/itin-credit-card-bank-by-bank-application-guide` first on
     the next run.
  3. Clean up stale/legacy sitemap submissions on itinlending.net (`http://itinlending.net/sitemap` has shown
     "1 error" since 2019; two other legacy WordPress sitemap entries remain) and the leftover
     `http://itincreditscore.com/sitemap.blog.xml`.

## 2026-07-25 — Link Engine responder: 1 draft (Qwoted/Forbes Gen Z collecting)
- Reviewed 6 query threads in link-engine/queries (HARO afternoon 20q, HARO evening 20q, Qwoted 9q, SourceBottle, plus a HARO signup/verify). Only 1 qualified: Qwoted → Forbes.com "Gen Z & the collectibles market," pitched as Pour Picks/Perfume Picks founder (app-maker standing in collecting). Gmail draft created (paste into Qwoted; deadline 29 Jul 5PM ET). iMessage summary sent.
- Skipped as near-misses: HARO CMS/Medicare-immigrants (policy, not ITIN), MoneyLion money-wins/CFP + US News drone ETFs (generic/investment/credentials Bob lacks), Times D7-visa + BI fan-owner (personal-experience), Money.com HSA (benefits expert). No ITIN-bucket queries appeared today.
- Docs updated: this CHANGELOG only.

## 2026-07-24 — GSC request-indexing daily batch: 0 requested (quota already exhausted account-wide before first push)
- Ran the daily GSC request-indexing task across all three ITIN Domain properties. Chrome open, GSC
  authenticated on the shared Google account (auth available ✓).
- **Quota hit: YES — and hit on the very first request attempt.** The account-wide ~10/day quota was already
  fully consumed before this run started (by yesterday's 7/23 batch and/or the daily-content pipeline's
  indexing pings). Every REQUEST INDEXING click returned "Quota Exceeded — try again tomorrow." Per the task
  rules, stopped requesting for the day. **Net requested today: 0.**
- **Genuine unindexed page confirmed for tomorrow's queue (top priority):**
  - `itinlending.net/articles/itin-personal-loan-no-credit-history` — brand-new 7/24 daily article
    (commit 4601f85). Live-inspected: **"URL is not on Google — URL is unknown to Google"**, no referring
    sitemap detected yet, never crawled. Could not request (quota). This should be request #1 tomorrow.
  - `itin-personal-loan-ranked-lenders` was already request-indexed in the 7/23 batch, so not re-pushed.
- **Verified already-indexed this run (skipped, no quota wasted):** card `unsecured-credit-cards`,
  card `build-credit-with-itin`; score `/es/articles/how-to-raise-credit-score-with-itin` (was
  crawled-not-indexed in the stale 7/9 Pages snapshot, now "URL is on Google").
- **Pages → "Why pages aren't indexed" review (per site) — remaining crawled-not-indexed buckets hold NO
  current content worth pushing:**
  - itincreditcard.com: only `http://itincreditcard.com/` (protocol http→https artifact) + 1 "Page with
    redirect" (same). 27 indexed / real content fully indexed.
  - itincreditscore.com: `/es/articles/how-to-raise-credit-score-with-itin` (now indexed) + `/blank` (junk
    placeholder). Rest are intended noindex(8)/canonical(5)/404(4)/redirect(2).
  - itinlending.net: 5 legacy WordPress artifacts only — `/category/itin-vs-ssn/`,
    `/category/uncategorized/feed/`, `/2023/11/page/3/`, `/2023/11/my-journey-with-an-itin-personal-loan/`,
    `/2023/11/using-my-itin-number-to-secure-a-mortgage-a-personal-journey/`. Not current Astro pages; not
    worth quota.
- **Backlog remaining / status:** NOT cleared, but now small and steady-state. The three sites' known content
  is essentially fully indexed; the only genuine un-indexed real pages are freshly-published daily articles
  the pipeline drips (~1/day, published after the last Pages-report crawl and not yet discovered). This task
  has transitioned from "clear a large backlog" to "push each day's 1 new article." **Do NOT disable yet.**
- **Recommendation for tomorrow's run:** (1) request `itin-personal-loan-no-credit-history` first; (2) then
  sitemap-diff each site per the 7/23 method (curl `sitemap-0.xml` vs indexed count) and live-inspect the
  newest `/articles/*` and `/es/*` slugs for "unknown to Google", pushing until quota. Also consider
  scheduling this task's window so it runs when the daily-content pipeline hasn't already drained the shared
  quota.
- Docs updated: CHANGELOG.md.
- Follow-ups: request-index `itin-personal-loan-no-credit-history` on the next run (quota permitting).

## 2026-07-24 — Link Engine responder: 1 draft (Well Worth auto-maintenance)
- Scanned last-24h `link-engine/queries` (10 threads: 2 SOS, 3 HARO, 2 Qwoted, 2 SourceBottle, 1 MentionMatch), ~50 opportunities. 1 relevant. Drafted honest Well Worth reply to MoneyLion "How to Make Your Car Go the Distance" (auto longevity/corrosion angle, deadline 3am ET Jul 27) in Gmail. Skipped as near-misses: MentionMatch crypto/portfolio (investment), SOS CuraDebt (needs credentialed EA/CPA), SOS estate-planning (needs J.D.), several retirement/investment items. 0 ITIN/Pour/Perfume queries today. iMessage summary sent to Bob.
- Docs updated: CHANGELOG.md.
- Follow-ups: Bob reviews + sends the Gmail draft.

## 2026-07-23 — GSC request-indexing daily batch: 11 URLs requested, quota hit, BACKLOG NOT CLEARED (prior "cleared" calls were wrong)

- Ran the daily GSC request-indexing task across all three ITIN Domain properties (Chrome open, GSC
  authenticated on the shared Google account). **Correction to the two 2026-07-22 runs below:** they concluded
  "BACKLOG CLEARED / disable the task" by reading only the Pages → "Why pages aren't indexed" buckets. That
  report only lists pages Google has **already discovered**; it does **not** list sitemap URLs that are
  "unknown to Google" (never crawled), so it structurally under-counts the backlog. Diffing each site's live
  `sitemap-0.xml` against its indexed count exposes the real gap: itinlending.net 78 indexed / ~150 sitemap,
  itincreditscore.com 64 / ~115, itincreditcard.com (live-checked, report's "27" is a stale 7/9 snapshot;
  money pages verified indexed). The un-indexed remainder — especially newer articles and most `/es/*` — is a
  genuine backlog this task exists to push.
- **Method used this run:** pulled all three sitemaps via curl, cross-referenced git log for the newest daily
  content (published after the 7/9 Pages snapshot), then live-inspected the newest slugs. Every one read
  **"URL is not on Google — unknown to Google."** Requested indexing on each until the account-wide quota hit.
- **Successfully request-indexed (11):**
  1. itinlending.net/articles/itin-personal-loan-ranked-lenders (7/20)
  2. itinlending.net/articles/itin-personal-loan-bad-credit (7/17)
  3. itinlending.net/articles/itin-personal-loan-lenders (7/15)
  4. itinlending.net/articles/itin-auto-loan-lenders (7/13)
  5. itinlending.net/articles/itin-loans-florida (7/10)
  6. itinlending.net/articles/itin-loans-california (7/8)
  7. itincreditscore.com/articles/cpn-vs-itin-credit-privacy-number-scam (7/18)
  8. itincreditscore.com/es/articles/cpn-vs-itin-credit-privacy-number-scam (7/18)
  9. itinlending.net/es/articles/itin-personal-loan-ranked-lenders
  10. itinlending.net/es/articles/itin-personal-loan-bad-credit
  11. itinlending.net/es/articles/itin-personal-loan-lenders
- **Quota hit = YES.** 12th attempt (itinlending.net/es/articles/itin-auto-loan-lenders) returned
  "Quota Exceeded — try again tomorrow." So the daily account-wide cap is ~11 today. Stopped there.
- Skipped as already-indexed / non-requestable: itincreditcard.com money pages (unsecured-credit-cards,
  build-credit-with-itin — both live-verified "on Google"); itincreditscore.com/es/articles/how-to-raise-
  credit-score-with-itin (now indexed); the legacy WordPress orphans and http→https redirect artifacts.
- **Summary:** requested 11, quota hit YES, Chrome/GSC auth available, **BACKLOG NOT CLEARED.**
- Docs updated: this changelog.
- Follow-ups / open items:
  1. **Do NOT disable this task** — reverse the recommendation in the two entries below. Real un-indexed
     backlog remains (bulk of `/es/*` across all three sites + older articles Google hasn't discovered).
  2. Tomorrow's queue (start here): itinlending.net/es/articles/itin-auto-loan-lenders, /es/articles/
     itin-loans-florida, /es/articles/itin-loans-california, then sweep remaining `/es/*` and any card-site
     `/es/*` still unknown to Google.
  3. Root cause worth fixing at the source: `/es/*` pages show "No referring sitemaps detected" in inspection
     even though they ARE in sitemap-0.xml — Google is slow to process them. Consider stronger internal
     linking to `/es/*` and/or an IndexNow ping on publish so new content is discovered without manual
     request-indexing.

## 2026-07-22 — GSC request-indexing daily batch (2nd run): re-verified BACKLOG CLEARED, still 0 requests

- Second scheduled run of the day. Independently re-walked all three properties' Pages ("Why pages aren't
  indexed") reports and confirmed the picture is unchanged from the earlier run below: itincreditcard.com
  27 indexed / 2 non-content artifacts; itincreditscore.com 64 indexed, only requestable candidates are the
  `/es/articles/how-to-raise-credit-score-with-itin` article + `/blank` junk; itinlending.net 5
  crawled-not-indexed all legacy WordPress orphans.
- Did one fresh **live** URL Inspection on the itincreditscore.com Spanish article — it now reads
  **"URL is on Google — Page is indexed"** (the Pages report's 7/9/26 snapshot was stale). Confirms the one
  most-plausible real candidate is already indexed.
- **Summary:** requested 0, quota hit = NO (untouched), Chrome/GSC auth = available. **BACKLOG still
  CLEARED.** Reiterating the recommendation from the entry below: Bob should **disable the
  `itin-gsc-request-indexing` scheduled task** — it has nothing left to push and is now re-confirming a
  cleared backlog daily.
- Docs updated: this changelog.
- Follow-ups / open items: same two as below — (1) disable this scheduled task; (2) optional itinlending.net
  legacy-URL 410/redirect crawl-budget hygiene.

## 2026-07-22 — GSC request-indexing daily batch: BACKLOG CLEARED (0 requests needed, 0 quota used)

- Ran the daily GSC request-indexing task across all three ITIN Domain properties via the Pages
  ("Why pages aren't indexed") report + live URL Inspection (Chrome was open and GSC authenticated on
  the shared Google account). Rather than blindly inspecting the task's hardcoded slug list, I read each
  property's not-indexed buckets and inspected only the genuinely-requestable ones. **Net result: no URL
  on any site warranted a request today — every current-content sitemap page is already indexed.**
- **itincreditcard.com** — 27 indexed / 2 not indexed. The task's "only ~4 pages indexed" premise is
  stale. The 2 not-indexed are both non-content artifacts: 1× "Page with redirect" and
  `http://itincreditcard.com/` (the non-HTTPS homepage variant that just redirects to the indexed HTTPS
  home). Neither benefits from a request. All named priority slugs (unsecured-credit-cards,
  build-credit-with-itin, business-credit-cards, how-to-get-an-itin) are already indexed.
- **itincreditscore.com** — not-indexed buckets: 8 noindex (intentional), 5 alternate-w/-canonical,
  4× 404, 2 redirect, 2 crawled-not-indexed. Of the 2 crawled-not-indexed, one
  (`/es/articles/how-to-raise-credit-score-with-itin`) live-inspected as **"URL is on Google — indexed"**
  (Pages report data was stale); the other is `/blank` (placeholder junk). All named legacy-equity slugs
  (check-credit-score-with-itin, credit-bureaus-and-itin, etc.) are already indexed.
- **itinlending.net** — not-indexed buckets: 8 noindex, 2× 404, 2 redirect, 5 crawled-not-indexed. All 5
  crawled-not-indexed are **legacy WordPress-era orphans**, none in the current Astro sitemap:
  `/category/itin-vs-ssn/`, `/category/uncategorized/feed/`, `/2023/11/page/3/`, and two first-person
  legacy posts (`/2023/11/my-journey-with-an-itin-personal-loan/`,
  `/2023/11/using-my-itin-number-to-secure-a-mortgage-a-personal-journey/`). Inspected the first post
  live: fetch 200, indexing allowed, but **"No referring sitemaps detected"** and referred from
  `/author/admin-2/page/3/` — confirming these are pre-migration orphans, not current content. Deliberately
  did NOT request them: they're outside the sitemap, Google already declined them post-crawl (quality
  signal), and the first-person "my journey" voice is exactly what the non-personal editorial strategy
  retired. Force-indexing them would burn account-wide quota on deprecated/thin content.
- **Summary:** requested 0, skipped-already-indexed/artifact/legacy = all, quota hit = NO (untouched),
  Chrome/GSC auth = available. **BACKLOG CLEARED** — every genuine current-content page across all three
  sites is indexed. Recommend Bob **disable this scheduled task**; there's nothing left for it to push.
- Docs updated: this changelog.
- Follow-ups / open items: (1) Disable the `itin-gsc-request-indexing` scheduled task. (2) Optional crawl-
  budget hygiene on itinlending.net — the legacy WordPress URLs (`/feed/`, `/category/*`, `/author/*`,
  `/2023/11/*` dated posts + pagination) still resolve 200 and get re-crawled; consider 410-ing or
  redirecting them to the current Astro equivalents so Google stops spending crawl budget on orphans.

## 2026-07-27 — Activated myAutoloan (CJ) as a secondary "compare auto offers" CTA on /itin-auto-loan

- Bob's CJ approval for **myAutoloan.com (CJ advertiser #1390130, $10/lead)** had never been wired —
  `$0` earned, 0 clicks, and the auto-loan page's affiliate slot (`PUBLIC_AFFILIATE_URL_AUTO`) was empty,
  so all CTAs fell back to `/apply`. Per Bob's call: **keep the lead form as the primary conversion**,
  add myAutoloan only as a secondary "also compare auto offers" option for visitors who'd rather shop rates.
- Pulled the CJ click link under the correct **ITIN Lending** website property (#101772772):
  `https://www.tkqlhce.com/click-101772772-10608154`.
- New `AutoCompareCTA.astro` (EN + ES) renders a clearly-labeled advertiser callout on `/itin-auto-loan`
  only. `rel="sponsored nofollow"` + "Advertiser" label + an honest "not ITIN-specific, confirm ITIN
  acceptance" note. The sponsored rel also fires the `affiliate_click` GA4 event.
- **Placement (updated same day per Bob — the bottom callout was buried):** on the auto pages, the two
  Credit Karma display slots (hero rail + below-FAQ) now render the myAutoloan unit INSTEAD of Credit Karma,
  via a `showAutoCompare` gate in `MoneyPageLayout.astro` (path check + env). So the unit sits top-right
  above the fold and again below the FAQ; Credit Karma is removed from auto pages but kept on every other
  money page. More relevant than a generic credit-card ad on an auto page, and far more prominent.
- Env-gated on a NEW var `PUBLIC_AFFILIATE_URL_AUTO_COMPARE` (deliberately separate from the unused
  primary `PUBLIC_AFFILIATE_URL_AUTO` slot) so it never touches the InlineCTA or the in-content autolinker.
  Set in `web/.env` + `daily-content.yml` CI. Verified: primary hero + InlineCTA still route to `/apply`;
  callout scoped to the auto page only (mortgage/other money pages carry 0 myAutoloan links).
- Docs updated: this changelog; `project-docs/LEAD-PARTNERS.md` (myAutoloan status); `MONETIZATION.md`
  (new env var + secondary-compare pattern).

## 2026-07-27 — Card-site audit actions: sitemap lastmod fix (all 3 sites) + homepage de-opt + pillar issuer table

Acted on the 2026-07-27 credit-card audit's top 3.

- **Action 1 — sitemap lastmod bug (ALL THREE SITES).** Root cause of glacial discovery: `astro.config.mjs`
  had a global `lastmod: new Date()`, stamping every URL with build time, so the whole sitemap "changed"
  on every daily-content deploy and Google discounted it (last read 37+ days ago). Replaced with a stable
  per-article lastmod pulled from committed frontmatter (`updatedAt` || `publishedAt`); static pages get no
  lastmod. Frontmatter is the only CI-safe date — git mtime/`git log` churn under Actions' shallow checkout.
  Verified per site (Card 82/28 dates, Lending 86/33, Score 82/26; static pages carry none). **Bob to do:**
  resubmit `sitemap-0.xml` in GSC for each of the three sites so Google re-reads it.
- **Action 2 — homepage de-optimization (card).** Homepage ranked pos 88 for "credit cards that accept itin"
  (14 impr) while the money page ranked pos 7 (1 impr) — the homepage was cannibalizing it. Gave the
  homepage its own hub-framed meta description (dropped the "which issuers accept an ITIN" phrase it was
  competing on) and pointed a hero exact-match link at `/credit-cards-that-accept-itin`, consolidating that
  query onto the money page.
- **Action 3 — pillar issuer table (card, /itin-credit-cards-guide).** The #2 landing page and top ChatGPT
  target had no issuer comparison table. Added a 9-issuer comparison (issuer/type/min-deposit/credit-check/
  best-for) + the high-value "Discover does NOT accept an ITIN" row + a visible "Issuer details last verified
  July 2026" line — the freshness + structured data LLMs quote. Sourced from the site's own vetted issuer
  article (linked for the full APR/fee table).
- Docs updated: this changelog; `project-docs/SEO-AEO.md` (sitemap-lastmod pattern note).
- Follow-ups: backlinks still 0 across all sites (the real ceiling — 5th audit flagging it); GSC sitemap
  resubmit (Bob). All three repos built, deployed, committed, pushed (rebased past the daily-content race).

## 2026-07-22 — PH launch audit: fixed Lending description typos (launches 7/24), verified the rest

- Audited all 4 Product Hunt launches ahead of their scheduled dates. **Found + fixed 5 dropped-character
  typos in the ITIN Lending description** (natinals→nationals, busness→business, inependent→independent,
  lender atching→lender matching, noCPNs→no CPNs) — artifacts of the PH React editor dropping programmatic
  keystrokes when it was first written. ITIN Lending goes live 7/24, so this was time-critical. Fixed by
  select-all + real-keystroke retype (PH ignores JS value-setting), verified exact via JS, saved.
- Verified clean (no typos), no action needed: ITIN Credit Card (7/28), ITIN Credit Score (7/31), Well
  Worth Products (8/4) descriptions + taglines. Taglines are all comparison/benefit-anchored as intended.
- Confirmed ITIN Lending thumbnail (green name-only "ITIN Lending." design) and gallery (4 green Civic
  Record redesign screenshots) are already in place — the earlier "upload thumbnails / swap gallery"
  items were already done.
- Docs updated: this changelog.
- Also audited the Card/Score/Well Worth galleries directly: Card = 4 teal redesign screenshots, Score =
  4 graphite redesign screenshots, Well Worth = 3 real store screenshots. All thumbnails, galleries,
  descriptions, and taglines across all 4 launches now confirmed good.
- Follow-ups / open items: AllTop directory submission still needs Bob (CAPTCHA, can't automate).

## 2026-07-22 — Tier-1 journalist pitches rebuilt with researched addresses + de-wrapped links

- The 5 "State of ITIN Lending 2026" pitch drafts from the prior session were NOT in Gmail (never
  persisted). Rebuilt all 5 fresh in Bob's Gmail, each tailored to the reporter's recent story, framed
  to ask them to USE the report as a citable source (not to interview Bob), with the honest HMDA-has-no-
  ITIN-field methodology as the hook.
- Researched real deliverable addresses (were only "contact hints" before): Volkova
  maria.volkova@arizent.com (high), Hussein fhussein@ap.org (high), Ojeda rommel.ojeda@documentedny.com
  (med-high), Backman maurie@backmanonline.net (med-high), Napoletano e@enapoletano.com (medium).
  Cancino (Univision) has no findable direct email — left undrafted, needs a channel decision.
- De-wrapped the google.com/url link wrappers in the compose editor per the known procedure (JS rewrite
  of anchor href+text, forced keystroke save), API-verified all 5 drafts clean.
- Docs updated: `.seo/link-engine/press-pitch-list-state-of-itin-2026.md` (new Draft status section).
- Follow-ups / open items: Bob switches From to bob@timberlineventuresllc.com per send (connector can't
  set From), sanity-checks the 3 med-confidence addresses, and sends. PH Bob-side tasks next.

## 2026-07-22 — Root-cause fix for irrelevant journalist alerts: Qwoted beats retuned + inbox filter routing

- **Problem:** Bob's main inbox + `link-engine/queries` folder were filling with off-target Qwoted
  single-alerts (cybersecurity, generative AI, investment, software, travel, weddings). Diagnosed two
  causes: (1) Bob's Qwoted source profile carried 21 wrong Expertise tags from account setup, which drive
  both the "Because you follow #X" alerts AND how reporters find him; (2) the Gmail filter labeled the
  mail but did not skip the inbox, so every query hit the inbox too.
- **Fix 1 — Qwoted Expertise retuned** (app.qwoted.com/sources/bob-guillow → Expertise editor): removed
  all 21 junk tags, replaced with 14 on-bucket beats — ITIN lane: #PersonalFinance, #Mortgages, #ITIN,
  #ITINLoans, #CreditCards, #CreditScore, #Immigration, #SmallBusiness; Pour Picks: #Bourbon, #Whiskey;
  Perfume Picks: #Fragrance, #Perfume; Well Worth: #Automotive, #CarCare. Saved + live on profile.
- **Fix 2 — Gmail filter** (done same session): added "Skip the Inbox" to the `link-engine/queries`
  filter and applied to the 36-message backlog, so query mail now lands in the folder only, not the inbox.
- **Fix 2b (2026-07-22, follow-up):** SourceBottle daily alerts were STILL hitting the inbox — they send
  from `sourcebottle@thesourcebottle.com`, and the filter only listed `sourcebottle.com` (Gmail treats
  `thesourcebottle` as a different domain token, so no match). Added `thesourcebottle.com` to the filter's
  from-list and archived the existing SourceBottle backlog out of the inbox. Note for future signups: the
  SourceBottle *account/verify* mail comes from `sourcebottle.com` but the *alerts* come from
  `thesourcebottle.com` — both are now covered.
- **Checked, no change needed:** SourceBottle profile #13943 keywords are all 7 on-target ITIN finance
  terms — no junk, unlike Qwoted. That profile is the ITIN-finance expert persona, so consumer-bucket
  keywords deliberately stay off it.
- Docs updated: `project-docs/LINK-ENGINE-OPS.md` (§1 note on Qwoted beat tuning).
- Follow-ups / open items: 5 Tier-1 journalist pitch drafts still need the google.com/url wrappers
  stripped in the compose editor + Bob to verify/supply 3 addresses (Backman, Napoletano, Cancino) and
  switch From to bob@timberlineventuresllc.com before sending. PH Bob-side tasks (3 new thumbnails,
  Lending gallery swap, AllTop CAPTCHA) still open.

---

## 2026-07-20 — KPI baseline pull: GSC + GA4, 4 properties, current vs prior 28d

- Ran GSC + GA4 period-over-period for the 3 ITIN sites + Well Worth (snapshot saved to
  `.seo/output/kpi-baseline-2026-07-20.md`). Headline: ITIN sites still ~0 Google clicks (positions
  64-80 = page 6-8), EXPECTED this early (Link Engine <2wks old, backlinks 3-6mo clock). Leading
  indicators up: Lending impressions 326→1532 (+370%), indexed queries 100→306, +4 avg-position;
  Score 758→1057 impr, 83→97 queries. GA4 organic tripling but tiny (Lending 16→56, Score 3→15, Card 2→8).
- WATCH ITEM confirmed by the same-day weekly audit below: **Card site regressed** on every GSC metric
  (avg pos 68→83, queries 60→35, impr -11%) — homepage cannibalization still open + July core update.
- Well Worth = the traffic story (avg pos 13, 61k impr, 124 clicks, 673 organic sessions/mo), but its
  baseline shows 0 only because API access started 6/22 (GSC) / 7/12 (GA4). Established store, not
  growth-from-zero. Fixed a GA4 parse bug in the ad-hoc script (run_report returns a list, not dict).
- Docs: `.seo/output/kpi-baseline-2026-07-20.md` (diffable snapshot for the weekly loop).

---

## 2026-07-20 — Weekly SEO audit (ITIN Credit Card): homepage cannibalization still open, redesign missed it; /es discovery accelerating
- Ran the scheduled weekly GSC + GA4 audit. Output: `~/ITINCreditCard/.seo/output/seo-audit-creditcard-2026-07-20.md`.
  Data via browser (GSC Google SSO, sc-domain property; GA4 property 540443142). `.secrets/` absent → no Bing/Serper this run.
- **Snapshot (28d):** 144 impr (+4%), 0 clicks, avg pos **75.3** (better, was 77.9), 36 queries.
  Pages earning impressions 21 → **26** (+24%). Indexed **27** (flat), discovered-not-indexed **0** (4th audit running). Backlinks still **0**.
- **#1 issue unresolved — and the redesign missed it.** The "Civic Record" homepage redesign (7/15–7/17)
  was visual only; homepage `<title>` still leads with "ITIN Credit Card | Credit Cards…" and body repeats
  "ITIN credit card" 22×. Google still serves the homepage for money queries (127 impr, pos 82.6) and
  suppresses the pos-7 money pages. "credit cards that accept itin" 6 → **10 impr at pos 89.4** while
  `/credit-cards-that-accept-itin` stays 1 impr / pos 7 — gap widened. "itin credit card" slipped **81.9 → 100.1** (worst mover).
- **Bright spots:** /es discovery accelerating — 3 Spanish pages now earn impressions (was 1): `/es` 2.7,
  `/es/articles` 6.0, `/es/about` 7.0. Still **zero Spanish-language queries** (Spanish money pages exist
  w/ correct `inLanguage: es-419` but undiscovered). GA4 native **"AI Assistant" channel now non-zero: 3 sessions/28d** — first measurable AI-referred traffic.
- **Top 3 actions:** (1) de-optimize homepage `<title>`/body head terms + request re-crawl of home & money
  pages; (2) land first external backlink (Reddit/Quora/guest post — still 0); (3) capture the "can you get
  a credit card with an ITIN" question cluster (6 long-tails surfacing, cannibalized). Also: link GSC↔GA4, restore Serper/Bing keys.
- Docs updated: this changelog; audit file in ITINCreditCard/.seo/output/.
- Follow-ups: next audit 2026-07-27 — verify homepage de-optimization landed & whether money page overtook
  homepage; watch "itin credit card" pos-100 recovery; first backlink; first Spanish query.

## 2026-07-20 — Weekly SEO/AEO audit (ITIN Credit Score): flagship query still unconsolidated (5th audit), /about steals the click

- Ran the scheduled weekly audit. Output: `.seo/output/seo-audit-creditscore-2026-07-20.md`.
  Data via browser (GSC Google SSO + GA4 property 413651450). GSC 28d 6/21→7/18; GA4 6/22→7/19.
  `.secrets/` dirs absent → no Bing/Serper this run (browser path only).
- **Topline (vs 07-13):** impressions 1,200 → **1,130** (−6%, first dip in 5 audits); clicks 2 → **1**;
  avg position **61.3 flat**; queries 100 → **94**; indexed 56 → **64** (+8);
  AI-referred (GA4 "AI Assistant") 2 → **4** (doubled).
- **🔴 Flagship query "how to check credit score with itin" (290 impr, 26% of site) — OPEN 5 AUDITS.**
  Position drifted the *wrong* way 70 → **73.2** across five audits. Earned its **first-ever click**
  this window — but via **`/about` (281 impr, pos 69.0)**, which now outranks the dedicated money
  page **`/check-credit-score-with-itin` (227 impr, pos 79.8)** by ~10 positions. Consolidation
  failure made concrete; still Action #1 (exact-phrase H1/title + Quick Answer block + internal
  links at the money page, incl. an out-link from /about).
- **🔴 Regression — `/credit-bureaus-and-itin` went cold:** 47 → **53.3**, lost its clicks (was the
  only converting page). `transunion itin credit report` shed 18 positions in two audits
  (42 → 55.2 → **59.7**). Per-bureau H2s too thin → Action #4.
- **ES (page-path split): ~21 impr (1.9%).** ES content ranks superbly (ES pillar pos **4.0**,
  foreign-credit-history **9.4**) but two carried-forward defects persist: (1) `.html` duplicate
  `/es/articles/how-to-dispute-credit-report-errors-with-itin.html` (pos 53.7) **still live —
  open 3 audits**; (2) `/es/check-credit-score-with-itin` + `/es` homepage **still 0 impressions —
  open 2 audits** (hreflang/canonical check). Task-named checks: "cómo ver mi crédito con itin"
  surfacing pos **79.0**; "puntaje crediticio con itin" still not an exact query.
- **⚠️ New: 4 "Not found (404)"** pages in Indexing (fresh this window) → Action #6, fix linking sources.
- **Meta-finding:** 4 of top-5 actions are repeats carried forward unactioned (consolidation ×5,
  ES .html ×3, ES dark ×2, bureau depth ×2). Pipeline is healthy on autopilot; the gap is entirely
  unshipped hand-built on-page consolidation work.
- Docs updated: this CHANGELOG. Audit file in `ITINCreditScore/.seo/output/`.
- Follow-ups: same as prior audit — none of the on-page fixes have shipped; escalating tone.

## 2026-07-20 — Weekly SEO/AEO audit (ITIN Lending): renewal cluster surfaces + ES depth gap

- Ran the scheduled weekly audit. Output: `.seo/output/seo-audit-lending-2026-07-20.md`.
  Data via browser (GSC Google SSO + GA4 property 412653847). GSC 28d ~6/21→7/18; GA4 6/22→7/19.
- **Topline (vs 07-13):** impressions 1,710 → **1,930** (+13%); clicks 5 → **6**; avg position
  71.9 → **68.9** (+3.0); queries 277 → **308**; indexed 52 → **78**; crawled-not-indexed
  10 → **5** (last audit's concern self-resolved as indexation caught up).
- **🔥 New finding — ITIN renewal / "apply for ITIN" cluster (~120 combined impr, pos 63–87):**
  renew itin, itin renewal, irs itin renewal, apply for itin, how to renew itin number, etc.
  Brand-new theme, strategically prime (renewal searcher = pre-qualified future borrower).
  Escalated to **Action #1** — build/deepen a renewal hub in the how-to-get-an-itin cluster and
  internal-link it *down* to loan money pages.
- **EN head terms** continue grinding up in position (itin auto loans +2.5, itin car loans +4.6);
  no query degraded. Money pages still the laggards at 78–90 (Action #1 uplinks from 07-13 too
  fresh to have moved them).
- **ES (page-path `/es/` filter): 127 impr, avg pos 60.2** (better than site-wide 68.9). Two ES
  problems flagged: (1) `/es/itin-personal-loans` **declined despite** the 07-13 link fix
  (34 impr/69.2 → 7 impr/77.6) — per the 07-13 prediction, cause is now **content depth, not
  links**; (2) ES cluster pages `/es/itin-loans`, `/es/itin-mortgage`, `/es/itin-business-loans`
  earn **zero impressions for a 2nd straight audit** while EN counterparts pull 200+ each. ES
  articles themselves rank page-1 (mortgage-rates 3.0, apartment-rental 7.5, heloc 8.7,
  auto-loan 9.0). Card-intent leak now visible on ES too (`tarjeta de crédito con itin` x4).
- **⚠️ Breadcrumb valid items halved 29 → 15** in the same window the 07-17 "Settlement Statement"
  redesign shipped (Invalid still 0). Flagged as **Action #3** — `curl`/Rich-Results-verify that
  `BreadcrumbList` JSON-LD survived the template swap on all page types.
- **GA4:** AI referrals 11 → **14** (ChatGPT 13 + Perplexity 1); organic sessions 15 → **32**
  (google 16, bing 13 @ 84.6% eng, yahoo 2, ecosia 1) — doubled. Total sessions 541 → 448 is a
  direct-traffic (dark/bot) drop; every earned channel is flat-to-up.
- **Follow-ups (open actions):** #1 renewal hub · #2 ES personal-loans depth + ES cluster-page
  URL inspection · #3 breadcrumb-schema verify post-redesign · #4 cross-site card leak (EN+ES,
  flagged since 06-29, still un-actioned) · #5 confirm 404 stub re-crawl · #6 Speakable schema.
- iMessage summary (top-3) sent to +17165109313.

## 2026-07-20 — GSC request-indexing run: BACKLOG STILL CLEARED (0 requests, confirms 7/19)

- Re-ran the daily GSC request-indexing batch across all three properties. Chrome/GSC
  auth was available. **No requests made, quota NOT touched** (no "Quota Exceeded"
  encountered because nothing needed requesting). Independently reconfirms the
  7/19 BACKLOG CLEARED finding — same state, one day later.
- **Method:** instead of blindly inspecting the (stale) priority-list slugs, read each
  property's **Pages report → "Why pages aren't indexed"** to enumerate exactly which
  URLs are non-indexed, then filtered to genuine content candidates. Faster and
  authoritative vs. per-URL guessing.
- **Indexed vs not-indexed today (Pages report, last update 7/9/26):**
  - itincreditcard.com — **27 indexed**, 2 not indexed: 1 "Page with redirect" +
    1 "Crawled – currently not indexed" = `http://itincreditcard.com/` (HTTP homepage
    variant, 301s to HTTPS). No real content missing. Non-actionable.
  - itincreditscore.com — **64 indexed**, 21 not indexed across 5 reasons: 8 noindex
    (intentional), 5 canonical alternates, 4 404s, 2 redirects, 2 "Crawled – not
    indexed". Of those 2: `https://itincreditscore.com/es/articles/how-to-raise-credit-score-with-itin`
    (live-inspected today → **"URL is on Google / Page is indexed"**; Pages report was
    simply stale) and `/blank` (junk URL). Non-actionable.
  - itinlending.net — **78 indexed**, 17 not indexed across 4 reasons: 8 noindex, 2 404,
    2 redirect, 5 "Crawled – not indexed". All 5 are the same **legacy WordPress
    artifacts** flagged 7/19: `/category/itin-vs-ssn/`, `/category/uncategorized/feed/`,
    `/2023/11/page/3/`, `/2023/11/my-journey-with-an-itin-personal-loan/`,
    `/2023/11/using-my-itin-number-to-secure-a-mortgage-a-personal-journey/`. Live-inspected
    the last one: **"No referring sitemaps detected"**, referrers are the old
    `/author/admin-2/page/3/` WP archive — orphaned, not in the current Astro sitemap.
    Force-indexing these would risk duplicate-content competition with the canonical
    Astro pages. Non-actionable.
- **Every page in the current sitemaps is already indexed.** Remaining non-indexed URLs
  are all intentional (noindex/canonical), broken (404), redirect artifacts (HTTP
  homepage), legacy non-sitemap WP orphans, RSS feeds, or junk (`/blank`). **BACKLOG
  CLEARED — recommend disabling this scheduled task.** The real ongoing lever is the
  sitemap-discovery bug documented in the 7/19 entry (index reads "Success" but
  "Discovered pages: 0"; unindexed URLs report "No referring sitemaps detected"),
  not 10 manual requests/day.
- Docs updated: this CHANGELOG entry.
- Follow-ups / open items: (1) disable the `itin-gsc-request-indexing` scheduled task;
  (2) fix family-wide sitemap discovery + purge itinlending.net's 3 stale legacy
  sitemaps (per 7/19 entry). No files touched beyond this changelog; nothing committed
  or pushed.

---

## 2026-07-20 — Link Engine weekly run #2 (scheduled): card-site syndication drafted, Quora held

- **Backlink diff (`links.py --all`):** Bing WMT GetLinkCounts still returns **0/0/0**
  for lending/card/score (all "first snapshot — baseline"; `.cache/links-*.json` are
  empty arrays, so no NEW/LOST deltas vs prior run). Non-ITIN properties (Pour Picks,
  Perfume Picks, Timberline, Stick Picks, Percolate, Underdial, Well Worth) all 400 on
  the API (not Bing-verified) — ignored per task rules; none shown in digest since
  nothing changed. Note: the plan's "1 marketwatch.com link" is a GSC-side figure;
  Bing's index shows 0, which is the metric this monitor tracks.
- **Syndication draft #2 (rotation → CARD week):** last syndicated site was lending
  (`itin-renewal`, 7/18), so this week rotates to itincreditcard.com. Highest-impression
  card article not yet syndicated = `balance-transfer-credit-card-itin` (5 impr / 28d,
  card's #1 article by GSC impressions). Wrote two adaptations, both humanize-passed:
  - `~/Itin/.seo/syndication/2026-07-20-balance-transfer-credit-card-itin-medium.md`
    (750 words, cadence_check exit 0 after fixing 2 "quietly" crutches, 2 contrasts,
    2 triads, 1 aphorism button; ends with canonical link to the card article).
  - `...-linkedin.md` (~200 words, ends with the plain canonical URL).
- **Quora queue: HELD this week.** Cadence guard = only queue if last posted batch is
  ≥3 days old. Last batch was 7/18 (Quora run #3, 10 answers total); today is 7/20 =
  2 days, under the guard. No candidates researched/queued; resumes next run. Fresh
  ground still open for next time: W-7 application, business loans/EIN, secured-card
  mechanics, rent reporting, ES-language questions.
- **Digest:** sent to +17165109313 (backlinks, card syndication draft ready, Quora held).
- Docs updated: this CHANGELOG entry.
- Follow-ups / open items: Bob to review + publish the card syndication drafts in a live
  session (Medium + LinkedIn as Timberline company page). Next run (7/27) rotates to
  score site; Quora cadence clears 7/21 so the queue can resume then.
- Per task rules: files left UNCOMMITTED for Bob's live-session review. Nothing committed,
  pushed, posted, or emailed.

---

## 2026-07-19 — GSC request-indexing run: BACKLOG CLEARED (+ sitemap discovery bug found)

- Ran the daily GSC request-indexing batch across all three properties. Chrome/GSC
  auth was available. **Quota was NOT hit** — only 2 URLs genuinely needed a request.
- **Request-indexed today (2 unique URLs, both verified "Indexing requested"):**
  - `https://itincreditcard.com/es/articles/business-credit-card-with-itin`
  - `https://itincreditcard.com/es/articles/unsecured-credit-card-itin-holders`
  - Note: the first URL was accidentally re-requested a second time (a GSC toast
    swallowed the next URL's keystrokes). Harmless — re-requests don't change queue
    position — but it burned one quota unit.
- **Skipped, verified already "URL is on Google" via live inspection (8):**
  EN `articles/can-you-get-a-credit-card-with-an-itin`,
  `articles/credit-cards-that-accept-itin-verified-issuer-list`,
  `articles/business-credit-card-with-itin`; ES `es/articles/can-you-get-a-credit-card-with-an-itin`,
  `es/articles/secured-credit-card-with-itin`, `es/articles/how-to-apply-for-credit-card-with-itin`,
  `es/articles/no-credit-check-credit-card-itin` (all itincreditcard.com), and
  `itincreditscore.com/es/articles/how-to-raise-credit-score-with-itin`.
- **BACKLOG CLEARED.** Every remaining "not indexed" URL across the three properties
  is non-actionable by design and must NOT be request-indexed:
  - itinlending.net — all 5 "Crawled – currently not indexed" are **legacy WordPress
    artifacts**: `/category/itin-vs-ssn/`, `/category/uncategorized/feed/`,
    `/2023/11/page/3/`, `/2023/11/my-journey-with-an-itin-personal-loan/`,
    `/2023/11/using-my-itin-number-to-secure-a-mortgage-a-personal-journey/`.
  - itincreditscore.com — `/blank` (junk URL); rest are noindex/canonical/404/redirect.
  - itincreditcard.com — `http://itincreditcard.com/` (HTTP variant, correctly 301s).
  - **Recommend disabling this scheduled task.** Ongoing indexing is better served by
    fixing sitemap discovery (below) than by 10 manual requests/day.
- **The task file's priority list was stale** — the slugs it named
  (`unsecured-credit-cards`, `build-credit-with-itin`, `business-credit-cards`,
  `how-to-get-an-itin`) do not exist on itincreditcard.com. Real slugs live under
  `/articles/*`. Also, the "itincreditcard.com only has ~4 pages indexed" premise is
  obsolete — live inspection shows near-complete coverage on both locales.
- **Systemic finding — sitemap discovery is broken family-wide (root cause):**
  - `sitemap-index.xml` is submitted and reads "Success" on both itincreditcard.com
    and itinlending.net, but reports **Discovered pages: 0**. Lending's index was
    last read Jun 6, 2026 and has not been re-read since.
  - Unindexed URLs report **"Sitemaps: No referring sitemaps detected"** in URL
    Inspection even though they ARE present in `sitemap-0.xml`.
  - Sitemaps hold far more URLs than GSC knows about: lending 150 sitemap vs 95 known;
    card 110 vs 29; score 114 vs 85. (GSC Pages counts lag live inspection, so the
    true gap is smaller than these numbers imply — but the 0-discovered signal is real.)
  - itinlending.net still has **3 stale legacy sitemaps submitted**: `sitemap.xml`
    (Oct 2023), `http://` `sitemap.xml` (Oct 2023), and `http://itinlending.net/sitemap`
    (May 2014, showing "1 error").
- Docs updated: this CHANGELOG entry.
- Follow-ups / open items:
  1. Submit `sitemap-0.xml` **directly** (alongside the index) in each property and see
     whether Discovered pages goes non-zero. Not done here — submitting sitemaps is
     outside this task's authorized action (request-indexing only). Needs Bob's OK.
  2. Remove the 3 stale legacy sitemaps from itinlending.net's Sitemaps report.
  3. Decide the disposition of the 5 legacy WordPress URLs on itinlending.net — 410,
     redirect to the Astro equivalents, or leave. They are dead weight either way.
  4. Disable the `itin-gsc-request-indexing` scheduled task.

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

## 2026-07-19 — PH taglines sharpened (all 5) + Perfume Picks forum thread posted

- Bob shared a "#1 on Product Hunt" post-mortem (PlugThis: 558 upvotes, 660 users, ~50 paying). Honest read
  given to Bob: tactics transfer, the RESULT does not — PlugThis sold a dev tool to PH's dev audience.
  Our own counter-example is Pour Picks (launched 5/27, 3 upvotes, zero prep/network). Strategy set:
  **Perfume Picks Mon 7/21 is the only launch with real PH-audience fit; the three ITIN launches are
  backlink plays, not rank plays** (a live listing links to the site whether it gets 3 votes or 300).
  Explicitly NOT doing a vote drive — PH's own dialog warns it gets you removed from the homepage.
- **All 5 taglines rewritten** (comparison-anchor formula, the post's best idea) and verified saved:
  Perfume "Like Letterboxd for fragrance, and it learns your taste" | Lending "Like NerdWallet, but for
  borrowers without an SSN" | Card "The cards that actually approve an ITIN, no SSN needed" | Score
  "You can have a US credit score without an SSN. Here's how" | Well Worth "The degreasers pro shops use,
  shipped to your garage".
- **Forum thread — v1 REJECTED, v2 posted** (the free-surface-area tactic from PlugThis). v1
  "Name 3 fragrances you own and I'll tell you what to try next" was rejected. Read the actual PH forum
  guidelines (help.producthunt.com/en/articles/10478791): General EXPLICITLY allows "product
  recommendations", so it was NOT off-topic — the violation was "content designed to farm engagement":
  the "reply and I'll do X for you" hook is the textbook bad pattern. v2 reframed as a real discussion
  with a point of view + two open questions, no hook: "The bottle you regret buying teaches you more than
  your favorites" (p/general, humanize gate exit 0, Pending Review). Bob answers replies to keep it alive
  through Monday. LESSON: PH forums allow product/consumer topics; they reject engagement-bait SHAPE.
- **PH EDITOR GOTCHA (cost several retries, log for future sessions):** programmatic value-setting does
  NOT work on PH's edit forms — React never marks the form dirty and Save stays disabled with "No changes
  to save". Only REAL typing works, and the field must be clicked by coordinate first (ref-based clicks
  silently missed). Also: never navigate immediately after clicking Save; it cancels the request.

---

## 2026-07-19 — First real journalist digest arrived: 0 of 9 relevant (responder hardened)

- Qwoted's first "Media Opportunities" digest hit the `link-engine/queries` label (Sat 2:43pm, 9 openings:
  Business Insider, U.S. News, Investopedia, A&E, AARP, Daily Mail, NY Post, ACBJ, Martha Stewart).
  **Zero qualified** for any of the four buckets. Correct outcome, not a failure — the near-miss was NY Post
  wanting a real estate LAWYER on foreclosure mechanics (adjacent topic, no standing).
- Hardened `link-engine-responder` from what the real email taught:
  1. **Big-email handling** — the digest was 86k chars of HTML and blew the token limit on read; task now
     told to parse the saved-file fallback with python3 tag-stripping and skip tracking URLs.
  2. **Digest vs single query** — evaluate each of ~9 opportunities separately; ignore signup/verify mail
     that shares the label.
  3. **Near-miss discipline** — explicit do-not-pitch list: queries needing a licensed professional Bob
     isn't (lawyer/CFP/CPA/psychologist), investment/stock/ETF commentary, personal-experience asks.
  4. **"Do not use AI" rule** — journalists write this (A&E did); responder must NOT draft those, just
     flag them for Bob to write personally or skip.
  5. **Silence on zero** — no iMessage when nothing qualifies, so the digest stays meaningful.
- OPEN ITEM for Bob: the Qwoted email is a RANDOM sample of 1,146 active opportunities, not matched to us.
  Setting alert keywords (Qwoted My Settings > Alerts) + adding bourbon/fragrance/detailing keywords to the
  SourceBottle + Qwoted profiles is what turns this from noise into matched leads.

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
