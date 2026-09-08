import {
  type AnnotationDefConfig,
  type AnnotationJsonConfig,
  type AnnotationResource,
  buildAnnotationDefinitions,
  type ContextBuilderFactory,
} from '@ghentcdh/annotation-core';

type GlobModule = { default: AnnotationJsonConfig } | AnnotationJsonConfig;

export type GlobModules = Record<string, GlobModule>;

const extractConfig = (mod: GlobModule): AnnotationJsonConfig => {
  if ('default' in mod) return mod.default;
  return mod;
};

export const loadAnnotationDefinitionsFromGlob = (
  modules: GlobModules,
  config: AnnotationDefConfig,
  factory?: ContextBuilderFactory,
): AnnotationResource[] => {
  const configs = Object.values(modules).map(extractConfig);
  return loadAnnotationDefinitionsFromConfigs(configs, config, factory);
};

export const loadAnnotationDefinitionsFromConfigs = (
  configs: AnnotationJsonConfig[],
  config: AnnotationDefConfig,
  factory?: ContextBuilderFactory,
): AnnotationResource[] => {
  return buildAnnotationDefinitions(configs, config, factory);
};

export type DefinitionsFetchFn = (
  url: string,
) => Promise<AnnotationJsonConfig[]>;

export const loadAnnotationDefinitionsFromUrls = async (urls: string[]) => {
  return Promise.all(
    urls.map((a) => {
      return fetch(a).then((r) => r.json());
    }),
  );
};
