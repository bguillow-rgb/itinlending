// Lead Intelligence — dashboard DATA API (M4).  GET /functions/v1/dashboard?data=1
//
// Supabase forces text/plain + a sandbox CSP on function responses, so a function
// can't serve a rendered HTML page. Instead this is a JSON data API (CORS-enabled,
// access-code gated) consumed by the local admin file admin/lead-intelligence.html.
// The Supabase service role stays server-side; the browser only ever sends the code.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ACCESS_CODE = Deno.env.get("DASHBOARD_ACCESS_CODE") || "";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "x-access-code, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const url = new URL(req.url);

  if (url.searchParams.get("data") === "1") {
    if (!ACCESS_CODE || req.headers.get("x-access-code") !== ACCESS_CODE) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...CORS, "content-type": "application/json" } });
    }
    const r = await fetch(`${SUPABASE_URL}/rest/v1/lead_dashboard?order=created_at.desc&limit=2000`, {
      headers: { apikey: SERVICE_KEY, authorization: `Bearer ${SERVICE_KEY}` },
    });
    return new Response(await r.text(), { status: r.status, headers: { ...CORS, "content-type": "application/json" } });
  }

  return new Response("Lead Intelligence data API — open admin/lead-intelligence.html.", { headers: { ...CORS, "content-type": "text/plain" } });
});
