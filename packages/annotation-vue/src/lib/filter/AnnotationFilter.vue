<template>
  <Filter
    v-model="model"
    title="Annotation filter"
    :items="items"
    color-key="color"
    v-bind="itemClickBind"
  />
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, type PropType } from 'vue';
import { Filter } from '@ghentcdh/crouton-vue';
import { useAnnotationDefinitions } from '../definitions/useAnnotationDefinitions';

const emit = defineEmits(['item-click']);
const hasItemClick = !!getCurrentInstance()?.vnode.props?.['onItemClick'];
const itemClickBind = hasItemClick ? { onItemClick: (item: Record<string, any>) => emit('item-click', item) } : {};

const annotationDefinitions = useAnnotationDefinitions();
const model = defineModel<string[]>();
const props = defineProps({
  count: {
    type: Object as PropType<Record<string, any[]>>,
    default: undefined,
  },
});

const items = computed(() => {
  return annotationDefinitions.definitions.map((def) => {
    return {
      id: def.id,
      label: def.label,
      color: def.style?.default?.backgroundColor,
      count: props.count?.[def.id]?.length ?? 0,
    };
  });
});
</script>
