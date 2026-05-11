import {
  computed,
  type ComputedRef,
  inject,
  type InjectionKey,
  provide,
  reactive,
  shallowReactive,
  watch,
} from 'vue';
import { createAnnotationConfiguration } from './annotationConfiguration';
import {
  type AnnotationEvents,
  sendAnnotationEvent,
} from './annotation.events';
import { type EditorConfig, type EditorState_ } from './editorState';
import {
  type AnnotationEditorEmitsFn,
  type AnnotationEditorProps,
} from '../AnnotationEditor.properties';
import { createModalConfig } from '../modals/annotationModal.composable';
import {
  type AnnotationUtils,
  annotationUtils,
} from '../utils/annotation-utils';
import { annotationModalDefaults } from '../modals/AnnotationModal.defaults';
import { type SourceModel } from '../types/source.model';
import { selectAnnotationById } from '../modals/open-modal';

export type EditorState = {
  sources: ComputedRef<Readonly<SourceModel[]>>;
  config: Readonly<EditorConfig>;
  editorState: Readonly<EditorState_>;
  handleFormEvents: () => void;
  sendAnnotationEvent: <KEY extends keyof AnnotationEvents>(
    event: KEY,
    data: AnnotationEvents[KEY],
    callback?: (response: any) => void,
  ) => void;
  utils: AnnotationUtils;
};

const EDITOR_KEY: InjectionKey<EditorState> = Symbol('editor');

// Called in the ROOT component — sets up state and provides it
export const useProvideEditorState = (
  props: AnnotationEditorProps,
  emits: AnnotationEditorEmitsFn,
) => {
  const utils = annotationUtils(props.configuration);

  const config = shallowReactive<EditorConfig>({
    modal: createModalConfig(annotationModalDefaults),
    annotation: createAnnotationConfiguration(
      props.annotationDefinitions,
      utils,
      props.textAdapter,
      props.annotationAdapter,
    ),
  });

  utils.setAnnotations(
    props.annotations ?? [],
    config.annotation.allowedChildrenPerType,
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
    () =>
      props.annotationDefinitions &&
      props.textAdapter &&
      props.annotationAdapter,
    () => {
      config.annotation = createAnnotationConfiguration(
        props.annotationDefinitions,
        utils,
        props.textAdapter,
        props.annotationAdapter,
      );
    },
  );

  watch(
    () => props.annotations,
    () => {
      utils.setAnnotations(
        props.annotations ?? [],
        config.annotation.allowedChildrenPerType,
      );
    },
  );

  const findAnnotationData = (annotationId: string) => {
    const annotation = (props.annotations ?? []).find(
      (a) => a.id === annotationId,
    );
    if (!annotation) return null;

    const sourceUri = utils.getSourceUri(annotation)?.sourceUri;
    const source = (props.sources ?? []).find((s) => s.uri === sourceUri);
    return { annotation, source };
  };

  const selectByIdCtx = {
    config,
    editorState,
    utils,
    emits,
    findAnnotationData,
  };

  watch(
    [
      () => props.selectedAnnotationId,
      () => props.selectedAnnotationAction,
      () => props.annotations,
    ],
    ([id, action]) => selectAnnotationById(id, action, selectByIdCtx),
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
    handleFormEvents: () => console.error('something wrong'),
    sendAnnotationEvent: sendAnnotationEvent(config, editorState, utils, emits),
  });
};

// Called in CHILD components — just injects
export const useEditorState = (): EditorState => {
  const ctx = inject(EDITOR_KEY);
  if (!ctx)
    throw new Error('useEditorState() must be called inside an EditorRoot');
  return ctx;
};
