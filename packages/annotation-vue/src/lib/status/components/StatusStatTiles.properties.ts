import { type PropType } from 'vue';

import { type AnnotationDefinitionsState } from '../../definitions/useAnnotationDefinitions';
import { type StatusFilter } from '../status.utils';

export const StatusStatTilesProperties = {
  status: {
    type: Object as PropType<AnnotationDefinitionsState>,
    required: true as const,
  },
};
export const StatusStatTilesEmits = {
  'filter-change': (_filter: StatusFilter) => true,
};
