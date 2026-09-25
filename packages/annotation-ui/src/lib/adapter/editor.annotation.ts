import { z } from 'zod';
import { type UIAnnotationDefinition } from '@ghentcdh/annotation-ui';

const annotationIdSchema = z.union([z.string(), z.number()]);

export const Selector = z.object({
  uri: z.string(),
  start: z.number(),
  end: z.number(),
});

// TODO need to implement
export const Link = z.object({});

export const editorAnnotationSchema = z.object().extend({
  id: annotationIdSchema,
  label: z.string().optional(),
  definition: z.custom<UIAnnotationDefinition>(),
  metadata: z.any(),
  // TODO this will not work for linked annotations!!!!
  // TODO what if we have
  selectors: z.array(Selector),
  parentId: z.string().optional(),
  links: z.array(Link).default([]),
});

export type EditorAnnotation = z.infer<typeof editorAnnotationSchema>;
