import { type PropType } from 'vue';

export const AnnotationModalProperties = {
  modalView: {
    type: Boolean,
    required: false as const,
    default: true,
  },
  /** Modal keys not rendered by this host (e.g. because the sidebar renders them) */
  exclude: {
    type: Array as PropType<string[]>,
    required: false as const,
    default: () => [],
  },
};
