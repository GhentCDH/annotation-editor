import { type EmitFn, type ExtractPublicPropTypes, type PropType } from 'vue';

import { type AnnotationDefinitionsState } from '../../definitions/useAnnotationDefinitions';
import { type StatusFilter } from '../status.utils';

export const StatusStatTilesProperties = {
  status: {
    type: Object as PropType<AnnotationDefinitionsState>,
    required: true as const,
  },
};
export type StatusStatTilesPropsType = ExtractPublicPropTypes<
  typeof StatusStatTilesProperties
>;
export const StatusStatTilesEmits = {
  'filter-change': (_filter: StatusFilter) => true,
};
export type StatusStatTilesEmitsType = typeof StatusStatTilesEmits;
export type StatusStatTilesEmitsFn = EmitFn<StatusStatTilesEmitsType>;
