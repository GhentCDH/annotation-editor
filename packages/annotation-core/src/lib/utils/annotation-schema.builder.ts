import { ControlBuilder, LayoutBuilder } from '@ghentcdh/crouton-forms-vue';
import { type AnnotationColumnConfig } from '../types/annotation-json-config.types';

const buildControlBuilder = (column: AnnotationColumnConfig) => {
  const builder = ControlBuilder.properties<any>(column.id);

  if (!column.fieldInput) return builder;

  const { type, options: fieldOptions = {} as any } = column.fieldInput;

  if (type === 'autocomplete') {
    return builder.autocomplete({
      ...(fieldOptions.uri && { uri: fieldOptions.uri }),
      ...(fieldOptions.resource && { resource: fieldOptions.resource }),
      ...(fieldOptions.valueKey && { valueKey: fieldOptions.valueKey }),
      ...(fieldOptions.labelKey && { labelKey: fieldOptions.labelKey }),
      ...(fieldOptions.enableCreate !== undefined && {
        enableCreate: fieldOptions.enableCreate,
      }),
      ...(fieldOptions.colspan && { colspan: fieldOptions.colspan }),
    } as any);
  }

  if (type === 'select') {
    return builder.select({
      ...(fieldOptions.values && { values: fieldOptions.values }),
      ...(fieldOptions.clearable !== undefined && {
        clearable: fieldOptions.clearable,
      }),
      ...(fieldOptions.storeValue !== undefined && {
        storeValue: fieldOptions.storeValue,
      }),
      ...(fieldOptions.emitObject !== undefined && {
        emitObject: fieldOptions.emitObject,
      }),
      ...(fieldOptions.colspan && { colspan: fieldOptions.colspan }),
    } as any);
  }

  return builder.control(type, {
    ...(fieldOptions.colspan && { colspan: fieldOptions.colspan }),
  } as any);
};

export const buildControlElement = (column: AnnotationColumnConfig) =>
  buildControlBuilder(column).build();

export const buildMetadataElement = (column: AnnotationColumnConfig) =>
  buildControlBuilder(column).readonly().build();

export const buildUiSchema = (columns: AnnotationColumnConfig[]) => {
  const layout = LayoutBuilder.grid<any>();

  columns
    .filter((col) => !col.hiddenInForm)
    .forEach((col) => layout.addControl(buildControlBuilder(col)));

  return layout.build();
};

export const buildMetadataSchema = (columns: AnnotationColumnConfig[]) => {
  const layout = LayoutBuilder.grid<any>();

  columns
    .filter((col) => !col.hiddenInMetadata)
    .forEach((col) => layout.addControl(buildControlBuilder(col).readonly()));

  return layout.build();
};
