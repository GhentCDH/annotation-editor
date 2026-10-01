import { type EmitFn, type ExtractPublicPropTypes, type PropType } from 'vue';
import {
  type EditorAnnotation,
  type SourceModel,
  type UIAnnotationConfiguration,
} from '@ghentcdh/annotation-ui';

type Position = { x: number; y: number };

export const AnnotationInfoCardProperties = {
  position: { type: Object as PropType<Position>, required: true as const },
  annotation: {
    type: Object as PropType<EditorAnnotation>,
    required: true as const,
  },
  source: { type: Object as PropType<SourceModel>, required: true as const },
};

export type AnnotationInfoCardProp = ExtractPublicPropTypes<
  typeof AnnotationInfoCardProperties
>;

export type AnnotationInfoCardEvent = void;

export type AnnotationInfoCardShow = {
  mouseEvent?: MouseEvent;
  position?: { x: number; y: number };
  containerRef: HTMLElement;
} & Pick<AnnotationInfoCardProp, 'source' | 'annotation'>;

export const AnnotationInfoCardBaseProperties = {
  position: { type: Object as PropType<Position>, required: true as const },
  annotation: {
    type: Object as PropType<EditorAnnotation>,
    required: true as const,
  },
  source: { type: Object as PropType<SourceModel>, required: true as const },
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
