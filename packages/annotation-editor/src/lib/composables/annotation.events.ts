import { EditorConfig, EditorState_ } from './editorState';
import { W3CAnnotation } from '@ghentcdh/w3c-utils';;
import type { SourceModel } from '../types/source.model';
import { AnnotationEditModalShow } from '../modals/edit-annotation/AnnotationEditModal.properties';
import { AnnotationUtils } from '../utils/annotation-utils';
import { AnnotationEditorEmitsFn } from '../AnnotationEditor.properties';
import { KeyLabel } from '../types/AnnotationConfiguration.model';

type SelectAnnotationData = {
  annotation: W3CAnnotation;
  source: SourceModel;
  mouseEvent: MouseEvent;
};

type CreateAnnotationData = Pick<
  AnnotationEditModalShow,
  'source' | 'parentAnnotation'
> & {
  type: string;
};

type EditAnnotationData = Pick<
  AnnotationEditModalShow,
  'source' | 'parentAnnotation'
> & {
  annotation: W3CAnnotation;
};

type DeleteAnnotationData = {
  annotation: W3CAnnotation;
  type: string;
  source: SourceModel;
};

type LinkData = {
  link: KeyLabel;
};

export type AnnotationEvents = {
  create: CreateAnnotationData;
  edit: EditAnnotationData;
  delete: DeleteAnnotationData;
  select: SelectAnnotationData | null;
  link: LinkData;
};

const createAnnotation = (
  data: CreateAnnotationData,
  config: EditorConfig,
  state: EditorState_,
  emits: AnnotationEditorEmitsFn,
) => {
  if (state.disableEdits) return;

  state.disableEdits = true;
  state.editorState = 'create';

  config.modal.show('edit-annotation', data).then((result) => {
    state.show();

    if (!result?.annotation) return;
    emits('create:annotation', result.annotation);
  });
};

const editAnnotation = (
  data: EditAnnotationData,
  config: EditorConfig,
  state: EditorState_,
  utils: AnnotationUtils,
  emits: AnnotationEditorEmitsFn,
) => {
  if (state.disableEdits) return;

  state.disableEdits = true;
  state.editorState = 'edit';
  emits('select:annotation', data.annotation, 'edit');

  config.modal
    .show('edit-annotation', {
      source: data.source,
      annotation: data.annotation,
      parentAnnotation: utils.getParent(data.annotation),
      type: utils.getAnnotationType(data.annotation),
    })
    .then((result) => {
      state.show();
      emits('select:annotation', state.selectedAnnotation, 'show');

      if (!result?.annotation) return;
      emits('update:annotation', result.annotation);
    });
};

const deleteAnnotation = (
  data: DeleteAnnotationData,
  config: EditorConfig,
  state: EditorState_,
  emits: AnnotationEditorEmitsFn,
) => {
  const { annotation } = data;
  config.modal
    .show('confirm', {
      title: 'Delete link',
      message: `Are you sure to delete this annotation?`,
    })
    .then((result) => {
      if (!result?.confirmed) return;

      emits('delete:annotation', annotation);
      if (state.selectedAnnotation?.id === annotation.id) {
        state.selectedAnnotation = null;
        state.editorState = null;
        state.disableEdits = false;
        state.reset();
      }
    });
};

const startLinking = (
  data: LinkData,
  config: EditorConfig,
  state: EditorState_,
) => {
  if (!state.selectedAnnotation) {
    console.warn('No annotation selected, linking not possible');
    return;
  }

  const infoMessage = `${data.link.label} of annotation in progress, select target annotation`;

  state.editorState = 'link';
  state.disableEdits = true;
  state.infoMessage = infoMessage;
  (config.modal.getModal('link-annotation').state as any).startLink(data.link.key);
  config.modal.show('toast', {
    toastMessage: infoMessage,
    action: {
      label: 'close',
      onClick: () => {
        state.show();
      },
    },
  });
};

const endLink = (
  data: SelectAnnotationData | null,
  config: EditorConfig,
  state: EditorState_,
  emits: AnnotationEditorEmitsFn,
) => {
  if (!state.selectedAnnotation) {
    console.warn('No annotation selected, linking not possible');
    state.reset();
    return;
  }
  const targetAnnotation = data?.annotation;
  if (!targetAnnotation) {
    console.warn('No target annotation selected, linking not possible');
    return;
  }
  config.modal.close('toast', undefined as void);

  const sourceAnnotation = state.selectedAnnotation;
  config.modal
    .show('link-annotation', {
      sourceAnnotation,
      targetAnnotation,
    })
    .then((result) => {
      state.show();

      if (result.annotation) {
        emits('create:annotation', result.annotation);
      }
    });
};

const handleSelectAnnotation = (
  data: SelectAnnotationData | null,
  config: EditorConfig,
  state: EditorState_,
  emits: AnnotationEditorEmitsFn,
) => {
  if (state.editorState === 'link') {
    endLink(data, config, state, emits);
    return;
  }

  if (state.disableEdits) return;

  if (!data || !data.annotation) {
    config.modal.close('info-card');
    state.disableEdits = false;
    state.editorState = null;
    emits('select:annotation', null, null);
    return;
  }

  config.modal.show('info-card', data);
  state.selectedAnnotation = data.annotation;
  state.editorState = 'show';
  state.disableEdits = false;
  emits('select:annotation', data.annotation, 'show');
};

export const sendAnnotationEvent =
  (
    config: EditorConfig,
    editorState: EditorState_,
    utils: AnnotationUtils,
    emits: AnnotationEditorEmitsFn,
  ) =>
  <KEY extends keyof AnnotationEvents>(
    event: KEY,
    data: AnnotationEvents[KEY],
  ) => {
    switch (event) {
      case 'select':
        return handleSelectAnnotation(
          data as AnnotationEvents['select'],
          config,
          editorState,
          emits,
        );
      case 'edit':
        return editAnnotation(
          data as AnnotationEvents['edit'],
          config,
          editorState,
          utils,
          emits,
        );
      case 'create':
        return createAnnotation(
          data as AnnotationEvents['create'],
          config,
          editorState,
          emits,
        );
      case 'delete':
        return deleteAnnotation(
          data as AnnotationEvents['delete'],
          config,
          editorState,
          emits,
        );
      case 'link':
        return startLinking(
          data as AnnotationEvents['link'],
          config,
          editorState,
        );
      default:
        console.warn(`Unknown annotation event: ${event}`);
    }
  };
