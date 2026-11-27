import { type App, createApp, h } from 'vue';

import SmartEditorError from '../SmartEditorError.vue';
import { type EditorLoadError } from '../editorError';

const createError = (
  overrides: Partial<EditorLoadError> = {},
): EditorLoadError => ({
  message: 'Could not load the annotation editor.',
  detail: 'Request failed with status code 500',
  isNotFound: false,
  ...overrides,
});

const mountError = (error: EditorLoadError) => {
  const container = document.createElement('div');
  const onRetry = vi.fn();

  const app: App = createApp({
    render: () => h(SmartEditorError, { error, onRetry }),
  });
  app.mount(container);

  return { container, onRetry, unmount: () => app.unmount() };
};

describe('SmartEditorError', () => {
  it('shows the 404 copy for a not-found error', () => {
    const { container, unmount } = mountError(
      createError({ isNotFound: true, status: 404 }),
    );
    const text = container.textContent ?? '';

    expect(text).toContain('Text not found');
    expect(text).toContain('could not be found (404)');
    expect(text).not.toContain('Request failed with status code 500');
    unmount();
  });

  it('shows the generic message and backend detail for other errors', () => {
    const { container, unmount } = mountError(createError());
    const text = container.textContent ?? '';

    expect(text).toContain('Could not load the editor');
    expect(text).toContain('Request failed with status code 500');
    unmount();
  });

  it('emits retry when the retry button is clicked', async () => {
    const { container, onRetry, unmount } = mountError(createError());

    container.querySelector('button')?.click();
    await Promise.resolve();

    expect(onRetry).toHaveBeenCalledTimes(1);
    unmount();
  });
});
