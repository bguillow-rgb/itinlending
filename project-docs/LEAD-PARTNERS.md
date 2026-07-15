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

## Delivery automation status (2026-07-15)

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
- **Oportun** — ITIN loans $300–$10k nationwide; origination partner Pathward
  (extended through 2029). Channel: partner inquiry via oportun.com. ITIN: yes.
- **Apoyo Financiero** — Spanish-first installment lender, strong `/es` audience fit.
  Public: `contactus@apoyofin.com` / 800-891-2778. ITIN: yes.
- **Lendmark Financial** — branch-based installment lender. Channel: lendmark.com
  contact form. ITIN: confirm.

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
- **Carrington Wholesale** *(top pick)* — ITIN program across retail/wholesale/
  correspondent (launched Apr 2024), nationwide, NMLS #2600. **Verified:**
  `wholesalecontact@carringtonms.com` / 866-453-2400 ·
  carringtonwholesale.com/become-approved.
- **BuildBuyRefi** (The Federal Savings Bank) — ITIN home loans up to 89.99% LTV,
  no SSN, all 50 states, bilingual LOs. **Verified:** `info@buildbuyrefi.com` /
  844-999-0639 · nationwidehomeloansgroup.com/preferred-partners.
- **Gustan Cho Associates** (NEXA affiliate) — ITIN core product, high-volume lead
  model. **Verified:** `alex@gustancho.com` / 800-900-8569.
- **McGowan Mortgages** — ITIN mortgage **and** ITIN personal-loan content, ~40
  states. **Verified:** `info@mcgowanmortgages.com` / 816-631-9687.
- **Non-Prime Lenders** (DBA United Mortgage Corp, NMLS #1330) — originates **and**
  matches ITIN loans. **Verified:** `info@nonprimelenders.com` / 732-761-9041.
  ⚠️ Shares NMLS #1330 + phone with Dream Home Financing — treat as one buyer group.
- **NMHL (National Mortgage Home Loans)** — programmatic ITIN-by-state pages,
  nationwide. **Form/phone:** nmhl.us/contact / 248-864-2200.

### Ping-post buyers / lead networks (supply-side — they buy leads FROM publishers)
- **RGR Marketing** — performance-marketing lead-gen co., El Segundo CA, since 2004
  (founders Matt Schaub, Silas Ellman). Buys mortgage/auto/solar/debt leads from
  publishers; real-time POST / ping-post. **Verified (own contact page):** supply
  door `affiliate@rgrmarketing.com`; sales Jeff Stillitano `jeff@rgrmarketing.com`
  / 877-272-4600; `info@rgrmarketing.com` / 310-540-8900. Intermediary, not the end
  lender — confirm their panel funds ITIN before sending volume.
  **Outreach: SENT 2026-07-15** to `affiliate@rgrmarketing.com` — awaiting reply.
- **Lead Buyer Hub** — lead marketplace, Las Vegas, founded 2019 (CEO Nir Algazy).
  Insurance/finance/education; exclusive leads + inbound calls + live transfers via
  API; self-serve affiliate program for suppliers. **Verified (own contact page):**
  `info@leadbuyerhub.com` / (833) 616-0574 / (702) 850-5488; use the **Affiliate
  Sign-up** at leadbuyerhub.com/contact (the main form is buyer-facing). Intermediary
  — confirm ITIN funding first.
  **Outreach: SENT 2026-07-15** to `info@leadbuyerhub.com` — awaiting reply.

### New prospects — 2026-07-15 research pass (contacts verified on each company's own site)

> Cross-cutting caveat: every personal-loan buyer below collects **SSN at post**
> (lenders bid off a soft pull). None publicly advertise ITIN/no-SSN acceptance, so
> they're primarily for your **SSN-holder** leads — ITIN-in-the-SSN-field must be
> asked of each rep. The two that also do **mortgage** (LeadPoint, PX) take those
> with no SSN at post. This is the #1 onboarding question for all of them.

- **LeadPoint** *(top new pick)* — real-time lead **exchange**, mortgage + personal.
  Publishers **self-serve sign up as sellers**, paid biweekly, no SSN at post (mortgage).
  ✅ **Signup verified live 2026-07-15:** `leadpoint.com/sellersignup/` (name+email
  interest form → they follow up) · 866-832-8156 / 310-209-8600.
- **PX (px.com)** *(best API docs)* — open **ping-post** exchange, personal +
  mortgage. Ping phase is ZIP+IP only (no PII); PII on the post. Many-buyers model is
  the most flexible for an unusual (ITIN) lead shape. Publisher intake form ·
  **(949) 313-7099** · leads.px.com/publishers-new-landing-page · API docs at
  api.px.com/v2/verticals/personal-loans.
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
  CJ account. No SSN at post. ✅ **Verified live 2026-07-15:** CJ branded signup
  `signup.cj.com/member/brandedPublisherSignUp.do?air_refmerchantid=1390130`
  (CJ merchant id **1390130**); Impact `app.impact.com/.../myAutoloan.brand`.
- **Auto Credit Express (ACE)** *(best subprime/ITIN fit)* — largest subprime auto
  lead gen since 1998, "accepts 100% of valid US apps," skinnable hosted form,
  **Spanish-language special-finance line**. ✅ **Signup verified live 2026-07-15:**
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
- ~~Quantum Lending Solutions / Camino~~ — **REMOVED, verified dead 2026-07-15**
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

### ⚠️ Avoid / not a fit (2026-07-15)
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

> **Camino Financial — DEAD for lead sales (verified live 2026-07-15).** Camino
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
