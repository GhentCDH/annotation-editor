<template>
  <JsonForm
    v-if="formValidation"
    :id="`annotation-selection-modal`"
    :form-data="formData"
    :schema="formValidation.jsonSchema"
    :ui-schema="formValidation.uiSchema"
    @change="onChange"
    @errors="onErrors"
  />
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';

import { type W3CAnnotation } from '@ghentcdh/w3c-utils';

import { JsonForm } from '@ghentcdh/json-forms-vue';
import { useEditorState } from '../../composables/useEditorState';

const formData = defineModel<any>();
const onChange = (data: any) => {
  formData.value = data;
};
const onErrors = (errors: any) => {
  emits('valid', errors.length === 0);
};

const properties = defineProps<{
  annotation?: W3CAnnotation | null;
  annotationType: string;
}>();

const emits = defineEmits(['valid']);

const { config, utils } = useEditorState();
const annotationDef = computed(() =>
  config.annotation.getDefinition(properties.annotationType),
);

const formValidation = computed(() => {
  const validation = annotationDef.value!.schema;
  if (!validation.uiSchema) {
    emits('valid', true);
    return null;
  }
  return validation;
});

onMounted(() => {
  if (!properties.annotation) {
    formData.value = {};
    return;
  }
  formData.value = utils.getMetadata(
    properties.annotation,
    annotationDef.value!.schema,
  );
});
</script>
