import { type EmitFn, type ExtractPublicPropTypes, type PropType } from 'vue';

import { type StatusIssue } from '../status.utils';

export const StatusIssuesPanelProperties = {
  issues: { type: Array as PropType<StatusIssue[]>, required: true as const },
};
export type StatusIssuesPanelPropsType = ExtractPublicPropTypes<
  typeof StatusIssuesPanelProperties
>;
export const StatusIssuesPanelEmits = {
  'anchor-click': (_anchor: string) => true,
};
export type StatusIssuesPanelEmitsType = typeof StatusIssuesPanelEmits;
export type StatusIssuesPanelEmitsFn = EmitFn<StatusIssuesPanelEmitsType>;
