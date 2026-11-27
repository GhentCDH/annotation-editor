import { type PropType } from 'vue';

import { type Size } from '@ghentcdh/crouton-vue';

export const EditorContainerProperties = {
  title: { type: String, required: true as const },
  width: {
    type: String as PropType<Size>,
    required: false as const,
    default: 'lg',
  },
  disableClose: { type: Boolean, required: false as const, default: false },
};

export const EditorContainerEmits = {
  close: () => true,
};
