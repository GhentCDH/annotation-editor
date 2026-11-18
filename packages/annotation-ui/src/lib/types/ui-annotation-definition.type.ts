import {
  type AnnotatedText,
  type CustomAnnotationStyle,
  type TextAdapter,
} from '@ghentcdh/annotated-text';
import { type ResourceDefinition } from '@ghentcdh/crouton-core';
import {
  type AnnotationResource,
  AnnotationResourceSchema,
} from '@ghentcdh/annotation-core';
import { z } from 'zod';
import { resourceApi } from '@ghentcdh/crouton-vue';
import {
  type AnnotationEditorAnnotationAdapter,
  type EditorAnnotation,
} from '../adapter';

export const KeyLabelSchema = z.object({
  key: z.string(),
  label: z.string(),
  icon: z.string().optional(),
});
export type KeyLabel = z.infer<typeof KeyLabelSchema>;

export type UIAnnotationDefinition = AnnotationResource & {
  style?: CustomAnnotationStyle;
  allowedChildren: KeyLabel[];
  allowedLinks: KeyLabel[];
  label: string;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  resource: ReturnType<typeof resourceApi>;
  color?: string;
  target?: string;
  views?: Record<string, unknown> | null;
  _core?: AnnotationResource;
};

// Cast to ZodObject locally so .extend() is available; AnnotationResourceSchema is
// typed as ZodType<AnnotationResource> in annotation-core to avoid TS2883 in .d.ts output.
const baseSchema =
  AnnotationResourceSchema as unknown as z.ZodObject<z.ZodRawShape>;

export const UiAnnotionDefinitionSchema: z.ZodType<UIAnnotationDefinition> =
  baseSchema
    .extend({
      style: z.custom<CustomAnnotationStyle>().optional(),
      allowedChildren: z.array(KeyLabelSchema).optional().default([]),
      allowedLinks: z.array(KeyLabelSchema).optional().default([]),
    })
    .transform((def) => {
      const d = def as AnnotationResource;
      return {
        ...d,
        label: d.name,
        canEdit: !!d.operations?.patch,
        canDelete: !!d.operations?.delete,
        canCreate: !!d.operations?.create,
        resource: resourceApi(
          {
            id: d.id,
            operations: d.operations,
            idField: 'id',
          } as unknown as Pick<
            ResourceDefinition,
            'id' | 'operations' | 'idField'
          >,
          {},
        ),
      };
    }) as unknown as z.ZodType<UIAnnotationDefinition>;

export type UiAnnotatedText = {
  annotatedText: AnnotatedText<EditorAnnotation>;
  textAdapter: TextAdapter;
  annotationAdapter: AnnotationEditorAnnotationAdapter;
};

export type DefinitionMap = Record<string, UIAnnotationDefinition>;
