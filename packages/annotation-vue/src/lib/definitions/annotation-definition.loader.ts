import {
  AnnotationConfigSchema,
  type AnnotationJsonResource,
  AnnotationJsonResourceSchema,
  type AnnotationResource,
} from '@ghentcdh/annotation-core';
import { parseSchema } from '@ghentcdh/crouton-core';

type GlobModule = { default: AnnotationJsonResource } | AnnotationJsonResource;

export type GlobModules = Record<string, GlobModule>;

export type DefinitionsFetchFn = (
  url: string,
) => Promise<AnnotationJsonResource[]>;

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

    return {
      ...parsed.data,
      ...(compiled ?? {}),
    } as unknown as AnnotationResource;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const buildAnnotationDefFromResourceJson = (
  resource: AnnotationJsonResource,
): AnnotationResource | null => {
  try {
    const normalized = {
      ...resource,
      annotation: { color: '#c1d344', ...resource.annotation, isRoot: true },
    };
    const compiled = parseSchema(normalized, {
      baseUrl: '',
      extensions: { annotation: AnnotationConfigSchema },
    });

    return { ...(compiled ?? {}) } as unknown as AnnotationResource;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export type ResourceLoadResult =
  | { success: true; data: AnnotationResource; raw: unknown }
  | { success: false; error: string; raw: unknown; id?: string; name?: string };

export const buildAnnotationDefFromResourceJsonSafe = (
  raw: unknown,
): ResourceLoadResult => {
  try {
    const resource = raw as AnnotationJsonResource;
    const normalized = {
      ...resource,
      annotation: { color: '#c1d344', ...resource.annotation, isRoot: true },
    };
    const compiled = parseSchema(normalized, {
      baseUrl: '',
      extensions: { annotation: AnnotationConfigSchema },
    });
    if (!compiled) {
      return { success: false, error: 'parseSchema returned null', raw, id: resource.id, name: resource.name };
    }
    return { success: true, data: compiled as unknown as AnnotationResource, raw };
  } catch (error) {
    const r = raw as AnnotationJsonResource | null;
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      raw,
      id: r?.id,
      name: r?.name,
    };
  }
};

const extractConfig = (mod: GlobModule): AnnotationJsonResource => {
  if ('default' in mod) return mod.default;
  return mod;
};

export const loadAnnotationDefinitionsFromGlob = (
  modules: GlobModules,
  _config?: unknown,
  _factory?: unknown,
): AnnotationResource[] => {
  const resources = Object.values(modules).map(extractConfig);
  return loadAnnotationDefinitionsFromConfigs(resources);
};

export const loadAnnotationDefinitionsFromConfigs = (
  resources: AnnotationJsonResource[],
  _config?: unknown,
  _factory?: unknown,
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
        .then((r) => {
          return r;
        })
        .then(buildAnnotationDefFromResourceJson);
    }),
  );
};
