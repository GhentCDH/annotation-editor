import {
  type ConfirmCloseEvent,
  type ConfirmProps,
} from './confirm.properties';

import { AnnotationModal } from '../AnnotationModal.definition';

class Confirm extends AnnotationModal<
  ConfirmProps,
  ConfirmProps,
  ConfirmCloseEvent
> {}

export const useConfirm = () => new Confirm();
