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
