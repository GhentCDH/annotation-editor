import type { ExtractPublicPropTypes } from 'vue';

export const SourceNavbarProperties = {
  disabled: { type: Boolean, required: false, default: false },
};

export type SourceNavbarProps = ExtractPublicPropTypes<
  typeof SourceNavbarProperties
>;

export const SourceNavbarEmits = {
  createAnnotation: (_annotationType: string) => true,
};

export type SourceNavbarEmitsType = typeof SourceNavbarEmits;
