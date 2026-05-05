import { ExtractPublicPropTypes, PropType } from 'vue';
import { W3CAnnotation } from '@ghentcdh/w3c-utils';;

export const LinkAnnotationProperties = {
  sourceAnnotation: { type: Object as PropType<W3CAnnotation>, required: true },
  targetAnnotation: { type: Object as PropType<W3CAnnotation>, required: true },
  type: { type: String, required: true },
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
