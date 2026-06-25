export * from './lib/annotation-api.module';
export * from './lib/service/annotation-definition.service';
export * from './lib/service/annotation-definition-from-files.service';
export * from './lib/service/annotation-definition.loader';
export * from './lib/resource/annotation-resource-definition.service';
export * from './lib/resource/annotation-resource.loader';
export * from './lib/utils/annotation.context-builder';
// Re-export everything from annotation-core for consumers who only depend on annotation-api
export * from '@ghentcdh/annotation-core';
