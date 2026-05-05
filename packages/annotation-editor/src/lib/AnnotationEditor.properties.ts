import type { ExtractPublicPropTypes, PropType } from 'vue';
import { EmitFn } from 'vue';
import type { SourceModel } from './types/source.model';

import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import type { AnnotationDefinition } from './types/AnnotationConfiguration.model';
import { type FormEventPayload } from '@ghentcdh/json-forms-vue';

export const AnnotationEditorProperties = {
  sources: { type: Array as PropType<SourceModel[]>, required: true },
  annotations: { type: Array as PropType<W3CAnnotation[]>, required: true },
  cols: { type: Number, required: false, default: 2 },
  annotationDefinitions: {
    type: Array as PropType<AnnotationDefinition[]>,
    required: true,
  },
  selectedAnnotationId: { type: String, required: false, default: undefined },
  selectedAnnotationAction: { type: String, required: false, default: undefined },
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

export type AnnotationEditorEmitsType = typeof AnnotationEditorEmits;
export type AnnotationEditorEmitsFn = EmitFn<AnnotationEditorEmitsType>;
