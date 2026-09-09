<template>
  metadata table
  <CroutonForm
    :id="`annotation-selection-modal`"
    :data="data"
    :readonly="true"
    :views="views"
  />
</template>
<script setup lang="ts">
import { CroutonForm } from '@ghentcdh/crouton-vue';
import { type UIAnnotationDefinition } from '@ghentcdh/annotation-core';
import { computed } from 'vue';

const properties = defineProps<{
  data: any;
  definition: UIAnnotationDefinition;
}>();

const views = computed(() => properties.definition.schemas as any);
</script>
