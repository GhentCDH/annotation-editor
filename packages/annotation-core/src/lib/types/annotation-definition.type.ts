import { z } from 'zod';
import {
  type JsonResourceOperations,
  type ViewConfig,
  ViewConfigSchema,
} from '@ghentcdh/crouton-core';
import { ContextBuilder } from '@ghentcdh/w3c-utils';
import { AnnotationJsonResourceShape } from './annotation-json-config.types';

const viewDefList = ['table', 'view', 'form'] as const;
export const ViewDefEnum = z.enum(viewDefList);
export type ViewDef = (typeof viewDefList)[number];

export const annotationColumnDefinition = z.custom<any>();

export type AnnotationResource = {
  id: string;
  name: string;
  title?: string;
  operations: JsonResourceOperations;
  annotation?: {
    color: string;
    type?: string;
    icon?: string;
    isRoot: boolean;
    allowedChildren: string[];
    allowedLinks: string[];
    target: 'gutter' | 'underline' | 'highlight';
  };
  json_ld?: any;
  context?: ContextBuilder;
  views?: Partial<Record<ViewDef, ViewConfig>>;
};

export const annotationResource: z.ZodType<AnnotationResource> =
  AnnotationJsonResourceShape.pick({
    id: true,
    name: true,
    title: true,
    operations: true,
    annotation: true,
  }).extend({
    json_ld: z.any().optional(),
    context: z.instanceof(ContextBuilder).optional(),
    views: z.record(ViewDefEnum, ViewConfigSchema).optional(),
  });
