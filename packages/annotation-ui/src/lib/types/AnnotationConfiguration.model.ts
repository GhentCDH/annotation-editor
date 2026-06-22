import {
  type AnnotatedText,
  type BaseAnnotation,
  type CustomAnnotationStyle,
} from '@ghentcdh/annotated-text';
import { type UISchemaElement } from '@jsonforms/core';
import { type AnnotationContext } from '@ghentcdh/annotation-core';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type SourceModel } from './source.model';
import { JsonFormsLayout } from '@ghentcdh/crouton-core';

export type KeyLabel<KEY = string> = {
  key: KEY;
  label: string;
  icon?: string;
};

export type FormValidationDef = {
  uiSchema: UISchemaElement;
  jsonSchema: JsonFormsLayout;
  metaDataSchema: UISchemaElement;
  validation: (value: any) => any;
};

export type AnnotationDefinition = {
  id: string;
  schema: FormValidationDef;
  label: string;
  style: CustomAnnotationStyle;
  allowedChildren: Array<KeyLabel>;
  allowedLinks: Array<KeyLabel>;
  isRoot?: boolean;
  context: AnnotationContext;
};

export type AllowedChildrenPerType = Record<string, Array<KeyLabel>>;

export type AnnotationConfiguration<
  ANNOTATION extends BaseAnnotation = W3CAnnotation,
> = {
  definitions: AnnotationDefinition[];
  getDefinition: (id: string) => AnnotationDefinition | undefined;
  rootTypes: Array<KeyLabel>;
  allowedChildrenPerType: AllowedChildrenPerType;
  createAnnotatedText: (
    id: string,
    sourceModel?: SourceModel,
  ) => AnnotatedText<ANNOTATION>;
};
