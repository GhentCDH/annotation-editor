import type { W3CAnnotation } from '@ghentcdh/w3c-utils';
import { SOURCE_URI_1, SOURCE_URI_2 } from './sources';

/** Minimal W3C annotation with a TextPositionSelector targeting source 1. */
const makeAnnotation = (
  id: string,
  sourceUri: string,
  start: number,
  end: number,
  styleId: string,
  styleName: string,
): W3CAnnotation =>
  ({
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    id,
    type: 'Annotation',
    motivation: 'tagging',
    body: [
      {
        type: 'AnnotationStyle',
        id: styleId,
        name: styleName,
        purpose: 'styling',
      },
    ],
    target: {
      type: 'SpecificResource',
      source: sourceUri,
      selector: {
        type: 'TextPositionSelector',
        start,
        end,
      },
    },
  }) as unknown as W3CAnnotation;

export const mockAnnotations: W3CAnnotation[] = [
  makeAnnotation(
    'mela:annotation/1',
    SOURCE_URI_1,
    0,
    11,
    'entity',
    'Entity',
  ),
  makeAnnotation(
    'mela:annotation/2',
    SOURCE_URI_1,
    57,
    91,
    'entity',
    'Entity',
  ),
  makeAnnotation(
    'mela:annotation/3',
    SOURCE_URI_2,
    0,
    11,
    'entity',
    'Entity',
  ),
];

export const emptyAnnotations: W3CAnnotation[] = [];
