import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import fs from 'node:fs';
import nodePath from 'node:path';
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
      filter: (page) => !/\/(404|thank-you|apply)(\/|$)/.test(page),
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
        // Stable per-article lastmod from frontmatter; unset for static pages.
        const lm = ARTICLE_LASTMOD[path];
        if (lm) item.lastmod = lm;
        else delete item.lastmod;
        return item;
      },
    }),
    mdx(),
  ],
});
