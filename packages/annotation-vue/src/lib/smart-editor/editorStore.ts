import {
  type InjectionKey,
  computed,
  provide,
  reactive,
  ref,
  watch,
} from 'vue';

import { type BaseAnnotation } from '@ghentcdh/annotated-text';
import { type SourceModel } from '@ghentcdh/annotation-core';
import {
  type AnnotationTransformer,
  type EditorAnnotation,
  parseAnnotations,
} from '@ghentcdh/annotation-ui';

import { useAnnotationDefinitions } from '../definitions/useAnnotationDefinitions';
import { type AnnotationEditorLoader } from './AnnotationEditorLoader';
import { type EditorLoadError, toEditorLoadError } from './editorError';

const createEditState = <ANNOTATION extends BaseAnnotation>(
  annotationLoader: AnnotationEditorLoader<ANNOTATION>,
  transformer: AnnotationTransformer<ANNOTATION>,
) => {
  const definitions = useAnnotationDefinitions();
  const sourceUris = ref<string[] | null>(null);
  const sources = ref<SourceModel[]>([]);

  const annotations = ref<EditorAnnotation[]>([]);
  const loadingSources = ref(true);
  const loadingAnnotations = ref(true);
  const sourcesError = ref<EditorLoadError | null>(null);
  const annotationsError = ref<EditorLoadError | null>(null);

  /** First error from either loader; `null` when everything loaded fine. */
  const error = computed<EditorLoadError | null>(
    () => sourcesError.value ?? annotationsError.value,
  );

  const filteredDefinitions = computed(() => {
    return definitions.definitions;
  });

  let sourcesSeq = 0;
  let annotationsSeq = 0;

  const loadSources = () => {
    const uris = sourceUris.value ?? [];
    const seq = ++sourcesSeq;
    loadingSources.value = true;
    sourcesError.value = null;
    Promise.all(uris.map((uri) => annotationLoader.loadSource(uri)))
      .then((response) => {
        if (seq !== sourcesSeq) return;
        sources.value = response;
      })
      .catch((e: unknown) => {
        if (seq !== sourcesSeq) return;
        console.error(e);
        sourcesError.value = toEditorLoadError(e);
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
    annotationsError.value = null;

    Promise.all(uris.map((uri) => annotationLoader.loadAnnotations(uri)))
      .then((response) => {
        if (seq !== annotationsSeq) return;
        annotations.value = parseAnnotations(transformer, response.flat());
      })
      .catch((e: unknown) => {
        if (seq !== annotationsSeq) return;
        console.error(e);
        annotationsError.value = toEditorLoadError(e);
      })
      .finally(() => {
        if (seq === annotationsSeq) loadingAnnotations.value = false;
      });
  };

  const setSourceUris = (uris: string[]) => {
    sourceUris.value = uris;
    sources.value = [];
    annotations.value = [];
    sourcesError.value = null;
    annotationsError.value = null;
    loadSources();
  };

  watch(
    () => filteredDefinitions.value,
    () => {
      reloadAnnotations();
    },
  );

  const annotationsGroupedByPurpose = computed(() => {
    return (annotations.value as EditorAnnotation[]).reduce<
      Record<string, EditorAnnotation[]>
    >((acc, a) => {
      (acc[a.definitionUri] ??= []).push(a);
      return acc;
    }, {});
  });

  const selectedAnnotationTypes = ref<string[]>([]);

  const reload = () => {
    annotationsError.value = null;
    reloadAnnotations();
  };

  /** Reload both sources and annotations, e.g. after a failed load. */
  const reloadAll = () => {
    sourcesError.value = null;
    annotationsError.value = null;
    loadSources();
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
    error,
    annotations,
    filteredAnnotations,
    sources,
    selectedAnnotationTypes,
    annotationsGroupedByPurpose,
    reload,
    reloadAll,
    setSourceUris,
  });
};

type TextState = ReturnType<typeof createEditState>;

const TEXT_STATE_KEY: InjectionKey<TextState> = Symbol('TextState');

export const provideEditorStore = <ANNOTATION extends BaseAnnotation>(
  annotationLoader: AnnotationEditorLoader<ANNOTATION>,
  transformer: AnnotationTransformer<ANNOTATION>,
) => {
  const state = createEditState(annotationLoader, transformer);
  provide(TEXT_STATE_KEY, state);
  return state;
};
