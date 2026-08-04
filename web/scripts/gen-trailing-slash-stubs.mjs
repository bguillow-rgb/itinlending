#!/usr/bin/env node
// Trailing-slash redirect stubs. The site builds with `build.format: 'file'`
// and `trailingSlash: 'never'`, so every page ships as `foo.html` and GitHub
// Pages 404s the `/foo/` spelling of every URL — which is how we lost a
// MarketCall campaign approval on 2026-08-04 ("url is not working": they
// checked https://itinlending.net/es/). Switching Astro to format 'directory'
// would fix the slash form but make Pages 301 every slash-LESS URL to its
// slash twin — a full URL migration of everything already indexed in GSC.
// Instead we keep 'file' and emit a `foo/index.html` redirect stub next to
// every `foo.html`, using the same noindex + canonical + meta-refresh pattern
// as the legacy WordPress stubs in public/. Both spellings now resolve; the
// slash form forwards to the slash-less canonical.
//
// Runs from npm `postbuild` (before check-links), so CI's deploy-to-docs.sh
// picks it up too. Existing `foo/index.html` files (the hand-made legacy
// redirects copied from public/) are never overwritten.
//
// Usage: node scripts/gen-trailing-slash-stubs.mjs [dist-dir]   (default: dist)

import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE = 'https://itinlending.net';
const root = path.resolve(__dirname, '..', process.argv[2] ?? 'dist');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const files = await walk(root).catch(() => {
  console.error(`gen-trailing-slash-stubs: no build found at ${root}`);
  process.exit(1);
});

let made = 0;
let kept = 0;
for (const file of files) {
  const name = path.basename(file);
  if (name === 'index.html') continue; // already serves the slash form
  if (name === '404.html') continue; // Pages' 404 handler, not a page URL
  if (/^google[0-9a-f]+\.html$/.test(name)) continue; // GSC verification file

  const rel = path.relative(root, file).replace(/\.html$/, '');
  const urlPath = '/' + rel.split(path.sep).join('/');
  const stub = path.join(root, rel, 'index.html');
  if (existsSync(stub)) {
    kept++; // hand-made legacy redirect from public/ — its target wins
    continue;
  }
  await mkdir(path.dirname(stub), { recursive: true });
  await writeFile(
    stub,
    `<!doctype html><meta charset="utf-8"><title>Redirecting…</title>` +
      `<meta name="robots" content="noindex">` +
      `<link rel="canonical" href="${SITE}${urlPath}">` +
      `<meta http-equiv="refresh" content="0;url=${urlPath}">` +
      `<body><a href="${urlPath}">Redirecting to ${urlPath}</a></body>`,
  );
  made++;
}
console.log(
  `gen-trailing-slash-stubs: ${made} stubs written, ${kept} existing index.html kept under ${root}`,
);
