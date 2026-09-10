// Generate resource.schema.json from AnnotationJsonResourceShape. Run after vite build
// (closeBundle hook in vite.config.mts) so it imports the freshly built ESM in ./dist.
// Writes two copies:
//   - dist/resource.schema.json                → shipped in the npm package
//   - src/lib/types/resource.schema.json       → committed copy, for drift detection in CI
import { z } from 'zod';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, '..');
// Vite outputs to {workspaceRoot}/dist/packages/annotation-core (two levels up from pkgRoot)
const distDir = join(
  pkgRoot,
  '..',
  '..',
  'dist',
  'packages',
  'annotation-core',
);

const { CURRENT_RESOURCE_VERSION, AnnotationJsonResourceShape } = await import(
  join(distDir, 'index.js')
);

const schema = z.toJSONSchema(AnnotationJsonResourceShape, {
  target: 'draft-7',
  io: 'input',
  unrepresentable: 'any',
});
schema.$id = `https://ghentcdh.github.io/annotation-editor/schema/v${CURRENT_RESOURCE_VERSION}/resource.schema.json`;
schema.title = 'Annotation resource.json';
schema.description = `Generated from AnnotationJsonResourceShape (annotation-core). Do not edit by hand. schemaVersion ${CURRENT_RESOURCE_VERSION}.`;

const out = `${JSON.stringify(schema, null, 2)}\n`;
const versionedName = `resource.schema.v${CURRENT_RESOURCE_VERSION}.json`;

const committedDir = join(pkgRoot, 'src', 'lib', 'types');
mkdirSync(distDir, { recursive: true });
mkdirSync(committedDir, { recursive: true });

for (const dir of [distDir, committedDir]) {
  writeFileSync(join(dir, 'resource.schema.json'), out);
  writeFileSync(join(dir, versionedName), out);
}
/* eslint-disable no-console */
console.info(`[annotation-core] wrote resource.schema.json + ${versionedName}`);
