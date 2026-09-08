#!/usr/bin/env node
// Fails the build if a cross-site link would go unmeasured.
//
// Why this exists: from launch until 2026-09-01 every custom GA4 event was
// silently dropped in the browser (a `window.gtag` scoping bug), and once that
// was fixed `cross_site_click` still read zero, because the delegate matched an
// ATTRIBUTE that exactly one link on the site carried. Two audits reported the
// zero and could not tell a dead pipe from dead demand. The 2026-09-07 audit
// finally separated them: 1,567 impressions of card- and credit-score intent
// arrive on this domain every 28 days and the handoff was invisible on both
// ends.
//
// The fix was to match the DESTINATION instead. This script is what keeps it
// fixed. It extracts the REAL delegate out of the built HTML, runs it against a
// stub DOM, and clicks the REAL anchors from the build. So it tests shipped
// code, not a description of it.
//
// Checks, per built page sampled:
//   1. every outbound sister-site link carries the cross-site UTMs
//   2. the delegate fires cross_site_click for each of them
//   3. the delegate does NOT fire for ordinary internal links
//
// Usage: node scripts/check-cross-site.mjs dist

import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import vm from 'node:vm';

const root = process.argv[2] ?? 'dist';
const SISTER = /\/\/([a-z0-9-]+\.)*itincredit(card|score)\.com([\/?#]|$)/i;

async function walk(dir, out = []) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function anchorsOf(html) {
  return [...html.matchAll(/<a\s([^>]*?)>/g)].map((m) => {
    const attrs = {};
    for (const a of m[1].matchAll(/([a-zA-Z-]+)(?:="([^"]*)")?/g)) attrs[a[1]] = a[2] ?? '';
    if (attrs.href) attrs.href = attrs.href.replace(/&#x26;|&amp;/g, '&');
    return attrs;
  });
}

// Load the delegate once, from a page that has one, into a stub DOM.
function loadDelegate(html) {
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const src = scripts.find((s) => s.includes("addEventListener('click'"));
  if (!src) return null;
  const events = [];
  let handler = null;
  const sandbox = {
    window: { gtag: (_k, name, params) => events.push({ name, params }) },
    location: { pathname: '/' },
    document: { addEventListener: (t, fn) => { if (t === 'click') handler = fn; } },
  };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  if (!handler) return null;
  return {
    events,
    click(attrs) {
      const el = {
        getAttribute: (k) => (k in attrs ? attrs[k] : null),
        hasAttribute: (k) => k in attrs,
        classList: { contains: (c) => (attrs.class || '').split(/\s+/).includes(c) },
      };
      handler({ target: { closest: (sel) => (sel === 'a[href]' && attrs.href != null ? el : null) } });
    },
  };
}

const files = await walk(root);
if (!files.length) {
  console.error(`check-cross-site: no HTML under ${root}`);
  process.exit(1);
}

const seed = files.map((f) => readFileSync(f, 'utf8')).find((h) => h.includes("addEventListener('click'"));
const dut = seed && loadDelegate(seed);
if (!dut) {
  console.error('check-cross-site: FAIL — no click delegate found in the build.');
  console.error('  Analytics.astro should register a document click listener that fires cross_site_click.');
  process.exit(1);
}

const problems = [];
let sisterLinks = 0;
let pagesWithSister = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const page = '/' + file.slice(root.length + 1).replace(/\.html$/, '').replace(/\/?index$/, '');
  const sister = anchorsOf(html).filter((a) => a.href && SISTER.test(a.href));
  if (!sister.length) continue;
  pagesWithSister += 1;
  for (const a of sister) {
    sisterLinks += 1;
    if (!/[?&]utm_source=/.test(a.href) || !/[?&]utm_campaign=/.test(a.href)) {
      problems.push(`${page}: untagged sister link (no UTMs) -> ${a.href}`);
    }
    const before = dut.events.length;
    dut.click(a);
    const fired = dut.events.slice(before).filter((e) => e.name === 'cross_site_click');
    if (fired.length !== 1) {
      problems.push(`${page}: delegate did not fire cross_site_click for ${a.href}`);
    }
  }
}

// Negative control: an ordinary internal link must not be counted as a handoff.
const before = dut.events.length;
dut.click({ href: '/itin-loans' });
if (dut.events.slice(before).some((e) => e.name === 'cross_site_click')) {
  problems.push('delegate fires cross_site_click on an ordinary internal link');
}

if (problems.length) {
  console.error(`check-cross-site: ${problems.length} problem(s)`);
  for (const p of problems.slice(0, 30)) console.error('  ' + p);
  if (problems.length > 30) console.error(`  ...and ${problems.length - 30} more`);
  process.exit(1);
}

console.log(
  `check-cross-site: ${sisterLinks} sister-site link(s) across ${pagesWithSister} page(s) ` +
    `— all UTM-tagged, all fire cross_site_click ✓`
);
