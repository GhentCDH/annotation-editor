import {
  computed,
  inject,
  type InjectionKey,
  provide,
  reactive,
  ref,
  watch,
} from 'vue';
import { type SourceModel } from '@ghentcdh/annotation-core';
import { groupBy } from 'lodash-es';
import { type AnnotationEditorLoader } from './AnnotationEditorLoader';
import { useAnnotationDefinitions } from '../definitions/useAnnotationDefinitions';

const createEditState = <ANNOTATION>(
  annotationLoader: AnnotationEditorLoader<ANNOTATION>,
) => {
  const definitions = useAnnotationDefinitions();
  const sourceUris = ref<string[] | null>(null);
  const sources = ref<SourceModel[]>([]);

  const annotations = ref([]);
  const loadingSources = ref(true);
  const loadingAnnotations = ref(true);

  const filteredDefinitions = computed(() => {
    return definitions.definitions;
  });

  const reloadAnnotations = () => {
    const uris = sourceUris.value ?? [];
    const defs = filteredDefinitions.value;
    annotationLoader.definitions = defs;
    loadingAnnotations.value = true;

    Promise.all(uris.map((uri) => annotationLoader.loadAnnotations(uri)))
      .then((response) => {
        annotations.value = response.flat();
      })
      .finally(() => {
        loadingAnnotations.value = false;
      });
  };

  const setSourceUris = (uris: string[]) => {
    sourceUris.value = uris;
    loadSources();
    reloadAnnotations();
  };

  const loadSources = () => {
    const uris = sourceUris.value ?? [];
    loadingSources.value = true;
    Promise.all(uris.map((uri) => annotationLoader.loadSource(uri)))
      .then((response) => {
        sources.value = response;
      })
      .finally(() => {
        loadingSources.value = false;
      });

    reloadAnnotations();
  };

  watch(
    () => filteredDefinitions.value,
    () => {
      reloadAnnotations();
    },
  );

  const annotationsGroupedByPurpose = computed(() => {
    return groupBy(annotations.value, (a) => a.definition.id);
  });

  const selectedAnnotationTypes = ref<string[]>([
    'orthography_annotation',
    'typography_annotation',
  ]);

  const reload = () => {
    reloadAnnotations();
  };

  const filteredAnnotations = computed(() => {
    if (selectedAnnotationTypes.value?.length === 0)
      return annotations.value.map((a) => a);

    const grouped = annotationsGroupedByPurpose.value;
    return selectedAnnotationTypes.value
      .flatMap((t) => grouped[t] ?? [])
      .map((a) => a);
  });

  const loading = computed(
    () => loadingAnnotations.value || loadingSources.value,
  );

  return reactive({
    loading,
    annotations,
    filteredAnnotations,
    sources,
    selectedAnnotationTypes,
    annotationsGroupedByPurpose,
    reload,
    setSourceUris,
  });
};

export type TextState = ReturnType<typeof createEditState>;

const TEXT_STATE_KEY: InjectionKey<TextState> = Symbol('TextState');

export const provideEditorStore = <ANNOTATION>(
  annotationLoader: AnnotationEditorLoader<ANNOTATION>,
) => {
  const state = createEditState(annotationLoader);
  provide(TEXT_STATE_KEY, state);
  return state;
};

export const useEditorStore = (): TextState => {
  const state = inject(TEXT_STATE_KEY);
  if (!state)
    throw new Error(
      'useEditorStore() must be called inside a component that calls provideEditorStore()',
    );
  return state;
};
