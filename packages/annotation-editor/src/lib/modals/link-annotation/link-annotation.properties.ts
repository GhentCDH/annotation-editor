import type { ExtractPublicPropTypes, PropType } from 'vue';
import {
  type EditorAnnotation,
  type UIAnnotationDefinition,
} from '@ghentcdh/annotation-ui';

export const LinkAnnotationProperties = {
  sourceAnnotation: {
    type: Object as PropType<EditorAnnotation>,
    required: true as const,
  },
  targetAnnotation: {
    type: Object as PropType<EditorAnnotation>,
    required: true as const,
  },
  definition: {
    type: Object as PropType<UIAnnotationDefinition>,
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

export type LinkAnnotationCloseEvent = { annotation: EditorAnnotation };

export const LinkEmits = {
  close: (event: LinkAnnotationCloseEvent) => true,
};
