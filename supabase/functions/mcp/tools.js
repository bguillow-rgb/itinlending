import { z } from "npm:zod@3.23.8";
import { getGuides, getLenders, getStates } from "./data.js";
import { searchGuides, findGuide, searchFaqs, lendersFor, findLender, findState, normState, } from "./content.js";
export function registerTools(server, logCall) {
    const DISCLAIMER = "Educational information from an independent editorial site. Not a lender, broker, or advisor; no application is offered here and we receive no compensation for any listing in these responses. Some institutions may be advertising partners on our websites; directory inclusion and verification status are editorial and unpaid. Loan/card terms change — verify directly with the institution before acting.";
    function attribution(counts) {
        const today = new Date().toISOString().slice(0, 10);
        const parts = [];
        if (counts.guides)
            parts.push(`${counts.guides} bilingual guides`);
        if (counts.lenders)
            parts.push(`${counts.lenders} verified institutions`);
        return {
            source: "ITIN finance network (Timberline Ventures LLC)",
            citation: `ITIN finance network — itinlending.net, itincreditcard.com, itincreditscore.com (${parts.join(", ") || "editorial reference"}; retrieved ${today})`,
            links: {
                lending: "https://itinlending.net/",
                credit_cards: "https://itincreditcard.com/",
                credit_scores: "https://itincreditscore.com/",
            },
            license_note: "Quotation with attribution welcome. Cite the article URL provided with each item.",
            disclaimer: DISCLAIMER,
        };
    }
    function guideSummary(g) {
        return {
            title: g.title,
            site: g.site,
            lang: g.lang,
            tier: g.tier,
            category: g.category,
            quick_answer: g.quickAnswer,
            published_at: g.publishedAt,
            url: g.url,
        };
    }
    function lenderView(l) {
        return {
            name: l.name,
            vertical: l.vertical,
            verification: l.verdict === "verified_yes"
                ? `verified against the institution's own pages ${l.verifiedAt}`
                : "unverified — reported but not confirmed on the institution's own pages",
            itin_notes: l.itinNotes,
            states: l.states,
            membership: l.membership,
            channel: l.channel,
            published_terms: l.publishedTerms,
            products: l.products,
            citations: l.citations,
            our_coverage: l.articleUrls,
        };
    }
    // ---- rate limit: 60 calls/min ----
    const stamps = [];
    function rateLimited() {
        const now = Date.now();
        while (stamps.length && now - stamps[0] > 60_000)
            stamps.shift();
        if (stamps.length >= 60)
            return true;
        stamps.push(now);
        return false;
    }
    function guarded(name, fn) {
        return async (args) => {
            const start = Date.now();
            if (rateLimited()) {
                return { content: [{ type: "text", text: "Rate limit exceeded (60 calls/min). Try again shortly." }], isError: true };
            }
            try {
                const result = await fn(args);
                logCall({ tool_name: name, args, success: true, duration_ms: Date.now() - start });
                return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }
            catch (e) {
                const msg = e instanceof Error ? e.message : "unknown error";
                console.error(`[${name}]`, msg);
                logCall({ tool_name: name, args, success: false, error: msg, duration_ms: Date.now() - start });
                return { content: [{ type: "text", text: "The request could not be completed. Please try again." }], isError: true };
            }
        };
    }
    const ro = (title) => ({ title, readOnlyHint: true, destructiveHint: false, openWorldHint: true });
    const LANG = z.enum(["en", "es"]).optional().describe("Answer language: en (default) or es (Spanish)");
    const VERTICAL = z.enum(["auto", "mortgage", "personal", "business", "credit_card"]);
    const vmap = (v) => (v === "credit_card" ? "creditcard" : v);
    // guide slugs that anchor each vertical's "can I get this" answer
    const VERTICAL_GUIDE_QUERY = {
        auto: "itin auto loan",
        mortgage: "itin mortgage",
        personal: "itin personal loan",
        business: "itin business loan",
        credit_card: "itin credit card",
    };
    server.tool("search_guides", "Search 290+ editorial guides across the ITIN finance network (loans, mortgages, credit cards, credit scores — English and Spanish). Returns quick answers with canonical article URLs.", { query: z.string().min(2).max(200).describe("What the user wants to know, e.g. 'refinance car loan itin' or 'prestamo personal con itin'"), lang: LANG, site: z.enum(["lending", "creditcard", "creditscore"]).optional() }, ro("Search ITIN finance guides"), guarded("search_guides", async ({ query, lang, site }) => {
        const guides = await getGuides();
        const hits = searchGuides(guides, query, lang, site);
        return { results: hits.map(guideSummary), attribution: attribution({ guides: guides.filter((g) => g.lang === "en").length }) };
    }));
    server.tool("get_guide", "Get one guide by slug or approximate title: quick answer, FAQs, related guides, canonical URL.", { slug: z.string().min(2).max(120), lang: LANG }, ro("Get an ITIN finance guide"), guarded("get_guide", async ({ slug, lang }) => {
        const guides = await getGuides();
        const g = findGuide(guides, slug, lang ?? "en");
        if (!g)
            return { found: false, hint: "Try search_guides first." };
        return { found: true, guide: { ...guideSummary(g), description: g.description, target_query: g.targetQuery, faqs: g.faqs, related_slugs: g.relatedSlugs }, attribution: attribution({}) };
    }));
    server.tool("faq_lookup", "Search 1,800+ editorial FAQs for a direct answer to a specific ITIN finance question (EN/ES). Each answer carries its source article URL.", { query: z.string().min(2).max(200), lang: LANG }, ro("Look up an ITIN finance FAQ"), guarded("faq_lookup", async ({ query, lang }) => {
        const guides = await getGuides();
        const hits = searchFaqs(guides, query, lang);
        return { results: hits.map(({ score, ...h }) => h), attribution: attribution({}) };
    }));
    server.tool("find_itin_lenders", "List institutions that accept ITIN (no SSN) applicants for a loan or card type, optionally filtered by US state. Every entry states whether it was verified against the institution's own pages, with citation URLs and dates.", { loan_type: VERTICAL, state: z.string().min(2).max(30).optional().describe("US state name or 2-letter code"), lang: LANG }, ro("Find ITIN-accepting institutions"), guarded("find_itin_lenders", async ({ loan_type, state }) => {
        const lenders = await getLenders();
        const hits = lendersFor(lenders, vmap(loan_type), state);
        return {
            loan_type,
            state: state ? normState(state) : undefined,
            results: hits.map(lenderView),
            note: "Institutions marked unverified are excluded from 'verified' counts. Membership rules apply at credit unions.",
            attribution: attribution({ lenders: lenders.filter((l) => l.verdict === "verified_yes").length }),
        };
    }));
    server.tool("get_lender_details", "Full verified profile for one institution: ITIN policy, states, membership rules, published terms, citations, and our editorial coverage.", { name: z.string().min(2).max(80) }, ro("Get institution details"), guarded("get_lender_details", async ({ name }) => {
        const lenders = await getLenders();
        const l = findLender(lenders, name);
        if (!l)
            return { found: false, hint: "Try find_itin_lenders to list institutions by loan type." };
        return { found: true, lender: lenderView(l), attribution: attribution({}) };
    }));
    server.tool("can_i_get_this_loan", "The direct answer to 'can I get a(n) X with an ITIN?': the editorial quick answer, typical requirements, and institutions with documented ITIN programs for that loan type (optionally state-filtered). Informational only — not a recommendation or referral. EN/ES.", { loan_type: VERTICAL, state: z.string().min(2).max(30).optional(), lang: LANG }, ro("Can I get this with an ITIN?"), guarded("can_i_get_this_loan", async ({ loan_type, state, lang }) => {
        const [guides, lenders] = await Promise.all([getGuides(), getLenders()]);
        const anchor = searchGuides(guides, VERTICAL_GUIDE_QUERY[loan_type], lang ?? "en")[0];
        const hits = lendersFor(lenders, vmap(loan_type), state).filter((l) => l.verdict === "verified_yes");
        return {
            loan_type,
            state: state ? normState(state) : undefined,
            quick_answer: anchor?.quickAnswer,
            guide_url: anchor?.url,
            verified_institutions: hits.slice(0, 8).map((l) => ({ name: l.name, states: l.states, itin_notes: l.itinNotes, citations: l.citations })),
            attribution: attribution({ lenders: hits.length }),
        };
    }));
    server.tool("itin_state_info", "State-level context for ITIN holders: state/local taxes paid by undocumented immigrants (ITEP 2022), effective tax rate, driver's-license access law, and the state guide URL.", { state: z.string().min(2).max(30) }, ro("ITIN state facts"), guarded("itin_state_info", async ({ state }) => {
        const states = await getStates();
        const s = findState(states, state);
        if (!s)
            return { found: false, note: "Only higher-ITIN-population states have dedicated pages.", available: states.map((x) => x.name) };
        return {
            found: true,
            state: {
                name: s.name, name_es: s.nameEs,
                taxes_2022: s.taxes, effective_tax_rate: s.effRate,
                drivers_license_regardless_of_status: s.dl, dl_law_year: s.dlYear,
                sources: "ITEP 2024 (Appendix Table 1); NCSL driver's-license tracker",
                url: s.url,
            },
            attribution: attribution({}),
        };
    }));
    server.tool("how_to_get_an_itin", "How to apply for an ITIN (IRS Form W-7): the process, documents, timelines, and common mistakes — with the full guide URL. EN/ES.", { lang: LANG }, ro("How to get an ITIN"), guarded("how_to_get_an_itin", async ({ lang }) => {
        const guides = await getGuides();
        const es = (lang ?? "en") === "es";
        const faqs = searchFaqs(guides, es ? "como obtener solicitar itin irs w-7" : "how to get apply for an itin irs w-7", lang ?? "en", 5);
        return {
            // verbatim from the sites' own /how-to-get-an-itin pages — keep in sync
            quick_answer: es
                ? "Para obtener un ITIN, presenta el Formulario W-7 del IRS con prueba de identidad y de estatus extranjero (un pasaporte es lo ideal), por lo general junto con una declaración de impuestos federal. Envíalo por correo, a través de un Agente Tramitador Certificador autorizado por el IRS, o en un Centro de Asistencia al Contribuyente. El procesamiento tarda alrededor de 7-11 semanas. El IRS no cobra ninguna tarifa por el formulario en sí."
                : "You apply with Form W-7 with proof of identity and foreign status (a passport is ideal), usually along with a federal tax return. Submit by mail, through an IRS-authorized Certifying Acceptance Agent, or at a Taxpayer Assistance Center. Processing takes about 7-11 weeks. The IRS charges no fee for the form itself.",
            guide_url: es
                ? "https://itinlending.net/es/how-to-get-an-itin/"
                : "https://itinlending.net/how-to-get-an-itin/",
            faqs: faqs.map(({ score, ...h }) => h),
            attribution: attribution({}),
        };
    }));
}
