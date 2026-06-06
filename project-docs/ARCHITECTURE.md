# Architecture

## Stack

- **Astro 5** static site generator. Source in `web/src`, build output in
  `web/dist`, published copy in `/docs` at repo root.
- **GitHub Pages** serves `main` → `/docs`. `.nojekyll` is shipped in the build so
  `/_astro/*` CSS/JS assets aren't stripped by Jekyll.
- **Cloudflare (free plan)** sits in front of the domain for DNS + 301 redirects
  from the old WordPress URLs (see [`SEO-AEO.md`](./SEO-AEO.md) → Migration).
- **No CSS framework** — a hand-rolled design system in `web/src/styles/global.css`
  driven by the `theme` tokens in `consts.ts`.
- Astro integrations: `@astrojs/sitemap` (auto sitemap) and `@astrojs/mdx`.
- Build config (`web/astro.config.mjs`): `site: https://itinlending.net`,
  `trailingSlash: 'never'`, `build.format: 'file'` (so routes emit
  `/about.html`, `/itin-loans.html`, etc.). Sitemap filter excludes `404` and
  `thank-you`.

## Repo layout

```
Itin/
├── CLAUDE.md                 # project instructions + the documentation rule
├── project-docs/             # THIS folder — internal docs (never published)
├── docs/                     # GENERATED GitHub Pages output (do not hand-edit)
├── lighthouserc.json         # Lighthouse CI assertions
├── .github/workflows/        # daily-content, monitor, lighthouse
└── web/
    ├── astro.config.mjs
    ├── package.json
    ├── .env                  # build-time PUBLIC_* vars (gitignored)
    ├── docs/                 # MIGRATION.md + redirects.csv (launch guide)
    ├── public/               # static assets: robots.txt, llms.txt, ads.txt,
    │                         # IndexNow key file, images, icons, CNAME
    ├── scripts/              # deploy-to-docs.sh, daily-post.mjs,
    │                         # monitor.mjs, indexnow.mjs
    └── src/
        ├── consts.ts         # SINGLE SOURCE OF TRUTH (see below)
        ├── i18n/ui.ts        # EN/ES chrome strings + locale helpers
        ├── content/
        │   ├── config.ts     # articles collection schema (Zod)
        │   └── articles/*.md  # detail-tier posts
        ├── layouts/          # BaseLayout, MoneyPageLayout, ArticleLayout
        ├── components/       # Nav, Footer, LeadForm, AdSlot, InlineCTA, FAQ,
        │   │                 # QuickAnswer, RelatedLinks, Disclosure, Icon…
        │   └── schema/       # JSON-LD components (one per schema type)
        ├── styles/global.css
        └── pages/            # money pages + utility pages (EN), with /es mirror
```

## Single source of truth — `web/src/consts.ts`

Everything site-wide reads from here. Exports:

- **`SITE`** — name, legal name, taglines (EN/ES), descriptions (EN/ES), URL,
  locale, support email; `publisher` (Timberline Ventures LLC) and `editorial`
  (ITIN Lending Editorial Team) entities used in schema + footer; `analytics`
  (GA4 / GSC / IndexNow, all env-gated); `monetize` (AdSense ID + ad slots, lead
  form endpoint + Web3Forms key, affiliate URLs — see [`MONETIZATION.md`](./MONETIZATION.md));
  `theme` color tokens.
- **`PRODUCTS`** — the money-page topology (slug, EN/ES label, EN/ES blurb, icon).
  Drives the homepage grid, nav, footer. Current set: itin-mortgage,
  itin-auto-loan, itin-credit-cards, itin-personal-loans, itin-business-loans,
  how-to-get-an-itin.
- **`PILLAR`** — `itin-loans`, the top of the hub-and-spoke.
- **`NAV`** / **`NAV_CTA`** — main nav links + the "See if you qualify" CTA.
- **`affiliateUrlFor(pathOrSlug)`** — resolves a money page's per-product CJ deep
  link, falling back to the global apply URL, then `/apply`.

When the project evolves, edit `consts.ts` — schema, footer, nav, llms.txt,
analytics, and monetization all follow.

## Page types & layouts

| Type | Source | Layout | Purpose |
|---|---|---|---|
| Money pages | `src/pages/*.astro` | `MoneyPageLayout` | Commercial-intent pillar + cluster pages (mortgage, auto, credit cards, personal, business, itin-loans pillar, how-to-get-an-itin, itin-vs-ssn). Hero + lead form, body, conversion CTA, FAQ, one below-fold ad. |
| Articles | `src/content/articles/*.md` | `ArticleLayout` | Detail-tier research posts. Quick Answer, top + end ad slots, body, CTA, related links, FAQ. |
| Utility | `src/pages/*.astro` | `BaseLayout` | about, apply, contact, privacy, terms, disclosure, thank-you, 404. No in-content ads. |

`BaseLayout` is the shared shell (head, nav, footer, global head-slot for schema).
Both `MoneyPageLayout` and `ArticleLayout` compose it.

## Internationalization (EN + ES)

- **English** lives at `/foo`; **Spanish** mirrors at `/es/foo`. Spanish pages are
  full files under `src/pages/es/` (body content is translated per page, not
  machine-swapped at runtime).
- Shared "chrome" strings (nav, form, footer, CTAs, trust badges) live in
  `src/i18n/ui.ts` as `ui.en` / `ui.es` (Latin-American Spanish, es-419).
- Helpers in `i18n/ui.ts`: `getLangFromUrl(url)`, `useTranslations(lang)` → `t()`,
  `localizedHref(href, lang)` (prefixes internal links with `/es`),
  `altPath(pathname, to)` (computes the EN↔ES counterpart for the language toggle
  and for `hreflang` tags).
- Site-specific labels/blurbs carry their own `es` variants in `consts.ts`
  (`PRODUCTS[].labelEs`, `.blurbEs`, etc.).

## Structured data (JSON-LD)

One component per type under `src/components/schema/`: `OrganizationSchema`,
`WebSiteSchema`, `ArticleSchema` (+ Speakable on the Quick Answer),
`FAQPageSchema`, `BreadcrumbSchema`, `AboutPageSchema`. Injected via the
`head` slot in layouts. Coverage and rationale: [`SEO-AEO.md`](./SEO-AEO.md).
