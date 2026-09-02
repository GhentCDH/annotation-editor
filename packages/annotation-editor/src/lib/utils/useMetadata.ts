import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { resourceApi } from '@ghentcdh/crouton-vue';
import { useEditorState } from '../composables/useEditorState';

type MetadataProperties = {
  annotation: W3CAnnotation | null;
  type: string;
};

export const useMetadata = (properties: MetadataProperties) => {
  const { config, utils } = useEditorState();

  if (!properties.annotation) {
    return {};
  }
  const metadata = utils.getMetadata(properties.annotation);

  const annotationDef = config.annotation.getDefinition(properties.type);

  const resource = annotationDef ? resourceApi(annotationDef, {}) : null;

  return {
    metadata,
    annotationDef,
    resource,
  };
};
