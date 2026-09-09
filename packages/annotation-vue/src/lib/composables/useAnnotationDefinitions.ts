import {
  inject,
  type InjectionKey,
  markRaw,
  provide,
  shallowReactive,
} from 'vue';
import {
  type AnnotationDefConfig,
  type AnnotationJsonResource,
  type AnnotationResource,
  type AnnotationResource as CoreAnnotationDefinition,
  type ContextBuilderFactory,
  type KeyLabel,
  type UIAnnotationDefinition,
  UIAnnotationDefinitionSchema,
} from '@ghentcdh/annotation-core';
import { createHighlightStyle } from '@ghentcdh/annotated-text';
import { type AxiosInstance } from 'axios';
import { AnnotationDefinitionService } from '../service/annotation-definition.service';
import {
  type DefinitionsFetchFn,
  type GlobModules,
  loadAnnotationDefFromResourceUris,
  loadAnnotationDefinitionsFromConfigs,
  loadAnnotationDefinitionsFromGlob,
  loadAnnotationDefinitionsFromUrls,
} from '../loader/annotation-definition.loader';

export type AnnotationDefinitionsState = {
  configuration: AnnotationDefConfig;
  definitions: UIAnnotationDefinition[];
  definitionsMap: Record<string, UIAnnotationDefinition>;
  getDefinitionById: (id: string) => UIAnnotationDefinition | undefined;
  loadFromGlob: (modules: GlobModules) => void;
  loadFromConfigs: (configs: AnnotationJsonResource[]) => void;
  loadFromDefinitions: (defs: CoreAnnotationDefinition[]) => void;
  loadFromUrl: (url: string, fetchFn?: DefinitionsFetchFn) => Promise<void>;
  loadFromUrls: (urls: string[], fetchFn?: DefinitionsFetchFn) => Promise<void>;
  loadFromResourceUris: (
    urls: string[],
    fetchFn?: DefinitionsFetchFn,
  ) => Promise<void>;
  loading: boolean;
  error: Error | null;
  service: AnnotationDefinitionService;
};

export type ProvideAnnotationDefinitionsOptions = {
  api: AxiosInstance;
  config: AnnotationDefConfig;
  resourceFolder?: GlobModules;
  createHighlightStyle?: typeof createHighlightStyle;
  activeHighlightStyle?: typeof createHighlightStyle;
  factory?: ContextBuilderFactory;
  definitionsUrl?: string;
  definitionsUrls?: string[];
  resourceUrls?: string[];
  fetchFn?: DefinitionsFetchFn;
};

export const ANNOTATION_DEFINITIONS_KEY: InjectionKey<AnnotationDefinitionsState> =
  Symbol('annotation-definitions');

const resolveKeyLabels = (
  ids: string[] | undefined,
  grouped: Record<string, AnnotationResource>,
): KeyLabel[] => {
  if (!ids) return [];
  return ids.reduce<KeyLabel[]>((acc, id) => {
    const def = grouped[id];
    if (def) {
      const style = def.annotation;
      const item: KeyLabel = { key: def.id, label: def.name };
      if (style.icon) item.icon = style.icon;
      acc.push(item);
    }
    return acc;
  }, []);
};

const toVueDefinition = (
  def: AnnotationResource,
  grouped: Record<string, AnnotationResource>,
  createStyle: typeof createHighlightStyle,
  activeStyle: typeof createHighlightStyle,
): UIAnnotationDefinition => {
  const style = def.annotation! ?? {};

  const parsed = UIAnnotationDefinitionSchema.safeParse({
    ...def,
    allowedChildren: resolveKeyLabels(style.allowedChildren, grouped),
    allowedLinks: resolveKeyLabels(style.allowedLinks, grouped),
    style: {
      default: createStyle(style.color!),
      active: activeStyle(style.color!),
    },
  });
  if (parsed.error) {
    console.error('for def', def);
    console.error(parsed.error);
  }
  return parsed.success ? parsed.data : (def as UIAnnotationDefinition);
};

const buildVueDefinitions = (
  coreDefs: CoreAnnotationDefinition[],
  grouped: Record<string, CoreAnnotationDefinition>,
  createStyle: typeof createHighlightStyle,
  activeStyle: typeof createHighlightStyle,
): UIAnnotationDefinition[] =>
  coreDefs.map((def) =>
    toVueDefinition(def, grouped, createStyle, activeStyle as any),
  );

const buildDefinitionsMap = (
  definitions: UIAnnotationDefinition[],
): Record<string, UIAnnotationDefinition> =>
  definitions.reduce((acc: Record<string, UIAnnotationDefinition>, def) => {
    acc[def.id] = def;
    return acc;
  }, {});

export const createAnnotationDefinitionsState = (
  options: ProvideAnnotationDefinitionsOptions,
): AnnotationDefinitionsState => {
  const { config, factory } = options;
  const createStyle = options.createHighlightStyle ?? createHighlightStyle;
  const activeStyle = options.activeHighlightStyle ?? createStyle;

  const service = markRaw(new AnnotationDefinitionService());

  const updateDefinitions = (coreDefs: AnnotationResource[]) => {
    service.setDefinitions(coreDefs);
    const grouped = service.findAllGrouped();
    state.definitions = buildVueDefinitions(
      coreDefs,
      grouped,
      createStyle,
      activeStyle,
    );
    state.definitionsMap = buildDefinitionsMap(state.definitions);
  };

  const state: AnnotationDefinitionsState = shallowReactive({
    configuration: config,
    definitions: [] as UIAnnotationDefinition[],
    definitionsMap: {} as Record<string, UIAnnotationDefinition>,
    loading: false,
    error: null as Error | null,
    service,

    getDefinitionById(id: string): UIAnnotationDefinition | undefined {
      return state.definitionsMap[id];
    },

    loadFromDefinitions(defs: CoreAnnotationDefinition[]) {
      updateDefinitions(defs);
    },

    loadFromGlob(modules: GlobModules) {
      const defs = loadAnnotationDefinitionsFromGlob(modules, config, factory);
      updateDefinitions(defs);
    },

    loadFromConfigs(configs: AnnotationJsonResource[]) {
      const defs = loadAnnotationDefinitionsFromConfigs(
        configs,
        config,
        factory,
      );
      updateDefinitions(defs);
    },

    async loadFromUrls(urls: string[], fetchFn?: DefinitionsFetchFn) {
      state.loading = true;
      state.error = null;
      try {
        const defs = await loadAnnotationDefinitionsFromUrls(urls);
        updateDefinitions(defs);
      } catch (e) {
        console.error(e);
        state.error = e instanceof Error ? e : new Error(String(e));
      } finally {
        state.loading = false;
      }
    },
    async loadFromResourceUris(urls: string[], fetchFn?: DefinitionsFetchFn) {
      state.loading = true;
      state.error = null;
      try {
        const defs = await loadAnnotationDefFromResourceUris(urls);
        updateDefinitions(defs);
      } catch (e) {
        console.error(e);
        state.error = e instanceof Error ? e : new Error(String(e));
      } finally {
        state.loading = false;
      }
    },
    async loadFromUrl(url: string, fetchFn?: DefinitionsFetchFn) {
      state.loading = true;
      state.error = null;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch annotation definitions: ${response.status} ${response.statusText}`,
          );
        }
        const configuration = await response.json();
        const urls = configuration.annotations.map((a) => a.schemas);
        const defs = await loadAnnotationDefinitionsFromUrls(urls);
        updateDefinitions(defs);
      } catch (e) {
        console.error(e);
        state.error = e instanceof Error ? e : new Error(String(e));
      } finally {
        state.loading = false;
      }
    },
  });

  return state;
};

/**
 * Called once at root — creates state, provides to descendants.
 * If `resourceFolder` given, loads definitions immediately.
 */
export const provideAnnotationDefinitions = (
  options: ProvideAnnotationDefinitionsOptions,
): AnnotationDefinitionsState => {
  const state = createAnnotationDefinitionsState(options);

  if (options.resourceFolder) {
    state.loadFromGlob(options.resourceFolder);
  }

  if (options.definitionsUrl) {
    state.loadFromUrl(options.definitionsUrl, options.fetchFn);
  }

  if (options.definitionsUrls) {
    state.loadFromUrls(options.definitionsUrls, options.fetchFn);
  }
  if (options.resourceUrls) {
    state.loadFromResourceUris(options.resourceUrls, options.fetchFn);
  }

  provide(ANNOTATION_DEFINITIONS_KEY, state);
  return state;
};

/**
 * Called in child components — injects state from ancestor.
 */
export const useAnnotationDefinitions = (): AnnotationDefinitionsState => {
  const ctx = inject(ANNOTATION_DEFINITIONS_KEY);
  if (!ctx)
    throw new Error(
      'useAnnotationDefinitions() must be called inside a component that called provideAnnotationDefinitions()',
    );

  return ctx;
};
