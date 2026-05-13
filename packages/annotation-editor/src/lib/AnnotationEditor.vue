<template>
  <div
    class="grid gap-2 py-2 relative"
    :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }"
    ref="containerRef"
  >
    <Collapse
      v-for="source in sources"
      :key="source.uri"
      :title="source.content.label ?? ''"
    >
      <SourceEdit :source="source" :annotations="annotations" />
    </Collapse>
    <AnnotationModal />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue';
import { Collapse } from '@ghentcdh/ui';
import { AnnotationEditorEmits, AnnotationEditorProperties } from './AnnotationEditor.properties';
import SourceEdit from './components/SourceEdit.vue';
import AnnotationModal from './modals/AnnotationModal.vue';
import { useProvideEditorState } from './composables/useEditorState';

const props = defineProps(AnnotationEditorProperties);
const emit = defineEmits(AnnotationEditorEmits);
const containerRef = useTemplateRef<HTMLElement>('containerRef');

// Each instance of EditorRoot gets its own isolated state
useProvideEditorState(props, emit, containerRef);

onMounted(() => {});
</script>
