/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { bundleDtsImports } from '../../tools/vite/bundle-dts-imports.mts';
import { copyPackageJson } from '../../tools/vite/copy-package-json.mts';
import * as path from 'path';

const bundledPackages = [
  '@ghentcdh/annotation-core',
  '@ghentcdh/annotation-ui',
];

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/annotation-preview',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
    bundleDtsImports(
      '../../dist/packages/annotation-preview',
      bundledPackages,
      __dirname,
    ),
    copyPackageJson(),
  ],
  build: {
    outDir: '../../dist/packages/annotation-preview',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'AnnotationPreview',
      fileName: 'index',
      format: ['cjs', 'esm', 'es'],
    },
    rollupOptions: {
      external: [
        '@ghentcdh/annotated-text',
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
    passWithNoTests: true,
  },
}));
