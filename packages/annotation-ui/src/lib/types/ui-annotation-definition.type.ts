import {
  type AnnotatedText,
  type BaseAnnotation,
  type CustomAnnotationStyle,
  TextAdapter,
} from '@ghentcdh/annotated-text';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type UseResource } from '@ghentcdh/crouton-vue'; // Explicit type avoids TS2883 from complex Zod v4 schema chains in .d.ts output.
import {
  type AnnotationResource,
  type KeyLabel,
  type SourceModel,
} from '@ghentcdh/annotation-core';
import { type AnnotationEditorAdapter } from '../adapter';

// Explicit type avoids TS2883 from complex Zod v4 schema chains in .d.ts output.
export type UIAnnotationDefinition = AnnotationResource & {
  label: string;
  style?: CustomAnnotationStyle;
  allowedChildren: Array<KeyLabel>;
  allowedLinks: Array<KeyLabel>;
  _core?: AnnotationResource;
  resource?: UseResource | null;
};

export type AllowedChildrenPerType = Record<string, Array<KeyLabel>>;

export type UIAnnotationConfiguration<
  ANNOTATION extends BaseAnnotation = W3CAnnotation,
> = {
  definitions: UIAnnotationDefinition[];
  getDefinition: (id: string) => UIAnnotationDefinition | undefined;
  getMetadata: (id: ANNOTATION) => any | undefined;
  getDefinitionForAnnotation: (
    id: ANNOTATION,
  ) => UIAnnotationDefinition | undefined;
  rootTypes: Array<KeyLabel>;
  allowedChildrenPerType: AllowedChildrenPerType;
  createAnnotatedText: (
    id: string,
    sourceModel?: SourceModel,
  ) => {
    annotatedText: AnnotatedText<ANNOTATION>;
    textAdapter: TextAdapter;
    annotationAdapter: AnnotationEditorAdapter<ANNOTATION>;
  };
};
