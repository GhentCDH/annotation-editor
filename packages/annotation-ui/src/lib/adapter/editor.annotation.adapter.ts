import {
  Annotation,
  AnnotationAdapter,
  AnnotationAdapterParams,
  annotationSchema,
  selectText,
  TextAnnotation,
} from '@ghentcdh/annotated-text';
import {
  EditorAnnotation,
  editorAnnotationSchema,
} from '@ghentcdh/annotation-ui';
import { Selector } from './editor.annotation';

type SourceModel = any;
type Params = AnnotationAdapterParams & { sourceModel: SourceModel };

export class AnnotationEditorAnnotationAdapter extends AnnotationAdapter<
  EditorAnnotation,
  Params
> {
  constructor(params: Params) {
    super(params);
  }

  name = 'AnnotationEditorAnnotationAdapter';
  private sourceUri?: string;
  override setParams(params: Params) {
    this.sourceUri = params.sourceModel?.uri ?? this.sourceUri;
    super.setParams(params);
  }

  _parse(annotation: EditorAnnotation): Annotation | null {
    const parsed = annotation as EditorAnnotation;
    const selector = parsed.selectors.find((t) => t.uri === this.sourceUri);
    if (!selector) {
      return null;
    }

    const parsedAnnotation = annotationSchema.parse({
      id: annotation.id,
      start: selector.start,
      end: selector.end,
    });

    return parsedAnnotation;
  }

  override format(
    annotation: TextAnnotation,
    isNew: boolean,
    hasChanged: boolean,
  ): EditorAnnotation | null {
    if (!annotation) return null;

    const originalAnnotation = this.getOriginalAnnotation(annotation.id);

    if (!isNew && !hasChanged) return originalAnnotation;

    if (!isNew && !annotation.id) {
      throw new Error('annotation id is required');
    }

    const textSelection = selectText(
      this.textAdapter.fullFlatText,
      annotation.start,
      annotation.end,
      this.startOffset,
    );

    const selector = Selector.parse({
      ...annotation,
      uri: this.sourceUri,
      ...textSelection,
    });

    let selectors = originalAnnotation.selectors.filter(
      (s) => s.uri !== this.sourceUri,
    );
    selectors.push(selector);

    const editorAnnotation = editorAnnotationSchema.parse({
      ...originalAnnotation,
      selectors,
    });

    return editorAnnotation;
  }
}
