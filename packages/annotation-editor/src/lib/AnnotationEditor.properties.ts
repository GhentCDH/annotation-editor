import type { EmitFn, ExtractPublicPropTypes, PropType } from 'vue';

import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type FormEventPayload } from '@ghentcdh/json-forms-vue';
import { type AnnotationDefConfig } from '@ghentcdh/annotation-core';
import { type AnnotationAdapter, type TextAdapter } from '@ghentcdh/annotated-text';
import type { AnnotationDefinition } from './types/AnnotationConfiguration.model';
import type { SourceModel } from './types/source.model';

export const AnnotationEditorProperties = {
  modalView: { type: Boolean, required: false as const, default: true },
  configuration: {
    type: Object as PropType<AnnotationDefConfig>,
    required: true as const,
  },
  textAdapter: {
    type: Object as PropType<TextAdapter>,
    required: false as const,
  },
  annotationAdapter: {
    type: Object as PropType<AnnotationAdapter<W3CAnnotation>>,
    required: false as const,
  },
  sources: { type: Array as PropType<SourceModel[]>, required: true as const },
  annotations: {
    type: Array as PropType<W3CAnnotation[]>,
    required: true as const,
  },
  cols: { type: Number, required: false, default: 2 },
  annotationDefinitions: {
    type: Array as PropType<AnnotationDefinition[]>,
    required: true as const,
  },
  selectedAnnotationId: { type: String, required: false, default: undefined },
  selectedAnnotationAction: {
    type: String,
    required: false,
    default: undefined,
  },
};

export type AnnotationEditorProps = ExtractPublicPropTypes<
  typeof AnnotationEditorProperties
>;

export const AnnotationEditorEmits = {
  'update:annotation': (annotation: W3CAnnotation) => Promise<W3CAnnotation>,
  'delete:annotation': (annotation: W3CAnnotation) => Promise<W3CAnnotation>,
  'create:annotation': (annotation: W3CAnnotation) => Promise<W3CAnnotation>,
  'create:annotation:events': (_payload: FormEventPayload) => true,
  'select:annotation': (
    _annotation: W3CAnnotation | null,
    _action: string | null,
  ) => true,
};

export type AnnotationEditorEmitsFn = EmitFn<typeof AnnotationEditorEmits>;
