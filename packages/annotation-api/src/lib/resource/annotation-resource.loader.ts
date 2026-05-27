import {
  type AnnotationResourceDefinition,
  type AnnotationResourceJsonConfig,
  resolveConfig,
  type AnnotationDefConfig,
} from '@ghentcdh/annotation-core';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const loadAnnotationResourcesFromDir = (
  dirPath: string,
  config: AnnotationDefConfig,
): AnnotationResourceDefinition[] => {
  const resourceDir = join(dirPath, '_resource');
  if (!existsSync(resourceDir)) return [];

  const files = readdirSync(resourceDir).filter((f) => f.endsWith('.json'));
  const { prefix } = resolveConfig(config);

  return files.map((file) => {
    const json: AnnotationResourceJsonConfig = JSON.parse(
      readFileSync(join(resourceDir, file), 'utf-8'),
    );
    const idCol = json.columns.find((c) => c.displayAs === 'id');
    const labelCol = json.columns.find((c) => c.displayAs === 'label');

    return {
      type: json.type,
      table: json.table,
      database: json.database,
      field: {
        id: idCol?.column ?? 'id',
        label: labelCol?.column ?? 'name',
      },
      prefix: `${prefix}:${json.type}/`,
    };
  });
};
