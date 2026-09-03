import { buildViewsFromColumns, type ViewConfig } from '@ghentcdh/crouton-core';
import { type AnnotationDefConfig } from './annotation.context-builder';
import { annotationContextBuilderFactory } from './context-builder.factory';
import {
  annotationResource,
  type AnnotationResource,
} from '../types/annotation-definition.type';
import {
  type AnnotationJsonConfig,
  AnnotationJsonResourceSchema,
} from '../types/annotation-json-config.types';

export type ContextBuilderFactory = (
  id: string,
  config: ViewConfig,
  annotationDefConfig: AnnotationDefConfig,
) => any;

export const buildAnnotationDefinition = (
  jsonConfig: AnnotationJsonConfig,
  annotationDefConfig: AnnotationDefConfig,
  factory: ContextBuilderFactory = annotationContextBuilderFactory,
): AnnotationResource => {
  const parsed = AnnotationJsonResourceSchema.safeParse(jsonConfig);

  if (!parsed.success) {
    throw new Error(parsed.error as any);
  }
  const json = parsed.data;
  const columns = json.columns;

  // const json_schema = hasColumns ? (context as any).toJsonSchema() : undefined;
  const views = columns?.length ? buildViewsFromColumns(columns) : undefined;
  const formConfig = views?.['form'];
  const context = formConfig
    ? factory(json.id, formConfig, annotationDefConfig)
    : undefined;
  const json_schema = formConfig?.json_schema;

  const baseUri = [
    annotationDefConfig.baseUrl,
    annotationDefConfig.crudController ?? 'annotations',
  ].join('/');
  // const operations: Record<string, unknown> = buildResourceOperations(
  //   definition,
  //   baseUri,
  // );
  const definition: AnnotationResource = annotationResource.parse({
    ...json,
    context,
    json_ld: context?.toJsonLdContext(),
    json_schema,
    views,
  });
  return definition;
};

export const buildAnnotationDefinitions = (
  configs: AnnotationJsonConfig[],
  annotationDefConfig: AnnotationDefConfig,
  factory?: ContextBuilderFactory,
): AnnotationResource[] => {
  return configs.map((config) =>
    buildAnnotationDefinition(config, annotationDefConfig, factory),
  );
};
