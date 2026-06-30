<template>
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
      <SourceEdit
        :source="source"
        :annotations="annotations"
      />
    </Collapse>
    <AnnotationModal />
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, useTemplateRef } from 'vue';
import { Collapse } from '@ghentcdh/ui';
import { type SourceModel, buildGridStyle, getPaneArea } from '@ghentcdh/annotation-ui';
import { AnnotationEditorEmits, AnnotationEditorProperties } from './AnnotationEditor.properties';
import SourceEdit from './components/SourceEdit.vue';
import AnnotationModal from './modals/AnnotationModal.vue';
import { useProvideEditorState } from './composables/useEditorState';

const props = defineProps(AnnotationEditorProperties);
const emit = defineEmits(AnnotationEditorEmits);
const containerRef = useTemplateRef<HTMLElement>('containerRef');

// Each instance of EditorRoot gets its own isolated state
useProvideEditorState(props, emit, containerRef);

const gridStyle = computed(() => {
  if (props.layout) return buildGridStyle(props.layout);
  return { gridTemplateColumns: `repeat(${props.cols}, minmax(0, 1fr))` };
});

const paneStyle = (source: SourceModel): Record<string, string> => {
  if (!props.layout) return {};
  const area = getPaneArea(props.layout, source.id);
  return area ? { gridArea: area } : {};
};

onMounted(() => {});
</script>
