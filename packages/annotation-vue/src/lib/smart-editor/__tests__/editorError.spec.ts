import { getErrorStatus, toEditorLoadError } from '../editorError';

describe('editorError', () => {
  it('detects an axios-style 404', () => {
    const error = {
      message: 'Request failed with status code 404',
      response: {
        status: 404,
        statusText: 'Not Found',
        data: { message: 'Text with id 12 does not exist' },
      },
    };

    const result = toEditorLoadError(error);

    expect(result.status).toBe(404);
    expect(result.isNotFound).toBe(true);
    expect(result.message).toBe('Text with id 12 does not exist');
    expect(result.cause).toBe(error);
  });

  it.each([
    ['status', { status: 404, message: 'Nope' }],
    ['statusCode', { statusCode: 404, message: 'Nope' }],
  ])('detects a 404 from the %s field', (_field, error) => {
    const result = toEditorLoadError(error);

    expect(result.status).toBe(404);
    expect(result.isNotFound).toBe(true);
  });

  it('falls back to the message when no structured status is available', () => {
    const result = toEditorLoadError(
      new Error('Failed to fetch: 404 Not Found'),
    );

    expect(getErrorStatus(new Error('Failed to fetch: 404 Not Found'))).toBe(
      404,
    );
    expect(result.isNotFound).toBe(true);
  });

  it('keeps generic errors as non-404 errors', () => {
    const result = toEditorLoadError(new Error('Network unavailable'));

    expect(result.status).toBeUndefined();
    expect(result.isNotFound).toBe(false);
    expect(result.message).toBe('Network unavailable');
  });

  it('handles non-error values', () => {
    const result = toEditorLoadError('something went wrong');

    expect(result.status).toBeUndefined();
    expect(result.isNotFound).toBe(false);
    expect(result.detail).toBe('something went wrong');
  });
});
