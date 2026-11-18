<template>
  <CroutonForm
    v-if="show"
    :id="`annotation-selection-modal`"
    :data="data"
    :readonly="true"
    :views="views"
  />
</template>
<script setup lang="ts">
import { CroutonForm } from '@ghentcdh/crouton-vue';
import { type UIAnnotationDefinition } from '@ghentcdh/annotation-ui';
import { type ViewConfig } from '@ghentcdh/crouton-core';
import { computed } from 'vue';

const properties = defineProps<{
  data: Record<string, unknown>;
  definition: UIAnnotationDefinition;
}>();

const views = computed(
  (): Record<string, ViewConfig> =>
    (properties.definition?.schemas ?? {}) as Record<string, ViewConfig>,
);
const elements = views.value?.['view']?.['ui']?.['elements'] as
  | unknown[]
  | undefined;
const show = computed(() => (elements?.length ?? 0) > 0);
</script>
