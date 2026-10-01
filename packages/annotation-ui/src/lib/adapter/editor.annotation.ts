import { z } from 'zod';

const annotationIdSchema = z.union([z.string(), z.number()]);
export type AnnotationId = z.infer<typeof annotationIdSchema>;
export const SelectorSchema = z.object({
  uri: z.string(),
  start: z.number(),
  end: z.number(),
  exact: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
});

export type Selector = z.infer<typeof SelectorSchema>;

export const LinkSchema = z.object({ uri: z.string() });
export type AnnotationLink = z.infer<typeof LinkSchema>;

export type _EditorAnnotation = {
  id: AnnotationId;
  label?: string;
  definitionUri: string;
  metadata: any;
  selectors: Array<{ uri: string; start: number; end: number }>;
  parentId?: AnnotationId;
  links: any[];
};

export const editorAnnotationSchema: z.ZodType<_EditorAnnotation> = z
  .lazy(() =>
    z.object({
      id: annotationIdSchema,
      label: z.string().optional(),
      metadata: z.any(),
      selectors: z.array(SelectorSchema),
      links: z.array(LinkSchema).default([]),
      parentId: annotationIdSchema.optional(),
      definitionUri: z.string().optional(),
    }),
  )
  .transform((d) => {
    const getSelector = (sourceUri: string) => {
      return d.selectors?.find((s) => s.uri === sourceUri);
    };
    const setSelector = (selector: Selector) => {
      const idx = d.selectors.findIndex((s) => s.uri === selector.uri);
      if (idx >= 0) {
        d.selectors.splice(idx, 1, selector);
      } else {
        d.selectors.push(selector);
      }

      return this;
    };

    const clone = (annotation: Partial<EditorAnnotation>): EditorAnnotation => {
      return editorAnnotationSchema.parse({ ...d, ...annotation });
    };

    return {
      ...d,
      definitionUri: d.definitionUri ?? d.definition?.id,
      getSelector,
      setSelector,
      clone,
    };
  });

export type EditorAnnotation = z.infer<typeof editorAnnotationSchema>;
