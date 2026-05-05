import { z } from 'zod';

export const annotationColumnDefinition = z.object({});

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
  context: z.custom<unknown>(),
  target: z.enum(['gutter', 'underline', 'highlight']).optional(),
});

export type AnnotationDefinition = z.infer<typeof annotationDefinition>;
