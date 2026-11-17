import { type Router } from 'vue-router';

import { type AnnotationDefinitionService } from '../definitions/annotation-definition.service';
import { createAnnotationNamespaceRoutes } from './annotation-namespace.routes';

type InstallAnnotationNamespaceRoutesOptions = {
  basePath?: string;
};

export const installAnnotationNamespaceRoutes = (
  router: Router,
  service: AnnotationDefinitionService,
  options?: InstallAnnotationNamespaceRoutesOptions,
): void => {
  const basePath = options?.basePath ?? '/ns';
  const routes = createAnnotationNamespaceRoutes(basePath, service);
  routes.forEach((route) => router.addRoute(route));
};
