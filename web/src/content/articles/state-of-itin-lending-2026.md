---
title: "State of ITIN Lending 2026: Data, Lenders & New Rules"
description: "Our 2026 ITIN lending report: fresh HMDA numbers, who is still lending, and what the new Treasury rules and IRS data sharing mean for ITIN borrowers."
tier: flagship
targetQuery: "state of ITIN lending 2026"
relatedQueries:
  - "ITIN mortgage statistics 2026"
  - "how many ITIN loans are made each year"
  - "ITIN executive order banks 2026"
  - "IRS ICE data sharing ITIN"
  - "ITIN lending market size"
quickAnswer: "About 5,000 to 6,000 ITIN mortgages get made each year against roughly 5 million active ITINs, by the best available estimates. Twelve named lenders on our list ran ITIN programs in July 2026. A May 2026 executive order directs Treasury to propose new bank due diligence rules that flag ITIN use, with a proposal due around mid-August."
publishedAt: "2026-07-18"
author: "Research Desk"
category: "Research"
relatedSlugs:
  - "itin-auto-loan-lenders"
  - "itin-loans-california"
  - "itin-loans-florida"
  - "itin-mortgage-lenders"
faqs:
  - q: "How many ITIN mortgages are made each year?"
    a: "Nobody counts them officially. The Urban Institute estimated 5,000 to 6,000 ITIN mortgages originated in 2023, against a potential market it sized at 73,000 to 88,000 loans a year if the barriers came down. HMDA, the federal mortgage database, has no ITIN field, so every published number is an estimate."
  - q: "Does the government track ITIN loans?"
    a: "No. HMDA records ethnicity, income and loan outcomes, but not whether the borrower used an ITIN or a Social Security number. That is why this report triangulates from IRS filer counts, lender program lists, and independent estimates instead of quoting a single official figure."
  - q: "Is it still legal for banks to lend to ITIN holders in 2026?"
    a: "Yes. No federal law bars lending to a person with an ITIN, and none of the 2026 actions changed that. The May 2026 executive order directs Treasury to propose new due diligence rules, and a proposal only becomes binding after public comment and finalization. Some lenders may tighten on their own before then."
  - q: "What does the May 2026 executive order actually do?"
    a: "Executive Order 14406, signed May 19, 2026, directs Treasury to scrutinize financial activity tied to people without work authorization. It names ITIN-based credit and account opening as an area for enhanced due diligence and gave Treasury 90 days, until about mid-August 2026, to propose changes to Bank Secrecy Act customer due diligence rules. It did not ban ITIN lending or ITIN bank accounts."
  - q: "Did the IRS really share taxpayer data with ICE?"
    a: "Yes. Under an April 2025 agreement, the IRS disclosed 47,289 taxpayer last-known addresses to ICE, per a Congressional Research Service summary of the litigation. Federal judges in Washington and Massachusetts have since limited both the sharing and the use of that data, with one ruling that roughly 42,695 disclosures violated taxpayer privacy law. Appeals were still pending as of spring 2026."
  - q: "Where are most ITIN mortgages made?"
    a: "Texas, California, and Florida. Those three states led the country in mortgage lending to Hispanic or Latino borrowers in 2024, at 122,559, 106,624, and 102,590 originated loans in our HMDA pull, and they are where most named ITIN lenders concentrate their programs. Arizona and Illinois follow."
  - q: "Will this report be updated?"
    a: "Yes. This is a quarterly series. Each edition re-runs the same public data pull, rechecks the lender list, and updates the regulatory section. The next edition lands in October 2026, and it should be able to include whatever Treasury proposes in August plus any movement in the IRS data-sharing appeals."
published: true
---

**How we built this report:** We pulled mortgage data from the public HMDA data browser API on July 18, 2026, then re-verified every regulatory claim against primary documents and cross-checked market estimates against named published sources. HMDA has no ITIN field, so we never present HMDA numbers as ITIN loan counts. The full methodology, including what we cannot know, is at the bottom. No lender paid for placement.

---

Nobody in the federal government counts ITIN loans. Not HMDA, not the CFPB, not the IRS. So every year this market runs on guesses, and in 2026 the guessing got harder because the rules started moving. This report pulls together what can actually be verified: the public mortgage data for the markets ITIN lenders serve, the lender list we maintain, the IRS numbers on who holds an ITIN, plus the federal actions this year that could reshape all of it.

## Key findings

- The Urban Institute's estimate, still the only credible one, puts ITIN mortgage originations at 5,000 to 6,000 loans in 2023, against a potential market of 73,000 to 88,000 loans a year.
- The IRS has issued about 31 million ITINs since 1996. Roughly 5 million were active as of October 2025, per a March 2026 TIGTA audit.
- Hispanic or Latino borrowers took 11.1% of all US mortgage originations in 2024, a record share, up from 8.5% in 2019. The overall market shrank 34% over that stretch; lending to these borrowers fell just 13%.
- Denial rates for Hispanic or Latino applicants hit 31.8% in 2024 in our HMDA pull, up from 21.7% at the 2021 low.
- Twelve named lenders and credit unions on our tracked list ran active ITIN mortgage programs as of July 2026. We found no exits this year.
- Executive Order 14406, signed May 19, 2026, gives Treasury 90 days, until roughly mid-August, to propose bank due diligence changes. A joint FinCEN advisory issued June 5 lists 18 red-flag indicators and names ITIN-based account opening as a possible trigger for enhanced due diligence.
- The IRS disclosed 47,289 taxpayer addresses to ICE under an April 2025 agreement. Two federal injunctions now limit the program while appeals run.

## How many people hold an ITIN in 2026?

The IRS issues an Individual Taxpayer Identification Number to people who owe US taxes but do not qualify for a Social Security number. A March 2026 audit by the Treasury Inspector General for Tax Administration ([TIGTA report 2026-400-016](https://www.tigta.gov/sites/default/files/reports/2026-03/2026400016fr.pdf)) counted about 31 million ITINs issued since the program started in 1996, roughly 5 million of them still active as of October 2025, with 469,888 new ITINs issued in 2025. ITINs expire after three straight years of non-use, which is why the active count sits so far below the issued total.

Active numbers and tax filings are different things. The IRS National Taxpayer Advocate's [2024 research study](https://www.taxpayeradvocate.irs.gov/wp-content/uploads/2024/12/ARC24_RR_Research_3.pdf) found about 3.8 million returns filed for tax year 2022 with at least one ITIN on them, reporting $14.4 billion in taxable income. California alone had 866,378 ITIN filers that year, the most of any state.

The money involved is not small. The Institute on Taxation and Economic Policy [calculated](https://itep.org/undocumented-immigrants-taxes-2024/) that undocumented immigrants, most of whom use ITINs when they file, paid $96.7 billion in US taxes in 2022. That included $25.7 billion into Social Security, a program most ITIN filers cannot draw from.

One housekeeping note on our own numbers. Our homepage has long cited 5.8 million ITINs, which came from a December 2023 TIGTA report counting active ITINs at the end of 2022. The fresh count of about 5 million active is the better number now, and it is the one this report uses.

## How many ITIN mortgages actually get made?

Here is the honest answer: nobody knows precisely, and anyone quoting an exact figure is guessing. The best independent estimate comes from the Urban Institute, whose [February 2024 study](https://www.urban.org/research/publication/itin-mortgages) put ITIN mortgage originations at 5,000 to 6,000 loans in 2023. The same study sized the potential market at 73,000 to 88,000 loans a year if the structural barriers came down. That gap, more than tenfold, is the most important number in this niche.

Why so wide? The secondary market. Fannie Mae and Freddie Mac generally do not buy ITIN loans, and FHA will not insure a loan without proof of eligible residency. So lenders must hold ITIN mortgages on their own books or sell them to specialty investors, which caps volume and raises rates. National Mortgage News, citing the Filene Research Institute, has [reported](https://www.nationalmortgagenews.com/list/itin-mortgage-originators-tout-growing-market-in-a-low-volume-era) an addressable market of over 21 million underbanked customers, and Filene's survey found 76 of the 108 credit unions it polled offered some form of ITIN loan.

No published source estimates annual ITIN mortgage volume in dollars. Applying the typical loan sizes our lender guides document to Urban's unit estimate suggests something on the order of $1.5 to $2 billion a year. That is our own back-of-envelope arithmetic and nothing more. Against a $2 trillion total origination market, ITIN lending is a rounding error with outsized human stakes.

## What does the mortgage data show in ITIN-heavy markets?

HMDA does not flag ITIN loans, so we track the next best thing: mortgage outcomes for Hispanic or Latino borrowers, the group demographic research consistently identifies as the large majority of ITIN holders. Treat these as market context for where ITIN lenders operate. They are not ITIN loan counts.

We pulled these figures ourselves from the [FFIEC HMDA data browser API](https://ffiec.cfpb.gov/data-browser/) on July 18, 2026.

| Year | Loans originated | Dollar volume | Share of all US originations | Denial rate* |
|---|---|---|---|---|
| 2019 | 792,961 | $185.0B | 8.5% | 28.8% |
| 2020 | 1,153,417 | $298.2B | 7.9% | 23.3% |
| 2021 | 1,328,758 | $362.9B | 8.8% | 21.7% |
| 2022 | 794,960 | $220.4B | 9.4% | 30.4% |
| 2023 | 595,141 | $159.3B | 10.4% | 34.3% |
| 2024 | 689,004 | $193.8B | 11.1% | 31.8% |

*Denied applications as a share of originations plus denials. Withdrawn and incomplete files excluded. Hispanic or Latino borrowers only.

Two things stand out. First, the resilience. Total US originations collapsed from 9.3 million loans in 2019 to 6.2 million in 2024, down 34%, while lending to Hispanic or Latino borrowers fell only 13%. Their share of the market climbed every year after 2020 and hit a record 11.1% in 2024. NAHREP's [2025 State of Hispanic Homeownership Report](https://nahrep.org/downloads/2025-state-of-hispanic-homeownership-report.pdf) shows the demand behind that: Hispanic households accounted for 92.6% of US household formation growth in 2025 and reached 10.2 million homeowner households, a record, even as the Hispanic homeownership rate slipped to 48.5%.

Second, the squeeze. Denial rates for these borrowers jumped ten points from the 2021 low, reaching 31.8% in 2024. Some of that is rates and prices. Some of it is the credit box tightening exactly where ITIN borrowers live: thin files, self-employment income, cash-heavy earnings.

The state picture matches where ITIN programs concentrate:

| State | Loans originated (2024) | Dollar volume | Share of state originations | Denial rate* |
|---|---|---|---|---|
| Texas | 122,559 | $30.3B | 24.8% | 33.5% |
| California | 106,624 | $39.2B | 20.9% | 30.9% |
| Florida | 102,590 | $33.0B | 21.5% | 33.6% |
| Arizona | 34,033 | $9.2B | 20.3% | 27.9% |
| Illinois | 26,956 | $5.8B | 13.0% | 29.9% |
| Georgia | 16,529 | $4.5B | 7.3% | 28.9% |
| North Carolina | 17,435 | $4.3B | 6.8% | 29.7% |
| New York | 15,376 | $5.5B | 7.4% | 37.2% |

*Same definition as above. Hispanic or Latino borrowers only.

In Texas, one mortgage in four now goes to a Hispanic borrower. That is the demand pool ITIN lenders fish in, and it explains why nearly every named ITIN program leads with Texas, California, and Florida.

## Who is still making ITIN mortgages in 2026?

Our [lender guide](/articles/itin-mortgage-lenders-approved) tracks twelve institutions with active, publicly documented ITIN mortgage programs as of July 2026: Guild Mortgage, New American Funding, BuildBuyRefi, Angel Oak Loan Solutions, A&D Mortgage, Carrington Mortgage, ACC Mortgage, IDB Global Federal Credit Union, Dream Home Financing, First Financial Bank in Texas, plus the Resource One and Red River credit unions. We recheck program pages when we update that guide. Nobody on the list exited this year that we can find, and Angel Oak told investors in January that it scaled its non-QM operation through 2025.

Terms have held steady. Down payments run 10% to 20%, minimum scores cluster around 620 or alternative credit, and pricing sits 1% to 3% above conventional. A loan officer quoted by National Mortgage News in June 2026 put the current premium at 1.5 to 2 percentage points with 20% down, which matches what the program pages show. With Freddie Mac's 30-year average at [6.55% in mid-July 2026](https://www.freddiemac.com/pmms), typical ITIN mortgage pricing lands around 8% to 9%. Our [rates guide](/articles/itin-mortgage-rates) tracks this in more detail.

The tailwind is the non-QM boom. BofA Securities projects non-QM production will hit $175 billion in 2026, up from $108 billion in 2025, per [HousingWire](https://www.housingwire.com/articles/non-qm-originations-175b-2026/). Polygon Research, working from HMDA proxies, sizes the 2025 non-QM market far larger, at $239 billion and 10.2% of all originations. The definitions differ and nobody reconciles them, but either way the channel that carries ITIN loans is growing. No source we can find estimates ITIN lending's share of it.

One policy change fed the pipeline. In March 2025, FHA [ended eligibility for non-permanent residents](https://www.consumerfinancemonitor.com/2025/03/31/hud-reverses-course-and-eliminates-eligibility-of-non-permanent-u-s-residents-for-fha-loans/), effective that May. Borrowers who once had an FHA path, including DACA recipients, now land in the same non-QM channel as ITIN borrowers, with the same higher down payments and rates.

## What do the new federal rules mean for ITIN borrowers?

We rewrote this section more times than any other, because this is where fear tends to outrun fact. Here is what actually happened in 2026, in order, from primary documents.

**May 19: the executive order.** The President signed [Executive Order 14406, "Restoring Integrity to America's Financial System"](https://www.federalregister.gov/documents/2026/05/22/2026-10400/restoring-integrity-to-americas-financial-system), published in the Federal Register on May 22. It directs financial regulators to scrutinize six categories of activity linked to people without work authorization. The sixth category is "use of an individual taxpayer identification number (ITIN) to obtain credit products or open depository accounts where the applicant lacks verified lawful immigration status." The order sets three Treasury deadlines: a red-flags advisory within 60 days, proposed changes to Bank Secrecy Act customer due diligence rules within 90 days, which lands around mid-August 2026, plus a review of customer identification requirements, including foreign consular IDs, within 180 days.

**June 5: the FinCEN advisory.** FinCEN, jointly with the FDIC, OCC and NCUA, issued [advisory FIN-2026-A002](https://www.fincen.gov/system/files/2026-06/FinCEN-Advisory-Non-Work-Authorized-Populations.pdf). It lists 18 red-flag indicators across three groups: individual customers, large companies, and small companies in agriculture, construction, domestic service, hospitality, and staffing. Several indicators involve ITIN-opened accounts paired with patterns like structured cash withdrawals or heavy foreign remittances. The advisory carries a section titled "Enhanced Due Diligence for ITINs," which says presenting an ITIN in place of an SSN "may be identified as a risk factor requiring enhanced due diligence," and it asks banks filing related suspicious activity reports to tag them FINANCIALINTEGRITY-2026-A002. The same advisory states plainly that its red flags "do not convey or alter any independent regulatory obligations."

**June and July: the follow-on guidance.** The CFPB issued a June 8 statement on how immigration status interacts with ability-to-repay obligations. Then on July 13, the OCC, FDIC and NCUA [issued joint guidance](https://ncua.gov/newsroom/press-release/2026/agencies-issue-guidance-lending-individuals-not-legally-authorized-work-united-states) saying loans to people not legally authorized to work "may present elevated credit risk" and that institutions should manage those risks through sound underwriting. Worth noting: that lending guidance never mentions ITINs by name.

Now the other half of the ledger, which matters just as much. Nothing above is a law, and nothing above bans ITIN lending or ITIN bank accounts. The mid-August item is a proposal, which then goes through public comment before any rule becomes final. The EO's ITIN language is also narrower than most coverage suggests: it targets ITIN use by applicants who lack "verified lawful immigration status," and an ITIN by itself says nothing about status in either direction. FinCEN's own advisory spells that out: ITINs "do not provide evidence of legal status in the United States."

The banking industry's reaction has been guarded, not hostile. The Independent Community Bankers of America [responded](https://www.independentbanker.org/w/icba-statement-on-executive-order-on-the-integrity-of-the-u.s.-financial-system) that the order "recognizes the rigorous know-your-customer and due diligence requirements that community banks meet" and warned against new burdens that push people out of regulated banking. The practical risk for borrowers is quieter than a ban: lenders over-complying before any rule requires it. American Banker's June 18 story was headlined ["CFPB, Fincen guidance casts a pall over ITIN lending,"](https://www.nationalmortgagenews.com/news/cfpb-fincen-guidance-casts-a-pall-over-itin-lending) and one ITIN lender quoted in it said he had not seen anyone pull back yet "but I think it's only a matter of time." As of this writing, no bank, credit union, or mortgage lender has publicly announced ending an ITIN program. Our tracked list is unchanged. We will update this page if that changes.

## What is happening with IRS data sharing?

The other 2026 story runs through the tax system, and it matters for lending because ITIN mortgages are built on tax returns.

In April 2025, the IRS and the Department of Homeland Security signed a memorandum of understanding allowing ICE to request taxpayer address information for immigration enforcement. According to the [Congressional Research Service's March 2026 litigation summary](https://www.everycrsreport.com/reports/LSB11413.html), ICE requested addresses for 1.28 million people. The IRS actually disclosed 47,289 last-known addresses before courts stepped in.

Three federal cases now shape what happens next. In November 2025, Judge Colleen Kollar-Kotelly in Washington ordered the IRS to share data only in strict compliance with the tax privacy statute. In February 2026, Judge Indira Talwani in Massachusetts barred ICE and DHS from using the data they had already received. Between those two, on February 24, the D.C. Circuit ruled for the government on a separate question, holding the agreement itself was not reviewable and that address disclosure can be lawful under the statute's criminal investigation exception. Coverage of the February rulings, including [KQED's explainer for ITIN filers](https://www.kqed.org/news/12073445/tax-day-filing-2026-ice-irs-trump-itin-number-no-social-security-number), reported a court finding that roughly 42,695 of the disclosures violated taxpayer privacy law. Senator Ron Wyden [put it](https://www.finance.senate.gov/ranking-members-news/wyden-statement-on-judges-ruling-that-irs-ice-data-sharing-violated-taxpayer-privacy-laws) at "nearly 43,000 cases" in a February 26 statement. Appeals are pending on both injunctions, so the practical state as of mid-2026 is: sharing is constrained by court order, and the law is unsettled.

The lending connection is the chilling effect on filing. The Yale Budget Lab [estimated](https://budgetlab.yale.edu/research/potential-impact-irs-ice-data-sharing-tax-compliance) the data-sharing agreement could cost about $25 billion in federal revenue in 2026 alone as fewer people file. The Washington Post reported in April that some tax preparers watched hundreds of longtime clients disappear this season; KQED found a Bay Area clinic where filings held up anyway. Both things can be true in different places. For this market the mechanics are blunt: two years of ITIN tax returns are the core document for nearly every ITIN mortgage. People scared out of filing lose the paper trail that qualifies them, years before any lending rule changes a thing.

## What should you watch for the rest of 2026?

Four dates and datasets matter between now and our next edition.

**Mid-August.** Treasury's 90-day window under the executive order closes. Whatever it proposes goes to public comment, and the comment docket will show where banks and credit unions actually stand.

**The appeals.** Both data-sharing injunctions are on appeal in the D.C. Circuit. A ruling either way changes what information can move between the IRS and immigration agencies, and with it, how safe ITIN filers feel building the tax history lending depends on.

**HMDA 2025 data.** FFIEC publishes each year's national file the following summer. The 2025 file will show whether the denial-rate climb continued into the first full year of the new enforcement climate.

**Rates.** Freddie Mac's weekly survey sat at 6.55% in mid-July, about 20 basis points below a year earlier, after dipping under 6% in February for the first time in three and a half years. MBA forecasts $2.2 trillion in 2026 originations, up 8%. If the broader market loosens, ITIN pricing usually follows with a lag.

If you are reading this as a borrower rather than a researcher, the practical picture has not changed: the loans are legal and a dozen named lenders want the business. Preparation still beats timing. Our guides on [qualifying for an ITIN mortgage](/articles/itin-mortgage-qualify) and [building credit with an ITIN](/articles/how-to-build-credit-with-itin) cover the mechanics.

## How we built this report, and what we cannot know

We want this section to outlive any single number above, because the biggest problem in ITIN lending data is overconfidence.

**What we pulled directly.** All HMDA figures come from the public [FFIEC data browser API](https://ffiec.cfpb.gov/data-browser/), pulled July 18, 2026, filtered to originated loans and denials for Hispanic or Latino borrowers, nationwide and for eight states. The raw output is downloadable at [/data/state-of-itin-lending-2026.json](/data/state-of-itin-lending-2026.json), and the same scripted pull re-runs each quarter.

**The core limitation.** HMDA has no ITIN field. No federal dataset records whether a mortgage borrower used an ITIN or an SSN. Our ethnicity-filtered HMDA numbers describe the broader market ITIN lenders operate in, and we label them that way every time they appear. Anyone presenting HMDA data as ITIN loan counts is misusing it.

**How we triangulate.** We layer four independent sources: IRS and TIGTA counts of ITIN holders and filers, which bound the population; the Urban Institute's origination estimate, the only published unit count; our own tracked list of named lenders with public ITIN programs, verified against the lenders' own pages; and dated reporting from named outlets. Where we derive anything ourselves, like the dollar-volume ballpark, we say so and show the arithmetic.

**What would falsify us.** If a lender on our list has ended its program without updating its public pages, our lender count is stale. If ITIN borrowers are a smaller share of Hispanic mortgage demand than demographic studies suggest, our context tables overstate the overlap. And the regulatory sections describe proposals and litigation in motion; any of it can change with one ruling or one final rule. We will correct this page as facts change, with the update date shown at the top.

This report is informational. It is not legal or immigration advice, and it is not a recommendation to take or avoid any loan. Nothing here assumes anyone's immigration status. ITINs are held by many groups, including foreign investors, students and spouses of citizens, and an ITIN says nothing about status on its own.
