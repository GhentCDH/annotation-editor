import { computed, inject, type InjectionKey, markRaw, provide, reactive, ref } from 'vue';
import {
  type AnnotationDefConfig,
  type AnnotationDefinition as CoreAnnotationDefinition,
  type AnnotationJsonConfig,
  type ContextBuilderFactory
} from '@ghentcdh/annotation-core';
import { createHighlightStyle } from '@ghentcdh/annotated-text';
import { type FormValidationDef, type KeyLabel, type VueAnnotationDefinition } from '../types/annotation-vue.types';
import { AnnotationDefinitionService } from '../service/annotation-definition.service';
import {
  type DefinitionsFetchFn,
  type GlobModules,
  loadAnnotationDefinitionsFromConfigs,
  loadAnnotationDefinitionsFromGlob,
  loadAnnotationDefinitionsFromUrl
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
  grouped: Record<string, CoreAnnotationDefinition>,
): KeyLabel[] => {
  if (!ids) return [];
  return ids.reduce<KeyLabel[]>((acc, id) => {
    const def = grouped[id];
    if (def) {
      const item: KeyLabel = { key: def.id, label: def.name };
      if (def.icon) item.icon = def.icon;
      acc.push(item);
    }
    return acc;
  }, []);
};

const toVueDefinition = (
  def: CoreAnnotationDefinition,
  grouped: Record<string, CoreAnnotationDefinition>,
  createStyle: typeof createHighlightStyle,
  activeStyle: typeof createHighlightStyle,
): VueAnnotationDefinition => {
  const schema: FormValidationDef = {
    uiSchema: def.ui_schema ?? null,
    jsonSchema: def.json_schema ?? null,
    metaDataSchema: def.metadata_schema ?? null,
    validation: (value: unknown) => value,
  };

  return {
    id: def.id,
    name: def.name,
    label: def.name,
    color: def.color,
    style: {
      default: createStyle(def.color),
      active: activeStyle(def.color),
    },
    // style: createStyle(def),
    schema,
    allowedChildren: resolveKeyLabels(def.allowedChildren, grouped),
    allowedLinks: resolveKeyLabels(def.allowedLinks, grouped),
    isRoot: def.isRoot ?? true,
    icon: def.icon,
    type: def.type,
    target: def.target,
    context: def.context as VueAnnotationDefinition['context'],
    _core: def,
  };
};

export const createAnnotationDefinitionsState = (
  options: ProvideAnnotationDefinitionsOptions,
): AnnotationDefinitionsState => {
  const { config, factory } = options;
  const createStyle = options.createHighlightStyle ?? createHighlightStyle;
  const activeStyle = options.createHighlightStyle ?? createStyle;

  const service = markRaw(new AnnotationDefinitionService());
  const coreDefs = ref<CoreAnnotationDefinition[]>([]);

  const definitions = computed(() => {
    const grouped = service.findAllGrouped();
    return coreDefs.value.map((def) =>
      toVueDefinition(def, grouped, createStyle, activeStyle as any),
    );
  });

  const definitionsMap = computed(() =>
    definitions.value.reduce(
      (acc: Record<string, VueAnnotationDefinition>, def) => {
        acc[def.id] = def;
        return acc;
      },
      {},
    ),
  );

  const getDefinitionById = (id: string): VueAnnotationDefinition | undefined =>
    definitionsMap.value[id];

  const loadFromDefinitions = (defs: CoreAnnotationDefinition[]) => {
    service.setDefinitions(defs);
    coreDefs.value = defs;
  };

  const loadFromGlob = (modules: GlobModules) => {
    const defs = loadAnnotationDefinitionsFromGlob(modules, config, factory);
    loadFromDefinitions(defs);
  };

  const loadFromConfigs = (configs: AnnotationJsonConfig[]) => {
    const defs = loadAnnotationDefinitionsFromConfigs(configs, config, factory);
    loadFromDefinitions(defs);
  };

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const loadFromUrl = async (url: string, fetchFn?: DefinitionsFetchFn) => {
    loading.value = true;
    error.value = null;
    try {
      const defs = await loadAnnotationDefinitionsFromUrl(
        url,
        config,
        factory,
        fetchFn,
      );
      loadFromDefinitions(defs);
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
    } finally {
      loading.value = false;
    }
  };

  return reactive({
    configuration: config,
    definitions,
    definitionsMap,
    getDefinitionById,
    loadFromGlob,
    loadFromConfigs,
    loadFromDefinitions,
    loadFromUrl,
    loading,
    error,
    service,
  });
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
