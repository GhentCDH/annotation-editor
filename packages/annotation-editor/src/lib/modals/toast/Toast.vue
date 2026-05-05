<template>
  <div class="toast toast-center z-[3000]">
    <div
      role="alert"
      class="alert border-primary bg-white"
    >
      <span>{{ toastMessage }}</span>
      <div class="flex gap-2">
        <Btn
          v-if="action"
          :color="Color.secondary"
          @click="close()"
        >
          {{ action.label || 'Close' }}
        </Btn>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Btn, Color } from '@ghentcdh/ui';
import { EditToastEmits, ToastProperties } from './toast.properties';

// Create a new store each time we have a new text
const properties = defineProps(ToastProperties);

const emits = defineEmits(EditToastEmits);

const close = () => {
  properties.action?.onClick();
  emits('close');
};
</script>
