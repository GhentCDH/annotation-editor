import { type AnnotationDefinition } from '@ghentcdh/annotation-core';
import { AnnotationDefinitionService } from '../annotation-definition.service';

const createMockDefinition = (
  id: string,
  name: string,
  overrides?: Partial<AnnotationDefinition>,
): AnnotationDefinition => ({
  id,
  name,
  color: '#000',
  columns: [],
  isRoot: true,
  context: { toJsonLdContext: () => ({ '@context': id }) },
  ...overrides,
});

describe('AnnotationDefinitionService', () => {
  it('should return empty array when no definitions set', () => {
    const service = new AnnotationDefinitionService();
    expect(service.findAll()).toEqual([]);
    expect(service.findAllGrouped()).toEqual({});
  });

  it('should accept definitions via constructor', () => {
    const defs = [createMockDefinition('a', 'Alpha')];
    const service = new AnnotationDefinitionService(defs);
    expect(service.findAll()).toHaveLength(1);
    expect(service.findAll()[0].id).toBe('a');
  });

  it('should set and find all definitions', () => {
    const service = new AnnotationDefinitionService();
    const defs = [
      createMockDefinition('a', 'Alpha'),
      createMockDefinition('b', 'Beta'),
    ];
    service.setDefinitions(defs);
    expect(service.findAll()).toHaveLength(2);
  });

  it('should find by id', () => {
    const defs = [
      createMockDefinition('a', 'Alpha'),
      createMockDefinition('b', 'Beta'),
    ];
    const service = new AnnotationDefinitionService(defs);
    expect(service.findById('a')?.name).toBe('Alpha');
    expect(service.findById('b')?.name).toBe('Beta');
  });

  it('should return undefined for unknown id', () => {
    const service = new AnnotationDefinitionService([
      createMockDefinition('a', 'Alpha'),
    ]);
    expect(service.findById('unknown')).toBeUndefined();
  });

  it('should return grouped definitions', () => {
    const defs = [
      createMockDefinition('a', 'Alpha'),
      createMockDefinition('b', 'Beta'),
    ];
    const service = new AnnotationDefinitionService(defs);
    const grouped = service.findAllGrouped();
    expect(grouped['a'].name).toBe('Alpha');
    expect(grouped['b'].name).toBe('Beta');
  });

  it('should return context builders', () => {
    const ctx = { toJsonLdContext: () => ({}) };
    const defs = [createMockDefinition('a', 'Alpha', { context: ctx })];
    const service = new AnnotationDefinitionService(defs);
    expect(service.getAllContextBuilders()).toEqual([ctx]);
  });

  it('should return context builder for type', () => {
    const ctx = { toJsonLdContext: () => ({}) };
    const defs = [createMockDefinition('a', 'Alpha', { context: ctx })];
    const service = new AnnotationDefinitionService(defs);
    expect(service.getContextBuilder('a')).toBe(ctx);
  });

  it('should return undefined context for unknown type', () => {
    const service = new AnnotationDefinitionService();
    expect(service.getContextBuilder('nope')).toBeUndefined();
  });

  it('should replace definitions on setDefinitions', () => {
    const service = new AnnotationDefinitionService([
      createMockDefinition('a', 'Alpha'),
    ]);
    service.setDefinitions([createMockDefinition('b', 'Beta')]);
    expect(service.findAll()).toHaveLength(1);
    expect(service.findById('a')).toBeUndefined();
    expect(service.findById('b')?.name).toBe('Beta');
  });
});
