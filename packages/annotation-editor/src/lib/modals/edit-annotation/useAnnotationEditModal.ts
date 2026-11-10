import {
  type AnnotationEditModal,
  type AnnotationEditModalEvent,
  type AnnotationEditModalShow,
} from './AnnotationEditModal.properties';
import { AnnotationModal } from '../AnnotationModal.definition';

class AnnotationEdit extends AnnotationModal<
  AnnotationEditModal,
  AnnotationEditModalShow,
  AnnotationEditModalEvent
> {}

export const useAnnotationEdit = () => new AnnotationEdit();
