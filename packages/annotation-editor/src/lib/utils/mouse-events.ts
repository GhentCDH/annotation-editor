export const getMousePosition = (e: MouseEvent) => {
  const x = Math.min(e.clientX, window.innerWidth - 270);
  const y = Math.min(e.clientY, window.innerHeight - 200);

  return { x, y };
};
