import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import type { AnnotationModalConfig, AnnotationConfiguration } from '@ghentcdh/annotation-ui';

export type PreviewConfig = {
  modal: AnnotationModalConfig;
  annotation: AnnotationConfiguration;
};

export type PreviewState_ = {
  selectedAnnotation: W3CAnnotation | null;
  reset: () => void;
};
