<template>
  <div
    data-testid="editor-sidebar"
    class="-m-4 relative min-h-[calc(100%+2rem)]"
  >
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      :aria-valuenow="width"
      tabindex="0"
      class="absolute inset-y-0 left-0 w-1.5 z-10 cursor-col-resize hover:bg-primary/40 focus:bg-primary/40"
      @pointerdown="startResize"
      @keydown.left.prevent="emit('update:width', clampWidth(width + 20))"
      @keydown.right.prevent="emit('update:width', clampWidth(width - 20))"
    />
    <component
      :is="active.component"
      v-if="active"
      :key="active.key"
      v-bind="active.state.data as Record<string, unknown>"
      @close="active.state.close"
    />
    <p
      v-else
      class="p-4 text-sm opacity-60"
    >
      Select an annotation
    </p>
  </div>
</template>
<script lang="ts" setup>
// ponytail: -m-4 cancels crouton Drawer's fixed p-4 on the right panel; drop when Drawer gets a padding prop

import { computed } from 'vue';

import { useEditorState } from '../composables/useEditorState';
import { SIDEBAR_KEYS } from '../modals/AnnotationModal.defaults';
import {
  EditorSidebarEmits,
  EditorSidebarProperties,
} from './EditorSidebar.properties';
import { clampSidebarWidth as clampWidth } from './sidebarWidth';

const props = defineProps(EditorSidebarProperties);
const emit = defineEmits(EditorSidebarEmits);
const { config } = useEditorState();

// Drawer sits on the right: dragging left grows it.
const startResize = (down: PointerEvent) => {
  const startX = down.clientX;
  const startWidth = props.width;
  const handle = down.currentTarget as HTMLElement;
  handle.setPointerCapture(down.pointerId);
  // crouton animates drawer width; disable while dragging so it follows the pointer
  document.body.classList.add('editor-sidebar-resizing');

  const move = (e: PointerEvent) =>
    emit('update:width', clampWidth(startWidth + startX - e.clientX));
  const stop = () => {
    document.body.classList.remove('editor-sidebar-resizing');
    handle.removeEventListener('pointermove', move);
    handle.removeEventListener('pointerup', stop);
    handle.removeEventListener('pointercancel', stop);
  };
  handle.addEventListener('pointermove', move);
  handle.addEventListener('pointerup', stop);
  handle.addEventListener('pointercancel', stop);
};

// One panel at a time: info-card stays visible during edit, so after
// save/cancel the sidebar falls back to it automatically.
const active = computed(() =>
  SIDEBAR_KEYS.map((key) => config.modal.getModal(key)).find(
    (m) => m?.state.isVisible,
  ),
);
</script>
