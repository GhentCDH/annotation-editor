import type {
  AnnotationModalConfig,
  EditorAnnotation,
} from '@ghentcdh/annotation-ui';

type EditorStatus = 'show' | 'create' | 'edit' | 'link' | null;

export type EditorConfig = {
  modal: AnnotationModalConfig;
  annotation: EditorAnnotation;
};

export type EditorState_ = {
  info: { message: string; short: string } | null;
  editorState: EditorStatus;
  disableEdits: boolean;
  selectedAnnotation: EditorAnnotation | null;
  reset: () => void;
  show: () => void;
};
