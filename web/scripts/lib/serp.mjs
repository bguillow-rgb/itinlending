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
// Deterministic truncation is NOT used: a hard-cut title reads like a bug and a
// hard-cut description loses the payload the snippet exists to deliver.

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

// One cheap call that rewrites only the two offending fields. Returns a
// {title, description} patch; the caller decides whether to accept it.
async function callRepair({ apiKey, model, meta, siteName, lang, errs }) {
  const isEs = lang === 'es';
  const tMax = titleBudget(siteName);
  const system = isEs
    ? 'Eres un editor SEO. Acortas titulos y meta descripciones en espanol (es-419) para que no se corten en Google. Devuelves solo JSON.'
    : 'You are an SEO editor. You shorten titles and meta descriptions so they do not truncate in Google. You return JSON only.';

  const user = `These two SERP fields are too long and would be truncated by Google. Rewrite them to fit.

OVER BY: ${errs.join('; ')}

HARD LIMITS (count characters):
- "title": MAX ${tMax} characters. The layout appends " | ${siteName}" (${` | ${siteName}`.length} chars), so ${tMax} renders as ${TITLE_RENDERED_MAX}, which is Google's cut.
- "description": MAX ${DESC_MAX} characters.

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

// Bring meta.title / meta.description inside the SERP budget, mutating a copy.
//
// Returns the (possibly repaired) meta. Throws only when the metadata is STILL
// over after the repair attempts — that throw is deliberate, because the
// callers sit inside retry loops and a genuinely unfixable title should burn a
// retry rather than ship a page the build will reject anyway.
//
// `attempts` is 2: the first repair fixes essentially every real case, and the
// second covers a model that shortened one field but overshot the other.
export async function enforceSerpLimits({
  apiKey,
  model = 'claude-sonnet-4-6',
  meta,
  siteName,
  lang = 'en',
  attempts = 2,
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
      // A failed repair call is not fatal on its own; fall through to the
      // final check, which throws with the real length numbers.
      console.error(`${tag}SERP repair attempt ${i}/${attempts} errored: ${e.message}`);
      break;
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
    // Only accept a patch that strictly improves things, so a repair that made
    // one field worse cannot be committed.
    if (remaining.length < errs.length || !remaining.length) {
      out = candidate;
      errs = remaining;
    }
    if (!errs.length) {
      console.log(`${tag}SERP repaired -> title ${out.title.length}/${titleBudget(siteName)}, desc ${out.description.length}/${DESC_MAX}`);
      return out;
    }
  }

  throw new Error(`SERP limits still exceeded after repair: ${errs.join('; ')}`);
}
