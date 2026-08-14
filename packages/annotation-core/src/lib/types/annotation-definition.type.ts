import { z, type ZodObject, type ZodRawShape } from 'zod';
import {
  AnnotationJsonResourceBaseSchema,
  JsonColumnTypeSchema,
} from './annotation-json-config.types';
import { buildViews, JsonColumnSchema } from '@ghentcdh/crouton-core';

const ColumnSchema = JsonColumnSchema.extend({
  type: JsonColumnTypeSchema.optional(),
});

const parseColumns = (columns: any[]) => {
  return columns.map((column) => {
    return ColumnSchema.parse(column);
    //{ ...ColumnSchema.safeParse(column), column };
  });
};
export const annotationColumnDefinition = z.custom<any>();

export const annotationDefinition = AnnotationJsonResourceBaseSchema.extend({
  json_schema: z.any().optional(),
  json_ld: z.any().optional(),
  context: z.custom<unknown>(),
}).transform((data) => {
  const jsonColumns = ColumnSchema.safeParse(data.columns);

  return {
    ...data,
    jsonColumns,
    views: data.json_schema
      ? buildViews(
          z.fromJSONSchema(data.json_schema) as ZodObject<ZodRawShape>,
          parseColumns(data.columns),
        )
      : undefined,
  };
});

export type AnnotationDefinition = z.infer<typeof annotationDefinition>;
