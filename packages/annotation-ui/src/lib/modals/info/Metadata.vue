<template>
  <JsonForm
    :id="`annotation-selection-modal`"
    :form-data="data"
    :readonly="true"
    :schema="schema"
    :ui-schema="uiSchema"
  />
</template>
<script setup lang="ts">
import { type UISchemaElement } from '@jsonforms/core';
import { JsonForm, type JsonFormsLayout } from '@ghentcdh/crouton-forms-vue';

const properties = defineProps<{
  data: any;
  schema: JsonFormsLayout;
  uiSchema: UISchemaElement;
}>();
</script>
