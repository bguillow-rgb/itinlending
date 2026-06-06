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
    }),
    mdx(),
  ],
});
