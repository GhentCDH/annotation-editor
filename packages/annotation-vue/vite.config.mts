/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/annotation-vue',
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@ghentcdh/annotation-editor': path.resolve(
        import.meta.dirname,
        '../../packages/annotation-editor/src/index.ts',
      ),
      '@ghentcdh/annotation-ui': path.resolve(
        import.meta.dirname,
        '../../packages/annotation-ui/src/index.ts',
      ),
    },
  },
  plugins: [vue(), tailwindcss(), tsconfigPaths()],
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
