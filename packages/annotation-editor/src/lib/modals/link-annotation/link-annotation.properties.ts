import type { ExtractPublicPropTypes, PropType } from 'vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';

export const LinkAnnotationProperties = {
  sourceAnnotation: { type: Object as PropType<W3CAnnotation>, required: true as const },
  targetAnnotation: { type: Object as PropType<W3CAnnotation>, required: true as const },
  type: { type: String, required: true as const },
};

export type LinkAnnotationProps = ExtractPublicPropTypes<
  typeof LinkAnnotationProperties
>;

export type LinkAnnotationShow = Pick<
  LinkAnnotationProps,
  'sourceAnnotation' | 'targetAnnotation'
>;

export type LinkAnnotaitonCloseEvent = { annotation: W3CAnnotation };

export const LinkEmits = {
  close: (event: LinkAnnotaitonCloseEvent) => true,
};
