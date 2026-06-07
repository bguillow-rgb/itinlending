import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://itinlending.net',
  trailingSlash: 'never',
  build: { format: 'file' }, // Generates /about.html, /apply.html, etc.
  // NOTE: legacy WordPress 404 recovery is handled by physical redirect stubs in
  // public/ (see public/_redirects-legacy and the dated /2023/.. , /category/.. ,
  // /page/.. dirs) rather than Astro `redirects`, because those URLs are indexed
  // WITH a trailing slash and GitHub Pages serves trailing-slash requests from
  // <path>/index.html — which the format:'file' build would not produce.
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !/\/(404|thank-you)(\/|$)/.test(page),
      // Emit reciprocal hreflang alternates (en / es / x-default) on every URL.
      // Our EN pages are un-prefixed (/foo) and ES live at /es/foo, which doesn't
      // fit @astrojs/sitemap's i18n option (it assumes every locale is path-
      // prefixed), so we set `links` manually per entry. This belt-and-suspenders
      // the in-<head> hreflang already on each page.
      serialize(item) {
        const { origin, pathname } = new URL(item.url);
        const path = pathname.replace(/\/$/, '') || '/';
        const enPath =
          path === '/es' ? '/' : path.startsWith('/es/') ? path.slice(3) : path;
        const enUrl = origin + (enPath === '/' ? '' : enPath);
        const esUrl = origin + (enPath === '/' ? '/es' : `/es${enPath}`);
        item.links = [
          { lang: 'en', url: enUrl },
          { lang: 'es', url: esUrl },
          { lang: 'x-default', url: enUrl },
        ];
        return item;
      },
    }),
    mdx(),
  ],
});
