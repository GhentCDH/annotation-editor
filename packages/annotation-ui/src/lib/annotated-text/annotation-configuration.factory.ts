import {
  createAnnotatedText,
  createHighlightStyle,
  type CustomAnnotationStyle,
  PlainTextAdapter,
  type TextAdapter,
  WordSnapper,
} from '@ghentcdh/annotated-text';
import { type SourceModel } from '@ghentcdh/annotation-core';
import { defaultRender, styleFn } from './annotation-render.style';
import {
  type AllowedChildrenPerType,
  type DefinitionMap,
  type UIAnnotationConfiguration,
  type UIAnnotationDefinition,
} from '../types/ui-annotation-definition.type';
import { AnnotationEditorAnnotationAdapter } from '../adapter/editor.annotation.adapter';
import { type EditorAnnotation } from '../adapter';

export const groupById = <KEY extends keyof UIAnnotationDefinition>(
  defs: UIAnnotationDefinition[],
  valueKey?: KEY,
) => {
  if (!defs)
    return {} as Record<
      string,
      UIAnnotationDefinition[KEY] | UIAnnotationDefinition
    >;

  return defs.reduce(
    (acc, def) => {
      acc[def.id] = valueKey ? def[valueKey] : def;
      return acc;
    },
    {} as Record<string, UIAnnotationDefinition[KEY] | UIAnnotationDefinition>,
  );
};

export const createAnnotationConfiguration = (
  textAdapter: (() => TextAdapter) | undefined,
  defaultAannotationAdapterParams = {},
  definitionsMap: DefinitionMap,
): UIAnnotationConfiguration => {
  const definitions = Object.values(definitionsMap);
  const rootTypes = definitions
    .filter((d) => d.annotation.isRoot)
    .map((d) => ({ key: d.id, label: d.label }));
  const styles = groupById(definitions, 'style') as Record<
    string,
    CustomAnnotationStyle
  >;

  if (!styles['default']) {
    styles['default'] = {
      label: 'Annotation',
      isRoot: true,
      style: { default: createHighlightStyle('#dd7777') },
      allowedChildren: [],
      allowedLinks: [],
      views: {},
    } as unknown as CustomAnnotationStyle;
  }
  const listStyles = Object.keys(styles);

  const allowedChildrenPerType = groupById(
    definitions,
    'allowedChildren',
  ) as AllowedChildrenPerType;

  const _createAnnotatedText = (id: string, sourceModel?: SourceModel) => {
    const _textAdapter = textAdapter?.() ?? PlainTextAdapter();

    const renderParams = () => ({
      renderFn: defaultRender(definitionsMap),
    });
    const styleParams = () => ({
      styleFn: styleFn(listStyles, definitionsMap),
    });
    const annotationAdapter = new AnnotationEditorAnnotationAdapter({
      ...defaultAannotationAdapterParams,
      sourceModel,
    });
    const annotatedText = createAnnotatedText<EditorAnnotation>(id, {
      annotationAdapter,
      textAdapter: _textAdapter,
    });

    annotatedText
      .setSnapper(new WordSnapper())
      .setRenderParams(renderParams())
      .setStyleParams(styleParams())
      .registerStyles(styles);

    if (sourceModel) {
      const { content } = sourceModel;
      annotatedText
        .setText(content.text)
        .setTextAdapterParams({ textDirection: content.textDirection });
    }

    return {
      annotatedText,
      textAdapter: _textAdapter,
      annotationAdapter: annotationAdapter,
    };
  };

  return {
    allowedChildrenPerType,
    definitions,
    getDefinition: (id) => {
      const def = definitionsMap[id] ?? undefined;
      return def;
    },
    rootTypes,
    createAnnotatedText: _createAnnotatedText,
  };
};
