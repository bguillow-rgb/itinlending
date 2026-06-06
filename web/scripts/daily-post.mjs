// Daily SEO post generator. Researches current high-intent keywords in this
// site's vertical via the Claude API + web search, picks ONE target query not
// already covered, and writes a schema-compliant article to
// src/content/articles/<slug>.md. It does NOT build, commit, or deploy — the
// GitHub Actions workflow does that after this script writes the file.
//
// Usage:  ANTHROPIC_API_KEY=... node scripts/daily-post.mjs
// Exit 0 + no file written means "nothing new to publish today" (not an error).
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_DIR = resolve(__dirname, '..');
const ARTICLES_DIR = join(WEB_DIR, 'src/content/articles');
const CONSTS = readFileSync(join(WEB_DIR, 'src/consts.ts'), 'utf8');

const MODEL = process.env.DAILY_POST_MODEL || 'claude-sonnet-4-6';
const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('daily-post: ANTHROPIC_API_KEY is not set. Aborting.');
  process.exit(1);
}

// --- Read site identity from consts.ts (keeps this script portable across the
// three sites without per-repo edits) -------------------------------------
const pick = (re, fallback = '') => (CONSTS.match(re)?.[1] ?? fallback).trim();
const SITE = {
  name: pick(/name:\s*'([^']+)'/),
  url: pick(/url:\s*'([^']+)'/),
  description: pick(/^\s*description:\s*\n?\s*'([^']+)'/m) || pick(/description:\s*'([^']+)'/),
  author: pick(/founder:\s*\{[^}]*?name:\s*'([^']+)'/s) || 'Bob Guillow',
};

// --- Existing articles: dedupe + give the model the current cluster map -----
const existing = readdirSync(ARTICLES_DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const raw = readFileSync(join(ARTICLES_DIR, f), 'utf8');
    const fm = raw.split('---')[1] || '';
    return {
      slug: f.replace(/\.md$/, ''),
      title: (fm.match(/title:\s*"([^"]+)"/) || fm.match(/title:\s*'([^']+)'/) || [])[1] || '',
      targetQuery: (fm.match(/targetQuery:\s*"([^"]+)"/) || fm.match(/targetQuery:\s*'([^']+)'/) || [])[1] || '',
    };
  });
const existingSlugs = new Set(existing.map((a) => a.slug));
const existingList = existing
  .map((a) => `- ${a.slug} | "${a.title}" | target: ${a.targetQuery}`)
  .join('\n') || '(none yet)';

// --- Prompt ---------------------------------------------------------------
const today = new Date().toISOString().slice(0, 10);
const systemPrompt = `You are a senior SEO content strategist and writer for ${SITE.name} (${SITE.url}).
Site focus: ${SITE.description}

You write ONE article per day that is genuinely useful, original, first-hand in tone, and optimized to be cited by Google AI Overviews and answer engines (ChatGPT, Perplexity, Gemini). You never produce thin or duplicative content.

MANDATORY article structure:
- A 40-60 word Quick Answer that directly answers the target query (this becomes the quickAnswer field, marked Speakable).
- H2 headings phrased as QUESTIONS (e.g. "How Much Does X Cost?"), each answering its question completely in ~134-167 self-contained words.
- At least one comparison table (GitHub-flavored markdown).
- A concrete stat, number, or cited fact roughly every 150-200 words. Attribute sources in prose (e.g. "according to the CFPB").
- 5+ FAQs (these become the faqs field for FAQPage schema).
- 900-1500 words total for a detail/cluster article. Original wording only — never copy phrasing from sources.
- Internal-link naturally in prose to relevant existing pages on this site when it makes sense.`;

const userPrompt = `Today is ${today}.

STEP 1 — Research. Use web search to find current, high-intent, LOW-competition keyword opportunities in this site's vertical (ITIN holders / immigrants navigating U.S. ${SITE.name.includes('Credit Card') ? 'credit cards' : SITE.name.includes('Credit Score') ? 'credit scores and credit building' : 'lending, loans and mortgages'}). Look for questions real people ask in 2026 that we do NOT already cover.

Articles we ALREADY have (do NOT duplicate these target queries or topics):
${existingList}

STEP 2 — Pick ONE target query we don't already cover and that has real search demand.

STEP 3 — Write the full article following the mandatory structure in the system prompt.

OUTPUT — Return ONLY a single fenced code block tagged json, nothing before or after it, with exactly these fields:
\`\`\`json
{
  "slug": "kebab-case-url-slug",
  "title": "55-65 char SEO title",
  "description": "150-160 char meta description, leads with the answer",
  "tier": "detail",
  "targetQuery": "the exact target query",
  "relatedQueries": ["3-5 secondary queries this also targets"],
  "quickAnswer": "40-60 word direct answer",
  "category": "one of: Loans, Mortgages, Credit, Credit Cards, Credit Score, Guides",
  "faqs": [{"q": "question?", "a": "concise answer"}],
  "bodyMarkdown": "the full article body in markdown, starting with the first paragraph (NO frontmatter, NO H1 title — the layout renders the title)"
}
\`\`\`
The slug MUST NOT be any of: ${[...existingSlugs].join(', ') || '(none)'}.`;

// --- Call the API with the web search tool --------------------------------
async function generate() {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      // High ceiling so the JSON article is never truncated mid-field by the
      // model's web-search narration + prose preamble (which caused the daily
      // run to fail with "could not parse JSON" when the response hit the cap).
      max_tokens: 16000,
      system: systemPrompt,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 6 }],
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
}

// Strip web-search citation markup the model can leave behind (<cite ...>text
// </cite>) while keeping the inner text. Also collapse the stray artifacts.
const stripCites = (s) =>
  String(s ?? '')
    .replace(/<\/?cite[^>]*>/gi, '')
    .replace(/\[\d+(?:-\d+)*\]/g, '');

// --- YAML assembly (typed to the known schema) ----------------------------
const yamlStr = (s) => JSON.stringify(stripCites(s)); // double-quoted, escaped
const yamlList = (arr) =>
  (arr || []).length ? '\n' + arr.map((x) => `  - ${yamlStr(x)}`).join('\n') : ' []';
const yamlFaqs = (faqs) =>
  (faqs || []).length
    ? '\n' + faqs.map((f) => `  - q: ${yamlStr(f.q)}\n    a: ${yamlStr(f.a)}`).join('\n')
    : ' []';

function buildMarkdown(a) {
  const fm = [
    '---',
    `title: ${yamlStr(a.title)}`,
    `description: ${yamlStr(a.description)}`,
    `tier: ${a.tier || 'detail'}`,
    `targetQuery: ${yamlStr(a.targetQuery)}`,
    `relatedQueries:${yamlList(a.relatedQueries)}`,
    `quickAnswer: ${yamlStr(a.quickAnswer)}`,
    `publishedAt: ${yamlStr(today)}`,
    `author: ${yamlStr(a.author || SITE.author)}`,
    `category: ${yamlStr(a.category || 'Guides')}`,
    `relatedSlugs: []`,
    `faqs:${yamlFaqs(a.faqs)}`,
    `published: true`,
    '---',
    '',
    stripCites(a.bodyMarkdown).trim(),
    '',
  ].join('\n');
  return fm;
}

function parseJsonBlock(text) {
  const fence = text.match(/```json\s*([\s\S]*?)```/);
  const jsonText = fence ? fence[1] : text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  return JSON.parse(jsonText.trim());
}

function validate(a) {
  const errs = [];
  for (const f of ['slug', 'title', 'description', 'targetQuery', 'quickAnswer', 'bodyMarkdown']) {
    if (!a[f] || !String(a[f]).trim()) errs.push(`missing ${f}`);
  }
  if (a.quickAnswer && a.quickAnswer.length < 40) errs.push('quickAnswer under 40 chars');
  if (!Array.isArray(a.faqs) || a.faqs.length < 1) errs.push('needs at least 1 faq');
  if (!/^[a-z0-9-]+$/.test(a.slug || '')) errs.push('slug not kebab-case');
  return errs;
}

// --- Main -----------------------------------------------------------------
const text = await generate();
let article;
try {
  article = parseJsonBlock(text);
} catch (e) {
  console.error('daily-post: could not parse JSON from model output.\n', text.slice(0, 800));
  process.exit(1);
}

const errs = validate(article);
if (errs.length) {
  console.error('daily-post: article failed validation:', errs.join('; '));
  process.exit(1);
}

if (existingSlugs.has(article.slug)) {
  console.log(`daily-post: slug "${article.slug}" already exists — nothing new to publish today.`);
  process.exit(0);
}

const outPath = join(ARTICLES_DIR, `${article.slug}.md`);
if (existsSync(outPath)) {
  console.log(`daily-post: ${outPath} already exists — skipping.`);
  process.exit(0);
}

writeFileSync(outPath, buildMarkdown(article), 'utf8');
console.log(`daily-post: wrote ${outPath}`);
console.log(`  title:  ${article.title}`);
console.log(`  target: ${article.targetQuery}`);
// Emit the new slug for the workflow (GitHub Actions reads stdout / file).
if (process.env.GITHUB_OUTPUT) {
  writeFileSync(process.env.GITHUB_OUTPUT, `slug=${article.slug}\nwrote=true\n`, { flag: 'a' });
}
