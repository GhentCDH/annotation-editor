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
import { useEditorState } from '../../composables/useEditorState';

export const UseAnnotationEdit = (
  props: AnnotationEditModal,
  emits: EmitFn<typeof AnnotationEditEmits>,
) => {
  const { utils, config } = useEditorState();

  const metadata = props.annotation
    ? (utils.getMetadata(props.annotation) ?? {})
    : {};
  const annotationDef = config.annotation.getDefinition(props.type);

  const resource = annotationDef ? resourceApi(annotationDef, {}) : null;

  let selectors: Selector[] | null = null;
  const message = ref<FormMessageProps>({ status: 'idle' });

  const editedAnnotation = ref<W3CAnnotation | null>(props.annotation ?? null);

  if (props.annotation) {
    // TODO init it
  }

  let rawData = {};

  const annotationSelector = ref<W3CAnnotation | null>(null);

  const cancel = () => {
    utils.cancel();
    emits('close', null);
  };

  const saveToBackend = async () => {
    const originalAnnotation = props.annotation;
    // check if resource can handle backend requests
    if (!originalAnnotation && !annotationDef.operations.create) return;
    if (originalAnnotation && !annotationDef.operations.update) return;

    if (originalAnnotation) {
      return resource
        .save(originalAnnotation.id, editedAnnotation.value)
        .then(() => {
          message.value = { status: 'saved' };
          NotificationService.success('Annotation saved successfully.');
        });
    } else {
      return resource.create(editedAnnotation.value).then(() => {
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
        parent: props.parentAnnotation,
        annotation: _annotation,
      });
    }
    if (metadata) {
      rawData = _metadata;
    }

    if (selectors)
      editedAnnotation.value = utils.createAnnotation(
        props.annotation,
        annotationDef,
        metadata,
        selectors,
      );

    return editedAnnotation.value;
  };

  return {
    save,
    cancel,
    rawData,
    metadata,
    annotationDef,
    annotationSelector,
    editedAnnotation,
    onChangeValue,
    message,
  };
};
