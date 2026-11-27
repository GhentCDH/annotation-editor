import { type EmitFn, type ExtractPublicPropTypes, type PropType } from 'vue';

import {
  type BaseAnnotation,
  type TextAdapter,
} from '@ghentcdh/annotated-text';
import { type GridLayout } from '@ghentcdh/annotation-core';
import {
  type AnnotationTransformer,
  w3cAnnotationTransformer,
} from '@ghentcdh/annotation-ui';

import { type AnnotationTypeItem } from '../filter/AnnotationFilter.properties';
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
    type: Object as PropType<AnnotationTransformer<BaseAnnotation>>,
    required: false as const,
    default: (): AnnotationTransformer<BaseAnnotation> =>
      w3cAnnotationTransformer,
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
    required: false as const,
    default: undefined,
  },
};
export type SmartEditorProps = ExtractPublicPropTypes<
  typeof SmartEditorProperties
>;

export const SmartEditorEmits = {
  'annotationtype-click': (_item: AnnotationTypeItem) => true,
};
export type SmartEditorEmitsFn = EmitFn<typeof SmartEditorEmits>;
