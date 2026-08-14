import { buildViews } from '@ghentcdh/crouton-core';
import { z, type ZodObject, type ZodRawShape } from 'zod';
import { type AnnotationDefConfig } from './annotation.context-builder';
import { annotationContextBuilderFactory } from './context-builder.factory';
import {
  AnnotationColumnSchema,
  annotationDefinition,
  type AnnotationDefinition,
} from '../types/annotation-definition.type';
import {
  type AnnotationJsonConfig,
  AnnotationJsonResourceSchema,
} from '../types/annotation-json-config.types';

const parseColumns = (columns: any[]) => {
  return columns.map((column) => {
    return AnnotationColumnSchema.parse(column);
    //{ ...ColumnSchema.safeParse(column), column };
  });
};
export type ContextBuilderFactory = (
  id: string,
  config: AnnotationJsonConfig,
  annotationDefConfig: AnnotationDefConfig,
) => unknown;

export const buildAnnotationDefinition = (
  jsonConfig: AnnotationJsonConfig,
  annotationDefConfig: AnnotationDefConfig,
  factory: ContextBuilderFactory = annotationContextBuilderFactory,
): AnnotationDefinition => {
  const parsed = AnnotationJsonResourceSchema.safeParse(jsonConfig);

  if (!parsed.success) {
    throw new Error(parsed.error as any);
  }
  const json = parsed.data;
  const context = factory(json.id, json, annotationDefConfig);
  const columns = json.columns ?? [];
  const hasColumns = columns.length > 0;

  const json_schema = hasColumns ? (context as any).toJsonSchema() : undefined;

  const definition: AnnotationDefinition = annotationDefinition.parse({
    ...json,
    isRoot: json.isRoot ?? true,
    context,
    json_ld: (context as any).toJsonLdContext(),
    json_schema,
    views: json_schema
      ? buildViews(
          z.fromJSONSchema(json_schema) as ZodObject<ZodRawShape>,
          parseColumns(columns),
        )
      : undefined,
  });

  if (json.type) definition.type = json.type;
  if (json.icon) definition.icon = json.icon;

  return definition;
};

export const buildAnnotationDefinitions = (
  configs: AnnotationJsonConfig[],
  annotationDefConfig: AnnotationDefConfig,
  factory?: ContextBuilderFactory,
): AnnotationDefinition[] =>
  configs.map((config) =>
    buildAnnotationDefinition(config, annotationDefConfig, factory),
  );
