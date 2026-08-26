import { ContextBuilder } from '@ghentcdh/w3c-utils';
import { z } from 'zod';
import {
  AnnotationJsonResourceSchema,
  type AnnotationJsonConfig,
} from './annotation-json-config.types';

export const AnnotationMetadataType = 'AnnotationMetadata';

export type AnnotationContext = AnnotationJsonConfig & {
  context: ContextBuilder;
};

export const annotationContextSchema: z.ZodType<AnnotationContext> =
  AnnotationJsonResourceSchema.extend({
    context: z.instanceof(ContextBuilder),
  });