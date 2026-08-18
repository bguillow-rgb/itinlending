// Enforce the SERP length budget at GENERATION time, not just at build time.
//
// Why this exists: check-serp.mjs fails the build when a rendered <title> or
// meta description would truncate in Google. That guard is correct and stays.
// But the generator (generate.mjs) and the translator (translate.mjs) only ASK
// the model for "MAX 45 chars" / "MAX 160 chars" in their prompts, and nothing
// ever checked the answer.
//
// On 2026-08-18 that gap ate a whole publish slot: the lending flagship came
// back with a 51-char title (66 rendered, +6) and a 187-char description (+27),
// plus a 172-char ES description. check-serp did its job and failed the build,
// which meant "Commit & push" was SKIPPED — the article was generated, paid
// for, and then thrown away. The run recovered nothing.
//
// A prompt instruction is a request. This is the constraint: measure the
// metadata we actually got, and if it overflows, spend one small model call
// rewriting ONLY the title/description to fit. Falling back to a full article
// regeneration (the existing retry) costs a flagship generation with web
// search, so repair-then-retry is deliberately the cheap path first.
//
// Order of preference: model repair first (it preserves the payload), then a
// deterministic word-boundary trim as a LAST resort. Truncating reads worse than
// a well-written short title, but it beats the alternative that actually
// happened on 2026-08-18 — throwing away a finished, paid-for article and
// losing the publish slot. The build gate still guarantees nothing truncated
// ever reaches Google.

const TITLE_RENDERED_MAX = 60;
const DESC_MAX = 160;

// BaseLayout renders `${title} | ${SITE.name}`, so the frontmatter title's real
// budget is 60 minus that suffix. Derived from the site name rather than
// hardcoded, because the three sites have different-length brands
// (" | ITIN Lending" is 15, " | ITIN Credit Score" is 20).
export function titleBudget(siteName) {
  return TITLE_RENDERED_MAX - ` | ${siteName}`.length;
}

// Returns [] when the metadata fits. Each entry is human-readable and is what
// gets shown to the repair call and, if repair fails, thrown to the retry loop.
export function serpErrors(meta, siteName) {
  const errs = [];
  const tMax = titleBudget(siteName);
  const title = String(meta?.title ?? '');
  const desc = String(meta?.description ?? '');
  if (title.length > tMax) {
    errs.push(`title ${title.length}/${tMax} (renders ${title.length + ` | ${siteName}`.length}/${TITLE_RENDERED_MAX})`);
  }
  if (desc.length > DESC_MAX) errs.push(`description ${desc.length}/${DESC_MAX}`);
  return errs;
}

// Total characters over budget across both fields. This is the convergence
// metric: unlike a count of failing fields it strictly decreases as a repair
// gets closer, so partial progress is visible and can be accepted.
export function overflow(meta, siteName) {
  const t = String(meta?.title ?? '').length - titleBudget(siteName);
  const d = String(meta?.description ?? '').length - DESC_MAX;
  return Math.max(0, t) + Math.max(0, d);
}

// Last-resort deterministic trim, on a word boundary.
//
// The original design note here rejected deterministic truncation because a
// hard-cut title "reads like a bug". That is true, and it is still the last
// resort rather than the first — but it was weighed against a retry that works,
// and on 2026-08-18 the retries did not work: three full flagship regenerations,
// ~16 minutes, and the slot was lost anyway. Losing a finished, paid-for article
// is strictly worse than shipping a description that ends one clause early.
// Trimming on a word boundary (and dropping a dangling connector) keeps it
// readable; the build gate still guarantees nothing truncated ever ships.
const DANGLING =
  /\s+(and|or|but|with|without|for|from|to|of|in|on|at|by|the|a|an|how|what|why|plus|y|o|con|sin|para|por|de|del|la|el|los|las|un|una|como|que)$/i;

// `preferClause` backs off to the last clause boundary rather than stopping at
// an arbitrary word. A description that ends "...requirements, and how to
// maximize" reads as broken even though no connector is dangling, because the
// cut landed mid-verb-phrase. Only applied when the clause boundary still keeps
// most of the budget, so we trade a few characters for a sentence that ends.
function trimTo(text, max, preferClause = false) {
  if (text.length <= max) return text;
  let cut = text.slice(0, max);
  // Prefer a word boundary, but only if it does not eat most of the budget.
  const sp = cut.lastIndexOf(' ');
  if (sp > max * 0.6) cut = cut.slice(0, sp);
  // Strip trailing punctuation/connectors repeatedly: one pass leaves things
  // like "Rates &" or "... and how to" still reading as a truncation.
  let prev;
  do {
    prev = cut;
    cut = cut.replace(/[\s,;:.\-–—&/|+]+$/, '');
    cut = cut.replace(DANGLING, '');
  } while (cut !== prev && cut.length);

  if (preferClause) {
    const b = Math.max(cut.lastIndexOf(', '), cut.lastIndexOf('; '), cut.lastIndexOf('. '), cut.lastIndexOf(': '));
    if (b > max * 0.7) cut = cut.slice(0, b);
  }
  return cut;
}

// One cheap call that rewrites only the two offending fields. Returns a
// {title, description} patch; the caller decides whether to accept it.
async function callRepair({ apiKey, model, meta, siteName, lang, errs }) {
  const isEs = lang === 'es';
  const tMax = titleBudget(siteName);
  const system = isEs
    ? 'Eres un editor SEO. Acortas titulos y meta descripciones en espanol (es-419) para que no se corten en Google. Devuelves solo JSON.'
    : 'You are an SEO editor. You shorten titles and meta descriptions so they do not truncate in Google. You return JSON only.';

  // Aim BELOW the limit, not at it. Asked for "max 160" the model reliably
  // returns 165-185; asked for a specific target with the exact number of
  // characters to cut, it lands. The headroom is what makes this converge in one
  // call instead of three.
  const tLen = String(meta.title ?? '').length;
  const dLen = String(meta.description ?? '').length;
  const tTarget = tMax - 3;
  const dTarget = DESC_MAX - 10;
  const cuts = [];
  if (tLen > tMax) cuts.push(`- "title" is ${tLen} chars. Cut at least ${tLen - tTarget} to reach ${tTarget}.`);
  if (dLen > DESC_MAX) cuts.push(`- "description" is ${dLen} chars. Cut at least ${dLen - dTarget} to reach ${dTarget}.`);

  const user = `These SERP fields are too long and would be truncated by Google. Rewrite them shorter.

WHAT TO CUT (this is the whole job — count characters as you write):
${cuts.join('\n')}

HARD LIMITS:
- "title": MAX ${tMax} characters. The layout appends " | ${siteName}" (${` | ${siteName}`.length} chars), so ${tMax} renders as ${TITLE_RENDERED_MAX}, which is Google's cut. Aim for ${tTarget}.
- "description": MAX ${DESC_MAX} characters. Aim for ${dTarget}.

Being UNDER the limit is always better than being near it. A short, concrete
title beats a complete one that gets cut. Do not pad to reach the limit.

RULES:
- Keep the concrete payload: documents, rates, lender names, dollar figures, timelines, counts. Drop filler first${isEs ? ' ("Si, puedes...", "Descubre...", "Conoce...", "Aqui te explicamos...")' : ' ("Learn how...", "Discover...", "Everything you need to know...", "A complete guide to...")'}.
- Never phrase the title as a yes/no question.
- Do not use em dashes or en dashes.
- Same language as the input${isEs ? ' (Latin-American Spanish, es-419)' : ''}. Same meaning. Do not invent facts.

Return ONLY a fenced json code block with exactly the keys "title" and "description".

Current values (JSON):
\`\`\`json
${JSON.stringify({ title: meta.title, description: meta.description })}
\`\`\``;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1000,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) throw new Error(`serp repair: Anthropic API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  const fence = text.match(/```json\s*([\s\S]*?)```/);
  const jsonText = fence ? fence[1] : text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  return JSON.parse(jsonText.trim());
}

// Bring meta.title / meta.description inside the SERP budget. Returns a repaired
// copy; never mutates the input.
//
// This always returns something publishable. Repairs compound across attempts,
// and if they still have not converged the fields are trimmed deterministically
// (loudly). It throws only on the unreachable case where the trim itself failed,
// so a bad title can no longer cost a publish slot.
export async function enforceSerpLimits({
  apiKey,
  model = 'claude-sonnet-4-6',
  meta,
  siteName,
  lang = 'en',
  attempts = 3,
  label = '',
}) {
  let errs = serpErrors(meta, siteName);
  if (!errs.length) return meta;

  const tag = label ? `${label}: ` : '';
  console.warn(`${tag}SERP limits exceeded (${errs.join('; ')}), repairing`);

  let out = { ...meta };
  for (let i = 1; i <= attempts; i++) {
    let patch;
    try {
      patch = await callRepair({ apiKey, model, meta: out, siteName, lang, errs });
    } catch (e) {
      // A transient API error should cost one attempt, not the whole repair —
      // `break` here sent a recoverable blip straight to the deterministic trim.
      console.error(`${tag}SERP repair attempt ${i}/${attempts} errored: ${e.message}`);
      continue;
    }
    const candidate = {
      ...out,
      title: typeof patch?.title === 'string' && patch.title.trim() ? patch.title.trim() : out.title,
      description:
        typeof patch?.description === 'string' && patch.description.trim()
          ? patch.description.trim()
          : out.description,
    };
    const remaining = serpErrors(candidate, siteName);
    // Accept any patch that reduces total overflow, and feed it back into the
    // next attempt so repairs compound.
    //
    // This used to compare `remaining.length < errs.length` — the COUNT of
    // failing fields, not how far over they were. When title and description
    // were both over (the common case), a repair that shortened the title 52->47
    // AND the description 185->164 still left two failing fields, so 2 < 2 was
    // false and the patch was thrown away. `out` never updated, the next attempt
    // re-sent identical input, got an identical answer, and the whole thing threw.
    // That burned all 3 article regenerations and the 2026-08-18 publish slot:
    // the run log shows attempts 1 and 3 with byte-identical numbers before and
    // after "repairing".
    if (overflow(candidate, siteName) < overflow(out, siteName)) {
      out = candidate;
      errs = remaining;
    }
    if (!errs.length) {
      console.log(`${tag}SERP repaired -> title ${out.title.length}/${titleBudget(siteName)}, desc ${out.description.length}/${DESC_MAX}`);
      return out;
    }
  }

  // Every repair attempt is spent. Rather than throw away a finished article,
  // trim deterministically and say so loudly. A throw here burns a ~5-6 minute
  // flagship regeneration (with web search) and, once the retries are gone, the
  // publish slot itself.
  const trimmed = {
    ...out,
    title: trimTo(out.title, titleBudget(siteName)),
    description: trimTo(out.description, DESC_MAX, true),
  };
  const left = serpErrors(trimmed, siteName);
  if (left.length) {
    // Should be unreachable: trimTo cuts to the budget by construction.
    throw new Error(`SERP limits still exceeded after repair and trim: ${left.join('; ')}`);
  }
  console.warn(
    `${tag}SERP repair did not converge; TRIMMED deterministically -> ` +
      `title ${trimmed.title.length}/${titleBudget(siteName)}, desc ${trimmed.description.length}/${DESC_MAX}. ` +
      `Review this article's snippet.`
  );
  return trimmed;
}
