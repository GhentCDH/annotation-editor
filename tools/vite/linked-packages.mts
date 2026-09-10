/**
 * Reads pnpm-workspace.yaml overrides to find packages linked via `link:`.
 * Returns config for Vite's `optimizeDeps.exclude` and `server.watch`
 * so rebuilds of linked packages are picked up without cache clearing.
 *
 * Usage in vite.config:
 *   import { linkedPackagesConfig } from '../../tools/vite/linked-packages.mts';
 *   const linked = linkedPackagesConfig(import.meta.dirname);
 *
 *   export default defineConfig({
 *     optimizeDeps: { exclude: linked.exclude },
 *     server: { ...linked.server },
 *   });
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type LinkedConfig = {
  /** Package names to exclude from Vite's dependency pre-bundling */
  exclude: string[];
  /** Resolved absolute paths of linked package directories */
  dirs: string[];
  /** Server config to merge into Vite's `server` option */
  server: {
    watch: { followSymlinks: true };
    fs: { allow: string[] };
  };
};

export const linkedPackagesConfig = (workspaceRoot: string): LinkedConfig => {
  const wsFile = resolve(workspaceRoot, 'pnpm-workspace.yaml');

  let content: string;
  try {
    content = readFileSync(wsFile, 'utf-8');
  } catch {
    return {
      exclude: [],
      dirs: [],
      server: { watch: { followSymlinks: true }, fs: { allow: [] } },
    };
  }

  // Parse overrides with link: directives (simple yaml parsing, no dep needed)
  const overrides = new Map<string, string>();
  let inOverrides = false;

  for (const line of content.split('\n')) {
    const trimmed = line.trim();

    if (trimmed === 'overrides:') {
      inOverrides = true;
      continue;
    }

    // Stop at next top-level key
    if (inOverrides && !line.startsWith(' ') && !line.startsWith('\t') && trimmed.length > 0) {
      inOverrides = false;
    }

    if (!inOverrides) continue;

    // Match: 'package-name': link:path or "package-name": link:path
    const match = trimmed.match(
      /^['"]?(@?[^'":\s]+)['"]?\s*:\s*link:(.+)$/,
    );
    if (match) {
      overrides.set(match[1], match[2]);
    }
  }

  const exclude = [...overrides.keys()];
  const dirs = [...overrides.values()].map((p) =>
    resolve(workspaceRoot, p),
  );

  // Deduplicate parent dirs for fs.allow
  const parentDirs = [...new Set(dirs.map((d) => resolve(d, '..')))];

  return {
    exclude,
    dirs,
    server: {
      watch: { followSymlinks: true },
      fs: { allow: [workspaceRoot, ...parentDirs] },
    },
  };
};
