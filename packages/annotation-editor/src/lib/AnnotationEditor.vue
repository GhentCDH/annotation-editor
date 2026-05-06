<template>
  <div
    class="grid gap-2 py-2"
    :style="{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }"
  >
    <Collapse
      v-for="source in sources"
      :key="source.uri"
      :title="source.content.label"
    >
      <SourceEdit :source="source" :annotations="annotations" />
    </Collapse>
  </div>
  <AnnotationModal />
</template>
<script lang="ts" setup>
import { AnnotationEditorEmits, AnnotationEditorProperties } from './AnnotationEditor.properties';
import SourceEdit from './components/SourceEdit.vue';
import { onMounted } from 'vue';
import AnnotationModal from './modals/AnnotationModal.vue';
import { Collapse } from '@ghentcdh/ui';
import { useProvideEditorState } from './composables/useEditorState';

const props = defineProps(AnnotationEditorProperties);
const emit = defineEmits(AnnotationEditorEmits);

// Each instance of EditorRoot gets its own isolated state
useProvideEditorState(props, emit);

onMounted(() => {});
</script>
