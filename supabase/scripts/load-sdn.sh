#!/bin/bash
# Load/refresh the OFAC SDN list (INDIVIDUALS only) into public.sdn_names.
# Usage: SUPABASE_ACCESS_TOKEN=... SUPABASE_PROJECT_REF=... bash load-sdn.sh
# Re-runnable: truncates and reloads. Schedule monthly (SDN list changes often).
set -euo pipefail

: "${SUPABASE_ACCESS_TOKEN:?set SUPABASE_ACCESS_TOKEN}"
: "${SUPABASE_PROJECT_REF:?set SUPABASE_PROJECT_REF}"
API="https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_REF/database/query"
SRC="https://www.treasury.gov/ofac/downloads/sdn.csv"
TMP=$(mktemp -d)

echo "downloading SDN list…"
curl -sL --max-time 120 "$SRC" -o "$TMP/sdn.csv"
wc -l "$TMP/sdn.csv"

echo "parsing individuals + building SQL batches…"
python3 - "$TMP" <<'PY'
import csv, sys, os
tmp = sys.argv[1]
rows = []
with open(os.path.join(tmp, "sdn.csv"), encoding="latin-1") as f:
    for r in csv.reader(f):
        if len(r) < 3: continue
        ent, name, typ = r[0].strip(), r[1].strip(), r[2].strip().lower()
        if typ != "individual" or not ent.isdigit(): continue
        norm = "".join(c if c.isalnum() or c.isspace() else " " for c in name.lower())
        norm = " ".join(norm.split())
        rows.append((int(ent), name.replace("'", "''"), norm.replace("'", "''")))
print(f"individuals: {len(rows)}")
B = 500
batches = [rows[i:i+B] for i in range(0, len(rows), B)]
for i, b in enumerate(batches):
    vals = ",".join(f"({e},'{n}','{m}')" for e, n, m in b)
    with open(os.path.join(tmp, f"batch_{i:03}.sql"), "w") as out:
        out.write(f"insert into public.sdn_names(ent_num,name,name_norm) values {vals} on conflict (ent_num) do update set name=excluded.name, name_norm=excluded.name_norm;")
print(f"batches: {len(batches)}")
PY

echo "truncating + loading…"
q() { curl -s -X POST "$API" -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" -H 'content-type: application/json' \
      --data-binary "$(python3 -c 'import json,sys;print(json.dumps({"query":open(sys.argv[1]).read()}))' "$1")" ; }
echo '{"query":"truncate public.sdn_names;"}' > "$TMP/trunc.json"
curl -s -X POST "$API" -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" -H 'content-type: application/json' -d @"$TMP/trunc.json" >/dev/null

n=0
for f in "$TMP"/batch_*.sql; do
  q "$f" >/dev/null
  n=$((n+1)); printf "\rloaded batch %d" "$n"
done
echo ""
curl -s -X POST "$API" -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" -H 'content-type: application/json' \
  -d '{"query":"select count(*) from public.sdn_names;"}'
echo ""
rm -rf "$TMP"
echo "done."
