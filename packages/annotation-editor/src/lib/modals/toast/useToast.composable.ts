import { AnnotationModal } from '@ghentcdh/annotation-ui';
import { type EditToast } from './toast.properties';

export class ToastCard extends AnnotationModal<EditToast, EditToast, void> {}

export const useToast = () => new ToastCard();
