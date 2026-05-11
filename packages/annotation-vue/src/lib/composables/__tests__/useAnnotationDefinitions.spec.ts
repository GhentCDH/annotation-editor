import { createApp, defineComponent, h, nextTick } from 'vue';
import {
  type AnnotationDefConfig,
  type AnnotationDefinition as CoreAnnotationDefinition,
} from '@ghentcdh/annotation-core';
import { type DefinitionsFetchFn } from '../../loader/annotation-definition.loader';
import {
  provideAnnotationDefinitions,
  useAnnotationDefinitions,
  type AnnotationDefinitionsState,
} from '../useAnnotationDefinitions';

const mockConfig: AnnotationDefConfig = {
  baseUrl: 'http://test/',
  app: 'test',
  prefix: 'test',
  isDev: true,
  cacheTTLms: 0,
};

const createCoreDef = (
  id: string,
  name: string,
  overrides?: Partial<CoreAnnotationDefinition>,
): CoreAnnotationDefinition => ({
  id,
  name,
  color: '#000',
  columns: [],
  isRoot: true,
  context: { toJsonLdContext: () => ({}) },
  ...overrides,
});

/**
 * Runs a callback inside a mounted component tree so provide/inject work.
 * Returns state from provideAnnotationDefinitions.
 */
const withProvide = (
  options: Parameters<typeof provideAnnotationDefinitions>[0],
  childFn?: (state: AnnotationDefinitionsState) => void,
): AnnotationDefinitionsState => {
  let state!: AnnotationDefinitionsState;

  const Child = defineComponent({
    setup() {
      const injected = useAnnotationDefinitions();
      if (childFn) childFn(injected);
      return () => h('div');
    },
  });

  const Root = defineComponent({
    setup() {
      state = provideAnnotationDefinitions(options);
      return () => h(Child);
    },
  });

  const el = document.createElement('div');
  createApp(Root).mount(el);
  return state;
};

describe('provideAnnotationDefinitions', () => {
  it('should initialize with empty definitions', () => {
    const state = withProvide({ config: mockConfig });
    expect(state.definitions).toEqual([]);
    expect(state.definitionsMap).toEqual({});
  });

  it('should auto-load from resourceFolder', () => {
    const modules = {
      './a.json': { default: { id: 'a', name: 'Alpha', color: '#000' } },
    };
    const factory = (id: string) => ({
      toJsonLdContext: () => ({ '@context': id }),
      toJsonSchema: () => ({ type: 'object' }),
    });
    const state = withProvide({
      config: mockConfig,
      resourceFolder: modules,
      factory,
    });
    expect(state.definitions).toHaveLength(1);
    expect(state.definitions[0].id).toBe('a');
  });

  it('should load from definitions', async () => {
    const state = withProvide({ config: mockConfig });

    state.loadFromDefinitions([
      createCoreDef('a', 'Alpha'),
      createCoreDef('b', 'Beta'),
    ]);
    await nextTick();

    expect(state.definitions).toHaveLength(2);
    expect(state.definitions[0].id).toBe('a');
    expect(state.definitions[0].label).toBe('Alpha');
    expect(state.definitions[1].id).toBe('b');
  });

  it('should map name to label in VueAnnotationDefinition', async () => {
    const state = withProvide({ config: mockConfig });

    state.loadFromDefinitions([createCoreDef('a', 'My Label')]);
    await nextTick();

    expect(state.definitions[0].label).toBe('My Label');
  });

  it('should build style from definition', async () => {
    const state = withProvide({ config: mockConfig });

    state.loadFromDefinitions([
      createCoreDef('a', 'Alpha', { color: '#ff0000', target: 'gutter' }),
    ]);
    await nextTick();

    const style = state.definitions[0].style;
    expect(style.id).toBe('a');
    expect(style.name).toBe('Alpha');
    expect(style.color).toBe('#ff0000');
    expect(style.target).toBe('gutter');
  });

  it('should use custom createHighlightStyle', async () => {
    const state = withProvide({
      config: mockConfig,
      createHighlightStyle: (def) => ({
        id: def.id,
        name: `custom-${def.name}`,
        color: '#custom',
      }),
    });

    state.loadFromDefinitions([createCoreDef('a', 'Alpha')]);
    await nextTick();

    expect(state.definitions[0].style.name).toBe('custom-Alpha');
    expect(state.definitions[0].style.color).toBe('#custom');
  });

  it('should resolve allowedChildren string IDs to KeyLabel', async () => {
    const state = withProvide({ config: mockConfig });

    state.loadFromDefinitions([
      createCoreDef('parent', 'Parent', { allowedChildren: ['child'] }),
      createCoreDef('child', 'Child', { icon: 'tag' }),
    ]);
    await nextTick();

    const parent = state.definitions.find((d) => d.id === 'parent');
    expect(parent?.allowedChildren).toEqual([
      { key: 'child', label: 'Child', icon: 'tag' },
    ]);
  });

  it('should resolve allowedLinks string IDs to KeyLabel', async () => {
    const state = withProvide({ config: mockConfig });

    state.loadFromDefinitions([
      createCoreDef('a', 'Alpha', { allowedLinks: ['b'] }),
      createCoreDef('b', 'Beta'),
    ]);
    await nextTick();

    const a = state.definitions.find((d) => d.id === 'a');
    expect(a?.allowedLinks).toEqual([{ key: 'b', label: 'Beta' }]);
  });

  it('should skip unknown IDs in allowedChildren', async () => {
    const state = withProvide({ config: mockConfig });

    state.loadFromDefinitions([
      createCoreDef('a', 'Alpha', { allowedChildren: ['unknown', 'b'] }),
      createCoreDef('b', 'Beta'),
    ]);
    await nextTick();

    const a = state.definitions.find((d) => d.id === 'a');
    expect(a?.allowedChildren).toHaveLength(1);
    expect(a?.allowedChildren[0].key).toBe('b');
  });

  it('should compute definitionsMap', async () => {
    const state = withProvide({ config: mockConfig });

    state.loadFromDefinitions([
      createCoreDef('a', 'Alpha'),
      createCoreDef('b', 'Beta'),
    ]);
    await nextTick();

    expect(state.definitionsMap['a'].label).toBe('Alpha');
    expect(state.definitionsMap['b'].label).toBe('Beta');
  });

  it('should get definition by id', async () => {
    const state = withProvide({ config: mockConfig });

    state.loadFromDefinitions([createCoreDef('a', 'Alpha')]);
    await nextTick();

    expect(state.getDefinitionById('a')?.label).toBe('Alpha');
    expect(state.getDefinitionById('unknown')).toBeUndefined();
  });

  it('should build schema from core definition', async () => {
    const state = withProvide({ config: mockConfig });

    state.loadFromDefinitions([
      createCoreDef('a', 'Alpha', {
        ui_schema: { type: 'Control' },
        json_schema: { type: 'object' },
        metadata_schema: { type: 'TextCell' },
      }),
    ]);
    await nextTick();

    const schema = state.definitions[0].schema;
    expect(schema.uiSchema).toEqual({ type: 'Control' });
    expect(schema.jsonSchema).toEqual({ type: 'object' });
    expect(schema.metaDataSchema).toEqual({ type: 'TextCell' });
    expect(typeof schema.validation).toBe('function');
  });

  it('should preserve _core reference', async () => {
    const state = withProvide({ config: mockConfig });

    const coreDef = createCoreDef('a', 'Alpha');
    state.loadFromDefinitions([coreDef]);
    await nextTick();

    expect(state.definitions[0]._core).toBe(coreDef);
  });

  it('should expose service instance', () => {
    const state = withProvide({ config: mockConfig });
    expect(typeof state.service.findAll).toBe('function');
    expect(typeof state.service.findById).toBe('function');
  });
});

describe('useAnnotationDefinitions', () => {
  it('should throw when called outside provider', () => {
    const Child = defineComponent({
      setup() {
        expect(() => useAnnotationDefinitions()).toThrow(
          'useAnnotationDefinitions() must be called inside a component that called provideAnnotationDefinitions()',
        );
        return () => h('div');
      },
    });

    const el = document.createElement('div');
    createApp(Child).mount(el);
  });

  it('should inject state from provider', () => {
    let injectedState!: AnnotationDefinitionsState;

    withProvide({ config: mockConfig }, (state) => {
      injectedState = state;
    });

    expect(injectedState).toBeDefined();
    expect(injectedState.definitions).toEqual([]);
    expect(typeof injectedState.getDefinitionById).toBe('function');
  });
});

describe('loadFromUrl', () => {
  it('should initialize loading false and error null', () => {
    const state = withProvide({ config: mockConfig });
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should load definitions from URL via custom fetchFn', async () => {
    const state = withProvide({ config: mockConfig });

    const mockFetchFn: DefinitionsFetchFn = vi.fn().mockResolvedValue([
      { id: 'url-a', name: 'UrlAlpha', color: '#aaa' },
      { id: 'url-b', name: 'UrlBeta', color: '#bbb' },
    ]);

    await state.loadFromUrl('/api/ns', mockFetchFn);
    await nextTick();

    expect(mockFetchFn).toHaveBeenCalledWith('/api/ns');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.definitions).toHaveLength(2);
    expect(state.definitions[0].id).toBe('url-a');
    expect(state.definitions[1].id).toBe('url-b');
  });

  it('should set error on fetch failure', async () => {
    const state = withProvide({ config: mockConfig });

    const mockFetchFn: DefinitionsFetchFn = vi
      .fn()
      .mockRejectedValue(new Error('Network error'));

    await state.loadFromUrl('/api/ns', mockFetchFn);
    await nextTick();

    expect(state.loading).toBe(false);
    expect(state.error).toBeInstanceOf(Error);
    expect(state.error?.message).toBe('Network error');
    expect(state.definitions).toEqual([]);
  });

  it('should auto-fetch when definitionsUrl provided', async () => {
    const mockFetchFn: DefinitionsFetchFn = vi.fn().mockResolvedValue([
      { id: 'auto', name: 'Auto', color: '#000' },
    ]);

    const state = withProvide({
      config: mockConfig,
      definitionsUrl: '/api/ns',
      fetchFn: mockFetchFn,
    });

    expect(mockFetchFn).toHaveBeenCalledWith('/api/ns');

    // Wait for async fetch to resolve
    await vi.waitFor(() => {
      expect(state.definitions).toHaveLength(1);
    });
    expect(state.definitions[0].id).toBe('auto');
    expect(state.loading).toBe(false);
  });

  it('should set loading true during fetch', async () => {
    const state = withProvide({ config: mockConfig });

    let resolvePromise!: (value: unknown[]) => void;
    const mockFetchFn: DefinitionsFetchFn = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    const promise = state.loadFromUrl('/api/ns', mockFetchFn);
    await nextTick();

    expect(state.loading).toBe(true);

    resolvePromise([]);
    await promise;
    await nextTick();

    expect(state.loading).toBe(false);
  });
});