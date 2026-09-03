import { z } from 'zod';
import { ViewConfigSchema } from '@ghentcdh/crouton-core';
import { ContextBuilder } from '@ghentcdh/w3c-utils';
import {
  annotationConfig,
  AnnotationJsonResourceShape,
} from './annotation-json-config.types';

const viewDefList = ['table', 'view', 'form'] as const;
export const ViewDefEnum = z.enum(viewDefList);
export type ViewDef = (typeof viewDefList)[number];

export const annotationColumnDefinition = z.custom<any>();

export const annotationResource = AnnotationJsonResourceShape.pick({
  id: true,
  name: true,
  title: true,
  operations: true,
  annotation: true,
}).extend({
  annotation: annotationConfig,
  json_ld: z.any().optional(),
  context: z.instanceof(ContextBuilder).optional(),
  views: z.record(ViewDefEnum, ViewConfigSchema).optional(),
});

// export type AnnotationResource
export type AnnotationResource = z.infer<typeof annotationResource>;
