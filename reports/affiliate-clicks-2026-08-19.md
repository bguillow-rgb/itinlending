# Affiliate clicks — ITIN family — source of truth (2026-08-19)

GA4 window: 2016-08-21 → 2026-08-19 (`--days 3650`). Our-side ledger to reconcile against the Awin & CJ dashboards.

- **PRIMARY** = our custom `affiliate_click` event (labeled; all 3 sites).
- **AUTO** = GA4 enhanced-measurement outbound `click` to an affiliate domain (backfill / cross-check).
- **Recon** = the count to compare against the network: PRIMARY when present, else AUTO. Never sum PRIMARY+AUTO for the same row.

**Total affiliate clicks (recon): 9**

## By network

| network | clicks (recon) |
|---------|----------------|
| Awin    | 9              |

## By site

| site              | clicks (recon) |
|-------------------|----------------|
| ITIN Credit Card  | 6              |
| ITIN Credit Score | 3              |

## Every click

| date       | site              | network | destination                                                          | source page                                                  | PRIMARY | AUTO |
|------------|-------------------|---------|----------------------------------------------------------------------|--------------------------------------------------------------|---------|------|
| 2026-06-28 | ITIN Credit Card  | Awin    | https://www.awin1.com/cread.php?s=3641203&v=66532&q=475588&r=2931103 | /thank-you                                                   | 0       | 1    |
| 2026-07-11 | ITIN Credit Card  | Awin    | https://www.awin1.com/cread.php?s=3597059&v=66532&q=475588&r=2931103 | /thank-you                                                   | 0       | 1    |
| 2026-08-01 | ITIN Credit Card  | Awin    | https://www.awin1.com/cread.php?s=3597059&v=66532&q=475588&r=2931103 | /articles/credit-cards-that-accept-itin-verified-issuer-list | 0       | 1    |
| 2026-08-05 | ITIN Credit Card  | Awin    | https://www.awin1.com/cread.php?s=3597059&v=66532&q=475588&r=2931103 | /thank-you                                                   | 0       | 1    |
| 2026-08-05 | ITIN Credit Score | Awin    | https://www.awin1.com/cread.php?s=3597059&v=66532&q=475588&r=2931103 | /articles/how-to-check-credit-score-with-itin-number         | 0       | 1    |
| 2026-08-06 | ITIN Credit Card  | Awin    | https://www.awin1.com/cread.php?s=3597059&v=66532&q=475588&r=2931103 | /thank-you                                                   | 0       | 1    |
| 2026-08-07 | ITIN Credit Card  | Awin    | https://www.awin1.com/cread.php?s=3641203&v=66532&q=475588&r=2931103 | /articles/secured-credit-card-with-itin                      | 0       | 1    |
| 2026-08-13 | ITIN Credit Score | Awin    | https://www.awin1.com/cread.php?s=3597059&v=66532&q=475588&r=2931103 | /es/itin-credit-score-guide                                  | 0       | 1    |
| 2026-08-17 | ITIN Credit Score | Awin    | https://www.awin1.com/cread.php?s=3597059&v=66532&q=475588&r=2931103 | /itin-credit-score-guide                                     | 0       | 1    |
