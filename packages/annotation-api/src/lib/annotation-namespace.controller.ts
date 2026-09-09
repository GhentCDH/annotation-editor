import { Controller, Get, Inject, Param } from '@nestjs/common';
import { type AnnotationJsonResource } from '@ghentcdh/annotation-core';
import { ApiTags } from '@nestjs/swagger';
import { ResourceConfigRegistry } from '@ghentcdh/crouton-api';
import { type AnnotationContextService } from './annotation-api.module';
import { ANNOTATION_DEF_CONFIG_TOKEN } from './utils/annotation.context-builder';
import { SCHEMA_PREFIX } from './prefix';

@Controller('ns')
@ApiTags('Annotations NS')
export class AnnotationNamespaceController {
  constructor(
    @Inject(ResourceConfigRegistry)
    private readonly service: ResourceConfigRegistry<AnnotationJsonResource>,
    @Inject(ANNOTATION_DEF_CONFIG_TOKEN)
    private readonly annotationContextService: AnnotationContextService,
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
  }

  @Get(':id.jsonld')
  async getJsonLd_(@Param('id') id: string) {
    const context = await this.annotationContextService.findById(id);

    return context?.jsonLd;
  }
}
