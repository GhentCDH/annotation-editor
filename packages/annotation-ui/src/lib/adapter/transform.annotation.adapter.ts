import {
  type AnnotationAdapterParams,
  type BaseAnnotation,
} from '@ghentcdh/annotated-text';
import {
  type EditorAnnotation,
  LinkSchema,
  type Selector,
} from './editor.annotation';
import { type UIAnnotationDefinition } from '../types/ui-annotation-definition.type';

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
  abstract format(annotation: EditorAnnotation, isNew: boolean): ANNOTATION;

  private definitionsMap: Record<string, UIAnnotationDefinition> = {};
  protected originalAnnotations: ANNOTATION[] = [];

  setDefinitions(definitions: UIAnnotationDefinition[]) {
    this.definitionsMap = groupById(definitions) as Record<
      string,
      UIAnnotationDefinition
    >;
  }

  setAnnotations(annotations: ANNOTATION[]): EditorAnnotation[] {
    this.originalAnnotations = annotations;

    let parsed = annotations
      .map((a) => this.parse(a))
      .filter(Boolean) as EditorAnnotation[];

    parsed = this.createLinks(parsed);

    return parsed;
  }

  resolveDefinition(
    schemaUri: string,
  ): UIAnnotationDefinition | { name: string } {
    return this.definitionsMap[schemaUri] ?? { name: 'default' };
  }

  transformMetadata(metadata: any, selector: Selector) {
    return metadata;
  }

  createLinks(annotations: EditorAnnotation[]): EditorAnnotation[] {
    const mapById = Object.fromEntries(annotations.map((a) => [a.id, a]));

    for (const annotation of annotations) {
      annotation.selectors.forEach((s) => {
        const parent = mapById[s.uri];
        if (parent) annotation.parentId = s.uri;
      });

      annotation.links.forEach((l) => {
        const link = mapById[l.uri];
        if (link) {
          link.links.push(LinkSchema.parse({ uri: annotation.id }));
        }
      });
    }

    return annotations;
  }
}
