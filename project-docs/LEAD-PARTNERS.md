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
