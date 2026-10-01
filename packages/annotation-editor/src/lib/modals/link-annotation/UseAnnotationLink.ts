import { type EmitFn } from 'vue';
import { editorAnnotationSchema } from '@ghentcdh/annotation-ui';
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
  const { findAnnotation, getDefinition } = useEditorState();
  const definitionUri = props.definitionUri || props.annotation.definitionUri;
  const definition = getDefinition(definitionUri);

  const metadata = {};
  const annotations = props.annotation.links.map((l) => findAnnotation(l.uri));

  const metadataEdit = useMetadataEdit(props.annotation, definition);

  const cancel = () => {
    emits('close', null);
  };

  const save = () => {
    metadataEdit.message.value = { status: 'saving' };

    const originalAnnotation = props.annotation.id
      ? props.annotation
      : editorAnnotationSchema.parse({
          id: 'NEW_ANNOTATION',
          metadata,
          definitionUri: definition.id,
          label: '',
          links: props.annotation.links,
          selectors: [],
        });
    const cloned = originalAnnotation.clone({
      metadata,
    });

    return metadataEdit.save(cloned, emits);
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
    definition,
  };
};
