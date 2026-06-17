# The Itin Sites — and the Timberline Ventures Corporate Site

## Corporate entity anchor

**timberlineventuresllc.com** (`~/TimberlineVentures`) — the publisher entity
site for the whole portfolio (ITIN sites + Picks apps). Dark-premium Astro
static site on GitHub Pages. `Organization` schema lists all 6 brands as
`subOrganization` + `owns`. Required for E-E-A-T / entity-graph hygiene.
**Follow-up:** update all 3 ITIN sites' `Organization` schema `url` field to
point at `https://timberlineventuresllc.com`.

## Sister app marketing sites (same content pipeline)

Five Timberline **app** marketing sites run the same daily-content +
search-submission pipeline as the ITIN sites (ported monolingual, vertical baked
per-repo, editorial byline):

| Site | Domain | Repo | Vertical |
|---|---|---|---|
| StickPicks | stickpicks.app | `bguillow-rgb/StickPicks` | Cigars / humidors |
| PerfumePicks | perfumepicks.app | `bguillow-rgb/PerfumePicks` | Perfume / fragrance |
| PourPicks | pourpicks.app | `bguillow-rgb/PourPicks` | Bourbon / whiskey (21+) |
| Underdial | underdial.com | `bguillow-rgb/Underdial-Web` | Watches under $1,000 |
| Percolate | percolateapp.com | `bguillow-rgb/Percolate-Web` | Specialty coffee |

All five carry the humanizer pass and (as of 2026-06-17) have `ANTHROPIC_API_KEY`
set and are generating. See [`PICKS-APP-PIPELINES.md`](./PICKS-APP-PIPELINES.md)
for the per-repo deltas, workflows, and setup handoff.

---

# The Three ITIN Sites

The Itin family is **three separate sites, each its own git repo and folder**, all
built on the identical Astro pattern documented here, all bilingual (EN + `/es`),
all operated by **Timberline Ventures LLC**, and all sharing **one Google AdSense
account** (the ad-unit slot IDs are account-level).

This `project-docs/` folder (inside the `Itin` repo) is the **central
documentation hub for all three.** The shared architecture, monetization, SEO,
content-pipeline, and ops docs apply to every site; this page records what's
different per site.

| | Site 1 | Site 2 | Site 3 |
|---|---|---|---|
| **Name** | ITIN Lending | ITIN Credit Card | ITIN Credit Score |
| **Domain** | itinlending.net | itincreditcard.com | itincreditscore.com |
| **Local folder** | `~/Itin` | `~/ITINCreditCard` | `~/ITINCreditScore` |
| **GitHub repo** | `bguillow-rgb/itinlending` | `bguillow-rgb/itincreditcard` | `bguillow-rgb/itincreditscore` |
| **Vertical** | Loans, mortgages, auto, personal/business loans, credit | Credit cards & credit building | Credit scores & credit building |
| **Tagline** | Loans, Mortgages & Credit for ITIN Holders | Credit Cards & Credit Building for ITIN Holders | Build & Check Your Credit Score With an ITIN |

## Per-site money-page topology

Same hub-and-spoke shape, different clusters. `consts.ts` (`PRODUCTS`, `PILLAR`)
in each repo is the source of truth.

**ITIN Lending** (`~/Itin`) — pillar `/itin-loans`; clusters: itin-mortgage,
itin-auto-loan, itin-credit-cards, itin-personal-loans, itin-business-loans,
how-to-get-an-itin, itin-vs-ssn.

**ITIN Credit Card** (`~/ITINCreditCard`) — pillar `/itin-credit-cards-guide`;
pages: credit-cards-that-accept-itin, secured-credit-cards,
unsecured-credit-cards, business-credit-cards, build-credit-with-itin,
how-to-get-an-itin.

**ITIN Credit Score** (`~/ITINCreditScore`) — pillar `/itin-credit-score-guide`;
pages: check-credit-score-with-itin, credit-reports-with-itin,
build-credit-history-with-itin, improve-credit-score, credit-builder-loans,
credit-bureaus-and-itin, how-to-get-an-itin.

## Shared vs. per-site

**Shared (identical pattern, copy across repos):** layouts, components, i18n
scaffolding, schema components, the deploy script, the daily content generator
(`daily-post.mjs` — reads identity from `consts.ts`, so it's portable with no
edits), monitor/Lighthouse/IndexNow tooling, and the AdSense account + slot IDs.

**Per-site (differs per repo):** `consts.ts` site identity (name, url, taglines,
descriptions, `PRODUCTS`, `PILLAR`, `NAV`), the actual page/article content,
`public/CNAME`, `public/robots.txt` + `llms.txt` (site-specific URLs), the
IndexNow key + key file, and hardcoded host strings in `monitor.mjs` /
`indexnow.mjs` / the workflows.

## The daily generator already knows the vertical

`daily-post.mjs` branches on the site name: `…includes('Credit Card')` →
researches credit cards; `…includes('Credit Score')` → credit scores/building;
otherwise → lending/loans/mortgages. So the same script runs unmodified in all
three repos.

## Documentation rule across all three

Every repo carries a root `CLAUDE.md`. Site 1 (`~/Itin`) holds the full rule +
these docs. Sites 2 and 3 carry a pointer `CLAUDE.md` directing agents back to
this hub and restating the rule: **update the relevant doc here + append to
`CHANGELOG.md` on every task.** When you change a shared pattern in one repo,
note in the changelog whether sites 2/3 need the same change.
