import {
  type AnnotatedText,
  type BaseAnnotation,
  type CustomAnnotationStyle,
} from '@ghentcdh/annotated-text';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { z } from 'zod';
import { type KeyLabel, KeyLabelSchema } from './key-label.type';
import { type SourceModel } from './source.model';
import { AnnotationResourceSchema } from './annotation-definition.type';

export const UIAnnotationDefinitionSchema = AnnotationResourceSchema.extend({
  style: z.custom<CustomAnnotationStyle>().optional(),
  allowedChildren: z.array(KeyLabelSchema),
  allowedLinks: z.array(KeyLabelSchema),
}).transform((data) => ({
  label: data.name,
  ...data,
}));

export type UIAnnotationDefinition = z.infer<
  typeof UIAnnotationDefinitionSchema
>;

//   AnnotationResource & {
//   id: string;
//   label: string;
//   style: CustomAnnotationStyle;
//   allowedChildren: Array<KeyLabel>;
//   allowedLinks: Array<KeyLabel>;
//   isRoot?: boolean;
//   schemas: Record<ViewDef, ViewConfig>;
// };

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
