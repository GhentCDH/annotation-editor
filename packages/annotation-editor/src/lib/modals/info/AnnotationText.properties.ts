import { type PropType } from 'vue';

import { type EditorAnnotation } from '@ghentcdh/annotation-ui';

export const AnnotationTextProperties = {
  annotation: {
    type: Object as PropType<EditorAnnotation>,
    required: true as const,
  },
  maxCharacters: { type: Number, required: false as const },
  showSource: { type: Boolean, required: false as const },
};
