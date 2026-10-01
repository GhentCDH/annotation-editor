import {
  type AnnotationAdapterParams,
  type BaseAnnotation,
} from '@ghentcdh/annotated-text';
import {
  type EditorAnnotation,
  LinkSchema,
  type Selector,
} from './editor.annotation';

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

  protected originalAnnotations: ANNOTATION[] = [];

  setAnnotations(annotations: ANNOTATION[]): EditorAnnotation[] {
    this.originalAnnotations = annotations;

    let parsed = annotations
      .map((a) => this.parse(a))
      .filter(Boolean) as EditorAnnotation[];

    parsed = this.createLinks(parsed);

    return parsed;
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
