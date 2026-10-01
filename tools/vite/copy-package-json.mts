/**
 * Vite plugin that copies the project's package.json to the build output directory.
 *
 * Replaces the asset-copying functionality previously provided by the
 * deprecated `nxCopyAssetsPlugin()`.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import type { Plugin } from 'vite';

const findPrivatePackageNames = (workspaceRoot: string): Set<string> => {
  const names = new Set<string>();
  const packagesDir = join(workspaceRoot, 'packages');
  try {
    for (const entry of readdirSync(packagesDir)) {
      const pkgPath = join(packagesDir, entry, 'package.json');
      try {
        if (!statSync(pkgPath).isFile()) continue;
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        if (pkg.private && pkg.name) names.add(pkg.name);
      } catch {
        // skip unreadable entries
      }
    }
  } catch {
    // skip if packages dir doesn't exist
  }
  return names;
};

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

        // Collect all private workspace package names so we can strip them from
        // the published deps — they're bundled via vite alias and not on npm.
        const workspaceRoot = resolve(root, '../..');
        const privateNames = findPrivatePackageNames(workspaceRoot);

        for (const field of ['dependencies', 'devDependencies', 'peerDependencies'] as const) {
          if (!pkg[field]) continue;
          pkg[field] = Object.fromEntries(
            Object.entries(pkg[field] as Record<string, string>).filter(
              ([name, version]) =>
                !version.startsWith('workspace:') && !privateNames.has(name),
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
