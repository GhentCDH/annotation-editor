import { z } from 'zod';

export const annotationColumnDefinition = z.custom<any>();

export const annotationDefinition = z.object({
  id: z.string(),
  name: z.string(),
  // this will be used to determine the metadata schema
  columns: z.array(annotationColumnDefinition),
  json_schema: z.any().optional(),
  json_ld: z.any().optional(),
  ui_schema: z.any().optional(),
  metadata_schema: z.any().optional(),
  color: z.string(),
  type: z.string().optional(),
  icon: z.string().optional(),
  isRoot: z.boolean().default(true),
  allowedChildren: z.array(z.string()).default([]),
  allowedLinks: z.array(z.string()).default([]),
  context: z.custom<unknown>(),
  target: z.enum(['gutter', 'underline', 'highlight']).default('highlight'),
});

export type AnnotationDefinition = z.infer<typeof annotationDefinition>;
