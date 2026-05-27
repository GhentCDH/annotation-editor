import { Inject, Injectable } from '@nestjs/common';
import { AnnotationDefinitionService } from './annotation-definition.service';
import { type AnnotationDefinition, type AnnotationDefConfig } from '@ghentcdh/annotation-core';
import { ANNOTATION_DEF_CONFIG_TOKEN } from '../utils/annotation.context-builder';

type AnnotationDefinitionLoaderFn = () => AnnotationDefinition[];

@Injectable()
export class AnnotationDefinitionFromFilesService extends AnnotationDefinitionService {
  constructor(
    @Inject(ANNOTATION_DEF_CONFIG_TOKEN) config: AnnotationDefConfig,
    private readonly _initialDefinitions: AnnotationDefinition[],
    private readonly _loaderFn?: AnnotationDefinitionLoaderFn,
  ) {
    super(config);
  }

  protected override reloadDefinitions = () => {
    if (this.config.isDev && this._loaderFn) {
      return Promise.resolve(this._loaderFn());
    }
    return Promise.resolve(this._initialDefinitions ?? []);
  };
}
