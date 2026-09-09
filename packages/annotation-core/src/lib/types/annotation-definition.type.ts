import { z } from 'zod';
import { ViewConfigSchema } from '@ghentcdh/crouton-core';
import { ContextBuilder } from '@ghentcdh/w3c-utils';
import {
  AnnotationConfigSchema,
  AnnotationJsonResourceShape,
} from './annotation-json-config.types';

const viewDefList = ['table', 'view', 'form'] as const;
export type ViewDef = (typeof viewDefList)[number];

export const annotationColumnDefinition = z.custom<any>();

export const AnnotationResourceSchema = AnnotationJsonResourceShape.pick({
  id: true,
  name: true,
  title: true,
  operations: true,
  annotation: true,
}).extend({
  annotation: AnnotationConfigSchema,
  context: z.instanceof(ContextBuilder).optional().nullish(),
  schemas: z
    .record(z.string(), ViewConfigSchema.partial())
    .optional()
    .nullish(),
});

export type AnnotationResource = z.infer<typeof AnnotationResourceSchema>;
