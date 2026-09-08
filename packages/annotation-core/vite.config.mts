/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { copyPackageJson } from '../../tools/vite/copy-package-json.mts';
import * as path from 'path';
import { execSync } from 'node:child_process';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/annotation-core',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
      pathsToAliases: false,
    }),
    copyPackageJson(),
    {
      name: 'gen-resource-schema',
      closeBundle() {
        execSync('node scripts/gen-resource-schema.mjs', {
          cwd: import.meta.dirname,
          stdio: 'inherit',
        });
      },
    },
  ],
  build: {
    outDir: '../../dist/packages/annotation-core',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'annotation-core',
      fileName: 'index',
      format: ['cjs', 'esm', 'es'],
    },
    rollupOptions: {
      external: [
        '@ghentcdh/w3c-utils',
        '@ghentcdh/crouton-vue',
        '@ghentcdh/annotated-text',
        'zod',
      ],
    },
  },
  test: {
    name: 'utils',
    watch: false,
    globals: true,
    passWithNoTests: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/annotation-core',
      provider: 'v8' as const,
    },
  },
}));
