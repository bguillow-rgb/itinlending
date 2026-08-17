#!/usr/bin/env node
// Fails the build when a page's rendered <title> or meta description would be
// truncated in the SERP.
//
// Why this exists: BaseLayout appends " | ITIN Lending" (15 chars) to every
// title, so a 50-char frontmatter title renders at 65 and Google cuts it. The
// 2026-08-10 audit found this had truncated EVERY page-1 Spanish page — titles
// rendered at 61-86 against a ~60 cut, descriptions at 174-220 against ~160.
// Those pages held positions 2.7-10.0 and had produced zero clicks across four
// consecutive audits. Rewriting the titles produced the site's first ES click
// within a week.
//
// It was fixed by hand twice (8/10 and 8/17) and both times new pages shipped
// truncated within days, because nothing stopped them. This is the stop.
//
// Checks the BUILT html in dist/, not frontmatter, because the suffix is added
// at render time and frontmatter length alone cannot tell you what ships.
//
// Usage:
//   node scripts/check-serp.mjs dist            # enforce (exits 1 on new violations)
//   node scripts/check-serp.mjs dist --report   # print every violation, always exit 0
//   node scripts/check-serp.mjs dist --update-baseline
//
// Pre-existing violations are recorded in scripts/serp-baseline.json so this
// could be turned on without a flag-day rewrite of every legacy EN page. The
// build fails on anything NOT in that baseline — new pages must ship correct,
// and the baseline can only shrink. Never add to it by hand; run
// --update-baseline only after genuinely fixing pages (it refuses to grow).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const TITLE_MAX = 60;
const DESC_MAX = 160;

const HERE = dirname(fileURLToPath(import.meta.url));
const BASELINE_PATH = join(HERE, 'serp-baseline.json');

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith('--')) ?? 'dist';
const REPORT_ONLY = args.includes('--report');
const UPDATE_BASELINE = args.includes('--update-baseline');

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

function extract(html) {
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const d = html.match(
    /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i
  );
  return {
    title: t ? decode(t[1]).trim() : null,
    description: d ? decode(d[1]).trim() : null,
  };
}

// Redirect stubs and noindex pages never appear in the SERP, so their lengths
// are irrelevant. Skipping them keeps the signal clean.
const isSkippable = (html) =>
  /<meta\s+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html) ||
  /http-equiv=["']refresh["']/i.test(html);

const files = await walk(root);
if (files.length === 0) {
  console.error(`check-serp: no .html found under "${root}" — did the build run?`);
  process.exit(1);
}

const violations = [];
let checked = 0;

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  if (isSkippable(html)) continue;
  checked++;

  const url =
    '/' +
    relative(root, f)
      .replace(/index\.html$/, '')
      .replace(/\.html$/, '')
      .replace(/\/$/, '')
      .replace(/^\/+/, '');

  const { title, description } = extract(html);
  const problems = [];

  if (!title) problems.push({ kind: 'title-missing', len: 0, text: '' });
  else if (title.length > TITLE_MAX)
    problems.push({ kind: 'title', len: title.length, text: title });

  if (!description) problems.push({ kind: 'desc-missing', len: 0, text: '' });
  else if (description.length > DESC_MAX)
    problems.push({ kind: 'desc', len: description.length, text: description });

  for (const p of problems) violations.push({ url, ...p });
}

const key = (v) => `${v.url}#${v.kind}`;
const baseline = existsSync(BASELINE_PATH)
  ? new Set(JSON.parse(readFileSync(BASELINE_PATH, 'utf8')).known)
  : new Set();

const fresh = violations.filter((v) => !baseline.has(key(v)));
const fixed = [...baseline].filter(
  (k) => !violations.some((v) => key(v) === k)
);

const label = { title: 'TITLE', desc: 'DESC', 'title-missing': 'NO TITLE', 'desc-missing': 'NO DESC' };
const cap = { title: TITLE_MAX, desc: DESC_MAX };

function print(list, heading) {
  if (list.length === 0) return;
  console.log(`\n${heading}`);
  for (const v of list.sort((a, b) => b.len - a.len)) {
    const over = cap[v.kind] ? ` (${v.len}/${cap[v.kind]}, +${v.len - cap[v.kind]})` : '';
    console.log(`  ${label[v.kind]}${over}  ${v.url}`);
    if (v.text) console.log(`      ${v.text}`);
  }
}

if (UPDATE_BASELINE) {
  // The baseline is a ratchet: it may shrink as pages get fixed, never grow.
  // Growing it would silently re-admit the exact defect this guard exists to
  // catch, which is how the 8/10 fix got undone within two days.
  const bootstrapping = !existsSync(BASELINE_PATH);
  const grew = fresh.length > 0 && !bootstrapping;
  if (grew) {
    print(fresh, `Refusing to grow the baseline — ${fresh.length} NEW violation(s):`);
    console.error('\ncheck-serp: --update-baseline can only remove entries. Fix these, then rerun.');
    process.exit(1);
  }
  const known = violations.map(key).sort();
  writeFileSync(BASELINE_PATH, JSON.stringify({ known }, null, 2) + '\n');
  console.log(
    `check-serp: baseline updated — ${known.length} known (removed ${fixed.length}).`
  );
  process.exit(0);
}

console.log(
  `check-serp: ${checked} indexable pages · title<=${TITLE_MAX} desc<=${DESC_MAX} · ` +
    `${violations.length} violation(s), ${fresh.length} new, ${baseline.size} baselined`
);

if (fixed.length) {
  console.log(
    `\n✓ ${fixed.length} baselined violation(s) now fixed — run ` +
      `\`node scripts/check-serp.mjs dist --update-baseline\` to bank the win.`
  );
}

if (REPORT_ONLY) {
  print(violations, `All ${violations.length} violation(s):`);
  process.exit(0);
}

if (fresh.length) {
  print(fresh, `${fresh.length} NEW SERP violation(s) — these would truncate in Google:`);
  console.error(
    '\ncheck-serp: FAILED.\n' +
      `  Titles must render <=${TITLE_MAX} chars INCLUDING the " | ITIN Lending" suffix (15).\n` +
      `  Descriptions must be <=${DESC_MAX}.\n` +
      '  ArticleLayout/MoneyPageLayout take an optional `h1` — carry a short SERP\n' +
      '  title and a longer on-page heading rather than truncating.\n' +
      '  Lead with the payload (documents, rates, lender names, dollar figures);\n' +
      '  never a yes/no question whose description then gives the answer away.\n'
  );
  process.exit(1);
}

console.log('check-serp: OK — no new SERP truncation.');
