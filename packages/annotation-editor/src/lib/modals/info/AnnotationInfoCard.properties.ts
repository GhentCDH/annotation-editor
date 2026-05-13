import { ExtractPublicPropTypes, PropType } from 'vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import type { SourceModel } from '../../types/source.model';

type Position = { x: number; y: number };

export const AnnotationInfoCardProperties = {
  position: { type: Object as PropType<Position>, required: true as const },
  annotation: { type: Object as PropType<W3CAnnotation>, required: false },
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
