import { z } from 'zod';
import { type UIAnnotationDefinition } from '../types/ui-annotation-definition.type';

const annotationIdSchema = z.union([z.string(), z.number()]);

export const SelectorSchema = z.object({
  uri: z.string(),
  start: z.number(),
  end: z.number(),
  exact: z.string().optional(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
});

export type Selector = z.infer<typeof SelectorSchema>;

// TODO need to implement
export const Link = z.object({});

export type _EditorAnnotation = {
  id: string | number;
  label?: string;
  definition: UIAnnotationDefinition;
  metadata: any;
  selectors: Array<{ uri: string; start: number; end: number }>;
  parentId?: string;
  links: any[];
  parent?: EditorAnnotation;
};

export const editorAnnotationSchema: z.ZodType<_EditorAnnotation> = z
  .lazy(() =>
    z.object({
      id: annotationIdSchema,
      label: z.string().optional(),
      definition: z.custom<UIAnnotationDefinition>(),
      metadata: z.any(),
      // TODO this will not work for linked annotations!!!!
      selectors: z.array(SelectorSchema),
      parentId: z.string().optional(),
      links: z.array(Link).default([]),
      parent: editorAnnotationSchema.optional(),
    }),
  )
  .transform((d) => {
    const getSelector = (sourceUri: string) => {
      return d.selectors?.find((s) => s.uri === sourceUri);
    };
    const setSelector = (selector: Selector) => {
      const selectors =
        d.selectors?.filter((s) => s.uri !== selector.uri) ?? [];
      selectors.push(selector);

      return selector;
    };

    const clone = (annotation: Partial<EditorAnnotation>): EditorAnnotation => {
      return editorAnnotationSchema.parse({ ...d, ...annotation });
    };

    return {
      ...d,
      getSelector,
      setSelector,
      clone,
    };
  });

export type EditorAnnotation = z.infer<typeof editorAnnotationSchema>;
