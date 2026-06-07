// One-time (re-runnable) backfill for the content pipeline:
//   1. Recompute the relatedSlugs internal-link mesh across all EN articles.
//   2. Generate es-419 translations for any EN article missing one.
//   3. Recompute the relatedSlugs mesh across ES articles.
// Safe to run repeatedly: existing ES translations are skipped unless --force.
//
// Usage:  ANTHROPIC_API_KEY=... node scripts/backfill.mjs [--force] [--no-translate]
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { buildMarkdown } from './lib/build-md.mjs';
import { translateArticle } from './lib/translate.mjs';
import { readArticleMeta } from './lib/articles.mjs';
import { relinkDir } from './lib/publish.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_DIR = resolve(__dirname, '..');
const ARTICLES_DIR = join(WEB_DIR, 'src/content/articles');
const ARTICLES_ES_DIR = join(WEB_DIR, 'src/content/articles-es');

const FORCE = process.argv.includes('--force');
const NO_TRANSLATE = process.argv.includes('--no-translate');
const API_KEY = process.env.ANTHROPIC_API_KEY;

// Parse a raw EN markdown file into the object the translator + builder expect.
function parseArticleFile(raw) {
  const parts = raw.split(/^---$/m);
  const fm = parts[1] || '';
  const body = parts.slice(2).join('---').trim();
  const str = (key) =>
    (fm.match(new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)) ||
      fm.match(new RegExp(`${key}:\\s*'([^']*)'`)) ||
      [])[1] || '';
  const unq = (s) => { try { return JSON.parse(`"${s}"`); } catch { return s; } };
  const listAfter = (key) => {
    const block = (fm.match(new RegExp(`${key}:([\\s\\S]*?)\\n[a-zA-Z]`)) || [])[1] || '';
    return [...block.matchAll(/-\s*"((?:[^"\\]|\\.)*)"|-\s*'([^']*)'/g)].map((m) =>
      unq(m[1] ?? m[2])
    );
  };
  // FAQs: pull q/a pairs in order.
  const faqBlock = (fm.match(/faqs:([\s\S]*?)(?:\npublished:|$)/) || [])[1] || '';
  const faqs = [...faqBlock.matchAll(/-\s*q:\s*"((?:[^"\\]|\\.)*)"\s*\n\s*a:\s*"((?:[^"\\]|\\.)*)"/g)].map(
    (m) => ({ q: unq(m[1]), a: unq(m[2]) })
  );
  return {
    title: unq(str('title')),
    description: unq(str('description')),
    tier: str('tier') || 'detail',
    targetQuery: unq(str('targetQuery')),
    relatedQueries: listAfter('relatedQueries'),
    quickAnswer: unq(str('quickAnswer')),
    publishedAt: str('publishedAt'),
    author: unq(str('author')),
    category: unq(str('category')) || 'Guides',
    faqs,
    bodyMarkdown: body,
  };
}

// --- 1. Relink EN ---------------------------------------------------------
relinkDir(ARTICLES_DIR);
console.log(`backfill: relinked ${readArticleMeta(ARTICLES_DIR).length} EN articles`);

// --- 2. Translate missing ES ----------------------------------------------
const enFiles = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'));
if (!existsSync(ARTICLES_ES_DIR)) mkdirSync(ARTICLES_ES_DIR, { recursive: true });

if (!NO_TRANSLATE) {
  if (!API_KEY) {
    console.error('backfill: ANTHROPIC_API_KEY not set — skipping translation. Use --no-translate to silence.');
  } else {
    for (const f of enFiles) {
      const esPath = join(ARTICLES_ES_DIR, f);
      if (existsSync(esPath) && !FORCE) {
        console.log(`backfill: ES exists, skipping ${f} (use --force to overwrite)`);
        continue;
      }
      const enRaw = readFileSync(join(ARTICLES_DIR, f), 'utf8');
      const en = parseArticleFile(enRaw);
      const slug = f.replace(/\.md$/, '');
      try {
        const es = await translateArticle(en, API_KEY);
        const esArticle = {
          title: es.title,
          description: es.description,
          tier: en.tier,
          targetQuery: es.targetQuery || en.targetQuery,
          relatedQueries: es.relatedQueries || en.relatedQueries,
          quickAnswer: es.quickAnswer,
          publishedAt: en.publishedAt,
          author: en.author,
          category: es.category || en.category,
          relatedSlugs: [],
          faqs: es.faqs,
          bodyMarkdown: es.bodyMarkdown,
          published: true,
        };
        writeFileSync(esPath, buildMarkdown(esArticle), 'utf8');
        console.log(`backfill: wrote es-419 ${slug}`);
      } catch (e) {
        console.error(`backfill: translation failed for ${slug}: ${e.message}`);
      }
    }
  }
}

// --- 3. Relink ES ---------------------------------------------------------
relinkDir(ARTICLES_ES_DIR);
console.log(`backfill: relinked ${readArticleMeta(ARTICLES_ES_DIR).length} ES articles`);
console.log('backfill: done');
