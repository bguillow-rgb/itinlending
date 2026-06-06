# Roadmap — Built / In Progress / Planned

Status as of 2026-06-06. Keep this honest; update as work lands (and log it in
[`CHANGELOG.md`](./CHANGELOG.md)).

## Built (shipped)

- **itinlending.net** — Astro 5 static site, GitHub Pages (`main` → `/docs`),
  bilingual EN + `/es`.
- **Money pages:** pillar `/itin-loans` + clusters (mortgage, auto-loan,
  credit-cards, personal-loans, business-loans, how-to-get-an-itin, itin-vs-ssn),
  each with hero + lead form, FAQ, schema.
- **Utility pages:** about (entity anchor), apply, contact, privacy, terms,
  disclosure, thank-you, 404 — EN + ES.
- **Articles:** 2 detail posts (`itin-car-loan`, `itin-loan-with-bad-credit`) +
  the daily generator that grows the layer.
- **SEO/AEO:** full JSON-LD per page type, Speakable Quick Answers, hub-and-spoke
  internal linking, robots.txt AI allow-list, llms.txt (with Timberline Ventures
  publisher entity), auto sitemap, IndexNow key + ping script.
- **Monetization:** AdSense enabled site-wide (`ca-pub-1426577294682977`) + ads.txt;
  lead form wired to Web3Forms with AJAX submit → dedicated thank-you page with ad
  slots; per-product CJ affiliate scaffolding; intent-segmented placement strategy.
- **Lead form:** state dropdown + phone auto-format validation.
- **Automation:** daily SEO content workflow, live-site health monitor, Lighthouse
  CI.
- **Launch tooling:** Cloudflare migration guide + 301 redirect map for the old
  WordPress URLs (`web/docs/`).

## In progress / to verify

- DNS cutover + Cloudflare 301s live, `enforce HTTPS`, GSC + Bing verification,
  sitemap submitted (confirm against `web/docs/MIGRATION.md` checklist).
- Fill affiliate env vars (`PUBLIC_AFFILIATE_URL_*`) as CJ advertisers approve.
- Set `PUBLIC_GA4_ID` + `PUBLIC_GSC_VERIFICATION` and rebuild.

## Planned

- **Sister sites #2 and #3** — same Astro pattern, **shared AdSense account**
  (ad-unit slot IDs are already account-level). Likely verticals (inferred from the
  daily-post prompt branching): an ITIN **credit-cards** site and an ITIN **credit
  score / credit-building** site. Confirm domains/verticals before building.
  - Parameterize the hardcoded `itinlending.net` references in `monitor.mjs`,
    `indexnow.mjs`, and the workflows (the content generator already reads identity
    from `consts.ts`).
- Deepen pillar to 3,000–5,000 words; flesh clusters to 1,500–2,500.
- Weekly technical-SEO audit loop (GSC/GA4 diff) once traffic is live — offer to
  schedule via the `schedule` skill.
- Content refresh cadence (genuine updates, not date bumps).
- Validate all schema in Google Rich Results Test; keep GSC Enhancements at 0
  errors.

## Open questions for the user

- Final domains/verticals for sites #2 and #3?
- Which CJ advertisers per product are approved (to fill affiliate URLs)?
- Is the WordPress → Cloudflare cutover already complete on the live domain?
