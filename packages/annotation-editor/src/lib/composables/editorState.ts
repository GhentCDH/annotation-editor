import {
  type AnnotationModalConfig,
  type EditorAnnotation,
  type Selector,
  type SourceModel,
  UiAnnotatedText,
} from '@ghentcdh/annotation-ui';

type EditorStatus = 'show' | 'create' | 'edit' | 'link' | null;

export type EditorConfig = {
  modal: AnnotationModalConfig;
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
  transformMetadata: (metadata: any, selector: Selector) => any;
};
