import { type TemplateRef } from 'vue';
import {
  type EditorAnnotation,
  type KeyLabel,
  type SourceModel,
  type UIAnnotationDefinition,
} from '@ghentcdh/annotation-ui';
import { NotificationService } from '@ghentcdh/ui';
import { type EditorConfig, type EditorState_ } from './editorState';
import { type AnnotationEditModalShow } from '../modals/edit-annotation/AnnotationEditModal.properties';
import { type AnnotationEditorEmitsFn } from '../AnnotationEditor.properties';

type SelectAnnotationData = {
  annotation: EditorAnnotation;
  source: SourceModel;
  definitionUri: string;
  mouseEvent: MouseEvent;
  containerRef?: HTMLElement;
  definition: UIAnnotationDefinition;
};

type CreateAnnotationData = Pick<
  AnnotationEditModalShow,
  'source' | 'parentAnnotation'
> & {
  definitionUri: string;
};

type EditAnnotationData = Pick<
  AnnotationEditModalShow,
  'source' | 'parentAnnotation'
> & {
  annotation: EditorAnnotation;
  definition: UIAnnotationDefinition;
};

type DeleteAnnotationData = {
  annotation: EditorAnnotation;
  definition: UIAnnotationDefinition;
};

type LinkData = {
  link: KeyLabel;
  definition: UIAnnotationDefinition;
};

export type AnnotationEvents = {
  create: CreateAnnotationData;
  edit: EditAnnotationData;
  delete: DeleteAnnotationData;
  select: SelectAnnotationData | null;
  link: LinkData;
};

export const createAnnotation = (
  data: CreateAnnotationData,
  config: EditorConfig,
  state: EditorState_,
  emits: AnnotationEditorEmitsFn,
) => {
  if (state.disableEdits) return;

  state.disableEdits = true;
  state.editorState = 'create';

  config.modal
    .show('edit-annotation', {
      source: data.source,
      annotation: {
        definitionUri: data.definitionUri,
        parentAnnotation: data.parentAnnotation,
        selectors: [],
      },
    })
    .then((result) => {
      state.show();

      if (!result?.annotation) return;
      emits('create:annotation', result.annotation);
    });
};

export const editAnnotation = (
  data: EditAnnotationData,
  config: EditorConfig,
  state: EditorState_,
  emits: AnnotationEditorEmitsFn,
) => {
  if (state.disableEdits) return;

  state.disableEdits = true;
  state.editorState = 'edit';
  emits('select:annotation', data.annotation, 'edit');

  const isLink = data.definition.annotation.type === 'link';

  config.modal
    .show(isLink ? 'link-annotation' : 'edit-annotation', {
      source: data.source,
      annotation: data.annotation,
      definitionUrl: data.definition.id,
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
  const definition = data.definition;

  const resource = definition.resource;

  config.modal
    .show('confirm', {
      title: 'Delete',
      message: 'Are you sure to delete this annotation?',
    })
    .then((result) => {
      if (!result?.confirmed) return;

      resource
        .delete(annotation)
        .then(() => {
          NotificationService.success('Successfully deleted annotation');

          if (state.selectedAnnotation?.id === annotation.id) {
            state.selectedAnnotation = null;
            state.editorState = null;
            state.disableEdits = false;
            state.reset();
          }

          emits('delete:annotation', annotation);
        })
        .catch((error) => {
          console.error('Something went wrong while deleting annotation');
          console.error(error);

          NotificationService.error(
            'Something went wrong while deleting annotation',
          );
        });
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
  state.info = { message: infoMessage, short: data.link.label };
  (config.modal.getModal('link-annotation').state as any).startLink(
    data.link.key,
  );
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
      annotation: {
        definitionUri: data.definitionUri,
        links: [{ uri: sourceAnnotation.id }, { uri: targetAnnotation.id }],
      },
    })
    .then((result) => {
      state.show();

      if (result.annotation) {
        emits('create:annotation', result.annotation);
      }
    });
};

export const handleSelectAnnotation = (
  data: SelectAnnotationData | null,
  config: EditorConfig,
  state: EditorState_,
  emits: AnnotationEditorEmitsFn,
  containerRef: HTMLElement,
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

  data.containerRef = containerRef;
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
    emits: AnnotationEditorEmitsFn,
    containerRef: TemplateRef<HTMLElement>,
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
          containerRef.value!,
        );
      case 'edit':
        return editAnnotation(
          data as AnnotationEvents['edit'],
          config,
          editorState,
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
