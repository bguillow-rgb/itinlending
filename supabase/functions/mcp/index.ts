// @ts-nocheck — Supabase Edge Functions runtime (Deno).
//
// Remote (streamable-HTTP) variant of itin-finance-mcp. The npm package
// (mcp-server/ in this repo) serves local stdio clients; this function serves
// web agents and MCP directories that require a hosted URL (Smithery etc.).
//
// tools.js / content.js / data.js are COMPILED builds of mcp-server/src/*,
// copied in by mcp-server/scripts/sync-edge.sh (which rewrites bare imports
// to npm: specifiers). One core, two transports — never edit those files
// here; edit src/ and re-sync.
//
// Hardened per mcp-aeo-playbook Part 2b: no auth (public editorial content),
// anon key only (no service key anywhere in this function), write-only capped
// telemetry, GA4 events with enum'd ai_client, generic errors to callers,
// EdgeRuntime.waitUntil for telemetry sends.

import { Hono } from "npm:hono@4";
import { cors } from "npm:hono@4/cors";
import { StreamableHTTPTransport } from "npm:@hono/mcp@0.1.4";
import { McpServer } from "npm:@modelcontextprotocol/sdk@1.12.0/server/mcp.js";
import { registerTools } from "./tools.js";
import { identify, rateGuard, tooManyRequests } from "./ratelimit.js";
import { requestContext } from "./calllog.js";
import { newRef, aiSource, tagWeb } from "./tracking.js";

// The one mcp.<domain> hostname our proxy fronts this function with.
const PROXY_HOST = "mcp.itinlending.net";

const SERVER_VERSION = "1.0.0";
const TELEMETRY_VERSION = `${SERVER_VERSION}-remote`;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const GA4_ID = Deno.env.get("GA4_MEASUREMENT_ID");
const GA4_SECRET = Deno.env.get("GA4_MP_API_SECRET");

function normalizeAiClient(ua) {
  const s = (ua ?? "").toLowerCase();
  if (s.includes("claude") || s.includes("anthropic")) return "claude";
  if (s.includes("chatgpt") || s.includes("openai") || s.includes("gpt")) return "openai";
  if (s.includes("perplexity")) return "perplexity";
  if (s.includes("gemini") || s.includes("google")) return "google";
  if (s.includes("cursor")) return "cursor";
  if (s.includes("smithery")) return "smithery";
  return "other";
}

async function sha256Prefix(input) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf).slice(0, 16))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Tag every link to our own sites in a tool result with UTM + the per-call ref
// (see tracking.js). Institution citation URLs are left exactly as published.
const OWN_HOSTS = /(^|\.)(itinlending\.net|itincreditcard\.com|itincreditscore\.com)$/;
function tagOwnLinks(value, t) {
  if (typeof value === "string") {
    if (!/^https:\/\//.test(value)) return value;
    try {
      return OWN_HOSTS.test(new URL(value).hostname) ? tagWeb(value, t) : value;
    } catch {
      return value;
    }
  }
  if (Array.isArray(value)) return value.map((v) => tagOwnLinks(v, t));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = tagOwnLinks(v, t);
    return out;
  }
  return value;
}

// tools.js registers with server.tool(name, ..., handler); wrap the handler (last
// argument) so its JSON result is tagged before it leaves the server.
function trackResults(server, ctx) {
  const tool = server.tool.bind(server);
  server.tool = (name, ...rest) => {
    const handler = rest.pop();
    return tool(name, ...rest, async (...a) => {
      const res = await handler(...a);
      if (res?.isError || !Array.isArray(res?.content)) return res;
      const t = { source: aiSource(ctx.clientName), tool: name, ref: ctx.clickRef };
      return {
        ...res,
        content: res.content.map((c) => {
          if (c.type !== "text") return c;
          try {
            return { ...c, text: JSON.stringify(tagOwnLinks(JSON.parse(c.text), t), null, 2) };
          } catch {
            return c;
          }
        }),
      };
    });
  };
}

function makeEdgeLogger(ctx, ip) {
  const userAgent = ctx.clientName ?? "";
  return (entry) => {
    const send = (async () => {
      try {
        let args = null;
        try {
          const s = JSON.stringify(entry.args);
          args = s && s.length > 2000 ? { truncated: true, chars: s.length } : entry.args;
        } catch { /* stays null */ }
        await fetch(`${SUPABASE_URL}/rest/v1/mcp_call_logs`, {
          method: "POST",
          headers: {
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            tool_name: entry.tool_name.slice(0, 64),
            args,
            client_name: (userAgent ?? "unknown").slice(0, 200),
            server_version: TELEMETRY_VERSION,
            success: entry.success,
            error: entry.error?.slice(0, 512) ?? null,
            duration_ms: Math.min(Math.max(Math.round(entry.duration_ms), 0), 600000),
            result_count: entry.success && Number.isInteger(entry.result_count) ? entry.result_count : null,
            referer: ctx.referer,
            origin: ctx.origin,
            entry_point: ctx.entryPoint,
            click_ref: ctx.clickRef ?? null,
          }),
        });
        if (GA4_ID && GA4_SECRET) {
          const clientId = await sha256Prefix(`${ip}|${userAgent}`);
          await fetch(
            `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_ID}&api_secret=${GA4_SECRET}`,
            {
              method: "POST",
              body: JSON.stringify({
                client_id: clientId,
                events: [{
                  name: "ai_mcp_call",
                  params: {
                    tool_name: entry.tool_name.slice(0, 64),
                    ai_client: normalizeAiClient(userAgent),
                    call_success: String(entry.success),
                    server_version: TELEMETRY_VERSION,
                  },
                }],
              }),
            },
          );
        }
      } catch (e) {
        console.error("telemetry:", e?.message ?? e);
      }
    })();
    try { EdgeRuntime.waitUntil(send); } catch { /* local dev */ }
  };
}

const app = new Hono();

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Accept", "Authorization", "Mcp-Session-Id"],
}));

app.all("*", async (c) => {
  // Identity comes from the proxy when it vouches for the request; otherwise from
  // x-forwarded-for. Never from the User-Agent alone — see ratelimit.js.
  const who = identify(c.req);
  const { ip, tier } = who;

  // CORS preflight carries no payload and must not consume a caller's budget.
  if (c.req.method !== "OPTIONS") {
    const gate = await rateGuard(ip, tier);
    if (!gate.allowed) return tooManyRequests(gate.retry_after, gate.reason);
  }

  const server = new McpServer(
    { name: "itin-finance", version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );
  const ctx = requestContext(c, who, PROXY_HOST);
  ctx.clickRef = newRef(); // one tool call per request: tags this response's links and its log row
  trackResults(server, ctx);
  registerTools(server, makeEdgeLogger(ctx, ip));
  const transport = new StreamableHTTPTransport();
  await server.connect(transport);
  return transport.handleRequest(c);
});

Deno.serve(app.fetch);
