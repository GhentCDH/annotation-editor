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
const { config, editorState } = useEditorState();
const actions = computed(() => [
  {
    icon: IconEnum.Plus,
    label: 'Add',
    disabled: editorState.disableEdits,
    children: config.annotation.rootTypes.map((type) => ({
      action: () => createAnnotation(type.key),
      label: type.label,
      disabled: properties.disabled,
    })),
  },
]);

const createAnnotation = (annotationType: string) => {
  emits('createAnnotation', annotationType);
};
</script>
