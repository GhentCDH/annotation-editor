import { AnnotationEditorAdapter } from './annotation-editor.adapter';
import {
  W3CAnnotationAdapter,
  W3CAnnotationAdapterParams,
} from '@ghentcdh/annotated-text';
import { W3CAnnotation, type W3CAnnotationBuilder } from '@ghentcdh/w3c-utils';
import {
  AllowedChildrenPerType,
  AnnotationLink,
  SourceModel,
} from '@ghentcdh/annotation-core';
import { AnnotationDefinition } from '../types/AnnotationConfiguration.model';

export class W3cAnnotationEditorAdapter extends AnnotationEditorAdapter<
  W3CAnnotation,
  W3CAnnotationAdapterParams
> {
  private readonly builderMap = new Map<string, W3CAnnotationBuilder>();
  private readonly childParentMap = new Map<string, W3CAnnotation | null>();
  private readonly parentChildMap = new Map<string, W3CAnnotation[]>();
  private readonly linkedAnnotations = new Map<string, AnnotationLink[]>();

  private allowedChildrenPerType: AllowedChildrenPerType = {};

  name: string = 'W3cAnnotationEditorAdapter';

  constructor() {
    super();
  }

  private getBuilder(annotation: W3CAnnotation) {
    const builder = this.builderMap.get(annotation.id);

    if (!builder)
      throw new Error(`Annotation builder not found: ${annotation.id}`);

    return builder;
  }

  getDefinition(annotation: W3CAnnotation) {
    // TODO implement me
    console.warn('implement me');

    return null;
  }
  getMetadata(annotation: W3CAnnotation) {}

  getTextPositionSelector(annotation: W3CAnnotation, source: SourceModel) {}

  getSourceUri(annotation: W3CAnnotation) {
    //utils.getSourceUri(annotation)?.sourceUri;
    throw new Error('implement me');
  }
  getParent(annotation: W3CAnnotation) {
    //utils.getParent(annotation);
    return null;
  }

  override createAnnotationAdapter(params: W3CAnnotationAdapterParams) {
    return W3CAnnotationAdapter(params);
  }

  createLinkAnnotation(
    sourceAnnotation: W3CAnnotation,
    targetAnnotation: W3CAnnotation,
    annotationDef: AnnotationDefinition,
    metadata: any,
  ): W3CAnnotation {
    throw new Error('implement me');
    //     utils.createLinkAnnotation(
    //     props.sourceAnnotation!,
    //   props.targetAnnotation,
    //   annotationDef!,
    //   rawData,
    // )
  }
}
