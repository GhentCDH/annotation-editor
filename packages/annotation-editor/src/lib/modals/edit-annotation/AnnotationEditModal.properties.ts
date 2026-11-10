import type { ExtractPublicPropTypes, PropType } from 'vue';
import { type EditorAnnotation, type Selector } from '@ghentcdh/annotation-ui';
import { type SourceModel } from '@ghentcdh/annotation-core';

export const AnnotationEditModalProperties = {
  annotation: { type: Object as PropType<EditorAnnotation>, required: false },
  source: { type: Object as PropType<SourceModel>, required: true as const },
};

export type AnnotationEditModal = ExtractPublicPropTypes<
  typeof AnnotationEditModalProperties
>;

export type AnnotationEditModalEvent = {
  annotation: EditorAnnotation;
  rawData: unknown;
  selectors: Selector[];
};
export const AnnotationEditEmits = {
  close: (_event: AnnotationEditModalEvent | null) => true,
};

export type AnnotationEditModalShow = {
  source?: SourceModel;
  annotation?: EditorAnnotation;
  parentAnnotation?: EditorAnnotation;
};
