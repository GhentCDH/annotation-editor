import { type AnnotationResource } from './annotation-definition.type';
import { type AnnotationStyle } from '../annotation.style';
import {
  type AnnotationDefConfig,
  baseContextBuilder,
} from '../utils/annotation.context-builder';

export const AnnotationMetadataType = 'AnnotationMetadata';

export type AnnotationContextWithContext = {
  id: string;
  styling: AnnotationStyle;
  hasContext: true;
  uri: string;
  safeParse: (data: unknown) => { data: boolean; success: boolean };
  toAnnotationBody: () => unknown;
};
export type AnnotationContextNoContext = {
  id: string;
  styling: AnnotationStyle;
  hasContext: false;
};

export type AnnotationContext =
  AnnotationContextWithContext | AnnotationContextNoContext;

export const createAnnotationContext: AnnotationContext = (
  annotationDefConfig: AnnotationDefConfig,
  resource: AnnotationResource,
): AnnotationContext => {
  const formView = resource.views?.form;
  let context = {};
  if (formView) {
    const builder = baseContextBuilder(resource.id, annotationDefConfig);
    builder.parseJsonSchema(formView.json_schema);
    context = {
      uri: builder.uri,
      safeParse: builder.safeParse.bind(builder),
      toAnnotationBody: builder.toAnnotationBody.bind(builder),
    };
  }

  return {
    ...context,
    id: resource.id,
    styling: {
      name: resource.name,
      id: resource.id,
      target: resource.annotation.target,
      color: resource.annotation.color,
    },
    hasContext: !!formView,
  } as unknown as AnnotationContext;
};
