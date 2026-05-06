import { type EditToast } from './toast.properties';
import { AnnotationModal } from '../AnnotationModal.definition';

export class ToastCard extends AnnotationModal<EditToast, EditToast, void> {}

export const useToast = () => new ToastCard();
