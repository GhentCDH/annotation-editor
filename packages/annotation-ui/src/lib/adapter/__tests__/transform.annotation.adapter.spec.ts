import { type W3CAnnotation } from '@ghentcdh/w3c-utils';

import { editorAnnotationSchema } from '../editor.annotation';
import { createLinks, parseAnnotations } from '../transform.annotation.adapter';
import { w3cAnnotationTransformer } from '../w3c.transform.annotation.adapter';

const SOURCE = 'urn:source:1';

const w3c = (id: string, target: W3CAnnotation['target']) =>
  ({
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    id,
    type: 'Annotation',
    motivation: 'tagging',
    body: [
      {
        id: 'animals',
        type: 'AnnotationStyle',
        purpose: 'styling',
        name: 'animals',
      },
      { type: 'AnnotationMetadata', species: 'parrot' },
    ],
    target,
  }) as unknown as W3CAnnotation;

const textTarget = {
  type: 'SpecificResource',
  source: SOURCE,
  selector: [
    { type: 'TextPositionSelector', start: 3, end: 9 },
    { type: 'TextQuoteSelector', exact: 'parrot', prefix: 'a ', suffix: '!' },
  ],
};

const editor = (id: string, selectorUri: string, links: string[] = []) =>
  editorAnnotationSchema.parse({
    id,
    definitionUri: 'animals',
    metadata: {},
    selectors: [{ uri: selectorUri, start: 0, end: 1 }],
    links: links.map((uri) => ({ uri })),
  });

describe('w3cAnnotationTransformer', () => {
  it('round-trips parse → format → parse', () => {
    const parsed = w3cAnnotationTransformer.parse(w3c('a1', textTarget));
    expect(parsed).toMatchObject({
      id: 'a1',
      definitionUri: 'animals',
      metadata: { species: 'parrot' },
      selectors: [
        {
          uri: SOURCE,
          start: 3,
          end: 9,
          exact: 'parrot',
          prefix: 'a ',
          suffix: '!',
        },
      ],
      links: [],
    });

    const again = w3cAnnotationTransformer.parse(
      w3cAnnotationTransformer.format(parsed!, false),
    );
    expect(again).toMatchObject({
      id: parsed!.id,
      definitionUri: parsed!.definitionUri,
      metadata: parsed!.metadata,
      selectors: parsed!.selectors,
      links: parsed!.links,
    });
  });

  it('parses a target without selector as a link', () => {
    const parsed = w3cAnnotationTransformer.parse(
      w3c('a1', [
        textTarget,
        { type: 'SpecificResource', source: 'a2' },
      ] as never),
    );
    expect(parsed?.links).toEqual([{ uri: 'a2' }]);
  });
});

describe('createLinks', () => {
  it('sets parentId when a selector points at another annotation', () => {
    const [parent, child] = createLinks([
      editor('p', SOURCE),
      editor('c', 'p'),
    ]);
    expect(parent.parentId).toBeUndefined();
    expect(child.parentId).toBe('p');
  });

  it('makes links bidirectional without duplicates', () => {
    const [a, b] = createLinks([
      editor('a', SOURCE, ['b']),
      editor('b', SOURCE, ['a']),
    ]);
    expect(a.links).toEqual([{ uri: 'b' }]);
    expect(b.links).toEqual([{ uri: 'a' }]);

    const [, d] = createLinks([
      editor('c', SOURCE, ['d']),
      editor('d', SOURCE),
    ]);
    expect(d.links).toEqual([{ uri: 'c' }]);
  });
});

describe('parseAnnotations', () => {
  it('drops annotations the transformer cannot parse', () => {
    const parsed = parseAnnotations(
      {
        parse: (a: { ok: boolean; id: string }) =>
          a.ok ? editor(a.id, SOURCE) : null,
        format: () => ({ ok: true, id: '' }),
      },
      [
        { ok: true, id: 'x' },
        { ok: false, id: 'y' },
      ],
    );
    expect(parsed.map((a) => a.id)).toEqual(['x']);
  });
});
