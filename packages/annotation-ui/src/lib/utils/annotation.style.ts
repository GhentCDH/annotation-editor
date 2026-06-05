import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type AnnotationUtils } from './annotation-utils';

export const defaultRender =
  (utils: AnnotationUtils) =>
  (annotation: W3CAnnotation): string | null => {
    const style = utils?.getAnnotationStyle(annotation);
    return style?.target ?? 'default';
  };

export const styleFn =
  (utils: AnnotationUtils) => (annotation: W3CAnnotation) => {
    const style = utils?.getAnnotationStyle(annotation);
    return style?.id ?? 'default';
  };
