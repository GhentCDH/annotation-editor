import { describe, expect, it } from 'vitest';

import { fullSelectionRange } from '../fullSelectionRange';

describe('fullSelectionRange', () => {
  it.each`
    startOffset | expected
    ${0}        | ${{ start: 0, end: 6 }}
    ${1}        | ${{ start: 1, end: 7 }}
    ${10}       | ${{ start: 10, end: 16 }}
  `(
    'should shift the full text range by startOffset $startOffset',
    ({ startOffset, expected }) => {
      expect(fullSelectionRange('hello', startOffset)).toEqual(expected);
    },
  );

  it('should use the parent selector when nested, ignoring startOffset', () => {
    expect(fullSelectionRange('hello', 1, { start: 3, end: 9 })).toEqual({
      start: 3,
      end: 9,
    });
  });
});
