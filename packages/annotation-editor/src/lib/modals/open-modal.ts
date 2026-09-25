import { nextTick, type TemplateRef } from 'vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import {
  AnnotationEditorAdapter,
  getAnnotationElementCenter,
  SourceModel,
} from '@ghentcdh/annotation-ui';
import type { AnnotationEditorEmitsFn } from '../AnnotationEditor.properties';
import type { EditorConfig, EditorState_ } from '../composables/editorState';
import { editAnnotation } from '../composables/annotation.events';

type AnnotationData = {
  annotation: W3CAnnotation;
  source: SourceModel | undefined;
};

export type SelectByIdContext = {
  config: EditorConfig;
  editorState: EditorState_;
  annotationEditorAdapter: AnnotationEditorAdapter<any>;
  emits: AnnotationEditorEmitsFn;
  findAnnotationData: (id: string) => AnnotationData | null;
};

export const selectAnnotationById = (
  container: TemplateRef<HTMLElement>,
  annotationId: string | undefined,
  action: string | undefined,
  ctx: SelectByIdContext,
) => {
  const {
    config,
    editorState,
    emits,
    findAnnotationData,
    annotationEditorAdapter,
  } = ctx;

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
  if (!data?.source) return;

  const { annotation, source } = data;

  return nextTick(() => {
    // editorState.selectedAnnotation = annotation;
    if (action === 'edit') {
      editAnnotation(
        { source, annotation },
        config,
        editorState,
        annotationEditorAdapter,
        emits,
      );
    } else {
      const position = getAnnotationElementCenter(
        container.value!,
        annotationId,
      ) ?? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      config.modal.show('info-card', { annotation, source, position });
      editorState.editorState = 'show';
    }
  });
};
