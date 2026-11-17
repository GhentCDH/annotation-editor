import type { EmitFn, ExtractPublicPropTypes, PropType } from 'vue';

import { type TextAdapter } from '@ghentcdh/annotated-text';
import { type GridLayout, type SourceModel } from '@ghentcdh/annotation-core';
import {
  type AnnotationTransformer,
  type EditorAnnotation,
  type UIAnnotationDefinition,
  w3cAnnotationTransformer,
} from '@ghentcdh/annotation-ui';

export const AnnotationEditorProperties = {
  modalView: { type: Boolean, required: false as const, default: true },
  textAdapter: {
    type: Function as PropType<() => TextAdapter>,
    required: false as const,
  },
  annotationTransformer: {
    type: Object as PropType<AnnotationTransformer>,
    required: true as const,
    default: (): AnnotationTransformer => w3cAnnotationTransformer,
  },
  sources: { type: Array as PropType<SourceModel[]>, required: true as const },
  annotations: {
    type: Array as PropType<EditorAnnotation[]>,
    required: true as const,
  },
  cols: { type: Number, required: false, default: 2 },
  layout: {
    type: Object as PropType<GridLayout>,
    required: false,
    default: undefined,
  },
  annotationDefinitions: {
    type: Array as PropType<UIAnnotationDefinition[]>,
    required: true as const,
  },
  selectedAnnotationId: {
    type: [String, Number] as PropType<string | number | undefined>,
    required: false as const,
    default: undefined,
  },
  selectedAnnotationAction: {
    type: String,
    required: false,
    default: undefined,
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
};

export type AnnotationEditorProps = ExtractPublicPropTypes<
  typeof AnnotationEditorProperties
>;

export const AnnotationEditorEmits = {
  'update:annotation': (_annotation: unknown) => true,
  'delete:annotation': (_annotation: unknown) => true,
  'create:annotation': (_annotation: unknown) => true,
  'select:annotation': (_annotation: unknown, _action: string | null) => true,
};

export type AnnotationEditorEmitsFn = EmitFn<typeof AnnotationEditorEmits>;
