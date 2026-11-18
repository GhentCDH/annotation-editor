import { Inject, Injectable } from '@nestjs/common';

import {
  type AnnotationContext,
  type AnnotationDefConfig,
  type AnnotationResource,
  createAnnotationContext,
  withResourceId,
} from '@ghentcdh/annotation-core';
import { ResourceConfigRegistry } from '@ghentcdh/crouton-api';

import { ANNOTATION_DEF_CONFIG_TOKEN } from './annotation-def-config.token';

/** Crouton resource config that also carries the annotation definition fields. */
export type AnnotationRegistryResource = Awaited<
  ReturnType<ResourceConfigRegistry['getAll']>
>[number] &
  Omit<AnnotationResource, 'id'>;

@Injectable()
export class AnnotationContextService {
  private readonly contextConfigMap = new Map<string, AnnotationContext>();
  private readonly prefixMap = new Map<string, string>();

  constructor(
    @Inject(ResourceConfigRegistry)
    private readonly configRegistry: ResourceConfigRegistry<AnnotationRegistryResource>,
    @Inject(ANNOTATION_DEF_CONFIG_TOKEN)
    private readonly annotationDefConfig: AnnotationDefConfig,
  ) {}

  async reloadAll() {
    this.contextConfigMap.clear();

    (await this.configRegistry.getAll()).forEach((resource) => {
      const context = createAnnotationContext(
        this.annotationDefConfig,
        withResourceId(resource),
      );

      this.contextConfigMap.set(resource.name, context);

      this.prefixMap.set(context.prefix, resource.name);
    });
  }

  async findById(annotationId: string): Promise<AnnotationContext | null> {
    const find = this.contextConfigMap.get(annotationId);
    if (find) return find;

    const resource = (await this.configRegistry.getAll()).find(
      (r) => r.name === annotationId,
    );
    if (!resource) return null;

    const context = createAnnotationContext(
      this.annotationDefConfig,
      withResourceId(resource),
    );
    this.contextConfigMap.set(annotationId, context);

    return context;
  }

  getResourceIdFromUri = (uri: string): string | null => {
    for (const prefix of this.prefixMap.keys()) {
      if (uri.startsWith(prefix)) {
        return uri.substring(prefix.length);
      }
    }
    return null;
  };
}
