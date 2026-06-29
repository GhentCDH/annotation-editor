import { type AnnotationColumnConfig } from '../types/annotation-json-config.types';

export const buildControlElement = (column: AnnotationColumnConfig) => {
  const options: any = {};

  if (column.fieldInput) {
    const { type } = column.fieldInput;
    const fieldOptions = column.fieldInput.options ?? {};
    options.format = type;

    if (fieldOptions.colspan) options.colspan = fieldOptions.colspan;

    if (type === 'autocomplete') {
      options.dataField = 'data';
      if (fieldOptions.uri) options.uri = fieldOptions.uri;
      if (fieldOptions.resource) options.resource = fieldOptions.resource;
      if (fieldOptions.valueKey) options.valueKey = fieldOptions.valueKey;
      if (fieldOptions.labelKey) options.labelKey = fieldOptions.labelKey;
      if (fieldOptions.enableCreate !== undefined) {
        options.enableCreate = fieldOptions.enableCreate;
      }
    }

    if (type === 'select') {
      if (fieldOptions.values) options.values = fieldOptions.values;
      if (fieldOptions.clearable !== undefined)
        options.clearable = fieldOptions.clearable;
      if (fieldOptions.storeValue !== undefined)
        options.storeValue = fieldOptions.storeValue;
      if (fieldOptions.emitObject !== undefined)
        options.emitObject = fieldOptions.emitObject;
    }
  }

  return {
    type: 'Control',
    scope: `#/properties/${column.id}`,
    options,
  };
};

export const buildMetadataElement = (column: AnnotationColumnConfig) => ({
  type: 'TextCell',
  scope: `#/properties/${column.id}`,
  options: {
    format: 'keyValue',
    key: column.fieldInput?.options?.labelKey ?? column.displayKey ?? 'label',
  },
});

export const buildUiSchema = (columns: AnnotationColumnConfig[]) => ({
  type: 'GridLayout',
  elements: columns.filter((col) => !col.hiddenInForm).map(buildControlElement),
  options: {},
});

export const buildMetadataSchema = (columns: AnnotationColumnConfig[]) => ({
  type: 'GridLayout',
  elements: columns
    .filter((col) => !col.hiddenInMetadata)
    .map(buildMetadataElement),
  options: {},
});
