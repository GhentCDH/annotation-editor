import { type ExtractPublicPropTypes, type PropType } from 'vue';

import { type StatusRow } from '../status.utils';

export const StatusDefinitionListProperties = {
  rows: { type: Array as PropType<StatusRow[]>, required: true as const },
};
export type StatusDefinitionListPropsType = ExtractPublicPropTypes<
  typeof StatusDefinitionListProperties
>;
