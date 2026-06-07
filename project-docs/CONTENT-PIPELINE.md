# Content Pipeline

How articles are modeled, generated automatically, and added by hand.

## Article model

Defined in `web/src/content/config.ts` (Astro content collection, Zod-validated).
Articles are markdown in `web/src/content/articles/*.md`, rendered by
`web/src/pages/articles/[...slug].astro` on `ArticleLayout`. Spanish articles
mirror under `web/src/pages/es/articles/`.

Frontmatter fields:

| Field | Notes |
|---|---|
| `title`, `description` | SEO title (~55–65 char) + meta description (~150–160 char). |
| `tier` | `pillar` \| `cluster` \| `detail` (drives length/role — see SEO-AEO topology). |
| `targetQuery` | The exact query the article targets. |
| `relatedQueries` | 3–5 secondary queries. |
| `quickAnswer` | 40–60 word direct answer; min 40 chars enforced; marked Speakable. |
| `publishedAt` / `updatedAt` | Dates (string → Date). |
| `author` | Default "ITIN Lending Editorial Team". |
| `category` | Label for the index card / breadcrumb grouping. |
| `relatedSlugs`, `faqs` (q/a array), `published` (bool) | Linking, FAQPage schema, draft flag. |

## Automated daily content generator

The flagship content system. **One research-backed, schema-compliant article per
day, fully automated.**

### Script — `web/scripts/daily-post.mjs`
- Reads site identity from `consts.ts` (so the **same script is portable across all
  three sites** with no per-repo edits).
- Lists existing articles to **dedupe** target queries/slugs and to give the model
  the current cluster map.
- Calls the **Claude API** (`claude-sonnet-4-6` by default, override via
  `DAILY_POST_MODEL`) with the **web_search tool** (max 6 uses) to find current,
  high-intent, low-competition ITIN keywords not already covered.
- System prompt enforces the mandatory structure: Quick Answer, body written as a
  **reader Q&A** (first-person reader-style question H2s, with rotating italic
  lead-ins like *"A question we hear often:"* on ~half the sections — never a
  fabricated person/name/testimonial), **varied answer depth** (most sections
  ~134–167 words, 2–3 sections run two full paragraphs ~250–320 words), a
  comparison table, a cited stat every 150–200 words, 5+ FAQs, 1000–1600 words,
  original wording, natural internal links.
- Model returns a single JSON block; the script strips web-search citation markup,
  validates required fields + slug format + quickAnswer length + ≥1 FAQ, dedupes
  against existing slugs, and writes `src/content/articles/<slug>.md` with proper
  YAML frontmatter (`published: true`).
- **Side-effect-free:** it only writes the file. It does **not** build, commit, or
  deploy — the workflow does that. Exit 0 with no file = "nothing new today" (not
  an error). Requires `ANTHROPIC_API_KEY`.

### Workflow — `.github/workflows/daily-content.yml`
- Cron `0 13 * * *` (13:00 UTC daily) + manual `workflow_dispatch`.
- Steps: checkout → setup Node 20 → `npm ci` → run `daily-post.mjs` (with
  `ANTHROPIC_API_KEY` secret) → **if a file was written:** build+deploy via
  `deploy-to-docs.sh` → ping IndexNow → commit `docs` + `web/src/content/articles`
  and push as `github-actions[bot]`.
- `concurrency: daily-content`, `cancel-in-progress: false` so runs don't clobber
  each other. Needs `contents: write` permission.

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
4. If you want a Spanish version, add the mirror under `src/pages/es/articles/`.
5. Build + deploy (`bash web/scripts/deploy-to-docs.sh`), commit `/docs`, push.

## Current content inventory

- Detail articles: `itin-car-loan`, `itin-loan-with-bad-credit` (+ ES mirrors).
- Money pages: see [`ARCHITECTURE.md`](./ARCHITECTURE.md) / [`SEO-AEO.md`](./SEO-AEO.md).
- The daily generator grows the detail layer over time.

## Planned

- Tune the generator prompt per site once #2 and #3 launch (it already branches on
  site name for credit-card / credit-score verticals).
- Periodic content **refresh** pass (real updates — new data/sections, not just
  date bumps) per the freshness rule in the global playbook.
