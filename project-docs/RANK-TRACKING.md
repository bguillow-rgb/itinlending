# Rank Tracking — on-demand multi-engine rank reports

How to answer "show me where we rank" for the three ITIN sites, on demand, for
free. This is a **reporting** system (where do we already rank, and where on the
live SERP) — distinct from keyword *discovery* (seo-pulse) and the full 20-prompt
audit (the `seo` skill).

## TL;DR — how to run it

Just ask: **"show me the rankings"** / "where do we rank" / "run rankings".
That triggers the `rankings` skill, which runs:

```bash
cd ~/.claude/skills/seo-pulse
.venv/bin/python scripts/rankings.py                       # all 3 ITIN sites
.venv/bin/python scripts/rankings.py --site "ITIN Lending" # one site
```

Output prints as markdown AND saves dated copies to
`~/Itin/.seo/output/rankings-YYYY-MM-DD.md` and `.json`.

## Sites covered (as of 2026-06-16)

The default sweep now covers **all nine** GSC-verified properties we own, not just
the ITIN three: ITIN Lending, ITIN Credit Card, ITIN Credit Score, Pour Picks,
Timberline Ventures, plus the four app sites verified 2026-06-16 — Perfume Picks
(perfumepicks.app), Stick Picks (stickpicks.app), Percolate (percolateapp.com),
and Underdial (underdial.com). The four new ones were added as URL-prefix
properties via the HTML-file method; the verification file
`google084eef54d98d0b31.html` lives in each repo's `web/public/` and **must not
be deleted**. GSC has no backfill, so those four show empty rows until ~early July
2026, then fill in. (wellworthproducts.com and glucometerreviews.com were
intentionally removed from tracking.)

## Architecture — two layers

| Layer | Engine | Script | What it answers | Cost |
|---|---|---|---|---|
| 1 | Google (Search Console API) | `gsc.py` | Avg position for queries you ALREADY rank for | free |
| 1 | Bing (Bing Webmaster Tools API) | `bing.py` | Same, for Bing | free |
| 2 | Google + Bing (Serper.dev) | `serper.py` | Absolute live-SERP position for ANY target keyword | free tier (2,500 credits) |

`rankings.py` merges all of the above per target keyword, plus dumps the full GSC
query list (EN/ES split by URL path), across all three sites in one run. It
**degrades gracefully**: if the Bing or Serper key is missing, those columns read
`n/a` and the rest still runs. Google works today (OAuth token cached by
seo-pulse).

Layer 1 = "where you already rank" (only surfaces keywords with impressions;
average position; lagged ~2 days). Layer 2 = "absolute position on the live
results page right now" — the only way to see rank for keywords you don't yet
appear for in webmaster data.

## Where everything lives (reuses the seo-pulse skill)

All scripts live inside the existing **seo-pulse** skill so they share its auth,
venv, cache, and config — `config.yaml` stays the single source of truth for
sites + target keywords.

- `~/.claude/skills/seo-pulse/config.yaml` — sites, each with `url:`,
  `gsc_property:`, and `target_keywords:`. Edit here to add/adjust keywords.
- `~/.claude/skills/seo-pulse/scripts/`
  - `_common.py` — config loader, date range (end = today−2 for GSC lag),
    markdown tables, 12h disk cache.
  - `gsc.py` — Google Search Console (OAuth, auto-refresh).
  - `bing.py` — Bing Webmaster Tools `GetQueryStats` (aggregates daily rows per
    query → impression-weighted avg position). **NEW.**
  - `serper.py` — Serper.dev absolute SERP rank, Google + Bing. **NEW.**
  - `rankings.py` — the orchestrator that merges + renders the report. **NEW.**
- `~/.claude/skills/rankings/SKILL.md` — the on-demand front door (trigger
  phrases + baked-in output requirements). **NEW.**
- `~/.claude/skills/seo-pulse/.secrets/` — API keys (gitignored).
- `~/Itin/.seo/output/rankings-YYYY-MM-DD.{md,json}` — saved report history.

## Output requirements (every report)

The `rankings` skill always returns, in order:
- **A. The actual data** — full per-site target-keyword tables + full GSC query
  dump (EN/ES). Raw numbers are not summarized away.
- **B. Summary** — closest-to-breakthrough site, movers vs. the last saved
  report, EN vs. ES divergence, demand-without-position keywords. Per locale,
  never blended (global SEO playbook rule for bilingual sites).
- **C. Action items** — prioritized, each tagged impact (high/med/low) +
  time-to-result, naming the specific keyword/URL/site and the concrete step.

## Enabling Bing + Serper (one-time, optional)

Google works now. To light up the `n/a` columns, add either/both keys and re-run
— no code change needed:

- **Bing rankings:** bing.com/webmasters → Settings → API access → Generate API
  key (one key works across all verified sites). Save to
  `~/.claude/skills/seo-pulse/.secrets/bing_api_key.txt` (or env `BING_WMT_API_KEY`).
  Note: the ITIN sites must be verified in Bing Webmaster Tools first.
- **Absolute SERP rank:** sign up free at serper.dev (2,500 credits). Save to
  `~/.claude/skills/seo-pulse/.secrets/serper_api_key.txt` (or env `SERPER_API_KEY`).

## Quota / cost

- GSC + Bing Webmaster = free, no per-call cost.
- Serper = 1 credit per keyword per engine per run (shallow `num=20` scan),
  cached 12h. ~21 keywords × 2 engines ≈ 42 credits/run — comfortable within the
  2,500 free credits.

## Related

- `SEO-AEO.md` — the broader SEO/AEO plan this reports against.
- seo-pulse skill — keyword discovery / longtail mining / opportunity analysis.
- `seo` skill — full 20-prompt surface-aware audit/builder stack.
