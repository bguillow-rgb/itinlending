// Build-time affiliate auto-linker for guide/article body copy.
//
// A rehype plugin that turns the FIRST natural occurrence of configured phrases
// in a guide's prose into a sponsored affiliate text link — on top of the
// display ad, not instead of it. Editorial markdown stays untouched (good for
// E-E-A-T); links are injected at build only.
//
// Rules are tried in priority order (CJ per-product first — higher value — then
// Credit Karma generic). Safeguards: never links inside headings, existing
// links, or code; de-dupes by destination URL; caps total links per guide. A
// rule with an empty URL is dropped, so the CJ per-product links stay plain text
// until their `PUBLIC_AFFILIATE_URL_*` env var is set (then they activate with
// no content change). Every link gets rel="sponsored nofollow" target="_blank".

// Shared Awin account constants (Credit Karma) — campaign-level, identical
// across all three ITIN sites. Mirrors SITE.monetize.awin in consts.ts.
const AWIN = { publisher: '2931103', advertiser: '66532', campaign: '475588' };
const CK_CREATIVES = { finance: '3641184', cards: '3641203', score: '3597059' };
const ck = (creativeId) =>
  `https://www.awin1.com/cread.php?s=${creativeId}&v=${AWIN.advertiser}&q=${AWIN.campaign}&r=${AWIN.publisher}`;

// Build the ordered rule set. `env` carries the PUBLIC_AFFILIATE_URL_* values
// (loaded in astro.config); empty ones make their rule inert.
export function buildAffiliateRules(env = {}) {
  return [
    // ---- CJ per-product deep links (env-gated; empty today → dropped) ----
    // EN + ES phrases share one URL per product so both locales activate at once.
    {
      key: 'cj-cards',
      url: env.PUBLIC_AFFILIATE_URL_CREDIT_CARDS ?? '',
      phrases: ['credit card with an ITIN', 'ITIN credit card', 'tarjeta de crédito con ITIN'],
    },
    {
      key: 'cj-personal',
      url: env.PUBLIC_AFFILIATE_URL_PERSONAL ?? '',
      phrases: ['personal loans', 'personal loan', 'préstamos personales', 'préstamo personal'],
    },
    {
      key: 'cj-mortgage',
      url: env.PUBLIC_AFFILIATE_URL_MORTGAGE ?? '',
      phrases: ['ITIN mortgage', 'home loan', 'hipoteca'],
    },
    {
      key: 'cj-auto',
      url: env.PUBLIC_AFFILIATE_URL_AUTO ?? '',
      phrases: ['auto loan', 'car loan', 'préstamo de auto', 'préstamo para carro'],
    },
    {
      key: 'cj-business',
      url: env.PUBLIC_AFFILIATE_URL_BUSINESS ?? '',
      phrases: ['business loans', 'business loan', 'préstamo de negocio', 'préstamo comercial'],
    },
    // ---- Credit Karma generic links (live now) ----
    // Phrases ordered longest-first so the most specific anchor wins on a tie.
    {
      key: 'ck-score',
      url: ck(CK_CREATIVES.score),
      phrases: [
        'check your credit score',
        'check your credit',
        'your credit score',
        'credit score',
        'puntaje de crédito',
        'revisa tu crédito',
      ],
    },
    {
      key: 'ck-cards',
      url: ck(CK_CREATIVES.cards),
      phrases: [
        'secured credit cards',
        'secured credit card',
        'credit-builder cards',
        'credit-builder card',
        'tarjetas de crédito aseguradas',
        'tarjeta de crédito asegurada',
        'tarjetas para construir crédito',
      ],
    },
    {
      key: 'ck-finance',
      url: ck(CK_CREATIVES.finance),
      phrases: [
        'see what you qualify for',
        'see how much you qualify',
        'prequalify',
        'cuánto puedes calificar',
        'precalifica',
      ],
    },
  ];
}

const SKIP_TAGS = new Set([
  'a', 'code', 'pre', 'script', 'style', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
]);

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Word-boundary match that tolerates hyphens inside a phrase (credit-builder).
const phraseRe = (p) => new RegExp(`(?<![A-Za-z0-9])${escapeRe(p)}(?![A-Za-z0-9])`, 'i');

function anchor(match) {
  return {
    type: 'element',
    tagName: 'a',
    properties: {
      href: match.url,
      rel: ['sponsored', 'nofollow'],
      target: '_blank',
      className: ['aff-link'],
    },
    children: [{ type: 'text', value: match.text }],
  };
}

// Turn a raw string into [text?, <a>, ...rest] nodes, linking earliest matches.
function linkifyString(value, state, compiled) {
  if (state.remaining <= 0) return [{ type: 'text', value }];
  let best = null;
  for (const c of compiled) {
    if (state.usedUrls.has(c.url)) continue;
    for (const re of c.res) {
      const m = re.exec(value);
      if (m && (best === null || m.index < best.index)) {
        best = { index: m.index, length: m[0].length, text: m[0], url: c.url };
      }
    }
  }
  if (!best) return [{ type: 'text', value }];
  const nodes = [];
  if (best.index > 0) nodes.push({ type: 'text', value: value.slice(0, best.index) });
  nodes.push(anchor(best));
  state.usedUrls.add(best.url);
  state.remaining -= 1;
  const rest = value.slice(best.index + best.length);
  if (rest) nodes.push(...linkifyString(rest, state, compiled));
  return nodes;
}

function walk(node, state, compiled) {
  if (!node.children) return;
  const out = [];
  for (const child of node.children) {
    if (state.remaining <= 0) {
      out.push(child);
    } else if (child.type === 'text') {
      out.push(...linkifyString(child.value, state, compiled));
    } else if (child.type === 'element') {
      if (!SKIP_TAGS.has(child.tagName)) walk(child, state, compiled);
      out.push(child);
    } else {
      out.push(child);
    }
  }
  node.children = out;
}

// Rehype plugin factory. options: { rules: [...], max: number }.
export default function rehypeAffiliateLinks(options = {}) {
  const max = options.max ?? 3;
  const compiled = (options.rules ?? [])
    .filter((r) => r.url) // drop inert (empty-URL) rules
    .map((r) => ({ url: r.url, res: r.phrases.map(phraseRe) }));
  return (tree) => {
    if (!compiled.length) return;
    walk(tree, { remaining: max, usedUrls: new Set() }, compiled);
  };
}
