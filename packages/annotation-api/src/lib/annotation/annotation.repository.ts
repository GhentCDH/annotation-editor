export abstract class AnnotationCrudRepository<ANNOTATION> {
  abstract delete(id: string): Promise<boolean>;
  abstract create(annotation: ANNOTATION): Promise<ANNOTATION>;
  abstract update(id: string, annotation: ANNOTATION): Promise<ANNOTATION>;
  abstract findOne(
    id: string,
  ): Promise<{ annotation: ANNOTATION; type: string }>;
}
