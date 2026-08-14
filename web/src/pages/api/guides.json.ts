// Machine-readable guide index consumed by the itin-finance-mcp server
// (mcp-server/ in this repo). Built statically as /api/guides.json on every
// deploy, so the 3x/week content pipeline keeps the MCP surface fresh with no
// server republish. Same file exists in the credit-card and credit-score
// repos with their own SITE_KEY — keep the shape in sync across all three.
import { getCollection } from 'astro:content';
import { SITE } from '../../consts';

const SITE_KEY = 'lending';

export async function GET() {
  const collect = async (name: 'articles' | 'articles-es', lang: 'en' | 'es') => {
    const posts = await getCollection(name, ({ data }) => data.published);
    return posts.map((p) => ({
      site: SITE_KEY,
      lang,
      slug: p.slug,
      url: `${SITE.url}/${lang === 'es' ? 'es/' : ''}articles/${p.slug}/`,
      title: p.data.title,
      description: p.data.description,
      tier: p.data.tier,
      category: p.data.category,
      targetQuery: p.data.targetQuery,
      relatedQueries: p.data.relatedQueries,
      quickAnswer: p.data.quickAnswer,
      publishedAt: (p.data.updatedAt ?? p.data.publishedAt).toISOString().slice(0, 10),
      relatedSlugs: p.data.relatedSlugs,
      faqs: p.data.faqs,
    }));
  };

  const guides = [...(await collect('articles', 'en')), ...(await collect('articles-es', 'es'))];
  return new Response(
    JSON.stringify({ site: SITE_KEY, generatedAt: new Date().toISOString().slice(0, 10), guides }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}
