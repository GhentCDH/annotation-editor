import { ExtractPublicPropTypes, PropType } from 'vue';
import { W3CAnnotation } from '@ghentcdh/w3c-utils';;
import { SourceModel } from '../../types/source.model';

type Position = { x: number; y: number };

export const AnnotationInfoCardProperties = {
  position: { type: Object as PropType<Position>, required: true },
  annotation: { type: Object as PropType<W3CAnnotation>, required: false },
  source: { type: Object as PropType<SourceModel>, required: false },
};

export type AnnotationInfoCardProp = ExtractPublicPropTypes<
  typeof AnnotationInfoCardProperties
>;

export type AnnotationInfoCardEvent = void;

export type AnnotationInfoCardShow = {
  mouseEvent?: MouseEvent;
  position?: { x: number; y: number };
} & Pick<AnnotationInfoCardProp, 'source' | 'annotation'>;
