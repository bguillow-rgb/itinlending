// Resolve and repair the internal links a generated article body contains,
// BEFORE the file is written to src/content.
//
// Why this exists
// ---------------
// The generator is told to "internal-link naturally to relevant existing pages"
// and is handed a list of article SLUGS. It is never told that articles are
// served under /articles/<slug>, so it writes [text](/secured-credit-cards-itin)
// when the real route is /articles/secured-credit-cards-itin. Those links 404.
//
// The postbuild check-links gate catches them correctly and fails the build —
// which is the right call for a 404, but it happens AFTER the article is
// generated and BEFORE anything is committed, so the whole article is thrown
// away. That cost itincreditcard.com its 2026-08-03 and 2026-08-05 slots (the
// same article, `credit-card-work-visa-itin`, generated and discarded twice)
// and left the site 7 days without a publish.
//
// Fixing the gate to ignore these would ship 404s. Fixing the prompt alone is
// not enough: the model will still occasionally invent a path, and one bad link
// costs a whole slot. So links are resolved against the site's REAL routes at
// write time and repaired deterministically. The gate stays exactly as strict
// as it was — this just stops feeding it broken input.
//
// Repair order for a root-relative link:
//   1. already a real route            -> keep (ES pages prefer their /es twin)
//   2. /<slug> and /articles/<slug> is real -> rewrite to /articles/<slug>
//   3. resolvable by adding the locale prefix -> add it
//   4. nothing resolves                -> unwrap: keep the anchor text, drop the
//                                         link. Never ship a link we know 404s.
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Routes Astro generates that are not worth linking to from article prose, so
// a model that guesses one gets unwrapped rather than pointed at a dead end.
const NOT_LINKABLE = new Set(['/404', '/es/404']);

// Walk src/pages for static routes, plus the two content collections for the
// dynamic /articles/<slug> routes. This mirrors what Astro actually builds, so
// it stays correct without needing a build to have run first.
export function loadRoutes(webDir) {
  const routes = new Set(['/']);
  // Directories served by a dynamic [param].astro route whose real URLs we
  // cannot enumerate without running getStaticPaths. Anything under one of these
  // is treated as "cannot disprove" and left completely alone.
  //
  // This is not hypothetical: itinlending serves ~50 state pages from
  // src/pages/itin-loans/[state].astro. Skipping [ ] filenames without recording
  // the prefix made every one of them invisible to the route table, and an
  // earlier build of this module unwrapped live links to /itin-loans/texas and
  // /itin-loans/california — both real, both returning 200. Deleting a valid
  // link is far worse than leaving a bad one for check-links to catch.
  const wildcards = new Set();
  const pagesDir = join(webDir, 'src/pages');

  const walkPages = (dir, prefix = '') => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walkPages(join(dir, entry.name), `${prefix}/${entry.name}`);
        continue;
      }
      // rss.xml.js is an asset, not a page.
      if (entry.name.startsWith('[')) {
        if (entry.name.endsWith('.astro')) wildcards.add(prefix || '/');
        continue;
      }
      if (!entry.name.endsWith('.astro')) continue;
      const base = entry.name.replace(/\.astro$/, '');
      routes.add(base === 'index' ? prefix || '/' : `${prefix}/${base}`);
    }
  };
  walkPages(pagesDir);

  // The article routes are the one dynamic case we CAN enumerate, straight from
  // the content collections below, so they stay strict: a link to a nonexistent
  // /articles/<slug> should still be caught, not waved through as a wildcard.
  wildcards.delete('/articles');
  wildcards.delete('/es/articles');

  const addArticles = (dir, prefix) => {
    if (!existsSync(dir)) return;
    for (const f of readdirSync(dir)) {
      if (f.endsWith('.md')) routes.add(`${prefix}/${f.replace(/\.md$/, '')}`);
    }
  };
  addArticles(join(webDir, 'src/content/articles'), '/articles');
  addArticles(join(webDir, 'src/content/articles-es'), '/es/articles');

  for (const dead of NOT_LINKABLE) routes.delete(dead);
  // Carried as a property, not as members: callers spread this Set to build the
  // prompt's static-page list, and a "/itin-loans/*" entry there would be noise.
  Object.defineProperty(routes, 'wildcards', { value: wildcards, enumerable: false });
  return routes;
}

const isExternal = (href) =>
  /^(https?:)?\/\//i.test(href) || /^(mailto:|tel:|data:|#)/i.test(href);

// Assets are checked against real files by check-links, not against routes, so
// leave them untouched here.
const ASSET_RE =
  /\.(xml|txt|png|svg|ico|webp|jpe?g|gif|css|js|mjs|woff2?|json|pdf|avif|mp4|webmanifest)$/i;

// Resolve one root-relative path against the real route table.
// Returns the corrected path, or null when nothing resolves (caller unwraps).
function resolvePath(rawPath, routes, locale) {
  const [, pathOnly = '', suffix = ''] = rawPath.match(/^([^?#]*)([?#].*)?$/) || [];
  const clean = pathOnly.replace(/\/+$/, '') || '/';
  const keep = (p) => `${p}${suffix}`;

  const esTwin = (p) => (p === '/' ? '/es' : `/es${p}`);
  const isEsPath = clean === '/es' || clean.startsWith('/es/');

  // Under a dynamic [param] route we cannot know which slugs exist, so we make
  // no claim about existence: never unwrap it, never treat it as a bare article
  // slug. But locale still applies — itinlending mirrors its state pages at
  // es/itin-loans/[state].astro, and leaving an ES article pointing at
  // /itin-loans/texas is exactly the locale leak the gate rejects. So localize
  // when the ES side of the same wildcard exists, then stop.
  const wildcards = routes.wildcards;
  if (wildcards && wildcards.size) {
    for (const w of wildcards) {
      const base = w === '/' ? '' : w;
      if (!clean.startsWith(`${base}/`)) continue;
      if (locale === 'es' && !isEsPath && (wildcards.has(esTwin(w)) || routes.has(esTwin(w)))) {
        return keep(esTwin(clean));
      }
      return keep(clean);
    }
  }

  // 1. Already real. On an ES page, prefer the Spanish twin when one exists —
  //    this is the "ES page linking to its English twin" leak the gate rejects.
  if (routes.has(clean)) {
    if (locale === 'es' && !isEsPath && routes.has(esTwin(clean))) return keep(esTwin(clean));
    return keep(clean);
  }

  // 2. The actual defect: a bare /<slug> that is really an article.
  const bare = clean.replace(/^\/+/, '');
  if (bare && !bare.includes('/')) {
    if (locale === 'es' && routes.has(`/es/articles/${bare}`)) return keep(`/es/articles/${bare}`);
    if (routes.has(`/articles/${bare}`)) {
      // On an ES page an EN article is a leak, but only when no twin exists is
      // it acceptable; prefer the twin, fall back to EN rather than dropping a
      // link to real content.
      return keep(`/articles/${bare}`);
    }
  }

  // 3. An ES body writing /articles/<slug> or /about when the twin exists.
  if (locale === 'es' && !isEsPath && routes.has(esTwin(clean))) return keep(esTwin(clean));

  // 4. An ES-prefixed path whose Spanish version does not exist but the English
  //    one does (e.g. /es/articles/<en-only-slug>).
  if (isEsPath) {
    const stripped = clean.replace(/^\/es/, '') || '/';
    if (routes.has(stripped)) return keep(stripped);
  }

  return null;
}

const MD_LINK_RE = /(!?)\[([^\]]*)\]\(\s*(<[^>]*>|[^)\s]+)((?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?)\s*\)/g;
const HTML_LINK_RE = /<a\b[^>]*?href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;

// Repair every internal link in a markdown body. Returns the rewritten text
// plus what changed, so the pipeline can log it and a human can audit a run.
export function normalizeLinks(markdown, { routes, locale = 'en' } = {}) {
  const fixed = [];
  const dropped = [];
  let text = String(markdown ?? '');

  text = text.replace(MD_LINK_RE, (match, bang, label, target, title) => {
    // Images: check-links resolves these as files, not routes. Leave alone.
    if (bang) return match;
    const href = target.replace(/^<|>$/g, '');
    if (isExternal(href) || ASSET_RE.test(href)) return match;
    // Relative links (no leading slash) are not used in these bodies and we
    // cannot resolve them without a base, so leave them for the gate to catch
    // rather than guessing.
    if (!href.startsWith('/')) return match;

    const next = resolvePath(href, routes, locale);
    if (next === null) {
      dropped.push(href);
      return label; // unwrap: prose survives, the dead link does not
    }
    if (next !== href) fixed.push(`${href} -> ${next}`);
    return `${bang}[${label}](${next}${title || ''})`;
  });

  // Defensive: bodies are markdown today (0 raw anchors across 44 articles),
  // but a model can emit HTML and a 404 in an <a> costs the same slot.
  text = text.replace(HTML_LINK_RE, (match, _q, href, inner) => {
    if (isExternal(href) || ASSET_RE.test(href) || !href.startsWith('/')) return match;
    const next = resolvePath(href, routes, locale);
    if (next === null) {
      dropped.push(href);
      return inner;
    }
    if (next !== href) {
      fixed.push(`${href} -> ${next}`);
      return match.replace(href, next);
    }
    return match;
  });

  return { text, fixed, dropped };
}

// Every field on an article that can carry a prose link. This list is the union
// of what the three repos used to cover separately: publish.mjs repaired the
// body (and quickAnswer on itinlending), while translate.mjs's
// localizeInternalLinks covered the body, quickAnswer, description and BOTH FAQ
// fields on the ES side. Converging on one implementation means covering all of
// them in both locales, or the merge would silently drop coverage that existed.
//
// Guarded on typeof string rather than truthiness: an absent faq.q must stay
// absent, not become the string "undefined".
const LINKABLE_FIELDS = ['bodyMarkdown', 'quickAnswer', 'description'];

// Normalize a whole article object in place. Logs a one-line summary per article
// so a CI run shows what was repaired instead of silently rewriting content.
export function normalizeArticleLinks(article, { routes, locale = 'en', label = '' } = {}) {
  const all = { fixed: [], dropped: [] };

  const run = (value) => {
    const { text, fixed, dropped } = normalizeLinks(value, { routes, locale });
    all.fixed.push(...fixed);
    all.dropped.push(...dropped);
    return text;
  };

  for (const field of LINKABLE_FIELDS) {
    if (typeof article[field] === 'string') article[field] = run(article[field]);
  }
  if (Array.isArray(article.faqs)) {
    article.faqs = article.faqs.map((f) => ({
      ...f,
      ...(typeof f?.q === 'string' ? { q: run(f.q) } : {}),
      ...(typeof f?.a === 'string' ? { a: run(f.a) } : {}),
    }));
  }

  const tag = `links${label ? `(${label})` : ''}`;
  if (all.fixed.length) console.log(`${tag}: repaired ${all.fixed.length} internal link(s)`);
  for (const f of all.fixed) console.log(`  fixed   ${f}`);
  for (const d of all.dropped) console.log(`  dropped ${d} (no such route — kept the anchor text)`);
  if (all.dropped.length) {
    console.log(
      `${tag}: ${all.dropped.length} link(s) pointed at pages that do not exist and were unwrapped.`
    );
  }
  return all;
}
