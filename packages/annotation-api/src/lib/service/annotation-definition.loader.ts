import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
  AnnotationColumnConfig,
  AnnotationJsonConfig,
} from './annotation-json-config.types';
import { type AnnotationDefinition } from '../annotation-defintion.type';
import { type AnnotationDefConfig } from '../utils/annotation.context-builder';

const buildControlElement = (column: AnnotationColumnConfig) => {
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

const buildMetadataElement = (column: AnnotationColumnConfig) => ({
  type: 'TextCell',
  scope: `#/properties/${column.id}`,
  options: {
    format: 'keyValue',
    key: column.fieldInput?.options?.labelKey ?? column.displayKey ?? 'label',
  },
});

const buildUiSchema = (columns: AnnotationColumnConfig[]) => ({
  type: 'HorizontalLayout',
  elements: columns.filter((col) => !col.hiddenInForm).map(buildControlElement),
  options: {},
});

const buildMetadataSchema = (columns: AnnotationColumnConfig[]) => ({
  type: 'HorizontalLayout',
  elements: columns
    .filter((col) => !col.hiddenInMetadata)
    .map(buildMetadataElement),
  options: {},
});

export const loadAnnotationDefinitionsFromDir = (
  dirPath: string,
  annotationDefConfig: AnnotationDefConfig,
  contextBuilderFactory: (
    id: string,
    config: AnnotationJsonConfig,
    annotationDefConfig: AnnotationDefConfig,
  ) => unknown,
): AnnotationDefinition[] => {
  if (!existsSync(dirPath)) return [];

  const entries = readdirSync(dirPath, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

  const definitions: AnnotationDefinition[] = [];

  for (const dir of dirs) {
    const jsonFile = join(dirPath, dir, 'resource.json');
    if (!existsSync(jsonFile)) continue;

    const json: AnnotationJsonConfig = JSON.parse(
      readFileSync(jsonFile, 'utf-8'),
    );

    const context = contextBuilderFactory(json.id, json, annotationDefConfig);
    const columns = json.columns ?? [];
    const hasColumns = columns.length > 0;

    const uiSchema =
      json.ui_schema ?? (hasColumns ? buildUiSchema(columns) : undefined);
    const metadataSchema =
      json.metadata_schema ??
      (hasColumns ? buildMetadataSchema(columns) : undefined);

    const definition: AnnotationDefinition = {
      id: json.id,
      name: json.name,
      color: json.color,
      columns: columns as unknown as AnnotationDefinition['columns'],
      context,
      json_ld: (context as any).toJsonLdContext(),
      json_schema: uiSchema ? (context as any).toJsonSchema() : null,
    };

    if (uiSchema) definition.ui_schema = uiSchema;
    if (metadataSchema) definition.metadata_schema = metadataSchema;
    if (json.type) definition.type = json.type;
    if (json.icon) definition.icon = json.icon;
    if (json.target) definition.target = json.target;

    definitions.push(definition);
  }

  return definitions;
};
