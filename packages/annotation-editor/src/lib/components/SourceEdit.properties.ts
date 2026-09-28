import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
  type EditorAnnotation,
  type SourceModel,
} from '@ghentcdh/annotation-ui';

export const SourceEditProperties = {
  source: { type: Object as PropType<SourceModel>, required: true as const },
};

export type SourceEditProps = ExtractPublicPropTypes<
  typeof SourceEditProperties
>;

export const SourceEditEmits = {
  createAnnotation: (_annotationType: string) => true,
  editAnnotation: (_annotation: EditorAnnotation) => true,
  deleteAnnotation: (_annotation: EditorAnnotation) => true,
  selectAnnotation: (_data: {
    mouseEvent: MouseEvent;
    annotation: EditorAnnotation;
    source: SourceModel;
  }) => true,
};

export type SourceEditEmitsType = typeof SourceEditEmits;
