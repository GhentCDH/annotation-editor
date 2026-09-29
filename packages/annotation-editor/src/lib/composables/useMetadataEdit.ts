import { EditorAnnotation, Selector } from '@ghentcdh/annotation-ui';
import { ref } from 'vue';
import { useEditorState } from './useEditorState';
import { useAnnotationResource } from './useAnnotationResource';

export const useMetadataEdit = (annotation: EditorAnnotation) => {
  const { editorState } = useEditorState();
  const resource = useAnnotationResource(annotation);

  let metadata = ref(annotation.metadata ?? {});
  let hasChanged = ref(false);

  const onChangeValue = ({
    metadata: _metadata,
    selector,
  }: {
    metadata?: any;
    selector?: Selector;
  }) => {
    hasChanged.value = true;
    metadata.value = editorState.annotationTransformer.transformMetadata(
      _metadata,
      selector,
    );
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
