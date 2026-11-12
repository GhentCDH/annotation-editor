import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const IMPORT_RE = /(?:from\s+|import\()['"]([^'"]+)['"]/g;

/**
 * Fails the build when an emitted declaration file imports a relative path
 * that was not emitted, or still imports one of the `forbidden` (private,
 * unpublished) packages. Use as vite-plugin-dts `afterBuild`.
 */
export const checkDtsImports =
  (forbidden: string[]) => (emittedFiles: Map<string, string>) => {
    const emitted = new Set([...emittedFiles.keys()].map((f) => resolve(f)));
    const exists = (base: string) =>
      [`${base}.d.ts`, `${base}/index.d.ts`].some(
        (f) => emitted.has(f) || existsSync(f),
      );

    const problems: string[] = [];
    for (const [file, content] of emittedFiles) {
      if (!file.endsWith('.d.ts')) continue;
      for (const [, specifier] of content.matchAll(IMPORT_RE)) {
        if (specifier.startsWith('.')) {
          if (!exists(resolve(dirname(file), specifier))) {
            problems.push(`${file}: missing '${specifier}'`);
          }
        } else if (
          forbidden.some(
            (p) => specifier === p || specifier.startsWith(`${p}/`),
          )
        ) {
          problems.push(`${file}: imports private package '${specifier}'`);
        }
      }
    }

    if (problems.length) {
      throw new Error(
        `Published declarations have broken imports:\n${problems.join('\n')}`,
      );
    }
  };
