import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';

import { type SourceModel } from '@ghentcdh/annotation-core';
import {
  type EditorAnnotation,
  type UIAnnotationDefinition,
  editorAnnotationSchema,
} from '@ghentcdh/annotation-ui';

import {
  AnnotationEditorEmits,
  AnnotationEditorProperties,
} from '../../AnnotationEditor.properties';
import { useEditorState, useProvideEditorState } from '../useEditorState';

// annotated-text configuration is out of scope here.
vi.mock('@ghentcdh/annotation-ui', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  createAnnotationConfiguration: vi.fn(() => vi.fn()),
}));

const source: SourceModel = {
  id: 'source-1',
  uri: 'source-uri',
  type: 'text',
  content: { text: 'Hello world', textDirection: 'ltr', processingLanguage: 'en', offset: 0 },
};
const definition = { id: 'animals' } as UIAnnotationDefinition;
const annotation = (id: string): EditorAnnotation =>
  editorAnnotationSchema.parse({
    id,
    definitionUri: 'animals',
    metadata: {},
    selectors: [{ uri: source.uri, start: 0, end: 5 }],
    links: [],
  });

type State = ReturnType<typeof useEditorState>;

const Child = defineComponent({
  emits: ['state'],
  setup(_, { emit }) {
    emit('state', useEditorState());
    return () => null;
  },
});

const Editor = defineComponent({
  props: AnnotationEditorProperties,
  emits: AnnotationEditorEmits,
  setup(props, { emit }) {
    useProvideEditorState(props, emit, ref(null) as never);
    return () => h(Child, { onState: (s: State) => captured.push(s) });
  },
});

let captured: State[] = [];

const mountEditor = (props: Partial<InstanceType<typeof Editor>['$props']> = {}) =>
  mount(Editor, {
    props: {
      sources: [source],
      annotations: [annotation('a1')],
      annotationDefinitions: [definition],
      ...props,
    },
  });

describe('useEditorState', () => {
  beforeEach(() => {
    captured = [];
  });

  it('throws outside an editor', () => {
    expect(() => mount(Child)).toThrow(/must be called inside/);
  });

  it('exposes props through the injected state', () => {
    mountEditor({ readonly: true });
    const [state] = captured;

    expect(state.sources.value).toEqual([source]);
    expect(state.annotations.value.map((a) => a.id)).toEqual(['a1']);
    expect(state.editorState.readonly).toBe(true);
    expect(state.editorState.selectedAnnotation).toBeNull();
  });

  it('looks up annotations and definitions by id', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    mountEditor();
    const [state] = captured;

    expect(state.findAnnotation('a1')?.id).toBe('a1');
    expect(state.findAnnotation('missing')).toBeNull();
    expect(state.getDefinition('animals')).toBe(definition);
    expect(state.getDefinition('missing')).toBeUndefined();
    expect(warn).toHaveBeenCalledWith('No definition found for missing');
  });

  it('formats through the annotation transformer', () => {
    const format = vi.fn((a: EditorAnnotation) => ({ ...a, formatted: true }));
    mountEditor({
      annotationTransformer: { parse: vi.fn(), format } as never,
    });

    captured[0].editorState.format(annotation('a1'), true);

    expect(format).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'a1' }),
      true,
    );
  });

  it('gives every editor instance its own state', () => {
    mountEditor();
    mountEditor({ annotations: [annotation('b1')] });
    const [first, second] = captured;

    expect(first).not.toBe(second);
    expect(first.editorState).not.toBe(second.editorState);
    expect(second.findAnnotation('a1')).toBeNull();
  });
});
