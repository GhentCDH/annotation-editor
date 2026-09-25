import {
  AnnotationAdapter,
  AnnotationAdapterParams,
  BaseAnnotation,
} from '@ghentcdh/annotated-text';
import { AnnotationDefinition, SourceModel } from '@ghentcdh/annotation-ui';

export abstract class AnnotationEditorAdapter<
  ANNOTATION extends BaseAnnotation,
  PARAMS extends AnnotationAdapterParams = AnnotationAdapterParams,
> {
  abstract name: string;
  abstract getDefinition(annotation: ANNOTATION): AnnotationDefinition;
  abstract getMetadata(annotation: ANNOTATION): any;
  abstract getTextPosition(
    annotation: ANNOTATION,
    source: SourceModel,
  ): { start: number; end: number };
  abstract getSourceUri(annotation: ANNOTATION): string;
  getParent(annotation: ANNOTATION): ANNOTATION | null {
    return null;
  }
  getRenderer(annotation: ANNOTATION) {
    console.table(this.getDefinition(annotation));
    return this.getDefinition(annotation)?.annotation?.target ?? 'default';
  }

  abstract createAnnotationAdapter(
    params: PARAMS,
  ): AnnotationAdapter<ANNOTATION, PARAMS>;

  abstract createLinkAnnotation(
    sourceAnnotation: ANNOTATION,
    targetAnnotation: ANNOTATION,
    annotationDef: AnnotationDefinition,
    metadata: any,
  ): ANNOTATION;

  abstract getLinks(annotation: ANNOTATION): ANNOTATION[];
  abstract getTextPosition(annotation: ANNOTATION): {
    start: number;
    end: number;
  };
}
