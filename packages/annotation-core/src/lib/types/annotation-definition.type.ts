import { z } from 'zod';

import {
  type JsonResourceOperations,
  type ViewConfig,
  ViewConfigSchema,
} from '@ghentcdh/crouton-core';
import { type ContextBuilder } from '@ghentcdh/w3c-utils';

import {
  AnnotationConfigSchema,
  AnnotationJsonResourceShape,
} from './annotation-json-config.types';

export type ViewDef = 'table' | 'view' | 'form';

// Explicit type avoids TS2883 ("cannot be named without a reference to $ZodType")
// that arises from complex Zod v4 schema chains in .d.ts output.
export type AnnotationResource = {
  /** Same as `name` (crouton 0.1.0 dropped the separate root `id`). Set by {@link withResourceId}. */
  id: string;
  name: string;
  title?: string | null;
  operations: JsonResourceOperations;
  annotation: z.infer<typeof AnnotationConfigSchema>;
  context?: ContextBuilder | null;
  schemas?: Record<string, Partial<ViewConfig>> | null;
};

const { name, title, operations } = AnnotationJsonResourceShape.shape;
export const AnnotationResourceSchema: z.ZodType<AnnotationResource> = z.object({
  id: z.string(),
  name,
  title,
  operations,
  annotation: AnnotationConfigSchema,
  context: z.custom<ContextBuilder>(() => true).optional().nullish(),
  schemas: z
    .record(z.string(), ViewConfigSchema.partial())
    .optional()
    .nullish(),
}) as unknown as z.ZodType<AnnotationResource>;

/** Crouton resources carry no `id`; the annotation id is the resource `name`. */
export const withResourceId = <R extends { name: string }>(
  resource: R,
): R & { id: string } => ({ ...resource, id: resource.name });
