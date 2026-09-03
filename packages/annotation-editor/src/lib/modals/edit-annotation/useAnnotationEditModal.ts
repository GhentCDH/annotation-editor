import { AnnotationModal } from '@ghentcdh/annotation-ui';
import {
  type AnnotationEditModal,
  type AnnotationEditModalEvent,
  type AnnotationEditModalShow,
} from './AnnotationEditModal.properties';

export class AnnotationEdit extends AnnotationModal<
  AnnotationEditModal,
  AnnotationEditModalShow,
  AnnotationEditModalEvent
> {}

export const useAnnotationEdit = () => new AnnotationEdit();
