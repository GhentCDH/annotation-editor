import { type ContextBuilder, contextBuilder } from '@ghentcdh/w3c-utils';
import { z } from 'zod';
import {
  type AnnotationDefConfig,
  resolveConfig,
} from './utils/annotation.context-builder';
import { type AnnotationContext } from './types/annotation.contex';

export const AnnotationStyleSchema = z.object({
  id: z.string(),
  name: z.string(),
  target: z
    .enum(['gutter', 'underline', 'highlight'])
    .optional()
    .default('underline'),
  color: z.string().optional(),
});
// .passthrough();

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
      AnnotationStyleSchema as any,
    ) as ContextBuilder<any>;
};

export const createAnnotationStyleBody = (
  annotationConfig: Partial<AnnotationDefConfig> | undefined,
  style: Partial<AnnotationContext> & Pick<AnnotationContext, 'id' | 'name'>,
) => {
  return AnnotationStyleContextBuilder(annotationConfig).toAnnotationBody(
    style,
  );
};
