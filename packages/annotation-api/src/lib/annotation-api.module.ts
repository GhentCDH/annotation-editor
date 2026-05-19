import { type DynamicModule, Module, type Type } from '@nestjs/common';

import { AnnotationDefinitionService } from './service/annotation-definition.service';
import { AnnotationDefinitionFromFilesService } from './service/annotation-definition-from-files.service';
import { loadAnnotationDefinitionsFromDir } from './service/annotation-definition.loader';
import { AnnotationNamespaceController } from './annotation-namespace.controller';
import { annotationContextBuilderFactory } from './utils/context-builder.factory';
import {
  ANNOTATION_DEF_CONFIG_TOKEN,
  type AnnotationDefConfig,
} from './utils/annotation.context-builder';
import { loadAnnotationResourcesFromDir } from './resource/annotation-resource.loader';
import { AnnotationResourceDefinitionService } from './resource/annotation-resource-definition.service';

type AnnotationApiConfig = {
  annotationDefinitionService: Type<AnnotationDefinitionService>;
};

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class AnnotationApiModule {
  static forService(config: AnnotationApiConfig): DynamicModule {
    return {
      module: AnnotationApiModule,
      global: true,
      controllers: [AnnotationNamespaceController],
      providers: [
        {
          provide: AnnotationDefinitionService,
          useClass: config.annotationDefinitionService,
        },
      ],
      exports: [AnnotationDefinitionService],
    };
  }

  static async forResourceDir(
    dirPath: string,
    config: AnnotationDefConfig,
  ): Promise<DynamicModule> {
    const loaderFn = () =>
      loadAnnotationDefinitionsFromDir(
        dirPath,
        config,
        annotationContextBuilderFactory,
      );

    const definitions = loaderFn();
    const service = new AnnotationDefinitionFromFilesService(
      config,
      definitions as any,
      loaderFn as any,
    );

    const resourceDefs = loadAnnotationResourcesFromDir(dirPath, config);
    const resourceDefService = new AnnotationResourceDefinitionService(
      resourceDefs,
    );

    return {
      module: AnnotationApiModule,
      global: true,
      controllers: [AnnotationNamespaceController],
      providers: [
        { provide: ANNOTATION_DEF_CONFIG_TOKEN, useValue: config },
        { provide: AnnotationDefinitionService, useValue: service },
        {
          provide: AnnotationResourceDefinitionService,
          useValue: resourceDefService,
        },
      ],
      exports: [
        AnnotationDefinitionService,
        AnnotationResourceDefinitionService,
      ],
    };
  }
}
