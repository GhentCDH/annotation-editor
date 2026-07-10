export type FormValidationDef = {
  uiSchema: unknown;
  jsonSchema: unknown;
  metaDataSchema: unknown;
  validation: (value: unknown) => unknown;
};
