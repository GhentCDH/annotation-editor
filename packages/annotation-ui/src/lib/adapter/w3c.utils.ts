import {
  type W3CAnnotation,
  type W3CAnnotationBuilder,
} from '@ghentcdh/w3c-utils';
import { type AnnotationStyle } from '../../../../annotation-core/src/lib/annotation.style';
import { type AllowedChildrenPerType } from '../types/ui-annotation-definition.type';
import { type KeyLabel } from '../../../../annotation-core/src/lib/types/key-label.type';

export type AnnotationLink = {
  purpose: string;
  annotation: W3CAnnotation;
  relations: W3CAnnotation[];
};

const mapRelationsToLinks = (
  sourceUri: string,
  builders: Map<string, W3CAnnotationBuilder>,
  annotations: W3CAnnotation[],
): AnnotationLink[] => {
  return annotations
    .map((link) => {
      const builder = builders.get(link.id)!;
      const specifyResource = builder.getSpecificResourceTargets(sourceUri);

      if (!specifyResource || specifyResource.length === 0) return null;

      const sourceUris = builder
        .getSpecificResourceTargets()
        .map((s) => s.source)
        .filter((s) => s !== sourceUri);

      const relations = sourceUris
        .map((uri) => {
          return annotations.find((a) => a.id === uri);
        })
        .filter(Boolean) as W3CAnnotation[];

      return {
        purpose: getAnnotationType(builder),
        annotation: link,
        relations,
      } as AnnotationLink;
    })
    .filter(Boolean) as AnnotationLink[];
};

type AnnotationPositionTree = {
  id: string;
  allowedChildren: KeyLabel[];
  sourceUri: string;
  start: number;
  end: number;
  type: string;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export const getAnnotationType = (builder: W3CAnnotationBuilder) => {
  return getAnnotationStyle(builder)?.id ?? 'text';
};

const getAnnotationStyle = (builder: W3CAnnotationBuilder) => {
  const style = builder
    .getBodiesByPurpose('styling')
    .find((b: any) => b.type === 'AnnotationStyle');

  return style as AnnotationStyle | null;
};
const getAnnotationPosition = (
  id: string,
  builder: W3CAnnotationBuilder,
  allowedChildrenPerType: AllowedChildrenPerType,
) => {
  const sourceUri = builder.getSpecificResourceTargets()[0]?.source;

  if (!sourceUri) {
    return null;
  }
  const textPositionSelector = builder.getTextPositionSelector(sourceUri)[0];

  // skip this annotation if it doesn't have a source URI
  if (!textPositionSelector) {
    return null;
  }

  const type = getAnnotationStyle(builder)?.id ?? 'text';

  return {
    id: id,
    start: textPositionSelector.start,
    end: textPositionSelector.end,
    allowedChildren: allowedChildrenPerType[type] ?? [],
    sourceUri: sourceUri ?? '',
    type,
    minX: textPositionSelector.start,
    minY: 0,
    maxX: textPositionSelector.end,
    maxY: 0,
  } as AnnotationPositionTree;
};

const rootId = 'ROOT';

const createId = () => {
  return `mela:new-annotation:${Date.now()}`;
};

export type Selector = {
  source: string;
  start: number;
  end: number;
  suffix: string;
  prefix: string;
  exact: string;
};
const updateSelector = (builder: W3CAnnotationBuilder, selector: Selector) => {
  if (!builder.getSpecificResourceTargets(selector.source).length) {
    builder.addTarget({
      type: 'SpecificResource',
      source: selector.source,
    });
  }
  builder.updateTextPositionSelector(
    { start: selector.start, end: selector.end },
    selector.source,
  );
  builder.updateTextQuoteSelector(
    { prefix: selector.prefix, suffix: selector.suffix, exact: selector.exact },
    selector.source,
  );

  return builder;
};
