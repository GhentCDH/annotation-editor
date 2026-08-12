import { type AnnotationDefConfig } from './annotation.context-builder';
import {
  buildMetadataSchema,
  buildUiSchema,
} from './annotation-schema.builder';
import { annotationContextBuilderFactory } from './context-builder.factory';
import {
  annotationDefinition,
  type AnnotationDefinition,
} from '../types/annotation-definition.type';
import {
  type AnnotationJsonConfig,
  AnnotationJsonResourceSchema,
} from '../types/annotation-json-config.types';

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

  const uiSchema =
    json.ui_schema ?? (hasColumns ? buildUiSchema(columns) : undefined);
  const metadataSchema =
    json.metadata_schema ??
    (hasColumns ? buildMetadataSchema(columns) : undefined);

  const definition: AnnotationDefinition = annotationDefinition.parse({
    ...json,
    isRoot: json.isRoot ?? true,
    context,
    json_ld: (context as any).toJsonLdContext(),
    json_schema: uiSchema ? (context as any).toJsonSchema() : null,
  });

  if (uiSchema) definition.ui_schema = uiSchema;
  if (metadataSchema) definition.metadata_schema = metadataSchema;
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
