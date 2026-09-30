import {
  type AnnotatedText,
  type CustomAnnotationStyle,
  type TextAdapter,
} from '@ghentcdh/annotated-text';
import {
  AnnotationResourceSchema,
  type SourceModel,
} from '@ghentcdh/annotation-core';
import { z } from 'zod';
import { resourceApi } from '@ghentcdh/crouton-vue';
import {
  type AnnotationEditorAnnotationAdapter,
  type EditorAnnotation,
} from '../adapter';

export type KeyLabel<KEY = string> = {
  key: KEY;
  label: string;
  icon?: string;
};

export const KeyLabelSchema = z.object<KeyLabel>();

export const UiAnnotionDefinitionSchema = AnnotationResourceSchema.extend({
  style: z.custom<CustomAnnotationStyle>().optional(),
  allowedChildren: z.array(KeyLabelSchema).optional().default([]),
  allowedLinks: z.array(KeyLabelSchema).optional().default([]),
}).transform((def) => {
  return {
    ...def,
    label: def.name,
    canEdit: !!def.operations.patch,
    canDelete: !!def.operations.delete,
    canCreate: !!def.operations.create,
    resource: resourceApi(def, {}),
  };
});

export type UIAnnotationDefinition = z.infer<typeof UiAnnotionDefinitionSchema>;

export type AllowedChildrenPerType = Record<string, Array<KeyLabel>>;

export type UiAnnotatedText = {
  annotatedText: AnnotatedText<EditorAnnotation>;
  textAdapter: TextAdapter;
  annotationAdapter: AnnotationEditorAnnotationAdapter;
};
export type UIAnnotationConfiguration = {
  definitions: UIAnnotationDefinition[];
  getDefinition: (id: string) => UIAnnotationDefinition | undefined;
  rootTypes: Array<KeyLabel>;
  allowedChildrenPerType: AllowedChildrenPerType;
  createAnnotatedText: (
    id: string,
    sourceModel?: SourceModel,
  ) => UiAnnotatedText;
};
