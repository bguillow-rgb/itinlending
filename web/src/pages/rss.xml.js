// Hand-rolled RSS 2.0 feed (no extra dependency). Lists the articles
// collection, newest first. Generated statically at build as /rss.xml.
import { getCollection } from 'astro:content';
import { SITE } from '../consts';

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function GET() {
  const posts = (await getCollection('articles', ({ data }) => data.published))
    .sort(
      (a, b) =>
        (b.data.updatedAt ?? b.data.publishedAt).valueOf() -
        (a.data.updatedAt ?? a.data.publishedAt).valueOf()
    );

  const items = posts
    .map((p) => {
      const url = `${SITE.url}/articles/${p.slug}`;
      const date = (p.data.updatedAt ?? p.data.publishedAt).toUTCString();
      return `    <item>
      <title>${esc(p.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${esc(p.data.description)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)}</title>
    <link>${SITE.url}</link>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${esc(SITE.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
