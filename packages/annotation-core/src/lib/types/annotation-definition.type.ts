import { z } from 'zod';
import { JsonColumnSchema, ViewConfigSchema } from '@ghentcdh/crouton-core';
import {
  AnnotationJsonResourceBaseSchema,
  JsonColumnTypeSchema,
} from './annotation-json-config.types';

const viewDefList = ['table', 'view', 'form'] as const;
export const ViewDefEnum = z.enum(viewDefList);
export type ViewDef = (typeof viewDefList)[number];

export const AnnotationColumnSchema = JsonColumnSchema.extend({
  type: JsonColumnTypeSchema.optional(),
});

export const annotationColumnDefinition = z.custom<any>();

export const annotationDefinition = AnnotationJsonResourceBaseSchema.extend({
  json_ld: z.any().optional(),
  context: z.custom<unknown>(),
  views: z.record(ViewDefEnum, ViewConfigSchema).optional(),
});

export type AnnotationDefinition = z.infer<typeof annotationDefinition>;
