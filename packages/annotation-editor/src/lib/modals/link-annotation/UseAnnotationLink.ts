import { type EmitFn, ref } from 'vue';
import { NotificationService } from '@ghentcdh/ui';
import { type FormMessageProps, resourceApi } from '@ghentcdh/crouton-vue';
import { type EditorAnnotation } from '@ghentcdh/annotation-ui';
import {
  type LinkAnnotationProps,
  type LinkEmits,
} from './link-annotation.properties';
import { useEditorState } from '../../composables/useEditorState';

export const useAnnotationLink = (
  props: LinkAnnotationProps,
  emits: EmitFn<typeof LinkEmits>,
) => {
  const { config } = useEditorState();

  const metadata = {};
  const annotationDef = config.annotation.getDefinition(props.type);

  const resource = annotationDef ? resourceApi(annotationDef, {}) : null;

  const message = ref<FormMessageProps>({ status: 'idle' });

  let rawData = {};

  const cancel = () => {
    emits('close', null);
  };

  const saveToBackend = async (annotation: EditorAnnotation) => {
    // check if resource can handle backend requests
    if (!annotationDef.operations.create) return;

    return resource.create(annotation).then(() => {
      message.value = { status: 'saved' };
      NotificationService.success('Annotation saved successfully.');
    });
  };

  const save = () => {
    message.value = { status: 'saving' };

    const result = config.annotation.annotationAdapter.createLinkAnnotation(
      props.sourceAnnotation!,
      props.targetAnnotation,
      annotationDef!,
      rawData,
    );

    saveToBackend(result)
      .then((result) => {
        emits('close', {
          annotation: result,
          rawData,
          sourceAnnotation: props.sourceAnnotation,
          targetAnnotation: props.targetAnnotation,
        });
      })
      .catch((err) => {
        console.error(err);
        message.value = { status: 'error' };
      });
  };

  const onChangeValue = ({ metadata: _metadata }: { metadata?: any }) => {
    if (metadata) {
      rawData = _metadata;
    }

    return rawData;
  };

  return {
    save,
    cancel,
    rawData,
    metadata,
    annotationDef,
    onChangeValue,
    message,
  };
};
