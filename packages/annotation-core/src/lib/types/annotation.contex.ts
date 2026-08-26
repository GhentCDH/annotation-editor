import { ContextBuilder } from '@ghentcdh/w3c-utils';
import {
  AnnotationJsonResourceSchema,
  type AnnotationJsonConfig,
} from './annotation-json-config.types';
import { z } from 'zod';

export const AnnotationMetadataType = 'AnnotationMetadata';

export type AnnotationContext = AnnotationJsonConfig & {
  context: ContextBuilder;
};

export const annotationContextSchema: z.ZodType<AnnotationContext> =
  AnnotationJsonResourceSchema.extend({
    context: z.instanceof(ContextBuilder),
  });