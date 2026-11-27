const MIN_WIDTH = 240;
const MAX_RATIO = 0.8;

/** Keep the sidebar between MIN_WIDTH and 80% of the viewport */
export const clampSidebarWidth = (
  width: number,
  viewport = window.innerWidth,
) =>
  Math.round(
    Math.min(Math.max(width, MIN_WIDTH), Math.max(MIN_WIDTH, viewport * MAX_RATIO)),
  );
