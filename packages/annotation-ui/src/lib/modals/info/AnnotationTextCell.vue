<template>
  <span v-if="excerpt">{{ excerpt }}</span>
  <span
    v-else
    class="text-gray-400 italic"
  >—</span>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { w3cAnnotation, type W3CAnnotation } from '@ghentcdh/w3c-utils';
import type { SourceModel } from '../../types/source.model';

const props = defineProps<{
  annotation: W3CAnnotation;
  sources: SourceModel[];
  maxCharacters?: number;
}>();

const excerpt = computed(() => {
  const builder = w3cAnnotation(props.annotation);
  const sourceUri = builder.getSourceUri();
  if (!sourceUri) return null;

  const source = props.sources.find((s) => s.uri === sourceUri);
  if (!source) return null;

  const selector = builder.getTextPositionSelector(sourceUri)[0];
  if (!selector) return null;

  const max = props.maxCharacters ?? 50;
  const start = selector.start ?? 0;
  const end = Math.min(selector.end ?? start + max, start + max);
  const text = source.content.text.slice(start, end);

  return selector.end > end ? `${text}…` : text;
});
</script>
