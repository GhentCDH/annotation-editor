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

export type EditorAnnotation = {
  id: string | number;
  label?: string;
  definition: UIAnnotationDefinition;
  metadata: any;
  selectors: Array<{ uri: string; start: number; end: number }>;
  parentId?: string;
  links: any[];
  parent?: EditorAnnotation;
};

export const editorAnnotationSchema: z.ZodType<EditorAnnotation> = z
  .lazy(() =>
    z.object({
      id: annotationIdSchema,
      label: z.string().optional(),
      definition: z.custom<UIAnnotationDefinition>(),
      metadata: z.any(),
      // TODO this will not work for linked annotations!!!!
      selectors: z.array(Selector),
      parentId: z.string().optional(),
      links: z.array(Link).default([]),
      parent: editorAnnotationSchema.optional(),
    }),
  )
  .transform((d) => {
    const getSelector = (sourceUri: string) => {
      return d.selectors?.find((s) => s.uri === sourceUri);
    };

    return {
      ...d,
      getSelector,
    };
  });
