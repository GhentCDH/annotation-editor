import {
  type AnnotationAdapterParams,
  type BaseAnnotation,
} from '@ghentcdh/annotated-text';

import {
  type AnnotationMetadata,
  type EditorAnnotation,
  LinkSchema,
  type Selector,
} from './editor.annotation';

/**
 * Converts between a domain annotation model and `EditorAnnotation`.
 * Only `parse` and `format` are required.
 * Method syntax (not arrow properties) keeps the parameters bivariant, so any
 * `AnnotationTransformer<T>` fits a prop typed `AnnotationTransformer`.
 */
export type AnnotationTransformer<
  ANNOTATION extends BaseAnnotation = BaseAnnotation,
> = {
  parse(annotation: ANNOTATION): EditorAnnotation | null;
  format(annotation: EditorAnnotation, isNew: boolean): ANNOTATION;
  /** Adjust metadata before it is saved. Defaults to identity. */
  transformMetadata?(
    metadata: AnnotationMetadata,
    selector: Selector,
  ): AnnotationMetadata;
  /** Params passed to the annotated-text adapter. Defaults to `{}`. */
  defaultParams?: AnnotationAdapterParams;
};

/**
 * Resolve parent ids and make links bidirectional. Mutates and returns `annotations`.
 */
export const createLinks = (
  annotations: EditorAnnotation[],
): EditorAnnotation[] => {
  const mapById = Object.fromEntries(annotations.map((a) => [a.id, a]));

  for (const annotation of annotations) {
    annotation.selectors.forEach((s) => {
      const parent = mapById[s.uri];
      if (parent) annotation.parentId = s.uri;
    });

    annotation.links.forEach((l) => {
      const link = mapById[l.uri];
      if (
        link &&
        !link.links.some((existing) => existing.uri === annotation.id)
      ) {
        link.links.push(LinkSchema.parse({ uri: annotation.id }));
      }
    });
  }

  return annotations;
};

/**
 * Parse a list of domain annotations and resolve their links.
 */
export const parseAnnotations = <ANNOTATION extends BaseAnnotation>(
  transformer: AnnotationTransformer<ANNOTATION>,
  annotations: ANNOTATION[],
): EditorAnnotation[] =>
  createLinks(
    annotations
      .map((a) => transformer.parse(a))
      .filter((a): a is EditorAnnotation => !!a),
  );
