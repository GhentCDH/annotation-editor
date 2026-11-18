import { AnnotationModal } from '../AnnotationModal.definition';
import {
  type AnnotationEditModal,
  type AnnotationEditModalEvent,
  type AnnotationEditModalShow,
} from './AnnotationEditModal.properties';

class AnnotationEdit extends AnnotationModal<
  AnnotationEditModal,
  AnnotationEditModalShow,
  AnnotationEditModalEvent
> {}

export const useAnnotationEdit = () => new AnnotationEdit();
