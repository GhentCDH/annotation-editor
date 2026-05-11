export * from './lib/types/annotation-vue.types';
export { AnnotationDefinitionService } from './lib/service/annotation-definition.service';
export {
  type DefinitionsFetchFn,
  type GlobModules,
  loadAnnotationDefinitionsFromGlob,
  loadAnnotationDefinitionsFromConfigs,
  loadAnnotationDefinitionsFromUrl,
} from './lib/loader/annotation-definition.loader';
export {
  type AnnotationDefinitionsState,
  type ProvideAnnotationDefinitionsOptions,
  provideAnnotationDefinitions,
  useAnnotationDefinitions,
  createAnnotationDefinitionsState,
} from './lib/composables/useAnnotationDefinitions';
export {
  type AnnotationNamespaceRoutePaths,
  createAnnotationNamespacePaths,
  createAnnotationNamespaceRoutes,
  NAMESPACE_ROUTE_META,
} from './lib/router/annotation-namespace.routes';
export {
  type AnnotationNamespacePluginOptions,
  type AnnotationPluginOptions,
  installAnnotationNamespaceRoutes,
  AnnotationNamespacePlugin,
  AnnotationPlugin,
} from './lib/router/annotation-namespace.plugin';
