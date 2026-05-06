<template>
  <Modal
    :modal-title="title"
    :open="true"
    :disable-close="true"
  >
    <template #content>
      {{ message }}
    </template>
    <template #actions>
      <Btn
        :color="('secondary' as any)"
        :outline="true"
        @click="closeMe(false)"
      >
        {{ cancelLabel }}
      </Btn>
      <Btn @click="closeMe(true)">
        {{ confirmLabel }}
      </Btn>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Btn, Modal } from '@ghentcdh/ui';
import { ConfirmEmits, ConfirmProperties } from './confirm.properties';

defineProps(ConfirmProperties);
const emits = defineEmits(ConfirmEmits);

const closeMe = (confirmed: boolean) => {
  emits('close', { confirmed });
};
</script>
