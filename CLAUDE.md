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
