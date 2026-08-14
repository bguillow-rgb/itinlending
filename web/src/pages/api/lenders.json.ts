// The verified ITIN lender/issuer registry, served for the itin-finance-mcp
// server. Canonical data lives in src/data/lenders.json — extracted from the
// flagship verified-list articles across all three sites, then re-verified
// against each institution's own pages (sweep 2026-08-14; per-fact citation
// URLs and dates inside). Update discipline: quarterly re-verification, or
// when reports/lender-verification-*.md flags a change. Never add terms that
// aren't published on the institution's own pages.
import registry from '../../data/lenders.json';

export function GET() {
  return new Response(JSON.stringify(registry), {
    headers: { 'Content-Type': 'application/json' },
  });
}
