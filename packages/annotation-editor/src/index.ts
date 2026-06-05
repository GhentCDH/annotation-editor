import AnnotationEditor from './lib/AnnotationEditor.vue';
import './lib/styles.css';

// Re-export everything from annotation-ui for consumers who only depend on annotation-editor
export * from '@ghentcdh/annotation-ui';

// Editor-specific public API
export * from './lib/types/AnnotationConfiguration.model';
export * from './lib/types/source.model';
export { AnnotationEditor };
