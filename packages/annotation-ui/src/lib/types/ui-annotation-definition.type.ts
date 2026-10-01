import {
  type AnnotatedText,
  type CustomAnnotationStyle,
  type TextAdapter,
} from '@ghentcdh/annotated-text';
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
    .transform((def: any) => {
      return {
        ...def,
        label: def.name,
        canEdit: !!def.operations?.patch,
        canDelete: !!def.operations?.delete,
        canCreate: !!def.operations?.create,
        resource: resourceApi({ idField: 'id', ...def } as any, {}),
      };
    }) as unknown as z.ZodType<UIAnnotationDefinition>;

export type UiAnnotatedText = {
  annotatedText: AnnotatedText<EditorAnnotation>;
  textAdapter: TextAdapter;
  annotationAdapter: AnnotationEditorAnnotationAdapter;
};

export type DefinitionMap = Record<string, UIAnnotationDefinition>;
