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
    'cta.qualify': 'See if you qualify',
    'cta.options': 'See my options',
    'cta.how': 'How it works',
    'form.heading': 'Check your options in 60 seconds',
    'form.note': 'No SSN required. Checking your options does not affect your credit score.',
    'form.name': 'Full name',
    'form.name.ph': 'Maria Garcia',
    'form.phone': 'Phone',
    'form.phone.ph': '555-123-4567',
    'form.phone.title': 'Enter your phone number as 555-123-4567.',
    'form.phone.help': "We'll text you updates, never spam.",
    'form.email': 'Email',
    'form.email.ph': 'maria@email.com',
    'form.need': 'What do you need?',
    'form.need.select': 'Choose one…',
    'form.state': 'State',
    'form.state.ph': 'Texas',
    'form.state.select': 'Select your state…',
    'form.state.help': 'We cover all 50 states.',
    'form.notes': 'Anything else? (optional)',
    'form.qualify.heading': 'A few more details get you better matches',
    'form.qualify.note': 'Optional, but lenders match faster when they know these.',
    'form.amount': 'How much do you need?',
    'form.score': 'Credit score',
    'form.income': 'Monthly income',
    'form.itin': 'ID status',
    'form.tib': 'How long has your business been operating?',
    'form.down': 'Down payment available',
    'form.select': 'Select…',
    'form.submit': 'See my options',
    'form.submitting': 'Checking…',
    'form.consent.pre': 'By submitting, you agree to be contacted by',
    'form.consent.post': 'and partner lenders about financing options. See our',
    'form.privacy': 'Privacy Policy',
    'form.disclosure': 'Advertiser Disclosure',
    'form.terms': 'Terms of Use',
    'form.and': 'and',
    'form.speed': 'Takes a few minutes',
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
    'cta.qualify': 'Ver si califico',
    'cta.options': 'Ver mis opciones',
    'cta.how': 'Cómo funciona',
    'form.heading': 'Revisa tus opciones en 60 segundos',
    'form.note': 'No necesitas Seguro Social. Revisar tus opciones no afecta tu crédito.',
    'form.name': 'Nombre completo',
    'form.name.ph': 'María García',
    'form.phone': 'Teléfono',
    'form.phone.ph': '555-123-4567',
    'form.phone.title': 'Ingresa tu teléfono como 555-123-4567.',
    'form.phone.help': 'Te enviaremos mensajes con novedades, nunca spam.',
    'form.email': 'Correo electrónico',
    'form.email.ph': 'maria@correo.com',
    'form.need': '¿Qué necesitas?',
    'form.need.select': 'Elige una opción…',
    'form.state': 'Estado',
    'form.state.ph': 'Texas',
    'form.state.select': 'Selecciona tu estado…',
    'form.state.help': 'Cubrimos los 50 estados.',
    'form.notes': '¿Algo más? (opcional)',
    'form.qualify.heading': 'Unos datos más te consiguen mejores opciones',
    'form.qualify.note': 'Opcional, pero los prestamistas responden más rápido cuando los saben.',
    'form.amount': '¿Cuánto necesitas?',
    'form.score': 'Puntaje de crédito',
    'form.income': 'Ingreso mensual',
    'form.itin': 'Tipo de identificación',
    'form.tib': '¿Cuánto tiempo lleva operando tu negocio?',
    'form.down': 'Enganche disponible',
    'form.select': 'Selecciona…',
    'form.submit': 'Ver mis opciones',
    'form.submitting': 'Revisando…',
    'form.consent.pre': 'Al enviar, aceptas ser contactado por',
    'form.consent.post': 'y prestamistas asociados sobre opciones de financiamiento. Consulta nuestra',
    'form.privacy': 'Política de Privacidad',
    'form.disclosure': 'Aviso para Anunciantes',
    'form.terms': 'Términos de Uso',
    'form.and': 'y',
    'form.speed': 'Toma solo unos minutos',
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
export function altPath(pathname: string, to: Lang): string {
  // Normalize: strip a leading '/es' if present to get the English path.
  let enPath = pathname;
  if (pathname === '/es' || pathname === '/es/') {
    enPath = '/';
  } else if (pathname.startsWith('/es/')) {
    enPath = pathname.slice(3); // remove '/es'
  }
  if (to === 'en') return enPath;
  return enPath === '/' ? '/es' : `/es${enPath}`;
}
