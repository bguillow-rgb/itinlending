#!/usr/bin/env node
// Build-time per-page Open Graph image generator. Renders a branded 1200x630
// card (theme gradient + site name + wrapped page title) per page and writes
// public/og/<slug>.png. Only the rasterized PNG is committed — no font file is
// redistributed, so there is no font-licensing concern. Run before `astro build`.
//
// Auto-adapts per site: brand colors come from src/styles/global.css and the
// site name / money-page list come from src/consts.ts.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(fileURLToPath(import.meta.url), '../..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// --- brand + site config (regex-scraped so the script stays dependency-light)
const css = read('src/styles/global.css');
const pick = (name, fallback) =>
  (css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`)) || [])[1] || fallback;
const PRIMARY = pick('primary', '#11366b');
const PRIMARY_DARK = pick('primary-dark', '#0c2750');
const ACCENT = pick('accent', '#1b9e5a');

const consts = read('src/consts.ts');
const SITE_NAME = (consts.match(/name:\s*'([^']+)'/) || [])[1] || 'ITIN';
const SITE_URL = (consts.match(/url:\s*'(https?:\/\/[^']+)'/) || [])[1] || '';
const DOMAIN = SITE_URL.replace(/^https?:\/\//, '');

// --- pages to render -------------------------------------------------------
const pages = [{ slug: 'home', title: SITE_NAME }];

// Pillar + money pages: slug/label pairs from consts.
const pillar = consts.match(/export const PILLAR = \{[\s\S]*?slug:\s*'([^']+)'[\s\S]*?label:\s*'([^']+)'/);
if (pillar) pages.push({ slug: pillar[1], title: pillar[2] });
const prodBlock = (consts.match(/export const PRODUCTS = \[([\s\S]*?)\n\];/) || [])[1] || '';
for (const m of prodBlock.matchAll(/slug:\s*'([^']+)'[\s\S]*?label:\s*'([^']+)'/g)) {
  pages.push({ slug: m[1], title: m[2] });
}

// Articles: titles from markdown frontmatter.
const artDir = path.join(root, 'src/content/articles');
if (fs.existsSync(artDir)) {
  for (const f of fs.readdirSync(artDir).filter((f) => /\.mdx?$/.test(f))) {
    const fm = fs.readFileSync(path.join(artDir, f), 'utf8').match(/^---([\s\S]*?)---/);
    const title = fm && (fm[1].match(/\ntitle:\s*['"]?(.+?)['"]?\s*\n/) || [])[1];
    pages.push({ slug: f.replace(/\.mdx?$/, ''), title: title || f });
  }
}

// --- rendering -------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(title, max = 22) {
  const words = title.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) { lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function svg(title) {
  const lines = wrap(title);
  const fs0 = lines.length > 3 ? 60 : 72;
  const startY = 340 - (lines.length - 1) * (fs0 * 0.6);
  const tspans = lines
    .map((l, i) => `<text x="90" y="${Math.round(startY + i * fs0 * 1.12)}" font-family="Helvetica, Arial, sans-serif" font-size="${fs0}" font-weight="800" fill="#ffffff" letter-spacing="-1">${esc(l)}</text>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${PRIMARY}"/><stop offset="1" stop-color="${PRIMARY_DARK}"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="0" y="618" width="1200" height="12" fill="${ACCENT}"/>
  <circle cx="108" cy="110" r="26" fill="${ACCENT}"/>
  <text x="150" y="122" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="800" fill="#ffffff">${esc(SITE_NAME)}</text>
  ${tspans}
  <text x="90" y="560" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="#ffffff" opacity="0.82">${esc(DOMAIN)} \u00b7 Independent guides</text>
</svg>`;
}

const outDir = path.join(root, 'public/og');
fs.mkdirSync(outDir, { recursive: true });
let n = 0;
for (const p of pages) {
  await sharp(Buffer.from(svg(p.title))).png().toFile(path.join(outDir, `${p.slug}.png`));
  n++;
}
console.log(`gen-og: wrote ${n} OG image(s) to public/og/ for ${DOMAIN}`);
