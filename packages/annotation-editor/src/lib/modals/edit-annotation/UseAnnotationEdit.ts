import { type EmitFn } from 'vue';
import { editorAnnotationSchema, type Selector } from '@ghentcdh/annotation-ui';
import {
  type AnnotationEditEmits,
  type AnnotationEditModal,
} from './AnnotationEditModal.properties';
import { useMetadataEdit } from '../../composables/useMetadataEdit';
import metadata from '../info/Metadata.vue';

export const UseAnnotationEdit = (
  props: AnnotationEditModal,
  emits: EmitFn<typeof AnnotationEditEmits>,
) => {
  let selector: Selector | null = props.annotation?.getSelector?.(
    props.source.uri,
  );

  const metadataEdit = useMetadataEdit(props.annotation);

  const cancel = () => {
    // utils.cancel();
    emits('close', null);
  };

  const save = () => {
    if (!selector || !metadata) {
      metadataEdit.message.value = {
        message: 'Select annotation first',
        status: 'error',
      };
      return;
    }

    metadataEdit.message.value = { status: 'saving' };
    const originalAnnotation = props.annotation.id
      ? props.annotation
      : editorAnnotationSchema.parse({
          id: 'NEW_ANNOTATION',
          metadata: {},
          definition: props.annotation.definition,
          label: '',
          links: [],
          selectors: [selector],
        });
    // check if resource can handle backend requests

    const cloned = originalAnnotation.clone({
      metadata: metadataEdit.metadata.value,
    });
    cloned.setSelector(selector);

    metadataEdit.save(originalAnnotation, emits);
  };

  const onChangeValue = ({ metadata: _metadata }: { metadata?: any }) => {
    return metadataEdit.onChangeValue({ metadata, selector });
  };

  const updateSelector = (updatedSelector: Selector) => {
    selector = updatedSelector;

    return metadataEdit.onChangeValue({ metadata, selector });
  };

  return {
    save,
    cancel,
    metadata: metadataEdit.metadata,
    onChangeValue,
    message: metadataEdit.message,
    updateSelector,
  };
};
