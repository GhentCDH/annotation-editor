import {
  createAnnotatedText,
  createHighlightStyle,
  type CustomAnnotationStyle,
  PlainTextAdapter,
  type TextAdapter,
  WordSnapper,
} from '@ghentcdh/annotated-text';
import { defaultRender, styleFn } from './annotation-render.style';
import { type SourceModel } from '@ghentcdh/annotation-core';
import {
  AllowedChildrenPerType,
  EditorAnnotation,
  TransformAnnotationAdapter,
  UIAnnotationConfiguration,
  UIAnnotationDefinition,
} from '@ghentcdh/annotation-ui';
import { AnnotationEditorAnnotationAdapter } from '../adapter/editor.annotation.adapter';

const groupById = <KEY extends keyof UIAnnotationDefinition>(
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
  annotationDefinitions: UIAnnotationDefinition[] | undefined,
  textAdapter: (() => TextAdapter) | undefined,
  transformAnnotationAdapter: TransformAnnotationAdapter<any>,
): UIAnnotationConfiguration => {
  const definitions = annotationDefinitions ?? ([] as UIAnnotationDefinition[]);
  transformAnnotationAdapter.setDefinitions(definitions);
  const definitionsMap = groupById(definitions) as Record<
    string,
    UIAnnotationDefinition
  >;
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
      renderFn: defaultRender,
    });
    const styleParams = () => ({
      styleFn: styleFn(listStyles),
    });

    const annotatedText = createAnnotatedText<EditorAnnotation>(id, {
      annotationAdapter: new AnnotationEditorAnnotationAdapter({
        ...transformAnnotationAdapter.defaultParams,
        sourceModel,
      }),
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

    return annotatedText;
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
