export { AnnotationDefinitionService } from './lib/service/annotation-definition.service';
export {
  type GlobModules,
  loadAnnotationDefinitionsFromGlob,
  loadAnnotationDefinitionsFromConfigs,
  loadAnnotationDefinitionsFromUrls,
} from './lib/loader/annotation-definition.loader';
export {
  type AnnotationDefinitionsState,
  type ProvideAnnotationDefinitionsOptions,
  provideAnnotationDefinitions,
  useAnnotationDefinitions,
  createAnnotationDefinitionsState,
} from './lib/composables/useAnnotationDefinitions';
export { AnnotationPlugin } from './lib/annotation.plugin';
export { configureApi } from './lib/service/useApi';
export * from '@ghentcdh/annotation-preview';
export * from '@ghentcdh/annotation-core';
export * from '@ghentcdh/annotation-editor';

import './lib/styles.css';

export { default as AnnotationFilter } from './lib/components/filter/AnnotationFilter.vue';
