import type { ExtractPublicPropTypes, PropType } from 'vue';
import { type EditorAnnotation } from '@ghentcdh/annotation-ui';

export const LinkAnnotationProperties = {
  annotation: {
    type: Object as PropType<EditorAnnotation>,
  },
};

export type LinkAnnotationProps = ExtractPublicPropTypes<
  typeof LinkAnnotationProperties
>;

export type LinkAnnotationShow = Pick<LinkAnnotationProps, 'annotation'>;

export type LinkAnnotationCloseEvent = { annotation: EditorAnnotation };

export const LinkEmits = {
  close: (event: LinkAnnotationCloseEvent) => true,
};
