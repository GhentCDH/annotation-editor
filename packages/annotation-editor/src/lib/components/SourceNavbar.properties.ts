export const SourceNavbarProperties = {
  disabled: { type: Boolean, required: false, default: false },
};

export const SourceNavbarEmits = {
  createAnnotation: (_annotationType: string) => true,
};
