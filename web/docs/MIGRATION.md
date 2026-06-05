# ITINLending.net — Migration & Launch Guide

How to take this Astro site live on `itinlending.net` while preserving the SEO
value of the old WordPress site. Do these in order.

## 0. The plan in one paragraph

The new static site is built in `/web` and published to `/docs` (GitHub Pages
serves from `main` → `/docs`). We put **Cloudflare (free)** in front of the
domain for DNS + **301 redirects**, so the 24 old WordPress URLs pass their
ranking signal to the matching new pages instead of dying as 404s. Nothing
about the old URLs should 404 after cutover.

---

## 1. Publish to GitHub Pages (no DNS change yet)

1. Push this repo to GitHub (public repo = free Pages).
2. Settings → Pages → Source = "Deploy from a branch", Branch = `main`,
   Folder = `/docs`. Save.
3. Wait ~1 min, confirm the temporary URL works:
   `https://<your-username>.github.io/<repo>/` (or the Pages URL shown).
4. Leave the live `itinlending.net` pointing at WordPress for now — we cut over
   only after redirects are staged.

GitHub Pages IPs (for the A records in step 3 below):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

---

## 2. Put Cloudflare in front (free plan)

1. Create a free Cloudflare account, add the site `itinlending.net`.
2. Cloudflare shows you two nameservers. Update them at your domain registrar
   (where you bought itinlending.net). Propagation: minutes to a few hours.
3. In Cloudflare DNS, set records to point at GitHub Pages:
   - `A  @  185.199.108.153` (proxied / orange cloud)
   - `A  @  185.199.109.153`
   - `A  @  185.199.110.153`
   - `A  @  185.199.111.153`
   - `CNAME  www  <your-username>.github.io` (proxied)
4. In GitHub → Settings → Pages → Custom domain, enter `itinlending.net`, Save.
   Then tick **Enforce HTTPS** once the cert provisions (~2 min).

---

## 3. Stage the 301 redirects in Cloudflare

Cloudflare → your domain → **Rules → Redirect Rules → Bulk Redirects** (or
single Redirect Rules). Add each old URL → new URL as a **301 (permanent)**.
The full map is in `redirects.csv` next to this file. Highlights:

| Old WordPress URL | New URL |
|---|---|
| `/apply-for-an-itin-loan/` | `/apply` |
| `/what-is-an-itin/` | `/how-to-get-an-itin` |
| `/itin-application-2/` | `/how-to-get-an-itin` |
| `/individual-taxpayer-identification-number/` | `/how-to-get-an-itin` |
| `/itin-auto-loan/` | `/itin-auto-loan` |
| `/itin-credit-card/` | `/itin-credit-cards` |
| `/basics-of-lending/` | `/itin-loans` |
| `/2023/04/itin-loans/` | `/itin-loans` |
| `/2023/09/can-you-get-an-itin-loan-with-bad-credit/` | `/articles/itin-loan-with-bad-credit` |
| `/2023/10/itin-vs-ssn-understanding-the-key-differences/` | `/itin-vs-ssn` |
| `/2023/10/how-to-change-itin-to-ssn-with-irs-online-a-simple-guide/` | `/itin-vs-ssn` |
| (all mortgage posts) | `/itin-mortgage` |
| (all credit-card posts) | `/itin-credit-cards` |
| (all personal-loan / "journey" posts) | `/itin-personal-loans` |
| (all "how I got my ITIN" posts) | `/how-to-get-an-itin` |

> Tip: also add a catch-all so any unmapped `/2023/*` post 301s to `/itin-loans`
> rather than 404ing. Order it **after** the specific rules.

---

## 4. Post-launch SEO tasks (do the day you cut over)

1. **Google Search Console** — add `itinlending.net` (domain property), verify
   via the meta tag (`PUBLIC_GSC_VERIFICATION`) or DNS TXT in Cloudflare.
2. **Submit the sitemap**: `https://itinlending.net/sitemap-index.xml`.
3. **Use the "Removals" + "URL Inspection"** tools to ask Google to re-crawl the
   homepage and key money pages.
4. **GA4** — create a property, put the Measurement ID in `PUBLIC_GA4_ID`,
   rebuild, redeploy.
5. **Confirm redirects** — spot-check 5–6 old URLs return `301` to the new ones:
   `curl -sI https://itinlending.net/2023/04/itin-loans/ | head -3`
6. **Bing Webmaster Tools** — add the site + sitemap (feeds ChatGPT/Copilot).

---

## 5. Turn on monetization (when ready)

Set these env vars, then rebuild + redeploy (`bash scripts/deploy-to-docs.sh`):

- `PUBLIC_LEAD_ENDPOINT` — create a free Formspree/Web3Forms form, paste its
  POST URL. The lead form on `/apply` and every money page goes live.
- `PUBLIC_ADSENSE_ID` — after AdSense approves the site, paste `ca-pub-…`. Ad
  slots appear on articles + money pages automatically.
- `PUBLIC_AFFILIATE_APPLY_URL` — optional Commission Junction deep link for the
  primary CTA (otherwise CTAs route to `/apply`).

AdSense approval needs real content + privacy/terms/disclosure pages — all of
which already exist. Apply after the site is live with the redirects in place.
