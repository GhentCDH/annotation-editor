import { type ExtractPublicPropTypes } from 'vue';

export const AnnotationModalProperties = {
  modalView: { type: Boolean, required: false as const, default: true },
};

export type AnnotationModalPropsType = ExtractPublicPropTypes<
  typeof AnnotationModalProperties
>;