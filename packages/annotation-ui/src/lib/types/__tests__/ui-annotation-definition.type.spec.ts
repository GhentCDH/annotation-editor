import { describe, expect, it } from 'vitest';

import { UiAnnotationDefinitionSchema } from '../ui-annotation-definition.type';

const base = { id: 'animals', name: 'animals', annotation: {} };

describe('UiAnnotationDefinitionSchema', () => {
  it.each`
    title        | label
    ${'Animals'} | ${'Animals'}
    ${undefined} | ${'animals'}
  `('should use title before name as label ($label)', ({ title, label }) => {
    expect(UiAnnotationDefinitionSchema.parse({ ...base, title }).label).toBe(
      label,
    );
  });
});
