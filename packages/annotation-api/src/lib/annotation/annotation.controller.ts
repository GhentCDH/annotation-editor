import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { AnnotationCrudRepository } from './annotation.repository';
import { AnnotationW3cMapperService } from './annotation.mapper.service';
import { AnnotationContextService } from '../context/annotation-context.service';
import { SCHEMA_PREFIX } from '../prefix';

@Controller(`${SCHEMA_PREFIX}/annotation`)
@ApiTags('Annotations')
export class AnnotationController<ANNOTATION extends { id: string }> {
  constructor(
    @Inject(AnnotationCrudRepository)
    private annotationRepository: AnnotationCrudRepository<ANNOTATION>,

    @Inject(AnnotationW3cMapperService)
    private wrapper: AnnotationW3cMapperService<ANNOTATION>,

    @Inject(AnnotationContextService)
    private contextService: AnnotationContextService,
  ) {}

  @Post(':type')
  @ApiOperation({ summary: 'Create a W3C annotation' })
  @ApiBody({ description: 'W3C annotation body' })
  @ApiResponse({ status: 201, description: 'The created W3C annotation' })
  async create(
    @Param('type') type: string,
    @Body() annotationBody: W3CAnnotation,
  ) {
    const parsed = await this.wrapper.fromW3CAnnotation(type, annotationBody);
    const annotation = await this.annotationRepository.create(parsed);

    return this.get(annotation.id);
  }

  @Get(':type/:id')
  @ApiOperation({ summary: 'Get one annotation by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'type', type: 'string' })
  @ApiResponse({ status: 200, description: 'The W3C annotation' })
  async getByType(@Param('id') id: string) {
    const { annotation, type } = await this.annotationRepository.findOne(id);

    return this.wrapper.getW3CAnnotation(type, annotation);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one annotation by id' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'The W3C annotation' })
  async get(@Param('id') id: string) {
    const _id = this.contextService.getResourceIdFromUri(id) ?? id;

    const { annotation, type } = await this.annotationRepository.findOne(_id);

    return this.wrapper.getW3CAnnotation(type, annotation);
  }

  @Patch(':type/:id')
  @ApiOperation({ summary: 'Update an annotation' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBody({ description: 'W3C annotation body' })
  @ApiResponse({ status: 200, description: 'The updated W3C annotation' })
  async patch(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() annotationBody: W3CAnnotation,
  ) {
    const _id = this.contextService.getResourceIdFromUri(id) ?? id;

    const _annotation = await this.wrapper.fromW3CAnnotation(
      type,
      annotationBody,
    );
    const annotation = await this.annotationRepository.update(_id, _annotation);

    return this.get(annotation.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an annotation' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Annotation deleted' })
  async delete(@Param('id') id: string) {
    const _id = this.contextService.getResourceIdFromUri(id) ?? id;
    return this.annotationRepository.delete(_id);
  }
}
