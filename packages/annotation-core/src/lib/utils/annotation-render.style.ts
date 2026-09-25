import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { createHighlightStyle, Debugger } from '@ghentcdh/annotated-text';

export const defaultRender =
  (adapter: AnnotationEditorAdapter<any>) =>
  (annotation: W3CAnnotation): string | null => {
    const style = adapter?.getDefinition(annotation);
    return style?.annotation.target ?? 'default';
  };

export const styleFn =
  (listStyles: string[], adapter: AnnotationEditorAdapter) =>
  (annotation: W3CAnnotation) => {
    const definition = adapter?.getDefinition(annotation);
    if (!definition) return 'default';

    const styleId = definition?.id ?? 'default';

    if (!listStyles.includes(styleId)) {
      Debugger.debug('styleFn', `No style found for ${styleId}`);

      if (definition.color) {
        return { default: createHighlightStyle(definition.color) };
      }

      return 'default';
    }

    return styleId;
  };
