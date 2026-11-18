import type { PropType } from 'vue';
import { type BaseAnnotation, type TextAdapter } from '@ghentcdh/annotated-text';
import { type TransformAnnotationAdapter, W3cTransformAnnotationAdapter } from '@ghentcdh/annotation-ui';
import { type GridLayout } from '@ghentcdh/annotation-core';
import { type AnnotationEditorLoader } from './AnnotationEditorLoader';

export const SmartEditorProperties = {
  loader: {
    type: Object as PropType<AnnotationEditorLoader<BaseAnnotation>>,
    required: true as const,
  },
  textAdapter: {
    type: Function as PropType<() => TextAdapter>,
    required: false as const,
  },
  annotationTransformer: {
    type: Object as PropType<TransformAnnotationAdapter<BaseAnnotation>>,
    required: false as const,
    default: new W3cTransformAnnotationAdapter(),
  },
  watchQueryParams: {
    type: Boolean,
    default: true,
    required: false as const,
  },
  sourceUris: {
    type: Array<string>,
    required: true as const,
  },
  readonly: {
    type: Boolean,
    default: false,
    required: false as const,
  },
  layout: {
    type: Object as PropType<GridLayout>,
    required: false,
    default: undefined,
  },
};
