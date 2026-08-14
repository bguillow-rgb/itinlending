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

export interface Guide {
  site: "lending" | "creditcard" | "creditscore";
  lang: "en" | "es";
  slug: string;
  url: string;
  title: string;
  description: string;
  tier?: string;
  category?: string;
  targetQuery?: string;
  relatedQueries: string[];
  quickAnswer?: string;
  publishedAt?: string;
  relatedSlugs: string[];
  faqs: { q: string; a: string }[];
}

export interface LenderFact {
  value: string;
  verifiedAt: string;
  sourceUrl: string;
}

export interface Lender {
  name: string;
  vertical: "auto" | "mortgage" | "personal" | "business" | "creditcard";
  verdict: "verified_yes" | "unverified";
  itinNotes?: string;
  states?: string;
  membership?: string;
  channel?: string;
  publishedTerms?: string;
  products?: { product: string; notes?: string }[];
  citations: { url: string; accessed: string }[];
  articleUrls: string[];
  verifiedAt: string;
}

export interface StateInfo {
  slug: string;
  name: string;
  nameEs: string;
  taxes: string;
  effRate: string;
  dl: boolean;
  dlYear?: number;
  url: string;
}

const SITES = [
  { key: "lending", base: "https://itinlending.net" },
  { key: "creditcard", base: "https://itincreditcard.com" },
  { key: "creditscore", base: "https://itincreditscore.com" },
] as const;

const CACHE_TTL_MS = 15 * 60 * 1000;
const cache = new Map<string, { at: number; data: unknown }>();

async function loadJson(path: string, site?: string): Promise<unknown> {
  const localDir = process.env.ITIN_MCP_DATA_DIR;
  if (localDir) {
    const fn = site ? `${site}-${path}` : path;
    return JSON.parse(await readFile(join(localDir, fn), "utf-8"));
  }
  const base = site ? SITES.find((s) => s.key === site)!.base : SITES[0].base;
  const url = `${base}/api/${path}`;
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;
  const res = await fetch(url, { headers: { "user-agent": "itin-finance-mcp" } });
  if (!res.ok) {
    if (hit) return hit.data; // stale beats broken
    throw new Error(`fetch ${path} failed: ${res.status}`);
  }
  const data = await res.json();
  cache.set(url, { at: Date.now(), data });
  return data;
}

export async function getGuides(): Promise<Guide[]> {
  const all = await Promise.all(
    SITES.map(async (s) => {
      try {
        const j = (await loadJson("guides.json", s.key)) as { guides: Guide[] };
        return j.guides ?? [];
      } catch {
        return []; // one site down must not break the other two
      }
    }),
  );
  return all.flat();
}

export async function getLenders(): Promise<Lender[]> {
  const j = (await loadJson("lenders.json", "lending")) as { lenders: Lender[] };
  return j.lenders ?? [];
}

export async function getStates(): Promise<StateInfo[]> {
  const j = (await loadJson("states.json", "lending")) as { states: StateInfo[] };
  return j.states ?? [];
}
