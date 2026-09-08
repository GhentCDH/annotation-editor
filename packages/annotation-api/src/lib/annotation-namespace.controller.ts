import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  type AnnotationDefConfig,
  type AnnotationResource,
  AnnotationStyleContextBuilder,
  AnnotationStyleType,
} from '@ghentcdh/annotation-core';
import { ApiTags } from '@nestjs/swagger';
import { ResourceConfigRegistry } from '@ghentcdh/crouton-api';
import { ANNOTATION_DEF_CONFIG_TOKEN } from './utils/annotation.context-builder';
import { SCHEMA_PREFIX } from './prefix';

@Controller('ns')
@ApiTags('Annotations NS')
export class AnnotationNamespaceController {
  constructor(
    @Inject(ResourceConfigRegistry)
    private readonly service: ResourceConfigRegistry,
    @Inject(ANNOTATION_DEF_CONFIG_TOKEN)
    private readonly annotationDefConfig: AnnotationDefConfig,
  ) {}

  @Get()
  async listNames() {
    const basePath = process.env['API_URL'] ?? '';
    const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    const all = await this.service.getAll();

    return {
      annotations: all.map((a) => ({
        id: a.id,
        name: a.name,
        schemas: `${base}/${SCHEMA_PREFIX}/${a.id}/schemas`,
        jsonld: `${base}/ns/${a.id}.jsonld`,
      })),
    };
    // return {
    //   annotations: this.service
    //     .findAll()
    //     .map((annotation) => annotation.annotations),
    // };
  }

  @Get(':id.jsonld')
  async getJsonLd_(@Param('id') id: string) {
    if (id === AnnotationStyleType)
      return AnnotationStyleContextBuilder(
        this.annotationDefConfig,
      ).toJsonLdContext();

    const build = await this.service.findById(id);

    return build?.json_ld;
  }

  @Get(':id/schemas')
  async getSchemas(@Param('id') id: string): Promise<AnnotationResource> {
    const definition = await this.service.findById(id);

    return definition;
    // return {
    //   id: definition.id,
    //   name: definition.name,
    //   isRoot: definition.isRoot,
    //   allowedChildren: definition.allowedChildren,
    //   allowedLinks: definition.allowedLinks,
    //   type: definition.type,
    //   icon: definition.icon,
    //   target: definition.target,
    //   views: definition.views,
    // };
  }

  @Get('anno.jsonld')
  async getFullJsonLd() {
    return null;
    // const allBuildser = await this.service.getAllContextBuilders();
    // return allBuildser.map((b) => b.toJsonLdContext());
  }

  @Get(':type/anno.jsonld')
  async getJsonLd(@Param('type') type: string) {
    return null;
    // const context = await this.service.getContextBuilder(type);
    //
    // return {
    //   jsonLd: context.toJsonLdContext(),
    //   forms: context.toJsonSchema(),
    // };
  }
}
