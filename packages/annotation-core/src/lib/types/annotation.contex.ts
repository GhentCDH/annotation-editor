import { ContextBuilder } from '@ghentcdh/w3c-utils';

export const AnnotationMetadataType = `AnnotationMetadata`;
export type AnnotationContext = {
  id: string;
  name: string;
  json_schema?: any | undefined;
  ui_schema?: any | undefined;
  metadata_schema?: any | undefined;
  color: string;
  created_at: Date;
  updated_at: Date;
  context: ContextBuilder;
  target?: 'gutter' | 'underline' | 'highlight';
};
