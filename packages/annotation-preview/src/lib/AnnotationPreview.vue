<template>
  <div
    ref="containerRef"
    data-testid="annotation-preview"
    class="grid gap-2 py-2 relative"
    :style="gridStyle"
  >
    <Collapse
      v-for="source in sources"
      :key="source.uri"
      :title="source.content.label ?? ''"
      :style="paneStyle(source)"
    >
      <SourcePreview
        :source="source"
        :annotations="annotations"
      />
    </Collapse>
    <PreviewModal />
  </div>
</template>
<script lang="ts" setup>
import { computed, useTemplateRef } from 'vue';
import { Collapse } from '@ghentcdh/ui';
import type { SourceModel } from '@ghentcdh/annotation-ui';
import { AnnotationPreviewEmits, AnnotationPreviewProperties } from './AnnotationPreview.properties';
import { buildGridStyle, getPaneArea } from './types/preview-layout.types';
import SourcePreview from './components/SourcePreview.vue';
import PreviewModal from './modals/PreviewModal.vue';
import { useProvidePreviewState } from './composables/usePreviewState';

const props = defineProps(AnnotationPreviewProperties);
const emit = defineEmits(AnnotationPreviewEmits);
const containerRef = useTemplateRef<HTMLElement>('containerRef');

useProvidePreviewState(props, emit, containerRef);

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
