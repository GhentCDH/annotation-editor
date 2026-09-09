import { type DynamicModule, Module } from '@nestjs/common';

import {
  AnnotationConfigSchema,
  type AnnotationDefConfig,
  resolveConfig,
} from '@ghentcdh/annotation-core';
import { CroutonApiModule } from '@ghentcdh/crouton-api';
import { registerResourceExtensions } from '@ghentcdh/crouton-core';
import { AnnotationNamespaceController } from './annotation-namespace.controller';
import { ANNOTATION_DEF_CONFIG_TOKEN } from './utils/annotation.context-builder';
import { SCHEMA_PREFIX } from './prefix';
import { AnnotationContextService } from './context/annotation-context.service';

// type AnnotationApiConfig = {
//   annotationDefinitionService: Type<AnnotationDefinitionService>;
// };

registerResourceExtensions({
  annotation: AnnotationConfigSchema,
  // context: ContextSchema,
});

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class AnnotationApiModule {
  static async forResourceDir(
    resourcePath: string,
    datasourcePath: string,
    config: AnnotationDefConfig,
  ): Promise<DynamicModule> {
    const crouton = await CroutonApiModule.forResourceDir(
      resourcePath,
      datasourcePath,
      // resolve(__dirname, 'data-sources'),
      {
        baseUrl: '',
        prefix: SCHEMA_PREFIX,
        extensions: {
          annotation: AnnotationConfigSchema,
        },
      },
    );

    const _config = resolveConfig(config);

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
