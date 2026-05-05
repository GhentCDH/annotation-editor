import { CustomAnnotationStyle } from '@ghentcdh/annotated-text';
import { W3CAnnotation } from '@ghentcdh/w3c-utils';
import { AnnotationUtils } from '../utils/annotation-utils';

export const defaultRender =
  (utils: AnnotationUtils) =>
  (annotation: W3CAnnotation): string | null => {
    const style = utils?.getAnnotationStyle(annotation);
    return style?.target ?? style?.id ?? 'default';
  };

export const defaultStyle: CustomAnnotationStyle = {};
