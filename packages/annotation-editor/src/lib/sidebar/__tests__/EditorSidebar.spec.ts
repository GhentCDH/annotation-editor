import { mount } from '@vue/test-utils';
import { defineComponent, h, reactive } from 'vue';


import EditorSidebar from '../EditorSidebar.vue';

const stub = (name: string) =>
  defineComponent({ name, render: () => h('div', { 'data-testid': name }) });

const modals: Record<string, { key: string; component: unknown; state: { isVisible: boolean; data: unknown; close: () => void } }> = {};
const setModal = (key: string, isVisible: boolean) => {
  modals[key] = {
    key,
    component: stub(key),
    state: reactive({ isVisible, data: {}, close: vi.fn() }),
  };
};

vi.mock('../../composables/useEditorState', () => ({
  useEditorState: () => ({
    config: { modal: { getModal: (key: string) => modals[key] ?? null } },
  }),
}));

describe('EditorSidebar', () => {
  beforeEach(() => {
    Object.keys(modals).forEach((k) => delete modals[k]);
  });

  it.each`
    info     | edit     | link     | expected
    ${true}  | ${true}  | ${false} | ${'edit-annotation'}
    ${true}  | ${false} | ${true}  | ${'link-annotation'}
    ${true}  | ${false} | ${false} | ${'info-card'}
  `('renders $expected (info=$info edit=$edit link=$link)', ({ info, edit, link, expected }) => {
    setModal('info-card', info);
    setModal('edit-annotation', edit);
    setModal('link-annotation', link);

    const wrapper = mount(EditorSidebar, { props: { width: 400 } });

    expect(wrapper.find(`[data-testid="${expected}"]`).exists()).toBe(true);
    expect(wrapper.findAll('[data-testid$="-card"], [data-testid$="-annotation"]')).toHaveLength(1);
  });

  it('renders empty state when nothing visible', () => {
    setModal('info-card', false);
    const wrapper = mount(EditorSidebar, { props: { width: 400 } });
    expect(wrapper.text()).toContain('Select an annotation');
  });
});
