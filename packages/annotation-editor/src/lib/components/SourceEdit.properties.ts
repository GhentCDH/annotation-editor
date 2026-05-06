import type { ExtractPublicPropTypes, PropType } from 'vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import type { SourceModel } from '../types/source.model';


export const SourceEditProperties = {
  source: { type: Object as PropType<SourceModel>, required: true as const },
  annotations: { type: Array as PropType<W3CAnnotation[]>, required: true as const },
};

export type SourceEditProps = ExtractPublicPropTypes<
  typeof SourceEditProperties
>;

export const SourceEditEmits = {
  createAnnotation: (_annotationType: string) => true,
  editAnnotation: (_annotation: W3CAnnotation) => true,
  deleteAnnotation: (_annotation: W3CAnnotation) => true,
  selectAnnotation: (_data: {
    mouseEvent: MouseEvent;
    annotation: W3CAnnotation;
    source: SourceModel;
  }) => true,
};

export type SourceEditEmitsType = typeof SourceEditEmits;
