# New Site / App Launch Playbook

Every time Timberline Ventures launches a new site or web property, run this
checklist top-to-bottom. Each step has been battle-tested on the ITIN sites and
the Timberline corporate site. Claude agents should invoke this playbook
automatically when a new site is being set up.

---

## Phase 0 — Pre-flight (answer before starting)

1. **Domain purchased?** Note registrar (GoDaddy main vs. reseller
   `dcc.secureserver.net?plid=1592`). GoDaddy reseller DNS panel:
   `https://dcc.secureserver.net/control/dnsmanagement?domainName=DOMAIN&plid=1592`
2. **GitHub org/user?** All repos live under `bguillow-rgb`.
3. **Astro pattern or other stack?** This playbook assumes Astro → GitHub Pages.
   Reference implementation: `~/TimberlineVentures/web/` (corporate) or `~/Itin/web/`
   (ITIN site).
4. **ITIN family site or new vertical?** If ITIN family: also run the ITIN-specific
   extras in Phase 6.

---

## Phase 1 — Repo + GitHub Pages

```bash
# 1. Create repo (public required for free GitHub Pages)
gh repo create bguillow-rgb/REPO-NAME --public --description "DESCRIPTION"

# 2. Init git, add remote, push
cd ~/SITE-FOLDER
git init && git add -A && git commit -m "initial commit"
git remote add origin git@github.com:bguillow-rgb/REPO-NAME.git
git push -u origin main

# 3. Enable GitHub Pages from /docs on main branch
gh api --method POST repos/bguillow-rgb/REPO-NAME/pages \
  --field source[branch]=main \
  --field source[path]=/docs \
  --field build_type=legacy

# 4. Set custom domain
gh api --method PUT repos/bguillow-rgb/REPO-NAME/pages \
  --field cname=DOMAIN.com
```

**Pitfalls:**
- Must be a **public** repo for free GitHub Pages.
- `/docs` folder must contain a `.nojekyll` file or Astro `_astro/` CSS won't load.
- The `public/CNAME` file in the Astro source is required for rebuild persistence.

---

## Phase 2 — Build + Deploy

```bash
cd ~/SITE-FOLDER/web
npm install
npm run build  # outputs to web/dist/
bash scripts/deploy-to-docs.sh  # rm -rf ../docs && cp -r dist/ ../docs/
git add ../docs && git commit -m "deploy: initial build"
git push
```

Verify the site is live at `https://bguillow-rgb.github.io/REPO-NAME/` before
setting custom DNS.

---

## Phase 3 — DNS (GoDaddy reseller)

Navigate to: `https://dcc.secureserver.net/control/dnsmanagement?domainName=DOMAIN&plid=1592`

**Add A records** (4 records, same IPs for all GitHub Pages sites):
| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 1 Hour |
| A | @ | 185.199.109.153 | 1 Hour |
| A | @ | 185.199.110.153 | 1 Hour |
| A | @ | 185.199.111.153 | 1 Hour |

**Add www CNAME:**
| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | bguillow-rgb.github.io | 1 Hour |

DNS propagation: typically 5–30 min with GoDaddy.

Confirm: `dig +short DOMAIN A` should return all 4 IPs.

---

## Phase 4 — GA4

1. Go to [analytics.google.com](https://analytics.google.com) → Admin → Create Property.
   - Property name: `SITE NAME`
   - Timezone: US/Eastern; Currency: USD
   - Industry: appropriate vertical
2. Create Web data stream → enter domain URL.
3. Note: **Measurement ID** (`G-XXXXXXXXXX`) and **Property ID** + **Stream ID**.
4. Set in `web/.env`:
   ```
   PUBLIC_GA4_ID=G-XXXXXXXXXX
   ```
5. Rebuild + redeploy (so the GA4 snippet is baked into static HTML).
6. Add to `project-docs/ANALYTICS-PLAN.md` property table.
7. **Publish the Reports view** (easy to miss): Reports → Reports snapshot → choose
   the **"User behavior"** template. Properties created via the *business-objectives*
   onboarding flow leave this on an empty "choose a template" screen, so the home /
   Reports view shows **no data even while collection works** — this exact gap made
   itincreditcard.com + itincreditscore.com look broken (2026-06-11). Name properties
   consistently as `ITIN <X> / <domain>`.

---

## Phase 5 — Google Search Console

### 5a. Get the DNS TXT verification token

The quickest way to get the token without fighting GSC's UI:

1. Navigate to: `https://search.google.com/search-console/ownership?resource_id=sc-domain:DOMAIN`
   (redirects to "not-verified" page)
2. Set up XHR intercept in JS on that page:
   ```js
   window.__captured = [];
   const origFetch = window.fetch;
   window.fetch = async (...args) => {
     const r = await origFetch(...args);
     r.clone().text().then(b => window.__captured.push({url:args[0], body:b}));
     return r;
   };
   ```
3. Click "VERIFY YOUR OWNERSHIP" (any click that triggers the `mKtLlc%2CQiNMAd`
   batchexecute call).
4. Read token:
   ```js
   const bodies = window.__captured.map(r=>r.body).join('');
   bodies.match(/google-site-verification[=\\u003d]+([A-Za-z0-9_-]{20,})/)?.[1]
   ```
   Token format: `google-site-verification=XXXXXXXXXXXXX`

### 5b. Add TXT record to GoDaddy

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | @ | google-site-verification=TOKEN | 1 Hour |

Confirm: `dig +short DOMAIN TXT` shows the token.

### 5c. Verify ownership in GSC

**This step requires a real mouse click (Angular blocks JS clicks):**

Open the GSC not-verified page → click "VERIFY YOUR OWNERSHIP" → click "Verify"
in the dialog. Verification succeeds immediately once the TXT record has propagated.

### 5d. Submit sitemap

After verification, submit: `https://DOMAIN/sitemap-index.xml`

Via GSC → Sitemaps → Enter sitemap URL → Submit.

---

## Phase 6 — HTTPS Enforcement

Wait until GitHub Pages provisions the SSL certificate (typically 15–45 min after
DNS propagates). Then:

```bash
gh api --method PUT repos/bguillow-rgb/REPO-NAME/pages \
  --field https_enforced=true
```

Check status: `gh api repos/bguillow-rgb/REPO-NAME/pages | python3 -c "import sys,json; d=json.load(sys.stdin); print('https_enforced:', d['https_enforced'], '| cert:', d.get('https_certificate',{}).get('state'))"`

If you get "The certificate does not exist yet" — DNS hasn't fully propagated to
GitHub's edge or the cert is still being issued. Retry in 15 min.

---

## Phase 7 — Schema + SEO infrastructure

Per-page schema checklist (all ship via Astro components):
- [ ] `Organization` + `WebSite` (with SearchAction) on every page
- [ ] `FAQPage` on homepage and all article/content pages
- [ ] `Article` + `Speakable` on all blog/article pages
- [ ] `AboutPage` + `Person` on /about
- [ ] `BreadcrumbList` on all inner pages
- [ ] `SoftwareApplication` or `MobileApplication` if applicable

`robots.txt` — allow all AI crawlers:
```
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: Google-Extended
User-agent: OAI-SearchBot
User-agent: CCBot
User-agent: Bytespider
User-agent: Applebot-Extended
Allow: /
```

`llms.txt` — portfolio description + canonical URLs at site root.

---

## Phase 8 — Update entity graph

When a new site goes live:
1. Update `timberlineventuresllc.com` Organization schema (`~/TimberlineVentures/web/src/consts.ts`)
   to add new entry to `PORTFOLIO` array.
2. Update `~/TimberlineVentures/web/src/components/schema/OrganizationSchema.astro`
   if auto-generated from PORTFOLIO (it is — no manual edit needed if PORTFOLIO updated).
3. Add `sameAs` links from all existing ITIN sites' Organization schema to the new site.
4. Rebuild + redeploy `~/TimberlineVentures/web/`.
5. Create Wikidata item for the new brand (see `project-docs/ENTITY-GRAPH.md` for the
   existing entity IDs and the pattern used).

---

## Phase 9 — ITIN-family extras (only if new site is an ITIN site)

- [ ] Copy `daily-post.mjs` from `~/Itin/web/` — no edits needed, branches on site name
- [ ] Set up GitHub Actions workflow for daily content (copy from `~/Itin/.github/workflows/`)
- [ ] Set up IndexNow: generate key, add to `public/KEY.txt` and `web/src/consts.ts`
- [ ] Wire AdSense: articles get top + bottom ads; money pages get one below-fold ad only
  (see `project-docs/MONETIZATION.md` for slot IDs and placement rules)
- [ ] Add `public/CNAME`, `public/robots.txt`, `public/llms.txt` (site-specific URLs)
- [ ] Update `project-docs/SITES.md` in `~/Itin/` with the new site entry
- [ ] Add per-product CJ deep links to `web/src/consts.ts` → `affiliateUrlFor()`
- [ ] Ensure `PILLAR` + `PRODUCTS` + `NAV` in `consts.ts` match the new vertical

---

## Phase 10 — Post-launch checklist

- [ ] Site live at custom domain: `curl -I https://DOMAIN/`
- [ ] HTTPS enforced (no http redirect needed since enforced at Pages level)
- [ ] GA4 firing: open site → check Realtime in GA4
- [ ] GSC ownership verified + sitemap submitted
- [ ] Organization schema valid in Rich Results Test
- [ ] No console errors on homepage
- [ ] Core Web Vitals: run PageSpeed Insights → target LCP <2.5s, CLS <0.1
- [ ] Document in `project-docs/CHANGELOG.md` with property IDs, repo name, domain

---

## Quick-reference: property IDs

| Site | Domain | Repo | GA4 ID | Notes |
|------|--------|------|--------|-------|
| ITIN Lending | itinlending.net | bguillow-rgb/itinlending | see .env | Site 1 |
| ITIN Credit Card | itincreditcard.com | bguillow-rgb/itincreditcard | see .env | Site 2 |
| ITIN Credit Score | itincreditscore.com | bguillow-rgb/itincreditscore | see .env | Site 3 |
| Timberline Ventures | timberlineventuresllc.com | bguillow-rgb/timberline-ventures | G-S39L4K4RRB | Corporate |
| Stick Picks | stickpicks.app | bguillow-rgb/stickpicks | see .env | Picks app |
| Pour Picks | — | — | — | iOS only |
| Perfume Picks | perfumepicks.app | — | — | Picks app |
