<template>
  <div
    data-testid="editor-sidebar"
    class="p-2"
  >
    <component
      :is="active.component"
      v-if="active"
      :key="active.key"
      v-bind="active.state.data as Record<string, unknown>"
      @close="active.state.close"
    />
    <p
      v-else
      class="text-sm opacity-60"
    >
      Select an annotation
    </p>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import { useEditorState } from '../composables/useEditorState';
import { SIDEBAR_KEYS } from '../modals/AnnotationModal.defaults';

const { config } = useEditorState();

// One panel at a time: info-card stays visible during edit, so after
// save/cancel the sidebar falls back to it automatically.
const active = computed(() =>
  SIDEBAR_KEYS.map((key) => config.modal.getModal(key)).find(
    (m) => m?.state.isVisible,
  ),
);
</script>
