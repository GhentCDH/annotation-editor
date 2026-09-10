import { Inject, Injectable } from '@nestjs/common';
import {
  type AnnotationContext,
  type AnnotationDefConfig,
  type AnnotationResource,
  createAnnotationContext,
} from '@ghentcdh/annotation-core';
import { ResourceConfigRegistry } from '@ghentcdh/crouton-api';
import { ANNOTATION_DEF_CONFIG_TOKEN } from '../utils/annotation.context-builder';

type Resource = Pick<AnnotationResource, 'annotation'>;
@Injectable()
export class AnnotationContextService {
  private readonly contextConfigMap = new Map<string, AnnotationContext>();
  private readonly prefixMap = new Map<string, string>();

  constructor(
    @Inject(ResourceConfigRegistry)
    private readonly configRegistry: ResourceConfigRegistry<AnnotationResource>,
    @Inject(ANNOTATION_DEF_CONFIG_TOKEN)
    private readonly annotationDefConfig: AnnotationDefConfig,
  ) {}

  async reloadAll() {
    this.contextConfigMap.clear();

    this.configRegistry.findAll().forEach((resource: AnnotationResource) => {
      const context = createAnnotationContext(
        this.annotationDefConfig,
        resource,
      );

      this.contextConfigMap.set(resource.id, context);

      this.prefixMap.set(context.prefix, resource.id);
    });
  }

  async findById(annotationId: string): AnnotationContext | null {
    const find = this.contextConfigMap.get(annotationId);
    if (find) return find;

    const resource = await this.configRegistry.findById(annotationId);
    if (!resource) return null;

    const context = createAnnotationContext(this.annotationDefConfig, resource);
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
