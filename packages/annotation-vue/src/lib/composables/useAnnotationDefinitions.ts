import {
  inject,
  type InjectionKey,
  markRaw,
  provide,
  shallowReactive,
} from 'vue';
import {
  type AnnotationDefConfig,
  type AnnotationJsonConfig,
  type AnnotationResource,
  type AnnotationResource as CoreAnnotationDefinition,
  type ContextBuilderFactory,
} from '@ghentcdh/annotation-core';
import { createHighlightStyle } from '@ghentcdh/annotated-text';
import { type AxiosInstance } from 'axios';
import { type ViewConfig } from '@ghentcdh/crouton-core';
import {
  type KeyLabel,
  type VueAnnotationDefinition,
} from '../types/annotation-vue.types';
import { AnnotationDefinitionService } from '../service/annotation-definition.service';
import {
  type DefinitionsFetchFn,
  type GlobModules,
  loadAnnotationDefinitionsFromConfigs,
  loadAnnotationDefinitionsFromGlob,
  loadAnnotationDefinitionsFromUrl,
} from '../loader/annotation-definition.loader';

export type AnnotationDefinitionsState = {
  configuration: AnnotationDefConfig;
  definitions: VueAnnotationDefinition[];
  definitionsMap: Record<string, VueAnnotationDefinition>;
  getDefinitionById: (id: string) => VueAnnotationDefinition | undefined;
  loadFromGlob: (modules: GlobModules) => void;
  loadFromConfigs: (configs: AnnotationJsonConfig[]) => void;
  loadFromDefinitions: (defs: CoreAnnotationDefinition[]) => void;
  loadFromUrl: (url: string, fetchFn?: DefinitionsFetchFn) => Promise<void>;
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
): VueAnnotationDefinition => {
  console.log('to vue definition');
  const style = def.annotation;
  console.log(style);

  return {
    id: def.id,
    name: def.name,
    label: def.name,
    color: style.color,
    style: {
      default: createStyle(style.color),
      active: activeStyle(style.color),
    },
    views: def.views as Record<string, ViewConfig>,
    allowedChildren: resolveKeyLabels(style.allowedChildren, grouped),
    allowedLinks: resolveKeyLabels(style.allowedLinks, grouped),
    isRoot: style.isRoot ?? true,
    icon: style.icon,
    type: style.type,
    target: style.target,
    context: def.context as VueAnnotationDefinition['context'],
    _core: def,
  };
};

const buildVueDefinitions = (
  coreDefs: CoreAnnotationDefinition[],
  grouped: Record<string, CoreAnnotationDefinition>,
  createStyle: typeof createHighlightStyle,
  activeStyle: typeof createHighlightStyle,
): VueAnnotationDefinition[] =>
  coreDefs.map((def) =>
    toVueDefinition(def, grouped, createStyle, activeStyle as any),
  );

const buildDefinitionsMap = (
  definitions: VueAnnotationDefinition[],
): Record<string, VueAnnotationDefinition> =>
  definitions.reduce((acc: Record<string, VueAnnotationDefinition>, def) => {
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
    definitions: [] as VueAnnotationDefinition[],
    definitionsMap: {} as Record<string, VueAnnotationDefinition>,
    loading: false,
    error: null as Error | null,
    service,

    getDefinitionById(id: string): VueAnnotationDefinition | undefined {
      return state.definitionsMap[id];
    },

    loadFromDefinitions(defs: CoreAnnotationDefinition[]) {
      updateDefinitions(defs);
    },

    loadFromGlob(modules: GlobModules) {
      const defs = loadAnnotationDefinitionsFromGlob(modules, config, factory);
      updateDefinitions(defs);
    },

    loadFromConfigs(configs: AnnotationJsonConfig[]) {
      const defs = loadAnnotationDefinitionsFromConfigs(
        configs,
        config,
        factory,
      );
      updateDefinitions(defs);
    },

    async loadFromUrl(url: string, fetchFn?: DefinitionsFetchFn) {
      console.log('loadFromUrl testje');
      state.loading = true;
      state.error = null;
      try {
        const defs = await loadAnnotationDefinitionsFromUrl(
          url,
          config,
          factory,
          fetchFn,
        );
        console.table('update defs');
        updateDefinitions(defs);
      } catch (e) {
        console.error(e);
        state.error = e instanceof Error ? e : new Error(String(e));
      } finally {
        console.log(' done loadFromUrl');
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
