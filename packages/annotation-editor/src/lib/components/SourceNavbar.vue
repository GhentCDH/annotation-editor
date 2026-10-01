<template>
  <Navbar :actions="actions" />
</template>

<script setup lang="ts">
import { IconEnum } from '@ghentcdh/ui';
import { computed } from 'vue';
import Navbar from './navbar.vue';
import {
  SourceNavbarEmits,
  SourceNavbarProperties,
} from './SourceNavbar.properties';
import { useEditorState } from '../composables/useEditorState';

const properties = defineProps(SourceNavbarProperties);
const emits = defineEmits(SourceNavbarEmits);
const { editorState, allDefinitions, getDefinition } = useEditorState();

const actions = computed(() => {
  const rootTypes = allDefinitions.value
    .filter((d) => d.annotation.isRoot)
    .map((d) => ({ key: d.id, label: d.label }));

  return [
    {
      icon: IconEnum.Plus,
      label: 'Add',
      disabled: editorState.disableEdits,
      children: rootTypes.map((type) => ({
        action: () => {
          createAnnotation(getDefinition(type.key));
        },
        label: type.label,
        disabled: properties.disabled,
      })),
    },
  ];
});

const createAnnotation = (annotationType: string) => {
  emits('createAnnotation', annotationType);
};
</script>
