// State-page data (ITEP taxes + NCSL driver's-license laws) as JSON for the
// itin-finance-mcp server. Sources and update discipline live in
// src/data/states.ts — this endpoint only re-serializes it.
import { STATES } from '../../data/states';
import { SITE } from '../../consts';

export function GET() {
  const states = STATES.map((s) => ({ ...s, url: `${SITE.url}/itin-loans/${s.slug}/` }));
  return new Response(
    JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), states }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}
