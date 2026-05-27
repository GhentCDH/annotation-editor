import { createRouter, createWebHistory } from 'vue-router';
import EditorView from './views/EditorView.vue';
import EditorEmptyView from './views/EditorEmptyView.vue';
import EditorSelectedView from './views/EditorSelectedView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/editor' },
    {
      path: '/editor',
      component: EditorView,
      meta: { title: 'Editor — two sources, three annotations' },
    },
    {
      path: '/editor-empty',
      component: EditorEmptyView,
      meta: { title: 'Editor — empty (no annotations)' },
    },
    {
      path: '/editor-selected',
      component: EditorSelectedView,
      meta: { title: 'Editor — pre-selected annotation' },
    },
  ],
});
