import { type W3CAnnotationBuilder } from '@ghentcdh/w3c-utils';
import {
  AnnotationMetadataType,
  type AnnotationStyle,
  AnnotationStyleType,
} from '@ghentcdh/annotation-core';

type AnnotationStyleBody = AnnotationStyle & { type: string };

export const getAnnotationStyle = (builder: W3CAnnotationBuilder) => {
  const style = builder
    .getBodiesByPurpose('styling')
    .find(
      (body): body is AnnotationStyleBody =>
        typeof body === 'object' && body !== null && (body as AnnotationStyleBody).type === AnnotationStyleType,
    ) as AnnotationStyle | null;
  return style;
};

export const getMetadata = (builder: W3CAnnotationBuilder) => {
  const metadataBody = builder.getBodiesByType(AnnotationMetadataType);
  const metadata = metadataBody?.[0] ?? null;

  return metadata ?? null;
};
