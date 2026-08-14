export function fold(s) {
    return s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9\s'&-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
export function tokens(s) {
    return fold(s).split(" ").filter((t) => t.length > 1);
}
function overlap(queryToks, text) {
    const t = fold(text);
    let hits = 0;
    for (const q of queryToks)
        if (t.includes(q))
            hits++;
    return queryToks.length ? hits / queryToks.length : 0;
}
const TIER_PRIOR = { flagship: 0.25, cluster: 0.12, detail: 0 };
export function scoreGuide(query, g) {
    const q = tokens(query);
    const title = overlap(q, g.title ?? "") * 1.0;
    const target = overlap(q, `${g.targetQuery ?? ""} ${(g.relatedQueries ?? []).join(" ")}`) * 0.8;
    const answer = overlap(q, g.quickAnswer ?? "") * 0.5;
    const desc = overlap(q, g.description ?? "") * 0.3;
    const base = Math.max(title, target, answer, desc);
    return base > 0 ? base + (TIER_PRIOR[g.tier ?? ""] ?? 0) : 0;
}
export function searchGuides(guides, query, lang, site, limit = 8) {
    return guides
        .filter((g) => (!lang || g.lang === lang) && (!site || g.site === site))
        .map((g) => ({ g, s: scoreGuide(query, g) }))
        .filter((x) => x.s > 0.15)
        .sort((a, b) => b.s - a.s)
        .slice(0, limit)
        .map((x) => x.g);
}
export function findGuide(guides, slug, lang = "en") {
    const f = fold(slug);
    return (guides.find((g) => g.slug === slug && g.lang === lang) ??
        guides.find((g) => g.lang === lang && fold(g.slug).includes(f)) ??
        guides.find((g) => g.lang === lang && overlap(tokens(slug), g.title) > 0.6));
}
export function searchFaqs(guides, query, lang, limit = 6) {
    const qt = tokens(query);
    const hits = [];
    for (const g of guides) {
        if (lang && g.lang !== lang)
            continue;
        for (const f of g.faqs ?? []) {
            const s = overlap(qt, f.q) * 1.0 + overlap(qt, f.a) * 0.35;
            if (s > 0.3)
                hits.push({ q: f.q, a: f.a, url: g.url, site: g.site, lang: g.lang, score: s });
        }
    }
    return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
/** US state name/abbr folding for lender filtering. */
const STATE_ABBR = {
    alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA", colorado: "CO",
    connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID",
    illinois: "IL", indiana: "IN", iowa: "IA", kansas: "KS", kentucky: "KY", louisiana: "LA",
    maine: "ME", maryland: "MD", massachusetts: "MA", michigan: "MI", minnesota: "MN",
    mississippi: "MS", missouri: "MO", montana: "MT", nebraska: "NE", nevada: "NV",
    "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
    "north carolina": "NC", "north dakota": "ND", ohio: "OH", oklahoma: "OK", oregon: "OR",
    pennsylvania: "PA", "rhode island": "RI", "south carolina": "SC", "south dakota": "SD",
    tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT", virginia: "VA", washington: "WA",
    "west virginia": "WV", wisconsin: "WI", wyoming: "WY", "district of columbia": "DC",
};
export function normState(input) {
    const f = fold(input);
    if (f.length === 2)
        return f.toUpperCase();
    return STATE_ABBR[f] ?? input.toUpperCase();
}
export function lendersFor(lenders, vertical, state) {
    // verified_no institutions are excluded from "ITIN-accepting" lists; they
    // remain reachable via get_lender_details with an explicit NOT-accepting label
    let out = lenders.filter((l) => l.vertical === vertical && l.verdict !== "verified_no");
    if (state) {
        const abbr = normState(state);
        out = out.filter((l) => {
            const s = l.states ?? "";
            if (!s || /nationwide|all states|most states/i.test(s))
                return true;
            return (s.toUpperCase().includes(abbr) ||
                fold(s).includes(fold(Object.keys(STATE_ABBR).find((k) => STATE_ABBR[k] === abbr) ?? abbr)));
        });
    }
    // verified lenders first, then by citation count (better-sourced first)
    return out.sort((a, b) => {
        if (a.verdict !== b.verdict)
            return a.verdict === "verified_yes" ? -1 : 1;
        return (b.citations?.length ?? 0) - (a.citations?.length ?? 0);
    });
}
export function findLender(lenders, name) {
    const f = fold(name);
    return (lenders.find((l) => fold(l.name) === f) ??
        lenders.find((l) => fold(l.name).includes(f) || f.includes(fold(l.name))));
}
export function findState(states, input) {
    const abbr = normState(input);
    const name = Object.keys(STATE_ABBR).find((k) => STATE_ABBR[k] === abbr);
    return states.find((s) => fold(s.name) === (name ?? fold(input)) || s.slug === fold(input).replace(/ /g, "-"));
}
