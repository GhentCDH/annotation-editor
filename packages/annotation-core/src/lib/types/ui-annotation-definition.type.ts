import {
  type AnnotatedText,
  type BaseAnnotation,
  type CustomAnnotationStyle,
} from '@ghentcdh/annotated-text';
import { type ContextBuilder, type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type ViewConfig } from '@ghentcdh/crouton-core';
import { type KeyLabel } from './key-label.type';
import { type SourceModel } from './source.model';
import { type ViewDef } from './annotation-definition.type';

export type UIAnnotationDefinition = {
  id: string;
  label: string;
  style: CustomAnnotationStyle;
  allowedChildren: Array<KeyLabel>;
  allowedLinks: Array<KeyLabel>;
  isRoot?: boolean;
  context?: ContextBuilder;
  views: Record<ViewDef, ViewConfig>;
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
