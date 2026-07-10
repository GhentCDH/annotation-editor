// GridLayout, PaneConfig, PreviewLayout, buildGridStyle, getPaneArea
// are all re-exported from annotation-core via the package barrel (src/index.ts).
// This file is kept for backwards compatibility of direct imports.
export {
  type PaneConfig,
  type GridLayout,
  type PreviewLayout,
  buildGridStyle,
  getPaneArea,
} from '@ghentcdh/annotation-core';
