// Translate an English article into Latin-American Spanish (es-419) via the
// Claude API. Used by daily-post.mjs (fresh articles) and backfill.mjs
// (existing articles). Returns the translated fields; the caller assembles the
// es-419 markdown file (keeping slug, tier, dates, author, relatedSlugs from EN).
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MODEL = process.env.TRANSLATE_MODEL || 'claude-sonnet-4-6';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '..', '..', 'src');

const ASSET_RE = /\.(xml|txt|png|svg|ico|webp|jpe?g|gif|css|js|mjs|woff2?|json|pdf|avif|mp4|webmanifest)$/i;

// Does a Spanish twin exist for this English path? Mirrors the leak rule in
// scripts/check-links.mjs ("only a leak when /es<path> resolves"), but against
// the source tree, since translation happens before anything is built.
function hasEsTwin(urlPath) {
  const clean = urlPath.replace(/[?#].*$/, '').replace(/\/+$/, '');
  if (!clean || clean === '/') return true; // "/" has "/es"
  const seg = clean.replace(/^\/+/, '').split('/');

  // Articles render from the es-419 collection via es/articles/[...slug].astro.
  if (seg[0] === 'articles') {
    if (seg.length === 1) return true; // /articles -> /es/articles
    if (seg.length !== 2) return false;
    return existsSync(path.join(SRC, 'content', 'articles-es', `${seg[1]}.md`));
  }

  if (seg.length === 1) {
    return (
      existsSync(path.join(SRC, 'pages', 'es', `${seg[0]}.astro`)) ||
      existsSync(path.join(SRC, 'pages', 'es', seg[0], 'index.astro'))
    );
  }

  // Nested paths such as /itin-loans/texas, served by es/itin-loans/[state].astro.
  const dir = path.join(SRC, 'pages', 'es', ...seg.slice(0, -1));
  if (!existsSync(dir)) return false;
  const leaf = seg[seg.length - 1];
  if (existsSync(path.join(dir, `${leaf}.astro`))) return true;
  return readdirSync(dir).some((f) => /^\[.+\]\.astro$/.test(f));
}

// Matches a markdown link target or an href/src value that is a site-absolute path.
const LINK_RE = /(\]\(|(?:href|src)=["'])(\/[^)"'\s#?]*(?:[#?][^)"'\s]*)?)/g;

// The translator is told to leave URLs alone, so an English article's internal
// links survive verbatim into the Spanish copy and dump Spanish readers onto
// English pages. check-links.mjs fails the build on exactly that. Prompting the
// model to rewrite them is unreliable; do it deterministically here instead.
export function localizeInternalLinks(text) {
  if (typeof text !== 'string') return text;
  return text.replace(LINK_RE, (match, prefix, target) => {
    if (target === '/es' || target.startsWith('/es/')) return match;
    if (ASSET_RE.test(target)) return match;
    if (!hasEsTwin(target)) return match;
    return `${prefix}/es${target}`;
  });
}

const SYSTEM = `You are a professional financial translator. You translate U.S. ITIN / lending content from English into Latin-American Spanish (es-419) for a real audience of immigrants and ITIN holders.

Rules:
- Natural, warm, plain Spanish as spoken across Latin America (es-419), NOT Castilian. Use "tú", not "vosotros".
- Translate meaning, not word-for-word. It must read as if originally written in Spanish.
- Keep ALL markdown structure intact: headings (#, ##), tables, lists, bold/italics, links. Translate the visible text inside them, never the URLs or markdown syntax.
- Keep proper nouns, brand names, lender names, and acronyms (ITIN, SSN, FICO, IRS, CFPB, CDFI, non-QM) as-is. You may gloss an acronym once in parentheses if helpful.
- Keep all numbers, percentages, dollar amounts, and dates unchanged.
- Do NOT add, remove, or reorder sections. Same number of FAQs, same table rows.
- PUNCTUATION (strict): Never use em dashes or en dashes, nor their code/HTML forms (\\u2014, \\u2013, &mdash;, &ndash;). Use commas, colons, parentheses, or separate sentences instead. For numeric ranges use a plain hyphen.`;

export async function translateArticle(en, apiKey) {
  const payload = {
    title: en.title,
    description: en.description,
    quickAnswer: en.quickAnswer,
    category: en.category,
    targetQuery: en.targetQuery,
    relatedQueries: en.relatedQueries || [],
    faqs: en.faqs || [],
    bodyMarkdown: en.bodyMarkdown,
  };

  const userPrompt = `Translate this article's fields into es-419. The "targetQuery" and "relatedQueries" should become the natural Spanish queries a Spanish-speaking user would actually search (translate intent, keep them search-like). Keep "category" short.

Return ONLY a single fenced json code block with exactly these keys: title, description, quickAnswer, category, targetQuery, relatedQueries, faqs, bodyMarkdown. faqs is an array of {q, a}.

English article (JSON):
\`\`\`json
${JSON.stringify(payload)}
\`\`\``;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`translate: Anthropic API ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  const fence = text.match(/```json\s*([\s\S]*?)```/);
  const jsonText = fence ? fence[1] : text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  const out = JSON.parse(jsonText.trim());

  // Guardrails: a translation that dropped FAQs or the body is unusable.
  if (!out.bodyMarkdown || !String(out.bodyMarkdown).trim()) {
    throw new Error('translate: empty bodyMarkdown in translation');
  }
  if ((payload.faqs.length || 0) > 0 && (!Array.isArray(out.faqs) || !out.faqs.length)) {
    throw new Error('translate: translation dropped all FAQs');
  }

  // Point every internal link at its Spanish twin where one exists.
  out.bodyMarkdown = localizeInternalLinks(out.bodyMarkdown);
  out.quickAnswer = localizeInternalLinks(out.quickAnswer);
  out.description = localizeInternalLinks(out.description);
  if (Array.isArray(out.faqs)) {
    out.faqs = out.faqs.map((f) => ({
      ...f,
      q: localizeInternalLinks(f.q),
      a: localizeInternalLinks(f.a),
    }));
  }
  return out;
}
