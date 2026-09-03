import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import type { AnnotationConfiguration, type AnnotationModalConfig  } from '@ghentcdh/annotation-ui';


type EditorStatus = 'show' | 'create' | 'edit' | 'link' | null;

export type EditorConfig = {
  modal: AnnotationModalConfig;
  annotation: AnnotationConfiguration;
};

export type EditorState_ = {
  info: { message: string; short: string } | null;
  editorState: EditorStatus;
  disableEdits: boolean;
  selectedAnnotation: W3CAnnotation | null;
  reset: () => void;
  show: () => void;
};
