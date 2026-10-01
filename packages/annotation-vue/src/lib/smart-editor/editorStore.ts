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
import {
  type EditorAnnotation,
  type TransformAnnotationAdapter,
} from '@ghentcdh/annotation-ui';
import { type AnnotationEditorLoader } from './AnnotationEditorLoader';
import { useAnnotationDefinitions } from '../definitions/useAnnotationDefinitions';

const createEditState = <ANNOTATION>(
  annotationLoader: AnnotationEditorLoader<ANNOTATION>,
  transformer: TransformAnnotationAdapter,
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

  watch(
    () => definitions.definitions,
    () => {
      transformer.setDefinitions(definitions.definitions);
    },
  );

  let sourcesSeq = 0;
  let annotationsSeq = 0;

  const loadSources = () => {
    const uris = sourceUris.value ?? [];
    const seq = ++sourcesSeq;
    loadingSources.value = true;
    Promise.all(uris.map((uri) => annotationLoader.loadSource(uri)))
      .then((response) => {
        if (seq !== sourcesSeq) return;
        sources.value = response;
      })
      .finally(() => {
        if (seq === sourcesSeq) loadingSources.value = false;
      });

    reloadAnnotations();
  };

  const reloadAnnotations = () => {
    const uris = sourceUris.value ?? [];
    const seq = ++annotationsSeq;
    loadingAnnotations.value = true;

    Promise.all(uris.map((uri) => annotationLoader.loadAnnotations(uri)))
      .then((response) => {
        if (seq !== annotationsSeq) return;
        annotations.value = response
          .flat()
          .map((a) => transformer.parse(a))
          .filter(Boolean) as EditorAnnotation[];
      })
      .finally(() => {
        if (seq === annotationsSeq) loadingAnnotations.value = false;
      });
  };

  const setSourceUris = (uris: string[]) => {
    sourceUris.value = uris;
    loadSources();
    reloadAnnotations();
  };

  watch(
    () => filteredDefinitions.value,
    () => {
      reloadAnnotations();
    },
  );

  const annotationsGroupedByPurpose = computed(() => {
    // TODO decide where to parse now it is in the sub component but that might be wrong
    return groupBy(annotations.value, (a) => a.definition?.id);
  });

  const selectedAnnotationTypes = ref<string[]>([]);

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
  transformer: TransformAnnotationAdapter<ANNOTATION>,
) => {
  const state = createEditState(annotationLoader, transformer);
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
