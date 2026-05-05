import { AnnotationModal } from '../AnnotationModal.definition';
import {
  AnnotationEditModal,
  AnnotationEditModalEvent,
  AnnotationEditModalShow,
} from './AnnotationEditModal.properties';

export class AnnotationEdit extends AnnotationModal<
  AnnotationEditModal,
  AnnotationEditModalShow,
  AnnotationEditModalEvent
> {}

export const useAnnotationEdit = () => new AnnotationEdit();
