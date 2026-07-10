import { type ExtractPublicPropTypes, type PropType, type EmitFn } from 'vue';
import { AnnotationInfoCardProperties } from './AnnotationInfoCard.properties';
import { type UIAnnotationConfiguration } from '../../types/AnnotationConfiguration.model';
import { type AnnotationUtils } from '../../utils/annotation-utils';

export const AnnotationInfoCardBaseProperties = {
  ...AnnotationInfoCardProperties,
  config: {
    type: Object as PropType<UIAnnotationConfiguration>,
    required: true as const,
  },
  utils: {
    type: Object as PropType<AnnotationUtils>,
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

export type AnnotationInfoCardBaseEmitsType = typeof AnnotationInfoCardBaseEmits;
export type AnnotationInfoCardBaseEmitsFn = EmitFn<AnnotationInfoCardBaseEmitsType>;
