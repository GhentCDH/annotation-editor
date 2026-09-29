import {
  computed,
  type ComputedRef,
  inject,
  type InjectionKey,
  provide,
  reactive,
  shallowReactive,
  type TemplateRef,
  watch,
} from 'vue';
import {
  AnnotationId,
  createAnnotationConfiguration,
  type EditorAnnotation,
  type SourceModel,
} from '@ghentcdh/annotation-ui';
import {
  type AnnotationEvents,
  sendAnnotationEvent,
} from './annotation.events';
import { type EditorConfig, type EditorState_ } from './editorState';
import {
  type AnnotationEditorEmitsFn,
  type AnnotationEditorProps,
} from '../AnnotationEditor.properties';
import { annotationModalDefaults } from '../modals/AnnotationModal.defaults';
import {
  selectAnnotationById,
  type SelectByIdContext,
} from '../modals/open-modal';
import { createModalConfig } from '../modals/annotationModal.composable';

export type EditorState = {
  sources: ComputedRef<Readonly<SourceModel[]>>;
  config: Readonly<EditorConfig>;
  editorState: Readonly<EditorState_>;
  sendAnnotationEvent: <KEY extends keyof AnnotationEvents>(
    event: KEY,
    data: AnnotationEvents[KEY],
    callback?: (response: any) => void,
  ) => void;
  annotations: ComputedRef<Readonly<EditorAnnotation[]>>;
  findAnnotation: (uri: AnnotationId) => EditorAnnotation | null;
};

const EDITOR_KEY: InjectionKey<EditorState> = Symbol('editor');

// Called in the ROOT component — sets up state and provides it
export const useProvideEditorState = (
  props: AnnotationEditorProps,
  emits: AnnotationEditorEmitsFn,
  containerRef: TemplateRef<HTMLElement>,
  { readonly } = { readonly: false },
) => {
  const parsedAnnotations = computed(() => {
    return props.annotationTransformer.setAnnotations(props.annotations);
  });

  const config = shallowReactive<EditorConfig>({
    modal: createModalConfig(annotationModalDefaults),
    annotation: createAnnotationConfiguration(
      props.annotationDefinitions,
      props.textAdapter,
      props.annotationTransformer,
    ),
  });

  const sources = computed(() => props.sources ?? []);

  const showEditorState = () => {
    if (!editorState.selectedAnnotation) {
      resetEditorState();
      return;
    }
    editorState.editorState = editorState.selectedAnnotation ? 'show' : null;
    editorState.disableEdits = false;
  };

  const editorState = reactive<EditorState_>({
    editorState: null,
    selectedAnnotation: null,
    disableEdits: false,
    info: null,
    readonly,
    show: () => showEditorState(),
    reset: () => resetEditorState(),
    annotationTransformer: props.annotationTransformer,
  });

  watch(
    [
      () => props.annotationDefinitions,
      () => props.textAdapter,
      () => props.annotationTransformer,
    ],
    () => {
      config.annotation = createAnnotationConfiguration(
        props.annotationDefinitions,
        props.textAdapter,
        props.annotationTransformer,
      );
    },
  );

  const findAnnotationData = (annotationId: string) => {
    const annotation = (parsedAnnotations.value ?? []).find(
      (a) => a.id === annotationId,
    );
    if (!annotation) return null;

    const sourceUri = annotation.selectors?.[0]?.uri;

    if (!sourceUri) return { annotation };

    const source = (props.sources ?? []).find((s) => s.uri === sourceUri);
    return { annotation, source };
  };

  const selectByIdCtx: SelectByIdContext = {
    config,
    editorState,
    emits,
    findAnnotationData,
  };

  watch(
    [
      () => props.selectedAnnotationId,
      () => props.selectedAnnotationAction,
      () => parsedAnnotations.value,
    ],
    ([id, action]) =>
      selectAnnotationById(containerRef, id, action, selectByIdCtx),
    { immediate: true },
  );

  const resetEditorState = () => {
    config.modal.destroy();
    editorState.editorState = null;
    editorState.selectedAnnotation = null;
    editorState.disableEdits = false;
    editorState.info = null;
  };

  const findAnnotation = (uri: AnnotationId) => {
    return parsedAnnotations.value?.find((a) => a.id === uri) ?? null;
  };

  provide(EDITOR_KEY, {
    sources,
    config: config as Readonly<EditorConfig>,
    editorState: editorState as Readonly<EditorState_>,
    sendAnnotationEvent: sendAnnotationEvent(
      config,
      editorState,
      emits,
      containerRef,
    ),
    annotations: parsedAnnotations,
    findAnnotation,
  });
};

// Called in CHILD components — just injects
export const useEditorState = (): EditorState => {
  const ctx = inject(EDITOR_KEY);
  if (!ctx)
    throw new Error('useEditorState() must be called inside an EditorRoot');
  return ctx;
};
