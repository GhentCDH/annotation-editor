import { z } from 'zod';
import {
  AnnotationJsonResourceBaseSchema,
  ColumnSchema,
} from './annotation-json-config.types';

export const annotationColumnDefinition = z.custom<any>();

export const annotationDefinition = AnnotationJsonResourceBaseSchema.extend({
  json_schema: z.any().optional(),
  json_ld: z.any().optional(),
  ui_schema: z.any().optional(),
  context: z.custom<unknown>(),
}).transform((data) => {
  const jsonColumns = ColumnSchema.safeParse(data.columns);

  return {
    ...data,
    jsonColumns,
  };
});

export type AnnotationDefinition = z.infer<typeof annotationDefinition>;
