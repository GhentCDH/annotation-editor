import {
  type Annotation,
  AnnotationAdapter,
  type AnnotationAdapterParams,
  annotationSchema,
  selectText,
  type TextAnnotation,
} from '@ghentcdh/annotated-text';
import {
  type EditorAnnotation,
  editorAnnotationSchema,
  type Selector,
  SelectorSchema,
} from './editor.annotation';

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
  originalAnnotation?: EditorAnnotation,
) => {
  const textSelection = text.fullFlatText
    ? selectText(
        text.fullFlatText,
        startEnd.start,
        startEnd.end,
        text.startOffset,
      )
    : {};

  const selector = SelectorSchema.parse({
    ...startEnd,
    uri: sourceUri,
    ...textSelection,
  });

  const selectors =
    originalAnnotation?.selectors?.filter(
      (s: Selector) => s.uri !== sourceUri,
    ) ?? [];
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

export const createAnnotation = (
  sourceUri: string,
  anno: StartEnd & { definitionUri?: string },
  text: {
    fullFlatText: string;
    startOffset: number;
  },
) => {
  return editorAnnotationSchema.parse({
    id: 'NEW_ANNOTATION',
    metadata: {},
    definitionUri: anno.definitionUri ?? 'default',
    label: '',
    links: [],
    selectors: updateSelector(sourceUri, anno, {
      fullFlatText: text.fullFlatText,
      startOffset: text.startOffset,
    }),
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
    const selector = parsed?.selectors?.find(
      (t: Selector) => t.uri === this.sourceUri,
    );
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

    const editorAnnotation =
      isNew || !originalAnnotation
        ? createAnnotation(this.sourceUri, annotation, {
            fullFlatText: this.textAdapter.fullFlatText,
            startOffset: this.startOffset,
          })
        : updateAnnotation(
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

  updateSelector(annotation: TextAnnotation, range: StartEnd) {
    const originalAnnotation = this.getOriginalAnnotation(annotation.id);
    return !originalAnnotation
      ? createAnnotation(this.sourceUri, annotation, {
          fullFlatText: this.textAdapter.fullFlatText,
          startOffset: this.startOffset,
        })
      : updateAnnotation(
          this.sourceUri,
          annotation,
          {
            fullFlatText: this.textAdapter.fullFlatText,
            startOffset: this.startOffset,
          },
          originalAnnotation,
        );
  }
}
