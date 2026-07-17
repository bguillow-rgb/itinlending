#!/bin/bash
# Daily driver for the affiliate-click source-of-truth ledger (see
# web/scripts/affiliate-clicks.py and project-docs/ANALYTICS-PLAN.md).
#
# Run by launchd (com.itin.affiliate-clicks) once a day. It regenerates the
# all-time ledger, refreshes a stable `-latest` copy for quick reading, and logs
# the run. It deliberately does NOT git-commit — reports accumulate locally; the
# user commits when they choose.
set -uo pipefail

REPO="/Users/bobguillow/Itin"
VENV_PY="/Users/bobguillow/.claude/skills/seo-pulse/.venv/bin/python"
SCRIPT="$REPO/web/scripts/affiliate-clicks.py"
STAMP="$(date +%F)"

cd "$REPO" || exit 1

echo "=== affiliate-clicks $(date '+%F %T') ==="

if [ ! -x "$VENV_PY" ]; then
  echo "ERROR: seo-pulse venv python not found at $VENV_PY" >&2
  exit 1
fi

# --days 3650 ≈ all-time; the ledger is cumulative so a full pull each day is fine.
"$VENV_PY" "$SCRIPT" --days 3650
rc=$?

if [ $rc -eq 0 ] && [ -f "$REPO/reports/affiliate-clicks-$STAMP.md" ]; then
  cp "$REPO/reports/affiliate-clicks-$STAMP.md"   "$REPO/reports/affiliate-clicks-latest.md"
  cp "$REPO/reports/affiliate-clicks-$STAMP.json" "$REPO/reports/affiliate-clicks-latest.json"
  echo "OK: wrote reports/affiliate-clicks-$STAMP.{md,json} (+ -latest)"
else
  echo "ERROR: python exited $rc or report missing" >&2
  exit 1
fi
