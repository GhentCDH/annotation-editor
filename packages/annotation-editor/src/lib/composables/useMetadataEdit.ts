import { type EditorAnnotation, type Selector } from '@ghentcdh/annotation-ui';
import { ref } from 'vue';
import { useEditorState } from './useEditorState';
import { useAnnotationResource } from './useAnnotationResource';

export const useMetadataEdit = (annotation: EditorAnnotation) => {
  const { editorState } = useEditorState();
  const resource = useAnnotationResource(annotation);

  const metadata = ref(annotation.metadata ?? {});
  const hasChanged = ref(false);

  const onChangeValue = ({
    metadata: _metadata,
    selector,
  }: {
    metadata?: any;
    selector?: Selector;
  }) => {
    hasChanged.value = true;
    metadata.value = editorState.transformMetadata(_metadata, selector);
    return metadata.value;
  };

  return {
    metadata,
    message: resource.message,
    hasChanged,
    onChangeValue,
    save: resource.save,
  };
};
