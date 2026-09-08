// Cross-site handoff tagging, in one place.
//
// Three separate surfaces link from this site to its sisters
// (itincreditcard.com, itincreditscore.com):
//   1. the CrossSiteCallout component,
//   2. hand-written prose inside .astro pages,
//   3. plain markdown links in article body copy.
//
// Until 2026-09-08 only (1) was tagged. The 2026-09-07 audit measured what that
// cost: 1,567 impressions of card- and credit-score intent land on this domain
// every 28 days, they convert to zero clicks here, and the handoff to the site
// that CAN serve them was invisible in both GA4 properties. On the receiving
// end an untagged handoff arrives as generic `itinlending.net / referral` with
// no way to tell a router click from a footer link.
//
// That audit also closed the question of whether the zero was real. A
// `window.gtag` scoping bug (fixed 2026-09-01) had been silently dropping every
// custom event since launch; once it was fixed `cta_click` and `affiliate_click`
// started landing from the same delegate while `cross_site_click` stayed at
// exactly zero. The pipe works. The link coverage did not.
//
// SISTER_HOSTS is the single list. The click delegate in Analytics.astro matches
// on the same two hostnames, so a link only has to BE a sister link to get
// measured — there is no attribute for a future caller to forget.

export const SISTER_HOSTS = ['itincreditcard.com', 'itincreditscore.com'];

export const DEFAULT_CAMPAIGN = 'card-intent-router';

const SOURCE = 'itinlending.net';

/** True when `raw` is an absolute URL pointing at one of the sister sites. */
export function isSisterUrl(raw) {
  try {
    const { hostname } = new URL(raw);
    return SISTER_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`));
  } catch {
    return false; // relative, mailto:, or malformed
  }
}

// The build emits `/itin-credit-cards.html`, but the URL people visit — and the
// one GSC reports — is `/itin-credit-cards`. Tagging the built filename would
// make utm_content impossible to join against GSC page data.
export function canonicalPath(pathname) {
  return (
    pathname
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '')
      .replace(/(.)\/$/, '$1') || '/'
  );
}

/**
 * Add the standard cross-site UTMs to a sister-site URL.
 * Existing query strings and hashes are preserved; a non-sister or malformed
 * href is returned exactly as given rather than silently broken.
 *
 * @param {string} raw
 * @param {{ campaign?: string, contentPath?: string }} [opts]
 *   contentPath is the page that leaked the visitor — the per-page attribution
 *   that says which lending pages are actually card intent.
 */
export function tagCrossSite(raw, opts = {}) {
  const { campaign = DEFAULT_CAMPAIGN, contentPath = '/' } = opts;
  if (!isSisterUrl(raw)) return raw;
  try {
    const u = new URL(raw);
    u.searchParams.set('utm_source', SOURCE);
    u.searchParams.set('utm_medium', 'cross-site');
    u.searchParams.set('utm_campaign', campaign);
    u.searchParams.set('utm_content', contentPath);
    return u.toString();
  } catch {
    return raw;
  }
}
