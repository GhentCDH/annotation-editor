# Backend Integration (NestJS)

`@ghentcdh/annotation-api` ships a NestJS dynamic module — `AnnotationApiModule` — that wires the W3C annotation REST API into your NestJS app. You provide two classes that tell the module how to persist and map annotations; the module registers the controllers and dependency-injection tokens automatically.

## `AnnotationRepositoryConfig<ANNOTATION>`

```ts
type AnnotationRepositoryConfig<ANNOTATION> = {
  repository: new (...args: any[]) => AnnotationCrudRepository<ANNOTATION>;
  mapper: new (...args: any[]) => AnnotationW3cMapperService<ANNOTATION>;
};
```

| Field | What to pass |
|---|---|
| `repository` | A NestJS `@Injectable()` class that extends `AnnotationCrudRepository<ANNOTATION>` and implements `create`, `update`, `delete`, `findOne` |
| `mapper` | A NestJS `@Injectable()` class that extends `AnnotationW3cMapperService<ANNOTATION>` and implements `mapToW3CAnnotation` / `mapFromW3CAnnotation` |

`ANNOTATION` is your domain model — the type your repository stores and returns (typically the Prisma-generated `AnnotationWithRelations` or an equivalent).

## Implementing the repository

```ts
import { AnnotationCrudRepository } from '@ghentcdh/annotation-api';
import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@my-app/generated-client';
import type { AnnotationWithRelations } from '@my-app/generated-types';

@Injectable()
export class AnnotationRepository
  extends AnnotationCrudRepository<AnnotationWithRelations>
{
  constructor(@Inject(PrismaClient) private prisma: PrismaClient) {
    super();
  }

  override async create(annotation: AnnotationWithRelations) {
    return this.prisma.annotation.create({ data: { ... }, include: { ... } });
  }

  override async update(id: string, annotation: AnnotationWithRelations) {
    return this.prisma.annotation.update({ where: { id }, data: { ... }, include: { ... } });
  }

  override async delete(id: string) {
    await this.prisma.annotation.delete({ where: { id } });
    return true;
  }

  override async findOne(id: string) {
    const annotation = await this.prisma.annotation.findUniqueOrThrow({ where: { id } });
    return { annotation, type: annotation.type };
  }
}
```

## Implementing the mapper

```ts
import { AnnotationW3cMapperService, type AnnotationContext } from '@ghentcdh/annotation-api';
import { Injectable } from '@nestjs/common';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import type { AnnotationWithRelations } from '@my-app/generated-types';

@Injectable()
export class AnnotationMapperService
  extends AnnotationW3cMapperService<AnnotationWithRelations>
{
  override mapToW3CAnnotation(
    context: AnnotationContext | undefined | null,
    annotation: AnnotationWithRelations,
  ): W3CAnnotation {
    // build a W3C annotation from your domain model
  }

  override mapFromW3CAnnotation(
    context: AnnotationContext | undefined | null,
    annotation: W3CAnnotation,
  ): AnnotationWithRelations {
    // parse a W3C annotation into your domain model
  }
}
```

## Registering the module

Pass the config as the fourth argument to `AnnotationApiModule.forResourceDir`. The module registers itself as `global: true`, so its exports are available app-wide without additional imports.

```ts
import { Module } from '@nestjs/common';
import { AnnotationApiModule } from '@ghentcdh/annotation-api';
import { resolve } from 'node:path';
import { AnnotationRepository } from './annotation/annotation.repository';
import { AnnotationMapperService } from './annotation/annotation-mapper.service';

@Module({
  imports: [
    AnnotationApiModule.forResourceDir(
      resolve(__dirname, 'annotations'),   // folder with resource.json files
      resolve(__dirname, 'data-sources'),  // folder with data-source config
      {
        baseUrl: process.env.API_URL,
        app: 'my-app',
        prefix: 'my-prefix',
      },
      {
        repository: AnnotationRepository,
        mapper: AnnotationMapperService,
        // Make repository/mapper providers available to NestJS DI:
        imports: [],
        providers: [AnnotationRepository, AnnotationMapperService],
      },
    ),
  ],
})
export class AppModule {}
```

::: tip Global module
`AnnotationApiModule` registers as a global NestJS module. If your repository or mapper depend on other providers (e.g. `PrismaClient`), provide them either in `AppModule` or in a shared global module — they will be resolved automatically.
:::

## Without a custom repository

Omit the fourth argument to register only the namespace controller (JSON-LD context endpoints) without the annotation CRUD API:

```ts
AnnotationApiModule.forResourceDir(resourcePath, datasourcePath, config)
```