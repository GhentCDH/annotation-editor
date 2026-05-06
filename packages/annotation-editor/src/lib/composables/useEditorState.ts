import {
  inject,
  InjectionKey,
  provide,
  reactive,
  shallowReactive,
  watch,
  watchEffect,
} from 'vue';
import { createAnnotationConfiguration } from './annotationConfiguration';
import {
  AnnotationEditorEmitsFn,
  AnnotationEditorProps,
} from '../AnnotationEditor.properties';
import { createModalConfig } from '../modals/annotationModal.composable';
import { AnnotationUtils, annotationUtils } from '../utils/annotation-utils';
import { AnnotationEvents, sendAnnotationEvent } from './annotation.events';
import { EditorConfig, EditorData, EditorState_ } from './editorState';
import { annotationModalDefaults } from '../modals/AnnotationModal.defaults';
import { SourceModel } from '../types/source.model';
import { selectAnnotationById } from '../modals/open-modal';

export type EditorState = {
  sources: Readonly<SourceModel[]>;
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
  const utils = annotationUtils();

  const config = shallowReactive<EditorConfig>({
    modal: createModalConfig(annotationModalDefaults),
    annotation: createAnnotationConfiguration(props, utils),
  });

  utils.setAnnotations(
    props.annotations ?? [],
    config.annotation.allowedChildrenPerType,
  );

  const data = reactive<EditorData>({
    annotations: props.annotations ?? [],
    sources: props.sources ?? [],
    utils: utils,
  });

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
    infoMessage: null,
    show: () => showEditorState(),
    reset: () => resetEditorState(),
  });

  watchEffect(() => {
    config.annotation = createAnnotationConfiguration(props, utils);
    data.sources = props.sources ?? [];
    utils.setAnnotations(
      props.annotations ?? [],
      config.annotation.allowedChildrenPerType,
    );
  });

  const findAnnotationData = (annotationId: string) => {
    const annotation = (props.annotations ?? []).find(
      (a) => a.id === annotationId,
    );
    if (!annotation) return null;

    const sourceUri = utils.getSourceUri(annotation)?.sourceUri;
    const source = (props.sources ?? []).find((s) => s.uri === sourceUri);
    return { annotation, source };
  };

  const selectByIdCtx = { config, editorState, utils, emits, findAnnotationData };

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
    editorState.infoMessage = null;
  };

  provide(EDITOR_KEY, {
    sources: data.sources,
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
