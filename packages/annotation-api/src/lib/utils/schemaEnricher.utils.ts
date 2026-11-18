import { type JsonResourceOperations } from '@ghentcdh/crouton-core';
import { SCHEMA_PREFIX } from '../prefix';

export const createSchemaEnricher =
  (baseUrl = '') =>
  (schema: Record<string, unknown>): Record<string, unknown> => {
    const uri = `${baseUrl}${SCHEMA_PREFIX}/annotation/${schema['route']}`;
    const uriId = `${uri}/{id}`;
    const operations = schema['operations'] as JsonResourceOperations;
    operations.findOne = operations.findOne ?? { uri: uriId, method: 'get' };
    operations.update = operations.update ?? { uri: uriId, method: 'patch' };
    operations.delete = operations.delete ?? { uri: uriId, method: 'delete' };
    operations.create = operations.create ?? { uri, method: 'post' };
    return { ...schema, operations };
  };
