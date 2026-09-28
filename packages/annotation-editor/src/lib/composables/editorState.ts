import {
  type AnnotationModalConfig,
  type EditorAnnotation,
  type UIAnnotationConfiguration,
} from '@ghentcdh/annotation-ui';

type EditorStatus = 'show' | 'create' | 'edit' | 'link' | null;

export type EditorConfig = {
  modal: AnnotationModalConfig;
  annotation: UIAnnotationConfiguration;
};

export type EditorState_ = {
  info: { message: string; short: string } | null;
  editorState: EditorStatus;
  disableEdits: boolean;
  readonly: boolean;
  selectedAnnotation: EditorAnnotation | null;
  reset: () => void;
  show: () => void;
};
