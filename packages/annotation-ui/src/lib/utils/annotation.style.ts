import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { createHighlightStyle, Debugger } from '@ghentcdh/annotated-text';
import { type AnnotationUtils } from './annotation-utils';

export const defaultRender =
  (utils: AnnotationUtils) =>
  (annotation: W3CAnnotation): string | null => {
    const style = utils?.getAnnotationStyle(annotation);
    return style?.target ?? 'default';
  };

export const styleFn =
  (listStyles: string[], utils: AnnotationUtils) =>
  (annotation: W3CAnnotation) => {
    const style = utils?.getAnnotationStyle(annotation);
    if (!style) return 'default';

    const styleId = style?.id ?? 'default';

    if (!listStyles.includes(styleId)) {
      Debugger.debug('styleFn', `No style found for ${styleId}`);

      if (style.color) {
        return { default: createHighlightStyle(style.color) };
      }

      return 'default';
    }

    return styleId;
  };
