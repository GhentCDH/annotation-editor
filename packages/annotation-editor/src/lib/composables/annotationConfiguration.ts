import {
  createAnnotatedText,
  CustomAnnotationStyle,
  W3CAnnotationAdapter,
  WordSnapper
} from '@ghentcdh/annotated-text';
import { MarkdownTextAdapter } from '@ghentcdh/annotated-text--markdown';
import { W3CAnnotation } from '@ghentcdh/w3c-utils';
import {
  AllowedChildrenPerType,
  AnnotationConfiguration,
  AnnotationDefinition
} from '../types/AnnotationConfiguration.model';
import { defaultRender, defaultStyle } from '../style/annotation.style';
import { SourceModel } from '../types/source.model';
import { AnnotationEditorProps } from '../AnnotationEditor.properties';
import { AnnotationUtils } from '../utils/annotation-utils';

const groupById = <KEY extends keyof AnnotationDefinition>(
  defs: AnnotationDefinition[],
  valueKey?: KEY,
) => {
  return defs.reduce(
    (acc, def) => {
      acc[def.id] = valueKey ? def[valueKey] : def;
      return acc;
    },
    {} as Record<string, AnnotationDefinition[KEY] | AnnotationDefinition>,
  );
};

export const createAnnotationConfiguration = (
  props: AnnotationEditorProps,
  utils: AnnotationUtils,
): AnnotationConfiguration => {
  const definitions =
    props.annotationDefinitions ?? ([] as AnnotationDefinition[]);
  const definitionsMap = groupById(definitions) as Record<
    string,
    AnnotationDefinition
  >;
  const rootTypes = definitions
    .filter((d) => d.isRoot)
    .map((d) => ({
      key: d.id,
      label: d.label,
    }));
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
  const annotationAdapter = (source?: SourceModel) =>
    W3CAnnotationAdapter(
      source
        ? {
            sourceUri: source.uri,
          }
        : {},
    );

  const renderParams = () => ({
    renderFn: defaultRender(utils),
  });
  const styleParams = () => ({
    styleFn: (a: W3CAnnotation) => utils.getAnnotationStyle(a) ?? null
  });
  const _createAnnotatedText = (id: string, sourceModel?: SourceModel) => {
    const annotatedText = createAnnotatedText<W3CAnnotation>(id);

    if (sourceModel) {
      const { content } = sourceModel;

      annotatedText.setText(content.text).setTextAdapter({
        textDirection: content.textDirection,
      });
    }

    annotatedText
      .setSnapper(new WordSnapper())
      .setAnnotationAdapter(annotationAdapter(sourceModel))
      .setTextAdapter(MarkdownTextAdapter())
      // .setTagLabelFn(findPurpose)
      .setRenderParams(renderParams())
      .setStyleParams(styleParams())
      .registerStyles(styles);

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
