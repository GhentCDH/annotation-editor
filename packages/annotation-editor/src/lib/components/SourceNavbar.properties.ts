export const SourceNavbarProperties = {
  disabled: {
    type: Boolean,
    required: false as const,
    default: false,
  },
};

export const SourceNavbarEmits = {
  createAnnotation: (_annotationType: string) => true,
};
