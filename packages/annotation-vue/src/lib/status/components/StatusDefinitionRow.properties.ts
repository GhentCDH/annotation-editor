import { type PropType } from 'vue';

import { type StatusRow } from '../status.utils';

export const StatusDefinitionRowProperties = {
  row: { type: Object as PropType<StatusRow>, required: true as const },
  expanded: { type: Boolean, required: true as const },
};
export const StatusDefinitionRowEmits = {
  toggle: () => true,
};
