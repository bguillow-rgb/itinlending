// i18n foundation. Shared "chrome" strings (nav, form, footer, CTAs, trust
// badges) live here in English + Latin-American Spanish (es-419). Page BODY
// content is translated per page: English pages live at /foo, Spanish pages at
// /es/foo. The language toggle in the nav swaps between the two.

export const languages = {
  en: 'EN',
  es: 'ES',
} as const;

export const languageLabels = {
  en: 'English',
  es: 'Español',
} as const;

export const defaultLang = 'en';
export type Lang = keyof typeof languages;

// BCP-47 locale per language, used for schema.org `inLanguage`. Spanish content
// is Latin-American Spanish (es-419), matching the UI strings above.
export const locales: Record<Lang, string> = {
  en: 'en-US',
  es: 'es-419',
};

// Resolve the BCP-47 locale for a language (for schema `inLanguage`).
export function localeFor(lang: Lang): string {
  return locales[lang];
}

// Shared UI strings. Keep these generic, anything site-specific (nav labels,
// product blurbs) lives in consts.ts with an `es` variant.
export const ui = {
  en: {
    'cta.compare': 'Compare lenders',
    'cta.learn': 'Read the ITIN loan guide',
    'cta.options': 'See my options',
    'cta.how': 'How it works',
    'trust.nossn': 'No SSN needed',
    'trust.nocredit': 'No credit impact to check',
    'trust.states': 'All 50 states',
    'faq.heading': 'Common questions',
    'footer.resources': 'Resources',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.trust': 'Why trust us',
    'footer.trust.independent': 'Independent, not a lender or broker',
    'footer.trust.free': 'Always free to use',
    'footer.trust.privacy': 'Your information stays private',
    'footer.contact': 'Contact',
    'lang.switch': 'Español',
    'crumb.home': 'Home',
  },
  es: {
    'cta.compare': 'Comparar prestamistas',
    'cta.learn': 'Leer la guía de préstamos ITIN',
    'cta.options': 'Ver mis opciones',
    'cta.how': 'Cómo funciona',
    'trust.nossn': 'Sin Seguro Social',
    'trust.nocredit': 'Revisar no afecta tu crédito',
    'trust.states': 'Los 50 estados',
    'faq.heading': 'Preguntas frecuentes',
    'footer.resources': 'Recursos',
    'footer.company': 'Empresa',
    'footer.legal': 'Legal',
    'footer.trust': 'Por qué confiar en nosotros',
    'footer.trust.independent': 'Independientes, no somos prestamista ni bróker',
    'footer.trust.free': 'Siempre gratis',
    'footer.trust.privacy': 'Tu información se mantiene privada',
    'footer.contact': 'Contacto',
    'lang.switch': 'English',
    'crumb.home': 'Inicio',
  },
} as const;

// Derive the active language from a URL pathname (e.g. '/es/itin-loans' → 'es').
export function getLangFromUrl(url: URL): Lang {
  // Strip a trailing `.html` so the locale index page (built to `es.html` under
  // build.format:'file') is detected as Spanish, not just `/es/...` interiors.
  const [, seg] = url.pathname.replace(/\.html$/, '').split('/');
  if (seg === 'es') return 'es';
  return 'en';
}

// Return a translator bound to a language, with English fallback.
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)['en']): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

// Prefix an internal href for the active language. External links, anchors,
// and mailto/tel are returned untouched. English is the un-prefixed default.
export function localizedHref(href: string, lang: Lang): string {
  if (lang === 'en') return href;
  if (!href.startsWith('/')) return href; // external / anchor / mailto
  if (href === '/') return '/es';
  if (href.startsWith('/es/') || href === '/es') return href;
  return `/es${href}`;
}

// Given the CURRENT pathname and a target language, return the counterpart
// path. English '/foo' ↔ Spanish '/es/foo'; home is '/' ↔ '/es'.
// Paths that ship in English only and have no Spanish twin. Asking for the ES
// counterpart of one of these returns the Spanish homepage instead of a URL
// that does not exist — otherwise the nav language toggle 404s and the build's
// link checker fails. Pair every entry here with `singleLocale` on the page.
const EN_ONLY_PATHS = new Set(['/for-lenders']);

export function altPath(pathname: string, to: Lang): string {
  // Normalize: strip a leading '/es' if present to get the English path.
  let enPath = pathname;
  if (pathname === '/es' || pathname === '/es/') {
    enPath = '/';
  } else if (pathname.startsWith('/es/')) {
    enPath = pathname.slice(3); // remove '/es'
  }
  if (to === 'en') return enPath;
  const normalized = enPath.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  if (EN_ONLY_PATHS.has(normalized)) return '/es';
  return enPath === '/' ? '/es' : `/es${enPath}`;
}
