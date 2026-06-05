// Types
export * from './lib/types/source.model';
export * from './lib/types/AnnotationConfiguration.model';

// Utils
export * from './lib/utils/annotation-utils';
export * from './lib/utils/mouse-events';
export * from './lib/utils/annotation.style';
export * from './lib/utils/annotationConfiguration';

// Modal infrastructure
export * from './lib/modals/AnnotationModal.definition';
export * from './lib/modals/annotationModal.composable';

// Info card
export * from './lib/modals/info/AnnotationInfoCard.properties';
export * from './lib/modals/info/useAnnotationInfo';
export { default as MetadataTable } from './lib/modals/info/Metadata.vue';
export { default as AnnotationTextCell } from './lib/modals/info/AnnotationTextCell.vue';
