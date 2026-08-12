import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
  type AnnotationDefConfig,
  AnnotationStyleContextBuilder,
  AnnotationStyleType,
  JsonColumnTypeSchema,
} from '@ghentcdh/annotation-core';
import { ApiTags } from '@nestjs/swagger';
import { AnnotationDefinitionService } from './service/annotation-definition.service';
import { ANNOTATION_DEF_CONFIG_TOKEN } from './utils/annotation.context-builder';
import { JsonColumnSchema } from '@ghentcdh/crouton-core';
import { buildViews } from '@ghentcdh/crouton-api';
import { z } from 'zod';

export const ColumnSchema = JsonColumnSchema.extend({
  type: JsonColumnTypeSchema.optional(),
});

const parseColumns = (columns: any[]) => {
  return columns.map((column) => {
    return ColumnSchema.parse(column);
    //{ ...ColumnSchema.safeParse(column), column };
  });
};

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
      foo: 2,
      jsonColumns: parseColumns(definition.columns),
      id: definition.id,
      name: definition.name,
      json_schema: definition.json_schema,
      ui_schema: definition.ui_schema,
      metadata_schema: definition.metadata_schema,
      columns: definition.columns,
      isRoot: definition.isRoot,
      allowedChildren: definition.allowedChildren,
      allowedLinks: definition.allowedLinks,
      type: definition.type,
      icon: definition.icon,
      target: definition.target,
      views: buildViews(
        z.fromJSONSchema(definition.json_schema),
        parseColumns(definition.columns),
      ),
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
