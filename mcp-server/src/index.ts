#!/usr/bin/env node
/**
 * itin-finance-mcp — read-only MCP server over the ITIN finance network's
 * editorial content (itinlending.net, itincreditcard.com, itincreditscore.com).
 * Stdio transport entry point; tool logic lives in tools.ts (shared with the
 * remote Edge Function variant).
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools.js";
import { SERVER_VERSION, setClientInfo, logCall } from "./telemetry.js";

const server = new McpServer(
  { name: "itin-finance", version: SERVER_VERSION },
  { capabilities: { tools: {} } },
);

registerTools(server, logCall);

async function main() {
  const transport = new StdioServerTransport();
  // clientInfo arrives with the client's initialize request, after connect()
  // returns. Reading it straight after connect always got undefined, so every
  // stdio row logged a blank client_name from launch until 1.0.2.
  server.server.oninitialized = () => setClientInfo(server.server.getClientVersion());
  await server.connect(transport);
  console.error(`itin-finance-mcp ${SERVER_VERSION} ready (stdio)`);
}

main().catch((e) => {
  console.error("fatal:", e);
  process.exit(1);
});
