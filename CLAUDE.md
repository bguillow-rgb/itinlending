# Itin — Project Instructions

This repo (`~/Itin`) is site 1 of the **Itin family of three ITIN content sites**,
all built on the same Astro pattern, all bilingual (EN + `/es`), all operated by
Timberline Ventures LLC, and all sharing one AdSense account:

1. **ITIN Lending** — `itinlending.net` — `~/Itin` (this repo)
2. **ITIN Credit Card** — `itincreditcard.com` — `~/ITINCreditCard`
3. **ITIN Credit Score** — `itincreditscore.com` — `~/ITINCreditScore`

This repo's `project-docs/` is the **central documentation hub for all three
sites.** See `project-docs/SITES.md` for the per-site breakdown.

## THE DOCUMENTATION RULE (non-negotiable)

**Whenever any agent does work on this repo, it must document that work.** This is
a hard rule, not a suggestion. Before you finish a task:

1. **Update the relevant doc** in `~/Itin/project-docs/` to reflect what changed
   (architecture, monetization, SEO, content pipeline, ops, or roadmap). This is
   true even when working in the credit-card or credit-score repo — the docs hub
   lives here.
2. **Add a dated entry to `project-docs/CHANGELOG.md`** — what you changed, why,
   and any follow-ups. One entry per unit of work, newest at top.
3. If you added a new system, env var, script, page type, or workflow,
   document it where a future agent would look for it (not just the changelog).

If a change isn't documented, the task isn't done. Keep docs in sync with code in
the same change — never "I'll document it later."

## Where things live

- `/web` — the Astro source for itinlending.net (`web/src`, builds to `web/dist`).
- `/docs` — **published GitHub Pages output. Generated, not hand-edited.**
  `web/scripts/deploy-to-docs.sh` runs `rm -rf ../docs` and recopies the build,
  so anything you put in `/docs` by hand is destroyed on the next deploy.
  **Never put documentation or source in `/docs`.**
- `/project-docs` — **the internal docs (this is where docs go).** Start at
  `project-docs/README.md`.
- `/.github/workflows` — automation (daily content, health monitor, Lighthouse).

## Read before working

- `project-docs/README.md` — index of everything.
- `~/.claude/CLAUDE.md` — the global SEO/ASO/content playbook this project follows.
- Auto-memory: `~/.claude/projects/-Users-bobguillow-Itin/memory/MEMORY.md`
  (monetization strategy lives there — AdSense on articles only, money pages get
  per-product CJ links + one below-fold ad).

## Hard rules carried over from the monetization strategy

- AdSense runs on **research-intent articles** only (top + end) and **one
  below-fold unit** on money pages (after the FAQ). Never put in-content AdSense
  on money pages, the homepage, /about, or utility pages.
- Money-page CTAs route to **per-product Commission Junction deep links**
  (`affiliateUrlFor()` in `web/src/consts.ts`), not AdSense.
- Everything monetization/analytics is **env-gated** in `web/src/consts.ts`;
  nothing fires in dev or until the env var is set.

## DATA INTEGRITY RULES (non-negotiable — added 2026-08-07)

These exist because on 2026-08-07 five separate errors reached Bob in one day —
including a fabricated "32% search decline" published to a buyer-facing
dashboard — and every one had the same root cause: **a derived or carried number
was trusted instead of checked.** The real figure was +49%; the error came from
summing GSC query-dimension rows (which Google anonymizes and undercounts)
instead of reading the property-level total.

**1. Numbers come from the system that owns them, in the form that system
reports them.** Supabase counts come from SQL against production. Git counts
come from `git log`, run now. Store data comes from the ASC/iTunes APIs. Search
data comes from GSC property-level totals — NEVER from summing query rows.
Revenue comes from the payment ledger, not an analytics mirror. A number from a
prior report, brief, memory file, scoreboard, or summary is a CLAIM, not a
fact — re-pull it before repeating it.

**2. Derived numbers say so.** Anything summed, averaged, extrapolated, or
computed from other numbers is labeled as derived, with the method stated. If
the method has a known distortion (GSC query anonymization, GA4 sampling,
RevenueCat sandbox blending, ASC's 2–3 day lag), name it next to the number.

**3. A surprising number is a bug until proven otherwise.** Before writing any
narrative on top of a big swing (>±20%, a zero where there was activity, a
uniform change across unrelated things), check the window, the method, and the
source first. Uniform movement across independent properties is a measurement
artifact until shown otherwise — it is the tell, not the corroboration.

**4. Windows end where data is complete.** GSC lags 2–3 days; ASC daily reports
lag a day. A window ending "today" silently understates the tail. State the
window's end date next to the number.

**5. Unverifiable claims ship as `[unverified]` or not at all.** If the owning
system can't be queried right now, either mark the figure `[unverified]` inline
or leave it out. Never let an unmarked carried claim sit next to verified ones.

**6. Corrections are stated, not smoothed.** If a published number turns out
wrong, the correction names the old number, the new number, and the mechanism
of the error — in the same place the wrong number appeared.
