import { nextTick } from 'vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import type { EditorConfig, EditorState_ } from '../composables/editorState';
import type { AnnotationUtils } from '../utils/annotation-utils';
import type { AnnotationEditorEmitsFn } from '../AnnotationEditor.properties';
import type { SourceModel } from '../types/source.model';

type AnnotationData = {
  annotation: W3CAnnotation;
  source: SourceModel | undefined;
};

type SelectByIdContext = {
  config: EditorConfig;
  editorState: EditorState_;
  utils: AnnotationUtils;
  emits: AnnotationEditorEmitsFn;
  findAnnotationData: (id: string) => AnnotationData | null;
};

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

export const selectAnnotationById = (
  annotationId: string | undefined,
  action: string | undefined,
  ctx: SelectByIdContext,
) => {
  const { config, editorState, utils, emits, findAnnotationData } = ctx;

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
  console.table({
    currentId: editorState.selectedAnnotation?.id,
    annotationId,
    currentAction,
    action,
  });
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
        .then((result: any | null) => {
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
