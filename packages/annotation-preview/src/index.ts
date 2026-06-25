import AnnotationPreview from './lib/AnnotationPreview.vue';
import './lib/styles.css';

// Re-export everything from annotation-core for consumers who only depend on annotation-preview
export * from '@ghentcdh/annotation-core';

export * from './lib/AnnotationPreview.properties';
export * from './lib/types/preview-layout.types';
export { AnnotationPreview };
