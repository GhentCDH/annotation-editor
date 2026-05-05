export type AnnotationDefConfig = {
  baseUrl?: string;
  app?: string;
  prefix?: string;
};

const defaultConfig = {
  baseUrl: 'http://localhost:3000/',
  app: 'annotation-app',
  prefix: 'annotation',
};

export const resolveConfig = (config: AnnotationDefConfig = {}) => {
  const baseUrl = config.baseUrl ?? defaultConfig.baseUrl;
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return {
    baseUrl: normalizedBaseUrl,
    contextUrl: `${normalizedBaseUrl}ns/`,
    app: config.app ?? defaultConfig.app,
    prefix: config.prefix ?? defaultConfig.prefix,
  };
};
