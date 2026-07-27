#!/usr/bin/env node
// Internal-link checker. Walks the built site and resolves every internal link
// against the files that actually exist, so a typo'd path fails the build
// instead of shipping a 404.
//
// This exists because the two checks we already run miss it entirely: Lighthouse
// CI only visits a handful of URLs, and the site health monitor only pings the
// money pages. Broken links live in hand-authored article bodies, which neither
// one opens. The 2026-07-27 audit found 15 of them.
//
// Usage:
//   node scripts/check-links.mjs [dist-dir]      (default: ../docs)
//
// Exits 1 if any internal link 404s.

import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://itinlending.net';
const root = path.resolve(__dirname, '..', process.argv[2] ?? '../docs');

// Non-page assets are checked as plain files; everything else resolves the way
// GitHub Pages serves it (/foo -> foo.html or foo/index.html).
const ASSET_RE = /\.(xml|txt|png|svg|ico|webp|jpe?g|gif|css|js|mjs|woff2?|json|pdf|avif|mp4|webmanifest)$/i;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

// Mirrors GitHub Pages resolution order.
function resolves(urlPath) {
  const clean = urlPath.replace(/[?#].*$/, '');
  if (clean === '/' || clean === '') return existsSync(path.join(root, 'index.html'));

  const rel = clean.replace(/^\/+/, '');
  if (ASSET_RE.test(rel)) return existsSync(path.join(root, rel));

  const bare = rel.replace(/\/+$/, '');
  return (
    existsSync(path.join(root, `${bare}.html`)) ||
    existsSync(path.join(root, bare, 'index.html')) ||
    existsSync(path.join(root, bare))
  );
}

function internalPath(href) {
  const raw = href.trim();
  if (!raw || raw.startsWith('#')) return null;
  if (raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('data:')) return null;
  if (raw.startsWith(SITE)) return raw.slice(SITE.length) || '/';
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('//')) return null;
  if (!raw.startsWith('/')) return null; // relative links are rare here; skip rather than guess a base
  return raw;
}

const HREF_RE = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;

const pages = await walk(root).catch(() => {
  console.error(`check-links: no build found at ${root} — run "npm run build && bash scripts/deploy-to-docs.sh" first.`);
  process.exit(1);
});

// A body link on an /es/ page that points at an English page. These resolve, so
// they never 404 — they just dump a Spanish reader onto an English page. The
// ES articles are translated from the EN ones, so un-prefixed paths get copied
// across wholesale. Nav/footer/hreflang links are exempt (they legitimately
// cross locales); only article and page body content is checked.
// Slice from the start of the article body to the footer. A regex that tries to
// match the closing </div> stops at the first nested one, so index slicing is
// what actually works here. Nav sits above article-body, footer is cut off, and
// both legitimately link across locales.
function articleBody(html) {
  const start = html.indexOf('class="article-body"');
  if (start === -1) return null;
  const end = html.indexOf('<footer', start);
  return html.slice(start, end === -1 ? undefined : end);
}

const broken = new Map(); // target -> Set(source pages)
const localeLeaks = new Map();
let linkCount = 0;

for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const source = '/' + path.relative(root, file).replace(/\\/g, '/').replace(/(index)?\.html$/, '').replace(/\/$/, '');
  const isEsPage = source === '/es' || source.startsWith('/es/');

  for (const m of html.matchAll(HREF_RE)) {
    const target = internalPath(m[1]);
    if (!target) continue;
    linkCount++;
    if (!resolves(target)) {
      if (!broken.has(target)) broken.set(target, new Set());
      broken.get(target).add(source || '/');
    }
  }

  if (!isEsPage) continue;
  const body = articleBody(html);
  if (!body) continue;
  for (const m of body.matchAll(HREF_RE)) {
    const target = internalPath(m[1]);
    if (!target || ASSET_RE.test(target)) continue;
    if (target === '/es' || target.startsWith('/es/')) continue;
    // An ES body link is only a leak when a Spanish twin actually exists.
    if (!resolves(`/es${target}`)) continue;
    const key = `${target}  (has /es${target})`;
    if (!localeLeaks.has(key)) localeLeaks.set(key, new Set());
    localeLeaks.get(key).add(source);
  }
}

console.log(`check-links: ${linkCount} internal links across ${pages.length} pages`);

const report = (map, label) => {
  console.error(`\ncheck-links: ${map.size} ${label}:\n`);
  for (const [target, sources] of [...map].sort()) {
    console.error(`  ${target}`);
    for (const s of [...sources].sort().slice(0, 6)) console.error(`      ← ${s || '/'}`);
    if (sources.size > 6) console.error(`      ← …and ${sources.size - 6} more`);
  }
};

if (broken.size) report(broken, 'broken internal link target(s)');
if (localeLeaks.size) report(localeLeaks, 'ES page(s) linking to the English twin');

if (!broken.size && !localeLeaks.size) {
  console.log('check-links: no broken internal links, no locale leaks ✓');
  process.exit(0);
}
console.error('');
process.exit(1);
