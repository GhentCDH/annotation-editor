import { type EmitFn } from 'vue';
import { editorAnnotationSchema, type Selector } from '@ghentcdh/annotation-ui';
import {
  type AnnotationEditEmits,
  type AnnotationEditModal,
} from './AnnotationEditModal.properties';
import { useMetadataEdit } from '../../composables/useMetadataEdit';
import { useEditorState } from '../../composables/useEditorState';

export const UseAnnotationEdit = (
  props: AnnotationEditModal,
  emits: EmitFn<typeof AnnotationEditEmits>,
) => {
  let selector: Selector | null = props.annotation?.getSelector?.(
    props.source.uri,
  );

  const { getDefinition, findAnnotation } = useEditorState();
  const definition = getDefinition(props.annotation.definitionUri);
  const metadataEdit = useMetadataEdit(props.annotation, definition);
  const parent = props.annotation.parentId
    ? findAnnotation(props.annotation.parentId)
    : null;

  const cancel = () => {
    // utils.cancel();
    emits('close', null);
  };

  const save = () => {
    const metadata = metadataEdit.metadata.value;
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
          metadata,
          definitionUri: definition.id,
          label: '',
          links: [],
          selectors: [selector],
        });
    // check if resource can handle backend requests
    const cloned = originalAnnotation.clone({
      metadata,
    });
    cloned.setSelector(selector);

    return metadataEdit.save(cloned, emits);
  };

  const onChangeValue = ({ metadata: _metadata }: { metadata?: any }) => {
    return metadataEdit.onChangeValue({ metadata: _metadata, selector });
  };

  const updateSelector = (updatedSelector: Selector) => {
    selector = updatedSelector;

    return metadataEdit.onChangeValue({
      metadata: metadataEdit.metadata.value,
      selector,
    });
  };

  return {
    save,
    cancel,
    metadata: metadataEdit.metadata,
    onChangeValue,
    message: metadataEdit.message,
    updateSelector,
    definition,
    parent,
  };
};
