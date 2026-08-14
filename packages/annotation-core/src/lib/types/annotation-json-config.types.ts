import { JsonColumnSchema } from '@ghentcdh/crouton-core';
import { z } from 'zod';

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

export const JsonColumnTypeSchema = z.object({
  type: z.string(),
  properties: z.record(z.string(), z.object({ type: z.string() })).optional(),
});
export const AnnotationColumnConfigSchema = z.any();
export const ColumnSchema = JsonColumnSchema.extend({
  type: JsonColumnTypeSchema.optional(),
});

const AnnotationTargetEnum = z.enum(['gutter', 'underline', 'highlight']);
export const AnnotationJsonResourceBaseSchema = z.object({
  /**
   * URL of the generated JSON Schema, for editor autocomplete/validation. Declared so the
   * key is *allowed* (not stripped, and not flagged by the very schema it points at).
   * Ignored at runtime.
   */
  $schema: z.string().optional(),
  /**
   * resource.json shape version. Missing ⇒ baseline (see `./version`). Auto-migrated
   * toward `CURRENT_RESOURCE_VERSION` on load in the dev environment.
   */
  schemaVersion: z.number().int().positive().optional(),
  /** When `true`, the resource lives in the repo but is NOT loaded/served (work in progress). */
  draft: z.boolean().optional().default(false),
  id: z.string(),
  name: z.string(),
  color: z.string(),
  type: z.string().optional(),
  icon: z.string().optional(),
  isRoot: z.boolean().optional().default(true),
  allowedChildren: z.array(z.string()).optional().default([]),
  allowedLinks: z.array(z.string()).optional().default([]),
  columns: z.array(AnnotationColumnConfigSchema).optional().default([]),
  ui_schema: z.any().optional(),
  target: AnnotationTargetEnum.optional().default('highlight'),
});
export const AnnotationJsonResourceSchema =
  AnnotationJsonResourceBaseSchema.transform((data) => {
    const jsonColumns = data.columns.map((d) => ColumnSchema.safeParse(d));

    return {
      ...data,
      jsonColumns: [],
    };
  });

export type AnnotationJsonConfig = z.infer<typeof AnnotationJsonResourceSchema>;
