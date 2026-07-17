# Affiliate clicks — ITIN family — source of truth (2026-07-05)

GA4 window: 2016-07-07 → 2026-07-05 (`--days 3650`). Our-side ledger to reconcile against the Awin & CJ dashboards.

- **PRIMARY** = our custom `affiliate_click` event (labeled; all 3 sites).
- **AUTO** = GA4 enhanced-measurement outbound `click` to an affiliate domain (backfill / cross-check).
- **Recon** = the count to compare against the network: PRIMARY when present, else AUTO. Never sum PRIMARY+AUTO for the same row.

**Total affiliate clicks (recon): 1**

## By network

| network | clicks (recon) |
|---------|----------------|
| Awin    | 1              |

## By site

| site             | clicks (recon) |
|------------------|----------------|
| ITIN Credit Card | 1              |

## Every click

| date       | site             | network | destination                                                          | source page | PRIMARY | AUTO |
|------------|------------------|---------|----------------------------------------------------------------------|-------------|---------|------|
| 2026-06-28 | ITIN Credit Card | Awin    | https://www.awin1.com/cread.php?s=3641203&v=66532&q=475588&r=2931103 | /thank-you  | 0       | 1    |
