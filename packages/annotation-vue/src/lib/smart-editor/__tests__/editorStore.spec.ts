import { type App, createApp, defineComponent, h } from 'vue';

import { type BaseAnnotation } from '@ghentcdh/annotated-text';
import { type SourceModel } from '@ghentcdh/annotation-core';
import { type AnnotationTransformer } from '@ghentcdh/annotation-ui';

import { provideAnnotationDefinitions } from '../../definitions/useAnnotationDefinitions';
import { type AnnotationEditorLoader } from '../AnnotationEditorLoader';
import { provideEditorStore } from '../editorStore';

const transformer = {
  parse: () => null,
  format: () => ({}) as BaseAnnotation,
} as AnnotationTransformer<BaseAnnotation>;

const source = {
  id: '1',
  uri: 'text:1',
  type: 'text',
  content: {
    offset: 0,
    text: 'Hello world',
  },
} as unknown as SourceModel;

type Store = ReturnType<typeof provideEditorStore<BaseAnnotation>>;

const createHarness = (loader: AnnotationEditorLoader<BaseAnnotation>) => {
  let store!: Store;
  const container = document.createElement('div');

  const Child = defineComponent({
    setup() {
      store = provideEditorStore(loader, transformer);
      return () => h('div');
    },
  });

  const Root = defineComponent({
    setup() {
      provideAnnotationDefinitions({});
      return () => h(Child);
    },
  });

  const app: App = createApp({ render: () => h(Root) });
  app.mount(container);

  return { store, unmount: () => app.unmount() };
};

const createLoader = (overrides: {
  loadSource?: (uri: string) => Promise<SourceModel>;
  loadAnnotations?: (uri: string) => Promise<BaseAnnotation[]>;
}) =>
  ({
    loadSource: async () => source,
    loadAnnotations: async () => [],
    loadResources: async () => [],
    ...overrides,
  }) as unknown as AnnotationEditorLoader<BaseAnnotation>;

describe('editorStore error handling', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('exposes a 404 error when loading the source fails', async () => {
    const loader = createLoader({
      loadSource: async () => {
        throw {
          message: 'Request failed with status code 404',
          response: { status: 404, data: { message: 'Text not found' } },
        };
      },
    });
    const { store, unmount } = createHarness(loader);

    store.setSourceUris(['text:1']);

    await vi.waitFor(() => expect(store.loading).toBe(false));

    expect(store.error).toMatchObject({
      status: 404,
      isNotFound: true,
      message: 'Text not found',
    });
    unmount();
  });

  it('clears the error after a successful retry', async () => {
    const loadSource = vi
      .fn()
      .mockRejectedValueOnce({ response: { status: 404 } })
      .mockResolvedValue(source);
    const loader = createLoader({ loadSource });
    const { store, unmount } = createHarness(loader);

    store.setSourceUris(['text:1']);
    await vi.waitFor(() => expect(store.error).not.toBeNull());

    store.reloadAll();
    await vi.waitFor(() => expect(store.loading).toBe(false));

    expect(store.error).toBeNull();
    expect(store.sources).toHaveLength(1);
    unmount();
  });

  it('ignores an error from a stale request', async () => {
    let rejectFirst!: (reason: unknown) => void;
    const firstRequest = new Promise<SourceModel>((_resolve, reject) => {
      rejectFirst = reject;
    });
    const loadSource = vi
      .fn()
      .mockReturnValueOnce(firstRequest)
      .mockResolvedValue(source);
    const loader = createLoader({ loadSource });
    const { store, unmount } = createHarness(loader);

    store.setSourceUris(['text:1']);
    store.setSourceUris(['text:2']);

    rejectFirst({ response: { status: 404 } });

    await vi.waitFor(() => expect(store.loading).toBe(false));

    expect(store.error).toBeNull();
    unmount();
  });
});
