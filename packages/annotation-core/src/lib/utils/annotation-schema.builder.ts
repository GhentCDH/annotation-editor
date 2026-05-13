import { type AnnotationColumnConfig } from '../types/annotation-json-config.types';

export const buildControlElement = (column: AnnotationColumnConfig) => {
  const options: any = {};

  if (column.fieldInput) {
    const { type, options: fieldOptions } = column.fieldInput;
    options.format = type;

    if (type === 'autocomplete') {
      options.dataField = 'data';
      if (fieldOptions.uri) options.uri = fieldOptions.uri;
      if (fieldOptions.valueKey || fieldOptions.labelKey) {
        options.field = {
          id: fieldOptions.valueKey,
          label: fieldOptions.labelKey,
        };
      }
      if (fieldOptions.enableCreate !== undefined) {
        options.enableCreate = fieldOptions.enableCreate;
      }
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
