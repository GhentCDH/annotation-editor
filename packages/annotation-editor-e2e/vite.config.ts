import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { linkedPackagesConfig } from '../../tools/vite/linked-packages.mts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const playgroundRoot = resolve(__dirname, 'src/playground');
const workspaceRoot = resolve(__dirname, '../..');
const linked = linkedPackagesConfig(workspaceRoot);

export default defineConfig({
  root: playgroundRoot,
  plugins: [vue()],
  resolve: {
    tsconfigPaths: true,
    alias: [
      {
        find: '@ghentcdh/annotation-editor',
        replacement: fileURLToPath(
          new URL('../annotation-editor/src/index.ts', import.meta.url),
        ),
      },
      {
        find: '@ghentcdh/annotation-core',
        replacement: fileURLToPath(
          new URL('../annotation-core/src/index.ts', import.meta.url),
        ),
      },
      {
        find: '@ghentcdh/annotation-vue',
        replacement: fileURLToPath(
          new URL('../annotation-vue/src/index.ts', import.meta.url),
        ),
      },
    ],
  },
  optimizeDeps: {
    exclude: linked.exclude,
  },
  server: {
    port: 4175,
    host: '0.0.0.0',
    strictPort: true,
    ...linked.server,
  },
  preview: {
    port: 4175,
    host: '0.0.0.0',
  },
});
