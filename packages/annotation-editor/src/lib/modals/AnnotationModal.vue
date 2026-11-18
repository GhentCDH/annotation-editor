<template>
  <template
    v-for="{ key, component: comp, state } in config.modal.modals"
    :key="key"
  >
    <template v-if="state?.isVisible">
      <component
        :is="comp"
        v-bind="getModalData(state)"
        :modal-view="modalView"
        @close="state.close"
      />
    </template>
  </template>
</template>
<script lang="ts" setup>
import { type UnwrapNestedRefs, onUnmounted } from 'vue';

import { useEditorState } from '../composables/useEditorState';
import { type AnnotationModalFn } from './AnnotationModal.definition';
import { AnnotationModalProperties } from './AnnotationModal.properties';

defineProps(AnnotationModalProperties);
const { config } = useEditorState();

const getModalData = (state: UnwrapNestedRefs<AnnotationModalFn<unknown, unknown, void>>) =>
  state.data as unknown as Record<string, unknown>;

onUnmounted(() => {
  config.modal.destroy();
});
</script>
