// IndexNow ping. Submits this site's URLs to Bing/Yandex/Naver/Seznam (Google
// does NOT use IndexNow). The key file at public/<KEY>.txt must be live first.
//
// URL source: the freshly built dist/sitemap-0.xml when it exists (the
// daily-content job builds before pinging), otherwise the LIVE sitemap. The
// fallback matters — dist/ is gitignored, so any job that pings without
// building first would otherwise die on ENOENT. That is exactly what the
// standalone indexnow.yml workflow did on every run from its creation until
// 2026-08-03: it checked out, npm ci'd, and pinged with no build, so the read
// threw, `|| true` swallowed it, and the workflow reported success while
// submitting nothing. Confirmed in the 2026-08-03 16:25 run log (ENOENT at
// node:fs:448). Pinging the live sitemap is also the more correct thing to do
// for a post-deploy job: it submits what is actually published.
//
// Usage (after the new build is deployed/live):  node scripts/indexnow.mjs
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const KEY = '4524d82c6a8008289f40cde63aad623f';
const HOST = 'itinlending.net';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distSitemap = resolve(__dirname, '../dist/sitemap-0.xml');

let sitemap;
if (existsSync(distSitemap)) {
  sitemap = readFileSync(distSitemap, 'utf8');
  console.log('IndexNow: reading URLs from dist/sitemap-0.xml (fresh build).');
} else {
  const liveUrl = `https://${HOST}/sitemap-0.xml`;
  const res = await fetch(liveUrl);
  if (!res.ok) {
    console.error(`IndexNow: no dist/sitemap-0.xml and live fetch failed — ${liveUrl} returned ${res.status}.`);
    process.exit(1);
  }
  sitemap = await res.text();
  console.log(`IndexNow: no local build found — reading URLs from ${liveUrl}.`);
}

const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (!urlList.length) {
  console.error('IndexNow: no URLs found in the sitemap.');
  process.exit(1);
}

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

console.log(`IndexNow ${HOST}: HTTP ${res.status} ${res.statusText} — submitted ${urlList.length} URLs`);
if (res.status !== 200 && res.status !== 202) {
  console.error('IndexNow: non-success status. Check the key file is live at', body.keyLocation);
  process.exit(1);
}
