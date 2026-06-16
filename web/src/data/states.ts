// Programmatic state-page data for the ITIN loans hub (/itin-loans/<state>).
//
// Every figure here is real and sourced, do not invent or pad numbers:
//   - `taxes` + `effRate`: state & local taxes paid by undocumented immigrants
//     in 2022 and their effective state/local tax rate. Source: Institute on
//     Taxation and Economic Policy (ITEP), "Tax Payments by Undocumented
//     Immigrants," 2024 (Appendix Table 1).
//   - `dl` / `dlYear`: whether the state issues a standard driver's license
//     regardless of immigration status, and the enactment year. Source:
//     National Conference of State Legislatures (NCSL), "States Offering
//     Driver's Licenses to Immigrants."
//
// These three data points (+ the state name) make each generated page
// substantively unique, which is the bar for programmatic SEO. Only the top
// ITIN states by population/tax contribution are included, small, low-demand
// states are intentionally omitted to keep every page above the quality bar.

export interface StateInfo {
  slug: string; // URL slug, English (e.g. 'new-york')
  name: string; // English display name
  nameEs: string; // Spanish display name
  taxes: string; // 2022 state & local taxes paid by undocumented immigrants
  effRate: string; // effective state & local tax rate
  dl: boolean; // issues driver's license regardless of immigration status
  dlYear?: number; // year that law was enacted
}

export const STATES: StateInfo[] = [
  { slug: 'california', name: 'California', nameEs: 'California', taxes: '$8.5 billion', effRate: '9.1%', dl: true, dlYear: 2013 },
  { slug: 'texas', name: 'Texas', nameEs: 'Texas', taxes: '$4.9 billion', effRate: '8.9%', dl: false },
  { slug: 'new-york', name: 'New York', nameEs: 'Nueva York', taxes: '$3.1 billion', effRate: '10.6%', dl: true, dlYear: 2019 },
  { slug: 'florida', name: 'Florida', nameEs: 'Florida', taxes: '$1.84 billion', effRate: '8.0%', dl: false },
  { slug: 'illinois', name: 'Illinois', nameEs: 'Illinois', taxes: '$1.55 billion', effRate: '10.3%', dl: true, dlYear: 2012 },
  { slug: 'new-jersey', name: 'New Jersey', nameEs: 'Nueva Jersey', taxes: '$1.33 billion', effRate: '8.4%', dl: true, dlYear: 2019 },
  { slug: 'washington', name: 'Washington', nameEs: 'Washington', taxes: '$997 million', effRate: '8.7%', dl: true, dlYear: 1993 },
  { slug: 'georgia', name: 'Georgia', nameEs: 'Georgia', taxes: '$929 million', effRate: '8.0%', dl: false },
  { slug: 'maryland', name: 'Maryland', nameEs: 'Maryland', taxes: '$779 million', effRate: '8.7%', dl: true, dlYear: 2013 },
  { slug: 'arizona', name: 'Arizona', nameEs: 'Arizona', taxes: '$704 million', effRate: '8.4%', dl: false },
  { slug: 'north-carolina', name: 'North Carolina', nameEs: 'Carolina del Norte', taxes: '$692 million', effRate: '7.6%', dl: false },
  { slug: 'virginia', name: 'Virginia', nameEs: 'Virginia', taxes: '$690 million', effRate: '7.9%', dl: true, dlYear: 2020 },
  { slug: 'massachusetts', name: 'Massachusetts', nameEs: 'Massachusetts', taxes: '$650 million', effRate: '7.6%', dl: true, dlYear: 2022 },
  { slug: 'pennsylvania', name: 'Pennsylvania', nameEs: 'Pensilvania', taxes: '$523 million', effRate: '9.0%', dl: false },
  { slug: 'nevada', name: 'Nevada', nameEs: 'Nevada', taxes: '$507 million', effRate: '8.4%', dl: true, dlYear: 2013 },
];

export interface BuiltStatePage {
  title: string;
  h1: string;
  description: string;
  eyebrow: string;
  lede: string;
  quickAnswer: string;
  faqs: { q: string; a: string }[];
  sections: { h2: string; html: string }[];
  siblingsHeading: string;
  siblings: { href: string; label: string }[];
}

const ITEP = 'Institute on Taxation and Economic Policy';
const NCSL = 'National Conference of State Legislatures';

// --- English ---------------------------------------------------------------
export function buildEn(s: StateInfo): BuiltStatePage {
  const dlSection = s.dl
    ? `<p>Yes. ${s.name} issues a standard driver's license regardless of immigration status (a policy enacted in ${s.dlYear}). That matters for an <a href="/itin-auto-loan">ITIN auto loan</a>: a state license makes it far easier to register, insure, and finance a vehicle, and many ${s.name} dealerships and credit unions actively work with ITIN borrowers who hold one. If you want a car, getting your license and your financing pre-approved together is the smoothest path.</p>`
    : `<p>${s.name} does not currently issue standard driver's licenses to residents without lawful immigration status (per the ${NCSL}). You can still get an <a href="/itin-auto-loan">ITIN auto loan</a> in ${s.name}, lenders qualify you on income and down payment, not a license, but you will typically need another government photo ID, and arranging insurance can take an extra step. A larger down payment of 15-20% strengthens approval when your credit file is thin.</p>`;

  return {
    title: `ITIN Loans in ${s.name}: Mortgages, Auto & Personal Loans (2026)`,
    h1: `ITIN Loans in ${s.name}`,
    description: `How ITIN holders in ${s.name} get mortgages, auto loans, personal loans, and credit cards, no SSN required. Requirements, lenders, and ${s.name}-specific guidance.`,
    eyebrow: `${s.name} · ITIN financing`,
    lede: `Live in ${s.name} and need financing without a Social Security number? Here's how ITIN holders in ${s.name} qualify for mortgages, auto loans, personal loans, and credit cards, and what to know locally.`,
    quickAnswer: `Yes, ITIN holders in ${s.name} can get mortgages, auto loans, personal loans, business loans, and credit cards without an SSN. Lenders serving ${s.name} accept your ITIN to verify identity and check credit, then qualify you on income and down payment. ${s.name}'s undocumented residents paid an estimated ${s.taxes} in state and local taxes in 2022, and ${s.dl ? `the state issues driver's licenses regardless of immigration status` : `the state does not issue licenses regardless of status`}, both shape how you finance a car here.`,
    faqs: [
      { q: `Can I get a mortgage with an ITIN in ${s.name}?`, a: `Yes. ITIN mortgages are available to ${s.name} residents through portfolio lenders and credit unions that keep loans in-house. Expect roughly 10-20% down and 12-24 months of income documentation in place of an SSN.` },
      { q: `Do I need a Social Security number to get a loan in ${s.name}?`, a: `No. Lenders serving ${s.name} accept your Individual Taxpayer Identification Number in place of an SSN. Enter your ITIN wherever the application asks for a Social Security number.` },
      { q: `Can I finance a car with an ITIN in ${s.name}?`, a: s.dl ? `Yes. Because ${s.name} issues driver's licenses regardless of immigration status, financing, registering, and insuring a car is straightforward. Many ${s.name} dealers and credit unions work with ITIN borrowers.` : `Yes. You can finance a car with an ITIN in ${s.name} even though the state does not issue licenses regardless of status, lenders qualify you on income and down payment. Bring a government photo ID and plan for 15-20% down.` },
      { q: `Do ITIN loans build credit in ${s.name}?`, a: `Yes, when the lender reports to Experian, Equifax, and TransUnion. On-time payments on an ITIN credit card, auto loan, or personal loan build the ${s.name} credit history that unlocks better rates later.` },
    ],
    sections: [
      {
        h2: `Can you get a loan with an ITIN in ${s.name}?`,
        html: `<p>Yes. ITIN holders across ${s.name} can qualify for mortgages, auto loans, personal loans, business loans, and credit cards without a Social Security number. Lenders that serve ${s.name} use your Individual Taxpayer Identification Number to verify identity and pull credit, then qualify you on income, down payment, and payment history. ${s.name} is one of the largest ITIN markets in the country, undocumented residents alone paid an estimated <strong>${s.taxes}</strong> in ${s.name} state and local taxes in 2022, at an effective rate of <strong>${s.effRate}</strong> (${ITEP}). A consistent tax-filing record under your ITIN is exactly the documentation ${s.name} lenders want to see.</p>`,
      },
      {
        h2: `What ITIN loans are available in ${s.name}?`,
        html: `<ul>
          <li><a href="/itin-mortgage">ITIN mortgages</a>, buy a home in ${s.name} with no SSN, typically 10-20% down.</li>
          <li><a href="/itin-auto-loan">ITIN auto loans</a>, finance a car through ${s.name} credit unions and dealers.</li>
          <li><a href="/itin-personal-loans">ITIN personal loans</a>, cover emergencies and large expenses.</li>
          <li><a href="/itin-business-loans">ITIN business loans</a>, fund and grow a ${s.name} business.</li>
          <li><a href="/itin-credit-cards">ITIN credit cards</a>, start building U.S. credit history.</li>
        </ul>`,
      },
      { h2: `Can ITIN holders get a driver's license in ${s.name}?`, html: dlSection },
      {
        h2: `Building credit in ${s.name} with an ITIN`,
        html: `<p>Filing taxes with an ITIN does more than meet IRS rules, it builds the paper trail ${s.name} lenders rely on. ITIN filers are part of the ${s.taxes} in state and local taxes undocumented residents contributed in ${s.name} in 2022. Pair consistent tax returns with on-time payments on an ITIN credit card or auto loan, reported to all three bureaus, and you build the ${s.name} credit history that unlocks lower mortgage and loan rates. Start with one reporting account, keep balances low, and never miss a due date.</p>`,
      },
    ],
    siblingsHeading: 'ITIN loans in other states',
    siblings: STATES.filter((x) => x.slug !== s.slug).map((x) => ({ href: `/itin-loans/${x.slug}`, label: x.name })),
  };
}

// --- Spanish ---------------------------------------------------------------
export function buildEs(s: StateInfo): BuiltStatePage {
  const n = s.nameEs;
  const dlSection = s.dl
    ? `<p>Sí. ${n} emite una licencia de conducir estándar sin importar el estatus migratorio (política aprobada en ${s.dlYear}). Eso importa para un <a href="/es/itin-auto-loan">préstamo de auto con ITIN</a>: una licencia estatal facilita mucho registrar, asegurar y financiar un vehículo, y muchos concesionarios y cooperativas de crédito en ${n} trabajan con prestatarios que tienen ITIN. Si quieres un auto, lo más fácil es tramitar tu licencia y tu preaprobación de financiamiento al mismo tiempo.</p>`
    : `<p>${n} actualmente no emite licencias de conducir estándar a residentes sin estatus migratorio legal (según el ${NCSL}). Aun así puedes obtener un <a href="/es/itin-auto-loan">préstamo de auto con ITIN</a> en ${n}, los prestamistas te califican por ingresos y enganche, no por licencia, pero normalmente necesitarás otra identificación oficial con foto, y conseguir seguro puede tomar un paso extra. Un enganche más grande del 15-20% mejora la aprobación cuando tu historial es limitado.</p>`;

  return {
    title: `Préstamos con ITIN en ${n}: Hipotecas, Autos y Préstamos Personales (2026)`,
    h1: `Préstamos con ITIN en ${n}`,
    description: `Cómo las personas con ITIN en ${n} obtienen hipotecas, préstamos de auto, préstamos personales y tarjetas de crédito, sin Seguro Social. Requisitos, prestamistas y guía local.`,
    eyebrow: `${n} · Financiamiento con ITIN`,
    lede: `¿Vives en ${n} y necesitas financiamiento sin Seguro Social? Así califican las personas con ITIN en ${n} para hipotecas, préstamos de auto, préstamos personales y tarjetas de crédito, y qué saber localmente.`,
    quickAnswer: `Sí, las personas con ITIN en ${n} pueden obtener hipotecas, préstamos de auto, préstamos personales, préstamos de negocio y tarjetas de crédito sin Seguro Social. Los prestamistas que sirven a ${n} aceptan tu ITIN para verificar tu identidad y revisar tu crédito, y te califican por ingresos y enganche. Los residentes indocumentados de ${n} pagaron unos ${s.taxes} en impuestos estatales y locales en 2022, y ${s.dl ? `el estado emite licencias de conducir sin importar el estatus migratorio` : `el estado no emite licencias sin importar el estatus`}, ambos influyen en cómo financias un auto aquí.`,
    faqs: [
      { q: `¿Puedo obtener una hipoteca con ITIN en ${n}?`, a: `Sí. Las hipotecas con ITIN están disponibles para residentes de ${n} a través de prestamistas de cartera y cooperativas de crédito que mantienen los préstamos internamente. Espera entre 10-20% de enganche y 12-24 meses de comprobantes de ingresos en lugar de un Seguro Social.` },
      { q: `¿Necesito un Seguro Social para obtener un préstamo en ${n}?`, a: `No. Los prestamistas que sirven a ${n} aceptan tu Número de Identificación Personal del Contribuyente (ITIN) en lugar de un Seguro Social. Escribe tu ITIN donde la solicitud pida un número de Seguro Social.` },
      { q: `¿Puedo financiar un auto con ITIN en ${n}?`, a: s.dl ? `Sí. Como ${n} emite licencias de conducir sin importar el estatus migratorio, financiar, registrar y asegurar un auto es sencillo. Muchos concesionarios y cooperativas de ${n} trabajan con prestatarios que tienen ITIN.` : `Sí. Puedes financiar un auto con ITIN en ${n} aunque el estado no emita licencias sin importar el estatus, los prestamistas te califican por ingresos y enganche. Lleva una identificación oficial con foto y considera un 15-20% de enganche.` },
      { q: `¿Los préstamos con ITIN construyen crédito en ${n}?`, a: `Sí, cuando el prestamista reporta a Experian, Equifax y TransUnion. Los pagos puntuales de una tarjeta de crédito, préstamo de auto o préstamo personal con ITIN construyen el historial crediticio en ${n} que abre mejores tasas más adelante.` },
    ],
    sections: [
      {
        h2: `¿Puedes obtener un préstamo con ITIN en ${n}?`,
        html: `<p>Sí. Las personas con ITIN en todo ${n} pueden calificar para hipotecas, préstamos de auto, préstamos personales, préstamos de negocio y tarjetas de crédito sin Seguro Social. Los prestamistas que sirven a ${n} usan tu Número de Identificación Personal del Contribuyente para verificar tu identidad y revisar tu crédito, y te califican por ingresos, enganche e historial de pagos. ${n} es uno de los mercados de ITIN más grandes del país, solo los residentes indocumentados pagaron unos <strong>${s.taxes}</strong> en impuestos estatales y locales de ${n} en 2022, a una tasa efectiva del <strong>${s.effRate}</strong> (${ITEP}). Un historial constante de declaraciones de impuestos bajo tu ITIN es justo la documentación que los prestamistas de ${n} quieren ver.</p>`,
      },
      {
        h2: `¿Qué préstamos con ITIN hay disponibles en ${n}?`,
        html: `<ul>
          <li><a href="/es/itin-mortgage">Hipotecas con ITIN</a>, compra una casa en ${n} sin Seguro Social, típicamente 10-20% de enganche.</li>
          <li><a href="/es/itin-auto-loan">Préstamos de auto con ITIN</a>, financia un auto con cooperativas y concesionarios de ${n}.</li>
          <li><a href="/es/itin-personal-loans">Préstamos personales con ITIN</a>, cubre emergencias y gastos grandes.</li>
          <li><a href="/es/itin-business-loans">Préstamos de negocio con ITIN</a>, financia y haz crecer un negocio en ${n}.</li>
          <li><a href="/es/itin-credit-cards">Tarjetas de crédito con ITIN</a>, empieza a construir historial crediticio en EE. UU.</li>
        </ul>`,
      },
      { h2: `¿Pueden las personas con ITIN obtener licencia de conducir en ${n}?`, html: dlSection },
      {
        h2: `Construir crédito en ${n} con un ITIN`,
        html: `<p>Declarar impuestos con un ITIN hace más que cumplir las reglas del IRS, construye el historial documental en el que confían los prestamistas de ${n}. Los contribuyentes con ITIN forman parte de los ${s.taxes} en impuestos estatales y locales que los residentes indocumentados aportaron en ${n} en 2022. Combina declaraciones de impuestos constantes con pagos puntuales en una tarjeta de crédito o préstamo de auto con ITIN, reportados a los tres burós, y construyes el historial crediticio en ${n} que abre tasas más bajas de hipoteca y préstamos. Empieza con una cuenta que reporte, mantén saldos bajos y nunca te atrases.</p>`,
      },
    ],
    siblingsHeading: 'Préstamos con ITIN en otros estados',
    siblings: STATES.filter((x) => x.slug !== s.slug).map((x) => ({ href: `/es/itin-loans/${x.slug}`, label: x.nameEs })),
  };
}
