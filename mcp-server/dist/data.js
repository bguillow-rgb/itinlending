/**
 * Data layer: the three sites publish machine-readable JSON at build time
 * (/api/guides.json on each; /api/lenders.json + /api/states.json on
 * itinlending.net). We fetch live with a short in-process cache so the
 * 3x/week content pipeline keeps this server fresh with no republish.
 *
 * ITIN_MCP_DATA_DIR (explicit env var only — never file scanning) points at a
 * local directory of the same JSON files for development and tests.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
const SITES = [
    { key: "lending", base: "https://itinlending.net" },
    { key: "creditcard", base: "https://itincreditcard.com" },
    { key: "creditscore", base: "https://itincreditscore.com" },
];
const CACHE_TTL_MS = 15 * 60 * 1000;
const cache = new Map();
async function loadJson(path, site) {
    const localDir = process.env.ITIN_MCP_DATA_DIR;
    if (localDir) {
        const fn = site ? `${site}-${path}` : path;
        return JSON.parse(await readFile(join(localDir, fn), "utf-8"));
    }
    const base = site ? SITES.find((s) => s.key === site).base : SITES[0].base;
    const url = `${base}/api/${path}`;
    const hit = cache.get(url);
    if (hit && Date.now() - hit.at < CACHE_TTL_MS)
        return hit.data;
    const res = await fetch(url, { headers: { "user-agent": "itin-finance-mcp" } });
    if (!res.ok) {
        if (hit)
            return hit.data; // stale beats broken
        throw new Error(`fetch ${path} failed: ${res.status}`);
    }
    const data = await res.json();
    cache.set(url, { at: Date.now(), data });
    return data;
}
export async function getGuides() {
    const all = await Promise.all(SITES.map(async (s) => {
        try {
            const j = (await loadJson("guides.json", s.key));
            return j.guides ?? [];
        }
        catch {
            return []; // one site down must not break the other two
        }
    }));
    return all.flat();
}
export async function getLenders() {
    const j = (await loadJson("lenders.json", "lending"));
    return j.lenders ?? [];
}
export async function getStates() {
    const j = (await loadJson("states.json", "lending"));
    return j.states ?? [];
}
