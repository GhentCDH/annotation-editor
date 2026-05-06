<template>
  <Modal
    :modal-title="label.title"
    :open="true"
    :disable-close="false"
    width="lg"
    @close-modal="onCancel"
  >
    <template #content>
      {{ annotation }}
      <div class="flex flex-col gap-2">
        <AnnotationText
          :annotation="sourceAnnotation!"
          :show-source="true"
        />
        <AnnotationText
          :annotation="targetAnnotation!"
          :show-source="true"
        />
        <AnnotationForm
          v-if="annotationDef"
          v-model="formData"
          :annotation="annotation"
          :annotation-type="type!"
        />
      </div>
    </template>
    <template #actions>
      <Btn
        :color="'secondary' as any"
        :outline="true"
        @click="onCancel"
      >
        Cancel
      </Btn>
      <Btn @click="onSubmit">
        Save
      </Btn>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { Btn, Modal } from '@ghentcdh/ui';
import { computed, ref } from 'vue';
import {
  LinkAnnotationProperties,
  LinkEmits,
} from './link-annotation.properties';
import { useEditorState } from '../../composables/useEditorState';
import AnnotationForm from '../edit-annotation/AnnotationForm.vue';

import AnnotationText from '../info/Annotation-text.vue';

const props = defineProps(LinkAnnotationProperties);
const emits = defineEmits(LinkEmits);

const { utils, config } = useEditorState();

const formData = ref(null);
const annotationDef = computed(() => {
  return config.annotation.getDefinition(props.type!);
});

const label = computed(() => {
  const _label = annotationDef.value?.label ?? props.type;

  return {
    title: `Create ${_label} link`,
  };
});
const annotation = computed(() =>
  utils.createLinkAnnotation(
    props.sourceAnnotation!,
    props.targetAnnotation!,
    annotationDef.value!.context,
  ),
);

const onSubmit = () => {
  if (!annotation.value) return;

  const result = utils.updateAnnotationData(annotation.value, formData.value);
  emits('close', { annotation: result });
};

const onCancel = () => {
  utils.cancel();
  emits('close', { annotation: null as any });
};
</script>
