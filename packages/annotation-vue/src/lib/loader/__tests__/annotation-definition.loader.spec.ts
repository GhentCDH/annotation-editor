import {
  type AnnotationJsonConfig,
  type AnnotationDefConfig,
} from '@ghentcdh/annotation-core';
import {
  loadAnnotationDefinitionsFromGlob,
  loadAnnotationDefinitionsFromConfigs,
} from '../annotation-definition.loader';

const mockConfig: AnnotationDefConfig = {
  baseUrl: 'http://test/',
  app: 'test',
  prefix: 'test',
  isDev: true,
  cacheTTLms: 0,
};

const mockFactory = (id: string) => ({
  toJsonLdContext: () => ({ '@context': id }),
  toJsonSchema: () => ({ type: 'object' }),
});

const createJsonConfig = (
  id: string,
  name: string,
): AnnotationJsonConfig => ({
  id,
  name,
  color: '#ff0000',
});

describe('loadAnnotationDefinitionsFromGlob', () => {
  it('should extract configs from glob modules with default export', () => {
    const modules = {
      './configs/a.json': { default: createJsonConfig('a', 'Alpha') },
      './configs/b.json': { default: createJsonConfig('b', 'Beta') },
    };
    const defs = loadAnnotationDefinitionsFromGlob(
      modules,
      mockConfig,
      mockFactory,
    );
    expect(defs).toHaveLength(2);
    expect(defs[0].id).toBe('a');
    expect(defs[1].id).toBe('b');
  });

  it('should extract configs from glob modules without default export', () => {
    const modules = {
      './configs/a.json': createJsonConfig('a', 'Alpha'),
    };
    const defs = loadAnnotationDefinitionsFromGlob(
      modules,
      mockConfig,
      mockFactory,
    );
    expect(defs).toHaveLength(1);
    expect(defs[0].id).toBe('a');
  });

  it('should return empty array for empty modules', () => {
    const defs = loadAnnotationDefinitionsFromGlob({}, mockConfig, mockFactory);
    expect(defs).toEqual([]);
  });
});

describe('loadAnnotationDefinitionsFromConfigs', () => {
  it('should build definitions from configs array', () => {
    const configs = [
      createJsonConfig('a', 'Alpha'),
      createJsonConfig('b', 'Beta'),
    ];
    const defs = loadAnnotationDefinitionsFromConfigs(
      configs,
      mockConfig,
      mockFactory,
    );
    expect(defs).toHaveLength(2);
    expect(defs[0].name).toBe('Alpha');
    expect(defs[1].name).toBe('Beta');
  });

  it('should preserve config properties in definitions', () => {
    const configs: AnnotationJsonConfig[] = [
      {
        id: 'test',
        name: 'Test',
        color: '#123456',
        icon: 'star',
        type: 'custom',
        isRoot: false,
        target: 'gutter',
        allowedChildren: ['child1'],
        allowedLinks: ['link1'],
      },
    ];
    const defs = loadAnnotationDefinitionsFromConfigs(
      configs,
      mockConfig,
      mockFactory,
    );
    expect(defs[0].color).toBe('#123456');
    expect(defs[0].icon).toBe('star');
    expect(defs[0].type).toBe('custom');
    expect(defs[0].isRoot).toBe(false);
    expect(defs[0].target).toBe('gutter');
    expect(defs[0].allowedChildren).toEqual(['child1']);
    expect(defs[0].allowedLinks).toEqual(['link1']);
  });
});
