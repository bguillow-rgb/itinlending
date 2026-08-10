import { defineCollection, z } from 'astro:content';

// Shared article schema. Tier flag distinguishes pillar (3,000-5,000 words,
// broad keyword), flagship (2,500-4,000 words, original-data cluster owner built
// to earn links/citations), cluster (1,500-2,500 words, mid-funnel subtopic), and
// detail (800-1,500 words, long-tail).
const articleSchema = z.object({
  // `title` is the SERP title. BaseLayout appends " | ITIN Lending" (15 chars),
  // so keep this under ~45 or Google truncates it. The 2026-08-10 audit found
  // every page-1 ES article rendering at 61-86 chars and earning zero clicks.
  title: z.string(),
  // Optional on-page <h1>. Defaults to `title` when omitted. Set it when the
  // SERP wants a short title but the page wants a question-shaped heading:
  // question H1s are the preferred extraction target for AI answer engines,
  // and ChatGPT drives ~40% of this site's key events, so that is worth
  // protecting independently of the title rewrite.
  h1: z.string().optional(),
  description: z.string(),
  tier: z.enum(['pillar', 'flagship', 'cluster', 'detail']),
  targetQuery: z.string(),
  relatedQueries: z.array(z.string()).default([]),
  // 40-60 word direct answer at the top. Marked Speakable for AI engines.
  quickAnswer: z.string().min(40, 'quickAnswer should be 40-60 words'),
  publishedAt: z.string().transform((s) => new Date(s)),
  updatedAt: z
    .string()
    .transform((s) => new Date(s))
    .optional(),
  author: z.string().default('ITIN Lending Editorial Team'),
  // Short label for the blog index card and breadcrumb section grouping.
  category: z.string().default('Guides'),
  relatedSlugs: z.array(z.string()).default([]),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  // Optional ordered steps for genuinely step-based articles ("how to renew
  // your ITIN", "how to qualify for..."). When present, emits HowTo schema
  // alongside Article schema. Leave empty for non-procedural articles.
  howToSteps: z.array(z.object({ name: z.string(), text: z.string() })).default([]),
  published: z.boolean().default(true),
});

// EN articles render through src/pages/articles/[...slug].astro; ES articles
// (es-419 translations, same slug) render through src/pages/es/articles/
// [...slug].astro. Both share the schema above.
const articles = defineCollection({ type: 'content', schema: articleSchema });
const articlesEs = defineCollection({ type: 'content', schema: articleSchema });

// NOTE: collection keys MUST match the on-disk folder name under src/content/.
// The Spanish folder is `articles-es`, so the key is the hyphenated string (not
// camelCase), otherwise the collection loads empty and every /es/articles/* page
// silently falls back to the English entry.
export const collections = { articles, 'articles-es': articlesEs };
