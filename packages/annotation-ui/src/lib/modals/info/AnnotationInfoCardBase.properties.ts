import { type EmitFn, type ExtractPublicPropTypes, type PropType } from 'vue';
import { AnnotationInfoCardProperties } from './AnnotationInfoCard.properties';
import { type UIAnnotationConfiguration } from '../../types/AnnotationConfiguration.model';

export const AnnotationInfoCardBaseProperties = {
  ...AnnotationInfoCardProperties,
  config: {
    type: Object as PropType<UIAnnotationConfiguration>,
    required: true as const,
  },
  disableClose: { type: Boolean, required: false, default: false },
};

export type AnnotationInfoCardBasePropsType = ExtractPublicPropTypes<
  typeof AnnotationInfoCardBaseProperties
>;

export const AnnotationInfoCardBaseEmits = {
  close: () => true,
};

export type AnnotationInfoCardBaseEmitsType =
  typeof AnnotationInfoCardBaseEmits;
export type AnnotationInfoCardBaseEmitsFn =
  EmitFn<AnnotationInfoCardBaseEmitsType>;
