/// <reference types="vitest" />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,

  cacheDir: '../../node_modules/.vite/annotation-api',

  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.resolve(__dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
      insertTypesEntry: true,
    }),
  ],

  build: {
    outDir: '../../dist/packages/annotation-api',
    emptyOutDir: true,
    reportCompressedSize: true,

    target: 'node18',

    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'annotation-api',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },

    rollupOptions: {
      external: [
        'node:fs',
        'node:path',

        '@ghentcdh/annotation-core',
        '@ghentcdh/json-forms-core',
        '@ghentcdh/w3c-utils',
        '@nestjs/common',
        '@nestjs/common/decorators',
        '@nestjs/swagger',
        '@nestjs/core',
        'reflect-metadata',
        /^@nestjs\/.*/,
        'zod',
      ],
    },
  },

  ssr: {
    external: ['node:fs', 'node:path', 'node:util', 'node:stream'],
  },

  test: {
    name: 'utils',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/annotation-core',
      provider: 'v8',
    },
  },
});
