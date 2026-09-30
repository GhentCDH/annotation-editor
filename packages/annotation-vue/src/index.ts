export { TransformAnnotationAdapter } from '@ghentcdh/annotation-ui';

export { AnnotationDefinitionService } from './lib/definitions/annotation-definition.service';
export {
  type GlobModules,
  loadAnnotationDefinitionsFromGlob,
  loadAnnotationDefinitionsFromConfigs,
  loadAnnotationDefinitionsFromUrls,
} from './lib/definitions/annotation-definition.loader';
export {
  type AnnotationDefinitionsState,
  type ProvideAnnotationDefinitionsOptions,
  provideAnnotationDefinitions,
  useAnnotationDefinitions,
  createAnnotationDefinitionsState,
} from './lib/definitions/useAnnotationDefinitions';
export { AnnotationPlugin } from './lib/annotation.plugin';
export { configureApi } from './lib/service/useApi';
export * from '@ghentcdh/annotation-core';
export * from '@ghentcdh/annotation-editor';

import './lib/styles.css';

export { default as AnnotationFilter } from './lib/filter/AnnotationFilter.vue';
export * from './lib/smart-editor';
