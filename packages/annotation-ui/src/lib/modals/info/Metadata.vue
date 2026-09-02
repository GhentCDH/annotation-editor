<template>
  <CroutonForm
    :id="`annotation-selection-modal`"
    :form-data="data"
    :readonly="true"
    :schema="view.json_schema"
    :ui-schema="view.ui_schema"
  />
</template>
<script setup lang="ts">
import { CroutonForm } from '@ghentcdh/crouton-vue';
import { type ViewConfig } from '@ghentcdh/crouton-core';

const properties = defineProps<{
  data: any;
  view: ViewConfig;
}>();
</script>
