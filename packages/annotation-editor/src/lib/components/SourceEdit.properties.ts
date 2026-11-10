import type { PropType } from 'vue';
import { type SourceModel } from '@ghentcdh/annotation-ui';

export const SourceEditProperties = {
  source: { type: Object as PropType<SourceModel>, required: true as const },
};
