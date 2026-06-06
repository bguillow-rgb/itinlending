# Itin — Internal Engineering & Strategy Docs

This folder is the **source of truth for how the Itin sites are built, monetized,
and grown.** It is internal (never published — the public site builds from `/web`
to `/docs`).

> **Documentation rule:** every agent that touches this repo updates the relevant
> doc here AND adds an entry to [`CHANGELOG.md`](./CHANGELOG.md). See the root
> `CLAUDE.md`. If it isn't documented, it isn't done.

## What this project is

A family of **independent ITIN-lending information & referral sites** for ITIN
holders / foreign nationals in the U.S. who can't use an SSN. The sites publish
plain-English guides (SEO + AEO optimized) and monetize through lead generation,
Commission Junction affiliate links, and Google AdSense.

- **Live site #1:** `itinlending.net` — loans, mortgages, auto, credit cards,
  personal/business loans, "how to get an ITIN". Bilingual (English + `/es`).
- **Sites #2 and #3:** planned, same stack, share one AdSense account. See
  [`ROADMAP.md`](./ROADMAP.md).
- **Publisher / operating entity:** Timberline Ventures LLC.
- **Stack:** Astro 5 static site → GitHub Pages (`main` → `/docs`), Cloudflare in
  front for DNS + 301 redirects.

## Document index

| Doc | What's in it |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Stack, repo layout, page types, components, i18n, schema, config single-source-of-truth. |
| [`MONETIZATION.md`](./MONETIZATION.md) | How ads work, how the lead form works, affiliate (CJ) routing, the page-intent revenue strategy. |
| [`SEO-AEO.md`](./SEO-AEO.md) | SEO/AEO plan: hub-and-spoke topology, structured data, robots/llms/sitemap, E-E-A-T, migration/redirects. |
| [`CONTENT-PIPELINE.md`](./CONTENT-PIPELINE.md) | Article model, the automated daily-post generator, how to add content by hand. |
| [`OPERATIONS.md`](./OPERATIONS.md) | Build/deploy, env vars, the three GitHub Actions workflows, monitoring, IndexNow. |
| [`ROADMAP.md`](./ROADMAP.md) | Built vs. in-progress vs. planned; the 3-site expansion. |
| [`CHANGELOG.md`](./CHANGELOG.md) | Running log of every change. **Append here on every task.** |

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
