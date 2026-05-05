import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { SourceModel } from '../types/source.model';

import { type W3CAnnotation } from '@ghentcdh/w3c-utils';

export const SourceEditProperties = {
  source: { type: Object as PropType<SourceModel>, required: true },
  annotations: { type: Array as PropType<W3CAnnotation[]>, required: true },
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
