import { type App, type Plugin } from 'vue';
import { type Router } from 'vue-router';
import { type AnnotationDefConfig } from '@ghentcdh/annotation-core';
import { createAnnotationNamespaceRoutes } from './annotation-namespace.routes';
import { type AnnotationDefinitionService } from '../service/annotation-definition.service';
import {
  ANNOTATION_DEFINITIONS_KEY,
  type AnnotationDefinitionsState,
  createAnnotationDefinitionsState,
  type ProvideAnnotationDefinitionsOptions
} from '../composables/useAnnotationDefinitions';

export type AnnotationNamespacePluginOptions = {
  router: Router;
  service: AnnotationDefinitionService;
  basePath?: string;
  config?: AnnotationDefConfig;
};

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

export const AnnotationNamespacePlugin: Plugin<
  [AnnotationNamespacePluginOptions]
> = {
  install(_app: App, options: AnnotationNamespacePluginOptions) {
    installAnnotationNamespaceRoutes(options.router, options.service, {
      basePath: options.basePath,
      config: options.config,
    });
  },
};

export const AnnotationPlugin: Plugin<[AnnotationPluginOptions]> = {
  install(
    app: App,
    options: AnnotationPluginOptions,
  ): AnnotationDefinitionsState {
    const state = createAnnotationDefinitionsState(options);

    if (options.resourceFolder) {
      state.loadFromGlob(options.resourceFolder);
    }

    if (options.definitionsUrl) {
      state.loadFromUrl(options.definitionsUrl, options.fetchFn);
    }

    app.provide(ANNOTATION_DEFINITIONS_KEY, state);

    installAnnotationNamespaceRoutes(options.router, state.service, {
      basePath: options.basePath,
      config: options.config,
    });

    return state;
  },
};
