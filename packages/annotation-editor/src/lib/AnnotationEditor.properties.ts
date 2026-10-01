import type { EmitFn, ExtractPublicPropTypes, PropType } from 'vue';
import { type TextAdapter } from '@ghentcdh/annotated-text';
import {
  type EditorAnnotation,
  type GridLayout,
  type SourceModel,
  type TransformAnnotationAdapter,
  type UIAnnotationDefinition,
} from '@ghentcdh/annotation-ui';

export const AnnotationEditorProperties = {
  modalView: { type: Boolean, required: false as const, default: true },
  textAdapter: {
    type: Function as PropType<() => TextAdapter>,
    required: false as const,
  },
  // TODO this should become only setmetadata etc functions
  annotationTransformer: {
    type: Object as PropType<TransformAnnotationAdapter<object>>,
    required: true as const,
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
  'update:annotation': <ANNOTATION>(annotation: ANNOTATION) =>
    Promise<ANNOTATION>,
  'delete:annotation': <ANNOTATION>(annotation: ANNOTATION) =>
    Promise<ANNOTATION>,
  'create:annotation': <ANNOTATION>(annotation: ANNOTATION) =>
    Promise<ANNOTATION>,
  'create:annotation:events': (_payload: any) => true,
  'select:annotation': <ANNOTATION>(
    _annotation: ANNOTATION | null,
    _action: string | null,
  ) => true,
};

export type AnnotationEditorEmitsFn = EmitFn<typeof AnnotationEditorEmits>;
