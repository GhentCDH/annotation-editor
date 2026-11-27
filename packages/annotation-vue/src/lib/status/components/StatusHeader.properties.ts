import { type EmitFn, type ExtractPublicPropTypes, type PropType } from 'vue';

import { type StatusState } from '../status.utils';

export const StatusHeaderProperties = {
  state: { type: String as PropType<StatusState>, required: true as const },
  loadedCount: { type: Number, required: false as const, default: undefined },
  errorCount: { type: Number, required: true as const },
  loading: { type: Boolean, required: true as const },
  lastChecked: {
    type: Object as PropType<Date | null>,
    required: false as const,
    default: null,
  },
};
export type StatusHeaderPropsType = ExtractPublicPropTypes<
  typeof StatusHeaderProperties
>;
export const StatusHeaderEmits = {
  refresh: () => true,
};
export type StatusHeaderEmitsType = typeof StatusHeaderEmits;
export type StatusHeaderEmitsFn = EmitFn<StatusHeaderEmitsType>;
