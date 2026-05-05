import {
  BadRequestException,
  Controller,
  Get,
  PipeTransform,
  Query,
} from '@nestjs/common';
import { RequestSchema } from '@ghentcdh/json-forms-core';
import { z } from 'zod';

import { AnnotationMetadataService } from './annotation-metadata.service';

const MetadataRequestSchema = (RequestSchema as any).extend({
  type: z.string().optional().default('register'),
});
type MetadataRequest = z.infer<typeof MetadataRequestSchema>;

const MetadataRequestPipe: PipeTransform = {
  transform(value: unknown) {
    const result = MetadataRequestSchema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(
        (result.error as any).errors.map(
          (e: any) => `${e.path.join('.')}: ${e.message}`,
        ),
      );
    }
    return result.data;
  },
};

@Controller('ns/metadata')
export class AnnotationMetadataController {
  constructor(private readonly metadataService: AnnotationMetadataService) {}

  @Get()
  async search(@Query(MetadataRequestPipe) params: MetadataRequest) {
    const { type, ...rest } = params;
    return this.metadataService.list(type, rest);
  }
}
