# Picks App Content Pipelines (StickPicks + PerfumePicks + PourPicks)

The Picks apps are **mobile apps with marketing sites** that we want ranking in
Google + answer engines. They run the **same daily-content + search-submission
pipeline as the ITIN sites**, ported with a few deliberate deltas (they're
monolingual, vertical-specific, and use an editorial, never personal, byline).

| | StickPicks | PerfumePicks | PourPicks |
|---|---|---|---|
| **Domain** | stickpicks.app | perfumepicks.app | pourpicks.app |
| **Local folder** | `~/StickPicks` | `~/PerfumePicks` | `~/PourPicks` |
| **Vertical** | Cigar collecting / humidors | Perfume / fragrance collecting | Bourbon / whiskey collecting (21+) |
| **Editorial byline** | `Stick Picks` | `Perfume Picks` | `Pour Picks` |
| **IndexNow key** | `1ed03389477982730cdcd925db13c594` | `6459c4aceebc6ca8fcb832a1df09ad12` | `ded77e8bf125f4508bd90846977d3db9` |
| **Daily cron (UTC)** | `0 13 * * *` | `0 11 * * *` | `0 12 * * *` |
| **Deploy** | `/docs` on `main` | workflow `pages.yml` (build → Pages) | `/docs` on `main` (like ITIN) |

## Live status (2026-06-17): LIVE, generating content

All three are now generating daily content through the same humanized pipeline as
the ITIN sites. The `ANTHROPIC_API_KEY` repo secret was set on all three on
2026-06-17 (the prior gating issue), and a manual `daily-content.yml` run on each
produced + built + deployed its first article:

| Repo | First article (2026-06-17) |
|---|---|
| StickPicks | `how-to-organize-a-humidor.md` |
| PerfumePicks | `how-to-rotate-your-perfume-collection.md` |
| PourPicks | `single-barrel-vs-small-batch-bourbon.md` |

No "humanizer skipped" warnings on any run, so `lib/humanize.mjs` ran clean. The
daily crons (staggered per the table above) take over from here.

### Two more app sites on the identical pipeline (not "Picks" brands)

Same daily-content + humanizer + search-submission stack, different brands and
verticals, also switched on 2026-06-17:

| Site | Domain | Repo | Vertical |
|---|---|---|---|
| Underdial | underdial.com | `bguillow-rgb/Underdial-Web` | Watches under $1,000 |
| Percolate | percolateapp.com | `bguillow-rgb/Percolate-Web` | Specialty coffee |

Both were dormant for the same reason (missing `ANTHROPIC_API_KEY`) AND were
missing `lib/humanize.mjs` entirely (they predated the humanizer port). On
2026-06-17 the secret was set and the humanizer was ported + wired into
`generateArticle()` on both, matching the other sites. First articles generated:
Underdial `watch-size-guide-wrist-fit`, Percolate `how-to-store-coffee-beans-fresh`.

To rotate or reset the key later:

```
gh secret set ANTHROPIC_API_KEY --repo bguillow-rgb/StickPicks   --body '<key>'
gh secret set ANTHROPIC_API_KEY --repo bguillow-rgb/PerfumePicks --body '<key>'
gh secret set ANTHROPIC_API_KEY --repo bguillow-rgb/PourPicks    --body '<key>'
```

Optional but recommended per repo: `GOOGLE_INDEXING_SA_KEY` (Google Indexing API)
and repo **Variables** `PUBLIC_GA4_ID` / `PUBLIC_GSC_VERIFICATION` (bake analytics
into the build; empty just disables them). PourPicks and StickPicks had their
`web/scripts` Node automation committed on 2026-06-17 (it had never been pushed).

Both operated by **Timberline Ventures LLC**, one Google AdSense account context
(AdSense monetization itself is N/A on these app sites — they exist to rank and
drive installs).

## What was ported from ITIN

The full content pipeline, minus the bilingual layer:

- `web/scripts/lib/generate.mjs` — Claude API + `web_search` article generator.
  The vertical + audience are **baked per-repo** (constants `VERTICAL` /
  `AUDIENCE` at the top) rather than branched on site name like ITIN's
  `daily-post.mjs`. `loadSite()` reads identity from `consts.ts` and sets the
  byline to the **site name** (`SITE.name`) — never a personal name.
- `web/scripts/lib/articles.mjs` — `readArticleMeta` (skips `_template.md`),
  `computeRelated` (token-overlap; **no** category bonus), `setRelatedSlugs`.
  Stopword list is vertical-tuned (fragrance vs. bourbon head terms).
- `web/scripts/lib/build-md.mjs` — `buildMarkdown`. **No `category` field** and
  **no `howToSteps`** in generated output (PourPicks keeps `howToSteps` as an
  optional schema field on hand-written articles; generated files don't use it).
- `web/scripts/lib/publish.mjs` — `publishArticle` + `relinkDir`, **monolingual**
  (no ES translate step).
- `web/scripts/daily-post.mjs` — one detail article/day; emits `slug`/`wrote` to
  `GITHUB_OUTPUT`.
- `web/scripts/seed-content.mjs` — one-shot batch (`--count`, `--pillar`,
  `--topic`).
- `web/scripts/indexnow.mjs` — per-repo host + key literal.
- `web/scripts/google-index.mjs` — portable; `--article <slug>` expands to
  `/articles/<slug>` only (no `/es`).
- `web/scripts/gsc-verify-sa.mjs` — verbatim (derives origin from `consts.ts`);
  makes the SA a standalone verified owner via the Site Verification API.
- `web/scripts/gsc-report.mjs` — single-locale (dimension `query`; no EN/ES split).
- `web/scripts/monitor.mjs` — per-repo default host + UA; hreflang check removed
  (monolingual); canonical + JSON-LD checks kept.

## Adaptation deltas vs. ITIN (why they differ)

- **Monolingual.** No `articlesEs`, no `translateArticle`, no `/es` routes. The
  publish/daily/seed scripts drop the ES coupling entirely.
- **Vertical baked in `generate.mjs`.** ITIN's generator infers the vertical from
  the site name across three credit sites; the Picks apps each have one vertical,
  so it's a constant. PourPicks' prompt also carries a **21+ / responsible-content**
  guardrail (no targeting minors, frame around appreciation/value not intoxication).
- **Editorial byline only.** `SITE.name` is the author. Memory rule: never publish
  Bob Guillow's personal byline. `consts.ts` `founder.name` (Bob Guillow) is used
  only for Person/Organization entity schema, not article bylines.
- **No `category`.** Dropped from generated frontmatter (the app sites' article
  schema doesn't use it; Zod strips unknown keys anyway).
- **IndexNow not duplicated in daily-content.** Both repos already have
  `indexnow.yml` firing on `docs/**` push (PourPicks) / Pages publish
  (PerfumePicks), so the daily workflow doesn't re-ping IndexNow — it only pings
  the **Google Indexing API** directly for the new article.

## Workflows added (per repo, `.github/workflows/`)

| Workflow | Trigger | Purpose |
|---|---|---|
| `daily-content.yml` | daily cron + dispatch | generate 1 article → build → deploy → Google Indexing ping → commit/push |
| `seed-content.yml` | dispatch only | batch seed the cluster (count / pillar / topic inputs) |
| `gsc-report.yml` | Mon cron + dispatch | last-7d-vs-prior-7d GSC mover report (no-op until `GSC_SA_KEY` set) |
| `monitor.yml` | daily cron + dispatch | live-site health (sitemap 200s, TLS, JSON-LD) |
| `lighthouse.yml` | Mon cron + dispatch | CWV + SEO assertions (`lighthouserc.json` at repo root) |

Crons are **staggered** across the Timberline portfolio (ITIN daily 13:00,
PerfumePicks 11:00, PourPicks 12:00) so concurrent pushes don't collide.

## Build-time env (set in each repo's GitHub settings)

- **Secrets:** `ANTHROPIC_API_KEY` (required for generation), `GSC_SA_KEY` +
  `GSC_PROPERTY` (weekly report), `GOOGLE_INDEXING_SA_KEY` (Google Indexing ping).
- **Variables:** `PUBLIC_GA4_ID`, `PUBLIC_GSC_VERIFICATION` (empty = analytics
  off, which is the current state). The IndexNow key is baked as a literal in the
  workflows (public by design).

## Manual handoff to enable everything (one-time)

1. Set the secrets + variables above on **both** repos.
2. In the GCP project for the Indexing service account, enable **Web Search
   Indexing API** + **Site Verification API**.
3. Run `node scripts/gsc-verify-sa.mjs token`, deploy, then
   `node scripts/gsc-verify-sa.mjs verify` for **each** site to make the SA a
   verified owner of `perfumepicks.app` + `pourpicks.app` (required before the
   Google Indexing ping is accepted).
