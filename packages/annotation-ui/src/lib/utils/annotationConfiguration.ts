import {
  type AnnotationAdapter,
  createAnnotatedText,
  type CustomAnnotationStyle,
  PlainTextAdapter,
  type TextAdapter,
  W3CAnnotationAdapter,
  WordSnapper,
} from '@ghentcdh/annotated-text';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { defaultRender, styleFn } from './annotation.style';
import { type AnnotationUtils } from './annotation-utils';
import {
  type AllowedChildrenPerType,
  type AnnotationConfiguration,
  type AnnotationDefinition,
} from '../types/AnnotationConfiguration.model';
import { type SourceModel } from '../types/source.model';

const groupById = <KEY extends keyof AnnotationDefinition>(
  defs: AnnotationDefinition[],
  valueKey?: KEY,
) => {
  if (!defs)
    return {} as Record<
      string,
      AnnotationDefinition[KEY] | AnnotationDefinition
    >;

  return defs.reduce(
    (acc, def) => {
      acc[def.id] = valueKey ? def[valueKey] : def;
      return acc;
    },
    {} as Record<string, AnnotationDefinition[KEY] | AnnotationDefinition>,
  );
};

export const createAnnotationConfiguration = (
  annotationDefinitions: AnnotationDefinition[] | undefined,
  utils: AnnotationUtils,
  textAdapter: TextAdapter | undefined,
  annotationAdapter: AnnotationAdapter<W3CAnnotation> | undefined,
): AnnotationConfiguration => {
  const definitions = annotationDefinitions ?? ([] as AnnotationDefinition[]);
  const definitionsMap = groupById(definitions) as Record<
    string,
    AnnotationDefinition
  >;
  const rootTypes = definitions
    .filter((d) => d.isRoot)
    .map((d) => ({ key: d.id, label: d.label }));
  const styles = groupById(definitions, 'style') as Record<
    string,
    CustomAnnotationStyle
  >;

  if (!styles['default']) {
    styles['default'] = {};
  }

  const allowedChildrenPerType = groupById(
    definitions,
    'allowedChildren',
  ) as AllowedChildrenPerType;

  const defaultAnnotationAdapter = (source?: SourceModel) =>
    W3CAnnotationAdapter(source ? { sourceUri: source.uri } : {});

  const renderParams = () => ({ renderFn: defaultRender(utils) });
  const styleParams = () => ({ styleFn: styleFn(utils) });

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
    getDefinition: (id) => definitionsMap[id] ?? undefined,
    rootTypes,
    createAnnotatedText: _createAnnotatedText,
  };
};
