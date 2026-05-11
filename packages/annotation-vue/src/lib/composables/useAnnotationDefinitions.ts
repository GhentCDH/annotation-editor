import { computed, inject, type InjectionKey, markRaw, provide, reactive, ref } from 'vue';
import {
  type AnnotationDefConfig,
  type AnnotationDefinition as CoreAnnotationDefinition,
  type AnnotationJsonConfig,
  type AnnotationStyle,
  type ContextBuilderFactory
} from '@ghentcdh/annotation-core';
import { type FormValidationDef, type KeyLabel, type VueAnnotationDefinition } from '../types/annotation-vue.types';
import { AnnotationDefinitionService } from '../service/annotation-definition.service';
import {
  type GlobModules,
  loadAnnotationDefinitionsFromConfigs,
  loadAnnotationDefinitionsFromGlob
} from '../loader/annotation-definition.loader';

type CreateHighlightStyle = (def: CoreAnnotationDefinition) => AnnotationStyle;

export type AnnotationDefinitionsState = {
  configuration: AnnotationDefConfig;
  definitions: VueAnnotationDefinition[];
  definitionsMap: Record<string, VueAnnotationDefinition>;
  getDefinitionById: (id: string) => VueAnnotationDefinition | undefined;
  loadFromGlob: (modules: GlobModules) => void;
  loadFromConfigs: (configs: AnnotationJsonConfig[]) => void;
  loadFromDefinitions: (defs: CoreAnnotationDefinition[]) => void;
  service: AnnotationDefinitionService;
};

export type ProvideAnnotationDefinitionsOptions = {
  config: AnnotationDefConfig;
  resourceFolder?: GlobModules;
  createHighlightStyle?: CreateHighlightStyle;
  factory?: ContextBuilderFactory;
};

export const ANNOTATION_DEFINITIONS_KEY: InjectionKey<AnnotationDefinitionsState> =
  Symbol('annotation-definitions');

const defaultCreateHighlightStyle = (
  def: CoreAnnotationDefinition,
): AnnotationStyle => ({
  id: def.id,
  name: def.name,
  color: def.color,
  target: def.target ?? 'underline',
});

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
  createStyle: CreateHighlightStyle,
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
    style: createStyle(def),
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
  const createStyle =
    options.createHighlightStyle ?? defaultCreateHighlightStyle;

  const service = markRaw(new AnnotationDefinitionService());
  const coreDefs = ref<CoreAnnotationDefinition[]>([]);

  const definitions = computed(() => {
    const grouped = service.findAllGrouped();
    return coreDefs.value.map((def) =>
      toVueDefinition(def, grouped, createStyle),
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

  return reactive({
    configuration: config,
    definitions,
    definitionsMap,
    getDefinitionById,
    loadFromGlob,
    loadFromConfigs,
    loadFromDefinitions,
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
