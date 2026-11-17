/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as path from 'path';

export default defineConfig(() => {
  // Read the active configuration target passed down by Nx
  const nxConfiguration =
    process.env.NX_TASK_TARGET_CONFIGURATION ?? 'production';

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/packages/annotation-ui',
    // Dynamic mode selection based on the active Nx configuration
    mode: nxConfiguration,
    plugins: [
      vue(),
      tsconfigPaths(),
      dts({
        entryRoot: 'src',
        tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
        pathsToAliases: false,
      }),
    ],
    build: {
      outDir: '../../dist/packages/annotation-ui',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: { transformMixedEsModules: true },
    },
    test: {
      watch: false,
      globals: true,
      environment: 'node',
      include: ['src/**/*.spec.ts'],
    },
  };
});
