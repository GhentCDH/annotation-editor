import { ref, toRaw } from 'vue';

import {
  type AnnotationMetadata,
  type EditorAnnotation,
  type Selector,
  type UIAnnotationDefinition,
} from '@ghentcdh/annotation-ui';

import { useAnnotationResource } from './useAnnotationResource';
import { useEditorState } from './useEditorState';

export const useMetadataEdit = (
  annotation: EditorAnnotation,
  definition: UIAnnotationDefinition,
) => {
  const { editorState } = useEditorState();
  const resource = useAnnotationResource(annotation, definition);

  const metadata = ref(annotation.metadata ?? {});
  const hasChanged = ref(false);

  const onChangeValue = ({
    metadata: _metadata,
    selector,
  }: {
    metadata: AnnotationMetadata;
    selector?: Selector;
  }) => {
    hasChanged.value = true;
    const transformed = editorState.transformMetadata(_metadata, selector!);
    metadata.value = structuredClone(toRaw(transformed));
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
