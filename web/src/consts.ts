// Site-wide constants. Single source of truth for the Astro site.
// Update these as the project evolves; schema, footer, nav, llms.txt,
// analytics, and monetization all read from here.

export const SITE = {
  name: 'ITIN Lending',
  legalName: 'ITINLending.net',
  tagline: 'Loans, Mortgages & Credit for ITIN Holders',
  description:
    'ITINLending.net helps ITIN holders and foreign nationals find mortgages, auto loans, personal loans, business loans, and credit cards — no SSN required. Independent guides and lender matching.',
  url: 'https://itinlending.net',
  locale: 'en-US',
  supportEmail: 'hello@itinlending.net',

  // Publisher / author — used for Person and Organization schema. The
  // /about page is the canonical entity anchor. Fill bio details on /about.
  founder: {
    name: 'Bob Guillow',
    role: 'Founder & Editor',
    sameAs: [
      // Add LinkedIn / X when ready. Empty entries are filtered before render.
      // 'https://www.linkedin.com/in/...',
    ],
  },

  // Analytics + tracking. Values come from env vars at build time so local
  // builds and forks don't fire analytics or ads.
  analytics: {
    ga4Id: import.meta.env.PUBLIC_GA4_ID ?? '',
    gscVerification: import.meta.env.PUBLIC_GSC_VERIFICATION ?? '',
    indexNowKey: import.meta.env.PUBLIC_INDEXNOW_KEY ?? '',
  },

  // Monetization. All optional — features no-op until configured.
  monetize: {
    // Google AdSense publisher ID, e.g. 'ca-pub-0000000000000000'. Set via
    // PUBLIC_ADSENSE_ID at build time. Empty disables all ad slots.
    adsenseId: import.meta.env.PUBLIC_ADSENSE_ID ?? '',
    // Lead form endpoint. Use a static-friendly handler (Formspree,
    // Web3Forms, Basin). The form POSTs here. Empty shows a mailto fallback.
    // e.g. 'https://formspree.io/f/xxxxxxx'
    leadFormEndpoint: import.meta.env.PUBLIC_LEAD_ENDPOINT ?? '',
    // Primary affiliate "apply / get matched" destination used by CTAs that
    // route off-site (Commission Junction deep link). Empty routes to /apply.
    affiliateApplyUrl: import.meta.env.PUBLIC_AFFILIATE_APPLY_URL ?? '',
  },

  // Brand — modern, trustworthy fintech. Blue = trust, green = approval/money.
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

// Loan product clusters — the money-page topology. Each links to a cluster
// hub. Used on the homepage grid and in nav/footer.
export const PRODUCTS = [
  {
    slug: 'itin-mortgage',
    label: 'ITIN Mortgages',
    blurb: 'Buy a home with an ITIN — no SSN required.',
    icon: 'home',
  },
  {
    slug: 'itin-auto-loan',
    label: 'ITIN Auto Loans',
    blurb: 'Finance a car using your ITIN number.',
    icon: 'car',
  },
  {
    slug: 'itin-credit-cards',
    label: 'ITIN Credit Cards',
    blurb: 'Build credit with cards that accept an ITIN.',
    icon: 'card',
  },
  {
    slug: 'itin-personal-loans',
    label: 'ITIN Personal Loans',
    blurb: 'Personal financing options for ITIN holders.',
    icon: 'cash',
  },
  {
    slug: 'itin-business-loans',
    label: 'ITIN Business Loans',
    blurb: 'Fund your business with an ITIN.',
    icon: 'briefcase',
  },
  {
    slug: 'how-to-get-an-itin',
    label: 'How to Get an ITIN',
    blurb: 'Apply for an ITIN with the IRS, step by step.',
    icon: 'doc',
  },
];

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Loans', href: '/itin-loans' },
  { label: 'Credit Cards', href: '/itin-credit-cards' },
  { label: 'Guides', href: '/articles' },
  { label: 'About', href: '/about' },
];

export const NAV_CTA = { label: 'See if you qualify', href: '/apply' };
