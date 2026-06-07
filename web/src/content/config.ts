import { defineCollection, z } from 'astro:content';

// Shared article schema. Tier flag distinguishes pillar (3,000-5,000 words,
// broad keyword), cluster (1,500-2,500 words, mid-funnel subtopic), and detail
// (800-1,500 words, long-tail).
const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  tier: z.enum(['pillar', 'cluster', 'detail']),
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
  published: z.boolean().default(true),
});

// EN articles render through src/pages/articles/[...slug].astro; ES articles
// (es-419 translations, same slug) render through src/pages/es/articles/
// [...slug].astro. Both share the schema above.
const articles = defineCollection({ type: 'content', schema: articleSchema });
const articlesEs = defineCollection({ type: 'content', schema: articleSchema });

export const collections = { articles, articlesEs };
