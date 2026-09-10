import { type Router } from 'vue-router';
import { createAnnotationNamespaceRoutes } from './annotation-namespace.routes';
import { type AnnotationDefinitionService } from '../service/annotation-definition.service';

export type InstallAnnotationNamespaceRoutesOptions = {
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
