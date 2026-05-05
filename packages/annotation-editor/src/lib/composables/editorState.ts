import type { AnnotationConfiguration } from '../types/AnnotationConfiguration.model';

import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import type { SourceModel } from '../types/source.model';
import { AnnotationModalConfig } from '../modals/AnnotationModal.definition';
import type { AnnotationUtils } from '../utils/annotation-utils';

type EditorStatus = 'show' | 'create' | 'edit' | 'link' | null;

export type EditorConfig = {
  modal: AnnotationModalConfig;
  annotation: AnnotationConfiguration;
  // updateAnnotationData: (
  //   annotation: W3CAnnotation,
  //   data: unknown,
  // ) => W3CAnnotation;
};

export type EditorData = {
  annotations: W3CAnnotation[];
  sources: SourceModel[];
  utils: AnnotationUtils;
};

export type EditorState_ = {
  infoMessage: string | null;
  editorState: EditorStatus;
  disableEdits: boolean;
  selectedAnnotation: W3CAnnotation | null;
  reset: () => void;
  show: () => void;
};
