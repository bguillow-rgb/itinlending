# Itin — Project Instructions

This repo is the **Itin family of ITIN-lending content sites**. The first live
site is `itinlending.net` (in `/web`). Two more sister sites are planned (see
`project-docs/ROADMAP.md`) and share the same Astro codebase pattern and a single
AdSense account.

## THE DOCUMENTATION RULE (non-negotiable)

**Whenever any agent does work on this repo, it must document that work.** This is
a hard rule, not a suggestion. Before you finish a task:

1. **Update the relevant doc** in `project-docs/` to reflect what changed
   (architecture, monetization, SEO, content pipeline, ops, or roadmap).
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
