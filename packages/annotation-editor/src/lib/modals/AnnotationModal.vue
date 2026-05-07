<template>
  <template
    v-for="{ key, component: comp, state } in config.modal.modals"
    :key="key"
  >
    <template v-if="state?.isVisible">
      <component
        :is="comp"
        v-bind="state.data"
        @close="state.close"
      />
    </template>
  </template>
</template>
<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { useEditorState } from '../composables/useEditorState';

const { config } = useEditorState();

onUnmounted(() => {
  config.modal.destroy();
});
</script>
