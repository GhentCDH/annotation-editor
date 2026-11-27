import { type PropType } from 'vue';

import { type UIAnnotationDefinition } from '@ghentcdh/annotation-ui';

export const MetadataProperties = {
  data: {
    type: Object as PropType<Record<string, unknown>>,
    required: true as const,
  },
  definition: {
    type: Object as PropType<UIAnnotationDefinition>,
    required: true as const,
  },
};
