import { type PropType } from 'vue';

import { type EditorAnnotation } from '@ghentcdh/annotation-ui';

export const LinksDetailProperties = {
  annotation: {
    type: Object as PropType<EditorAnnotation>,
    required: true as const,
  },
};
