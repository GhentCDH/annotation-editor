import { type EmitFn } from 'vue';
import {
  type LinkAnnotationProps,
  type LinkEmits,
} from './link-annotation.properties';
import { useEditorState } from '../../composables/useEditorState';
import { useMetadataEdit } from '../../composables/useMetadataEdit';

export const useAnnotationLink = (
  props: LinkAnnotationProps,
  emits: EmitFn<typeof LinkEmits>,
) => {
  const { findAnnotation } = useEditorState();

  const metadata = {};
  const annotations = props.annotation.links.map((l) => findAnnotation(l.uri));

  const metadataEdit = useMetadataEdit(props.annotation);

  const cancel = () => {
    emits('close', null);
  };

  const save = () => {
    metadataEdit.message.value = { status: 'saving' };

    const originalAnnotation = originalAnnotation.clone({
      metadata: metadataEdit.metadata.value,
    });

    metadataEdit.save(originalAnnotation);
  };
  const onChangeValue = ({ metadata: _metadata }: { metadata?: any }) => {
    return metadataEdit.onChangeValue({ metadata });
  };

  return {
    save,
    cancel,
    metadata: metadataEdit.metadata,
    onChangeValue,
    message: metadataEdit.message,
    annotations,
  };
};
