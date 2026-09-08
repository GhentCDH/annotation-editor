import { z } from 'zod';
import { ViewConfigSchema } from '@ghentcdh/crouton-core';
import { ContextBuilder } from '@ghentcdh/w3c-utils';
import {
  AnnotationConfigSchema,
  AnnotationJsonResourceShape,
} from './annotation-json-config.types';

const viewDefList = ['table', 'view', 'form'] as const;
export const ViewDefEnum = z.enum(viewDefList);
export type ViewDef = (typeof viewDefList)[number];

export const annotationColumnDefinition = z.custom<any>();

const _annotationResource = AnnotationJsonResourceShape.pick({
  id: true,
  name: true,
  title: true,
  operations: true,
  annotation: true,
}).extend({
  annotation: AnnotationConfigSchema,
  context: z.instanceof(ContextBuilder).optional(),
  views: z.record(ViewDefEnum, ViewConfigSchema).optional(),
});

export type AnnotationResource = z.infer<typeof _annotationResource>;
export const annotationResource: z.ZodType<AnnotationResource> =
  _annotationResource;
