import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { viteBundler } from '@vuepress/bundler-vite';
import { defineUserConfig } from 'vuepress';
import { hopeTheme } from 'vuepress-theme-hope';

import guideSideBar from '../guide/typedoc_sidebar.json' with { type: 'json' };

export default defineUserConfig({
  base: process.env.DOCS_BASE ? `${process.env.DOCS_BASE}/` : '/',
  title: 'Annotation Editor',
  description: 'W3C-compliant annotation editing components for Vue 3',
  pagePatterns: ['**/*.md', '!.vuepress', '!**/node_modules'],
  lastUpdated: true,
  bundler: viteBundler({
    viteOptions: {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          '@ghentcdh/annotation-editor': fileURLToPath(
            new URL(
              '../../packages/annotation-editor/src/index.ts',
              import.meta.url,
            ),
          ),
          '@ghentcdh/annotation-preview': fileURLToPath(
            new URL(
              '../../packages/annotation-preview/src/index.ts',
              import.meta.url,
            ),
          ),
          '@ghentcdh/annotation-vue': fileURLToPath(
            new URL(
              '../../packages/annotation-vue/src/index.ts',
              import.meta.url,
            ),
          ),
          '@ghentcdh/annotation-ui': fileURLToPath(
            new URL(
              '../../packages/annotation-ui/src/index.ts',
              import.meta.url,
            ),
          ),
          '@ghentcdh/annotation-core': fileURLToPath(
            new URL(
              '../../packages/annotation-core/src/index.ts',
              import.meta.url,
            ),
          ),
        },
      },
    },
    vuePluginOptions: {},
  }),
  theme: hopeTheme({
    docsRepo: 'https://github.com/GhentCDH/annotation-editor',
    docsBranch: 'main',
    docsDir: 'docs',
    lastUpdated: true,
    colorMode: 'light',
    markdown: {
      mermaid: true,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/GhentCDH/annotation-editor' },
    ],
    plugins: {
      mdEnhance: {
        tabs: true,
        codetabs: true,
        demo: true,
      },
    },
    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/quick-start' },
    ],
    sidebar: [
      {
        text: 'Guide',
        children: guideSideBar,
      },
    ],
  }),
});
