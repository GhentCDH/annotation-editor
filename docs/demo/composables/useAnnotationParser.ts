import { ref } from 'vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type UIAnnotationDefinition } from '@ghentcdh/annotation-core';

type RawAnnotation = {
  start: number;
  end: number;
  type: string;
  [key: string]: unknown;
};

let counter = 0;
const nextId = () => `urn:annotation:parsed:${++counter}`;

const toW3C = (
  raw: RawAnnotation,
  sourceUri: string,
  definitions: UIAnnotationDefinition[],
): W3CAnnotation => {
  const { start, end, type, ...metadata } = raw;
  const definition = definitions.find((d) => d.id === type);
  const style = definition?.annotation;

  const body: unknown[] = [];

  if (style) {
    body.push({
      id: type,
      type: 'AnnotationStyle',
      purpose: 'styling',
      name: definition?.label ?? type,
      ...(style.color ? { color: style.color } : {}),
      ...(style.target ? { target: style.target } : {}),
    });
  }

  body.push({
    type: 'TextualBody',
    value: type,
    format: 'text/plain',
    purpose: 'tagging',
  });

  if (Object.keys(metadata).length) {
    body.push({ type: 'AnnotationMetadata', ...metadata });
  }

  return {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    id: nextId(),
    type: 'Annotation',
    motivation: 'tagging',
    body,
    target: {
      type: 'SpecificResource',
      source: sourceUri,
      selector: [{ type: 'TextPositionSelector', start, end }],
    },
  } as unknown as W3CAnnotation;
};

export const useAnnotationParser = () => {
  const input = ref('[\n  { "start": 0, "end": 10, "type": "animals" }\n]');
  const sourceUri = ref('');
  const parseError = ref('');
  const expanded = ref(false);

  const parse = (
    definitions: UIAnnotationDefinition[],
    sources: { id: string; uri: string }[],
  ): W3CAnnotation[] | null => {
    parseError.value = '';
    if (!sourceUri.value) {
      parseError.value = 'Select a source';
      return null;
    }
    try {
      const raw: RawAnnotation[] = JSON.parse(input.value);
      if (!Array.isArray(raw)) throw new Error('Input must be a JSON array');
      return raw.map((r) => toW3C(r, sourceUri.value, definitions));
    } catch (e) {
      parseError.value = e instanceof Error ? e.message : String(e);
      return null;
    }
  };

  return { input, sourceUri, parseError, expanded, parse };
};
