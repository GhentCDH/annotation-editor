import { type ExtractPublicPropTypes, type PropType } from 'vue';
import type { SourceModel } from '../../types/source.model';
import { EditorAnnotation } from '../../adapter';

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
