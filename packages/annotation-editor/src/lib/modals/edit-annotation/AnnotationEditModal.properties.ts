import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
  AnnotationDefinition,
  EditorAnnotation,
  Selector,
  SourceModel,
} from '@ghentcdh/annotation-ui';

export const AnnotationEditModalProperties = {
  annotation: { type: Object as PropType<EditorAnnotation>, required: false },
  source: { type: Object as PropType<SourceModel>, required: true as const },
};

export type AnnotationEditModal = ExtractPublicPropTypes<
  typeof AnnotationEditModalProperties
>;

export type AnnotationEditModalEvent = {
  annotation: EditorAnnotation;
  rawData: any;
  selectors: Selector[];
};
export const AnnotationEditEmits = {
  close: (event: AnnotationEditModalEvent | null) => true,
};

export type AnnotationEditModalShow = Pick<
  AnnotationEditModal,
  'source' | 'annotation' | 'type' | 'parentAnnotation'
>;
