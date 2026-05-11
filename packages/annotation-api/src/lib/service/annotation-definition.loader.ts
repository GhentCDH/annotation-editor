import {
  type AnnotationJsonConfig,
  type AnnotationDefinition,
  type AnnotationDefConfig,
  type ContextBuilderFactory,
  buildAnnotationDefinition,
} from '@ghentcdh/annotation-core';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const loadAnnotationDefinitionsFromDir = (
  dirPath: string,
  annotationDefConfig: AnnotationDefConfig,
  contextBuilderFactory: ContextBuilderFactory,
): AnnotationDefinition[] => {
  if (!existsSync(dirPath)) return [];

  const entries = readdirSync(dirPath, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  const definitions: AnnotationDefinition[] = [];

  for (const dir of dirs) {
    const jsonFile = join(dirPath, dir, 'resource.json');
    if (!existsSync(jsonFile)) continue;

    const json: AnnotationJsonConfig = JSON.parse(
      readFileSync(jsonFile, 'utf-8'),
    );

    definitions.push(
      buildAnnotationDefinition(json, annotationDefConfig, contextBuilderFactory),
    );
  }

  return definitions;
};
