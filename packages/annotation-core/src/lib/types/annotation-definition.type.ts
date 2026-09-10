import { z } from 'zod';
import { type JsonResourceOperations, type ViewConfig, ViewConfigSchema } from '@ghentcdh/crouton-core';
import { ContextBuilder } from '@ghentcdh/w3c-utils';
import {
  AnnotationConfigSchema,
  AnnotationJsonResourceShape,
} from './annotation-json-config.types';

const viewDefList = ['table', 'view', 'form'] as const;
export type ViewDef = (typeof viewDefList)[number];

export const annotationColumnDefinition = z.custom<any>();

// Explicit type avoids TS2883 ("cannot be named without a reference to $ZodType")
// that arises from complex Zod v4 schema chains in .d.ts output.
export type AnnotationResource = {
  id: string;
  name: string;
  title?: string | null;
  operations: JsonResourceOperations;
  annotation: z.infer<typeof AnnotationConfigSchema>;
  context?: ContextBuilder | null;
  schemas?: Record<string, Partial<ViewConfig>> | null;
};

export const AnnotationResourceSchema: z.ZodType<AnnotationResource> =
  AnnotationJsonResourceShape.pick({
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
  }) as z.ZodType<AnnotationResource>;