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
        const pkg = JSON.parse(readFileSync(src, 'utf-8'));

        // Strip workspace-only (private/unpublished) deps so consumers don't get 404s.
        // These packages are bundled into the output by vite's alias resolution.
        for (const field of ['dependencies', 'devDependencies', 'peerDependencies'] as const) {
          if (!pkg[field]) continue;
          pkg[field] = Object.fromEntries(
            Object.entries(pkg[field] as Record<string, string>).filter(
              ([, v]) => !v.startsWith('workspace:'),
            ),
          );
          if (Object.keys(pkg[field]).length === 0) delete pkg[field];
        }

        writeFileSync(dest, JSON.stringify(pkg, null, 2) + '\n');
      } catch {
        // Silently skip if package.json doesn't exist
      }
    },
  };
};
