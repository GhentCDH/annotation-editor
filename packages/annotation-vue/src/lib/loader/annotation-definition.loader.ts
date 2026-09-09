import {
  AnnotationConfigSchema,
  type AnnotationJsonResource,
  AnnotationJsonResourceSchema,
  type AnnotationResource,
} from '@ghentcdh/annotation-core';
import { parseSchema } from '@ghentcdh/crouton-core';

type GlobModule = { default: AnnotationJsonResource } | AnnotationJsonResource;

export type GlobModules = Record<string, GlobModule>;

export const buildAnnotationDefFromJson = (
  resource: AnnotationJsonResource,
): AnnotationResource | null => {
  try {
    const parsed = AnnotationJsonResourceSchema.safeParse(resource);
    if (!parsed.success) {
      console.error('Resource cannot be parsed:', parsed.error.message);
      return null;
    }

    // Compile columns → table/form/view schemas via crouton.
    // Returns undefined when resource has no columns/views.
    const compiled = parseSchema(resource, {
      baseUrl: '',
      extensions: { annotation: AnnotationConfigSchema },
    });

    return { ...parsed.data, ...(compiled ?? {}) } as unknown as AnnotationResource;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const extractConfig = (mod: GlobModule): AnnotationJsonResource => {
  if ('default' in mod) return mod.default;
  return mod;
};

export const loadAnnotationDefinitionsFromGlob = (
  modules: GlobModules,
): AnnotationResource[] => {
  const resources = Object.values(modules).map(extractConfig);
  return loadAnnotationDefinitionsFromConfigs(resources);
};

export const loadAnnotationDefinitionsFromConfigs = (
  resources: AnnotationJsonResource[],
): AnnotationResource[] => {
  return resources.map(buildAnnotationDefFromJson).filter((def) => !!def);
};

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
        .then(buildAnnotationDefFromJson);
    }),
  );
};
