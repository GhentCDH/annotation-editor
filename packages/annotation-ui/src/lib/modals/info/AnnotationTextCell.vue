<template>
  <span v-if="excerpt">{{ excerpt }}</span>
  <span
    v-else
    class="text-gray-400 italic"
  >—</span>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { SourceModel } from '../../types/source.model';
import { type EditorAnnotation } from '../../adapter';

const props = defineProps<{
  annotation: EditorAnnotation;
  sources: SourceModel[];
  maxCharacters?: number;
}>();

const excerpt = computed(() => {
  const selector = props.annotation.selectors.find((s) => s.uri);
  const sourceUri = selector?.uri;
  if (!sourceUri) return null;

  const source = props.sources.find((s) => s.uri === sourceUri);
  if (!source) return null;

  const max = props.maxCharacters ?? 50;
  const start = selector.start ?? 0;
  const end = Math.min(selector.end ?? start + max, start + max);
  const text = source.content.text.slice(start, end);

  return selector.end > end ? `${text}…` : text;
});
</script>
