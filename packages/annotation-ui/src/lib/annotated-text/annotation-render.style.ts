import { createHighlightStyle, Debugger } from '@ghentcdh/annotated-text';
import { type DefinitionMap } from '../types/ui-annotation-definition.type';
import { type EditorAnnotation } from '../adapter/editor.annotation';

export const defaultRender =
  (definitions: DefinitionMap) =>
  (annotation: EditorAnnotation): string | null => {
    const definition = definitions[annotation.definitionUri];
    const style = definition?.annotation;
    return style?.target ?? 'default';
  };

export const styleFn =
  (listStyles: string[], definitions: DefinitionMap) =>
  (annotation: EditorAnnotation) => {
    const definition = definitions[annotation.definitionUri];
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
