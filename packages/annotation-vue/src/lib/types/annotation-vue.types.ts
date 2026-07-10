import {
  type AnnotationDefinition as CoreAnnotationDefinition,
  type FormValidationDef,
  type KeyLabel,
} from '@ghentcdh/annotation-core';
import { type ContextBuilder } from '@ghentcdh/w3c-utils';
import { type CustomAnnotationStyle } from '@ghentcdh/annotated-text';

export type { KeyLabel, FormValidationDef } from '@ghentcdh/annotation-core';

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

