import {
  AnnotationMetadataType,
  type AnnotationStyle,
} from '@ghentcdh/annotation-core';
import { type W3CAnnotationBuilder } from '@ghentcdh/w3c-utils';

export const getAnnotationStyle = (builder: W3CAnnotationBuilder) => {
  const style = builder
    .getBodiesByPurpose('styling')
    .find((b: any) => b.type === 'AnnotationStyle');
  return style as AnnotationStyle | null;
};

export const getMetadata = (builder: W3CAnnotationBuilder) => {
  const metadataBody = builder.getBodiesByType(AnnotationMetadataType);
  const metadata = metadataBody?.[0] ?? null;

  return metadata ?? null;
};
