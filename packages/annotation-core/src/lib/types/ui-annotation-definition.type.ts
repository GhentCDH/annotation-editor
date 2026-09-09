import {
  type AnnotatedText,
  type BaseAnnotation,
  type CustomAnnotationStyle,
} from '@ghentcdh/annotated-text';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { z } from 'zod';
import { type KeyLabel, KeyLabelSchema } from './key-label.type';
import { type SourceModel } from './source.model';
import { type AnnotationResource, AnnotationResourceSchema } from './annotation-definition.type';

// Explicit type avoids TS2883 from complex Zod v4 schema chains in .d.ts output.
export type UIAnnotationDefinition = AnnotationResource & {
  label: string;
  style?: CustomAnnotationStyle;
  allowedChildren: Array<KeyLabel>;
  allowedLinks: Array<KeyLabel>;
};

export const UIAnnotationDefinitionSchema: z.ZodType<UIAnnotationDefinition> =
  (AnnotationResourceSchema as unknown as z.ZodObject<any>).extend({
    style: z.custom<CustomAnnotationStyle>().optional(),
    allowedChildren: z.array(KeyLabelSchema),
    allowedLinks: z.array(KeyLabelSchema),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }).transform((data: any) => ({
    label: data.name,
    ...data,
  })) as z.ZodType<UIAnnotationDefinition>;

export type AllowedChildrenPerType = Record<string, Array<KeyLabel>>;

export type UIAnnotationConfiguration<
  ANNOTATION extends BaseAnnotation = W3CAnnotation,
> = {
  definitions: UIAnnotationDefinition[];
  getDefinition: (id: string) => UIAnnotationDefinition | undefined;
  rootTypes: Array<KeyLabel>;
  allowedChildrenPerType: AllowedChildrenPerType;
  createAnnotatedText: (
    id: string,
    sourceModel?: SourceModel,
  ) => AnnotatedText<ANNOTATION>;
};