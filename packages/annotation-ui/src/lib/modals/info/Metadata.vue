<template>
  <FormComponent
    :id="`annotation-selection-modal`"
    :form-data="data"
    :readonly="true"
    :schema="view.json_schema"
    :ui-schema="view.ui_schema"
  />
</template>
<script setup lang="ts">
import { FormComponent } from '@ghentcdh/crouton-forms-vue';
import { type ViewConfig } from '@ghentcdh/crouton-core';

const properties = defineProps<{
  data: any;
  view: ViewConfig;
}>();
</script>
