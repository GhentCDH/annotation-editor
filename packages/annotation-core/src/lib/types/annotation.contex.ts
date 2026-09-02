import { type ContextBuilder } from '@ghentcdh/w3c-utils';
import { type AnnotationJsonConfig } from './annotation-json-config.types';

export const AnnotationMetadataType = 'AnnotationMetadata';

export type AnnotationContext = AnnotationJsonConfig & {
  context: ContextBuilder;
};
