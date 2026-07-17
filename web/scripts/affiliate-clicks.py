#!/usr/bin/env python3
"""Affiliate-click source of truth for the ITIN family (GA4).

Pulls every affiliate outbound click across the three ITIN GA4 properties
(itinlending.net, itincreditcard.com, itincreditscore.com) so the counts can be
reconciled against the Awin and CJ (Commission Junction) dashboards. This is the
"our-side" ledger: what OUR site recorded, to hold next to what the networks
report they paid on.

Two GA4 signals are unioned so nothing is missed:
  1. affiliate_click  — our custom, labeled event (web/src/components/Analytics.astro;
     all 3 sites, fires on any anchor with rel="sponsored"). Authoritative going
     forward. Tagged PRIMARY.
  2. click            — GA4 enhanced-measurement outbound click, filtered client-side
     to known affiliate redirect domains. Backfills the window before the custom
     event was firing/deployed, and covers any sponsored link that shipped without
     rel="sponsored" or on a site with the custom handler disabled. Tagged AUTO.

Reconciling: a single click on a site that has BOTH signals on can appear as PRIMARY
*and* AUTO — do not sum the two tags blindly. Prefer PRIMARY as the count; treat AUTO
as coverage/cross-check. Per-(site,date,url) the report shows both so you can see
which signal caught it.

Network is inferred from the destination domain (Awin vs CJ vs Other).

Auth/deps are reused from the seo-pulse skill (GA4 OAuth token + venv + config with
the ga4_property ids). Run with that venv:

    ~/.claude/skills/seo-pulse/.venv/bin/python web/scripts/affiliate-clicks.py [--days N]

--days defaults to 3650 (effectively all-time). Output:
    reports/affiliate-clicks-YYYY-MM-DD.md   (human)
    reports/affiliate-clicks-YYYY-MM-DD.json (machine / reconciliation)
"""
import os
import sys
import json
import argparse
from datetime import date, timedelta
from urllib.parse import urlparse

SEO_PULSE = os.path.expanduser("~/.claude/skills/seo-pulse/scripts")
sys.path.insert(0, SEO_PULSE)
import _common  # noqa: E402
import ga4       # noqa: E402

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REPORTS = os.path.join(REPO, "reports")

# Affiliate redirect domains → network. Awin uses awin1.com; CJ (Commission
# Junction) rotates a pool of tracking domains. Extend as new programs are added.
AWIN_DOMAINS = {"awin1.com", "www.awin1.com", "awin.com"}
CJ_DOMAINS = {
    "dpbolvw.net", "anrdoezrs.net", "kqzyfj.com", "jdoqocy.com", "tkqlhce.com",
    "qksrv.net", "emjcd.com", "ftjcfx.com", "awltovhc.com", "lduhtrp.net",
    "tqlkg.com", "kmyoft.com", "jtbanners.com", "cualbo.com", "yceml.net",
}


def network_for(url: str) -> str:
    host = (urlparse(url).netloc or "").lower()
    if host in AWIN_DOMAINS:
        return "Awin"
    if host in CJ_DOMAINS or host.endswith(".cj.com") or host == "cj.com":
        return "CJ"
    return "Other"


def is_affiliate(url: str) -> bool:
    return network_for(url) != "Other"


def fmt_date(d: str) -> str:
    # GA4 returns YYYYMMDD.
    return f"{d[0:4]}-{d[4:6]}-{d[6:8]}" if len(d) == 8 and d.isdigit() else d


def event_filter(name: str):
    return {"filter": {"fieldName": "eventName",
                       "stringFilter": {"value": name}}}


def pull(prop: str, event: str, start: str, end: str):
    """Return rows of (date, link_url, page_path, count) for one event."""
    rows = ga4.run_report(
        prop, ["date", "linkUrl", "pagePath"], ["eventCount"],
        start, end, dim_filter=event_filter(event), limit=10000,
    )
    out = []
    for r in rows:
        d, url, page = r["dims"][0], r["dims"][1], r["dims"][2]
        cnt = int(r["mets"][0])
        out.append((fmt_date(d), url, page, cnt))
    return out


def main():
    ap = argparse.ArgumentParser(description="ITIN affiliate-click source of truth (GA4)")
    ap.add_argument("--days", type=int, default=3650,
                    help="lookback window in days (default 3650 ≈ all-time)")
    args = ap.parse_args()

    cfg = _common.load_config()
    end = date.today()
    start = end - timedelta(days=args.days)
    start_s, end_s = start.isoformat(), end.isoformat()

    sites = [s for s in cfg["sites"] if "itin" in s["name"].lower()]

    # ledger[(site, date, url, page)] = {"PRIMARY": n, "AUTO": n}
    ledger = {}

    def add(site, tag, rows, affiliate_only):
        for d, url, page, cnt in rows:
            if affiliate_only and not is_affiliate(url):
                continue
            key = (site, d, url, page)
            ledger.setdefault(key, {"PRIMARY": 0, "AUTO": 0})
            ledger[key][tag] += cnt

    for s in sites:
        name = s["name"]
        prop = s.get("ga4_property", "")
        if not prop:
            continue
        if not prop.startswith("properties/"):
            prop = "properties/" + prop
        # PRIMARY: every custom affiliate_click (already only fires on sponsored links).
        add(name, "PRIMARY", pull(prop, "affiliate_click", start_s, end_s), affiliate_only=False)
        # AUTO: enhanced-measurement outbound clicks, kept only if to an affiliate domain.
        add(name, "AUTO", pull(prop, "click", start_s, end_s), affiliate_only=True)

    # Flatten + sort by date then site.
    records = []
    for (site, d, url, page), tags in ledger.items():
        records.append({
            "date": d, "site": site, "network": network_for(url),
            "url": url, "page": page,
            "primary": tags["PRIMARY"], "auto": tags["AUTO"],
        })
    records.sort(key=lambda r: (r["date"], r["site"], r["url"]))

    # Totals: PRIMARY is the authoritative count; AUTO-only rows (primary==0) are
    # additional clicks the custom event missed, so the reconciliation total is
    # PRIMARY + (AUTO where PRIMARY==0).
    def recon(r):
        return r["primary"] if r["primary"] else r["auto"]

    by_net = {}
    by_site = {}
    for r in records:
        by_net[r["network"]] = by_net.get(r["network"], 0) + recon(r)
        by_site[r["site"]] = by_site.get(r["site"], 0) + recon(r)
    grand = sum(recon(r) for r in records)

    os.makedirs(REPORTS, exist_ok=True)
    stamp = end.isoformat()
    md_path = os.path.join(REPORTS, f"affiliate-clicks-{stamp}.md")
    json_path = os.path.join(REPORTS, f"affiliate-clicks-{stamp}.json")

    # --- markdown ---
    lines = []
    lines.append(f"# Affiliate clicks — ITIN family — source of truth ({stamp})")
    lines.append("")
    lines.append(f"GA4 window: {start_s} → {end_s} (`--days {args.days}`). "
                 "Our-side ledger to reconcile against the Awin & CJ dashboards.")
    lines.append("")
    lines.append("- **PRIMARY** = our custom `affiliate_click` event (labeled; all 3 sites).")
    lines.append("- **AUTO** = GA4 enhanced-measurement outbound `click` to an affiliate "
                 "domain (backfill / cross-check).")
    lines.append("- **Recon** = the count to compare against the network: PRIMARY when "
                 "present, else AUTO. Never sum PRIMARY+AUTO for the same row.")
    lines.append("")
    lines.append(f"**Total affiliate clicks (recon): {grand}**")
    lines.append("")
    lines.append("## By network")
    lines.append("")
    lines.append(_common.md_table(
        ["network", "clicks (recon)"],
        [[k, by_net[k]] for k in sorted(by_net, key=lambda x: -by_net[x])]) or "_none_")
    lines.append("")
    lines.append("## By site")
    lines.append("")
    lines.append(_common.md_table(
        ["site", "clicks (recon)"],
        [[k, by_site[k]] for k in sorted(by_site, key=lambda x: -by_site[x])]) or "_none_")
    lines.append("")
    lines.append("## Every click")
    lines.append("")
    lines.append(_common.md_table(
        ["date", "site", "network", "destination", "source page", "PRIMARY", "AUTO"],
        [[r["date"], r["site"], r["network"], r["url"], r["page"],
          r["primary"], r["auto"]] for r in records]) or "_no affiliate clicks in window_")
    lines.append("")
    with open(md_path, "w") as f:
        f.write("\n".join(lines))

    with open(json_path, "w") as f:
        json.dump({
            "generated": stamp,
            "window": {"start": start_s, "end": end_s, "days": args.days},
            "totals": {"grand_recon": grand, "by_network": by_net, "by_site": by_site},
            "clicks": records,
        }, f, indent=2)

    print("\n".join(lines))
    print(f"\nSaved: {md_path}")
    print(f"Saved: {json_path}")


if __name__ == "__main__":
    main()
