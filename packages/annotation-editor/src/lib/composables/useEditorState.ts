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
  AnnotationEditorAdapter,
  type AnnotationUtils,
  annotationUtils,
  createAnnotationConfiguration,
  createModalConfig,
  type SourceModel,
  W3cAnnotationEditorAdapter,
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
import { selectAnnotationById, SelectByIdContext } from '../modals/open-modal';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';

export type EditorState = {
  sources: ComputedRef<Readonly<SourceModel[]>>;
  config: Readonly<EditorConfig>;
  editorState: Readonly<EditorState_>;
  sendAnnotationEvent: <KEY extends keyof AnnotationEvents>(
    event: KEY,
    data: AnnotationEvents[KEY],
    callback?: (response: any) => void,
  ) => void;
  utils: AnnotationUtils;
  mapBeforeSave: (annotation: W3CAnnotation, metadata: any, selection) => any;
};

const EDITOR_KEY: InjectionKey<EditorState> = Symbol('editor');

// Called in the ROOT component — sets up state and provides it
export const useProvideEditorState = (
  props: AnnotationEditorProps,
  emits: AnnotationEditorEmitsFn,
  containerRef: TemplateRef<HTMLElement>,
) => {
  const utils = annotationUtils(props.configuration);
  const annotationEditorAdapter: AnnotationEditorAdapter<any> =
    props.annotationAdapter ?? new W3cAnnotationEditorAdapter();

  const config = shallowReactive<EditorConfig>({
    modal: createModalConfig(annotationModalDefaults),
    annotation: createAnnotationConfiguration(
      props.annotationDefinitions,
      props.textAdapter,
      annotationEditorAdapter,
    ),
  });

  watch(
    () => props.annotations,
    () => {
      utils.setAnnotations(
        props.annotations ?? [],
        config.annotation.allowedChildrenPerType,
      );
    },
    { immediate: true },
  );

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
    show: () => showEditorState(),
    reset: () => resetEditorState(),
  });

  watch(
    [
      () => props.annotationDefinitions,
      () => props.textAdapter,
      () => props.annotationAdapter,
    ],
    () => {
      config.annotation = createAnnotationConfiguration(
        props.annotationDefinitions,
        props.textAdapter,
        annotationEditorAdapter,
      );
    },
  );

  const findAnnotationData = (annotationId: string) => {
    const annotation = (props.annotations ?? []).find(
      (a) => a.id === annotationId,
    );
    if (!annotation) return null;

    const sourceUri = annotationEditorAdapter.getSourceUri(annotation);
    const source = (props.sources ?? []).find((s) => s.uri === sourceUri);
    return { annotation, source };
  };

  const selectByIdCtx: SelectByIdContext = {
    config,
    editorState,
    annotationEditorAdapter,
    emits,
    findAnnotationData,
  };

  watch(
    [
      () => props.selectedAnnotationId,
      () => props.selectedAnnotationAction,
      () => props.annotations,
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

  provide(EDITOR_KEY, {
    sources,
    config: config as Readonly<EditorConfig>,
    editorState: editorState as Readonly<EditorState_>,
    utils,
    sendAnnotationEvent: sendAnnotationEvent(
      config,
      editorState,
      annotationEditorAdapter,
      emits,
      containerRef,
    ),
    mapBeforeSave: props.mapBeforeSave,
  });
};

// Called in CHILD components — just injects
export const useEditorState = (): EditorState => {
  const ctx = inject(EDITOR_KEY);
  if (!ctx)
    throw new Error('useEditorState() must be called inside an EditorRoot');
  return ctx;
};
