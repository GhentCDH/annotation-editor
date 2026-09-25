import {
  type AnnotatedText,
  type CustomAnnotationStyle,
} from '@ghentcdh/annotated-text';
import { type UseResource } from '@ghentcdh/crouton-vue'; // Explicit type avoids TS2883 from complex Zod v4 schema chains in .d.ts output.
import {
  type AnnotationResource,
  type KeyLabel,
  type SourceModel,
} from '@ghentcdh/annotation-core';
import { EditorAnnotation } from '../adapter';

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

export type UIAnnotationConfiguration = {
  definitions: UIAnnotationDefinition[];
  getDefinition: (id: string) => UIAnnotationDefinition | undefined;
  rootTypes: Array<KeyLabel>;
  allowedChildrenPerType: AllowedChildrenPerType;
  createAnnotatedText: (
    id: string,
    sourceModel?: SourceModel,
  ) => AnnotatedText<EditorAnnotation>;
};
