import {
  createAnnotatedText,
  createHighlightStyle,
  type CustomAnnotationStyle,
  PlainTextAdapter,
  type TextAdapter,
  WordSnapper,
} from '@ghentcdh/annotated-text';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { defaultRender, styleFn } from './annotation-render.style';
import {
  AllowedChildrenPerType,
  AnnotationEditorAdapter,
  type UIAnnotationConfiguration,
  type UIAnnotationDefinition,
} from '@ghentcdh/annotation-ui';
import { type SourceModel } from '../types/source.model';

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
  annotationEditorAdapter: AnnotationEditorAdapter<any>,
): UIAnnotationConfiguration => {
  const definitions = annotationDefinitions ?? ([] as UIAnnotationDefinition[]);
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
    const _annotationAdapter = annotationEditorAdapter.createAnnotationAdapter({
      sourceModel,
    } as any);

    const renderParams = () => ({
      renderFn: defaultRender(annotationEditorAdapter),
    });
    const styleParams = () => ({
      styleFn: styleFn(listStyles, annotationEditorAdapter),
    });

    const annotatedText = createAnnotatedText<W3CAnnotation>(id, {
      annotationAdapter: _annotationAdapter,
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
    annotationEditorAdapter,
    allowedChildrenPerType,
    definitions,
    getDefinition: (id) => {
      const def = definitionsMap[id] ?? undefined;
      return def;
    },
    getMetadata: (annotation) =>
      annotationEditorAdapter.getMetadata(annotation),
    getDefinitionForAnnotation: (annotation) =>
      annotationEditorAdapter.getDefinition(annotation),
    rootTypes,
    createAnnotatedText: _createAnnotatedText,
  };
};
