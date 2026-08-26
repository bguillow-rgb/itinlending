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
import { clientTier, rateGuard, tooManyRequests } from "./ratelimit.js";

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

function makeEdgeLogger(userAgent, ip) {
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
  const ua = c.req.header("user-agent") ?? "";
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // CORS preflight carries no payload and must not consume a caller's budget.
  if (c.req.method !== "OPTIONS") {
    const gate = await rateGuard(ip, clientTier(ua));
    if (!gate.allowed) return tooManyRequests(gate.retry_after, gate.reason);
  }

  const server = new McpServer(
    { name: "itin-finance", version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );
  registerTools(server, makeEdgeLogger(ua, ip));
  const transport = new StreamableHTTPTransport();
  await server.connect(transport);
  return transport.handleRequest(c);
});

Deno.serve(app.fetch);
