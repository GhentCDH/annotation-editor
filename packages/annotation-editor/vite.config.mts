/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import * as path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/annotation-editor',
  plugins: [
    vue(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
  ],
  build: {
    outDir: '../../dist/packages/annotation-editor',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'AnnotationEditor',
      fileName: 'index',
      format: ['cjs', 'esm', 'es'],
    },
    rollupOptions: {
      external: [
        '@ghentcdh/annotated-text',
        '@ghentcdh/annotation-core',
        '@ghentcdh/json-forms-core',
        '@ghentcdh/json-forms-vue',
        '@ghentcdh/ui',
        '@ghentcdh/w3c-utils',
        '@jsonforms/core',
        'uuid',
        'vue',
        'zod',
      ],
    },
  },
  test: {
    name: 'core',
    watch: false,
    globals: true,
    environment: 'jsdom', // or 'happy-dom'
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['e2e/**/*', 'node_modules/**/*'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      enabled: false, // Enable via --coverage flag
      reporter: [
        'text',
        'text-summary',
        'json',
        'json-summary',
        'lcov',
        'html',
      ],
      reportsDirectory: './coverage/unit',
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/e2e/**',
        '**/*.d.ts',
        '**/index.ts',
        '**/__tests__/**',
      ],
    },
  },
}));
