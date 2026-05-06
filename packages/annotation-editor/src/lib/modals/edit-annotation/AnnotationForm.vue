<template>
  <FormComponent
    v-if="formValidation"
    :id="`annotation-selection-modal`"
    :form-data="formData"
    :schema="formValidation.jsonSchema"
    :ui-schema="formValidation.uiSchema"
    @valid="onValid($event)"
    @change="onChange"
    @errors="onErrors"
    @events="handleFormEvents"
  />
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';

import { type W3CAnnotation } from '@ghentcdh/w3c-utils';

import { FormComponent } from '@ghentcdh/json-forms-vue';
import { useEditorState } from '../../composables/useEditorState';

const formData = defineModel<any>();
const onChange = (data: any) => {
  formData.value = data;
};
const onErrors = (errors: any) => {};

const onValid = (valid: boolean) => {};

const properties = defineProps<{
  annotation?: W3CAnnotation;
  annotationType: string;
}>();

const { config, utils, handleFormEvents } = useEditorState();
const annotationDef = computed(() =>
  config.annotation.getDefinition(properties.annotationType),
);

const formValidation = computed(() => {
  const validation = annotationDef.value!.schema;
  if (!validation.uiSchema) return null;

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
