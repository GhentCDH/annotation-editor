import { describe, expect, it } from 'vitest';

import { UiAnnotionDefinitionSchema } from '../ui-annotation-definition.type';

const base = { id: 'animals', name: 'animals', annotation: {} };

describe('UiAnnotionDefinitionSchema', () => {
  it.each`
    title        | label
    ${'Animals'} | ${'Animals'}
    ${undefined} | ${'animals'}
  `('should use title before name as label ($label)', ({ title, label }) => {
    expect(UiAnnotionDefinitionSchema.parse({ ...base, title }).label).toBe(
      label,
    );
  });
});
