import { z } from 'zod';

import { Debugger } from '@ghentcdh/annotated-text';
import { type ContextBuilder, contextBuilder } from '@ghentcdh/w3c-utils';

import { type AnnotationResource } from './types/annotation-definition.type';
import {
  type AnnotationDefConfig,
  resolveConfig,
} from './utils/annotation.context-builder';

const CONTEXT = 'annotation.style';

const AnnotationStyleSchema = z.object({
  id: z.string(),
  name: z.string(),
  target: z
    .enum(['gutter', 'underline', 'highlight'])
    .optional()
    .default('underline'),
  color: z.string().optional(),
});

export type AnnotationStyle = z.infer<typeof AnnotationStyleSchema>;

export const AnnotationStyleType = 'AnnotationStyle';
export const AnnotationStyleContextBuilder = (
  annotationConfig?: Partial<AnnotationDefConfig>,
) => {
  const { prefix, baseUrl, contextUrl } = resolveConfig(annotationConfig);

  return contextBuilder(prefix, baseUrl)
    .setType(prefix, AnnotationStyleType)
    .setContextUri(`${contextUrl}${AnnotationStyleType}.jsonld`)
    .parseZodSchema(
      AnnotationStyleSchema as unknown as z.ZodObject<z.ZodRawShape>,
    ) as ContextBuilder;
};

export const createAnnotationStyleBodyUnsafe = (
  annotationConfig: Partial<AnnotationDefConfig> | undefined,
  style: Partial<AnnotationResource>,
) => {
  const resource = {
    ...style,
    ...style.annotation,
    // `name` is the id since crouton 0.1.0; the style body carries the label.
    name: style.title ?? style.name,
  };
  const parsed =
    AnnotationStyleContextBuilder(annotationConfig).toAnnotationBodyUnsafe(
      resource,
    );

  if (!parsed.success) {
    Debugger.debug(CONTEXT, 'AnnotationStyleContextBuilder safe parse failed');
    Debugger.warn(parsed.error);
  }
  return parsed;
};
