import type { ExtractPublicPropTypes, PropType } from 'vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { AnnotationDefinition } from '@ghentcdh/annotation-ui';

export const LinkAnnotationProperties = {
  sourceAnnotation: {
    type: Object as PropType<W3CAnnotation>,
    required: true as const,
  },
  targetAnnotation: {
    type: Object as PropType<W3CAnnotation>,
    required: true as const,
  },
  definition: {
    type: Object as PropType<AnnotationDefinition>,
    required: false,
  },
};

export type LinkAnnotationProps = ExtractPublicPropTypes<
  typeof LinkAnnotationProperties
>;

export type LinkAnnotationShow = Pick<
  LinkAnnotationProps,
  'sourceAnnotation' | 'targetAnnotation'
>;

export type LinkAnnotationCloseEvent = { annotation: W3CAnnotation };

export const LinkEmits = {
  close: (event: LinkAnnotationCloseEvent) => true,
};
