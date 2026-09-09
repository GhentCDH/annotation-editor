import { z } from 'zod';

type JsonSchemaProperty = {
  type: string;
  properties?: Record<string, JsonSchemaProperty>;
};

export const jsonSchemaPropertyToZod = (
  prop: JsonSchemaProperty,
): z.ZodTypeAny => {
  if (prop.type === 'object' && prop.properties) {
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const [key, val] of Object.entries(prop.properties)) {
      shape[key] = jsonSchemaPropertyToZod(val);
    }
    return z.object(shape);
  }
  return z.string();
};
