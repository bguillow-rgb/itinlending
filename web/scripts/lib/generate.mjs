// Shared article generation against the Claude API + web search. Used by
// daily-post.mjs (one detail article/day) and seed-content.mjs (one-shot batch
// backfill + pillar). Keeps the prompt and validation in one place so all three
// produce schema-compliant, AEO-optimized content.
import { readFileSync } from 'node:fs';
import { humanizeArticle } from './humanize.mjs';

// Read this site's identity from consts.ts so the scripts stay portable across
// the three ITIN repos without per-repo edits.
export function loadSite(constsPath) {
  const CONSTS = readFileSync(constsPath, 'utf8');
  const pick = (re, fallback = '') => (CONSTS.match(re)?.[1] ?? fallback).trim();
  // Pen-name byline roster: every `name:` inside the editorial.team array. Used
  // to rotate article bylines so the site doesn't read as written by one hand.
  const teamBlock = CONSTS.match(/team:\s*\[([\s\S]*?)\]/)?.[1] ?? '';
  const authors = [...teamBlock.matchAll(/name:\s*'([^']+)'/g)].map((m) => m[1].trim());
  return {
    name: pick(/name:\s*'([^']+)'/),
    url: pick(/url:\s*'([^']+)'/),
    description:
      pick(/^\s*description:\s*\n?\s*'([^']+)'/m) || pick(/description:\s*'([^']+)'/),
    author: pick(/editorial:\s*\{[^}]*?name:\s*'([^']+)'/s) || pick(/name:\s*'([^']+)'/),
    authors,
  };
}

// Strict topical lane per site. AdSense flagged the family for "low value
// content" partly because the three sites shared ~50-70% of topics; each site
// must now stay in its own lane (card=cards, score=scores, lending=catch-all).
function scopeOf(site) {
  if (site.name.includes('Credit Card')) {
    return {
      vertical: 'credit cards for ITIN holders',
      rule: 'STRICT SCOPE: this site is ONLY about CREDIT CARDS for ITIN holders (secured/unsecured/business/store cards, applying, approval odds, limits, rewards, fees, issuers and banks that accept ITINs, using cards to build credit). Do NOT write an article whose primary topic is a loan, mortgage, auto/personal/business loan, bank account, or credit-score/credit-report mechanics. Mention a credit score ONLY briefly where a credit card directly affects it.',
    };
  }
  if (site.name.includes('Credit Score')) {
    return {
      vertical: 'credit scores, credit reports and credit building for ITIN holders',
      rule: 'STRICT SCOPE: this site is ONLY about CREDIT SCORES, CREDIT REPORTS and CREDIT BUILDING for ITIN holders (how scores work with an ITIN, the bureaus, checking and monitoring, building and improving history, credit-builder loans, disputes, transferring history to an SSN). Do NOT write an article whose primary topic is a credit card product, a loan, a mortgage, or a bank account. Mention those ONLY briefly where they affect a credit score.',
    };
  }
  return {
    vertical: 'lending, loans and mortgages for ITIN holders',
    rule: 'SCOPE: this site covers lending broadly for ITIN holders, personal/auto/business/student loans, mortgages and home equity, plus related banking, insurance and credit topics as they relate to borrowing.',
  };
}

function systemPrompt(site, tier) {
  const pillar = tier === 'pillar';
  const scope = scopeOf(site);
  return `You are a senior SEO content strategist and writer for ${site.name} (${site.url}).
Site focus: ${site.description}
Site vertical: ${scope.vertical}

${scope.rule}

You write content that is genuinely useful, original, first-hand in tone, and optimized to be cited by Google AI Overviews and answer engines (ChatGPT, Perplexity, Gemini). You never produce thin or duplicative content.

MANDATORY article structure:
- A 40-60 word Quick Answer that directly answers the target query (this becomes the quickAnswer field, marked Speakable).
- Write the body as a Q&A between real readers and our editorial team. Frame each H2 as a genuine first-person reader question, the way someone would actually type or ask it, not a dry topic label.
- Under about half the H2 sections (not all, that reads templated), open with a short italicized framing lead-in, ROTATING among phrasings like "*A question we hear often:*", "*Readers frequently ask:*", "*This one comes up a lot:*". NEVER invent a person's name, persona, quote, or fake testimonial.
- VARY answer depth: most sections answer completely in ~134-167 self-contained words, but some sections should run two full paragraphs (roughly 250-320 words) where the topic deserves it. Do not make every section the same length.
- At least one comparison table (GitHub-flavored markdown)${pillar ? ' (pillars should have 2-3 tables)' : ''}.
- A concrete stat, number, or cited fact roughly every 150-200 words. Attribute sources in prose (e.g. "according to the CFPB").
- ${pillar ? '8+' : '5+'} FAQs (these become the faqs field for FAQPage schema).
- ${pillar ? '3000-5000 words for a comprehensive PILLAR overview that links down to every subtopic' : '1000-1600 words total for a detail/cluster article'}. Original wording only, never copy phrasing from sources.
- Internal-link naturally in prose to relevant existing pages on this site when it makes sense.
- PUNCTUATION (strict): Never use em dashes or en dashes, nor their code/HTML forms (\\u2014, \\u2013, &mdash;, &ndash;). Use commas, colons, parentheses, or separate sentences instead. For numeric ranges use a plain hyphen, e.g. "12-24 months" or "15%-20%".`;
}

function userPrompt(site, { tier, existingList, existingSlugs, today, topicHint }) {
  const pillar = tier === 'pillar';
  const scope = scopeOf(site);
  return `Today is ${today}.

${scope.rule}

STEP 1, Research. Use web search to find current, high-intent${pillar ? '' : ', LOW-competition'} keyword opportunities in this site's vertical (ITIN holders / immigrants navigating U.S. ${scope.vertical}). Look for questions real people ask in 2026 that we do NOT already cover.

Articles we ALREADY have (do NOT duplicate these target queries or topics):
${existingList}

STEP 2, ${
    pillar
      ? 'Pick the single BROADEST canonical query for this site (the pillar topic that all our detail articles ladder up to).'
      : `Pick ONE target query we don't already cover and that has real search demand.${topicHint ? ` Lean toward this theme: ${topicHint}.` : ''}`
  }

STEP 3, Write the full ${pillar ? 'PILLAR ' : ''}article following the mandatory structure in the system prompt.

OUTPUT, Return ONLY a single fenced code block tagged json, nothing before or after it, with exactly these fields:
\`\`\`json
{
  "slug": "kebab-case-url-slug",
  "title": "55-65 char SEO title",
  "description": "150-160 char meta description, leads with the answer",
  "tier": "${tier}",
  "targetQuery": "the exact target query",
  "relatedQueries": ["3-5 secondary queries this also targets"],
  "quickAnswer": "40-60 word direct answer",
  "category": "one of: Loans, Mortgages, Credit, Credit Cards, Credit Score, Guides",
  "faqs": [{"q": "question?", "a": "concise answer"}],
  "bodyMarkdown": "the full article body in markdown, starting with the first paragraph (NO frontmatter, NO H1 title, the layout renders the title)"
}
\`\`\`
The slug MUST NOT be any of: ${[...existingSlugs].join(', ') || '(none)'}.`;
}

// Escape raw control characters (newlines, tabs, etc.) that appear INSIDE JSON
// string literals. The model often emits multi-line markdown in bodyMarkdown
// with literal newlines, which is invalid JSON and makes a bare JSON.parse throw
// ("Expected ',' or '}' ..."). We walk the text tracking string context so we
// only touch control chars inside strings, structural whitespace is preserved.
function escapeControlCharsInStrings(s) {
  let out = '';
  let inString = false;
  let escaped = false;
  for (const ch of s) {
    const code = ch.charCodeAt(0);
    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      out += ch;
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      out += ch;
      continue;
    }
    if (inString && code < 0x20) {
      out +=
        ch === '\n' ? '\\n' : ch === '\r' ? '\\r' : ch === '\t' ? '\\t' : `\\u${code.toString(16).padStart(4, '0')}`;
      continue;
    }
    out += ch;
  }
  return out;
}

export function parseJsonBlock(text) {
  const fence = text.match(/```json\s*([\s\S]*?)```/);
  const jsonText = (
    fence ? fence[1] : text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)
  ).trim();
  try {
    return JSON.parse(jsonText);
  } catch {
    // Most common cause: unescaped control chars inside a string (e.g. literal
    // newlines in bodyMarkdown). Sanitize and reparse before giving up.
    return JSON.parse(escapeControlCharsInStrings(jsonText));
  }
}

export function validateArticle(a) {
  const errs = [];
  for (const f of ['slug', 'title', 'description', 'targetQuery', 'quickAnswer', 'bodyMarkdown']) {
    if (!a[f] || !String(a[f]).trim()) errs.push(`missing ${f}`);
  }
  if (a.quickAnswer && a.quickAnswer.length < 40) errs.push('quickAnswer under 40 chars');
  if (!Array.isArray(a.faqs) || a.faqs.length < 1) errs.push('needs at least 1 faq');
  if (!/^[a-z0-9-]+$/.test(a.slug || '')) errs.push('slug not kebab-case');
  return errs;
}

// Generate one article. Returns the parsed+validated article object (no files
// written, callers handle relatedSlugs, ES translation, and disk writes).
async function callOnce({ apiKey, model, site, tier, existingList, existingSlugs, today, topicHint }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: tier === 'pillar' ? 24000 : 16000,
      system: systemPrompt(site, tier),
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 6 }],
      messages: [
        { role: 'user', content: userPrompt(site, { tier, existingList, existingSlugs, today, topicHint }) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  const article = parseJsonBlock(text);
  const errs = validateArticle(article);
  if (errs.length) throw new Error(`article failed validation: ${errs.join('; ')}`);
  article.tier = tier;
  return article;
}

// Generate one article, retrying the whole API call on a parse/validation
// failure. parseJsonBlock already self-heals unescaped control chars; the retry
// covers genuinely malformed output (truncation, missing fields) so a single bad
// generation doesn't waste the entire day's run across all three sites.
export async function generateArticle({
  apiKey,
  model = 'claude-sonnet-4-6',
  site,
  tier = 'detail',
  existingList,
  existingSlugs,
  today,
  topicHint,
  attempts = 3,
}) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      const draft = await callOnce({ apiKey, model, site, tier, existingList, existingSlugs, today, topicHint });
      return await humanizeArticle({ apiKey, model, article: draft });
    } catch (e) {
      lastErr = e;
      console.error(`generateArticle: attempt ${i}/${attempts} failed: ${e.message}`);
    }
  }
  throw lastErr;
}
