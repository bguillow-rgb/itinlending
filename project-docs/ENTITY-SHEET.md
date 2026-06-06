# Entity Sheet — canonical brand facts for off-site profiles

Single source of truth for the **exact** name, description, URL, and `sameAs`
identifiers of every Timberline property. Use this verbatim when creating or
editing third-party profiles (Crunchbase, LinkedIn, OpenCorporates, Product
Hunt, Bing Places, etc.). **Entity consistency is the lever** — the Organization
name, URL, and identifier set must be byte-identical across every surface or the
Knowledge-Graph `sameAs` chain weakens (see global playbook Step 4 + Step 9).

> **Do not fabricate facts here.** Founding dates, locations, and headcount go in
> only when real. Unknown = leave blank. A blank field is safe; a guessed one is
> a notability/trust liability.

Last updated: 2026-06-06

---

## Parent — Timberline Ventures LLC

| Field | Value |
|---|---|
| Legal name | Timberline Ventures LLC |
| Display name | Timberline Ventures |
| Type | LLC / digital product studio |
| Website | https://timberlineventuresllc.com |
| Tagline | A studio building useful digital products |
| Founder | Bob Guillow |
| Founding date | *(unknown — leave blank until confirmed)* |
| Wikidata | https://www.wikidata.org/wiki/Q140082434 |

**Short description (≤160 chars):**
> Independent digital product studio building and operating consumer apps and high-trust information sites.

**Long description:**
> Timberline Ventures LLC is an independent digital product studio. We build and operate a portfolio of consumer apps and high-trust information sites — from bilingual ITIN financial guides to native iOS collector apps.

**`sameAs` set (add as profiles go live):**
- https://www.wikidata.org/wiki/Q140082434
- *(LinkedIn company page — TBD)*
- *(Crunchbase organization — TBD)*
- *(OpenCorporates — TBD)*

---

## Websites (publisher = Timberline Ventures LLC)

### ITIN Lending
| Field | Value |
|---|---|
| Name | ITIN Lending |
| Legal/brand | ITINLending.net |
| Website | https://itinlending.net |
| Tagline | Loans, Mortgages & Credit for ITIN Holders |
| Wikidata | https://www.wikidata.org/wiki/Q140082776 |
| Owned by | Timberline Ventures LLC (Q140082434) |

> ITINLending.net helps ITIN holders and foreign nationals find mortgages, auto loans, personal loans, business loans, and credit cards — no SSN required. Independent guides and lender matching.

### ITIN Credit Card
| Field | Value |
|---|---|
| Name | ITIN Credit Card |
| Legal/brand | ITINCreditCard.com |
| Website | https://itincreditcard.com |
| Tagline | Credit Cards & Credit Building for ITIN Holders |
| Wikidata | https://www.wikidata.org/wiki/Q140083128 |
| Owned by | Timberline Ventures LLC (Q140082434) |

> ITINCreditCard.com helps ITIN holders get approved for credit cards without an SSN and build U.S. credit history — secured cards, unsecured cards, which issuers accept an ITIN, and how to raise your score. Independent guides and card matching.

### ITIN Credit Score
| Field | Value |
|---|---|
| Name | ITIN Credit Score |
| Legal/brand | ITINCreditScore.com |
| Website | https://itincreditscore.com |
| Tagline | Build & Check Your Credit Score With an ITIN |
| Wikidata | https://www.wikidata.org/wiki/Q140083287 |
| Owned by | Timberline Ventures LLC (Q140082434) |

> ITINCreditScore.com helps ITIN holders build a U.S. credit history, check their credit score without an SSN, and raise it — covering the credit bureaus, credit-builder tools, and what actually moves your score. Independent guides and tools matching.

---

## iOS apps (publisher = Timberline Ventures LLC)

### Stick Picks
| Field | Value |
|---|---|
| Name | Stick Picks |
| Website | https://stickpicks.app |
| Tagline | The Cigar Collector's Journal |
| App Store ID | *(not yet live — leave blank until App Store listing exists)* |
| Inception | *(unknown — leave blank)* |
| Wikidata | https://www.wikidata.org/wiki/Q140083289 |
| Owned by | Timberline Ventures LLC (Q140082434) |

> Stick Picks is a hobby and lifestyle iOS app for adult cigar collectors. Catalog your humidor, track collection value, and journal your cigars in one reference.

### Perfume Picks
| Field | Value |
|---|---|
| Name | Perfume Picks |
| Website | https://perfumepicks.app |
| Tagline | The Fragrance Collector's Wardrobe |
| App Store ID | *(not yet live — leave blank until App Store listing exists)* |
| Inception | *(unknown — leave blank)* |
| Wikidata | https://www.wikidata.org/wiki/Q140083290 |
| Owned by | Timberline Ventures LLC (Q140082434) |

> Perfume Picks is an iOS app for fragrance collectors. Catalog your wardrobe, track every wear, get weather and occasion-aware picks from bottles you already own, and see a personal taste profile built from your collection.

### Pour Picks  *(live — strongest notability)*
| Field | Value |
|---|---|
| Name | Pour Picks |
| Website | https://pourpicks.app |
| Tagline | The Bourbon Collector's Cellar |
| App Store ID | 6764040132 |
| App Store URL | https://apps.apple.com/us/app/pour-picks/id6764040132 |
| Inception | 2026-05-09 |
| Wikidata | https://www.wikidata.org/wiki/Q140083291 |
| Owned by | Timberline Ventures LLC (Q140082434) |

> Pour Picks is a hobby and lifestyle iOS app for adult bourbon collectors. Catalog your cellar, scan bottles to identify what you own, track collection value, and journal every pour in one private reference.

---

## Profile-creation checklist (user-executed; do verbatim)

For each profile, use the **exact** name + URL + description from above, and link
back the full `sameAs` set so identifiers reinforce each other:

1. **Crunchbase** — one org per property (or at minimum Timberline + Pour Picks).
   Include website, founder (Bob Guillow), Wikidata URL in "Social/links."
2. **LinkedIn company pages** — Timberline first; link website + tagline.
3. **OpenCorporates** — Timberline (auto-listed from state registration); claim
   and add website.
4. **Product Hunt** — Pour Picks (live) is the only one ready to launch; counts
   as third-party coverage for Wikidata notability.
5. **Bing Webmaster Tools** — import sites from GSC; submit sitemaps (feeds
   ChatGPT/Copilot via Bing index — AEO value).

After any profile goes live, **add its URL to the matching `sameAs` block** in
that property's `consts.ts` (websites) / `orgSameAs` (apps) and back into this
sheet, then re-deploy so the Organization schema closes the loop.
