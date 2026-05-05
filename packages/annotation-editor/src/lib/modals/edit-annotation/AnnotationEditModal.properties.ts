import { ExtractPublicPropTypes, PropType } from 'vue';
import { W3CAnnotation } from '@ghentcdh/w3c-utils';;
import { SourceModel } from '../../types/source.model';

export const AnnotationEditModalProperties = {
  type: { type: String, required: true },
  annotation: { type: Object as PropType<W3CAnnotation>, required: false },
  parentAnnotation: {
    type: Object as PropType<W3CAnnotation>,
    required: false,
  },
  source: { type: Object as PropType<SourceModel>, required: true },
};

export type AnnotationEditModal = ExtractPublicPropTypes<
  typeof AnnotationEditModalProperties
>;

export type AnnotationEditModalEvent = {
  annotation: W3CAnnotation;
};
export const AnnotationEditEmits = {
  close: (event: AnnotationEditModalEvent) => true,
};

export type AnnotationEditModalShow = Pick<
  AnnotationEditModal,
  'source' | 'annotation' | 'type' | 'parentAnnotation'
>;
