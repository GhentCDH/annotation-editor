import { z } from 'zod';
import { ViewConfigSchema } from '@ghentcdh/crouton-core';
import { ContextBuilder } from '@ghentcdh/w3c-utils';
import {
  AnnotationJsonResourceSchema,
  type AnnotationJsonConfig,
} from './annotation-json-config.types';

const viewDefList = ['table', 'view', 'form'] as const;
export const ViewDefEnum = z.enum(viewDefList);
export type ViewDef = (typeof viewDefList)[number];

export const annotationColumnDefinition = z.custom<any>();

export type AnnotationDefinition = AnnotationJsonConfig & {
  json_ld?: any;
  context?: ContextBuilder;
  views?: Record<ViewDef, z.infer<typeof ViewConfigSchema>>;
};

export const annotationDefinition: z.ZodType<AnnotationDefinition> =
  AnnotationJsonResourceSchema.extend({
    json_ld: z.any().optional(),
    context: z.instanceof(ContextBuilder).optional(),
    views: z.record(ViewDefEnum, ViewConfigSchema).optional(),
  });