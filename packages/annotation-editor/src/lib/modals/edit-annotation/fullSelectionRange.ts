type Range = { start: number; end: number };

/**
 * Range for "Select all text": the parent's selector when nested, otherwise the
 * whole text shifted by the adapter's `startOffset` (same offset the adapter
 * applies to created/edited selections).
 */
export const fullSelectionRange = (
  text: string,
  startOffset: number,
  parentSelector?: Range | null,
): Range =>
  parentSelector
    ? { start: parentSelector.start, end: parentSelector.end }
    : { start: startOffset, end: startOffset + text.length + 1 };
