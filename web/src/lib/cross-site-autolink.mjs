// Build-time cross-site link tagger for article body copy.
//
// A rehype plugin that stamps every sister-site link written as plain markdown
// (`[text](https://itincreditcard.com/...)`) with the standard cross-site UTMs
// and `data-cross-site`, so the handoff is attributable on both ends.
//
// Why a plugin and not an edit pass: these links live in editorial markdown
// across both locales, and markdown has no syntax for attributes. Hand-tagging
// the URLs would work exactly until the next article shipped with a plain link —
// which is the failure mode the 2026-09-07 audit found. The 8/17 CrossSiteCallout
// added UTMs to the ONE component that routes card intent, and every prose link
// written since then went out bare. Tagging at build time means an author writes
// an ordinary markdown link and it is still measurable.
//
// This only annotates links that already exist; it never injects one. That keeps
// it distinct from rehype-affiliate-links, which does inject, and is why this one
// runs in dev too — `astro dev` should show the same hrefs production ships.

import { SISTER_HOSTS, DEFAULT_CAMPAIGN, tagCrossSite, isSisterUrl } from './cross-site.mjs';

// vfile path -> the URL the article publishes at, e.g.
// .../content/articles-es/foo.md -> /es/articles/foo
// Mirrors pathFromFile in affiliate-autolink.mjs; same contract, same fallback.
function pathFromFile(file) {
  const src = (file && (file.path || (file.history || [])[0])) || '';
  const m = src.replace(/\\/g, '/').match(/\/content\/(articles(?:-es)?)\/(.+)\.[a-z]+$/i);
  if (!m) return 'unknown';
  const slug = m[2].replace(/[^A-Za-z0-9/_-]/g, '').slice(0, 70);
  return (m[1] === 'articles-es' ? '/es/articles/' : '/articles/') + slug;
}

// Which sister a link points at, for the campaign label. Lets us tell
// card-intent handoffs from credit-score handoffs in GA4 without parsing URLs.
function campaignFor(href) {
  try {
    const { hostname } = new URL(href);
    if (hostname.endsWith('itincreditscore.com')) return 'score-intent-router';
  } catch {
    /* isSisterUrl already vetted this; fall through to the default */
  }
  return DEFAULT_CAMPAIGN;
}

function walk(node, contentPath, stats) {
  if (!node || !node.children) return;
  for (const child of node.children) {
    if (child.type === 'element' && child.tagName === 'a') {
      const href = child.properties?.href;
      // Leave alone anything already tagged: a CrossSiteCallout rendered into
      // MDX, or a hand-written link that set its own campaign.
      if (typeof href === 'string' && isSisterUrl(href) && !child.properties['data-cross-site']) {
        const campaign = campaignFor(href);
        child.properties.href = tagCrossSite(href, { campaign, contentPath });
        child.properties['data-cross-site'] = campaign;
        stats.tagged += 1;
      }
    }
    walk(child, contentPath, stats);
  }
}

/** Rehype plugin factory. No options: the host list lives in cross-site.mjs. */
export default function rehypeCrossSiteLinks() {
  return (tree, file) => {
    const stats = { tagged: 0 };
    walk(tree, pathFromFile(file), stats);
    return tree;
  };
}

export { SISTER_HOSTS };
