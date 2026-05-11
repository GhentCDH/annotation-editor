export const getMousePosition = (e: MouseEvent) => {
  return { x: e.clientX, y: e.clientY };
};


export const getAnnotationElementCenter = (annotationId: string) => {
  const el = document.querySelector(
    `g[data-annotation-uid="${annotationId}"]:not([data-annotation-role="tag"])`,
  );
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

