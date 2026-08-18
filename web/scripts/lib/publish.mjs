// Shared "publish one article" pipeline: compute its relatedSlugs from the
// current cluster, write the EN file, generate + write the es-419 translation,
// and refresh the relatedSlugs mesh across all articles. Used by daily-post.mjs
// and seed-content.mjs so both produce identical on-disk output.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildMarkdown } from './build-md.mjs';
import { translateArticle } from './translate.mjs';
import { readArticleMeta, computeRelated, setRelatedSlugs } from './articles.mjs';
import { loadRoutes, normalizeArticleLinks } from './links.mjs';

// Pick a stable byline for a slug from the pen-name roster. Hashing the slug
// keeps the same article on the same author across re-runs while rotating
// authors across the site so it doesn't read as written by one hand. Falls back
// to the single editorial name when no roster is configured.
function pickAuthor(slug, roster, fallback) {
  if (!Array.isArray(roster) || roster.length === 0) return fallback;
  let h = 0;
  for (const ch of String(slug)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return roster[h % roster.length];
}

// Write the EN article (with computed relatedSlugs) and its ES translation.
// Returns { wrote: true, translated: bool }. A translation failure does NOT
// lose the EN article — it logs and continues (backfill fills the gap later).
export async function publishArticle({ article, articlesDir, articlesEsDir, apiKey, today, siteName }) {
  if (!existsSync(articlesEsDir)) mkdirSync(articlesEsDir, { recursive: true });

  article.author = article.author || pickAuthor(article.slug, article.authorRoster, article.fallbackAuthor);
  article.publishedAt = article.publishedAt || today;
  article.tier = article.tier || 'detail';
  article.category = article.category || 'Guides';

  // Repair the internal links the model invented BEFORE writing the file. The
  // postbuild check-links gate would otherwise fail the build on a bad path and
  // the whole generated article would be discarded uncommitted — see
  // scripts/lib/links.mjs for the slots this cost itincreditcard.com.
  // The route table includes this article's own slug so siblings can link to it.
  const webDir = resolve(articlesDir, '..', '..', '..');
  const routes = loadRoutes(webDir);
  routes.add(`/articles/${article.slug}`);
  routes.add(`/es/articles/${article.slug}`);
  normalizeArticleLinks(article, { routes, locale: 'en', label: article.slug });

  const enMeta = readArticleMeta(articlesDir);
  article.relatedSlugs = computeRelated(
    {
      slug: article.slug,
      title: article.title,
      targetQuery: article.targetQuery,
      category: article.category,
      relatedQueries: article.relatedQueries,
    },
    enMeta
  );

  writeFileSync(join(articlesDir, `${article.slug}.md`), buildMarkdown(article), 'utf8');

  let translated = false;
  try {
    const es = await translateArticle(article, apiKey, siteName);
    // Same repair for the translation, at locale 'es': the translator copies the
    // EN body's paths across wholesale, which is exactly the "ES page linking to
    // its English twin" leak the gate also rejects.
    normalizeArticleLinks(es, { routes, locale: 'es', label: `es/${article.slug}` });
    writeFileSync(
      join(articlesEsDir, `${article.slug}.md`),
      buildMarkdown({
        title: es.title,
        description: es.description,
        tier: article.tier,
        targetQuery: es.targetQuery || article.targetQuery,
        relatedQueries: es.relatedQueries || article.relatedQueries,
        quickAnswer: es.quickAnswer,
        publishedAt: article.publishedAt,
        author: article.author,
        category: es.category || article.category,
        relatedSlugs: article.relatedSlugs,
        faqs: es.faqs,
        bodyMarkdown: es.bodyMarkdown,
        published: true,
      }),
      'utf8'
    );
    translated = true;
  } catch (e) {
    console.error(`publish: es-419 translation failed for ${article.slug} (EN kept): ${e.message}`);
  }
  return { wrote: true, translated };
}

// Recompute and rewrite the relatedSlugs block in every file of a content dir.
export function relinkDir(dir) {
  const meta = readArticleMeta(dir);
  for (const a of meta) {
    const related = computeRelated(a, meta);
    const p = join(dir, `${a.slug}.md`);
    const raw = readFileSync(p, 'utf8');
    const next = setRelatedSlugs(raw, related);
    if (next !== raw) writeFileSync(p, next, 'utf8');
  }
}
