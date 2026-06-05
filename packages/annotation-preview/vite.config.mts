/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import * as path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/annotation-preview',
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
}));
