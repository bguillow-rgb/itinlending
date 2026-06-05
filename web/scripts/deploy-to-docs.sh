#!/usr/bin/env bash
# Build the Astro site and replace the contents of ../docs with the build.
# GitHub Pages serves /docs from the main branch, so this is the publish step.
#
# Run from web/:  bash scripts/deploy-to-docs.sh
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Building Astro site"
npm run build

DOCS_DIR="../docs"

echo "==> Replacing $DOCS_DIR with fresh build"
rm -rf "$DOCS_DIR"
mkdir -p "$DOCS_DIR"
cp -R dist/. "$DOCS_DIR"/

echo "==> /docs now contains:"
ls "$DOCS_DIR"

echo ""
echo "Done. Commit the changes in /docs and push to publish."
