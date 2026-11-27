<template>
  <div
    v-if="inline"
    data-testid="editor-container-inline"
    class="bg-base-100"
  >
    <div class="flex flex-col p-2 gap-2">
      <div class="flex items-center justify-between gap-2">
        <h3 class="card-title text-base">
          {{ title }}
        </h3>
        <Btn
          v-if="!disableClose"
          :icon="IconEnum.Close"
          :outline="true"
          aria-label="Close"
          @click="emit('close')"
        />
      </div>
      <slot name="content" />
      <div
        v-if="$slots.actions"
        class="card-actions justify-end"
      >
        <slot name="actions" />
      </div>
    </div>
  </div>
  <Modal
    v-else
    :modal-title="title"
    :open="true"
    :disable-close="disableClose"
    :width="width"
    role="dialog"
    @close-modal="emit('close')"
  >
    <template #content>
      <slot name="content" />
    </template>
    <template
      v-if="$slots.actions"
      #actions
    >
      <slot name="actions" />
    </template>
  </Modal>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import { EditorPosition } from '@ghentcdh/annotation-core';
import { Btn, IconEnum, Modal } from '@ghentcdh/crouton-vue';

import { useEditorState } from '../composables/useEditorState';
import {
  EditorContainerEmits,
  EditorContainerProperties,
} from './EditorContainer.properties';

defineProps(EditorContainerProperties);
const emit = defineEmits(EditorContainerEmits);

const { config } = useEditorState();
const inline = computed(() => config.position === EditorPosition.Right);
</script>
