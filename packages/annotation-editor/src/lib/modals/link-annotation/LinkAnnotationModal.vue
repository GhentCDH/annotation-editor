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
        v-if="annotationDef"
        layout="rows"
        :data="formData"
        :views="annotationDef.schemas"
        :format-before-save="formatBeforeSave"
        form-max-width="w-max max-w-lg"
        @save="save"
        @on-save-success="save"
        @cancel="cancel"
      >
        <template #content-before>
          <div class="flex-grow flex flex-col gap-2">
            <AnnotationText
              :annotation="sourceAnnotation"
              :show-source="true"
            />
            <AnnotationText
              :annotation="targetAnnotation"
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
import { computed, ref } from 'vue';
import { CroutonForm, FormMessage } from '@ghentcdh/crouton-vue';
import {
  LinkAnnotationProperties,
  LinkEmits,
} from './link-annotation.properties';

import { useAnnotationLink } from './UseAnnotationLink';
import AnnotationText from '../info/Annotation-text.vue';

const props = defineProps(LinkAnnotationProperties);
const emits = defineEmits(LinkEmits);

const { annotationDef, save, cancel, onChangeValue, message } =
  useAnnotationLink(props, emits);

const formData = ref(null);

const formatBeforeSave = (formData: any) => {
  return onChangeValue({ metadata: formData });
};

const label = computed(() => {
  const _label = annotationDef?.label ?? props.type;

  return {
    title: `Create ${_label} link`,
  };
});
</script>
