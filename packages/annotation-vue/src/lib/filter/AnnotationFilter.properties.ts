import { type PropType } from 'vue';

export type AnnotationTypeItem = {
  id: string;
  label: string;
  color: string | undefined;
  count: number;
};

export const AnnotationFilterProperties = {
  count: {
    type: Object as PropType<Record<string, unknown[]>>,
    required: false as const,
    default: undefined,
  },
};

export const AnnotationFilterEmits = {
  'annotationtype-click': (_item: AnnotationTypeItem) => true,
};
