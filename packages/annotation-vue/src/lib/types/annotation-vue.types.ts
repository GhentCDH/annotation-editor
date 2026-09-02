import {
  type AnnotationResource as CoreAnnotationDefinition,
  type KeyLabel,
  type UIAnnotationDefinition,
} from '@ghentcdh/annotation-core';

export type { KeyLabel } from '@ghentcdh/annotation-core';

export type VueAnnotationDefinition = {
  name: string;
  color: string;
  icon?: string;
  type?: string;
  target?: string;
  _core: CoreAnnotationDefinition;
} & UIAnnotationDefinition;
