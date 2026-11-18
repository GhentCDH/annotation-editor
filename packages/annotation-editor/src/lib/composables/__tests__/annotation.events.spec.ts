import { type Mock, describe, expect, it, vi } from 'vitest';
import { type TemplateRef, ref } from 'vue';

import { type SourceModel } from '@ghentcdh/annotation-core';
import {
  type EditorAnnotation,
  type KeyLabel,
  type UIAnnotationDefinition,
  editorAnnotationSchema,
} from '@ghentcdh/annotation-ui';

import { type AnnotationEditorEmitsFn } from '../../AnnotationEditor.properties';
import { type AnnotationEvents, sendAnnotationEvent } from '../annotation.events';
import { type EditorConfig, type EditorState_ } from '../editorState';

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

const createEditorConfig = (modalShow: Mock) =>
  ({
    modal: { show: modalShow, close: vi.fn(), getModal: vi.fn(), destroy: vi.fn() },
    createAnnotatedText: vi.fn(),
  }) as unknown as EditorConfig;

describe('sendAnnotationEvent', () => {
  it('should open the edit modal in create mode and emit the created annotation', async () => {
    const state = createEditorState();
    const emits = createEmits();
    const modalShow = vi.fn(async () => ({ annotation: { id: 'created-annotation' } }));
    const config = createEditorConfig(modalShow);

    const send = sendAnnotationEvent(config, state, emits, createContainerRef());
    send('create', {
      source: createSource(),
      parentAnnotation: createAnnotation('parent-annotation'),
      definitionUri: 'definition-1',
    });

    expect(state.editorState).toBe('create');
    expect(state.disableEdits).toBe(true);
    expect(modalShow).toHaveBeenCalledWith(
      'edit-annotation',
      expect.objectContaining({ source: expect.objectContaining({ uri: 'source-uri' }) }),
    );

    await vi.waitFor(() => {
      expect(emits).toHaveBeenCalledWith('create:annotation', { id: 'created-annotation' });
    });
  });

  it('should open the edit modal for the selected annotation and emit updates on save', async () => {
    const state = createEditorState();
    const emits = createEmits();
    const annotation = createAnnotation('annotation-1');
    state.selectedAnnotation = annotation;

    const modalShow = vi.fn(async () => ({ annotation: { id: 'updated-annotation' } }));
    const config = createEditorConfig(modalShow);

    const send = sendAnnotationEvent(config, state, emits, createContainerRef());
    send('edit', {
      source: createSource(),
      parentAnnotation: createAnnotation('parent-annotation'),
      annotation,
      definition: {
        annotation: { type: 'note' },
      } as unknown as UIAnnotationDefinition,
    });

    expect(state.editorState).toBe('edit');
    expect(state.disableEdits).toBe(true);
    expect(emits).toHaveBeenCalledWith('select:annotation', annotation, 'edit');
    expect(modalShow).toHaveBeenCalledWith('edit-annotation', expect.objectContaining({ annotation }));

    await vi.waitFor(() => {
      expect(emits).toHaveBeenCalledWith('update:annotation', { id: 'updated-annotation' });
    });
  });

  it('should ask for confirmation before deleting an annotation', async () => {
    const state = createEditorState();
    const emits = createEmits();
    const annotation = createAnnotation('annotation-1');
    const modalShow = vi.fn(async () => ({ confirmed: true }));
    const resourceDelete = vi.fn(async () => undefined);
    const definition = {
      resource: { delete: resourceDelete },
    } as unknown as UIAnnotationDefinition;
    const config = createEditorConfig(modalShow);

    const send = sendAnnotationEvent(config, state, emits, createContainerRef());
    send('delete', { annotation, definition });

    expect(modalShow).toHaveBeenCalledWith('confirm', expect.objectContaining({ title: 'Delete' }));

    await vi.waitFor(() => {
      expect(emits).toHaveBeenCalled();
    });
    expect(emits).toHaveBeenCalledTimes(1);
    expect(emits).toHaveBeenCalledWith('delete:annotation', annotation);

    await vi.waitFor(() => {
      expect(resourceDelete).toHaveBeenCalled();
    });
  });

  it('should start a link flow when an annotation event starts a link', async () => {
    const state = createEditorState();
    const emits = createEmits();
    const annotation = createAnnotation('annotation-1');
    state.selectedAnnotation = annotation;

    const modalShow = vi.fn(async () => ({}));
    const startLink = vi.fn();
    const getModal = vi.fn(() => ({ state: { startLink } }));
    const config = {
      modal: { show: modalShow, close: vi.fn(), getModal, destroy: vi.fn() },
      createAnnotatedText: vi.fn(),
    } as unknown as EditorConfig;

    const send = sendAnnotationEvent(config, state, emits, createContainerRef());
    const link: KeyLabel = { key: 'rel-1', label: 'Related' };
    send('link', {
      link,
      definition: { annotation: { type: 'link' } } as unknown as UIAnnotationDefinition,
    });

    expect(state.editorState).toBe('link');
    expect(state.disableEdits).toBe(true);
    expect(state.info).toEqual({ message: expect.any(String), short: 'Related' });
    expect(getModal).toHaveBeenCalledWith('link-annotation');
    expect(startLink).toHaveBeenCalledWith('rel-1');
    expect(modalShow).toHaveBeenCalledWith('toast', expect.objectContaining({ toastMessage: expect.any(String) }));
  });

  it('should show the info card for the selected annotation', async () => {
    const state = createEditorState();
    const emits = createEmits();
    const annotation = createAnnotation('annotation-1');
    const modalShow = vi.fn(async () => ({}));
    const config = {
      modal: { show: modalShow, close: vi.fn(), getModal: vi.fn(), destroy: vi.fn() },
      createAnnotatedText: vi.fn(),
    } as unknown as EditorConfig;

    const send = sendAnnotationEvent(config, state, emits, createContainerRef());
    send('select', {
      annotation,
      source: createSource(),
      definitionUri: 'definition-1',
      mouseEvent: new MouseEvent('click'),
      definition: { annotation: { type: 'note' } } as unknown as UIAnnotationDefinition,
    } as AnnotationEvents['select']);

    expect(state.editorState).toBe('show');
    expect(state.selectedAnnotation).toBe(annotation);
    expect(state.disableEdits).toBe(false);
    expect(modalShow).toHaveBeenCalledWith('info-card', expect.objectContaining({ annotation }));
    expect(emits).toHaveBeenCalledWith('select:annotation', annotation, 'show');
  });

  it('should clear the selection when a select event has no annotation', () => {
    const state = createEditorState();
    const emits = createEmits();
    const modalClose = vi.fn();
    const config = {
      modal: { show: vi.fn(), close: modalClose, getModal: vi.fn(), destroy: vi.fn() },
      createAnnotatedText: vi.fn(),
    } as unknown as EditorConfig;

    const send = sendAnnotationEvent(config, state, emits, createContainerRef());
    send('select', null);

    expect(modalClose).toHaveBeenCalledWith('info-card');
    expect(emits).toHaveBeenCalledWith('select:annotation', null, null);
    expect(state.editorState).toBeNull();
    expect(state.disableEdits).toBe(false);
  });
});
