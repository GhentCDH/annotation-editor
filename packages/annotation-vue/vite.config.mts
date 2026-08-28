/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { copyPackageJson } from '../../tools/vite/copy-package-json.mts';
import * as path from 'path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/annotation-vue',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
      bundledPackages: ['@ghentcdh/annotation-core'],
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
      format: ['cjs', 'esm', 'es'],
    },
    rollupOptions: {
      external: [
        '@ghentcdh/annotated-text',
        '@ghentcdh/crouton-forms-vue',
        '@ghentcdh/w3c-utils',
        'vue',
        '@vue/runtime-dom',
        'vue-router',
        'zod',
      ],
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