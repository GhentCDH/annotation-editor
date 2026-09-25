import {
  AnnotationAdapterParams,
  BaseAnnotation,
} from '@ghentcdh/annotated-text';
import { EditorAnnotation } from './editor.annotation';
import { UIAnnotationDefinition } from '../types/ui-annotation-definition.type';

const groupById = <KEY extends keyof UIAnnotationDefinition>(
  defs: UIAnnotationDefinition[],
  valueKey?: KEY,
) => {
  if (!defs)
    return {} as Record<
      string,
      UIAnnotationDefinition[KEY] | UIAnnotationDefinition
    >;

  return defs.reduce(
    (acc, def) => {
      acc[def.id] = valueKey ? def[valueKey] : def;
      return acc;
    },
    {} as Record<string, UIAnnotationDefinition[KEY] | UIAnnotationDefinition>,
  );
};

export abstract class TransformAnnotationAdapter<
  ANNOTATION extends BaseAnnotation,
  PARAMS extends AnnotationAdapterParams = AnnotationAdapterParams,
> {
  /**
   * Name of the adapter. Be unique :-).
   */
  abstract name: string;
  abstract defaultParams: AnnotationAdapterParams;

  abstract parse(annotation: ANNOTATION): EditorAnnotation | null;
  abstract format(
    annotation: EditorAnnotation,
    isNew: boolean,
    hasChanged: boolean,
  ): ANNOTATION;

  private definitionsMap: Record<string, UIAnnotationDefinition> = {};

  setDefinitions(definitions: UIAnnotationDefinition[]) {
    this.definitionsMap = groupById(definitions) as Record<
      string,
      UIAnnotationDefinition
    >;
  }

  resolveDefinition(schemaUri: string) {
    return this.definitionsMap[schemaUri] ?? { name: 'default' };
  }
}
