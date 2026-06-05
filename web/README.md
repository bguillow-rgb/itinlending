# ITINLending.net

Static marketing + content site for **itinlending.net**, built with Astro and
published to GitHub Pages. Information-and-referral site (not a lender/broker)
covering ITIN loans, mortgages, auto, credit cards, personal/business loans, and
how to get an ITIN — engineered to rank for ITIN long-tail queries and to be
cited by AI answer engines.

## Stack

- **Astro 5** static site generator (`/web/src` → `/web/dist`)
- Published to **`/docs`** at the repo root; GitHub Pages serves `main` → `/docs`
- **Cloudflare (free)** in front for DNS + 301 redirects from the old WordPress URLs
- Custom CSS design system (no framework) — see `src/styles/global.css`

## Local development

```bash
cd web
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks + builds to dist/
```

## Deploy

```bash
cd web
bash scripts/deploy-to-docs.sh   # build + replace ../docs with the fresh build
cd ..
git add docs && git commit -m "Deploy site" && git push
```

GitHub Pages picks up the push and serves `/docs`. `.nojekyll` in the build keeps
the `/_astro/*` CSS/JS from being stripped.

## Configuration (env vars)

All vars are `PUBLIC_` because they're baked into static HTML at build time.
Copy `web/.env.example` → `web/.env` and fill in as each system comes online.
Analytics/ads/lead form are gated on `import.meta.env.PROD` **and** the var being
set, so nothing fires in dev.

| Var | Purpose |
|---|---|
| `PUBLIC_GA4_ID` | Google Analytics 4 Measurement ID |
| `PUBLIC_GSC_VERIFICATION` | Search Console HTML-tag verification value |
| `PUBLIC_INDEXNOW_KEY` | IndexNow key (also commit `<key>.txt` at site root) |
| `PUBLIC_ADSENSE_ID` | AdSense publisher ID (`ca-pub-…`) |
| `PUBLIC_LEAD_ENDPOINT` | Lead-form POST URL (Formspree/Web3Forms/Basin) |
| `PUBLIC_AFFILIATE_APPLY_URL` | Optional Commission Junction deep link for CTAs |

## Content model

- **Money pages** (`src/pages/*.astro`) — pillar `/itin-loans` plus cluster pages
  (`/itin-mortgage`, `/itin-auto-loan`, `/itin-credit-cards`,
  `/itin-personal-loans`, `/itin-business-loans`, `/how-to-get-an-itin`,
  `/itin-vs-ssn`). Most use `MoneyPageLayout`.
- **Articles** (`src/content/articles/*.md`) — detail-tier posts rendered through
  `src/pages/articles/[...slug].astro`. Schema: title, description, tier,
  targetQuery, relatedQueries, quickAnswer, faqs, etc. (see `src/content/config.ts`).
- **Single source of truth**: `src/consts.ts` (`SITE`, `PRODUCTS`, `NAV`).

### Adding an article

1. Create `src/content/articles/<slug>.md` with the required frontmatter.
2. Include a Quick Answer (40–60 words), question-format H2s, a comparison table
   where relevant, and 4–8 FAQs.
3. Add internal links to the relevant pillar/cluster pages.
4. Build + deploy.

## SEO / AEO baked in

- Full JSON-LD per page type (Organization, WebSite, Article + Speakable,
  FAQPage, BreadcrumbList, Person, AboutPage)
- Quick Answer blocks marked Speakable (`#quick-answer`)
- Question-format H2s, FAQ schema, comparison tables
- `robots.txt` AI-crawler allow-list, `llms.txt`, auto-generated sitemap
- YMYL/E-E-A-T: author bio, disclosures, contact, last-updated dates, legal pages

## Migration / launch

See **`docs/MIGRATION.md`** for the GitHub Pages + Cloudflare cutover and the
301 redirect map in **`docs/redirects.csv`** (preserves the old WordPress URLs).
