import { type EmitFn } from 'vue';
import {
  editorAnnotationSchema,
  type Selector,
  SelectorSchema,
} from '@ghentcdh/annotation-ui';
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
  // annotation is required at runtime (modal is always shown with one); ref is
  // declared optional so Vue doesn't enforce the prop on the component boundary
  const annotation = props.annotation!;

  let selector: Selector | undefined = annotation.getSelector(props.source.uri);

  const { getDefinition, findAnnotation } = useEditorState();
  const definition = getDefinition(annotation.definitionUri);
  const metadataEdit = useMetadataEdit(annotation, definition);
  const parent = annotation.parentId
    ? findAnnotation(annotation.parentId)
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
    const originalAnnotation = annotation.id
      ? annotation
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

    if (parent) {
      const select = parent.getSelector(props.source.uri);
      if (!select) return metadataEdit.save(cloned, emits);
      const start = selector.start - select.start;
      const length = selector.end - selector.start;
      const parentSelector = SelectorSchema.parse({
        exact: selector.exact,
        prefix: selector.prefix,
        suffix: selector.suffix,
        start,
        end: start + length,
        uri: parent.id,
      });

      cloned.setSelector(parentSelector);
    }

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
