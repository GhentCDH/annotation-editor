import { AnnotationModal } from '../AnnotationModal.definition';
import { ConfirmCloseEvent, ConfirmProps } from './confirm.properties';

export class Confirm extends AnnotationModal<
  ConfirmProps,
  ConfirmProps,
  ConfirmCloseEvent
> {}

export const useConfirm = () => new Confirm();
