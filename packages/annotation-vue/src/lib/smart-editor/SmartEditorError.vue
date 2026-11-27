<template>
  <div
    data-testid="smart-editor-error"
    class="flex h-full min-h-[16rem] items-center justify-center p-6"
  >
    <div class="w-full max-w-lg space-y-3 text-center">
      <Alert
        type="error"
        :message="title"
      />
      <p class="text-sm text-base-content/80">
        {{ description }}
      </p>
      <p
        v-if="showDetail"
        class="text-xs font-mono text-base-content/50 break-words"
      >
        {{ error.detail }}
      </p>
      <button
        type="button"
        class="btn btn-sm btn-primary"
        @click="emit('retry')"
      >
        Try again
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { Alert } from '@ghentcdh/crouton-vue';

import { type EditorLoadError } from './editorError';

const props = defineProps<{
  error: EditorLoadError;
}>();

const emit = defineEmits<{
  retry: [];
}>();

const title = computed(() =>
  props.error.isNotFound ? 'Text not found' : 'Could not load the editor',
);

const description = computed(() => {
  if (props.error.isNotFound) {
    return 'The text you tried to open could not be found (404). It may have been deleted, or the link may be incorrect.';
  }

  return (
    props.error.message ||
    'Something went wrong while loading the annotation editor.'
  );
});

const showDetail = computed(() => {
  const detail = props.error.detail?.trim();
  return !!detail && !props.error.isNotFound && detail !== description.value;
});
</script>
