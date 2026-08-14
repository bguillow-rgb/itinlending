#!/usr/bin/env bash
# Build the stdio core and copy the compiled modules into the Edge Function
# dir, rewriting bare npm imports to Deno npm: specifiers. Run after ANY
# change to src/tools.ts, src/content.ts, or src/data.ts, then redeploy:
#   supabase functions deploy mcp --no-verify-jwt --project-ref qnthujurzakdmngcidsg
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build >/dev/null
FN_DIR="../supabase/functions/mcp"
for f in tools content data; do
  sed -e 's#from "zod"#from "npm:zod@3.23.8"#' \
      -e 's#from "@modelcontextprotocol/sdk/#from "npm:@modelcontextprotocol/sdk@1.12.0/#' \
      "dist/$f.js" > "$FN_DIR/$f.js"
done
echo "synced dist/{tools,content,data}.js -> $FN_DIR (imports rewritten for Deno)"
