# Content Pipeline

How articles are modeled, generated automatically, and added by hand.

## Article model

Defined in `web/src/content/config.ts` (Astro content collections, Zod-validated).
There are **two collections sharing one `articleSchema`**:

- `articles` — English markdown in `web/src/content/articles/*.md`.
- `articlesEs` — es-419 translations in `web/src/content/articles-es/*.md`, using
  the **same slug** as their English source.

English is rendered by `web/src/pages/articles/[...slug].astro`; Spanish by
`web/src/pages/es/articles/[...slug].astro`. The ES route builds **one page per
English slug** and serves the `articlesEs` entry if present, otherwise **falls
back to the English entry** — so `/es/articles/<slug>` never 404s even before its
translation has been generated.

Frontmatter fields:

| Field | Notes |
|---|---|
| `title`, `description` | SEO title (~55–65 char) + meta description (~150–160 char). |
| `tier` | `pillar` \| `cluster` \| `detail` (drives length/role — see SEO-AEO topology). |
| `targetQuery` | The exact query the article targets. |
| `relatedQueries` | 3–5 secondary queries. |
| `quickAnswer` | 40–60 word direct answer; min 40 chars enforced; marked Speakable. |
| `publishedAt` / `updatedAt` | Dates (string → Date). |
| `author` | Visible byline. `ArticleLayout` renders the article's own `author` plus a team-bio block for E-E-A-T. New posts get a stable rotating byline via `pickAuthor(slug)` in `publish.mjs` (hashes the slug → a label in `SITE.editorial.team`); existing posts were retroactively re-bylined with the same hash so EN/ES match. **Bylines are NON-PERSONAL labels only (2026-07-07): "Editorial Team", "Editorial Staff", "Research Desk" — never a human name (not Bob's, not a made-up persona).** Article schema `author` is an `Organization` (see `ArticleSchema.astro`), not a `Person`; there is no `#editor` Person entity. |
| `category` | Label for the index card / breadcrumb grouping. |
| `relatedSlugs`, `faqs` (q/a array), `published` (bool) | Linking, FAQPage schema, draft flag. |

## Shared pipeline library — `web/scripts/lib/`

All content scripts share a set of portable modules so the **same code runs in all
three repos** with no per-repo edits (site identity is read from `consts.ts`):

| Module | Responsibility |
|---|---|
| `lib/generate.mjs` | `loadSite(constsPath)` reads name/url/description/author **+ the `editorial.team` byline roster (`site.authors`)** from `consts.ts`. `scopeOf(site)` enforces the **per-site content lane** (card = credit cards only, score = credit scores/credit building only, lending = catch-all); the strict scope rule is injected into both the system and user prompts so generation never strays cross-site. **Lending site also carries an `esBias` block** (added 2026-06-24) that pushes keyword selection toward winnable Spanish loan queries (`préstamos para auto con itin`, `hipoteca con itin`, `préstamo con itin y mal crédito`, + TX/CA/FL geo variants) — Spanish is the lending domain's strongest lane; card/score sites are not ES-biased. The article body is written as a **reader Q&A** (first-person reader-style question H2s, rotating italic lead-ins like *"A question we hear often:"* on ~half the sections, never fabricated names, with varied 1–2-paragraph answer depth). `generateArticle({...})` calls Claude with the web_search tool, parses + validates the JSON block (`parseJsonBlock`, `validateArticle`), then runs the result through the **humanizer pass** before returning. `max_tokens` 24000 for pillars, 16000 otherwise. |
| `lib/humanize.mjs` | `humanizeArticle({apiKey, model, article})` — a **second Claude call** (no tools) that strips AI tells from `quickAnswer` / `bodyMarkdown` / `faqs` per the personalizer playbook (Wikipedia "Signs of AI writing"), preserving every fact, heading, table, and link. **Fail-safe**: any API/parse error or a body that shrank >35% returns the ORIGINAL article unchanged, so the daily run never breaks. A final dash-scrub guarantees zero em/en dashes. Identical module in all 6 repos (ITIN ×3 + StickPicks/PourPicks/PerfumePicks). |
| `lib/translate.mjs` | `translateArticle(en, apiKey)` — second Claude call (no tools) with a financial-translator system prompt → es-419 (`tú`, not `vosotros`; preserves markdown/numbers/proper nouns). Guardrails throw if the body comes back empty or all FAQs are dropped. |
| `lib/build-md.mjs` | `buildMarkdown(a)` assembles frontmatter in a fixed field order; `stripCites` removes web-search citation markup. `relatedSlugs` is kept immediately before `faqs`. |
| `lib/articles.mjs` | `readArticleMeta(dir)` (slug/title/targetQuery/category/tier/relatedQueries); `computeRelated(target, all, max=4)` token-overlap + same-category scoring (with an ITIN-aware stop-word list); `setRelatedSlugs(raw, slugs)` splices the relatedSlugs YAML block in place. |
| `lib/publish.mjs` | `publishArticle({...})` computes relatedSlugs, writes the EN file, then translates + writes the ES file (wrapped in try/catch so **EN survives a translation failure**); `relinkDir(dir)` recomputes + rewrites relatedSlugs across every file in a dir. |

## Automated daily content generator

The flagship content system. **One research-backed, schema-compliant, bilingual
article per day, fully automated.**

### Script — `web/scripts/daily-post.mjs`
- Uses `loadSite` + `generateArticle` + `publishArticle` + `relinkDir` from the
  shared lib (portable across all three sites).
- Lists existing articles to **dedupe** target queries/slugs and to give the model
  the current cluster map.
- Generates one **detail** article via Claude (`claude-sonnet-4-6` by default,
  override via `DAILY_POST_MODEL`) with the **web_search tool**. System prompt
  enforces the mandatory structure: Quick Answer, body as a **reader Q&A**
  (first-person question H2s with rotating italic lead-ins — never a fabricated
  person/testimonial), **varied answer depth** (most sections ~134–167 words, 2–3
  run ~250–320 words), a comparison table, a cited stat every 150–200 words, 5+
  FAQs, 1000–1600 words, original wording, natural internal links.
- On success it **publishes EN + ES** (translated) and **relinks the mesh** in both
  `articles/` and `articles-es/`, then emits `slug=` / `wrote=true` to
  `GITHUB_OUTPUT`.
- **Side-effect-free w.r.t. deploy:** it only writes files. It does **not** build,
  commit, or deploy — the workflow does that. Exit 0 with no file = "nothing new
  today" (not an error). Requires `ANTHROPIC_API_KEY`.

### Backfill — `web/scripts/backfill.mjs`
Re-runnable maintenance pass that keeps the bilingual + internal-link layers
complete even on days no new article ships:
- Relinks the EN mesh, **translates any EN article missing its ES twin** (skips
  existing unless `--force`; `--no-translate` relinks only), then relinks the ES
  mesh.
- Cheap to run daily — it only spends API calls on genuinely missing translations.
- Requires `ANTHROPIC_API_KEY` (except with `--no-translate`).

### Workflow — `.github/workflows/daily-content.yml`
- Cron `0 13 * * *` (13:00 UTC daily) + manual `workflow_dispatch`.
- Steps: checkout → setup Node 20 → `npm ci` → run `daily-post.mjs` →
  **`backfill.mjs`** (fills missing ES + relinks) → **detect content changes**
  (`changed=true` if `wrote==true` OR `git diff` shows any change under
  `web/src/content`) → **if changed:** build+deploy via `deploy-to-docs.sh` → ping
  IndexNow → commit `docs` + `web/src/content` and push as `github-actions[bot]`
  (5× rebase-retry loop to survive concurrent pushes across parallel sessions).
- `concurrency: daily-content`, `cancel-in-progress: false`. Needs
  `contents: write`. `ANTHROPIC_API_KEY` is supplied to both the generate and
  backfill steps.

## One-shot content seeding — `web/scripts/seed-content.mjs`

Manually build out the cluster fast (not scheduled). `--count N` (default 10)
detail articles `+ --pillar` (one 3,000–5,000-word pillar, skipped if a pillar
already exists). Uses `generateArticle` + `publishArticle`, dedupes in-memory
across the batch, and does a final relink of both dirs. Driven by
`.github/workflows/seed-content.yml` (`workflow_dispatch` with `count` + `pillar`
inputs; shares the `daily-content` concurrency group so the two never push
concurrently).

### Quality bar / guardrails
- Dedupe on slug + target query prevents thin/duplicative content.
- Validation rejects malformed output (the run fails loudly rather than shipping
  junk).
- Follows the global playbook's per-article structure for AEO citation.

## Adding an article by hand

1. Create `web/src/content/articles/<slug>.md` with the frontmatter above.
2. Include a Quick Answer (40–60 words), question-format H2s, a comparison table
   where relevant, 4–8 FAQs.
3. Add internal links to the relevant pillar/cluster pages.
4. Run `node scripts/backfill.mjs` to generate the ES twin (`articles-es/<slug>.md`)
   and refresh the relatedSlugs mesh. (`relatedSlugs` is auto-managed — leave it
   empty when authoring; the relink pass fills it.)
5. Build + deploy (`bash web/scripts/deploy-to-docs.sh`), commit `/docs`, push.

## Current content inventory

- Detail articles grow daily; ES twins live in `articles-es/` (same slug).
- Nearly all articles are `tier: detail` — run `seed-content.mjs --pillar` once
  per site to add the canonical pillar. Exception: the score site has one
  hand-written `tier: cluster` article, `cpn-vs-itin-credit-privacy-number-scam`
  (2026-07-18, EN+ES) — a scam-warning piece with an inline `.scam-shield`
  oxblood aside embedded as raw HTML in the markdown (the ScamShield component's
  classes are global, so markdown-embedded asides pick up the styling).
- Lending has one hand-written `tier: flagship` DATA REPORT,
  `state-of-itin-lending-2026` (2026-07-18, EN+ES, "Research Desk" byline,
  category Research). It is the quarterly Data Engine deliverable (Link Engine
  System 4): built from `web/scripts/hmda-pull.mjs` output plus same-day-verified
  regulatory sourcing, with the raw JSON published at
  `/data/state-of-itin-lending-2026.json`. Each quarter: re-run the pull, write
  the new edition as a NEW dated slug (citable URLs), update the old one's
  header to point forward.
- Money pages: see [`ARCHITECTURE.md`](./ARCHITECTURE.md) / [`SEO-AEO.md`](./SEO-AEO.md).

## Internal-link mesh (relatedSlugs)

`relatedSlugs` is **auto-populated**, never hand-edited. `computeRelated` scores
every other article by token overlap (title + targetQuery + relatedQueries) plus a
same-category bonus, using an ITIN-aware stop-word list so generic terms ("itin",
"credit", "loan") don't dominate the match. Both `daily-post.mjs` and
`backfill.mjs` relink the full EN and ES dirs after writing, so the mesh stays
complete as the cluster grows.

## Planned

- Tune the generator prompt per site (it already branches on site name for
  credit-card / credit-score verticals).
- Periodic content **refresh** pass (real updates — new data/sections, not just
  date bumps) per the freshness rule in the global playbook.
