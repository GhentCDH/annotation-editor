import { AnnotationJsonResourceSchema } from '../annotation-json-config.types';

describe('AnnotationJsonResourceSchema', () => {
  it.each`
    input                                    | id               | title
    ${{ name: 'animals', title: 'Animals' }} | ${'animals'}     | ${'Animals'}
    ${{ name: 'keyConcepts' }}               | ${'keyConcepts'} | ${expect.any(String)}
  `('uses name $input.name as id', ({ input, id, title }) => {
    const parsed = AnnotationJsonResourceSchema.parse(input);

    expect(parsed.id).toBe(id);
    expect(parsed.name).toBe(id);
    expect(parsed.title).toEqual(title);
  });

  it('applies annotation defaults', () => {
    const parsed = AnnotationJsonResourceSchema.parse({ name: 'a' });

    expect(parsed.annotation).toEqual({
      isRoot: true,
      allowedChildren: [],
      allowedLinks: [],
      target: 'highlight',
    });
  });

  it.each`
    input                                         | reason
    ${{}}                                         | ${'missing name'}
    ${{ name: 'a', annotation: { target: 'x' } }} | ${'unknown target'}
  `('rejects $reason', ({ input }) => {
    expect(AnnotationJsonResourceSchema.safeParse(input).success).toBe(false);
  });
});
