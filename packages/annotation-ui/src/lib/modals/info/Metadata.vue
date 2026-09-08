<template>
  <CroutonForm
    :id="`annotation-selection-modal`"
    :data="data"
    :readonly="true"
    :views="definition.schemas"
  />
</template>
<script setup lang="ts">
import { CroutonForm } from '@ghentcdh/crouton-vue';
import { type UIAnnotationDefinition } from '@ghentcdh/annotation-core';

const properties = defineProps<{
  data: any;
  definition: UIAnnotationDefinition;
}>();
</script>
