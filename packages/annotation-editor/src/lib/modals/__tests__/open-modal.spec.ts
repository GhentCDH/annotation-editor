import { describe, expect, it, vi } from 'vitest';
import { type TemplateRef, ref } from 'vue';

import { type SourceModel } from '@ghentcdh/annotation-core';
import {
  type EditorAnnotation,
  type UIAnnotationDefinition,
  editorAnnotationSchema,
} from '@ghentcdh/annotation-ui';

import { type AnnotationEditorEmitsFn } from '../../AnnotationEditor.properties';
import { type EditorConfig, type EditorState_ } from '../../composables/editorState';
import { type SelectByIdContext, selectAnnotationById } from '../open-modal';

const createEditorState = (): EditorState_ =>
  ({
    info: null,
    editorState: null,
    disableEdits: false,
    readonly: false,
    selectedAnnotation: null,
    reset: vi.fn(),
    show: vi.fn(),
    format: vi.fn(),
    transformMetadata: vi.fn(),
  }) as unknown as EditorState_;

const createEmits = (): AnnotationEditorEmitsFn => vi.fn() as unknown as AnnotationEditorEmitsFn;

const createContainerRef = (): TemplateRef<HTMLElement> =>
  ref<HTMLElement | null>(null) as unknown as TemplateRef<HTMLElement>;

const createSource = (): SourceModel => ({
  id: 'source-1',
  uri: 'source-uri',
  type: 'text',
  content: { text: 'Hello world', textDirection: 'ltr', processingLanguage: 'en', offset: 0 },
});

const createAnnotation = (id: string): EditorAnnotation =>
  editorAnnotationSchema.parse({
    id,
    metadata: {},
    selectors: [{ uri: 'source-uri', start: 0, end: 5 }],
    links: [],
    definitionUri: 'definition-1',
  });

describe('selectAnnotationById', () => {
  it('should close the info card and clear the selection when no annotation is selected', () => {
    const state = createEditorState();
    const emits = createEmits();
    const modalClose = vi.fn();
    const config = {
      modal: { show: vi.fn(), close: modalClose, getModal: vi.fn(), destroy: vi.fn() },
      createAnnotatedText: vi.fn(),
    } as unknown as EditorConfig;

    const annotation = createAnnotation('annotation-1');
    state.selectedAnnotation = annotation;

    const ctx: SelectByIdContext = {
      config,
      editorState: state,
      emits,
      findAnnotationData: vi.fn(),
    };

    selectAnnotationById(createContainerRef(), undefined, undefined, ctx);

    expect(modalClose).toHaveBeenCalledWith('info-card');
    expect(state.selectedAnnotation).toBeNull();
    expect(state.editorState).toBeNull();
  });

  it('should skip the modal when the annotation and action are unchanged', () => {
    const state = createEditorState();
    const emits = createEmits();
    const modalShow = vi.fn();
    const config = {
      modal: { show: modalShow, close: vi.fn(), getModal: vi.fn(), destroy: vi.fn() },
      createAnnotatedText: vi.fn(),
    } as unknown as EditorConfig;

    const annotation = createAnnotation('annotation-1');
    state.selectedAnnotation = annotation;
    state.editorState = 'show';

    const ctx: SelectByIdContext = {
      config,
      editorState: state,
      emits,
      findAnnotationData: vi.fn(),
    };

    const result = selectAnnotationById(createContainerRef(), 'annotation-1', 'show', ctx);

    expect(result).toBeUndefined();
    expect(modalShow).not.toHaveBeenCalled();
  });

  it('should route edit actions to the edit annotation modal', async () => {
    const state = createEditorState();
    const emits = createEmits();
    const annotation = createAnnotation('annotation-1');
    const modalShow = vi.fn(async () => ({ annotation }));
    const config = {
      modal: { show: modalShow, close: vi.fn(), getModal: vi.fn(), destroy: vi.fn() },
      createAnnotatedText: vi.fn(),
    } as unknown as EditorConfig;

    state.selectedAnnotation = annotation;
    state.editorState = 'show';

    const ctx: SelectByIdContext = {
      config,
      editorState: state,
      emits,
      findAnnotationData: vi.fn(() => ({
        annotation,
        source: createSource(),
        definition: { annotation: { type: 'note' } } as unknown as UIAnnotationDefinition,
      })),
    };

    selectAnnotationById(createContainerRef(), 'annotation-1', 'edit', ctx);

    await vi.waitFor(() => {
      expect(modalShow).toHaveBeenCalledWith('edit-annotation', expect.objectContaining({ annotation }));
    });
    expect(state.editorState).toBe('edit');
  });
});
