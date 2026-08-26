import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  type AnnotationDefConfig,
  AnnotationStyleContextBuilder,
  AnnotationStyleType,
} from '@ghentcdh/annotation-core';
import { ApiTags } from '@nestjs/swagger';
import { ANNOTATION_DEF_CONFIG_TOKEN } from './utils/annotation.context-builder';
import { AnnotationDefinitionService } from './service/annotation-definition.service';

@Controller('ns')
@ApiTags('Annotations NS')
export class AnnotationNamespaceController {
  constructor(
    @Inject(AnnotationDefinitionService)
    private readonly service: AnnotationDefinitionService,
    @Inject(ANNOTATION_DEF_CONFIG_TOKEN)
    private readonly annotationDefConfig: AnnotationDefConfig,
  ) {}

  @Get()
  getAll() {
    return this.service.findAll();
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
  async getSchemas(@Param('id') id: string) {
    const definition = await this.service.findById(id);

    return {
      id: definition.id,
      name: definition.name,
      isRoot: definition.isRoot,
      allowedChildren: definition.allowedChildren,
      allowedLinks: definition.allowedLinks,
      type: definition.type,
      icon: definition.icon,
      target: definition.target,
      views: definition.views,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const fromDb = await this.service.findById(id);
    return fromDb;
  }

  @Get('anno.jsonld')
  async getFullJsonLd() {
    const allBuildser = await this.service.getAllContextBuilders();
    return allBuildser.map((b) => b.toJsonLdContext());
  }

  @Get(':type/anno.jsonld')
  async getJsonLd(@Param('type') type: string) {
    const context = await this.service.getContextBuilder(type);

    return {
      jsonLd: context.toJsonLdContext(),
      forms: context.toJsonSchema(),
    };
  }
}
