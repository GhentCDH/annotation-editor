import { Selector, SourceModel } from '@ghentcdh/annotation-core';
import { w3cAnnotation, W3CAnnotation } from '@ghentcdh/w3c-utils';
import { W3CSpecificResource } from '@ghentcdh/w3c-utils/lib/annotation/annotation.schema';

const createSelector = (selector: W3CSpecificResource): Selector => {
  let result = { source: selector.source } as Selector;

  for (const s of selector.selector) {
    result = { ...result, ...s, type: undefined };
  }

  return result as Selector;
};

export const getTextSelector = ({
  source,
  parent,
  annotation,
}: {
  source: SourceModel;
  parent?: W3CAnnotation;
  annotation: W3CAnnotation;
}) => {
  const current = w3cAnnotation(annotation);
  const specifyResourceSelector = current.getSpecificResourceTargets(
    source.uri,
  )[0];

  if (!specifyResourceSelector) return null;

  const sourceSelector = createSelector(specifyResourceSelector);

  if (!parent) return [sourceSelector];

  const parentTextSelector = w3cAnnotation(parent).getTextPositionSelector(
    source.uri,
  )[0];
  const length = sourceSelector.end - sourceSelector.start;
  const start = sourceSelector.start - parentTextSelector.start;
  const end = start + length;
  const parentSelector = {
    ...sourceSelector,
    source: parent.id,
    start,
    end,
  };

  return [sourceSelector, parentSelector];
};
