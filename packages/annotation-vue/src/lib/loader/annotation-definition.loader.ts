import {
  AnnotationConfigSchema,
  type AnnotationDefConfig,
  type AnnotationJsonResource,
  type AnnotationResource,
  buildAnnotationDefinitions,
  type ContextBuilderFactory,
} from '@ghentcdh/annotation-core';
import { parseSchema } from '@ghentcdh/crouton-vue';

type GlobModule = { default: AnnotationJsonResource } | AnnotationJsonResource;

export type GlobModules = Record<string, GlobModule>;

const extractConfig = (mod: GlobModule): AnnotationJsonResource => {
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
  configs: AnnotationJsonResource[],
  config: AnnotationDefConfig,
  factory?: ContextBuilderFactory,
): AnnotationResource[] => {
  return buildAnnotationDefinitions(configs, config, factory);
};

export type DefinitionsFetchFn = (
  url: string,
) => Promise<AnnotationJsonResource[]>;

export const loadAnnotationDefinitionsFromUrls = async (urls: string[]) => {
  return Promise.all(
    urls.map((a) => {
      return fetch(a).then((r) => r.json());
    }),
  );
};

export const loadAnnotationDefFromResourceUris = async (urls: string[]) => {
  return Promise.all(
    urls.map((a) => {
      return fetch(a)
        .then((r) => r.json())
        .then((def) =>
          parseSchema(def, {
            baseUrl: '',
            extensions: {
              annotation: AnnotationConfigSchema,
            },
          }),
        );
    }),
  );
};
