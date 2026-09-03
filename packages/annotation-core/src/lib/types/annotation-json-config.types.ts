import { z } from 'zod';
import {
  JsonColumnSchema,
  JsonOperationsSchema,
  labelFromId,
  ResourceJsonShape,
} from '@ghentcdh/crouton-core';
import { BASELINE_RESOURCE_VERSION } from './version';

export type AnnotationColumnFieldInput = {
  type: 'autocomplete' | 'text' | 'select';
  position?: number;
  options: {
    uri?: string;
    resource?: string;
    valueKey?: string;
    labelKey?: string;
    enableCreate?: boolean | string;
    colspan?: number;
    clearable?: boolean;
    storeValue?: boolean;
    emitObject?: boolean;
    values?: { value: string; label: string }[];
  };
};

export type AnnotationColumnConfig = {
  id: string;
  label: string;
  required?: boolean;
  hiddenInMetadata?: boolean;
  hiddenInForm?: boolean;
  displayKey?: string;
  type?: {
    type: string;
    properties?: Record<string, { type: string }>;
  };
  fieldInput?: AnnotationColumnFieldInput;
};
const AnnotationTargetEnum = z.enum(['gutter', 'underline', 'highlight']);

export const annotationConfig = z.object({
  color: z.string(),
  type: z.string().optional(),
  icon: z.string().optional(),
  isRoot: z.boolean().optional().default(true),
  allowedChildren: z.array(z.string()).optional().default([]),
  allowedLinks: z.array(z.string()).optional().default([]),
  target: AnnotationTargetEnum.optional().default('highlight'),
});

export const AnnotationJsonResourceShape = ResourceJsonShape.pick({
  $schema: true,
  schemaVersion: true,
  draft: true,
  title: true,
  name: true,
}).extend({
  operations: JsonOperationsSchema.optional().default(
    JsonOperationsSchema.parse({}),
  ),
  id: z.string(),
  // @deprecated
  color: z.string().optional(),
  // @deprecated
  type: z.string().optional(),
  // @deprecated
  icon: z.string().optional(),
  // @deprecated
  isRoot: z.boolean().optional().default(true),
  // @deprecated
  allowedChildren: z.array(z.string()).optional().default([]),
  // @deprecated
  allowedLinks: z.array(z.string()).optional().default([]),
  // @deprecated
  target: AnnotationTargetEnum.optional().default('highlight'),

  columns: z.array(JsonColumnSchema).optional().default([]),
  annotation: annotationConfig.optional(),
});

export const AnnotationJsonResourceSchema = AnnotationJsonResourceShape
  // .superRefine(refineByKind)
  .transform((obj) => {
    const title = labelFromId(obj.name);
    const schemaVersion = obj.schemaVersion ?? BASELINE_RESOURCE_VERSION;

    const config = {
      ...obj,
      ...(obj.annotation ?? {}),
    };

    return {
      title,
      ...obj,
      schemaVersion,
      annotation: annotationConfig.parse(config),
    };
  });

export type AnnotationJsonConfig = z.infer<typeof AnnotationJsonResourceSchema>;
