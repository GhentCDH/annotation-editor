import { EditorAnnotation } from '@ghentcdh/annotation-ui';
import { type FormMessageProps, resourceApi } from '@ghentcdh/crouton-vue';
import { NotificationService } from '@ghentcdh/ui';
import { type EmitFn, ref } from 'vue';
import { useEditorState } from './useEditorState';

export const AnnotationMetadataEditEmits = {
  close: (event: { result: any } | null) => true,
};
export const useAnnotationResource = (annotation: EditorAnnotation) => {
  const operations = annotation.definition.operations ?? {};
  const message = ref<FormMessageProps>({ status: 'idle' });
  const resource = resourceApi(annotation.definition, {});
  const { editorState } = useEditorState();

  const _save = async (update: EditorAnnotation) => {
    const dataToSave = editorState.annotationTransformer.format(
      update,
      !annotation.id,
    );
    if (annotation.id) {
      return resource.save(annotation.id, dataToSave).then(() => {
        message.value = { status: 'saved' };
        NotificationService.success('Annotation saved successfully.');
      });
    } else {
      return resource.create(dataToSave).then(() => {
        message.value = { status: 'saved' };
        NotificationService.success('Annotation saved successfully.');
      });
    }
  };

  const save = async (
    update: EditorAnnotation,
    emits: EmitFn<typeof AnnotationMetadataEditEmits>,
  ) => {
    if (!annotation.id && !operations.create) return;
    if (annotation.id && !operations.update) return;

    _save(update)
      .then((result) => {
        emits('close', {
          result,
        });
      })
      .catch((err) => {
        console.error(err);
        message.value = { status: 'error' };
      });
  };

  return { message, save };
};
