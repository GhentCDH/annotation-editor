import { type EmitFn, type ExtractPublicPropTypes, type PropType } from 'vue';

import { type StatusRow } from '../status.utils';

export const StatusDefinitionRowProperties = {
  row: { type: Object as PropType<StatusRow>, required: true as const },
  expanded: { type: Boolean, required: true as const },
};
export type StatusDefinitionRowPropsType = ExtractPublicPropTypes<
  typeof StatusDefinitionRowProperties
>;
export const StatusDefinitionRowEmits = {
  toggle: () => true,
};
export type StatusDefinitionRowEmitsType = typeof StatusDefinitionRowEmits;
export type StatusDefinitionRowEmitsFn = EmitFn<StatusDefinitionRowEmitsType>;
