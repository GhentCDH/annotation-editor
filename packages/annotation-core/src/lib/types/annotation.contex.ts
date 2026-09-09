import { type AnnotationResource } from './annotation-definition.type';
import { type AnnotationStyle } from '../annotation.style';
import {
  type AnnotationDefConfig,
  baseContextBuilder,
} from '../utils/annotation.context-builder';

export const AnnotationMetadataType = 'AnnotationMetadata';

export type AnnotationContext = {
  id: string;
  styling: AnnotationStyle;
  prefix: string;
  jsonLd: string;
  hasContext: boolean;
  uri: string;
  safeParse: (data: unknown) => { data: boolean; success: boolean };
  toAnnotationBody: () => unknown;
};

export const createAnnotationContext = (
  annotationDefConfig: AnnotationDefConfig,
  resource: AnnotationResource,
): AnnotationContext => {
  const formView = resource.schemas?.['form'];

  const builder = baseContextBuilder(resource.id, annotationDefConfig);
  if (formView) {
    builder.parseJsonSchema(formView.json_schema);
  }

  return {
    id: resource.id,
    styling: {
      name: resource.name,
      id: resource.id,
      target: resource.annotation.target,
      color: resource.annotation.color,
    },
    hasContext: !!formView,
    prefix: buildPrefix(annotationDefConfig, resource),
    uri: (builder as any).uri,
    jsonLd: builder.toJsonLdContext(),
    safeParse: builder.safeParse.bind(builder),
    toAnnotationBody: builder.toAnnotationBody.bind(builder),
  } as unknown as AnnotationContext;
};

export const buildPrefix = (
  annotationDefConfig: AnnotationDefConfig,
  resource: AnnotationResource,
) => {
  return `${annotationDefConfig.prefix}:${resource.annotation.type}/`;
};
