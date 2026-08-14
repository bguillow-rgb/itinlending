-- 0007_mcp_call_logs.sql  (applied to prod 2026-08-14 via Management API)
--
-- Write-only telemetry drop box for the public itin-finance-mcp server
-- (mcp-server/). Measures the "AI calls (MCP)" channel across all three ITIN
-- sites. The public server runs on the publishable key, so INSERT is open to
-- anon — but there are deliberately NO select/update/delete policies (reads
-- require the service role). Hardened from day one per the MCP AEO playbook:
-- DB-level CHECK constraints (client-side caps mean nothing when the key
-- ships in a public package) and a 90-day pg_cron purge (args can carry
-- conversational fragments). Rows are spoofable in CONTENT — reports built on
-- this table must label the numbers as unauthenticated telemetry.

CREATE TABLE IF NOT EXISTS mcp_call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL CHECK (char_length(tool_name) <= 64),
  args JSONB CHECK (args IS NULL OR pg_column_size(args) <= 4096),
  client_name TEXT CHECK (client_name IS NULL OR char_length(client_name) <= 200),
  client_version TEXT CHECK (client_version IS NULL OR char_length(client_version) <= 64),
  server_version TEXT CHECK (server_version IS NULL OR char_length(server_version) <= 32),
  success BOOLEAN NOT NULL DEFAULT true,
  error TEXT CHECK (error IS NULL OR char_length(error) <= 600),
  duration_ms INTEGER CHECK (duration_ms IS NULL OR (duration_ms >= 0 AND duration_ms <= 600000)),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mcp_call_logs_created ON mcp_call_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_mcp_call_logs_tool ON mcp_call_logs (tool_name);

ALTER TABLE mcp_call_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "MCP clients can log calls" ON mcp_call_logs;
CREATE POLICY "MCP clients can log calls"
  ON mcp_call_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-mcp-call-logs') THEN
    PERFORM cron.schedule(
      'purge-mcp-call-logs',
      '17 5 * * *',
      'DELETE FROM mcp_call_logs WHERE created_at < now() - interval ''90 days'''
    );
  END IF;
END $$;
