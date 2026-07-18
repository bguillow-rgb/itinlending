// State of ITIN Lending — quarterly HMDA data pull.
//
// Feeds the "State of ITIN Lending" report (System 4 of the Link Engine,
// project-docs/LINK-ENGINE-PLAN.md). Pulls mortgage origination and denial
// aggregates from the CFPB/FFIEC HMDA data-browser API for the states where
// ITIN mortgage programs concentrate, plus nationwide totals.
//
// HONESTY CONSTRAINT (documented in the report's Methodology section, keep it
// true here too): HMDA has NO ITIN field. Nothing this script pulls is a count
// of ITIN loans. Hispanic-or-Latino borrower aggregates in high-ITIN states are
// CONTEXT for the market ITIN lenders serve, and every table built from this
// output must label them that way. The ITIN-specific layer of the report comes
// from IRS/TIGTA filer counts, the site's tracked lender list, and cited
// industry estimates — not from this data.
//
// Usage:            node scripts/hmda-pull.mjs
// Refresh cadence:  quarterly, when a new report edition is written. Bump
//                   YEARS when the next HMDA annual file lands (each year's
//                   national file is published the following summer).
// Output:           web/src/data/hmda-state-of-itin.json (committed) plus a
//                   markdown table dump on stdout for pasting into the report.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const API = 'https://ffiec.cfpb.gov/v2/data-browser-api/view';
// Latest HMDA annual data available at pull time. 2024 is the newest full year
// as of mid-2026; the 2025 file is expected in summer 2026 — check
// ffiec.cfpb.gov/data-publication before each quarterly refresh.
const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];
// States where the site's tracked ITIN mortgage lenders concentrate (see the
// lender list in web/src/content/articles/itin-mortgage-lenders-approved.md).
const STATES = ['TX', 'CA', 'FL', 'AZ', 'IL', 'GA', 'NC', 'NY'];
// HMDA action codes: 1 = loan originated, 3 = application denied.
const ACTIONS = { originated: 1, denied: 3 };
const ETH = 'Hispanic or Latino';

async function pull(params) {
  const scope = params.states ? 'aggregations' : 'nationwide/aggregations';
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API}/${scope}?${qs}`);
  if (!res.ok) throw new Error(`HMDA API ${res.status} for ${qs}`);
  const json = await res.json();
  const agg = json.aggregations?.[0];
  return { count: agg?.count ?? 0, dollars: agg?.sum ?? 0 };
}

const out = { pulledAt: new Date().toISOString().slice(0, 10), years: YEARS, states: STATES, ethnicityFilter: ETH, note: 'HMDA has no ITIN field. These are all-borrower and Hispanic-or-Latino aggregates used as market context only.', data: {} };

for (const year of YEARS) {
  out.data[year] = { nationwide: {}, byState: {} };
  const nw = out.data[year].nationwide;
  nw.allOriginated = await pull({ years: year, actions_taken: ACTIONS.originated });
  nw.hispanicOriginated = await pull({ years: year, actions_taken: ACTIONS.originated, ethnicities: ETH });
  nw.hispanicDenied = await pull({ years: year, actions_taken: ACTIONS.denied, ethnicities: ETH });
  for (const st of STATES) {
    out.data[year].byState[st] = {
      allOriginated: await pull({ years: year, states: st, actions_taken: ACTIONS.originated }),
      hispanicOriginated: await pull({ years: year, states: st, actions_taken: ACTIONS.originated, ethnicities: ETH }),
      hispanicDenied: await pull({ years: year, states: st, actions_taken: ACTIONS.denied, ethnicities: ETH }),
    };
  }
  console.error(`pulled ${year}`);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../src/data/hmda-state-of-itin.json');
writeFileSync(outPath, JSON.stringify(out, null, 2));
console.error(`wrote ${outPath}`);

// Markdown table dumps for the report (paste, then label per the honesty note).
const fmtB = (n) => `$${(n / 1e9).toFixed(1)}B`;
const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) + '%' : 'n/a');

console.log('\n### Nationwide, Hispanic or Latino borrowers (context, NOT ITIN counts)\n');
console.log('| Year | Loans originated | Dollar volume | Share of all originations | Denial rate* |');
console.log('|---|---|---|---|---|');
for (const y of YEARS) {
  const d = out.data[y].nationwide;
  const denialRate = pct(d.hispanicDenied.count, d.hispanicDenied.count + d.hispanicOriginated.count);
  console.log(`| ${y} | ${d.hispanicOriginated.count.toLocaleString('en-US')} | ${fmtB(d.hispanicOriginated.dollars)} | ${pct(d.hispanicOriginated.count, d.allOriginated.count)} | ${denialRate} |`);
}
console.log('\n*Denials as a share of originations + denials (excludes withdrawn/incomplete files).\n');

const latest = YEARS[YEARS.length - 1];
console.log(`### By state, ${latest}, Hispanic or Latino borrowers (context, NOT ITIN counts)\n`);
console.log('| State | Loans originated | Dollar volume | Share of state originations | Denial rate* |');
console.log('|---|---|---|---|---|');
for (const st of STATES) {
  const d = out.data[latest].byState[st];
  const denialRate = pct(d.hispanicDenied.count, d.hispanicDenied.count + d.hispanicOriginated.count);
  console.log(`| ${st} | ${d.hispanicOriginated.count.toLocaleString('en-US')} | ${fmtB(d.hispanicOriginated.dollars)} | ${pct(d.hispanicOriginated.count, d.allOriginated.count)} | ${denialRate} |`);
}
