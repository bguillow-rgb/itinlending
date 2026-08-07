# Backlink Campaign — all 7 Timberline properties

Created 2026-08-03. Every URL below was checked live on that date. Status column says how.

**Verification legend**
- `VERIFIED` — fetched, HTTP 200, and the page title/H1 confirms it is the submission page.
- `LIVE (CF)` — Cloudflare bot challenge blocks scripted fetch. Site is up; the challenge itself is
  proof it is active. Submit from a real browser.
- `DEAD` — 404 or gone. Listed so nobody re-adds it later.

## The properties

| Property | URL | Type | Directory class that fits |
|---|---|---|---|
| ITIN Lending | itinlending.net | content site | business/company, finance editorial |
| ITIN Credit Card | itincreditcard.com | content site | business/company, finance editorial |
| ITIN Credit Score | itincreditscore.com | content site | business/company, finance editorial |
| Pour Picks | pourpicks.app | iOS app | app/product directories |
| Perfume Picks | perfumepicks.app | iOS app | app/product directories |
| Percolate | (coffee app) | iOS app | app/product directories |
| Well Worth Products | wellworthproducts.com | US manufacturer/store | local business, made-in-USA, industrial |

Operator entity for the three ITIN sites and the apps: **Timberline Ventures LLC**,
info@timberlineventuresllc.com. Well Worth submits **as Well Worth Products** using its own canonical
NAP (see LINK-ENGINE-OPS.md): 180 Dutton Ave, Buffalo, NY 14211 / 800-890-7935 /
info@wellworthproducts.com. Bob is the operating partner, not the manufacturer. Never submit Well
Worth under Timberline's NAP or vice versa.

---

## READ THIS FIRST: what "automating backlinks" can and cannot mean

Researched 2026-08-03. The honest finding:

**Fully automated submission is not available and not desirable.**
1. Roughly 40% of these sites sit behind Cloudflare bot challenges (verified: AlternativeTo,
   Product Hunt, SaaSHub, Thomasnet, Crunchbase, Manta, Hotfrog, Yellow Pages, Chamber of Commerce,
   Peerlist, SideProjectors, LaunchingNext, G2, Capterra, TrustRadius, D&B). Scripted POSTs fail.
2. Nearly all require an account plus email verification, and most route new listings through human
   moderation.
3. Tools that claim to auto-submit to "500 directories" are the spam class this project already ruled
   out (LINK-ENGINE-PLAN.md line 43). They produce a detectable footprint, and the blast radius here
   is a shared AdSense + CJ + Awin account across all seven properties. Not worth it.

**What genuinely automates:**
- **Browser-driven submission in batches.** Bob creates the accounts once; Claude drives the form
  fill and submit through Claude-in-Chrome, 10-15 directories per session. This is the real lever.
- **Discovery.** Finding listicle and roundup targets per vertical, and finding new directories.
- **Outreach drafting.** The daily link-engine responder already drafts pitch emails; the same
  machinery covers listicle inclusion pitches. Bob sends.
- **Tracking.** Verifying which submissions went live, and diffing new/lost links weekly via the
  existing GSC + Bing links pull.

**Critical timing detail:** AlternativeTo requires accounts to be **one week old** before they can
submit an app (confirmed in their FAQ, 2026-08-03). Several others have similar cooldowns. Create
every account TODAY even if submissions happen later, so the clock starts.

---

## COST REALITY — read before Table 1 (added 2026-08-03 after running submissions)

The original Table 1 verified that URLs were **live**. It did not verify **terms**, and that was a
gap. Checking terms found a clear pattern:

**The indie product-launch tier monetises by selling dofollow links.** Confirmed live:
- **Fazier**: free tier requires a "Featured on Fazier" badge on our homepage/footer. Paid tiers
  $29/$49/$119 advertise "Guaranteed high-authority backlink (DR 82+)" and "dofollow backlink".
- **Microlaunch**: `/submit` redirects to `/premium#pricing`. Tiers $39/$49/$129/$149, selling
  "Lifetime SEO - DR60+ Do-follow Backlinks."
- **Uneed**: free but rationed to one queued product at a time; Pro is paid.

These sites exist to sell launch visibility, so paid-or-reciprocal is their whole model. **Buying
dofollow links is a link scheme under Google's spam policies.** Treat this entire tier as
skip-by-default given the shared AdSense + CJ + Awin exposure across all seven properties.

**The genuinely free tier is the old-line and mission-driven directories**, which monetise elsewhere
(ads, data, upsells to enterprise) or not at all. That is where to spend effort, and the links are
better anyway:

| Genuinely free, no strings | Why it's free |
|---|---|
| Alliance for American Manufacturing (#29) | advocacy nonprofit, no account needed |
| Made It In The States (#30), AllAmerican.org (#31) | mission-driven directories |
| Google Business Profile, Bing Places, Apple Business Connect | platform plays |
| Brownbook, MerchantCircle, Alignable, Nextdoor, Foursquare | ad-supported |
| Trustpilot (free tier), Crunchbase | freemium, upsell is enterprise data |
| Product Hunt, Indie Hackers | community-funded / free to post |

**Terms NOT yet verified** (do not submit until checked): BetaList, StartupBase, Tiny Startups,
SaaSHub, Peerlist, SideProjectors, Launching Next. Assume paid-or-badge until proven otherwise.

**Paid, decide separately:** BBB accreditation, USHCC membership, Thomasnet placement.

## TABLE 1 — App & product directories (Pour Picks, Perfume Picks, Percolate)

| # | Directory | Submission URL | Status | Account | Notes |
|---|---|---|---|---|---|
| 1 | Product Hunt | https://www.producthunt.com/posts/new | VERIFIED (browser: "Submit a product") | yes | Highest value. One shot per product, plan the launch day. |
| 2 | AlternativeTo | https://alternativeto.net/ → sign in → user icon → "Suggest new application" | VERIFIED via FAQ | yes | **Account must be 1 week old.** Create today. `/manage/app/new/` is DEAD (404). |
| 3 | Uneed | https://www.uneed.best/submit-a-tool | **SUBMITTED 8/3 (Pour Picks)** | yes | **Free plan = ONE product queued at a time.** Others blocked until Pour Picks launches, or upgrade to Uneed Pro (paid). Tool page stays 404 until a launch is scheduled. |
| 4 | Fazier | https://fazier.com/submit | VERIFIED, **NOT submitted — needs a decision** | yes | Free tier requires embedding a "Featured on Fazier" badge on our homepage/footer. Paid tiers ($29/$49/$119) explicitly sell a "guaranteed dofollow DR82+ backlink". See warning below. |
| 5 | Microlaunch | https://microlaunch.net/submit | VERIFIED | yes | Free tier + paid |
| 6 | StartupBase | https://startupbase.io/submit | VERIFIED ("Sign in or create your account") | yes | |
| 7 | Tiny Startups | https://tinystartups.com/submit | VERIFIED | yes | |
| 8 | BetaList | https://betalist.com/submit | VERIFIED (200) | yes | Skews pre-launch |
| 9 | Indie Hackers | https://www.indiehackers.com/products/new | **BLOCKED — requires logo file upload** | logged in | Form fills fine; the LOGO field is required and Claude cannot upload local files in this session. Bob must attach the logo. |
| 10 | SaaSHub | https://www.saashub.com/submit | LIVE, **not logged in** | yes | Note: their /submit is pitched as a tool to push your product to many directories, i.e. an upsell surface. Check terms. |
| 11 | Peerlist Launchpad | peerlist.io — correct path TBD | **`/scroll/launchpad` is DEAD (404)** | yes | Not logged in. Find the real launchpad URL before retrying. |
| 12 | SideProjectors | https://www.sideprojectors.com/project/submit | LIVE (CF) | yes | |
| 13 | Launching Next | https://www.launchingnext.com/submit/ | LIVE (CF) | yes | |

### Two gotchas found on 2026-08-03 by actually running submissions

**Uneed free plan caps you at one queued product.** Pour Picks is in the waiting line (edit URL
`uneed.best/edit/waiting-line/45288`). Perfume Picks, Percolate and the rest cannot be added until it
launches. Also: `uneed.best/tool/pour-picks` returns **404** until a launch date is scheduled, so the
submission produces no link on its own. Scheduling is a timing decision and should not collide with a
Product Hunt launch for the same app.

**Fazier's free tier is a reciprocal-link deal, and its paid tiers are selling links.** The free
option is labelled "Free with embed badge" and requires a "Featured on Fazier" badge on our homepage
or footer, which means editing all seven sites and giving each an outbound link. The paid tiers
advertise a "Guaranteed high-authority backlink (DR 82+)" and "High-authority dofollow backlink".
**Buying dofollow links is a link scheme under Google's spam policies.** Given the shared AdSense +
CJ + Awin exposure across all seven properties and the stance already recorded at
LINK-ENGINE-PLAN.md line 43, the paid Fazier tiers should be treated as out of scope unless Bob
explicitly overrides. The badge-exchange free tier is a smaller question but still needs a decision,
since it modifies live sites.

Read this as a general warning about the app-directory tier: several of these monetise by selling
dofollow links. Check each one's free-tier terms before submitting, not after.

Skip for these three apps: G2, Capterra, GetApp, TrustRadius, SourceForge. All live but B2B-software
oriented; consumer iOS apps get rejected or buried.

## WELL WORTH IS ALREADY LISTED — this is a claim-and-correct job, not a submit job

Checked 2026-08-03 before submitting anything. Well Worth Products is an established business (per
Manta, incorporated in NY in 1999, ~5 employees) and is **already present on most of the directories
in Table 2**. Creating new listings would produce duplicates, which get suppressed or merged and hurt
local ranking. The original Table 2 plan was wrong for this property.

**Confirmed existing listings:**

| Directory | Listing | State |
|---|---|---|
| Google Business Profile | "Well Worth Products, Inc", 4.3★ / 6 reviews, auto accessories wholesaler | LIVE, appears managed (has hours, "identifies as women-owned") |
| IndustryNet | industrynet.com/listing/3972930/well-worth-products-inc | LIVE (was wrongly on our submit list) |
| Manta | manta.com/c/mm2tc04/wellworth-products | LIVE but **UNCLAIMED** |
| Yelp | yelp.com/biz/wellworth-products-buffalo | LIVE, no reviews |
| D&B | dnb.com company profile | LIVE |
| MapQuest | 180 Dutton Ave listing | LIVE, "Own this business? Claim it" |
| LinkedIn | linkedin.com/company/well-worth-products-inc. | LIVE, 50+ followers |
| Facebook | facebook.com/p/Well-Worth-Products-Inc-100063184872922 | LIVE |

**Two NAP inconsistencies already in the wild, which are worth more than any new listing:**

1. **Name split.** "Well Worth Products, Inc." on Google, IndustryNet, D&B and LinkedIn, versus
   **"Wellworth Products"** (one word) on Manta and Yelp. One entity reading as two erodes exactly the
   entity confidence these listings are supposed to build.
2. **Phone split.** The company contact page says **800-890-7935**. The Google Business Profile says
   **(716) 597-0214**. GBP is the most authoritative local signal, so this needs a decision and then
   one number everywhere. Ops-doc canonical is currently 800-890-7935 with 716 as secondary.

**Revised Well Worth work, in priority order:**
1. Decide the canonical phone, then make GBP and the website agree.
2. Claim the Manta listing (unclaimed) and fix the name to "Well Worth Products".
3. Claim/correct the Yelp listing (same name problem).
4. Confirm the GBP is claimed by Well Worth, not sitting unmanaged.
5. Only then consider genuinely new directories.

All of 1-4 need ownership verification, which means Well Worth's cooperation, not just Bob's.

## TABLE 2 — General business directories (Timberline entity + Well Worth)

| # | Directory | Submission URL | Status | Account | Notes |
|---|---|---|---|---|---|
| 14 | Google Business Profile | https://www.google.com/business/ | VERIFIED | yes | Biggest single item for Well Worth (real address). ITIN sites have no premises, so service-area or skip. |
| 15 | Bing Places | https://www.bingplaces.com/ | VERIFIED | yes | Can import from Google |
| 16 | Apple Business Connect | https://businessconnect.apple.com/ | VERIFIED | yes | |
| 17 | Yelp for Business | https://biz.yelp.com/ | VERIFIED | yes | Well Worth only |
| 18 | Trustpilot Business | https://business.trustpilot.com/signup | VERIFIED ("Create Your Free Account") | yes | Free tier; strong for Well Worth |
| 19 | Brownbook | https://www.brownbook.net/add-business | VERIFIED | yes | Free, global, low bar |
| 20 | MerchantCircle | https://www.merchantcircle.com/signup | VERIFIED | yes | |
| 21 | Crunchbase | https://www.crunchbase.com/register | LIVE (CF) | yes | Entity anchor for Timberline; matters for AI/entity consistency |
| 22 | Chamber of Commerce | https://www.chamberofcommerce.com/business-directory/add-business | LIVE (CF) | yes | |
| 23 | Alignable | https://www.alignable.com/ | VERIFIED | yes | |
| 24 | Nextdoor Business | https://nextdoor.com/business/ | VERIFIED | yes | Well Worth (local Buffalo) |
| 25 | Foursquare | https://foursquare.com/add-place | VERIFIED (login wall) | yes | Well Worth only |
| 26 | Manta | https://www.manta.com/ | LIVE (CF) | yes | |
| 27 | Hotfrog | https://www.hotfrog.com/AddYourBusiness.aspx | LIVE (CF) | yes | |
| 28 | BBB | https://www.bbb.org/ | VERIFIED | yes | **PAID accreditation.** Decide before spending. |

## TABLE 3 — Made-in-USA & industrial (Well Worth only)

| # | Directory | Submission URL | Status | Account | Notes |
|---|---|---|---|---|---|
| 29 | Alliance for American Manufacturing | https://www.americanmanufacturing.org/submit-your-company/ | **STAGED 8/3 — reCAPTCHA blocks Claude, Bob must tick + submit** | no | Free. Best single fit for Well Worth. |
| 30 | Made It In The States | https://www.madeitinthestates.com/submit | **SUBMITTED 8/3 ✅** | no | No CAPTCHA, no account. Cleanest submission on the whole list. |
| 31 | AllAmerican.org | mailto:tips@allamerican.org (page: https://allamerican.org/tips/) | **NO FORM — email tip line. Draft written, Bob sends.** | no | They run their own made-in-USA certification on submissions |
| 32 | IndustryNet | https://www.industrynet.com/account/register/ then https://www.industrynet.com/marketing/upgrade/ | VERIFIED both | yes | `/add_company.php` and `/free-listing` are DEAD (404) |
| 33 | Thomasnet | https://www.thomasnet.com/list-your-company | LIVE (CF) | yes | Big industrial buyer directory |
| 34 | AmericansWorking | https://www.americansworking.com/advertise.html | VERIFIED ("Advertise on Americansworking.com") | no | Contact-based; may be paid |
| 35 | b4USA | https://www.b4usa.com/ | VERIFIED (home) | ? | No public submit path found; contact them |
| 36 | MFG.com | https://www.mfg.com/ | VERIFIED | yes | Custom-manufacturing marketplace |
| 37 | Kompass | https://www.kompass.com/ | LIVE (CF) | yes | International B2B |

## TABLE 4 — ITIN sites: the honest picture

The three ITIN sites are the hardest of the seven to place in directories, because they are content
sites with no premises and no product SKU. Findings:

- Financial-literacy directories that rank (OCC, MyMoney.gov) are **curated government lists, not
  self-serve submission**. OCC's is at
  https://www.occ.gov/topics/consumers-and-communities/community-affairs/resource-directories/financial-literacy/index-financial-literacy-resource-directory.html
  (VERIFIED live). Getting listed is an editorial ask, not a form.
- USHCC: https://www.ushcc.com/ VERIFIED live, but `/membership/` is DEAD (404). Membership is the
  route and it is paid. Local Hispanic chambers are cheaper and more realistic.
- So the ITIN link path is: **general business directories under Timberline** (Table 2) +
  **editorial/listicle outreach** (Table 5) + the existing syndication play. Not directory volume.

## TABLE 5 — Listicle & roundup outreach (where real editorial dofollow links come from)

This is discovery-per-vertical rather than a fixed list. The repeatable query patterns, to be run
weekly and drafted by the existing responder machinery:

| Vertical | Query patterns | Target |
|---|---|---|
| Pour Picks | "best bourbon apps", "best whiskey apps", "apps for whiskey collectors" | Pitch inclusion; bourbonbanter.com already identified in LINK-ENGINE-OPS |
| Perfume Picks | "best fragrance apps", "perfume collection app", "apps for fragrance collectors" | Fragrantica/Basenotes adjacent blogs |
| Percolate | "best coffee apps", "coffee tasting journal app", "specialty coffee apps" | Home-Barista, CoffeeGeek adjacent |
| Well Worth | "best degreaser", "best glass cleaner", "best white lithium grease" | Detailing blogs, GarageJournal adjacent |
| ITIN x3 | "ITIN loans resources", "credit without SSN guide", immigrant-finance resource roundups | Nonprofit + immigrant services resource pages |

## Order of operations

**Today**
1. Create accounts on everything in Table 1 (the AlternativeTo one-week clock starts on creation).
2. Submit the no-account, free, highest-fit items: #29 Alliance for American Manufacturing,
   #30 Made It In The States, #31 AllAmerican.org (all Well Worth).
3. Google Business Profile + Bing Places + Apple Business Connect for Well Worth (real NAP).

**This week**
4. Claude drives batched browser submissions across Tables 1 and 2 once accounts exist.
5. Product Hunt launches scheduled deliberately, one app at a time, not all three at once.

**Ongoing**
6. Weekly listicle discovery + pitch drafting via the existing responder.
7. Weekly link diff via GSC + Bing links pull to confirm which submissions actually produced links.

## Rules carried over

- NAP must be byte-identical everywhere per entity. Timberline for ITIN + apps; Well Worth's own for
  Well Worth. Inconsistency erodes entity confidence (playbook Step 9).
- No auto-submit services, no spun descriptions, no submitting the same product to the same directory
  twice under different accounts.
- Write a real description per directory. Duplicate boilerplate across 30 listings is itself a
  footprint.
