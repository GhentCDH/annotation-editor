import {
  type AnnotationAdapter,
  createAnnotatedText,
  createHighlightStyle,
  type CustomAnnotationStyle,
  PlainTextAdapter,
  type TextAdapter,
  W3CAnnotationAdapter,
  WordSnapper,
} from '@ghentcdh/annotated-text';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { defaultRender, styleFn } from './annotation-render.style';
import { type AnnotationUtils } from './annotation-utils';
import {
  type AllowedChildrenPerType,
  type UIAnnotationConfiguration,
  type UIAnnotationDefinition,
} from '../types/ui-annotation-definition.type';
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
  utils: AnnotationUtils,
  textAdapter: TextAdapter | undefined,
  annotationAdapter: AnnotationAdapter<W3CAnnotation> | undefined,
): UIAnnotationConfiguration => {
  const definitions = annotationDefinitions ?? ([] as UIAnnotationDefinition[]);
  const definitionsMap = groupById(definitions) as Record<
    string,
    UIAnnotationDefinition
  >;
  const rootTypes = definitions
    .filter((d) => d.isRoot)
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
      schema: {
        uiSchema: { type: 'VerticalLayout', elements: [] },
        jsonSchema: { type: 'object', properties: {} },
        metaDataSchema: { type: 'VerticalLayout', elements: [] },
        validation: () => undefined,
      },
    } as unknown as CustomAnnotationStyle;
  }

  const listStyles = Object.keys(styles);

  const allowedChildrenPerType = groupById(
    definitions,
    'allowedChildren',
  ) as AllowedChildrenPerType;

  const defaultAnnotationAdapter = (source?: SourceModel) =>
    W3CAnnotationAdapter(source ? { sourceUri: source.uri } : {});

  const renderParams = () => ({ renderFn: defaultRender(utils) });
  const styleParams = () => ({ styleFn: styleFn(listStyles, utils) });

  const _createAnnotatedText = (id: string, sourceModel?: SourceModel) => {
    const annotatedText = createAnnotatedText<W3CAnnotation>(id);

    annotatedText
      .setSnapper(new WordSnapper())
      .setAnnotationAdapter(
        annotationAdapter ?? defaultAnnotationAdapter(sourceModel),
      )
      .setTextAdapter(textAdapter ?? PlainTextAdapter())
      .setRenderParams(renderParams())
      .setStyleParams(styleParams())
      .registerStyles(styles);

    if (sourceModel) {
      const { content } = sourceModel;
      annotatedText
        .setText(content.text)
        .setTextAdapter({ textDirection: content.textDirection });
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
