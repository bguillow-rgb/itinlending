# Lead capture & sale: what's allowed, by product

**Researched 2026-08-11 with primary sources. Supersedes the first draft of this file, which was
wrong in a way that mattered — see "Corrections" at the bottom.**

Not legal advice. This is a risk memo to hand an attorney, not a clearance.

---

## The one-screen answer

| Product | Collect via on-site form + **sell for a fee** | Paid **click-out** (no form) | Free referral (no fee) |
|---|---|---|---|
| **Mortgage** | ❌ **Stop.** Licensing + RESPA | ❌ **Also captured** (CT prong C) | ✅ No compensation, no trigger |
| **Personal / consumer loan** | ⚠️ **Stop & get counsel.** CSO / loan-broker acts | ✅ Likely fine, unverified | ✅ |
| **Credit card** | ⚠️ Lightest of the four; still get it blessed | ✅ Standard industry practice | ✅ |
| **Auto loan** | ⚠️ Same family as personal; TX title-loan trap | ✅ Likely fine, unverified | ✅ |

**The trigger in nearly every statute is compensation, not the sale.** Connecticut catches you at
*"generates or augments one or more leads."* Texas at *"providing advice or assistance."* Maine at
*"arranging for or obtaining an extension of credit."* Remove the money and most of this evaporates.

**Our six biggest lead states are among the strictest:** CA (7), NY (5), TX (5), FL (4), MD (4), NJ (4).

---

## Where the line actually sits

Bressler, Amery & Ross draw it more clearly than anyone else found:

> **Advertising** is "a passive activity. An online publication may display a lender's interest rates
> or message, and they even may include a way for borrowers to contact the lender directly… doesn't
> require licensing."
>
> **Lead generation** is "when a person visits a website that offers rate quotes… and asks the potential
> borrower to **complete a short online application**, and if that application culminates in the lead
> generator **transmitting it to a lender or broker and receiving a fee**, an argument easily could be
> made that the transaction enters into the realm of a **licensed activity**."

Most states define broker activity with the verbs *"soliciting, processing, placing, negotiating,
assisting"* — and **"soliciting" and "assisting" are the most common triggers**.

Our `/apply` form collected name, phone, email, state, loan amount, credit band, income, down payment
and ITIN status, then graded it and planned to route it to lenders for a fee. **That is the second
paragraph, not the first.**

---

## Q1 — Mortgage: two independent bars

**Connecticut licenses lead generators outright** (Conn. Gen. Stat. §§ 36a-485 to 36a-498f, 36a-498h;
mandatory since 2018-01-01). A "lead generator" is anyone who, *for or with the expectation of
compensation or gain*:

> (A) sells, assigns or otherwise transfers one or more leads for a residential mortgage loan;
> **(B) generates or augments one or more leads for another person**; or
> **(C) directs a consumer to another person for a residential mortgage loan by performing marketing
> services, including, but not limited to, online marketing, direct response advertising or telemarketing.**

Read prong (C) twice. **For mortgage, a paid click-out with no form is captured.** That is unusually
broad and it is the single most important sentence in this document.

CT's Department of Banking has already entered a **consent order against an unlicensed mortgage
lead-generation company**.

**RESPA §8** (12 U.S.C. §2607) stacks on top: no fees for referring settlement-service business.
**Criminal exposure up to $10,000 and one year per violation**, plus treble civil damages. CFPB's
position is that paying for activity that goes beyond the simple provision of a lead — anything
influencing the consumer's choice of provider — is an improper referral payment.

**The comparable that settles it:** LendingTree describes itself as *"a marketing lead generator and
duly licensed mortgage broker"* — NMLS #1136, state broker licenses incl. CA #6037234, CT #4164.
Bankrate publishes a state-licenses page. **They collect what we collected because they are licensed.**

**Call: Stop.** No form, no paid CTA, no sale. We hold 3 mortgage leads
(`fd3af37c…` CA 7/13, `78172a7b…` NJ 7/14, `3ac8f3fd…` AL 8/6). Segregate; do not sell.

---

## Q2 — Personal / consumer loan: the one worth paying to answer

RESPA drops out entirely. State licensing does not.

- **Texas** — Credit Services Organization Act (Tex. Fin. Code ch. 393). A CSO is anyone who, for
  valuable consideration, provides *"(B) obtaining an extension of consumer credit for a consumer; or
  **(C) providing advice or assistance to a consumer with regard to** (A) or (B)."* Registration +
  surety bond via Secretary of State.
- **Maryland** — Credit Services Businesses Act. **Maryland courts have held the licence requirement
  applies to businesses that assist consumers to obtain loans (i.e. brokering).** The Commissioner of
  Financial Regulation has charged a fintech for *"providing advice and/or assistance to consumers with
  regard to obtaining loans."* Private right of action: actual damages + costs + fees.
- **Louisiana** — loan broker = anyone who *"for compensation or the expectation of compensation obtains
  or offers to obtain a consumer loan from a third party."* $25,000 surety bond.
- **Maine** — loan broker includes *"providing advice or assistance to a consumer regarding the
  procurement of consumer credit."*

Whether a bare form clears "advice or assistance" is **genuinely unsettled and fact-specific**. Ours
collected income, credit band and loan amount and AI-graded the lead. That reads closer to assistance
than to a banner.

**This is where the volume is: 21 of 51 leads.** It is the question worth buying an answer to.

**Call: Stop & get counsel before selling.**

---

## Q3 — Credit card: lightest of the four

No RESPA analogue. Card issuers carry the regulatory obligations. The broker/CSO statutes are drafted
around *obtaining an extension of credit for* a consumer and *procurement of consumer credit* — a card
application the consumer submits to the issuer fits awkwardly. This is why credit-card affiliate
marketing is everywhere among unlicensed publishers.

Two live constraints: **TX and MD CSO acts are broad enough to reach "advice or assistance" regarding
any extension of consumer credit** — don't assume cards are carved out. And the **FTC has actively
pursued lead generators for deceptive ads**, with CFPB asserting authority over third-party service
providers; everyone in the chain is potentially liable.

**Call: Tighten.** The most likely of the four to survive review, especially as click-out.

---

## Q4 — Auto loan: same family, one Texas trap

Loan-broker regime as Q2, generally narrower because auto lending is dealer-mediated.

**Texas trap:** CSOs assisting with **vehicle title loans** become "credit access businesses" needing an
additional **OCCC licence** on top of Secretary of State registration.

**Call: Tighten / counsel**, bundled with Q2.

---

## Who can actually come after us

| Who | Probability | What it looks like |
|---|---|---|
| **State regulators** (CT DOB, MD OFR, TX OCCC, CA DFPI, NY DFS) | Highest | Cease-and-desist, fines, restitution, consent order |
| **Private plaintiffs** | Real | MD CSB Act = actual damages + fees; TCPA = $500–1,500/call |
| **CFPB / FTC** | Low at our size | Whole-chain liability theory |
| **Counterparties** | **Already happened** | BuildBuyRefi (fed-chartered bank) refused us over exactly this, 2026-08-11 |

---

## The three structural fixes, cheapest first

1. **Free referral.** Every statute above triggers on *compensation or expectation of gain*. No fee,
   no expectation, no trigger. Monetizes nothing, but it's clean and it helps the borrower.
2. **Click-out only, no form.** Passive display + link to a licensed party. Squarely advertising —
   **except mortgage**, where CT prong (C) reaches it anyway. This is already what our Credit Karma
   (AWIN), MarketCall and myAutoloan links are.
3. **Sell to a licensed aggregator** rather than direct to loan officers. Reduces, doesn't erase, the
   seller-side question. Note: **PX closed to us 2026-08-08 — all their buyers require an SSN**, so this
   route is currently theoretical for ITIN-only leads anyway.

---

## Next step, and it may be free

**Several states issue written guidance on a specific business model on request.** Connecticut's DOB
publishes an opinion on lead-generation activity requiring licensure and lists a named contact
(**Dan Landini, daniel.landini@ct.gov, 860-240-8102**). Ask the regulator before hiring anyone.

If counsel is needed, **scope it to one question**: *does a compensated on-site lead form for
non-mortgage consumer credit require CSO / loan-broker licensing in CA, NY, TX, FL, MD, NJ?*
That's a $2,000–5,000 memo. **Mortgage needs no opinion — the answer is already no.**

---

## Corrections to the record

Two things in this repo's history were wrong and are corrected here:

1. **"Collecting lead data is legal and routine" — WRONG for mortgage, and overstated generally.**
   That claim (mine, 2026-08-11, earlier in the day) generalised from consumer-privacy law to what is
   a specifically licensed activity. Collecting a mortgage inquiry for compensation is a licensing
   trigger in CT and plausibly elsewhere. **The parallel session that stripped the lead forms
   (`e1ffa9a`, 2026-08-11) was right to do it.**
2. **"LendingTree/Bankrate/NerdWallet do exactly this, so we can too" — backwards.** They hold mortgage
   broker licences. The comparable argues *against* us, not for us.

**BuildBuyRefi's compliance email (2026-08-11) was substantially correct** on the licensing point,
though it overstated two things: the trigger is compensation rather than collection as such, and
"fines in the millions" is not the realistic exposure on 3 leads with $0 received. Their free-referral
offer is consistent with the statute — compensation is what bites.

**Where we stand today: no fee ever received, no lead ever sold, forms already down. The exposure was
prospective, not incurred.**

---

## Sources

- [Bressler, Amery & Ross — Lead Generation in Financial Services: Let Both the Buyer and the Seller Beware](https://www.bressler.com/news-lead-generation-in-financial-services-let-both-the-buyer-and-the-seller-beware)
- [CT DOB — Lead Generator Licensing in Connecticut](https://portal.ct.gov/DOB/Consumer-Credit-Licensing-Info/Consumer-Credit-Licensing-Information/Lead-Generator-Licensing-in-Connecticut)
- [Weiner Brodsky Kider — Connecticut Requires Licensure of Lead Generators](https://www.thewbkfirm.com/industry/connecticut-requires-licensure-lead-generators)
- [Sheppard Mullin — Connecticut Penalizes Unlicensed Mortgage Lead Generation Activity](https://www.sheppard.com/insights/blogs/connecticut-penalizes-unlicensed-mortgage-lead-generation-activity)
- [Conn. Gen. Stat. §36a-488 (Justia)](https://law.justia.com/codes/connecticut/2018/title-36a/chapter-668/section-36a-488/)
- [Tex. Fin. Code ch. 393 — Credit Services Organizations (Justia)](https://law.justia.com/codes/texas/2005/fi/005.00.000393.00.html)
- [Maryland OFR — Credit Services Businesses](https://www.dllr.state.md.us/finance/industry/creditserv.shtml)
- [Chapman & Cutler — Maryland Court Decision: Impact on Consumer Marketplace Lenders](https://www.chapman.com/publication-Maryland-Court-Consumer-Marketplace-Lending)
- [Orrick — Maryland Allegation of Unlicensed Lending](https://www.orrick.com/en/Insights/2022/05/Federal-Court-Says-State-Bank-Fintech-Partner-Must-Face-Marylands-Allegation-Of-Unlicensed-Lending)
- [Louisiana OFI — Consumer Loan Brokers](https://ofi.la.gov/non-depository/consumer-loan-brokers/)
- [Maine Bureau of Consumer Credit Protection — Loan Broker FAQs](https://www.maine.gov/pfr/consumercredit/industry/licensing/loan_broker/faq.htm)
- [Venable — Government Puts Squeeze on Lead Generation Marketing](https://www.venable.com/insights/publications/2016/03/government-puts-squeeze-on-lead-generation-marketi)
- [Holland & Knight — CFPB Issues New RESPA Section 8 FAQs](https://www.hklaw.com/en/insights/publications/2020/10/cfpb-issues-new-respa-section-8-faqs)
- [Mayer Brown — CFPB Addresses RESPA Compliance for Digital Comparison-Shopping Platforms](https://www.mayerbrown.com/en/insights/publications/2023/02/cfpb-addresses-respa-compliance-for-digital-comparisonshopping-platforms)
- [LendingTree — advertising disclosures & state licences](https://www.lendingtree.com/legal/advertising-disclosures/?disclosures=100)
- [Bankrate — state licences](https://www.bankrate.com/licenses)

---

**Not legal advice — get a consumer-finance regulatory attorney for the six-state CSO / loan-broker
licensing question before restarting any compensated lead form. Nothing here is privileged.**
