# Itin — Internal Engineering & Strategy Docs

This folder is the **source of truth for how the Itin sites are built, monetized,
and grown.** It is internal (never published — the public site builds from `/web`
to `/docs`).

> **Documentation rule:** every agent that touches this repo updates the relevant
> doc here AND adds an entry to [`CHANGELOG.md`](./CHANGELOG.md). See the root
> `CLAUDE.md`. If it isn't documented, it isn't done.

## What this project is

A family of **three independent ITIN information & referral sites** for ITIN
holders / foreign nationals in the U.S. who can't use an SSN. Each site publishes
plain-English guides (SEO + AEO optimized) and monetizes through lead generation,
Commission Junction affiliate links, and Google AdSense.

- **Site 1 — ITIN Lending:** `itinlending.net` (`~/Itin`) — loans, mortgages,
  auto, credit cards, personal/business loans.
- **Site 2 — ITIN Credit Card:** `itincreditcard.com` (`~/ITINCreditCard`) —
  credit cards & credit building.
- **Site 3 — ITIN Credit Score:** `itincreditscore.com` (`~/ITINCreditScore`) —
  credit scores & credit building.

All three are separate repos on the same Astro pattern, bilingual (EN + `/es`),
and **share one AdSense account**. Per-site detail: [`SITES.md`](./SITES.md).

- **Publisher / operating entity:** Timberline Ventures LLC.
- **Stack:** Astro 5 static site → GitHub Pages (`main` → `/docs`), Cloudflare in
  front for DNS + 301 redirects.

## Document index

| Doc | What's in it |
|---|---|
| [`SITES.md`](./SITES.md) | The three sites: domains, repos, folders, per-site money-page topology, shared vs. per-site. |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Stack, repo layout, page types, components, i18n, schema, config single-source-of-truth. |
| [`MONETIZATION.md`](./MONETIZATION.md) | How ads work, how the lead form works, affiliate (CJ) routing, the page-intent revenue strategy. |
| [`PAID-ARBITRAGE.md`](./PAID-ARBITRAGE.md) | Google Ads → site paid-traffic analysis: why AdSense arbitrage loses, the lead/affiliate version that can work, real keyword/CPC tables, break-even math, ES-first test plan. |
| [`SEO-AEO.md`](./SEO-AEO.md) | SEO/AEO plan: hub-and-spoke topology, structured data, robots/llms/sitemap, E-E-A-T, migration/redirects. |
| [`GEO-AI-VISIBILITY-STRATEGY.md`](./GEO-AI-VISIBILITY-STRATEGY.md) | GEO strategy: full content/technical audit across all 3 sites, real ranking/AI-referral baseline, competitor research, content-gap question bank, schema/knowledge-graph/trust/conversion roadmap, 12-month plan. |
| [`RANK-TRACKING.md`](./RANK-TRACKING.md) | On-demand multi-engine rank reports (Google/Bing GSC+WMT + Serper live SERP). "Show me the rankings" → the `rankings` skill. |
| [`CONTENT-PIPELINE.md`](./CONTENT-PIPELINE.md) | Article model, the automated daily-post generator, how to add content by hand. |
| [`PICKS-APP-PIPELINES.md`](./PICKS-APP-PIPELINES.md) | The ITIN content pipeline ported to the Picks app sites (PerfumePicks, PourPicks): monolingual deltas, workflows, env, handoff. |
| [`OPERATIONS.md`](./OPERATIONS.md) | Build/deploy, env vars, the three GitHub Actions workflows, monitoring, IndexNow. |
| [`ANALYTICS-PLAN.md`](./ANALYTICS-PLAN.md) | Event tracking, KPIs, and the daily iMessage report pipeline (GA4 + AdSense). |
| [`ROADMAP.md`](./ROADMAP.md) | Built vs. in-progress vs. planned; the 3-site expansion. |
| [`CHANGELOG.md`](./CHANGELOG.md) | Running log of every change. **Append here on every task.** |
| [`NEW-SITE-PLAYBOOK.md`](./NEW-SITE-PLAYBOOK.md) | End-to-end checklist for launching any new Timberline site: repo → DNS → GA4 → GSC → HTTPS → schema. |
| [`SOCIAL.md`](./SOCIAL.md) | @itinlending (X) profile: bio, pinned post, avatar/header, compliant follow strategy + target list, cadence. |
| [`SOCIAL-CALENDAR-2026-06.md`](./SOCIAL-CALENDAR-2026-06.md) | 30-day starter calendar (60 posts, EN/ES) for @itinlending. |

## Fast orientation for a new agent

1. Read the root `CLAUDE.md` and this file.
2. `web/src/consts.ts` is the single source of truth (site identity, products,
   nav, monetization config, theme).
3. Money pages = `web/src/pages/*.astro` on `MoneyPageLayout`. Articles =
   `web/src/content/articles/*.md` on `ArticleLayout`. Spanish mirrors live under
   `web/src/pages/es/`.
4. Local dev: `cd web && npm install && npm run dev`. Deploy:
   `bash scripts/deploy-to-docs.sh` then commit `/docs` and push.
5. When done: update the relevant doc + `CHANGELOG.md`.
