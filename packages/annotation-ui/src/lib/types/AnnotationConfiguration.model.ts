import { type UISchemaElement } from '@jsonforms/core';
import { type JsonFormsLayout } from '@ghentcdh/crouton-forms-vue';

export type { KeyLabel } from '@ghentcdh/annotation-core';

export type {
  UIAnnotationDefinition,
  AllowedChildrenPerType,
  UIAnnotationConfiguration,
} from '@ghentcdh/annotation-core';

// Backwards-compatible aliases
export type {
  UIAnnotationDefinition as AnnotationDefinition,
  UIAnnotationConfiguration as AnnotationConfiguration,
} from '@ghentcdh/annotation-core';

/**
 * Narrowed FormValidationDef with concrete JSON Forms types.
 * The generic version lives in `@ghentcdh/annotation-core`.
 */
export type FormValidationDef = {
  uiSchema: UISchemaElement;
  jsonSchema: JsonFormsLayout;
  metadataSchema?: UISchemaElement;
  // @deprecated use metadataSchema
  metaDataSchema?: UISchemaElement;
  validation: (value: any) => any;
};
