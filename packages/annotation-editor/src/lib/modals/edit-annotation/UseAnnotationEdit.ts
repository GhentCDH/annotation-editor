import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type EmitFn, ref } from 'vue';
import { NotificationService } from '@ghentcdh/ui';
import { type Selector } from '@ghentcdh/annotation-core';
import { type FormMessageProps, resourceApi } from '@ghentcdh/crouton-vue';
import { getTextSelector } from './utils';
import {
  type AnnotationEditEmits,
  type AnnotationEditModal,
} from './AnnotationEditModal.properties';
import { EditorAnnotation } from '@ghentcdh/annotation-ui';

export const UseAnnotationEdit = (
  props: AnnotationEditModal,
  emits: EmitFn<typeof AnnotationEditEmits>,
) => {
  const metadata = props.annotation.metadata ?? {};

  const resource = resourceApi(props.annotation.definition, {});

  let selectors: Selector[] | null = null;
  const message = ref<FormMessageProps>({ status: 'idle' });

  const editedAnnotation = ref<EditorAnnotation | null>(
    props.annotation ?? null,
  );

  if (props.annotation) {
    // TODO init it
  }

  let rawData = {};

  const annotationSelector = ref<EditorAnnotation | null>(null);

  const cancel = () => {
    // utils.cancel();
    emits('close', null);
  };

  const saveToBackend = async () => {
    const originalAnnotation = props.annotation;
    const operations = props.annotation.definition.operations ?? {};
    // check if resource can handle backend requests
    if (!originalAnnotation && !operations.create) return;
    if (originalAnnotation && !operations.update) return;
    // TODO call the transformer!
    if (originalAnnotation) {
      return resource.save(originalAnnotation.id, dataToSave).then(() => {
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

  const save = () => {
    if (!selectors || !editedAnnotation.value) {
      message.value = { message: 'Select annotation first', status: 'error' };
      return;
    }

    message.value = { status: 'saving' };

    saveToBackend()
      .then((result) => {
        emits('close', {
          annotation: editedAnnotation.value,
          rawData,
          selectors,
        });
      })
      .catch((err) => {
        console.error(err);
        message.value = { status: 'error' };
      });
  };

  const onChangeValue = ({
    annotation: _annotation,
    metadata: _metadata,
  }: {
    annotation?: W3CAnnotation | null;
    metadata?: any;
  }) => {
    if (_annotation) {
      selectors = getTextSelector({
        source: props.source,
        parent: props.parent,
        annotation: _annotation,
      });
    }
    if (metadata) {
      rawData = _metadata;
    }

    // if (selectors)
    //   editedAnnotation.value = utils.createAnnotation(
    //     props.annotation,
    //     annotationDef,
    //     metadata,
    //     selectors,
    //   );

    return editedAnnotation.value;
  };

  return {
    save,
    cancel,
    rawData,
    metadata,
    annotationSelector,
    editedAnnotation,
    onChangeValue,
    message,
    selectFull: () => selectFull(props.source, props.annotation),
  };
};
