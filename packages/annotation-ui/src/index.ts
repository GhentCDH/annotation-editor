// Types
export * from './lib/types/source.model';
export * from './lib/types/AnnotationConfiguration.model';
export * from './lib/types/grid-layout.types';
export * from './lib/types/ui-annotation-definition.type';

// Utils
export * from './lib/utils/annotation-utils';
export * from './lib/utils/mouse-events';

// Modal infrastructure
export * from './lib/modals/AnnotationModal.definition';
export * from './lib/modals/annotationModal.composable';

// Info card
export * from './lib/modals/info/AnnotationInfoCard.properties';
export * from './lib/modals/info/AnnotationInfoCardBase.properties';
export * from './lib/modals/info/useAnnotationInfo';
export { default as MetadataTable } from './lib/modals/info/Metadata.vue';
export { default as AnnotationInfoCardBase } from './lib/modals/info/AnnotationInfoCardBase.vue';
export { default as AnnotationTextCell } from './lib/modals/info/AnnotationTextCell.vue';
export * from './lib/adapter';

export * from './lib/annotated-text/annotation-configuration.factory';
