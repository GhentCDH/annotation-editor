import { W3CAnnotation } from '@ghentcdh/w3c-utils';
import { AnnotationContext } from '@ghentcdh/annotation-core';
import { Inject } from '@nestjs/common';
import { AnnotationContextService } from '../context/annotation-context.service';

export abstract class AnnotationW3cMapperService<ANNOTATION> {
  constructor(
    @Inject(AnnotationContextService)
    private contextService: AnnotationContextService,
  ) {}

  async getW3CAnnotation(
    type: string,
    annotation: ANNOTATION,
  ): Promise<W3CAnnotation> {
    const annotationDef = await this.contextService.findById(type);
    return this.mapToW3CAnnotation(annotationDef, annotation);
  }

  async fromW3CAnnotation(
    type: string,
    annotation: W3CAnnotation,
  ): Promise<ANNOTATION> {
    const annotationDef = await this.contextService.findById(type);

    return this.mapFromW3CAnnotation(annotationDef, annotation);
  }

  abstract mapToW3CAnnotation(
    context: AnnotationContext | undefined | null,
    annotation: ANNOTATION,
  ): W3CAnnotation;

  abstract mapFromW3CAnnotation(
    context: AnnotationContext | undefined | null,
    annotation: W3CAnnotation,
  ): ANNOTATION;
}
