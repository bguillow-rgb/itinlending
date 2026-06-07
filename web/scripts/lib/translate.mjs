// Translate an English article into Latin-American Spanish (es-419) via the
// Claude API. Used by daily-post.mjs (fresh articles) and backfill.mjs
// (existing articles). Returns the translated fields; the caller assembles the
// es-419 markdown file (keeping slug, tier, dates, author, relatedSlugs from EN).
const MODEL = process.env.TRANSLATE_MODEL || 'claude-sonnet-4-6';

const SYSTEM = `You are a professional financial translator. You translate U.S. ITIN / lending content from English into Latin-American Spanish (es-419) for a real audience of immigrants and ITIN holders.

Rules:
- Natural, warm, plain Spanish as spoken across Latin America (es-419) — NOT Castilian. Use "tú", not "vosotros".
- Translate meaning, not word-for-word. It must read as if originally written in Spanish.
- Keep ALL markdown structure intact: headings (#, ##), tables, lists, bold/italics, links. Translate the visible text inside them, never the URLs or markdown syntax.
- Keep proper nouns, brand names, lender names, and acronyms (ITIN, SSN, FICO, IRS, CFPB, CDFI, non-QM) as-is. You may gloss an acronym once in parentheses if helpful.
- Keep all numbers, percentages, dollar amounts, and dates unchanged.
- Do NOT add, remove, or reorder sections. Same number of FAQs, same table rows.`;

export async function translateArticle(en, apiKey) {
  const payload = {
    title: en.title,
    description: en.description,
    quickAnswer: en.quickAnswer,
    category: en.category,
    targetQuery: en.targetQuery,
    relatedQueries: en.relatedQueries || [],
    faqs: en.faqs || [],
    bodyMarkdown: en.bodyMarkdown,
  };

  const userPrompt = `Translate this article's fields into es-419. The "targetQuery" and "relatedQueries" should become the natural Spanish queries a Spanish-speaking user would actually search (translate intent, keep them search-like). Keep "category" short.

Return ONLY a single fenced json code block with exactly these keys: title, description, quickAnswer, category, targetQuery, relatedQueries, faqs, bodyMarkdown. faqs is an array of {q, a}.

English article (JSON):
\`\`\`json
${JSON.stringify(payload)}
\`\`\``;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`translate: Anthropic API ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  const fence = text.match(/```json\s*([\s\S]*?)```/);
  const jsonText = fence ? fence[1] : text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  const out = JSON.parse(jsonText.trim());

  // Guardrails: a translation that dropped FAQs or the body is unusable.
  if (!out.bodyMarkdown || !String(out.bodyMarkdown).trim()) {
    throw new Error('translate: empty bodyMarkdown in translation');
  }
  if ((payload.faqs.length || 0) > 0 && (!Array.isArray(out.faqs) || !out.faqs.length)) {
    throw new Error('translate: translation dropped all FAQs');
  }
  return out;
}
