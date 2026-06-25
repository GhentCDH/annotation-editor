import AnnotationEditor from './lib/AnnotationEditor.vue';
import './lib/styles.css';

// Re-export annotation-core (excluding AnnotationDefinition which conflicts with annotation-ui's version)
export {
  type AnnotationContext,
  AnnotationMetadataType,
  type AnnotationColumnFieldInput,
  type AnnotationColumnConfig,
  type AnnotationJsonConfig,
  annotationColumnDefinition,
  annotationDefinition,
  type AnnotationDefinition as CoreAnnotationDefinition,
  type AnnotationResourceColumnConfig,
  type AnnotationResourceJsonConfig,
  type AnnotationResourceDefinition,
  type AnnotationStyle,
  AnnotationStyleType,
  AnnotationStyleContextBuilder,
  createAnnotationStyleBodyUnsafe,
  type AnnotationDefConfig,
  resolveConfig,
  baseContextBuilder,
  buildUiSchema,
  buildMetadataSchema,
  type ContextBuilderFactory,
  annotationContextBuilderFactory,
  buildAnnotationDefinition,
  buildAnnotationDefinitions,
} from '@ghentcdh/annotation-core';

// Re-export annotation-ui (includes UI-specific AnnotationDefinition)
export * from '@ghentcdh/annotation-ui';

// Editor-specific public API
export * from './lib/types/AnnotationConfiguration.model';
export * from './lib/types/source.model';
export { AnnotationEditor };
