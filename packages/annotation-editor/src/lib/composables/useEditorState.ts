import { inject, InjectionKey, nextTick, provide, reactive, shallowReactive, watch, watchEffect } from 'vue';
import { createAnnotationConfiguration } from './annotationConfiguration';
import { AnnotationEditorEmitsFn, AnnotationEditorProps } from '../AnnotationEditor.properties';
import { createModalConfig } from '../modals/annotationModal.composable';
import { AnnotationUtils, annotationUtils } from '../utils/annotation-utils';
import { AnnotationEvents, sendAnnotationEvent } from './annotation.events';
import { EditorConfig, EditorData, EditorState_ } from './editorState';
import { annotationModalDefaults } from '../modals/AnnotationModal.defaults';
import { SourceModel } from '../types/source.model';

export type EditorState = {
  sources: Readonly<SourceModel[]>;
  config: Readonly<EditorConfig>;
  editorState: Readonly<EditorState_>;
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

  const getAnnotationElementCenter = (annotationId: string) => {
    const el = document.querySelector(
      `g[data-annotation-uid="${annotationId}"]:not([data-annotation-role="tag"])`,
    );
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      x: Math.min(rect.left + rect.width / 2, window.innerWidth - 270),
      y: Math.min(rect.top + rect.height / 2, window.innerHeight - 200),
    };
  };

  const findAnnotationData = (annotationId: string) => {
    const annotation = (props.annotations ?? []).find(
      (a) => a.id === annotationId,
    );
    if (!annotation) return null;

    const sourceUri = utils.getSourceUri(annotation)?.sourceUri;
    const source = (props.sources ?? []).find((s) => s.uri === sourceUri);
    return { annotation, source };
  };

  const selectAnnotationById = (
    annotationId: string | undefined,
    action: string | undefined,
  ) => {
    if (!annotationId) {
      if (editorState.selectedAnnotation) {
        config.modal.close('info-card');
        editorState.selectedAnnotation = null;
        editorState.editorState = null;
      }
      return;
    }

    // Skip if state already matches — prevents loop from emit → URL → watcher
    const currentAction = editorState.editorState ?? 'show';
    if (
      editorState.selectedAnnotation?.id === annotationId &&
      currentAction === (action ?? 'show')
    ) {
      return;
    }

    const data = findAnnotationData(annotationId);
    if (!data) return;

    const { annotation, source } = data;

    nextTick(() => {
      editorState.selectedAnnotation = annotation;

      if (action === 'edit') {
        editorState.disableEdits = true;
        editorState.editorState = 'edit';
        config.modal
          .show('edit-annotation', {
            source,
            annotation,
            parentAnnotation: utils.getParent(annotation),
            type: utils.getAnnotationType(annotation),
          })
          .then((result: any|null) => {
            editorState.show();
            emits('select:annotation', editorState.selectedAnnotation, 'show');

            if (!result?.annotation) return;
            emits('update:annotation', result.annotation);
          });
      } else {
        const position = getAnnotationElementCenter(annotationId) ?? {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        };
        config.modal.show('info-card', { annotation, source, position });
        editorState.editorState = 'show';
      }
    });
  };

  watch(
    [
      () => props.selectedAnnotationId,
      () => props.selectedAnnotationAction,
      () => props.annotations,
    ],
    ([id, action]) => selectAnnotationById(id, action),
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
