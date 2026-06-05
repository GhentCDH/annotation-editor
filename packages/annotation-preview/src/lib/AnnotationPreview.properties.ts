import type { EmitFn, ExtractPublicPropTypes, PropType } from 'vue';

import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type AnnotationDefConfig } from '@ghentcdh/annotation-core';
import { type AnnotationAdapter, type TextAdapter } from '@ghentcdh/annotated-text';
import type { AnnotationDefinition, SourceModel } from '@ghentcdh/annotation-ui';
import type { PreviewLayout } from './types/preview-layout.types';

export type { PreviewLayout, PaneConfig } from './types/preview-layout.types';

export const AnnotationPreviewProperties = {
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
  layout: { type: Object as PropType<PreviewLayout>, required: false, default: undefined },
  annotationDefinitions: {
    type: Array as PropType<AnnotationDefinition[]>,
    required: true as const,
  },
  selectedAnnotationId: { type: String, required: false, default: undefined },
};

export type AnnotationPreviewProps = ExtractPublicPropTypes<
  typeof AnnotationPreviewProperties
>;

export const AnnotationPreviewEmits = {
  'select:annotation': (
    _annotation: W3CAnnotation | null,
    _action: string | null,
  ) => true,
};

export type AnnotationPreviewEmitsFn = EmitFn<typeof AnnotationPreviewEmits>;
