import { type Ref, type UnwrapNestedRefs, ref } from 'vue';

import { type Selector } from '@ghentcdh/annotation-ui';

import { type EditorConfig } from '../../composables/editorState';
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
> {
  /** Selector drawn in the main source text (right-drawer mode, where the panel has no own text) */
  selector: Ref<Selector | null> = ref(null);

  override show(data: AnnotationEditModalShow) {
    this.selector.value = null;
    return super.show(data);
  }
}

export const useAnnotationEdit = () => new AnnotationEdit();

/** Typed access to the edit modal state, including the drawn `selector` */
export const getEditModalState = (modal: EditorConfig['modal']) =>
  modal.getModal('edit-annotation').state as unknown as UnwrapNestedRefs<AnnotationEdit>;
