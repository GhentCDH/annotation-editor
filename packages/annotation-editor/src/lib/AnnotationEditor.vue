<template>
  <Drawer
    class="_h-full"
    :width-right="400"
    :initial-right-open="isRight"
  >
    <div
      ref="containerRef"
      data-testid="annotation-editor"
      class="grid gap-2 py-2 relative"
      :style="gridStyle"
    >
      <Collapse
        v-for="source in sources"
        :key="source.uri"
        :title="source.content.label ?? ''"
        :style="paneStyle(source)"
      >
        <SourceEdit :source="source" />
      </Collapse>
    </div>
    <template
      v-if="isRight"
      #right-drawer
    >
      <EditorSidebar />
    </template>
  </Drawer>
  <AnnotationModal :exclude="isRight ? SIDEBAR_KEYS : []" />
</template>
<script lang="ts" setup>
import { computed, useTemplateRef } from 'vue';

import {
  EditorPosition,
  type SourceModel,
  buildGridStyle,
  getPaneArea,
} from '@ghentcdh/annotation-core';
import { Collapse, Drawer } from '@ghentcdh/crouton-vue';

import {
  AnnotationEditorEmits,
  AnnotationEditorProperties,
} from './AnnotationEditor.properties';
import SourceEdit from './components/SourceEdit.vue';
import { useProvideEditorState } from './composables/useEditorState';
import { SIDEBAR_KEYS } from './modals/AnnotationModal.defaults';
import AnnotationModal from './modals/AnnotationModal.vue';
import EditorSidebar from './sidebar/EditorSidebar.vue';

const props = defineProps(AnnotationEditorProperties);
const emit = defineEmits(AnnotationEditorEmits);
const containerRef = useTemplateRef<HTMLElement>('containerRef');

// Each instance of EditorRoot gets its own isolated state
useProvideEditorState(props, emit, containerRef);

const isRight = computed(
  () => props.layout?.editorPosition === EditorPosition.Right,
);

const gridStyle = computed(() => {
  if (props.layout) return buildGridStyle(props.layout);
  return { gridTemplateColumns: `repeat(${props.cols}, minmax(0, 1fr))` };
});

const paneStyle = (source: SourceModel): Record<string, string> => {
  if (!props.layout) return {};
  const area = getPaneArea(props.layout, source.id);
  return area ? { gridArea: area } : {};
};
</script>
