import { type AnnotationColumnConfig } from '../../types/annotation-json-config.types';
import {
  buildControlElement,
  buildMetadataElement,
  buildUiSchema,
  buildMetadataSchema,
} from '../annotation-schema.builder';

describe('annotation-schema.builder', () => {
  describe('buildControlElement', () => {
    it('should build plain control without fieldInput', () => {
      const column: AnnotationColumnConfig = { id: 'name', label: 'Name' };
      const result = buildControlElement(column);

      expect(result.type).toBe('Control');
      expect(result.scope).toBe('#/properties/name');
    });

    it('should build text control', () => {
      const column: AnnotationColumnConfig = {
        id: 'title',
        label: 'Title',
        fieldInput: { type: 'text', options: {} },
      };
      const result = buildControlElement(column);

      expect(result.type).toBe('Control');
      expect(result.scope).toBe('#/properties/title');
      expect(result.options.format).toBe('text');
    });

    it('should build text control with colspan', () => {
      const column: AnnotationColumnConfig = {
        id: 'title',
        label: 'Title',
        fieldInput: { type: 'text', options: { colspan: 6 } },
      };
      const result = buildControlElement(column);

      expect(result.options.colspan).toBe(6);
    });

    it('should build select control with values and options', () => {
      const values = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const column: AnnotationColumnConfig = {
        id: 'gender',
        label: 'Gender',
        fieldInput: {
          type: 'select',
          options: {
            values,
            clearable: false,
            storeValue: true,
            emitObject: true,
            colspan: 4,
          },
        },
      };
      const result = buildControlElement(column);

      expect(result.type).toBe('Control');
      expect(result.scope).toBe('#/properties/gender');
      expect(result.options.format).toBe('select');
      expect(result.options.values).toEqual(values);
      expect(result.options.clearable).toBe(false);
      expect(result.options.storeValue).toBe(true);
      expect(result.options.emitObject).toBe(true);
      expect(result.options.colspan).toBe(4);
    });

    it('should build autocomplete control with uri', () => {
      const column: AnnotationColumnConfig = {
        id: 'author',
        label: 'Author',
        fieldInput: {
          type: 'autocomplete',
          options: {
            uri: '/api/authors',
            valueKey: 'id',
            labelKey: 'name',
            enableCreate: true,
          },
        },
      };
      const result = buildControlElement(column);

      expect(result.type).toBe('Control');
      expect(result.scope).toBe('#/properties/author');
      expect(result.options.format).toBe('autocomplete');
      expect(result.options.dataField).toBe('data');
      expect(result.options.uri).toBe('/api/authors');
      expect(result.options.valueKey).toBe('id');
      expect(result.options.labelKey).toBe('name');
      expect(result.options.enableCreate).toBe(true);
    });

    it('should build autocomplete control with resource', () => {
      const column: AnnotationColumnConfig = {
        id: 'tag',
        label: 'Tag',
        fieldInput: {
          type: 'autocomplete',
          options: { resource: 'tags', colspan: 6 },
        },
      };
      const result = buildControlElement(column);

      expect(result.options.format).toBe('autocomplete');
      expect(result.options.resource).toBe('tags');
      expect(result.options.colspan).toBe(6);
    });
  });

  describe('buildMetadataElement', () => {
    it('should build readonly control', () => {
      const column: AnnotationColumnConfig = {
        id: 'name',
        label: 'Name',
        fieldInput: { type: 'text', options: {} },
      };
      const result = buildMetadataElement(column);

      expect(result.type).toBe('Control');
      expect(result.scope).toBe('#/properties/name');
      expect(result.options.readonly).toBe(true);
    });

    it('should build readonly control for select', () => {
      const column: AnnotationColumnConfig = {
        id: 'gender',
        label: 'Gender',
        fieldInput: {
          type: 'select',
          options: {
            values: [{ value: 'm', label: 'Male' }],
            storeValue: true,
          },
        },
      };
      const result = buildMetadataElement(column);

      expect(result.type).toBe('Control');
      expect(result.options.readonly).toBe(true);
    });
  });

  describe('buildUiSchema', () => {
    it('should build GridLayout with controls', () => {
      const columns: AnnotationColumnConfig[] = [
        { id: 'name', label: 'Name', fieldInput: { type: 'text', options: {} } },
        { id: 'age', label: 'Age', fieldInput: { type: 'text', options: {} } },
      ];
      const result = buildUiSchema(columns);

      expect(result.type).toBe('GridLayout');
      expect(result.elements).toHaveLength(2);
      expect(result.elements[0].scope).toBe('#/properties/name');
      expect(result.elements[1].scope).toBe('#/properties/age');
    });

    it('should filter hiddenInForm columns', () => {
      const columns: AnnotationColumnConfig[] = [
        { id: 'name', label: 'Name', fieldInput: { type: 'text', options: {} } },
        {
          id: 'secret',
          label: 'Secret',
          hiddenInForm: true,
          fieldInput: { type: 'text', options: {} },
        },
      ];
      const result = buildUiSchema(columns);

      expect(result.elements).toHaveLength(1);
      expect(result.elements[0].scope).toBe('#/properties/name');
    });
  });

  describe('buildMetadataSchema', () => {
    it('should build GridLayout with readonly controls', () => {
      const columns: AnnotationColumnConfig[] = [
        { id: 'name', label: 'Name', fieldInput: { type: 'text', options: {} } },
      ];
      const result = buildMetadataSchema(columns);

      expect(result.type).toBe('GridLayout');
      expect(result.elements).toHaveLength(1);
      expect(result.elements[0].options.readonly).toBe(true);
    });

    it('should filter hiddenInMetadata columns', () => {
      const columns: AnnotationColumnConfig[] = [
        { id: 'name', label: 'Name', fieldInput: { type: 'text', options: {} } },
        {
          id: 'internal',
          label: 'Internal',
          hiddenInMetadata: true,
          fieldInput: { type: 'text', options: {} },
        },
      ];
      const result = buildMetadataSchema(columns);

      expect(result.elements).toHaveLength(1);
      expect(result.elements[0].scope).toBe('#/properties/name');
    });
  });
});
