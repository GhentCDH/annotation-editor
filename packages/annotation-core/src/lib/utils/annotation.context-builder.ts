import { contextBuilder, type ContextBuilder } from '@ghentcdh/w3c-utils';
import { AnnotationMetadataType } from '../types/annotation.contex';

export type AnnotationDefConfig = {
  baseUrl: string;
  app: string;
  crudController: string;
  prefix: string;
  isDev: boolean;
  cacheTTLms: number;
};

const defaultConfig = {
  baseUrl: 'http://localhost:3000/',
  crudController: 'annotation',
  app: 'ghentcdh',
  prefix: 'ghentcdh',
  isDev: false,
  cacheTTLms: 20 * 60 * 1000,
};

export const resolveConfig = (config: Partial<AnnotationDefConfig> = {}) => {
  const baseUrl = config.baseUrl ?? defaultConfig.baseUrl;
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const isDev = config.isDev ?? false;
  const cacheTTLms = isDev ? 0 : 20 * 60 * 1000; // Cache for 20 minutes in production, no cache in development
  return {
    baseUrl: normalizedBaseUrl,
    contextUrl: `${normalizedBaseUrl}ns/`,
    app: config.app ?? defaultConfig.app,
    prefix: config.prefix ?? defaultConfig.prefix,
    crudController: config.crudController ?? defaultConfig.crudController,
    isDev,
    cacheTTLms,
  };
};

export const baseContextBuilder = (
  id: string,
  config: AnnotationDefConfig,
): ContextBuilder => {
  const { prefix, baseUrl, contextUrl } = resolveConfig(config);
  const metaData = AnnotationMetadataType;

  return contextBuilder(prefix, baseUrl)
    .setType(prefix, metaData)
    .addPrefix(id, `${prefix}:${id}`)
    .setContextUri(`${contextUrl}${id}.jsonld`);
};
