import { type ConfirmCloseEvent, type ConfirmProps } from './confirm.properties';
import { AnnotationModal } from '@ghentcdh/annotation-ui';

export class Confirm extends AnnotationModal<
  ConfirmProps,
  ConfirmProps,
  ConfirmCloseEvent
> {}

export const useConfirm = () => new Confirm();
