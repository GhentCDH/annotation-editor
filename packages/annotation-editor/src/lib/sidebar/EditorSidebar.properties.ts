export const EditorSidebarProperties = {
  /** Drawer width in px; updated while dragging the left-edge handle */
  width: { type: Number, required: true as const },
};

export const EditorSidebarEmits = {
  'update:width': (_width: number) => true,
};
