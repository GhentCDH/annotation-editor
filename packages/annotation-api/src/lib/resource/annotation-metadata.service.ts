import { BadRequestException, Injectable } from '@nestjs/common';
import { buildFilter } from '@ghentcdh/json-forms-core';
import { DataSourceRegistry } from '../data-source';

import { AnnotationResourceDefinitionService } from './annotation-resource-definition.service';
import { AnnotationResourceDefinition } from '@ghentcdh/annotation-core';

type MetadataRequest = {
  page: number;
  pageSize: number;
  sort: string;
  sortDir: 'asc' | 'desc';
  filter: string[];
};

@Injectable()
export class AnnotationMetadataService {
  constructor(
    private readonly registry: DataSourceRegistry,
    private readonly resourceService: AnnotationResourceDefinitionService,
  ) {}

  async list(type: string, params: MetadataRequest) {
    const resourceDef = this.resourceService.getResourceForType(type);
    if (!resourceDef) {
      throw new BadRequestException(`Type ${type} is not supported`);
    }

    const offset = (params.page - 1) * params.pageSize;
    const [data, count] = await Promise.all([
      this.search(resourceDef, params, offset),
      this.count(resourceDef, params.filter),
    ]);

    let totalPages = Math.ceil(count / params.pageSize);
    if (totalPages < 1) totalPages = 1;

    return {
      data,
      request: {
        count,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        sort: params.sort,
        sortDir: params.sortDir,
        filter: params.filter,
      },
    };
  }

  private async search(
    resourceDef: AnnotationResourceDefinition,
    request: MetadataRequest,
    offset: number,
  ) {
    const delegate = this.delegate(resourceDef);
    const data = await delegate.findMany({
      where: this.buildWhere(request.filter),
      take: request.pageSize,
      skip: offset,
      orderBy: { [resourceDef.field.label]: request.sortDir || 'asc' },
    });
    if (!data) return [];

    return data.map((d: any) => ({
      id: `${resourceDef.prefix}${d[resourceDef.field.id]}`,
      label: d[resourceDef.field.label],
    }));
  }

  private async count(
    resourceDef: AnnotationResourceDefinition,
    filter: string[],
  ) {
    return this.delegate(resourceDef).count({
      where: this.buildWhere(filter),
    });
  }

  private delegate(resourceDef: AnnotationResourceDefinition) {
    const client = this.registry.resolve(resourceDef.database);
    return client[resourceDef.table];
  }

  private buildWhere(filters: string[]) {
    const filter = buildFilter(filters);
    if (!filter) return undefined;
    return { AND: filter };
  }
}
