import { type ContextBuilder } from '@ghentcdh/w3c-utils';
import { z } from 'zod';
import { type ViewConfig } from '@ghentcdh/crouton-core';
import {
  type AnnotationDefConfig,
  baseContextBuilder,
} from './annotation.context-builder';

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

export const annotationContextBuilderFactory = (
  id: string,
  formConfig: ViewConfig,
  annotationDefConfig: AnnotationDefConfig,
): ContextBuilder => {
  const builder = baseContextBuilder(id, annotationDefConfig);
  if (formConfig.json_schema) {
    return builder.parseZodSchema(
      z.fromJSONSchema(formConfig.json_schema) as any,
    );
  }

  return builder;
};
