<template>
  <Filter
    v-model="model"
    title="Annotation filter"
    :items="items"
    color-key="color"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Filter } from '@ghentcdh/ui';
import { useAnnotationDefinitions } from '@ghentcdh/annotation-vue';

const annotationDefinitions = useAnnotationDefinitions();
const model = defineModel<string[]>();

const items = computed(() => {
  return annotationDefinitions.definitions.map((def) => {
    return {
      id: def.id,
      label: def.label,
      color: def.style.default?.backgroundColor,
    };
  });
});
</script>
