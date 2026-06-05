/**
 * CSS grid-area-based layout configuration for AnnotationPreview.
 *
 * Example — original left, translation right, commentary spanning full width below:
 *
 * ```ts
 * const layout: PreviewLayout = {
 *   areas: [
 *     ['original',    'translation'],
 *     ['commentary',  'commentary' ],
 *   ],
 *   columns: '1fr 1fr',
 *   panes: [
 *     { sourceId: 'original',    area: 'original'    },
 *     { sourceId: 'translation', area: 'translation' },
 *     { sourceId: 'commentary',  area: 'commentary'  },
 *   ],
 * };
 * ```
 */
export type PaneConfig = {
  /** Matches `SourceModel.id` */
  sourceId: string;
  /** CSS grid-area name — must appear in `areas` */
  area: string;
};

export type PreviewLayout = {
  /**
   * Grid template areas as a 2-D array of area names.
   * Each inner array is one row; repeat an area name to span columns.
   */
  areas: string[][];
  /** CSS grid-template-columns value. Defaults to equal fractions per column. */
  columns?: string;
  /** CSS grid-template-rows value. Optional. */
  rows?: string;
  /** Mapping of source IDs to their grid area name. */
  panes: PaneConfig[];
};

/** Computed CSS styles for the grid container */
export const buildGridStyle = (layout: PreviewLayout): Record<string, string> => {
  const templateAreas = layout.areas
    .map((row) => `"${row.join(' ')}"`)
    .join(' ');

  const colCount = layout.areas[0]?.length ?? 1;
  const columns =
    layout.columns ?? Array(colCount).fill('minmax(0, 1fr)').join(' ');

  const style: Record<string, string> = {
    gridTemplateAreas: templateAreas,
    gridTemplateColumns: columns,
  };

  if (layout.rows) {
    style['gridTemplateRows'] = layout.rows;
  }

  return style;
};

/** Returns the grid-area CSS value for a given source id, or undefined if not configured */
export const getPaneArea = (
  layout: PreviewLayout,
  sourceId: string,
): string | undefined => {
  return layout.panes.find((p) => p.sourceId === sourceId)?.area;
};
