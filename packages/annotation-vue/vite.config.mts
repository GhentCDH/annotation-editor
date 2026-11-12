/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { copyPackageJson } from '../../tools/vite/copy-package-json.mts';
import * as path from 'path';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const PRIVATE_PACKAGES = ['annotation-ui', 'annotation-editor'];

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/annotation-vue',
  plugins: [
    vue(),
    tailwindcss(),
    tsconfigPaths(),
    // annotation-ui and annotation-editor are private (bundled into the JS), so
    // emit their declarations next to ours and rewrite imports to relative paths.
    dts({
      entryRoot: '..',
      // tsconfig.dts.json adds the private sources as root files: the plugin only
      // emits root files and files Vite transforms, so type-only imports would
      // otherwise be dropped.
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.dts.json'),
      pathsToAliases: false,
      aliases: PRIVATE_PACKAGES.map((p) => ({
        find: `@ghentcdh/${p}`,
        replacement: path.join(import.meta.dirname, `../${p}/src`),
      })),
    }),
    copyPackageJson(),
  ],
  build: {
    outDir: '../../dist/packages/annotation-vue',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'annotation-vue',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        '@ghentcdh/annotated-text',
        '@ghentcdh/crouton-core',
        '@ghentcdh/crouton-vue',
        '@ghentcdh/w3c-utils',
        'vue',
        '@vue/runtime-dom',
        'vue-router',
        'zod',
      ],
      output: {
        globals: { vue: 'Vue' },
        assetFileNames: 'styles[extname]',
      },
    },
  },
  test: {
    name: 'annotation-vue',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/annotation-vue',
      provider: 'v8' as const,
    },
  },
}));
