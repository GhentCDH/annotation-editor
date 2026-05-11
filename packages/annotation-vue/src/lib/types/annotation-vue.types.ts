import {
  type AnnotationDefinition as CoreAnnotationDefinition,
  type AnnotationStyle,
} from '@ghentcdh/annotation-core';
import { type ContextBuilder } from '@ghentcdh/w3c-utils';
import { type CustomAnnotationStyle } from '@ghentcdh/annotated-text';

export type KeyLabel<KEY = string> = {
  key: KEY;
  label: string;
  icon?: string;
};

export type FormValidationDef = {
  uiSchema: unknown;
  jsonSchema: unknown;
  metaDataSchema: unknown;
  validation: (value: unknown) => unknown;
};

export type VueAnnotationDefinition = {
  id: string;
  name: string;
  label: string;
  color: string;
  style: CustomAnnotationStyle;
  schema: FormValidationDef;
  allowedChildren: KeyLabel[];
  allowedLinks: KeyLabel[];
  isRoot: boolean;
  icon?: string;
  type?: string;
  target?: 'gutter' | 'underline' | 'highlight';
  context: ContextBuilder;
  _core: CoreAnnotationDefinition;
};

export type { AnnotationStyle };
