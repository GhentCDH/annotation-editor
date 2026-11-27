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
    // Inputs may be (nested) reactive proxies — form data, drawer selector — and
    // structuredClone throws DataCloneError on proxies; toRaw on the result is only shallow.
    const transformed = editorState.transformMetadata(
      toRaw(_metadata),
      toRaw(selector)!,
    );
    metadata.value = structuredClone(transformed);
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
