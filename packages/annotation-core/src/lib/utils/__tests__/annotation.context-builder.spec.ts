import { baseContextBuilder, resolveConfig } from '../annotation.context-builder';

describe('resolveConfig', () => {
  it('applies defaults', () => {
    expect(resolveConfig()).toEqual({
      baseUrl: 'http://localhost:3333/',
      contextUrl: 'http://localhost:3333/ns/',
      app: 'ghentcdh',
      prefix: 'ghentcdh',
      crudController: 'annotation/annotation',
      isDev: false,
      cacheTTLms: 20 * 60 * 1000,
    });
  });

  it.each`
    baseUrl                | expected
    ${'http://api.test'}   | ${'http://api.test/'}
    ${'http://api.test/'}  | ${'http://api.test/'}
  `('normalises baseUrl $baseUrl to end with a slash', ({ baseUrl, expected }) => {
    const config = resolveConfig({ baseUrl });

    expect(config.baseUrl).toBe(expected);
    expect(config.contextUrl).toBe(`${expected}ns/`);
  });

  it('disables the cache in dev mode', () => {
    expect(resolveConfig({ isDev: true }).cacheTTLms).toBe(0);
  });
});

describe('baseContextBuilder', () => {
  it('points the context uri at <baseUrl>ns/<id>.jsonld', () => {
    const builder = baseContextBuilder(
      'animals',
      resolveConfig({ baseUrl: 'http://api.test', prefix: 'test' }),
    );

    expect(builder.getContextUri()).toBe('http://api.test/ns/animals.jsonld');
  });
});
