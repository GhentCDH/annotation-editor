import {
  type AnnotationJsonConfig,
  type AnnotationDefConfig,
  type AnnotationDefinition,
  type ContextBuilderFactory,
  buildAnnotationDefinitions,
} from '@ghentcdh/annotation-core';

type GlobModule =
  | { default: AnnotationJsonConfig }
  | AnnotationJsonConfig;

export type GlobModules = Record<string, GlobModule>;

const extractConfig = (mod: GlobModule): AnnotationJsonConfig => {
  if ('default' in mod) return mod.default;
  return mod;
};

export const loadAnnotationDefinitionsFromGlob = (
  modules: GlobModules,
  config: AnnotationDefConfig,
  factory?: ContextBuilderFactory,
): AnnotationDefinition[] => {
  const configs = Object.values(modules).map(extractConfig);
  return loadAnnotationDefinitionsFromConfigs(configs, config, factory);
};

export const loadAnnotationDefinitionsFromConfigs = (
  configs: AnnotationJsonConfig[],
  config: AnnotationDefConfig,
  factory?: ContextBuilderFactory,
): AnnotationDefinition[] => {
  return buildAnnotationDefinitions(configs, config, factory);
};

export type DefinitionsFetchFn = (url: string) => Promise<AnnotationJsonConfig[]>;

const defaultFetchFn: DefinitionsFetchFn = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch annotation definitions: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export const loadAnnotationDefinitionsFromUrl = async (
  url: string,
  config: AnnotationDefConfig,
  factory?: ContextBuilderFactory,
  fetchFn: DefinitionsFetchFn = defaultFetchFn,
): Promise<AnnotationDefinition[]> => {
  const configs = await fetchFn(url);
  return loadAnnotationDefinitionsFromConfigs(configs, config, factory);
};
