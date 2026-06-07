// Shared "publish one article" pipeline: compute its relatedSlugs from the
// current cluster, write the EN file, generate + write the es-419 translation,
// and refresh the relatedSlugs mesh across all articles. Used by daily-post.mjs
// and seed-content.mjs so both produce identical on-disk output.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildMarkdown } from './build-md.mjs';
import { translateArticle } from './translate.mjs';
import { readArticleMeta, computeRelated, setRelatedSlugs } from './articles.mjs';

// Write the EN article (with computed relatedSlugs) and its ES translation.
// Returns { wrote: true, translated: bool }. A translation failure does NOT
// lose the EN article — it logs and continues (backfill fills the gap later).
export async function publishArticle({ article, articlesDir, articlesEsDir, apiKey, today }) {
  if (!existsSync(articlesEsDir)) mkdirSync(articlesEsDir, { recursive: true });

  article.author = article.author || article.fallbackAuthor;
  article.publishedAt = article.publishedAt || today;
  article.tier = article.tier || 'detail';
  article.category = article.category || 'Guides';

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
    const es = await translateArticle(article, apiKey);
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
