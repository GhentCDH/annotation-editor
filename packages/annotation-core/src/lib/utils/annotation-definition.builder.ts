import { type ViewConfig } from '@ghentcdh/crouton-core';
import { type AnnotationDefConfig } from './annotation.context-builder';
import { annotationContextBuilderFactory } from './context-builder.factory';
import { type AnnotationResource } from '../types/annotation-definition.type';
import { type AnnotationJsonResource } from '../types/annotation-json-config.types';

export type ContextBuilderFactory = (
  id: string,
  config: ViewConfig,
  annotationDefConfig: AnnotationDefConfig,
) => any;

export const buildAnnotationDefinition = (
  jsonConfig: AnnotationJsonResource,
  annotationDefConfig: AnnotationDefConfig,
  factory: ContextBuilderFactory = annotationContextBuilderFactory,
): AnnotationResource => {
  throw new Error('implement based on crouton');
};

export const buildAnnotationDefinitions = (
  configs: AnnotationJsonResource[],
  annotationDefConfig: AnnotationDefConfig,
  factory?: ContextBuilderFactory,
): AnnotationResource[] => {
  return configs.map((config) =>
    buildAnnotationDefinition(config, annotationDefConfig, factory),
  );
};
