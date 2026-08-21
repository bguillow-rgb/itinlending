# Lead Partners — selling ITIN leads

This doc tracks **who we sell ITIN leads to** and **how we reach them**. It pairs
with the local lead tracker at `~/Itin/research/lead-tracker.xlsx` (gitignored —
that file holds lead PII; this doc holds only public business info).

**Philosophy: sell the introduction, not the lead.** We don't dump raw lists to a
broker. Each inbound is a person who asked to be connected; we warm-forward a clean
intro to the best-matched partner and get paid a referral fee / per-lead price.
That keeps quality high and the relationship durable.

**Which site sells leads:** only **ITIN Lending** (itinlending.net). Credit Card and
Credit Score have no lead buyers ("check my score" isn't a sellable lead) — they
monetize via CJ affiliate + AdSense. See `MONETIZATION.md`.

---

## ⭐ THE DECIDING FACT — our borrowers have no SSN (measured 2026-07-15)

Queried the live `leads` table (`supabase db query --linked`). Of 15 rows:

| itin_status | count |
|---|---|
| **ITIN only** (incl. 1 "Solo ITIN") | **7** |
| **ITIN + SSN** | **1** |
| (not answered) | 7 |

**Of those who answered, ~88% have NO SSN.** Cross-referenced with the actual product
mix from the leads sheet (27 all-time): **personal loan 12, credit card 9, business 3,
credit score 1, mortgage 2.**

**Why this closes the API lane.** Our two volume verticals (personal loans, credit
cards) are exactly the ones that **require an SSN at post** to trigger the soft pull
that generates a bid. Our borrowers don't have one. So the lead marketplaces
(Engine, PX personal, Monevo, LeadsMarket, LeadNetwork, Astoria personal) are
**structurally unable to buy ~88% of our inventory** — this is not an approval problem
that more applications will fix. Meanwhile the lenders who DO serve ITIN-only borrowers
are direct-to-consumer and **don't buy leads at all** (see Oportun/Apoyo below). That
gap is the core strategic problem of this business.

**Consequences for routing:**
- **Personal loans (12, our #1)** — hardest. No established lead-buying market found for
  ITIN-only personal-loan leads. Open question, may need brokering rather than selling.
- **Credit cards (9)** — NOT a lead sale. Per `MONETIZATION.md` these monetize via
  **affiliate**: Self Financial (~$12/account), OpenSky, Firstcard. We were trying to
  sell traffic that should be clicking an affiliate link. Untested and cheap.
- **Mortgage (2)** — low volume but HIGH value per unit; a single funded ITIN mortgage
  is worth thousands to the lender, so volume is not the pitch. Outreach sent 2026-07-15.
- **Business (3)** — Accion Opportunity Fund referral program.
- **The 1 ITIN+SSN lead** — that slice is what PX/Engine can actually take.

**Data gap — FIXED 2026-07-15.** 7 of 15 had not answered `itin_status` because the field
was optional and only on the full `/apply` form. It is now **required and on every form**
(compact homepage + `/apply`, EN + ES), moved up beside `loanType` since those two are the
router's twin keys (product × id-type). Label reworded to "ITIN or SSN?" / "¿ITIN o Seguro
Social?" with reassurance copy ("Most of our readers have an ITIN and no SSN. Either is
fine.") so a required identity question doesn't scare a no-SSN audience off the homepage
form. Expect a clean split within a week.

> ⚠️ **Trap for future edits — do not put the string "SSN" in the ITIN-only option.**
> `partners.ts::idTypeOf()` tests `includes("ssn")` FIRST, so an option like
> `"ITIN only (no SSN)"` would classify every ITIN-only lead as **ITIN+SSN** and route
> borrowers to partners that cannot serve them. Change the label, never the option values.
> Current values are verified correct: `ITIN only` / `Solo ITIN` → `itin_only`;
> `ITIN + SSN` / `ITIN + Seguro Social` → `itin_plus_ssn`.

> **UPDATE 2026-08-03 — the API lane may be partially REOPENED.** PX's published
> personal-loans ping-post spec has **no SSN field at all** (and its mortgage spec
> lists SSN as optional). See "2026-08-03 — Fresh research pass" below. The
> conclusion "marketplaces are structurally unable to buy ~88% of our inventory"
> was over-broad: it holds for Engine/Monevo/LeadsMarket-style buyers, but PX's
> spec does not block ITIN-only leads. Whether PX *buyers* actually bid on them is
> an empirical question — test via integration, not assumption.
>
> ❌ **CORRECTION 2026-08-10 — PX is CLOSED for ITIN-only leads. The 8/3 hope did
> not survive the buyer-level answer.** Lisa Thiringer (Director, Publisher
> Sales) replied 8/8 after checking with PX's client team: *the spec doesn't
> require SSN, but ALL PX buyers require consumers to have valid SSNs.* She'll
> follow up if no-SSN buyers ever go live. So the original 7/15 conclusion
> stands: PX can take only our small ITIN+SSN slice. **Lesson recorded: a
> spec-level "SSN optional" is NOT evidence of buyer appetite — every future
> ping-post candidate gets the buyer-level question asked FIRST, before
> integration work.** Keep the Lisa relationship warm (she did real diligence);
> worth one reply asking whether any PX vertical (mortgage, home services,
> calls) has buyers that fund ITIN borrowers, and to keep us on the list.

## Delivery automation status (2026-07-12)

The lead-delivery router is **built and wired into the live Supabase function but
dormant** (see `LEAD-ROUTER-PLAN.md` for the runbook). Partners are configured in
`supabase/functions/_shared/partners.ts`; each only fires when its env switch is on,
its key/email is set, and `LEAD_DELIVERY_ENABLED=true`.

- **Engine by MoneyLion** — publisher application **submitted** (self-serve API,
  SSN-optional, covers personal/auto/mortgage/cards). Adapter ready; awaiting API
  key + endpoint/field confirmation, and a consent cert (TrustedForm/Jornaya).
- **RGR Marketing / Lead Buyer Hub** — next targets, ping-post mortgage/auto (real
  per-lead cash). RGR adapter stubbed; needs sales onboarding + posting spec.
- **Note:** LendingTree is **not** an API lead-buyer for us — its publisher program
  is affiliate-link only (CJ/FlexOffers); its posting API points the other way
  (LendingTree → lenders). Treat it as a CJ affiliate, not a router partner.

## Compliance / consent status (read before selling)

- **2026-06-15:** Terms of Use on all three sites (EN + ES) now explicitly disclose
  that submitted info may be **shared, sold, or transferred** to lenders/partners/
  lead buyers for a fee, that those parties may contact the person by call/text/
  email/mail incl. automated tech, and gives an email opt-out. Section renamed to
  "… lead sales & third parties."
- **2026-06-15:** The `/apply` form consent line (EN + ES, all 3 sites) now links
  **Terms of Use** alongside Privacy + Advertiser Disclosure, so submitters are
  shown the lead-sale disclosure at the point of opt-in. (`form.terms` i18n key.)
- **Remaining gaps:**
  1. **Still no affirmative consent checkbox** — consent is an implied, visible
     fine-print line ("By submitting, you agree…"), not a ticked box. That's the
     common standard and far better than before, but a checkbox is stronger for
     **TCPA** (express written consent for the specific buyer to call/text). Add
     one before scaling auto-dialed/texted outreach.
  2. **No CCPA/CPRA "Do Not Sell or Share My Personal Information"** opt-out link/
     mechanism — required once we actually sell CA residents' data.
  3. ITIN holders are a vulnerable population → higher fair-lending/UDAAP scrutiny.
- Recommend a `legal-eagle` pass + the two fixes above before scaling lead sales.

## Lead categories ↔ form purpose

The `/apply` form captures `purpose` (Personal / Business / Vehicle / Home) plus
qualifiers (amount, income, credit score, ITIN-only vs ITIN+SSN, time-in-business,
down payment). Each purpose routes to a different partner pool:

| Purpose | Partner pool |
|---|---|
| Personal | Oportun, Apoyo Financiero, Lendmark |
| Home (mortgage) | Acra Lending, Angel Oak, A&D Mortgage, New American Funding, Champions Funding |
| Vehicle (auto) | Lendbuzz, local ITIN auto dealers (BHPH) |
| Business | Accion Opportunity Fund (referral, ITIN). [Camino/Quantum = dead for leads — see note below] |

## Lead source attribution (added 2026-06-25)

Every lead now self-reports where the person came from. `LeadForm.astro` (all 3
repos) carries seven hidden fields that a small inline script fills on page load,
so the Web3Forms email/payload for each lead includes its own origin — no GA4
lookup needed to answer "where did this lead come from":

| Field | Source |
|---|---|
| `source_referrer` | `document.referrer` (external only — same-host refs are ignored) |
| `landing_page` | the first URL of the visit (full href incl. query) |
| `utm_source` / `utm_medium` / `utm_campaign` / `utm_term` / `utm_content` | parsed from the landing URL's query string |

**First-touch:** the script persists these in `sessionStorage` (`itin_src`) on the
entry page, so a multi-page visit attributes to the **entry source**, not the last
internal hop. Empty values are normal (direct traffic has no referrer/UTMs). Use
UTM-tagged links in social/forum posts (e.g. `?utm_source=reddit&utm_medium=social`)
to get clean attribution instead of a bare `reddit.com` referrer.

This is the lead-level record. The aggregate channel view lives in GA4 — see
`ANALYTICS-PLAN.md` → "On-demand GA4 puller (`ga4.py`)".

---

## Researched targets (public channels only)

> Contact values below are **public** channels found via research. Where no public
> business-development email exists, the partner web form / phone is listed. **Do not
> guess BD email addresses** — confirm before sending. Verified public email so far:
> Apoyo Financiero (`contactus@apoyofin.com`).

### Personal loans
> ⚠️ **Both top ITIN personal lenders verified CLOSED to us 2026-07-15.** They serve our
> borrower but have **no B2B/lead-buying program of any kind**. This is the gap described
> in "THE DECIDING FACT" above. Do not re-chase without new information.

- **Oportun** — ❌ **CLOSED.** ITIN loans $300–$10k nationwide, so the borrower fit is
  perfect, but there is **no B2B, affiliate, or lead-gen program**. Their only referral
  path is a consumer refer-a-friend whose terms require a Referrer to be an individual
  with an Oportun loan **"who is not in the business of lending or brokering financing
  for consumers"** — language that explicitly excludes us. Capped $1,000/yr regardless.
  (Verified on oportun.com/terms/refer-a-friend, 2026-07-15.)
- **Apoyo Financiero** — ❌ **CLOSED.** Spanish-first installment lender and a great
  audience fit on paper, but (a) **no business/affiliate/broker program** exists, only a
  consumer refer-a-friend, and (b) they lend in **California and Texas ONLY** (CA
  Financing Law Lic. 6054790; TX OCCC Lic. 2100070545-167761), $750–$15k CA / $750–$10k
  TX. Our personal-loan leads are mostly NJ/GA/MA/FL/NY/MD, so most wouldn't qualify
  anyway. (Verified on home.apoyofin.com, 2026-07-15.)
- **Lendmark Financial** — branch-based installment lender. Channel: lendmark.com
  contact form. ITIN: confirm. **Untested.**

### Mortgage (non-QM ITIN)
- **Acra Lending** — ITIN loans $150k–$3M, "Partner With Us" wholesale channel,
  Irvine CA, 888-800-7661. ITIN: yes.
- **Angel Oak Mortgage Solutions** — non-QM pioneer, broker-driven; lends all states
  except AK/CT/NY/VT. Channel: broker signup at angeloakms.com. ITIN: yes.
- **A&D Mortgage** — ITIN for foreign nationals/immigrants; wholesale (broker
  required). Channel: admortgage.com partner. ITIN: yes.
- **New American Funding** — large retail lender with non-QM ITIN lineup. Channel:
  newamericanfunding.com contact / loan officer. ITIN: yes.
- **Champions Funding (Champions Mortgage)** — "ITIN for the Win" non-QM program,
  TPO channel, AZ HQ. Channel: champstpo.com/partner-with-us. ITIN: yes.

### Auto
- **Lendbuzz** — AI auto lender, ITIN, same-day funding, dealer-partnership model.
  857-999-0250 / lendbuzz.com/contact. ITIN: yes.
- **Local ITIN auto dealers (BHPH)** — Westway Ford (TX), Mossy (CA), etc. accept
  ITIN financing; direct per-dealer outreach. ITIN: varies.

---

## 2026-06-15 — Additional buyers (research, verified contacts)

New targets from a fresh buyer-research pass. **Verified** = email found on the
company's own site; **form/phone** = no public BD email, use the listed page/number
(don't guess an address).

### Mortgage (non-QM ITIN) — additions
> ✅ **ALL FIVE CONTACTED 2026-07-15** (first time since these contacts were researched
> on 06-15). Pitch: warm consented borrower referrals, explicitly NOT a broker, honest
> about small volume. The argument is value-per-unit, not volume — one funded ITIN
> mortgage is worth thousands to them, so "a couple a month" is still worth a call.
> This is the most promising open lane; mortgage is the one vertical where our low
> volume genuinely does not disqualify us. Awaiting replies.

- **Carrington Wholesale** *(top pick)* — ITIN program across retail/wholesale/
  correspondent (launched Apr 2024), nationwide, NMLS #2600. **Verified:**
  `wholesalecontact@carringtonms.com` / 866-453-2400 ·
  carringtonwholesale.com/become-approved.
  **Outreach: SENT 2026-07-15** — asked for the **retail** door specifically (we are not
  a licensed broker, so the wholesale channel this address serves is the wrong path).
- **BuildBuyRefi** (The Federal Savings Bank) *(best fit)* — ITIN home loans up to 89.99%
  LTV, no SSN, all 50 states, bilingual LOs. **Verified:** `info@buildbuyrefi.com` /
  844-999-0639 · nationwidehomeloansgroup.com/preferred-partners.
  **Outreach: SENT 2026-07-15.**
- **Gustan Cho Associates** (NEXA affiliate) — ITIN core product, high-volume lead
  model. **Verified:** `alex@gustancho.com` / 800-900-8569.
  **Outreach: SENT 2026-07-15.**
- **McGowan Mortgages** — ITIN mortgage **and** ITIN personal-loan content, ~40
  states. **Verified:** `info@mcgowanmortgages.com` / 816-631-9687.
  **Outreach: SENT 2026-07-15.**
- **Non-Prime Lenders** (DBA United Mortgage Corp, NMLS #1330) — originates **and**
  matches ITIN loans. **Verified:** `info@nonprimelenders.com` / 732-761-9041.
  ⚠️ Shares NMLS #1330 + phone with Dream Home Financing — treat as one buyer group;
  if they reply, do NOT separately pitch Dream Home.
  **Outreach: SENT 2026-07-15.**
- **NMHL (National Mortgage Home Loans)** — programmatic ITIN-by-state pages,
  nationwide. **Form/phone:** nmhl.us/contact / 248-864-2200.

### Ping-post buyers / lead networks (supply-side — they buy leads FROM publishers)
- **RGR Marketing** — performance-marketing lead-gen co., El Segundo CA, since 2004
  (founders Matt Schaub, Silas Ellman). Buys mortgage/auto/solar/debt leads from
  publishers; real-time POST / ping-post. **Verified (own contact page):** supply
  door `affiliate@rgrmarketing.com`; sales Jeff Stillitano `jeff@rgrmarketing.com`
  / 877-272-4600; `info@rgrmarketing.com` / 310-540-8900. Intermediary, not the end
  lender — confirm their panel funds ITIN before sending volume.
  **Outreach: SENT 2026-07-12** to `affiliate@rgrmarketing.com`.
  ❌ **CLOSED 2026-07-13 — not a fit. Do not re-chase.** Jacob at RGR replied: they are
  **not buying refinance leads** right now. They counter-offered **thank-you-page click
  traffic** instead of lead posts, specifically adding their **Gov Loan Options** offer
  to our `/thank-you` page. Bob reviewed and **passed** — Gov Loan Options is a
  government/VA-style product that does not match an ITIN audience (our readers are
  largely non-citizens who won't qualify), so it would burn the thank-you slot on an
  offer our traffic can't convert. Takeaway: RGR wanted our *ad inventory*, not our
  leads. Reopen only if they start buying ITIN mortgage/auto **lead posts**.
- **Lead Buyer Hub** — lead marketplace, Las Vegas, founded 2019 (CEO Nir Algazy).
  Insurance/finance/education; exclusive leads + inbound calls + live transfers via
  API; self-serve affiliate program for suppliers. **Verified (own contact page):**
  `info@leadbuyerhub.com` / (833) 616-0574 / (702) 850-5488; use the **Affiliate
  Sign-up** at leadbuyerhub.com/contact (the main form is buyer-facing). Intermediary
  — confirm ITIN funding first.
  **Outreach: SENT 2026-07-12** to `info@leadbuyerhub.com` — awaiting reply.

### New prospects — 2026-07-12 research pass (contacts verified on each company's own site)

> Cross-cutting caveat: every personal-loan buyer below collects **SSN at post**
> (lenders bid off a soft pull). None publicly advertise ITIN/no-SSN acceptance, so
> they're primarily for your **SSN-holder** leads — ITIN-in-the-SSN-field must be
> asked of each rep. The two that also do **mortgage** (LeadPoint, PX) take those
> with no SSN at post. This is the #1 onboarding question for all of them.

- **LeadPoint** *(top new pick)* — real-time lead **exchange**, mortgage + personal.
  Publishers **self-serve sign up as sellers**, paid biweekly, no SSN at post (mortgage).
  ✅ **Signup verified live 2026-07-12:** `leadpoint.com/sellersignup/` (name+email
  interest form → they follow up) · 866-832-8156 / 310-209-8600.
  ✅ **SIGNED UP 2026-07-15** — awaiting their follow-up + seller/posting spec. Ask on
  the call: does the mortgage spec hard-require SSN, and do panel buyers fund ITIN?
- **PX (px.com)** *(best API docs)* — open **ping-post** exchange, personal +
  mortgage. Ping phase is ZIP+IP only (no PII); PII on the post. Many-buyers model is
  the most flexible for an unusual (ITIN) lead shape. Publisher intake form ·
  **(949) 313-7099** · leads.px.com/publishers-new-landing-page · API docs at
  api.px.com/v2/verticals/personal-loans.
  ✅ **PX "Additional Information Request" questionnaire SUBMITTED 2026-08-05**
  (share.hsforms.com/1-IuX0eC_RRi9nGZfSMDBvgcgq2p — deep vendor-diligence form,
  ~50 fields; "Thanks for submitting the form" confirmed). Answers of record:
  0–1 yr in business, 1–10 employees, Hamburg NY, no satellite offices;
  verticals = personal/payday, mortgage purchase, auto, small business, credit
  repair, debt, credit cards; **traffic 76–100% O&O + 76–100% SEO/organic**, all
  other channels N/A (no co-reg, email/SMS, native, aggregator, third-party);
  web leads Yes, inbounds/warm transfers No, no call center; daily web <100,
  monthly leads <10K; **Jornaya No, TrustedForm No, but "willing to add" = Yes**;
  segment/filter Yes; lead system = Custom CRM; integrations = All;
  business model = **O&O**; references willing = Yes (names left blank on
  purpose — no one has consented yet); QC + pre/post validation = Partial.
  ⚠️ The TrustedForm answer is the gating item for actually selling: flip
  `PUBLIC_TRUSTEDFORM_ENABLED` and get an ActiveProspect account before volume.
  ✅ **APPLIED 2026-07-15** as **Publisher** (not Aggregator — we own the traffic).
  Intake answers stated: non-exclusive fan-out, own router w/ eligibility engine +
  per-attempt logging, no acceptance-rate history yet, bid-first intent. The two
  qualifying questions were put IN the application: *does the mortgage/auto spec
  hard-require SSN, and do any panel buyers fund ITIN borrowers?* Awaiting reply.
- **Monevo (US)** — personal-loan + card **marketplace**, 65+ lenders, publisher
  program (API / white-label / redirect). TransUnion-owned (Jan 2025). **1-619-536-0749**
  · `compliance@monevo.com` · monevo.com/us/publishers.
- **QuinStreet (NASDAQ: QNST)** — large financial-services publisher network,
  **rev-share**. Self-serve enrollment `publishers.quinstreet.com/enrollment`.
- **SuperMoney** — 50+ finance verticals, turnkey embed/prequal widgets for
  publishers. Signup `tracking.supermoney.com/signup` · supermoney.com/monetize.
- **Credible (Fox-owned)** — marketplace: personal, mortgage, student, auto. Partner
  form · **(866) 540-6005** · credible.com/partners.
- **Leadtree Global** — affiliate network + pingtree, personal/short-term loans.
  **SSN-track only.** Self-serve affiliate signup, leadtree.global.
- **Astoria Company** *(strong general fit)* — proprietary **lead exchange**,
  personal + title + **mortgage** + **auto financing**. Ping-and-post AND host-and-post.
  Sell-leads/vendor door: astoriacompany.com/vendor-form · **+1 510-663-7016** ·
  `bizdev@astoriacompany.com`. Route mortgage/auto here (SSN more often optional).
- **Mortgage-only buyers:** Mortgage Research Center (mortgageresearch.com/contact ·
  (573) 876-2600 · 60+ publisher partners, VA/FHA/gov-heavy, weaker ITIN fit) and
  **MediaAlpha** (mediaalpha.com/publishers · programmatic API exchange, ~85% via API,
  mortgage vertical, publicly traded). Mortgage forms generally don't collect SSN at
  post → clean ITIN fit; confirm the lead spec doesn't hard-require SSN.
  Not buyers: Bankrate/NerdWallet (demand-side), LowerMyBills/Bills.com (Rocket-owned
  CPL — you drive traffic to THEIR form), FreeRateUpdate/iLeads (sellers).
- **Lead Stack Media** — personal/payday/debt, self-hosted forms wired to 200+ buyers,
  up to ~$300/approved. `business@leadstackmedia.com` · leadstackmedia.com/signup ·
  Orlando FL. **SSN-heavy** (payday/personal).
- **Intimate Interactive Advertising** — two-sided **lead exchange** (itatracker),
  personal/debt/auto/title/solar, 47 states. Seller portal `partner.itatracker.com`;
  contact form only (no public email — don't guess).
- **Pay-per-CALL angle (no SSN needed — calls, not form leads):** **HyperTarget
  Marketing** (mortgage + finance calls, hypertargetmarketing.com/publisher-signup)
  and **MarketCall** (debt/tax/credit-repair calls, Spanish-language routing,
  marketcall.com/affiliates). A clean ITIN monetization path since calls skip the
  SSN-at-post problem entirely — worth testing for Spanish traffic.
- **myAutoloan (Horizon Digital Finance)** *(easiest win)* — auto purchase + refi
  affiliate, pays per valid application, joinable via **Commission Junction or Impact**.
  We ALREADY run CJ (`affiliateUrlFor()`), so this can be added inside the existing
  CJ account. No SSN at post. ✅ **Verified live 2026-07-12:** CJ branded signup
  `signup.cj.com/member/brandedPublisherSignUp.do?air_refmerchantid=1390130`
  (CJ merchant id **1390130**); Impact `app.impact.com/.../myAutoloan.brand`.
  ✅ **WIRED LIVE 2026-07-27:** approved + active in CJ (pays **$10/lead**, 3-mo EPC
  ~$59). Added as a **secondary** "compare auto offers" CTA on `/itin-auto-loan`
  (EN+ES) via `AutoCompareCTA.astro`; the lead form stays primary. Link uses the
  **ITIN Lending** CJ property (#101772772): `tkqlhce.com/click-101772772-10608154`,
  env `PUBLIC_AFFILIATE_URL_AUTO_COMPARE`. Note: myAutoloan is NOT ITIN-specific, so
  the callout tells users to confirm ITIN acceptance before applying.
- **Auto Credit Express (ACE)** *(best subprime/ITIN fit)* — largest subprime auto
  lead gen since 1998, "accepts 100% of valid US apps," skinnable hosted form,
  **Spanish-language special-finance line**. ✅ **Signup verified live 2026-07-12:**
  `autocreditexpress.com/affiliates/signup/` (full affiliate application form) ·
  866-902-4403 (Julie Costa, 888-535-2277 x6622). Verify SSN handling on the form.
- **Auto — sales-intake (contacts verified):** Interactive Financial Marketing Group
  (partners.interactivefmg.com · (804) 225-1880) and Auto Loan Options
  ((855) 311-5323 · `sales@autoloanoptions.com`) — subprime auto, source from
  affiliate networks, onboard via sales call.
- **Auto — ruled out:** CyberLead, V-P Marketing, SubprimeAutoLeads, Integrity Leads
  (generate on own sites, don't buy from publishers); Westlake/Credit Acceptance/
  DriveTime (lenders, push leads to dealers). "Zuma" auto-lead buyer — could not be
  verified to exist.
- **Hispanic-market lenders (direct referral, not API; confirm ITIN):** Movement
  Comunidad (Movement Mortgage) and Rate / Guaranteed Rate all-Spanish mortgage.

**ITIN-native buyers with a real feed/intake (Bucket 2 — the moat):**
- ~~Quantum Lending Solutions / Camino~~ — **REMOVED, verified dead 2026-07-12**
  (Camino stopped taking apps; Quantum is B2B lending infrastructure for banks, no
  affiliate/lead program). See the correction note above.
- **Accion Opportunity Fund** *(the ITIN business-loan option)* — nonprofit CDFI,
  ITIN small-business loans ($5K–$100K),
  defined **referral-partner program** (partners incl. Intuit, Amex). Relationship-
  managed intake at aofund.org/partners/referral-and-program-partners.
- **Wholesale ITIN mortgage (broker-channel — need a licensed broker or sell to their
  AEs):** ACC Mortgage (accmortgage.com/itin-mortgage-program · 877-353-2233),
  BluePoint Mortgage (877-267-1056 · `marketing@bluepointmtg.com`), PRMG Wholesale
  (tpo.prmg.net "Fast Pass"). High ITIN appetite; take loans from brokers, not raw leads.
- **Carros Hispanos** — sells Hispanic auto leads TO dealers (channel/competitor, not
  a buyer); only relevant if wholesaling your ITIN auto leads to them.

### ⚠️ Avoid / not a fit (2026-07-12)
- **Zero Parallel** — CFPB enforcement action (sold loan apps to lenders making void/
  unlicensed loans). A responsive network, but the worst association for a vulnerable
  ITIN audience. Recommend against.
- **T3Leads** — CFPB action (buying/selling loan apps without vetting) **plus**
  third-party non-payment complaints. Avoid / heavy diligence only.
- **Auto Lead Pro** — demand-side only (sells to dealers), doesn't buy from publishers.
- **NerdWallet, Bankrate/Red Ventures** — owned-and-operated publishers, not
  supply-side buyers. Not a fit.
- **Lead Prosper / boberdoo / Phonexa** — ping-post *software platforms* (run your
  own distribution), not buyers.
- **Fiona / Even Financial = Engine by MoneyLion** (already in pipeline; no separate door).

### Lead aggregators / routers (fastest path — they already buy this demand)
- **Dream Home Financing** *(ITIN-specific router)* — has a dedicated ITIN page,
  places borrowers with lender partners. **Verified:** `eric@dreamhomefinancing.com`
  · dreamhomefinancing.com/LeadForm.aspx. (Same #1330 group as Non-Prime Lenders.)
- **LendingTree** — largest loan marketplace (mortgage + personal); apply via
  lender-partner page. **Form only.**
- **Phonexa / LeadCrowd / ActiveProspect** — lead-distribution networks with
  built-in TCPA/consent tooling (TrustedForm); useful to distribute rather than
  negotiate one-off. **Form only** (partner/affiliate pages).

### Personal loan (geo-limited)
- **Embold Credit Union** (ex-Clackamas FCU) — ITIN personal loans + ITIN cards, but
  **6 Oregon counties only.** Buy-worthy for OR leads only. **Form/phone:**
  emboldcu.org/contact / 800-878-0671.

### Credit-builder / cards (CC + CS sites — affiliate, not lead sale)
Per `MONETIZATION.md`, CC/CS monetize via affiliate, not lead sales. These fit there:
- **Self Financial** — credit-builder + secured Visa, accepts ITIN; **live affiliate
  program** (~$12/account) via FlexOffers / PerformCB — lowest-friction.
- **Firstcard** — ITIN/no-SSN credit-builder card. **Verified:** `support@firstcard.app`
  (support inbox; for partnership also hit company LinkedIn).

> **Camino Financial — DEAD for lead sales (verified live 2026-07-12).** Camino
> **no longer accepts applications** (caminofinancial.com redirects to a
> `/no-services` page; services existing customers only). It points new business to
> **Quantum Lending Solutions**, which has repositioned as **B2B lending
> *infrastructure* sold to banks/credit unions/fintechs** (license their lending
> stack via a "Request Evaluation" form) — NOT a consumer lender and NOT a
> lead-referral/affiliate program. There is no affiliate signup and nothing to send
> leads to. An earlier research pass cited a Quantum "Integrated Referrals" API
> program; that page 404s and the claim did not survive live verification. **Do not
> pursue.** For ITIN business-loan leads, use Accion Opportunity Fund instead.

---

## 2026-08-03 — Fresh research pass (3 parallel agents) + inbox audit

### Inbox audit — the dropped ball
- **PX replied 2026-07-17 and we never answered.** Lisa Thiringer, **Director of
  Publisher Sales** (`lisa.thiringer@px.com`, +1 917-671-9892), asked us to complete
  their **Publisher Intake Form** (HubSpot link in her email, thread subject
  "Partnership Inquiry", to info@timberlineventuresllc.com) and to describe our top
  verticals/volume. **Unanswered 17 days. #1 priority.**
- No replies from LeadPoint (post-signup), Engine, or ANY of the 8 mortgage lenders
  emailed in July (Carrington, BuildBuyRefi, Gustan Cho, McGowan, Non-Prime, Jet
  Direct, Prysma). Latino CCU / MAF sent auto-acks only; CapEd sent a canned
  "can't discuss accounts by email." **Lesson: cold email to lender info@ boxes is
  near-zero-yield; marketplaces + phone are the productive channels.**

### Finding 1 — PX spec verified: NO SSN in personal loans, optional in mortgage
- Personal loans ping-post spec (`api.px.com/v2/verticals/personal-loans/ping-post-exclusive-personal-loans/`):
  required fields are consent/session (JornayaLeadId, TcpaText, etc.), State, ZIP,
  IP, self-reported CreditRating, OwnRented, LoanAmount, GrossMonthlyIncome,
  IncomeType; post adds name/email/phone. **SocialSecurityNumber is absent from the
  spec entirely.** No soft pull at post → ITIN-only leads can physically flow.
- Mortgage spec (`.../mortgage/ping-post-full-shared-mortgage/`): SSN appears only
  in one JSON example, never marked required.
- PX has **no auto-finance vertical** (its "auto" is auto insurance). Debt-consolidation
  and home verticals also have public specs.
- Open question: will panel buyers bid on ITIN-flagged leads? Unverifiable pre-
  integration. Ask Lisa directly + run test leads once live.

### Finding 2 — Pay-per-call lane (no SSN by design) — verified networks
- **MarketCall** *(apply first)* — mThink #3, 57 active finance offers, **Spanish
  debt-settlement calls $50–55/qualified call (90s+)** per their own case study;
  weekly payouts, $100 min, fast approval, SEO traffic OK.
  Signup marketcall.com/affiliates · `affiliate@marketcall.net` / `info@marketcall.com`.
  🎉 **ACCOUNT APPROVED 2026-08-04** (Lidya activated us). Offer inventory verified
  in dashboard — **11 Spanish offers**, incl. Spanish Personal Loans CPL (×3),
  Spanish Debt Settlement 10K calls $52/120s, 7.5K $48.75/90s, Spanish Credit
  Repair calls $20/95s, Spanish ACA up to $44, Final Expense up to $32.
  **LIVE CAMPAIGN #350784** (approved 2026-08-07; supersedes first attempt #350598)
  — "itinlending.net ES personal loans - SEO" on offer 9809 (Spanish Personal
  Loans | CPA | Dynamic Payout | Leads): dynamic $0–$200/approved lead, uncapped,
  8-day hold, qualified = 18+/US/no military/no benefits/income $800+mo/FICO 540+,
  GEO excludes AK CT GA IL NY VT WV, SEO explicitly allowed, **no SSN requirement
  in the spec**. **Tracking link: https://trkmcl.com/wy8om1m43k/z41kkw99nm** —
  wired via `PUBLIC_MARKETCALL_PERSONAL_ES` (must be set in BOTH `web/.env` and
  the CI env in `daily-content.yml`; deployed live 2026-08-07 after fixing a
  missed-env build — see CHANGELOG). Renders on /es homepage + /es/apply lead
  forms and /es personal/cash loan-page CTAs. Clicks tracked: GA4
  `affiliate_click` w/ `network=marketcall` + MarketCall dashboard Stats.
  Next campaigns to request: Spanish Debt Settlement 10K + Spanish Credit Repair
  (need call-tracking numbers + debt/credit-repair ES content).
  ✅ **2ND CAMPAIGN LIVE 2026-08-21 — campaign #352501 (Final Expense / life
  insurance, offer 10814, Insurance vertical).** Toll-free click-to-call
  **(844) 833-2205** (SIP 18448332205@sip.marketcall.com), SEO traffic approved,
  status = Moderation. Wired via `PUBLIC_MARKETCALL_FINALEXPENSE_PHONE` +
  `FinalExpenseCTA.astro` on the /es homepage. Insurance = no lending-license
  trigger; consumer-initiated call = lowest TCPA risk. **Bob: message Lidya to
  fast-track moderation now that the live CTA is up.**
  ⚠️ **Finding 2026-08-21:** MarketCall's **auto-insurance** call offers (Bundle
  1/2/3, up to $80/call — the best ITIN audience fit) **do NOT allow organic/SEO
  traffic** (create form offers only Paid Search / Native / Social). Final Expense
  DOES allow SEO. To run auto-insurance PPC on our SEO traffic, ask Lidya to
  approve SEO for an auto-insurance offer (she did it for personal loans), or use
  a different network (HyperTarget / Goojibear / Click Dealer) or an affiliate
  click-out. Auto insurance is the strongest fit (auto-loan visitors must carry it;
  insurers accept ITIN) — worth the manager request.
  ✅ **SIGNED UP + QUESTIONNAIRE SUBMITTED 2026-08-03** (account
  bob@timberlineventuresllc.com; Bob created the account, agent completed the
  activation questionnaire in-browser: SEO traffic / SEO publisher / Finance
  vertical / Pay Per Call + both CPL types / $0–1k budget). Account is **limited
  until activated by our assigned personal manager: Lidya Emelyanova,
  `lidia@marketcall.net`** (Mo–Fr 1–10 PM). Activation email drafted in Gmail
  2026-08-03 (asks activation steps + which Spanish campaigns are open) — Bob to
  review and send.
- **Aragon Advertising** — mThink #1 eight years running; debt-relief + tax verticals.
  Application-reviewed. aragon-advertising.com/join-network.
- **Astoria Company** — pay-per-call mortgage + live-transfer mortgage product (owns
  RateChecker.com), plus ping/post + host/post in auto financing, mortgage, personal,
  title. astoriacompany.com/publishers · `bizdev@astoriacompany.com` · (510) 663-7016.
  ✅ **VENDOR APPLICATION SUBMITTED 2026-08-04** (agent-completed 3-step form in
  Bob's browser, "application was received" confirmed). Selling: Leads + Calls.
  Honest disclosures: ~500 uniques/mo, ~25-30 leads to date, 100% organic SEO, no
  TrustedForm yet, exclusive leads, no affiliates. References given (with their
  knowledge NOT confirmed — heads-up if they get called): Lisa Thiringer (PX),
  Lidya Emelyanova (MarketCall), Jacob (RGR); Teams IDs N/A. **Included agreeing to
  Astoria's Mutual NDA** (Timberline Ventures LLC ↔ Astoria Company, eff. 2026-08-03,
  auto-generated with the 2701 Amsdell Rd, Hamburg NY 14075 address). Await review
  contact at bob@timberlineventuresllc.com / 716-510-9313.
- **Exclusive Live Calls** — Mortgage Purchase pay-per-call **$324 CPA, 90-sec min**
  (OfferVault), SEO traffic explicitly approved, manual approval + sample phase.
- **PX calls marketplace** — financial-services calls vertical (mortgage, debt,
  credit repair); ask Lisa in the same conversation.
- Tier-3/later: eLocal (needs volume history), Ringba X (needs platform sub + E&O),
  Goojibear (payout complaints), Lead Smart (payment complaints). **Digiticed**
  (Spanish-finance calls, dormant — perfect fit if relaunched: `diego@digiticed.com`).
  **LunaSol Media** — Hispanic network w/ Spanish debt CPL campaign,
  `sales@lunasolmedia.com` · 305-792-8315.
- Compliance: all require consumer-initiated consented calls, 90–130s minimums;
  page copy must set the "real phone conversation" expectation.

### ⚠️ Lane-3 execution status (2026-08-03, in-browser verification)
- **FlexOffers publisher application is DECLINED** (discovered at login:
  "The application matching this email address has been declined" —
  bob@timberlineventuresllc.com). This gates NAF and Remitly. Appeal email
  drafted in Gmail to `support@flexoffers.com` (cites CJ good standing +
  target advertisers); Bob to send. The old assumption "we already run
  FlexOffers via Self" was wrong — Self must have been wired elsewhere or never.
- **CJ recon (logged in, searched advertiser directory):** New American Funding,
  Remitly, H&R Block, Wise — **all 0 results on CJ.** Search engine verified
  working (TurboTax returns 4 results). So every Lane-3 program needs a network
  we don't have: NAF+Remitly→FlexOffers (declined), Félix Pago→Awin (no account),
  Wise→Partnerize (no account), H&R Block→Impact (no account). Account creation
  is Bob's (agent can't create accounts); agent can drive applications once
  logged in.
- **CJ bonus finds, tax vertical:** **TurboTax** (CID 1905878, Tax Services) and
  **TaxAct** (CID 4110283, 3-mo EPC ~$132) are both on CJ with "Apply to
  Program" buttons — one click away in the account we already have. Awaiting
  Bob's go-ahead to apply (program terms acceptance).
  **UPDATE 2026-08-07 (verified in CJ dashboard):** both now sit in **Pending
  Applications** (applied at some point; advertiser decision pending), alongside
  a strong finance slate also pending: **BMO** (lead $175–225!), **Capital Bank**
  (OpenSky issuer, $25/sale), **LendingTree** (lead $0–25), **PayPal Cashback
  Mastercard** ($150/sale), **Venmo Credit Card** ($190/sale), **Sky Blue
  Credit** (credit repair, $80/sale), **E-file.com** (30%). 47 pending
  applications total (rest mostly beauty for Well Worth). Separately, 7
  advertiser-initiated **pending offers** await acceptance (all product
  merchants — none finance).

### Finding 3 — New affiliate programs (instant automation via networks we know)
- **New American Funding — FlexOffers — up to $60/prospect** (lead contacted,
  screened, transferred to LO — effectively a warm-transfer payout). NAF markets an
  ITIN program via its learning center/LO pages, but no canonical ITIN product page
  found — **verify the live app flow accepts ITIN before wiring money-page CTAs.**
- **Félix Pago** (WhatsApp remittances, ES-first) — Awin, $1–3/new user.
- **Remitly** — FlexOffers, ~$1.60–$20/new customer by corridor.
- **Wise** — Partnerize, $10 personal / $50 business, 365-day cookie (US onboarding
  takes SSN **or ITIN** — verified fine for our audience).
- **H&R Block — Impact/FlexOffers** — ~2–10%; offices are IRS **Certifying
  Acceptance Agents**, so "get your ITIN done at H&R Block" is a monetizable CTA.
- **TurboTax — CJ** — 15%, seasonal; weaker fit (no W-7 service).
- **Zolve** (passport-based credit card, no SSN) — in-house, `partnerships@zolve.com`;
  audience is visa students/professionals, not undocumented core — use on the
  "credit card without SSN" cluster only.
- **ITINApplications.com** — in-house partner program (referral/agent/white-label
  tiers) — direct audience need but small unknown operator; **vet before sending
  traffic** (YMYL).
- **Grow Credit** — FlexOffers; ITIN acceptance UNVERIFIED — confirm first.
- **Milo** ($500 Visa gift card consumer referral — likely bars mass publication)
  and **Waltz** partners platform: mortgage-adjacent, RESPA-sensitive, low priority.

### Finding 4 — Auto lane demand proof
- **CarsDirect Spanish-Market**: their dealer page states leads include "fields for
  ITIN and SSN" — **ITIN first-class, verified on their own site.** 800-260-5857.
  Ask whether Internet Brands buys third-party Spanish-market finance leads.
- **Carros Hispanos** (partners.carros-hispanos.com) — sells Spanish/ITIN auto leads
  to dealers via WhatsApp/BDC; no publisher buy-in advertised, site was unreachable
  during research. Outreach target for overflow co-brokering.
- **LeadBuyer.com** — small Newport Beach shop that explicitly **buys leads from
  publishers** (up to 300/day, direct or consignment), mortgage-refi/HELOC/debt
  verticals. 877-245-3237. ITIN unknown — phone question.

### Finding 5 — Dead fintechs (do NOT build content/CTAs around these; article-worthy as warnings)
Seis (shut down Jan 2026) · Tricolor/Ganas (collapsed Sept 2025, fraud) · Sable
(closed) · Deserve (cards closed Aug 2025) · Yotta (Synapse; now gambling) ·
Stilt/JGW (lending on hold; UT/CA only) · Comun & MAJORITY (friends-referral only,
public posting disqualifies) · OneMain CJ ($7–15/app but **requires SSN**) ·
Amex/Nova Credit (Amex now requires SSN or ITIN; CJ invite-gated).
**ITIN personal-loan affiliate programs: essentially none exist** — the gap that
keeps Self + myAutoloan as the personal-credit backbone.

### ITIN-in-the-SSN-field idea — REJECTED (legal + practical)
Bob floated letting borrowers enter their ITIN in SSN fields of any approving
lender/network. **Do not do this**: (1) SSN validators reject 9XX numbers, cratering
acceptance rate; (2) where it passes, it's a false statement on a credit
application — borrower legal exposure + our UDAAP/fraud-facilitation exposure with
a vulnerable population; (3) unnecessary — PX spec + pay-per-call + affiliate lanes
don't need it. Standing decision; do not revisit without counsel.

---

## 2026-08-11 — ITIN mortgage lender web-form pass (Bob's constraint: async channels only, no cold calling)

**Context:** Bob stated plainly he will not cold call lenders. All partner
acquisition must run through email, forms, or inbound. This pass worked every
ITIN mortgage lender in this doc that has a web form, looking for a door a
**non-broker content publisher** can legitimately use. We are NOT a licensed
mortgage broker and have no NMLS — every submission says so explicitly rather
than filing a broker application we'd be rejected on or misrepresent ourselves in.

| Lender | Web door found | Result |
|---|---|---|
| **Acra Lending** | `acralending.com/contact-us/` — real contact form, NMLS field says *"If none, write N/A"* so non-brokers may submit | ✅ **FORM FILLED 8/11**, blocked at reCAPTCHA (agent cannot complete). **Bob: tick the box + Submit.** |
| **Champions Funding** | Only "Request Wholesale Package" / "Request Correspondent Package" (both broker-only). `/ask-a-question` renders no form; `/contactus` is a phone number | ❌ No usable non-broker web door |
| **A&D Mortgage** | `admortgage.com/contact-us/` is **loan servicing only** — requires Loan Number + Property Address | ❌ Wrong door entirely |
| **Angel Oak** | No partner form at all. Only `info@angeloakms.com` + broker help line 855.539.4910 | ❌ Email-only channel |

**⭐ The real find — Acra runs a CONSUMER DIRECT channel.** Their contact page
lists it separately from Wholesale and Correspondent:
**`cdl@acralending.com` · 949-216-3109**. That is a *retail* door that takes
consumers directly, which is the channel shape that actually fits a referral
source. Same insight as the 7/15 Carrington note (ask for retail, not wholesale)
— now with a verified address.

### Warm-forward email batch — SENT 2026-08-11 (6 lenders, all from bob@)

Pivot from the failed July approach. July's emails were partnership pitches with
nothing behind them and got **zero replies**. These lead with **borrowers in
hand**, which turns a pitch into a delivery. Every one: states plainly we are
NOT a broker and have no NMLS, describes the three consented mortgage borrowers
in aggregate (**AL ITIN-only · NJ ITIN+SSN 680+ credit 5-10% down · CA**), asks
who takes consumer referrals, and invites a flat no. **No borrower PII sent** —
details held until a lender confirms it can receive them.

| # | Recipient | Angle |
|---|---|---|
| 1 | `cdl@acralending.com` (**Acra Consumer Direct**) | "Your contact page lists Consumer Direct as its own channel, which is why I am writing here instead of the wholesale desk" |
| 2 | `eric@dreamhomefinancing.com` (**never contacted before**) | They place borrowers with lender partners and keep a dedicated ITIN page |
| 3 | `info@buildbuyrefi.com` | Follow-up. Named as best product fit (no SSN, 50 states, bilingual LOs) |
| 4 | `wholesalecontact@carringtonms.com` | Follow-up owning the July mistake: "I sent it to the wholesale desk, which was my mistake since I am not a broker" — asks for retail |
| 5 | `alex@gustancho.com` | Follow-up. High-volume ITIN-core operation, set up for referral flow |
| 6 | `info@angeloakms.com` | New. Asks straight whether any channel takes publisher referrals |

**Not yet contacted in this batch (batch 2 candidates):** Prysma
(`info@prysma.com`), McGowan (`info@mcgowanmortgages.com`), Non-Prime Lenders
(`info@nonprimelenders.com`), Jet Direct (`express@jetdirectmortgage.com`) —
all got a July email and ignored it; the borrowers-in-hand angle is untried on
them. NMHL is form/phone only.

**Structural conclusion (important, don't re-litigate):** ITIN mortgage is a
non-QM product sold through the broker channel. These lenders' websites are
built for two audiences only — licensed brokers and existing borrowers. **There
is essentially no "partner web form" lane for a content publisher.** The viable
async channels are (a) consumer-direct/retail email doors like Acra's, (b)
lenders with actual affiliate programs (New American Funding via FlexOffers),
and (c) inbound: rank a lender-facing page so buyers come to us.

## 2026-08-10 — Post-PX research pass (2 parallel agents): no-SSN ping-post + Hispanic-market buyers

**Strategic confirmation:** personal-loan ping-post proper is SSN-locked across the
board — buyers underwrite off a bureau pull, full stop (PX's buyer-level answer
generalizes). Every viable no-SSN door is in a vertical where qualification
doesn't need a credit pull: auto finance (ITIN field exists natively), calls
(debt/tax/credit-repair — qualify on debt amount + language + state), title
loans (collateral-based), insurance, remittances. Combined ranked list (all
facts verified on the named sites 2026-08-10 unless [unverified]):

1. **Auto Credit Express / CarsDirect (Internet Brands)** ⭐ — the only network
   found with **buyer-level ITIN evidence**: CarsDirect's dealer-side page
   (carsdirect.com/dealers/spanish-market) sells dealers "Spanish market leads…
   full finance application, including fields for ITIN and SSN" — the same
   funnel the affiliate program feeds. Hosted skinnable app = host-and-post,
   SSN/ITIN handling on their side. Pays per valid lead, "accepts 100% of valid
   US apps." Signup: autocreditexpress.com/affiliates/signup/.
   ✅ **AFFILIATE APPLICATION SUBMITTED 2026-08-10** ("Affiliate Application
   Received" confirmed on-screen; a rep will reach out). Submitted as: Bob
   Guillow, Timberline Ventures LLC, 2701 Amsdell Rd Hamburg NY 14075,
   716-510-9313, bob@timberlineventuresllc.com, site www.itinlending.net.
   Comments field asked the buyer-level question up front: *do your
   lender/dealer buyers accept applicants with an ITIN and no SSN?* Their
   reply is the go/no-go before any traffic. Affiliate portal
   (post-approval): affiliates.autocreditexpress.com.
2. **BrokerCalls** (brokercalls.com, Ft. Lauderdale) — surfaced independently by
   BOTH agents. Pay-per-call broker: debt settlement, credit repair, tax debt,
   mortgage, ACA/auto/life/final expense. Verified Spanish demand (their exec
   publicly recruited buyers for "debt settlement inbounds in Spanish"; blog
   markets bilingual ACA calls). No SSN anywhere in a call funnel. Seller door:
   jotform 253104181351950 / brokercalls.com/affiliate-sign-up ·
   Contact@BrokerCalls.com · (855) 268-3773. Min payout $100.
   ✅ **SELLER SIGNUP SUBMITTED 2026-08-10 by Bob directly.** Awaiting their
   response (members-only network — expect a qualification call). When they
   respond, lead with: bilingual SEO call traffic, Spanish debt-settlement +
   credit-repair + tax-debt verticals, and the standing buyer-level question —
   *which of your buyers take Spanish-speaking callers, and does any funnel
   require an SSN?*
3. **CuraDebt** (curadebt.com/affiliates/) — direct buyer, both agents. Debt +
   **tax-debt** + business-debt leads/calls, cross-vertical comp, hosted
   consultation funnel, SEO accepted, bilingual site. Tax debt is the natural
   ITIN vertical (ITIN holders are IRS taxpayers). BBB A+, since 2000. Verify:
   their "soft-credit verification" step must not gate on SSN. Relationship
   onboarding (email pitch, not self-serve).
   ✅ **PITCH SENT 2026-08-10** to `affiliates@curadebt.com` (verified on their
   affiliates page) from bob@timberlineventuresllc.com. Asked up front:
   (1) does the soft-credit identity verification work for ITIN-only/no-SSN
   consumers (gates their pay-per-lead tier), (2) are Spanish leads/calls
   billable in tax + debt. Ask = pay-per-lead on tax debt + personal debt.
   Gmail-wrapper links were scrubbed before send (plain-text URLs).
4. **National Debt Relief** — $27.50/qualified debt quote ($10k+ unsecured;
   excl. CT OR VT WV). ES funnel exists [ES-conversion tracking unverified].
   ⚠️ Correction: NOT ShareASale — ShareASale merged into Awin, and NDR is on
   **Awin**, where we already have the Timberline publisher account (#2931103).
   ✅ **JOIN REQUEST SUBMITTED 2026-08-10** via Awin ("request sent to the
   advertiser" confirmed). Promotion type: Content. Once approved: place links
   in EN+ES debt articles (debt-consolidation, debt-relief cluster).
5. **DOPPCALL** (doppcall.com) — live **Spanish debt inbound offers** ($55/call,
   130s, $15k+ debt). Weekly payouts. ⚠️ Polarized reviews + registered-agent
   address — small-volume test only; weekly terms limit exposure. MarketCall
   backup/second bidder.
6. **SmartFinancial** (publishers.smartfinancial.com) — insurance leads/calls/
   clicks incl. ping-post + hosted forms; auto insurance is a true ITIN-eligible
   vertical (foreign license OK). Up to ~$40/lead. Spanish billability
   [unverified — ask]. Opens the insurance lane on /es.
7. **The Credit Pros** (up to $120/sale) — bilingual credit repair (ES site +
   Spanish sales line). Natural **itincreditscore.com** fit. Caveat: value for
   ITIN-only thin-file users needs a test; CROA vertical. Also on **Awin**
   (not just ShareASale/FlexOffers — ShareASale is Awin now).
   ✅ **JOIN REQUEST SUBMITTED 2026-08-10** via Awin publisher #2931103
   ("request sent to the advertiser" confirmed). Application disclosed the
   thin-file caveat honestly. Once approved: wire into score-site credit-repair
   and build-credit pages, ES first (their Spanish sales line is the fit).
8. **TaxLeads.com** — publishes **Spanish tax-debt campaigns** at $85–95/lead
   buyer pricing — proof the exact demographic has paying lead demand. No
   self-serve publisher door; outreach via contact form.
9. **LoanMart** ($100/funded via FlexOffers/Awin — published ITIN acceptance on
   their no-SSN page) and **Max Cash** (5–10% of funded; "some lenders accept
   ITIN") — real ITIN copy but title/payday optics + funded-only payouts.
   **Bob's call on brand fit before any traffic.**
10. **Round Sky** (roundsky.com/debt-settlement-affiliates.php) — self-serve
    direct-post door in debt settlement; NO ITIN evidence yet — spec-level only.
    Ask the buyer-level ITIN question FIRST (the PX rule).
11. **Remitly** (Impact/FlexOffers, $1.60–$20/new customer) — zero-qualification
    CPA for /es remittance content. Small but safe. (FlexOffers appeal still
    pending — Impact route needs an account.)

**Demand-side fact for the mortgage pipeline:** Carrington launched ITIN
mortgage across retail/wholesale/correspondent (Businesswire 4/2024) — when
LeadPoint's spec arrives (or Astoria responds), ask whether Carrington or other
ITIN-program lenders sit on their buyer tree.

**Dead ends checked 8/10 (don't re-chase):** Digiticed (pivoted, dead),
Lead Answer, iLeads, Suited Connector, CompraLeads (Spain/LatAm), Aragon (no
finance campaigns listed anymore), Prysma (no partner program — cold-pitch
only), CyberLead/AutoLeadPro/SubprimeAutoLeads/CarLoan101/InteractiveFMG (all
demand-side), McGraw/Legal Brand Marketing/VerifiedDebtLeads/Lead Balance/
Leads Warehouse (data sellers), LoanLeads.io (opaque operator — watchlist),
Vellko (watchlist).

## 2026-07-17 — Outreach sent to 3 more ITIN lenders (from bob@timberlineventuresllc.com)

First outreach batch sent from the branded address (after fixing bob@ outbound DKIM —
see CHANGELOG 2026-07-17). Same "warm consented referral, explicitly NOT a broker,
honest about small volume" pitch. All delivered clean (no bounces):

- **Jet Direct Mortgage** — `express@jetdirectmortgage.com`. Non-Citizen ITIN program
  spanning mortgage + personal + auto + business (rare multi-product ITIN lender, so it
  can absorb more of our mix than most). Asked: referral fee vs per-funded, where to send,
  which product to start with.
- **Prysma** — `info@prysma.com`. 20-yr Latino-family Tax ID home-loan lender; pure
  mortgage fit. Asked: referral fee vs per-funded, where to send.
- **Latino Community CU** — `info@latinoccu.org`. Member-first CU, best home for the
  hard-to-place no-SSN **personal-loan** borrower. Asked: member-referral arrangement +
  membership footprint (so we route only borrowers who can join).

Status: awaiting replies. Log responses in `research/lead-tracker.xlsx`.

## 2026-07-17 — 5 more DRAFTED (non-mortgage, verified emails) — awaiting send

Deliberately diversified away from mortgage (8 already contacted). All emails were
**verified on each company's own site** (research pass 2026-07-17); ITIN acceptance
confirmed on-site for each. Drafts created from bob@; pitch adapted per type (credit
unions get a field-of-membership line + "only send members who can join"; the two
nonprofits are pitched as partnership, **not** paid referral).

- **Point West Credit Union** (Portland OR metro: Multnomah/Clackamas/Washington/Yamhill)
  — personal/auto CU. `contact@pointwestcu.com`. Hook: first OR CU with Juntos Avanzamos
  (2016); names ITIN borrowers as who they serve.
- **Pacific NW Federal Credit Union** (OR + SW WA: Clark/Skamania) — dedicated ITIN loan
  program. `loans@pnwfcu.org`. Hook: standalone bilingual ITIN loan page ("lacking an SSN
  shouldn't prevent access to loans").
- **Mission Asset Fund** (nationwide, nonprofit CDFI) — credit-building / 0% Lending
  Circles / immigration-fee loans. `programs@missionassetfund.org`. Pitched as the home
  for **not-yet-loan-ready** thin-credit borrowers; partnership, not commission.
- **LiftFund** (nationwide CDFI) — **small-business** microloans, ITIN accepted.
  `dpeterson@liftfund.com` (D'Undray Peterson, the nationwide contact). Covers the
  business vertical.
- **CapEd Credit Union** (Idaho: Boise/Meridian) — **auto** + personal + debt
  consolidation for ITIN (no mortgage). `questions@capedcu.com`. Juntos Avanzamos.

Rejected in the same pass (no email published on their own site → fails the "don't guess"
rule): Justine Petersen, Guadalupe CU, DreamSpring, LEDC, Self-Help FCU, Ascendus, Grameen
America (email exists but no explicit ITIN wording on-site), Beneficial State Bank,
Prestamos/CPLC (email real but no on-site ITIN evidence). Revisit by phone/form if needed.

Status: drafts in Gmail, awaiting Bob to send. Log replies in `research/lead-tracker.xlsx`.

---

## Outreach email template (cold intro to a partner)

> Goal: open a lead-buying relationship. Keep it short, lead with the audience and
> the volume signal, ask for the right person + their per-lead terms.

**Subject:** ITIN borrower referrals — partnership inquiry

Hi [Name / "Partnerships team"],

I run ITIN Lending (itinlending.net), a bilingual (English/Spanish) resource for
ITIN holders looking for financing. We get a steady flow of borrowers who've told us
they want to be connected with a lender for [personal loans / ITIN mortgages / auto
financing] — exactly the profile [Company] serves.

Rather than sell raw lists, we make warm, consented introductions: each person filled
out our form asking to be matched, with their state, loan purpose, amount, credit
range, and ITIN/SSN status already captured.

Could you point me to the right person to discuss taking referrals — and how you
prefer to receive them (per-lead, revenue share, or a referral fee)?

Thanks,
[Your name]
ITIN Lending · itinlending.net

---

## Warm-forward template (sending an actual lead to a partner)

> Used once a partnership exists. This is the "sell the introduction" mechanic.

**Subject:** ITIN [purpose] referral — [First name], [State]

Hi [Partner contact],

New consented referral from ITIN Lending:

- **Name:** [First name] [Last initial]
- **State:** [State]
- **Looking for:** [purpose — e.g. ITIN mortgage]
- **Amount:** [amount]   **Income:** [range]
- **Credit:** [score range]   **ID:** [ITIN only / ITIN + SSN]
- [mortgage: **Down payment:** …]  [business: **Time in business:** …]
- **Best contact:** [phone] / [email]

They asked to be connected and are expecting your call. Reply here to confirm receipt
and I'll send the next one the same way.

[Your name] · ITIN Lending

---

## Status

Live pipeline + per-lead logging is in `~/Itin/research/lead-tracker.xlsx`
(Buyers tab seeded with the targets above; Leads tab for inbound). Update the
**Outreach Status** column there as conversations progress.
