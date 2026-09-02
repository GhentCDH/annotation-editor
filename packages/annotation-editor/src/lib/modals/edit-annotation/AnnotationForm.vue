<template>
  <CroutonForm
    v-if="formDef"
    :id="`annotation-selection-modal`"
    ref="formRef"
    :form-data="formData"
    :error-mode="errorMode"
    :schema="formDef.json_schema"
    :ui-schema="formDef.ui_schema"
    :http="useApi()"
    @errors="onErrors"
    @change="onChange"
  />
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { CroutonForm } from '@ghentcdh/crouton-vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { useApi } from '@ghentcdh/annotation-vue';
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

const formDef = computed(() => annotationDef.value?.views?.form);
const errorMode = 'onBlur';

onMounted(() => {
  if (!properties.annotation) {
    formData.value = {};
    return;
  }
  formData.value = utils.getMetadata(properties.annotation);
});
</script>
