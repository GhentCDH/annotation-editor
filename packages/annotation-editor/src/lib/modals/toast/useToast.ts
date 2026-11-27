import { AnnotationModal } from '../AnnotationModal.definition';
import { type EditToast } from './toast.properties';

class ToastCard extends AnnotationModal<EditToast, EditToast, void> {}

export const useToast = () => new ToastCard();
