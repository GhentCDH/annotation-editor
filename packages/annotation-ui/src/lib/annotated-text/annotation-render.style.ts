import { createHighlightStyle, Debugger } from '@ghentcdh/annotated-text';
import { EditorAnnotation } from '@ghentcdh/annotation-ui';

export const defaultRender = (annotation: EditorAnnotation): string | null => {
  const style = annotation.definition?.annotation;
  return style?.target ?? 'default';
};

export const styleFn =
  (listStyles: string[]) => (annotation: EditorAnnotation) => {
    const definition = annotation.definition;
    if (!definition) return 'default';

    const styleId = definition?.id ?? 'default';

    if (!listStyles.includes(styleId)) {
      Debugger.debug('styleFn', `No style found for ${styleId}`);

      if (definition.annotation.color) {
        return { default: createHighlightStyle(definition.annotation.color) };
      }

      return 'default';
    }

    return styleId;
  };
