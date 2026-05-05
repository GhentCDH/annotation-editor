<template>
  <Modal :modal-title="title" :open="true" :disable-close="true">
    <template #content>
      {{ message }}
    </template>
    <template #actions>
      <Btn :color="'secondary'" :outline="true" @click="closeMe(false)">
        {{ cancelLabel }}
      </Btn>
      <Btn @click="closeMe(true)">
        {{ confirmLabel }}
      </Btn>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ConfirmEmits, ConfirmProperties } from './confirm.properties';
import { Btn, Modal } from '@ghentcdh/ui';

import { useRouter } from 'vue-router';

defineProps(ConfirmProperties);
const emits = defineEmits(ConfirmEmits);
const router = useRouter();

const closeMe = (confirmed: boolean) => {
  emits('close', { confirmed });
};
</script>
