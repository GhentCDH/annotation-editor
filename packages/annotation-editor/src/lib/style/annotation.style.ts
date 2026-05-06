import { type CustomAnnotationStyle } from '@ghentcdh/annotated-text';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type AnnotationUtils } from '../utils/annotation-utils';

export const defaultRender =
  (utils: AnnotationUtils) =>
  (annotation: W3CAnnotation): string | null => {
    const style = utils?.getAnnotationStyle(annotation);
    return style?.target ?? style?.id ?? 'default';
  };

export const defaultStyle: CustomAnnotationStyle = {};
