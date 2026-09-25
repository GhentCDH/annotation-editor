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

type StartEnd = { start: number; end: number };
const updateSelector = (
  sourceUri: string,
  startEnd: StartEnd,
  text: {
    fullFlatText: string;
    startOffset: number;
  },
  originalAnnotation: EditorAnnotation,
) => {
  const textSelection = !text.fullFlatText
    ? selectText(
        text.fullFlatText,
        startEnd.start,
        startEnd.end,
        text.startOffset,
      )
    : {};

  const selector = Selector.parse({
    ...startEnd,
    uri: sourceUri,
    ...textSelection,
  });

  let selectors = originalAnnotation.selectors.filter(
    (s) => s.uri !== sourceUri,
  );
  selectors.push(selector);

  return selectors;
};

export const updateAnnotation = (
  sourceUri: string,
  startEnd: StartEnd,
  text: {
    fullFlatText: string;
    startOffset: number;
  },
  originalAnnotation: EditorAnnotation,
) => {
  return editorAnnotationSchema.parse({
    ...originalAnnotation,
    selectors: updateSelector(
      sourceUri,
      startEnd,
      {
        fullFlatText: text.fullFlatText,
        startOffset: text.startOffset,
      },
      originalAnnotation,
    ),
  });
};

export class AnnotationEditorAnnotationAdapter extends AnnotationAdapter<
  EditorAnnotation,
  Params
> {
  constructor(params: Params) {
    super(params);
  }

  name = 'AnnotationEditorAnnotationAdapter';
  private sourceUri: string;
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

    const editorAnnotation = updateAnnotation(
      this.sourceUri,
      annotation,
      {
        fullFlatText: this.textAdapter.fullFlatText,
        startOffset: this.startOffset,
      },
      originalAnnotation,
    );

    this.addAnnotation(annotation.id, editorAnnotation, annotation);
    return editorAnnotation;
  }
}
