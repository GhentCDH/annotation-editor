import { Inject, Injectable } from '@nestjs/common';
import {
  type AnnotationDefConfig,
  type AnnotationResource,
} from '@ghentcdh/annotation-core';
import { AnnotationDefinitionService } from './annotation-definition.service';
import { ANNOTATION_DEF_CONFIG_TOKEN } from '../utils/annotation.context-builder';

type AnnotationDefinitionLoaderFn = () => AnnotationResource[];

@Injectable()
export class AnnotationDefinitionFromFilesService extends AnnotationDefinitionService {
  constructor(
    @Inject(ANNOTATION_DEF_CONFIG_TOKEN) config: AnnotationDefConfig,
    private readonly _initialDefinitions: AnnotationResource[],
    private readonly _loaderFn?: AnnotationDefinitionLoaderFn,
  ) {
    super(config);
  }

  protected override reloadDefinitions = (): Promise<AnnotationResource[]> => {
    if (this.config.isDev && this._loaderFn) {
      return Promise.resolve(this._loaderFn());
    }
    return Promise.resolve(this._initialDefinitions ?? []);
  };
}
