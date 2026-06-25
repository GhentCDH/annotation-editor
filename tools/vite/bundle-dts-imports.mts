import * as fs from 'fs';
import * as path from 'path';

/**
 * Vite plugin that post-processes .d.ts output to bundle type declarations
 * from private workspace packages. Copies the built types from each package
 * into a `_bundled/` subdirectory and rewrites import paths to reference
 * them locally instead of via package names.
 *
 * Requires the bundled packages to be built first (use NX dependsOn).
 */
export function bundleDtsImports(
  outDir: string,
  packages: string[],
  dirname: string
) {
  return {
    name: 'bundle-dts-imports',
    closeBundle: {
      order: 'post' as const,
      handler() {
        const absOutDir = path.resolve(dirname, outDir);

        for (const pkg of packages) {
          const pkgName = pkg.split('/').pop()!;
          const srcDtsDir = path.resolve(dirname, `../../dist/packages/${pkgName}`);

          if (!fs.existsSync(srcDtsDir)) continue;

          const destDir = path.join(absOutDir, '_bundled', pkgName);
          fs.mkdirSync(destDir, { recursive: true });
          copyDtsFiles(srcDtsDir, destDir);
        }

        rewriteDtsImports(absOutDir, absOutDir, packages);
      },
    },
  };
}

function copyDtsFiles(src: string, dest: string) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDtsFiles(srcPath, destPath);
    } else if (
      entry.name.endsWith('.d.ts') ||
      entry.name.endsWith('.d.ts.map')
    ) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function rewriteDtsImports(
  dir: string,
  rootDir: string,
  packages: string[]
) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rewriteDtsImports(fullPath, rootDir, packages);
    } else if (entry.name.endsWith('.d.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      for (const pkg of packages) {
        const pkgName = pkg.split('/').pop()!;
        const bundledDir = path.join(rootDir, '_bundled', pkgName);

        if (!fs.existsSync(bundledDir)) continue;

        const relativePath = path
          .relative(dir, path.join(bundledDir, 'index'))
          .replace(/\\/g, '/');
        const prefix = relativePath.startsWith('.') ? '' : './';

        const escaped = pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(['"])${escaped}(['"])`, 'g');

        if (regex.test(content)) {
          content = content.replace(regex, `$1${prefix}${relativePath}$2`);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}
