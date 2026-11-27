import { AnnotationModal } from '../AnnotationModal.definition';
import {
  type ConfirmCloseEvent,
  type ConfirmProps,
} from './confirm.properties';


class Confirm extends AnnotationModal<
  ConfirmProps,
  ConfirmProps,
  ConfirmCloseEvent
> {}

export const useConfirm = () => new Confirm();
