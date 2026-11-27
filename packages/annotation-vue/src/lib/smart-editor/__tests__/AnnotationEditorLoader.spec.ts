import { type App, createApp, defineComponent, h, nextTick } from 'vue';

import { type BaseAnnotation } from '@ghentcdh/annotated-text';
import { type SourceModel } from '@ghentcdh/annotation-core';

import { provideAnnotationDefinitions } from '../../definitions/useAnnotationDefinitions';
import { AnnotationEditorLoader } from '../AnnotationEditorLoader';

class TestLoader extends AnnotationEditorLoader<BaseAnnotation> {
  public loadResourcesImpl: () => Promise<string[]> = async () => [];

  async loadResources(): Promise<string[]> {
    return this.loadResourcesImpl();
  }

  async loadSource(): Promise<SourceModel> {
    throw new Error('not used');
  }

  async loadAnnotations(): Promise<BaseAnnotation[]> {
    return [];
  }
}

const createLoader = () => {
  let loader!: TestLoader;
  const container = document.createElement('div');

  const Root = defineComponent({
    setup() {
      provideAnnotationDefinitions({});
      loader = new TestLoader();
      return () => h('div');
    },
  });

  const app: App = createApp({ render: () => h(Root) });
  app.mount(container);
  return loader;
};

describe('AnnotationEditorLoader definitions loading', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('stops the loading state and stores the error when resources 404', async () => {
    const loader = createLoader();
    loader.loadResourcesImpl = async () => {
      throw {
        response: { status: 404, data: { message: 'Models not found' } },
      };
    };

    await loader.loadDefinitions();
    await nextTick();

    expect(loader.definitionsLoaded.value).toBe(true);
    expect(loader.definitionsError.value).toMatchObject({
      status: 404,
      isNotFound: true,
      message: 'Models not found',
    });
  });

  it('clears the error when a retry succeeds', async () => {
    const loader = createLoader();
    loader.loadResourcesImpl = async () => {
      throw { response: { status: 404 } };
    };

    await loader.loadDefinitions();
    await nextTick();
    expect(loader.definitionsError.value).not.toBeNull();

    loader.loadResourcesImpl = async () => [];
    await loader.reloadDefinitions();
    await nextTick();

    expect(loader.definitionsError.value).toBeNull();
    expect(loader.definitionsLoaded.value).toBe(true);
  });
});
