<template>
  <template
    v-for="{ key, component: comp, state } in config.modal.modals"
    :key="key"
  >
    <template v-if="state?.isVisible">
      <component
        :is="comp"
        v-bind="state.data"
        :modal-view="modalView"
        @close="state.close"
      />
    </template>
  </template>
</template>
<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { AnnotationModalProperties } from './AnnotationModal.properties';
import { useEditorState } from '../composables/useEditorState';

const props = defineProps(AnnotationModalProperties);
const { config } = useEditorState();

onUnmounted(() => {
  config.modal.destroy();
});
</script>
