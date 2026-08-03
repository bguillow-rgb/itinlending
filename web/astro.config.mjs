import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import fs from 'node:fs';
import nodePath from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import rehypeAffiliateLinks, { buildAffiliateRules } from './src/lib/affiliate-autolink.mjs';

// Sitemap lastmod, done right. A global `lastmod: new Date()` stamps every URL
// with the build time, so all URLs "change" on every daily-content deploy.
// Google learns to distrust that and stops reading the sitemap. Instead we give
// each article a STABLE lastmod from its committed frontmatter date (updatedAt,
// else publishedAt). File mtime and `git log` both churn under CI's shallow
// checkout, so frontmatter is the only date that survives a rebuild unchanged.
// Static pages get no lastmod (Google recrawls them on its own cadence).
const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));
function buildArticleLastmodMap() {
  const map = {};
  const collections = [
    ['articles', '/articles'],
    ['articles-es', '/es/articles'],
  ];
  for (const [dir, prefix] of collections) {
    const abs = nodePath.join(__dirname, 'src/content', dir);
    let files = [];
    try { files = fs.readdirSync(abs); } catch { continue; }
    for (const file of files) {
      if (!/\.(md|mdx)$/.test(file)) continue;
      const slug = file.replace(/\.(md|mdx)$/, '');
      let fm = '';
      try { fm = fs.readFileSync(nodePath.join(abs, file), 'utf8').slice(0, 4000); } catch { continue; }
      const pub = (fm.match(/^publishedAt:\s*["']?(\d{4}-\d{2}-\d{2})/m) || [])[1];
      const upd = (fm.match(/^updatedAt:\s*["']?(\d{4}-\d{2}-\d{2})/m) || [])[1];
      const date = upd || pub;
      if (date) map[`${prefix}/${slug}`] = date;
    }
  }
  return map;
}
const ARTICLE_LASTMOD = buildArticleLastmodMap();

// The programmatic /itin-loans/<state> pages are not a content collection, so
// buildArticleLastmodMap() never sees them and they shipped with no lastmod at
// all. That matters: as of 2026-07-29 most of them were still "URL is unknown to
// Google" months after launch, and a sitemap entry with no lastmod gives the
// crawler nothing to prioritise. Both hubs already link all 15 states, so the
// bottleneck is discovery, not internal linking.
//
// Read with fs + regex to match how the article map is built and to keep this
// config .mjs (states.ts is TypeScript). If the parse ever fails we emit no
// state lastmods rather than a wrong or churning date.
function buildStateLastmodMap() {
  const map = {};
  let src = '';
  try {
    src = fs.readFileSync(nodePath.join(__dirname, 'src/data/states.ts'), 'utf8');
  } catch {
    return map;
  }
  const date = (src.match(/^export const STATES_DATA_UPDATED = '(\d{4}-\d{2}-\d{2})'/m) || [])[1];
  if (!date) return map;
  for (const m of src.matchAll(/^\s*\{\s*slug:\s*'([a-z-]+)'/gm)) {
    map[`/itin-loans/${m[1]}`] = date;
    map[`/es/itin-loans/${m[1]}`] = date;
  }
  return map;
}
const STATE_LASTMOD = buildStateLastmodMap();

// Static pages have neither frontmatter nor a states.ts date, so they were
// shipping with no lastmod at all. That is its own bug (found in the 2026-08-03
// audit): with no freshness signal Google parks them at the back of the crawl
// queue, and the sibling site had its whole commercial surface go uncrawled for
// ~2 months, so a month of shipped changes was never seen. They now take the
// commit date of their own source file — stable across rebuilds, moves only on
// a real edit.
//
// This needs full git history, and the shallow-checkout failure mode is worse
// than it looks. `actions/checkout` defaults to fetch-depth 1; that single
// commit has no parent, so `git log --name-only` reports EVERY file as added
// in it and all ~38 pages would get the same deploy-day date — the exact
// all-URLs-changed-at-once signal this whole mechanism exists to kill. So the
// two workflows that build the site pin `fetch-depth: 0`. If
// pin `fetch-depth: 0`, AND we re-check at build time — belt and braces, so a
// new workflow that forgets the flag degrades to "no lastmod" (the previous
// behaviour) instead of poisoning every URL.
const REPO_ROOT = nodePath.join(__dirname, '..');

// web/src/pages/foo.astro -> /foo, index.astro -> /, es/index.astro -> /es.
// Dynamic routes ([...slug]) are articles/states; those are dated above.
function pageUrlPath(file) {
  const m = file.match(/^web\/src\/pages\/(.+)\.astro$/);
  if (!m || m[1].includes('[')) return null;
  const p = m[1].replace(/(^|\/)index$/, '');
  return '/' + p.replace(/\/$/, '');
}

function buildStaticLastmodMap() {
  const map = {};
  // Refuse to date anything from a shallow clone — see above. Verified: a
  // `git clone --depth 1` of this repo yields all 38 pages on one date.
  try {
    const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    }).trim();
    if (shallow !== 'false') return map;
  } catch {
    return map;
  }
  let log = '';
  try {
    // One pass over history, newest first: NUL + commit date, then its files.
    log = execFileSync(
      'git',
      ['log', '--format=%x00%cI', '--name-only', '--', 'web/src/pages'],
      { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    );
  } catch {
    return map; // no git, not a repo, or nothing tracked yet
  }
  for (const commit of log.split('\0').slice(1)) {
    const lines = commit.split('\n');
    const date = (lines.shift() || '').trim().slice(0, 10);
    if (!date) continue;
    for (const line of lines) {
      const file = line.trim();
      if (!file) continue;
      const url = pageUrlPath(file);
      // Newest commit wins: git log is reverse-chronological, so the first
      // time a path appears is the last time it actually changed.
      if (url && !map[url]) map[url] = date;
    }
  }
  return map;
}
const STATIC_LASTMOD = buildStaticLastmodMap();

// In-content affiliate auto-linking runs in production builds only (mirrors the
// PROD gate on the display ads), so `astro dev` shows clean editorial copy.
const mode = process.env.NODE_ENV ?? 'development';
const isProd = mode === 'production';
const env = loadEnv(mode, process.cwd(), 'PUBLIC_');
const affiliateRehype = isProd
  ? [[rehypeAffiliateLinks, { max: 3, rules: buildAffiliateRules(env) }]]
  : [];

// Build-time env guard. Every PUBLIC_* var is baked into the static HTML, so a
// missing one does NOT fail the build — it silently ships a degraded site. That
// has already bitten us: a local build without PUBLIC_GSC_VERIFICATION stripped
// the Search Console meta tag from 144 pages, and the same class of bug would
// drop analytics, ads, or leave the lead form POSTing nowhere. Fail loudly.
//
// Only vars whose absence is a REGRESSION are listed. The affiliate URLs are
// deliberately blank until a program is approved (see .env.example), and
// INDEXNOW / TRUSTEDFORM / WEB3FORMS are intentionally optional — so they are
// NOT required here. CI sets all four of these in
// .github/workflows/daily-content.yml.
const REQUIRED_PROD_ENV = [
  'PUBLIC_GSC_VERIFICATION', // Search Console site verification
  'PUBLIC_GA4_ID',           // analytics
  'PUBLIC_ADSENSE_ID',       // ad revenue
  'PUBLIC_LEAD_ENDPOINT',    // without this the lead form submits to nothing
];
if (isProd) {
  const missing = REQUIRED_PROD_ENV.filter((k) => !(env[k] || process.env[k]));
  if (missing.length) {
    throw new Error(
      `\nRefusing to build: missing required env var(s):\n  ${missing.join('\n  ')}\n\n` +
        `These bake into the static HTML at build time, so building without them\n` +
        `silently publishes a degraded site. Set them in web/.env (copy from\n` +
        `web/.env.example) or in the CI env block of .github/workflows/daily-content.yml.\n`
    );
  }
}

export default defineConfig({
  site: 'https://itinlending.net',
  trailingSlash: 'never',
  build: { format: 'file' }, // Generates /about.html, /apply.html, etc.
  markdown: { rehypePlugins: affiliateRehype },
  // NOTE: legacy WordPress 404 recovery is handled by physical redirect stubs in
  // public/ (see public/_redirects-legacy and the dated /2023/.. , /category/.. ,
  // /page/.. dirs) rather than Astro `redirects`, because those URLs are indexed
  // WITH a trailing slash and GitHub Pages serves trailing-slash requests from
  // <path>/index.html — which the format:'file' build would not produce.
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // Keep this list in sync with the pages that pass `noindex` to BaseLayout.
      // A noindexed URL in the sitemap is a self-contradiction: the sitemap asks
      // Google to index it, the page header refuses. GSC reports the result as
      // "Excluded by 'noindex' tag" and it inflates the not-indexed count, which
      // buries the pages that are genuinely stuck. (Caught 2026-07-29: /contact
      // and /es/contact were noindexed on all three sites but still shipped in
      // every sitemap.)
      filter: (page) => !/\/(404|thank-you|apply|contact)(\/|$)/.test(page),
      // Emit reciprocal hreflang alternates (en / es / x-default) on every URL.
      // Our EN pages are un-prefixed (/foo) and ES live at /es/foo, which doesn't
      // fit @astrojs/sitemap's i18n option (it assumes every locale is path-
      // prefixed), so we set `links` manually per entry. This belt-and-suspenders
      // the in-<head> hreflang already on each page.
      serialize(item) {
        const { origin, pathname } = new URL(item.url);
        const path = pathname.replace(/\/$/, '') || '/';
        const enPath =
          path === '/es' ? '/' : path.startsWith('/es/') ? path.slice(3) : path;
        const enUrl = origin + (enPath === '/' ? '' : enPath);
        const esUrl = origin + (enPath === '/' ? '/es' : `/es${enPath}`);
        item.links = [
          { lang: 'en', url: enUrl },
          { lang: 'es', url: esUrl },
          { lang: 'x-default', url: enUrl },
        ];
        // Stable lastmod: per-article from frontmatter, per-state from
        // STATES_DATA_UPDATED. Still unset for hand-written static pages —
        // those change rarely and Google recrawls them on its own cadence.
        const lm = ARTICLE_LASTMOD[path] ?? STATE_LASTMOD[path] ?? STATIC_LASTMOD[path];
        if (lm) item.lastmod = lm;
        else delete item.lastmod;
        return item;
      },
    }),
    mdx(),
  ],
});
