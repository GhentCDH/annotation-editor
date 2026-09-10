/**
 * Vite plugin that copies the project's package.json to the build output directory.
 *
 * Replaces the asset-copying functionality previously provided by the
 * deprecated `nxCopyAssetsPlugin()`.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import type { Plugin } from 'vite';

export const copyPackageJson = (): Plugin => {
  let outDir: string;
  let root: string;

  return {
    name: 'copy-package-json',
    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
    },
    closeBundle() {
      const src = resolve(root, 'package.json');
      const dest = resolve(outDir, 'package.json');

      try {
        mkdirSync(dirname(dest), { recursive: true });
        writeFileSync(dest, readFileSync(src, 'utf-8'));
      } catch {
        // Silently skip if package.json doesn't exist
      }
    },
  };
};
