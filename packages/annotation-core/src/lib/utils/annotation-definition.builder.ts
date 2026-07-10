import { type AnnotationDefConfig } from './annotation.context-builder';
import { buildUiSchema, buildMetadataSchema } from './annotation-schema.builder';
import { annotationContextBuilderFactory } from './context-builder.factory';
import { type AnnotationDefinition } from '../types/annotation-definition.type';
import { type AnnotationJsonConfig } from '../types/annotation-json-config.types';

export type ContextBuilderFactory = (
  id: string,
  config: AnnotationJsonConfig,
  annotationDefConfig: AnnotationDefConfig,
) => unknown;

export const buildAnnotationDefinition = (
  json: AnnotationJsonConfig,
  annotationDefConfig: AnnotationDefConfig,
  factory: ContextBuilderFactory = annotationContextBuilderFactory,
): AnnotationDefinition => {
  const context = factory(json.id, json, annotationDefConfig);
  const columns = json.columns ?? [];
  const hasColumns = columns.length > 0;

  const uiSchema =
    json.ui_schema ?? (hasColumns ? buildUiSchema(columns) : undefined);
  const metadataSchema =
    json.metadata_schema ??
    (hasColumns ? buildMetadataSchema(columns) : undefined);

  const definition: AnnotationDefinition = {
    id: json.id,
    name: json.name,
    color: json.color,
    isRoot: json.isRoot ?? true,
    columns: columns as unknown as AnnotationDefinition['columns'],
    context,
    json_ld: (context as any).toJsonLdContext(),
    json_schema: uiSchema ? (context as any).toJsonSchema() : null,
    allowedChildren: json.allowedChildren ?? [],
    allowedLinks: json.allowedLinks ?? [],
    target: json.target ?? 'highlight',
  };

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
