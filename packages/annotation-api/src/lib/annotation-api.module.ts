import { type DynamicModule, Module } from '@nestjs/common';

import {
  AnnotationConfigSchema,
  type AnnotationDefConfig,
  resolveConfig,
} from '@ghentcdh/annotation-core';
import { CroutonApiModule } from '@ghentcdh/crouton-api';
import { registerResourceExtensions } from '@ghentcdh/crouton-core';
import { AnnotationNamespaceController } from './annotation-namespace.controller';
import { AnnotationController } from './annotation/annotation.controller';
import { ANNOTATION_DEF_CONFIG_TOKEN } from './utils/annotation.context-builder';
import { SCHEMA_PREFIX } from './prefix';
import { AnnotationContextService } from './context/annotation-context.service';
import { AnnotationCrudRepository } from './annotation/annotation.repository';
import { AnnotationW3cMapperService } from './annotation/annotation.mapper.service';
import { createSchemaEnricher } from './utils/schemaEnricher.utils';

// type AnnotationApiConfig = {
//   annotationDefinitionService: Type<AnnotationDefinitionService>;
// };

registerResourceExtensions({
  annotation: AnnotationConfigSchema,
  // context: ContextSchema,
});

type AnnotationRepositoryConfig<ANNOTATION> = {
  repository: new (...args: any[]) => AnnotationCrudRepository<ANNOTATION>;
  mapper: new (...args: any[]) => AnnotationW3cMapperService<ANNOTATION>;
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

    if (annotation) {
      return {
        module: AnnotationApiModule,
        global: true,
        imports: [crouton],
        controllers: [AnnotationNamespaceController, AnnotationController],
        providers: [
          AnnotationContextService,
          { provide: ANNOTATION_DEF_CONFIG_TOKEN, useValue: _config },
          {
            provide: AnnotationCrudRepository,
            useExisting: annotation.repository,
          },
          {
            provide: AnnotationW3cMapperService,
            useExisting: annotation.mapper,
          },
        ],
        exports: [AnnotationContextService],
      };
    }

    return {
      module: AnnotationApiModule,
      global: true,
      imports: [crouton],
      controllers: [AnnotationNamespaceController],
      providers: [
        AnnotationContextService,
        { provide: ANNOTATION_DEF_CONFIG_TOKEN, useValue: _config },
      ],
      exports: [AnnotationContextService],
    };
  }
}
