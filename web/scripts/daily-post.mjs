// Daily SEO post generator. Researches current high-intent keywords in this
// site's vertical via the Claude API + web search, picks ONE target query not
// already covered, writes a schema-compliant EN article to
// src/content/articles/<slug>.md, then generates its es-419 translation to
// src/content/articles-es/<slug>.md and refreshes the relatedSlugs internal-
// link mesh across all articles. It does NOT build, commit, or deploy — the
// GitHub Actions workflow does that after this script writes the files.
//
// Usage:  ANTHROPIC_API_KEY=... node scripts/daily-post.mjs
// Exit 0 + no file written means "nothing new to publish today" (not an error).
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { loadSite, generateArticle } from './lib/generate.mjs';
import { readArticleMeta } from './lib/articles.mjs';
import { publishArticle, relinkDir } from './lib/publish.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_DIR = resolve(__dirname, '..');
const ARTICLES_DIR = join(WEB_DIR, 'src/content/articles');
const ARTICLES_ES_DIR = join(WEB_DIR, 'src/content/articles-es');

const MODEL = process.env.DAILY_POST_MODEL || 'claude-sonnet-4-6';
const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('daily-post: ANTHROPIC_API_KEY is not set. Aborting.');
  process.exit(1);
}

const SITE = loadSite(join(WEB_DIR, 'src/consts.ts'));

// Existing articles: dedupe + give the model the current cluster map.
const existing = readArticleMeta(ARTICLES_DIR);
const existingSlugs = new Set(existing.map((a) => a.slug));
const existingList =
  existing.map((a) => `- ${a.slug} | "${a.title}" | target: ${a.targetQuery}`).join('\n') ||
  '(none yet)';

const today = new Date().toISOString().slice(0, 10);

// Cadence: this workflow runs Mon/Wed/Fri (see .github/workflows/daily-content.yml).
// Monday = the weekly FLAGSHIP (deep, original-data, link-worthy cluster owner);
// Wed/Fri = cluster detail posts. Topic hints come from scripts/topic-backlog.json
// (seeded from GSC buried-but-real-demand queries), rotated weekly so hints vary
// without any "used" state; the existingList dedup prevents rewriting a covered topic.
const dow = new Date().getUTCDay(); // 0=Sun .. 6=Sat
// DAILY_POST_TIER (a workflow_dispatch input) forces a tier for manual/test runs;
// otherwise Monday = flagship, other scheduled days (Wed/Fri) = cluster detail.
const tier = process.env.DAILY_POST_TIER || (dow === 1 ? 'flagship' : 'detail');

let topicHint;
const backlogPath = join(WEB_DIR, 'scripts/topic-backlog.json');
if (existsSync(backlogPath)) {
  try {
    const backlog = JSON.parse(readFileSync(backlogPath, 'utf8'));
    const pool = backlog[tier] || [];
    if (pool.length) {
      const weekIdx = Math.floor(Date.now() / (7 * 864e5));
      topicHint = pool[weekIdx % pool.length];
    }
  } catch (e) {
    console.error(`daily-post: could not read topic-backlog.json: ${e.message}`);
  }
}
console.log(`daily-post: tier=${tier}${topicHint ? ` hint="${topicHint}"` : ''}`);

let article;
try {
  article = await generateArticle({
    apiKey: API_KEY,
    model: MODEL,
    site: SITE,
    tier,
    topicHint,
    existingList,
    existingSlugs,
    today,
  });
} catch (e) {
  console.error(`daily-post: generation failed: ${e.message}`);
  process.exit(1);
}

if (existingSlugs.has(article.slug)) {
  console.log(`daily-post: slug "${article.slug}" already exists — nothing new to publish today.`);
  process.exit(0);
}
if (existsSync(join(ARTICLES_DIR, `${article.slug}.md`))) {
  console.log(`daily-post: ${article.slug}.md already exists — skipping.`);
  process.exit(0);
}

article.fallbackAuthor = SITE.author;
article.authorRoster = SITE.authors;
const { translated } = await publishArticle({
  article,
  articlesDir: ARTICLES_DIR,
  articlesEsDir: ARTICLES_ES_DIR,
  apiKey: API_KEY,
  today,
});
console.log(`daily-post: wrote ${article.slug}.md`);
console.log(`  title:   ${article.title}`);
console.log(`  target:  ${article.targetQuery}`);
console.log(`  related: ${article.relatedSlugs.join(', ') || '(none)'}`);
console.log(`  es-419:  ${translated ? 'translated' : 'FAILED (backfill will retry)'}`);

// New article changes the cluster, so older articles can now link to it.
relinkDir(ARTICLES_DIR);
relinkDir(ARTICLES_ES_DIR);
console.log('daily-post: refreshed relatedSlugs mesh');

// Emit the new slug for the workflow (GitHub Actions reads stdout / file).
if (process.env.GITHUB_OUTPUT) {
  writeFileSync(process.env.GITHUB_OUTPUT, `slug=${article.slug}\nwrote=true\n`, { flag: 'a' });
}
