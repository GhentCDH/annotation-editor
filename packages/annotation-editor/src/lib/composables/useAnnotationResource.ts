import {
  type EditorAnnotation,
  type UIAnnotationDefinition,
} from '@ghentcdh/annotation-ui';
import { NotificationService } from '@ghentcdh/crouton-vue';
import { type EmitFn, ref } from 'vue';
import { useEditorState } from './useEditorState';
import { type AnnotationEditModalEvent } from '../modals/edit-annotation/AnnotationEditModal.properties';

export const AnnotationMetadataEditEmits = {
  close: (event: AnnotationEditModalEvent | null) => true,
};
export const useAnnotationResource = (
  annotation: EditorAnnotation,
  definition: UIAnnotationDefinition,
) => {
  const message = ref<{ status: 'idle' | 'saving' | 'saved' | 'pending' | 'error'; message?: string }>({ status: 'idle' });
  const resource = definition.resource;
  const { editorState } = useEditorState();

  const _save = async (update: EditorAnnotation) => {
    const dataToSave = editorState.format(update, !annotation.id);
    if (annotation.id) {
      return resource.save(String(annotation.id), dataToSave).then((response: unknown) => {
        message.value = { status: 'saved' };
        NotificationService.success('Annotation saved successfully.');
        return response;
      });
    } else {
      return resource.create(dataToSave).then((response: unknown) => {
        message.value = { status: 'saved' };
        NotificationService.success('Annotation saved successfully.');
        return response;
      });
    }
  };

  const save = async (
    update: EditorAnnotation,
    emits: EmitFn<typeof AnnotationMetadataEditEmits>,
  ) => {
    if (!annotation.id && !definition.canCreate) return;
    if (annotation.id && !definition.canEdit) return;

    _save(update)
      .then((annotation) => {
        emits('close', {
          annotation,
          rawData: annotation,
          selectors: update.selectors,
        });
      })
      .catch((err) => {
        console.error(err);
        message.value = { status: 'error' };
      });
  };

  return { message, save };
};
