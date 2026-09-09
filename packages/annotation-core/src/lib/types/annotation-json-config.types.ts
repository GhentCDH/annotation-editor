import { z } from 'zod';
import {
  JsonOperationsSchema,
  labelFromId,
  ResourceJsonShape,
} from '@ghentcdh/crouton-core';
import { BASELINE_RESOURCE_VERSION } from './version';

const AnnotationTargetEnum = z.enum(['gutter', 'underline', 'highlight']);

export const AnnotationConfigSchema = z.object({
  color: z.string().optional(),
  type: z.string().optional(),
  icon: z.string().optional(),
  isRoot: z.boolean().optional().default(true),
  allowedChildren: z.array(z.string()).optional().default([]),
  allowedLinks: z.array(z.string()).optional().default([]),
  target: AnnotationTargetEnum.optional().default('highlight'),
});

export const AnnotationJsonResourceShape = ResourceJsonShape.extend({
  // schemaVersion: z.number().optional().default(BASELINE_RESOURCE_VERSION),
  operations: JsonOperationsSchema.optional().default(
    JsonOperationsSchema.parse({}),
  ),
  id: z.string(),
  // columns: z.array(JsonColumnSchema).optional().default([]),
  annotation: AnnotationConfigSchema.optional().default(
    AnnotationConfigSchema.parse({}),
  ),
});

export const AnnotationJsonResourceSchema = AnnotationJsonResourceShape
  // .superRefine(refineByKind)
  .transform((obj) => {
    const title = labelFromId(obj.name);
    const schemaVersion = obj.schemaVersion ?? BASELINE_RESOURCE_VERSION;

    return { schemaVersion, title, ...obj };
  });

export type AnnotationJsonResource = z.infer<
  typeof AnnotationJsonResourceSchema
>;
