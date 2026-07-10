import {
  type AnnotatedText,
  type BaseAnnotation,
  type CustomAnnotationStyle,
} from '@ghentcdh/annotated-text';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type AnnotationContext } from './annotation.contex';
import { type FormValidationDef } from './form-validation.type';
import { type KeyLabel } from './key-label.type';
import { type SourceModel } from './source.model';

export type UIAnnotationDefinition = {
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

export type UIAnnotationConfiguration<
  ANNOTATION extends BaseAnnotation = W3CAnnotation,
> = {
  definitions: UIAnnotationDefinition[];
  getDefinition: (id: string) => UIAnnotationDefinition | undefined;
  rootTypes: Array<KeyLabel>;
  allowedChildrenPerType: AllowedChildrenPerType;
  createAnnotatedText: (
    id: string,
    sourceModel?: SourceModel,
  ) => AnnotatedText<ANNOTATION>;
};
