import { type AnnotationDefinition } from '@ghentcdh/annotation-core';
import { AnnotationDefinitionService } from '../../service/annotation-definition.service';
import {
  createAnnotationNamespacePaths,
  createAnnotationNamespaceRoutes,
} from '../annotation-namespace.routes';
import { installAnnotationNamespaceRoutes } from '../annotation-namespace.plugin';

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
  context: {
    toJsonLdContext: () => ({ '@context': id }),
    toJsonSchema: () => ({ type: 'object' }),
  },
  ...overrides,
});

describe('createAnnotationNamespacePaths', () => {
  it('should create paths with default base', () => {
    const paths = createAnnotationNamespacePaths();
    expect(paths.all).toBe('/ns');
    expect(paths.allJsonLd).toBe('/ns/anno.jsonld');
    expect(paths.byId('test')).toBe('/ns/test');
    expect(paths.jsonLdById('test')).toBe('/ns/test.jsonld');
    expect(paths.schemasById('test')).toBe('/ns/test/schemas');
    expect(paths.typeJsonLd('test')).toBe('/ns/test/anno.jsonld');
  });

  it('should create paths with custom base', () => {
    const paths = createAnnotationNamespacePaths('/api/v1/ns');
    expect(paths.all).toBe('/api/v1/ns');
    expect(paths.byId('x')).toBe('/api/v1/ns/x');
  });

  it('should normalize trailing slash', () => {
    const paths = createAnnotationNamespacePaths('/ns/');
    expect(paths.all).toBe('/ns');
    expect(paths.allJsonLd).toBe('/ns/anno.jsonld');
  });
});

describe('createAnnotationNamespaceRoutes', () => {
  it('should create route records', () => {
    const service = new AnnotationDefinitionService([
      createMockDefinition('a', 'Alpha'),
    ]);
    const routes = createAnnotationNamespaceRoutes('/ns', service);

    expect(routes).toHaveLength(6);

    const names = routes.map((r) => r.name);
    expect(names).toContain('annotation-ns-all');
    expect(names).toContain('annotation-ns-all-jsonld');
    expect(names).toContain('annotation-ns-jsonld');
    expect(names).toContain('annotation-ns-type-jsonld');
    expect(names).toContain('annotation-ns-schemas');
    expect(names).toContain('annotation-ns-by-id');
  });

  it('should use correct paths', () => {
    const service = new AnnotationDefinitionService();
    const routes = createAnnotationNamespaceRoutes('/api/ns', service);

    const paths = routes.map((r) => r.path);
    expect(paths).toContain('/api/ns');
    expect(paths).toContain('/api/ns/anno.jsonld');
    expect(paths).toContain('/api/ns/:id.jsonld');
    expect(paths).toContain('/api/ns/:type/anno.jsonld');
    expect(paths).toContain('/api/ns/:id/schemas');
    expect(paths).toContain('/api/ns/:id');
  });
});

describe('installAnnotationNamespaceRoutes', () => {
  it('should add routes to router', () => {
    const service = new AnnotationDefinitionService();
    const addRoute = vi.fn();
    const mockRouter = { addRoute } as any;

    installAnnotationNamespaceRoutes(mockRouter, service);

    expect(addRoute).toHaveBeenCalledTimes(6);
  });

  it('should use custom basePath', () => {
    const service = new AnnotationDefinitionService();
    const addRoute = vi.fn();
    const mockRouter = { addRoute } as any;

    installAnnotationNamespaceRoutes(mockRouter, service, {
      basePath: '/custom',
    });

    const paths = addRoute.mock.calls.map(
      (call: any[]) => call[0].path as string,
    );
    expect(paths.every((p: string) => p.startsWith('/custom'))).toBe(true);
  });
});
