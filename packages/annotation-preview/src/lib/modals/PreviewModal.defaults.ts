import type { ModalDefinition } from '@ghentcdh/annotation-ui';
import { useAnnotationInfo } from '@ghentcdh/annotation-ui';
import AnnotationInfoReadonlyCard from './AnnotationInfoReadonlyCard.vue';

export const previewModalDefaults: Record<string, ModalDefinition> = {
  'info-card': {
    component: AnnotationInfoReadonlyCard,
    useFn: useAnnotationInfo,
  },
};
