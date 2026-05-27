import type { AnnotationContext } from '@ghentcdh/annotation-core';
import type { AnnotationDefinition } from '@ghentcdh/annotation-editor';

/** Minimal AnnotationContext stub — sufficient for the playground. */
const ctx = (id: string, name: string, color: string): AnnotationContext =>
  ({
    id,
    name,
    color,
    isRoot: true,
    created_at: new Date(),
    updated_at: new Date(),
    // ContextBuilder is only needed for JSON-LD export — not used in the editor UI
    context: { toJsonLdContext: () => ({}) },
  }) as unknown as AnnotationContext;

const noSchema = {
  uiSchema: { type: 'VerticalLayout', elements: [] },
  jsonSchema: { type: 'object', properties: {} },
  metaDataSchema: { type: 'VerticalLayout', elements: [] },
  validation: () => undefined,
};

export const mockAnnotationDefinitions: AnnotationDefinition[] = [
  {
    id: 'entity',
    label: 'Entity',
    isRoot: true,
    style: {
      default: { backgroundColor: '#4f46e5', backgroundOpacity: 0.25 },
      active: { backgroundColor: '#4f46e5', backgroundOpacity: 0.5 },
    },
    allowedChildren: [{ key: 'note', label: 'Note' }],
    allowedLinks: [],
    schema: noSchema,
    context: ctx('entity', 'Entity', '#4f46e5'),
  },
  {
    id: 'note',
    label: 'Note',
    isRoot: false,
    style: {
      default: { backgroundColor: '#16a34a', backgroundOpacity: 0.2 },
      active: { backgroundColor: '#16a34a', backgroundOpacity: 0.45 },
    },
    allowedChildren: [],
    allowedLinks: [],
    schema: noSchema,
    context: ctx('note', 'Note', '#16a34a'),
  },
];
