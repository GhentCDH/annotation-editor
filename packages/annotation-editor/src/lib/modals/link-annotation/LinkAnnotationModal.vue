<template>
  <Modal
    :modal-title="label.title"
    :open="true"
    :disable-close="false"
    width="lg"
    @close-modal="cancel"
  >
    <template #content>
      <CroutonForm
        layout="rows"
        :data="metadata"
        :views="annotation.definition.schemas"
        :format-before-save="formatBeforeSave"
        form-max-width="w-max max-w-lg"
        @save="save"
        @on-save-success="save"
        @cancel="cancel"
      >
        <template #content-before>
          <div class="flex-grow flex flex-col gap-2">
            <AnnotationText
              v-for="a of annotations"
              :key="a.id"
              :annotation="a"
              :show-source="true"
            />
          </div>
        </template>
        <template #message-buttons>
          <FormMessage v-bind="message" />
        </template>
      </CroutonForm>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Modal } from '@ghentcdh/ui';
import { computed } from 'vue';
import { CroutonForm, FormMessage } from '@ghentcdh/crouton-vue';
import {
  LinkAnnotationProperties,
  LinkEmits,
} from './link-annotation.properties';

import { useAnnotationLink } from './UseAnnotationLink';
import AnnotationText from '../info/Annotation-text.vue';

const props = defineProps(LinkAnnotationProperties);
const emits = defineEmits(LinkEmits);

const { save, cancel, onChangeValue, message, annotations, metadata } =
  useAnnotationLink(props, emits);

const formatBeforeSave = (formData: Record<string, unknown>) => {
  return onChangeValue({ metadata: formData });
};

const label = computed(() => {
  const _label = props.annotation.definition.label;

  return {
    title: `Create ${_label} link`,
  };
});
</script>
