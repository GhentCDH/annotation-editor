import { SCHEMA_PREFIX } from '../prefix';

export const createSchemaEnricher =
  (baseUrl = '') =>
  (schema: any): Record<string, unknown> => {
    const uri = `${baseUrl}${SCHEMA_PREFIX}/annotation/${schema.route}`;
    const uriId = `${uri}/{id}`;
    schema.operations = {
      findOne: schema.operations.findOne ?? { uri: uriId, method: 'get' },
      update: schema.operations.update ?? { uri: uriId, method: 'patch' },
      delete: schema.operations.delete ?? { uri: uriId, method: 'delete' },
      create: schema.operations.create ?? { uri, method: 'post' },
      findAll: schema.operations.findAll,
    };
    return { ...schema };
  };
