export {
  type AnnotationTransformer,
  type EditorAnnotation,
  type Selector,
  type UIAnnotationDefinition,
  createLinks,
  editorAnnotationSchema,
  parseAnnotations,
  w3cAnnotationTransformer,
} from '@ghentcdh/annotation-ui';
export { type AnnotationAdapterParams } from '@ghentcdh/annotated-text';

export { AnnotationDefinitionService } from './lib/definitions/annotation-definition.service';
export {
  type GlobModules,
  loadAnnotationDefinitionsFromConfigs,
  loadAnnotationDefinitionsFromGlob,
  loadAnnotationDefinitionsFromUrls,
} from './lib/definitions/annotation-definition.loader';
export {
  type AnnotationDefinitionsState,
  type AnnotationLoadError,
  type ProvideAnnotationDefinitionsOptions,
  createAnnotationDefinitionsState,
  peekAnnotationDefinitionsState,
  provideAnnotationDefinitions,
  useAnnotationDefinitions,
} from './lib/definitions/useAnnotationDefinitions';
export * from './lib/status';
export * from '@ghentcdh/annotation-core';
export * from '@ghentcdh/annotation-editor';

import './lib/styles.css';

export { default as AnnotationFilter } from './lib/filter/AnnotationFilter.vue';
export { type AnnotationTypeItem } from './lib/filter/AnnotationFilter.properties';
export * from './lib/smart-editor';
