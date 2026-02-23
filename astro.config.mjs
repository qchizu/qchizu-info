// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { remarkAlert } from 'remark-github-blockquote-alert';
import { remarkBaseUrl } from './src/plugins/remark-base-url.mjs';

const BASE = '/info';

// https://astro.build/config
export default defineConfig({
  site: 'https://qchizu.jp',
  base: BASE,
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkAlert, [remarkBaseUrl, { base: BASE }]],
  },
});
