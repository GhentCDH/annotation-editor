import {
  type EditorAnnotation,
  type UIAnnotationDefinition,
} from '@ghentcdh/annotation-ui';
import { type FormMessageProps } from '@ghentcdh/crouton-vue';
import { NotificationService } from '@ghentcdh/ui';
import { type EmitFn, ref } from 'vue';
import { useEditorState } from './useEditorState';

export const AnnotationMetadataEditEmits = {
  close: (event: { annotation: any } | null) => true,
};
export const useAnnotationResource = (
  annotation: EditorAnnotation,
  definition: UIAnnotationDefinition,
) => {
  const message = ref<FormMessageProps>({ status: 'idle' });
  const resource = definition.resource;
  const { editorState } = useEditorState();

  const _save = async (update: EditorAnnotation) => {
    const dataToSave = editorState.format(update, !annotation.id);
    if (annotation.id) {
      return resource.save(annotation.id, dataToSave).then((response) => {
        message.value = { status: 'saved' };
        NotificationService.success('Annotation saved successfully.');
        return response;
      });
    } else {
      return resource.create(dataToSave).then((response) => {
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
        });
      })
      .catch((err) => {
        console.error(err);
        message.value = { status: 'error' };
      });
  };

  return { message, save };
};
