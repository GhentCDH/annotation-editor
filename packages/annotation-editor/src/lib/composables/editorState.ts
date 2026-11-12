import { type SourceModel } from '@ghentcdh/annotation-core';
import { type AnnotationMetadata, type EditorAnnotation, type Selector, type UiAnnotatedText } from '@ghentcdh/annotation-ui';

import { type AnnotationModalActionMap } from '../modals/AnnotationModal.defaults';
import { type AnnotationModalConfig } from '../modals/AnnotationModal.definition';

type EditorStatus = 'show' | 'create' | 'edit' | 'link' | null;

export type EditorConfig = {
  modal: AnnotationModalConfig<AnnotationModalActionMap>;
  createAnnotatedText: (
    id: string,
    sourceModel?: SourceModel,
  ) => UiAnnotatedText;
};

export type EditorState_ = {
  info: { message: string; short: string } | null;
  editorState: EditorStatus;
  disableEdits: boolean;
  readonly: boolean;
  selectedAnnotation: EditorAnnotation | null;
  reset: () => void;
  show: () => void;
  format: (annotation: EditorAnnotation, isNew: boolean) => any;
  transformMetadata: (metadata: AnnotationMetadata, selector: Selector) => AnnotationMetadata;
};
