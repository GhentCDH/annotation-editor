export const getMousePosition = (container: HTMLElement, event: MouseEvent) => {
  const rect = container.getBoundingClientRect();
  const x = event!.clientX - rect.left + container.scrollLeft;
  const y = event!.clientY - rect.top + container.scrollTop;

  return {
    x: x,
    y: y,
  };
};

export const getAnnotationElementCenter = (
  container: HTMLElement,
  annotationId: string,
) => {
  if (!container) return null;
  const el = document.querySelector(
    `g[data-annotation-uid="${annotationId}"]:not([data-annotation-role="tag"])`,
  );

  if (!el) return null;
  const rect = el.getBoundingClientRect();

  const parentRect = container.getBoundingClientRect();

  return {
    x: rect.left - parentRect.left + rect.width / 2,
    y: rect.top - parentRect.top + rect.height / 2,
  };
};
