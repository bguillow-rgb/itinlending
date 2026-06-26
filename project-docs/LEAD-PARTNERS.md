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
| Business | (research in progress — ITIN business lenders/CDFIs) |

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

> Dead lead removed: **Camino Financial** — merged/defunct, no longer taking apps.

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
