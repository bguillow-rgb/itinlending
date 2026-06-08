# Operations

Build, deploy, environment, automation, and monitoring.

## Local development

```bash
cd web
npm install
npm run dev      # http://localhost:4321  (ads/analytics/leads OFF in dev)
npm run build    # type-checks + builds to dist/
```

## Deploy

```bash
cd web
bash scripts/deploy-to-docs.sh   # build + replace ../docs with the fresh build
cd ..
git add docs && git commit -m "Deploy site" && git push
```

`deploy-to-docs.sh` runs `npm run build`, then **`rm -rf ../docs`** and copies
`dist/` into `/docs`. GitHub Pages (Settings → Pages → `main` → `/docs`) serves the
push. `.nojekyll` in the build keeps `/_astro/*` from being stripped.

> ⚠️ Because deploy wipes `/docs`, never hand-edit or store anything there. Source
> lives in `/web`; internal docs live in `/project-docs`.

## Environment variables

All are `PUBLIC_*` (baked into static HTML at build time). Local values live in
`web/.env` (gitignored); CI uses GitHub secrets. Everything no-ops until set, and
ads/analytics/leads additionally require a production build.

| Var | Purpose |
|---|---|
| `PUBLIC_GA4_ID` | GA4 Measurement ID |
| `PUBLIC_GSC_VERIFICATION` | Search Console meta-tag value |
| `PUBLIC_INDEXNOW_KEY` | IndexNow key (also commit `<key>.txt` at site root) |
| `PUBLIC_ADSENSE_ID` | AdSense publisher ID `ca-pub-…` (live: `ca-pub-1426577294682977`) |
| `PUBLIC_ADSENSE_SLOT_ARTICLE_TOP` / `_ARTICLE_END` / `_MONEY_FOOTER` / `_THANKYOU` | Ad-unit slot IDs (account-level, shared across all 3 sites) |
| `PUBLIC_LEAD_ENDPOINT` | Lead-form POST URL (Web3Forms/Formspree/Basin) |
| `PUBLIC_WEB3FORMS_KEY` | Web3Forms access key (public by design) |
| `PUBLIC_AFFILIATE_APPLY_URL` | Global CJ apply deep link (CTA fallback) |
| `PUBLIC_AFFILIATE_URL_MORTGAGE` / `_AUTO` / `_CREDIT_CARDS` / `_PERSONAL` / `_BUSINESS` / `_LOANS` | Per-product CJ deep links |
| `ANTHROPIC_API_KEY` | (CI secret) used by the daily content generator |

## GitHub Actions workflows (`.github/workflows/`)

| Workflow | File | Schedule | What it does |
|---|---|---|---|
| **Daily SEO content** | `daily-content.yml` | `0 13 * * *` + manual | Generates one article, builds+deploys, pings IndexNow + Google Indexing API, commits & pushes. See [`CONTENT-PIPELINE.md`](./CONTENT-PIPELINE.md). |
| **Site health monitor** | `monitor.yml` | `17 13 * * *` + manual | Runs `scripts/monitor.mjs` against the live site. Red run emails the owner. |
| **Lighthouse CI** | `lighthouse.yml` | `41 6 * * 1` (Mon) + manual | `lhci autorun` against live URLs, asserts CWV + category scores per `lighthouserc.json`. |

## Health monitor — `web/scripts/monitor.mjs`

Checks the **live production site** (no GSC/analytics login needed):
1. Sitemap index + child sitemaps reachable and parse.
2. Every sitemap URL returns HTTP 200 (catches deploy/index/404 rot; redirects →
   warn, non-200 → fail). 8-way concurrency.
3. TLS certificate valid and not expiring within `CERT_WARN_DAYS` (default 21).
4. JSON-LD present + parses on `/`, `/about`, `/articles` (reports the @types).
5. canonical + hreflang present on sampled pages (warn if missing).

Exits non-zero on any failure (turns the CI run red → email). Run locally:
`node scripts/monitor.mjs --url https://itinlending.net`.

## Lighthouse CI — `lighthouserc.json`

Audits `/`, `/itin-loans`, `/itin-mortgage`, `/articles` (desktop preset, 3 runs).
Assertions: SEO ≥ 0.95 (**error**), CLS ≤ 0.1 (**error**), performance / a11y /
best-practices ≥ 0.9 (warn), LCP ≤ 2500ms (warn), TBT ≤ 200ms (warn). Results
upload to temporary public storage.

## IndexNow — `web/scripts/indexnow.mjs`

Submits the site's URLs (parsed from `dist/sitemap-0.xml`) to Bing/Yandex/Naver/
Seznam (Google does **not** use IndexNow). Key `4524d82c6a8008289f40cde63aad623f`,
host `itinlending.net`; the key file `public/<KEY>.txt` must be live first. Run
after a deploy: `node scripts/indexnow.mjs`. The daily workflow calls it
automatically (non-fatal).

## Google Indexing API — `web/scripts/google-index.mjs`

Pushes **just the new daily article's URLs** (EN `/articles/<slug>` + ES
`/es/articles/<slug>`) to Google's Indexing API (`urlNotifications:publish`,
`URL_UPDATED`) so each post gets spidered ASAP instead of waiting for sitemap
rediscovery. This is the **Google-side** complement to IndexNow (which Google
ignores). The daily workflow runs it right after IndexNow, gated on
`steps.write.outputs.slug != ''` (only when a new article was written), non-fatal.

- **Auth:** env-gated on `GOOGLE_INDEXING_SA_KEY` (service-account JSON, raw or
  base64; falls back to `GSC_SA_KEY`). The service account must be a **verified
  Owner** of the Search Console property (not just a user), and the **Web Search
  Indexing API** must be enabled in its GCP project. No key → clean no-op.
- **Origin** is read from `consts.ts`, so the script is portable across all three
  repos. Usage: `node scripts/google-index.mjs --article <slug>` (expands to EN+ES),
  or pass explicit paths / full URLs.
- **⚠ Policy caveat:** Google officially scopes the Indexing API to `JobPosting` /
  `BroadcastEvent` pages. It works in practice for article URLs and is widely used
  that way, but it is **not a sanctioned use** — Google may ignore, deprioritize,
  or rate-limit it (default quota 200 URLs/day). The sitemap remains the supported
  discovery path; treat this as a best-effort accelerant.
- **To activate:** create a GCP service account, enable the Indexing API, add its
  email as an Owner in Search Console, then set the `GOOGLE_INDEXING_SA_KEY` secret
  in each repo. Until then the step no-ops.

## Per-site config note

`monitor.mjs`, `indexnow.mjs`, and the workflows currently hardcode
`itinlending.net` in places (host, monitored URL, IndexNow key). When standing up
sister sites #2/#3, parameterize these (the daily-post script already reads
identity from `consts.ts` and needs no edit). Track in [`ROADMAP.md`](./ROADMAP.md).
