import { createAnnotationStyleBodyUnsafe } from '../annotation.style';

describe('createAnnotationStyleBodyUnsafe', () => {
  it.each`
    style                                                  | name
    ${{ id: 'animals', name: 'animals', title: 'Animals' }} | ${'Animals'}
    ${{ id: 'animals', name: 'animals' }}                   | ${'animals'}
  `('should label the style body with $name', ({ style, name }) => {
    const parsed = createAnnotationStyleBodyUnsafe(undefined, style);

    expect(parsed.body).toMatchObject({ name });
  });
});
