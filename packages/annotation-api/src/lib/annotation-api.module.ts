import { type DynamicModule, Module, type Type } from '@nestjs/common';

import {
  AnnotationConfigSchema,
  type AnnotationDefConfig,
  resolveConfig,
} from '@ghentcdh/annotation-core';
import { CroutonApiModule } from '@ghentcdh/crouton-api';
import { registerResourceExtensions } from '@ghentcdh/crouton-core';

import { AnnotationController } from './annotation/annotation.controller';
import { AnnotationW3cMapperService } from './annotation/annotation.mapper.service';
import { AnnotationCrudRepository } from './annotation/annotation.repository';
import { AnnotationNamespaceController } from './annotation-namespace.controller';
import { AnnotationContextService } from './context/annotation-context.service';
import { ANNOTATION_DEF_CONFIG_TOKEN } from './context/annotation-def-config.token';
import { SCHEMA_PREFIX } from './prefix';
import { createSchemaEnricher } from './utils/schemaEnricher.utils';

// Registered here (crouton-core registry) and again via `extensions` below:
// crouton-api bundles its own copy of the registry, so both are needed.
registerResourceExtensions({
  annotation: AnnotationConfigSchema,
});

type AnnotationRepositoryConfig<ANNOTATION> = {
  repository: Type<AnnotationCrudRepository<ANNOTATION>>;
  mapper: Type<AnnotationW3cMapperService<ANNOTATION>>;
};

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class AnnotationApiModule {
  static async forResourceDir<ANNOTATION>(
    resourcePath: string,
    datasourcePath: string,
    config: AnnotationDefConfig,
    annotation?: AnnotationRepositoryConfig<ANNOTATION>,
  ): Promise<DynamicModule> {
    const _config = resolveConfig(config);

    const crouton = await CroutonApiModule.forResourceDir(
      resourcePath,
      datasourcePath,
      {
        baseUrl: '',
        prefix: SCHEMA_PREFIX,
        extensions: {
          annotation: AnnotationConfigSchema,
        },
        schemaEnricher: createSchemaEnricher(_config.baseUrl),
      },
    );

    return {
      module: AnnotationApiModule,
      global: true,
      imports: [crouton],
      controllers: annotation
        ? [AnnotationNamespaceController, AnnotationController]
        : [AnnotationNamespaceController],
      providers: [
        AnnotationContextService,
        { provide: ANNOTATION_DEF_CONFIG_TOKEN, useValue: _config },
        ...(annotation
          ? [
              {
                provide: AnnotationCrudRepository,
                useExisting: annotation.repository,
              },
              {
                provide: AnnotationW3cMapperService,
                useExisting: annotation.mapper,
              },
            ]
          : []),
      ],
      exports: [AnnotationContextService],
    };
  }
}
