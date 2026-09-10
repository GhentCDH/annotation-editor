import { type App, type Plugin } from 'vue';
import { type Router } from 'vue-router';
import { type AnnotationDefConfig } from '@ghentcdh/annotation-core';
import { createAnnotationNamespaceRoutes } from './router/annotation-namespace.routes';
import { type AnnotationDefinitionService } from './service/annotation-definition.service';
import {
  ANNOTATION_DEFINITIONS_KEY,
  type AnnotationDefinitionsState,
  createAnnotationDefinitionsState,
  type ProvideAnnotationDefinitionsOptions,
} from './composables/useAnnotationDefinitions';

export type AnnotationPluginOptions = ProvideAnnotationDefinitionsOptions & {
  router: Router;
  basePath?: string;
};

export const installAnnotationNamespaceRoutes = (
  router: Router,
  service: AnnotationDefinitionService,
  options?: { basePath?: string; config?: AnnotationDefConfig },
): void => {
  const routes = createAnnotationNamespaceRoutes(
    options?.basePath ?? '/ns',
    service,
    options?.config,
  );
  routes.forEach((r) => router.addRoute(r));
};

export const AnnotationPlugin: Plugin<[AnnotationPluginOptions]> = {
  install(
    app: App,
    options: AnnotationPluginOptions,
  ): AnnotationDefinitionsState {
    const state = createAnnotationDefinitionsState(options);

    // configureApi(options.api);
    // TODO check if we need to set it in crouton?

    if (options.resourceFolder) {
      state.loadFromGlob(options.resourceFolder);
    }

    if (options.definitionsUrl) {
      state.loadFromUrl(options.definitionsUrl);
    }

    if (options.definitionsUrls) {
      state.loadFromUrls(options.definitionsUrls);
    }

    app.provide(ANNOTATION_DEFINITIONS_KEY, state);

    return state;
  },
};
