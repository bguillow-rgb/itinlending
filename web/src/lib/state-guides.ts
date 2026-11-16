// Internal links from hub and state money pages to the state-specific articles
// the content pipeline writes (itin-personal-loan-<state>, itin-auto-loan-<state>,
// itin-business-loan-<state>, itin-loans-<state>).
//
// Why (2026-11-16 lending audit, action 3): the state personal-loan articles are
// the site's best performers (EN Illinois at pos 9.9 with clicks), but nothing
// linked to them except relatedSlugs on sibling articles, and the Spanish
// Illinois twin had zero impressions. Lists are built from the content
// collections at build time, so every new state article the pipeline publishes
// is linked automatically. ES pages link only to real es-419 translations, never
// to the EN fallback that /es/articles/<slug> serves before backfill.
import { getCollection } from 'astro:content';
import { STATES } from '../data/states';

const US_STATE_SLUGS = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
  'delaware', 'district-of-columbia', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois',
  'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts',
  'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
  'new-hampshire', 'new-jersey', 'new-mexico', 'new-york', 'north-carolina', 'north-dakota',
  'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode-island', 'south-carolina',
  'south-dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
  'west-virginia', 'wisconsin', 'wyoming',
];

// Spanish names that differ from the English ones, for states not in STATES.
const ES_NAME_OVERRIDES: Record<string, string> = {
  'new-york': 'Nueva York', 'new-jersey': 'Nueva Jersey', 'new-mexico': 'Nuevo México',
  'north-carolina': 'Carolina del Norte', 'south-carolina': 'Carolina del Sur',
  'north-dakota': 'Dakota del Norte', 'south-dakota': 'Dakota del Sur',
  pennsylvania: 'Pensilvania', hawaii: 'Hawái', 'west-virginia': 'Virginia Occidental',
  'district-of-columbia': 'Distrito de Columbia', louisiana: 'Luisiana',
};

const titleCase = (slug: string) =>
  slug.split('-').map((w) => (w === 'of' ? w : w[0].toUpperCase() + w.slice(1))).join(' ');

export function stateName(slug: string, locale: 'en' | 'es'): string {
  const s = STATES.find((x) => x.slug === slug);
  if (locale === 'es') return s?.nameEs ?? ES_NAME_OVERRIDES[slug] ?? titleCase(slug);
  return s?.name ?? titleCase(slug);
}

async function publishedSlugs(locale: 'en' | 'es'): Promise<Map<string, string>> {
  const entries = await getCollection(locale === 'es' ? 'articles-es' : 'articles', ({ data }) => data.published);
  return new Map(entries.map((e) => [e.slug, e.data.title]));
}

const articleHref = (locale: 'en' | 'es', slug: string) =>
  locale === 'es' ? `/es/articles/${slug}` : `/articles/${slug}`;

// Every state personal-loan guide that exists in this locale, A-Z by state name.
export async function personalLoanStateGuides(locale: 'en' | 'es') {
  const have = await publishedSlugs(locale);
  return US_STATE_SLUGS.filter((st) => have.has(`itin-personal-loan-${st}`))
    .map((st) => ({ state: st, label: stateName(st, locale), href: articleHref(locale, `itin-personal-loan-${st}`) }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}

// The state-specific articles for one state (personal, auto, business, general).
export async function guidesForState(locale: 'en' | 'es', state: string) {
  const have = await publishedSlugs(locale);
  return ['itin-personal-loan', 'itin-auto-loan', 'itin-business-loan', 'itin-loans']
    .map((prefix) => `${prefix}-${state}`)
    .filter((slug) => have.has(slug))
    .map((slug) => ({ href: articleHref(locale, slug), label: have.get(slug) as string }));
}
