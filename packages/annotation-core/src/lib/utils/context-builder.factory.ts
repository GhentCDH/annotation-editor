import { type ContextBuilder } from '@ghentcdh/w3c-utils';
import { z } from 'zod';
import {
  type AnnotationDefConfig,
  baseContextBuilder,
} from './annotation.context-builder';
import { type AnnotationJsonConfig } from '../types/annotation-json-config.types';

type JsonSchemaProperty = {
  type: string;
  properties?: Record<string, JsonSchemaProperty>;
};

export const jsonSchemaPropertyToZod = (prop: JsonSchemaProperty): z.ZodTypeAny => {
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
  config: AnnotationJsonConfig,
  annotationDefConfig: AnnotationDefConfig,
): ContextBuilder => {
  const builder = baseContextBuilder(id, annotationDefConfig);
  const columns = config.columns ?? [];

  if (!columns.length) return builder;

  const schemaProps: Record<string, z.ZodTypeAny> = {};
  for (const col of columns) {
    if (col.type) {
      schemaProps[col.id] = jsonSchemaPropertyToZod(
        col.type as JsonSchemaProperty,
      );
    }
  }

  if (Object.keys(schemaProps).length) {
    return builder.parseZodSchema(z.object(schemaProps) as any);
  }

  return builder;
};
