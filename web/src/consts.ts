// Site-wide constants. Single source of truth for the Astro site.
// Update these as the project evolves; schema, footer, nav, llms.txt,
// analytics, and monetization all read from here.

export const SITE = {
  name: 'ITIN Lending',
  legalName: 'ITINLending.net',
  tagline: 'Loans, Mortgages & Credit for ITIN Holders',
  taglineEs: 'Préstamos, Hipotecas y Crédito para Personas con ITIN',
  description:
    'ITINLending.net helps ITIN holders and foreign nationals find mortgages, auto loans, personal loans, business loans, and credit cards, no SSN required. Independent guides and lender matching.',
  descriptionEs:
    'ITINLending.net ayuda a personas con ITIN a encontrar hipotecas, préstamos de auto, préstamos personales, préstamos de negocio y tarjetas de crédito, sin Seguro Social. Guías independientes y conexión con prestamistas.',
  url: 'https://itinlending.net',
  locale: 'en-US',
  supportEmail: 'bguillow@gmail.com',

  // Publisher (legal operating entity), drives Organization + Article
  // publisher schema and the footer copyright. The /about page is the
  // canonical entity anchor.
  publisher: {
    name: 'Timberline Ventures LLC',
    // Corporate entity site + its Wikidata item, the canonical publisher anchor.
    url: 'https://timberlineventuresllc.com',
    wikidata: 'https://www.wikidata.org/wiki/Q140082434',
    // Wikidata entities: this site (ITIN Lending) + the Timberline parent.
    // Closes the Knowledge-Graph sameAs chain on the Organization node.
    sameAs: [
      'https://www.wikidata.org/wiki/Q140082776',
      'https://www.wikidata.org/wiki/Q140082434',
    ] as string[],
    // Add LinkedIn / Crunchbase when ready. Empty entries filtered on render.
  },

  // Named editor persona, the byline + Person entity anchor for E-E-A-T. Used on
  // article bylines, Article schema (author), and the /about page. NOTE: this is a
  // pen name, not a real person; the bio describes the site's actual editorial
  // process and must never claim fabricated licenses/credentials (YMYL trust rule).
  // `name` must stay first in this block, the daily generator reads it by regex.
  editorial: {
    name: 'Daniela Reyes',
    role: 'Editor',
    bio: "Daniela Reyes is the editor of ITIN Lending. She writes and edits plain-English guides on loans, mortgages, and credit for ITIN holders and foreign nationals in the U.S., translating dense lender requirements and IRS and CFPB guidance into clear, accurate steps. Every guide is researched against primary sources, the IRS, the Consumer Financial Protection Bureau, and lenders' own published requirements, and reviewed for accuracy before it is published. Daniela writes in both English and Spanish.",
    bioEs: "Daniela Reyes es la editora de ITIN Lending. Escribe y edita guías en lenguaje sencillo sobre préstamos, hipotecas y crédito para personas con ITIN y extranjeros en EE. UU., traduciendo los requisitos complejos de los prestamistas y las guías del IRS y del CFPB en pasos claros y precisos. Cada guía se investiga con fuentes primarias, el IRS, la Oficina para la Protección Financiera del Consumidor (CFPB) y los requisitos publicados por los propios prestamistas, y se revisa para verificar su exactitud antes de publicarse. Daniela escribe en inglés y español.",
    // Pen-name byline roster (Daniela leads). Daily/seed generators rotate new
    // posts across these names so the site doesn't read as written by one hand.
    // Every bio is honest about the real editorial process; none claims a
    // fabricated license or credential (YMYL trust rule). Never Bob's real name.
    team: [
      {
        name: 'Daniela Reyes',
        role: 'Editor',
        bio: "Daniela Reyes is the editor of ITIN Lending. She writes and edits plain-English guides on loans, mortgages, and credit for ITIN holders and foreign nationals in the U.S., translating dense lender requirements and IRS and CFPB guidance into clear, accurate steps. Every guide is researched against primary sources and reviewed for accuracy before it is published. Daniela writes in both English and Spanish.",
        bioEs: "Daniela Reyes es la editora de ITIN Lending. Escribe y edita guías en lenguaje sencillo sobre préstamos, hipotecas y crédito para personas con ITIN y extranjeros en EE. UU. Cada guía se investiga con fuentes primarias y se revisa para verificar su exactitud antes de publicarse. Daniela escribe en inglés y español.",
      },
      {
        name: 'Andrés Villanueva',
        role: 'Mortgage & Home Loans Writer',
        bio: "Andrés Villanueva writes ITIN Lending's coverage of mortgages, home equity, and qualifying for a home loan with an ITIN. He focuses on lender documentation requirements, down-payment and reserve rules, and the loan programs that accept ITIN borrowers, building each guide from lenders' published requirements and CFPB and HUD guidance. Andrés writes in English and Spanish.",
        bioEs: "Andrés Villanueva escribe la cobertura de ITIN Lending sobre hipotecas, plusvalía de vivienda y cómo calificar para un préstamo hipotecario con un ITIN. Se enfoca en los requisitos de documentación de los prestamistas, las reglas de enganche y reservas, y los programas de préstamo que aceptan a prestatarios con ITIN. Andrés escribe en inglés y español.",
      },
      {
        name: 'Priya Sharma',
        role: 'Loans & Banking Writer',
        bio: "Priya Sharma covers personal, auto, and business loans plus everyday banking for ITIN holders at ITIN Lending. She digs into approval criteria, interest-rate ranges, and the banks and lenders that work with ITIN customers, checking each claim against the institutions' own published terms before it runs. Priya writes in English and Spanish.",
        bioEs: "Priya Sharma cubre préstamos personales, de auto y de negocio, además de la banca cotidiana para personas con ITIN en ITIN Lending. Investiga los criterios de aprobación, los rangos de tasas de interés y los bancos y prestamistas que trabajan con clientes con ITIN, verificando cada afirmación con los términos publicados por las instituciones. Priya escribe en inglés y español.",
      },
    ],
  },

  // Analytics + tracking. Values come from env vars at build time so local
  // builds and forks don't fire analytics or ads.
  analytics: {
    ga4Id: import.meta.env.PUBLIC_GA4_ID ?? '',
    gscVerification: import.meta.env.PUBLIC_GSC_VERIFICATION ?? '',
    indexNowKey: import.meta.env.PUBLIC_INDEXNOW_KEY ?? '',
  },

  // Monetization. All optional, features no-op until configured.
  monetize: {
    // Google AdSense publisher ID, e.g. 'ca-pub-0000000000000000'. Set via
    // PUBLIC_ADSENSE_ID at build time. Empty disables all ad slots.
    adsenseId: import.meta.env.PUBLIC_ADSENSE_ID ?? '',
    // AdSense ad-unit slot IDs by position. Create each unit in the AdSense
    // dashboard and paste its numeric slot ID here via env. Empty = that slot
    // renders nothing. Placement strategy: AdSense lives on research-intent
    // ARTICLES (top = above fold, end = after body); MONEY pages get a single
    // unit below the fold (after the FAQ) so it only catches non-converters
    // and never cannibalizes lead/affiliate revenue.
    adSlots: {
      articleTop: import.meta.env.PUBLIC_ADSENSE_SLOT_ARTICLE_TOP ?? '',
      articleEnd: import.meta.env.PUBLIC_ADSENSE_SLOT_ARTICLE_END ?? '',
      moneyFooter: import.meta.env.PUBLIC_ADSENSE_SLOT_MONEY_FOOTER ?? '',
      // Post-conversion thank-you page, pure ad real estate, no lead/affiliate
      // to cannibalize, so it runs display ads at full density.
      thankYou: import.meta.env.PUBLIC_ADSENSE_SLOT_THANKYOU ?? '',
    },
    // Lead form endpoint. Use a static-friendly handler (Formspree,
    // Web3Forms, Basin). The form POSTs here. Empty shows a mailto fallback.
    // e.g. 'https://formspree.io/f/xxxxxxx'
    leadFormEndpoint: import.meta.env.PUBLIC_LEAD_ENDPOINT ?? '',
    // Web3Forms access key (public by design). Injected as the hidden
    // access_key field; the form only POSTs leads when this is set.
    web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
    // Primary affiliate "apply / get matched" destination used by CTAs that
    // route off-site (Commission Junction deep link). Empty routes to /apply.
    affiliateApplyUrl: import.meta.env.PUBLIC_AFFILIATE_APPLY_URL ?? '',
    // Per-product CJ advertiser deep links, keyed by money-page slug. A page's
    // CTA routes to its product-specific advertiser for max relevance/EPC, and
    // falls back to affiliateApplyUrl (then /apply) when its slot is empty.
    affiliateUrls: {
      'itin-mortgage': import.meta.env.PUBLIC_AFFILIATE_URL_MORTGAGE ?? '',
      'itin-auto-loan': import.meta.env.PUBLIC_AFFILIATE_URL_AUTO ?? '',
      'itin-credit-cards': import.meta.env.PUBLIC_AFFILIATE_URL_CREDIT_CARDS ?? '',
      'itin-personal-loans': import.meta.env.PUBLIC_AFFILIATE_URL_PERSONAL ?? '',
      'itin-business-loans': import.meta.env.PUBLIC_AFFILIATE_URL_BUSINESS ?? '',
      'itin-loans': import.meta.env.PUBLIC_AFFILIATE_URL_LOANS ?? '',
    } as Record<string, string>,
    // Awin affiliate display creatives (Credit Karma). The hero ad unit on the
    // homepage renders an Awin banner via CreditKarmaAd.astro. The embed URL is
    // built as cread.php / cshow.php?s=<creativeId>&v=<advertiserId>&q=<campaignId>&r=<publisherId>.
    // publisherId (r) and the Credit Karma advertiser (v) + campaign (q) are
    // account-level constants shared across all three sites; only the per-site
    // creativeId changes. Set the creative IDs in each homepage's <CreditKarmaAd />.
    awin: {
      publisherId: '2931103',
      advertiserId: '66532',
      campaignId: '475588',
      // Default ad topic for pages with no topic-specific keyword in their path
      // (homepage, /about, utility). Per-site so a generic page shows the most
      // on-brand creative: this site leads with loans/financing → 'finance'.
      defaultTopic: 'finance',
      // Credit Karma display creatives under the campaign (all 300×250, shared
      // across all 3 sites, creatives are campaign-level). Keyed by topic so each
      // page renders the most relevant banner. Add new IDs here as more creatives
      // are pulled from the Awin dashboard to widen relevance granularity.
      creatives: {
        finance: '3641184', // general "all things finance", loans, mortgage, income
        cards: '3641203',   // credit cards
        score: '3597059',   // credit score & credit building
      } as Record<string, string>,
    },
  },

  // Brand, modern, trustworthy fintech. Blue = trust, green = approval/money.
  theme: {
    bg: '#FFFFFF',
    surface: '#F5F8FC',
    surfaceAlt: '#EAF1FB',
    text: '#15233B',
    muted: '#5A6B85',
    primary: '#11366B',
    primaryDark: '#0C2750',
    accent: '#1B9E5A',
    accentDark: '#157C46',
    border: '#E2E8F2',
  },
};

// Loan product clusters, the money-page topology. Each links to a cluster
// hub. Used on the homepage grid and in nav/footer.
export const PRODUCTS = [
  {
    slug: 'itin-mortgage',
    label: 'ITIN Mortgages',
    labelEs: 'Hipotecas con ITIN',
    blurb: 'Own your home in the U.S., no SSN needed.',
    blurbEs: 'Compra tu casa en EE. UU., sin Seguro Social.',
    icon: 'home',
  },
  {
    slug: 'itin-auto-loan',
    label: 'ITIN Auto Loans',
    labelEs: 'Préstamos de Auto con ITIN',
    blurb: 'Drive off the lot with your ITIN number.',
    blurbEs: 'Llévate tu auto usando tu número ITIN.',
    icon: 'car',
  },
  {
    slug: 'itin-credit-cards',
    label: 'ITIN Credit Cards',
    labelEs: 'Tarjetas de Crédito con ITIN',
    blurb: 'Start building U.S. credit with an ITIN.',
    blurbEs: 'Empieza a construir crédito en EE. UU. con ITIN.',
    icon: 'card',
  },
  {
    slug: 'itin-personal-loans',
    label: 'ITIN Personal Loans',
    labelEs: 'Préstamos Personales con ITIN',
    blurb: 'Cover what life needs, no SSN required.',
    blurbEs: 'Cubre lo que necesitas, sin Seguro Social.',
    icon: 'cash',
  },
  {
    slug: 'itin-business-loans',
    label: 'ITIN Business Loans',
    labelEs: 'Préstamos de Negocio con ITIN',
    blurb: 'Fund and grow your business with an ITIN.',
    blurbEs: 'Financia y haz crecer tu negocio con ITIN.',
    icon: 'briefcase',
  },
  {
    slug: 'how-to-get-an-itin',
    label: 'How to Get an ITIN',
    labelEs: 'Cómo Obtener un ITIN',
    blurb: 'Apply for an ITIN with the IRS, step by step.',
    blurbEs: 'Solicita tu ITIN ante el IRS, paso a paso.',
    icon: 'doc',
  },
  {
    slug: 'itin-vs-ssn',
    label: 'ITIN vs SSN',
    labelEs: 'ITIN vs SSN',
    blurb: 'Understand the key differences for borrowing.',
    blurbEs: 'Entiende las diferencias clave para pedir crédito.',
    icon: 'shield',
  },
];

// Pillar guide, the top of the hub-and-spoke. RelatedLinks links every
// cluster + article back up to it.
export const PILLAR = {
  slug: 'itin-loans',
  label: 'ITIN Loans Guide',
  labelEs: 'Guía de Préstamos ITIN',
};

export const NAV = [
  { label: 'Home', labelEs: 'Inicio', href: '/' },
  { label: 'Loans', labelEs: 'Préstamos', href: '/itin-loans' },
  { label: 'Personal Loans', labelEs: 'Préstamos personales', href: '/itin-personal-loans' },
  { label: 'Credit Cards', labelEs: 'Tarjetas', href: '/itin-credit-cards' },
  { label: 'Guides', labelEs: 'Guías', href: '/articles' },
  { label: 'About', labelEs: 'Nosotros', href: '/about' },
];

export const NAV_CTA = { label: 'Apply Here', labelEs: 'Aplica aquí', href: '/apply' };

// Affiliate fallback chains by money-page slug. When a slug has no dedicated
// affiliate link set, resolution walks this chain (then the global apply URL).
// ITIN mortgage & auto have no dedicated affiliate program, they're sold via
// loan officers / dealerships, so they fall back to the general loans
// marketplace (itin-loans), then to the global apply URL.
export const AFFILIATE_FALLBACKS: Record<string, string[]> = {
  'itin-mortgage': ['itin-loans'],
  'itin-auto-loan': ['itin-personal-loans', 'itin-loans'],
  'itin-personal-loans': ['itin-loans'],
  'itin-cash-loans': ['itin-personal-loans', 'itin-loans'],
  'itin-business-loans': ['itin-loans'],
};

// Resolve the off-site affiliate URL for a given money-page slug: its own link,
// then its fallback chain, then the global affiliateApplyUrl, then '' (callers
// route to /apply on empty). Pass a path like '/itin-mortgage' or
// '/es/itin-mortgage', the locale prefix and leading slash are stripped.
export function affiliateUrlFor(pathOrSlug?: string): string {
  const slug = (pathOrSlug ?? '').replace(/^\/(es\/)?/, '').replace(/^\//, '');
  const urls = SITE.monetize.affiliateUrls;
  if (urls[slug]) return urls[slug];
  for (const fb of AFFILIATE_FALLBACKS[slug] ?? []) {
    if (urls[fb]) return urls[fb];
  }
  return SITE.monetize.affiliateApplyUrl || '';
}

// --- Credit Karma (Awin) ad targeting -------------------------------------
// Display CTA + alt copy per ad topic, EN + ES. The creative IDs themselves live
// in SITE.monetize.awin.creatives; this is the human-facing copy that wraps them.
export type CkTopic = 'finance' | 'cards' | 'score';
export const CK_AD_COPY: Record<CkTopic, { en: { cta: string; alt: string }; es: { cta: string; alt: string } }> = {
  finance: {
    en: { cta: 'See how much you qualify for here', alt: 'Credit Karma, all things finance at your fingertips' },
    es: { cta: 'Mira cuánto puedes calificar aquí', alt: 'Credit Karma, todas tus finanzas al alcance' },
  },
  cards: {
    en: { cta: 'Compare top credit cards here', alt: 'Credit Karma, find a credit card' },
    es: { cta: 'Compara las mejores tarjetas aquí', alt: 'Credit Karma, encuentra una tarjeta de crédito' },
  },
  score: {
    en: { cta: 'Check your credit score free here', alt: 'Credit Karma, see your credit score free' },
    es: { cta: 'Revisa tu puntaje de crédito gratis aquí', alt: 'Credit Karma, mira tu puntaje de crédito gratis' },
  },
};

// Map a page path/slug to the most relevant Credit Karma ad topic. Keyword match
// wins; otherwise the page falls back to the site's defaultTopic so every page
// shows an on-brand creative. Pass a path like '/itin-mortgage' or '/es/itin-cards'.
export function ckTopicForPath(pathOrSlug?: string): CkTopic {
  const s = (pathOrSlug ?? '').toLowerCase();
  if (/card/.test(s)) return 'cards';
  if (/score|credit-report|credit-bureau|build-credit|credit-history|improve-credit|credit-builder|check-credit/.test(s)) return 'score';
  if (/loan|mortgage|auto|personal|business|finance|income/.test(s)) return 'finance';
  return (SITE.monetize.awin.defaultTopic as CkTopic) ?? 'finance';
}

// Resolve the relevant Credit Karma creative + display copy for a page. Returns
// the creative ID (falling back to the default topic's creative if a topic has
// none configured) plus the localized CTA + alt text.
export function creditKarmaAdFor(pathOrSlug: string | undefined, lang: 'en' | 'es') {
  const topic = ckTopicForPath(pathOrSlug);
  const creatives = SITE.monetize.awin.creatives;
  const creativeId = creatives[topic] ?? creatives[SITE.monetize.awin.defaultTopic] ?? '';
  const copy = CK_AD_COPY[topic][lang];
  return { creativeId, cta: copy.cta, alt: copy.alt, topic };
}
