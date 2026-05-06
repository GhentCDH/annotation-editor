<template>
  <div
    class="relative"
    @mouseenter="showFullText"
    @mouseleave="hideFullText"
  >
    <component
      :is="showSource ? Collapse : 'div'"
      v-bind="showSource ? { title: 'Shhow the source' } : {}"
    >
      <div class="flex flex-row items-center gap-2">
        <div
          :id="annotationTextId"
          class="flex-1"
        />
        <div v-if="showHover">
          ...
        </div>
      </div>
    </component>
    <div
      v-if="hoverPosition"
      :id="annotationTextFullId"
      class="absolute left-0 top-full z-[100] border border-1 border-gray-200 shadow-sm bg-white p-2"
    />
  </div>
</template>
<script lang="ts" setup>
import { type AnnotatedText } from '@ghentcdh/annotated-text';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { Collapse } from '@ghentcdh/ui';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { useEditorState } from '../../composables/useEditorState';

const properties = defineProps<{
  annotation: W3CAnnotation;
  maxCharacters?: number;
  showSource?: boolean;
}>();

const annotationTextId = `annotation-text-${uuidv4()}`;
const annotationTextFullId = `annotation-text-full-${uuidv4()}`;
const showHover = ref(false);

let annotatedText: AnnotatedText<W3CAnnotation>;
let annotatedTextFull: AnnotatedText<W3CAnnotation>;

const { config, utils, sources } = useEditorState();

const textData = computed(() => {
  const { textPositionSelector, sourceUri } = utils.getSourceUri(
    properties.annotation,
  )!;

  const source = sources.find((source) => source.uri === sourceUri);
  if (!source) {
    console.warn(`Source not found for uri: ${sourceUri}`);
    return null;
  }

  const end = properties.maxCharacters
    ? Math.min(
        textPositionSelector.end,
        textPositionSelector.start + properties.maxCharacters,
      )
    : textPositionSelector.end;

  return { textPositionSelector, text: source, end };
});

onMounted(() => {
  const _data = textData.value;
  if (!_data) {
    showHover.value = false;
    return;
  }

  const { textPositionSelector, text, end } = _data;
  showHover.value = textPositionSelector.end > end;

  annotatedText = config.annotation
    .createAnnotatedText(annotationTextId, text)
    .setTextAdapter({
      limit: {
        start: textPositionSelector.start,
        end: end,
        ignoreLines: true,
      },
    });
});

watch(
  () => textData.value,
  () => {
    hideFullText();
    const _data = textData.value;
    if (!_data) {
      annotatedText?.destroy();
      return;
    }

    const { textPositionSelector, text, end } = _data;
    showHover.value = textPositionSelector.end > end;

    annotatedText
      .setTextAdapter({
        limit: {
          start: textPositionSelector.start,
          end: end,
          ignoreLines: true,
        },
      })
      .setText(text.content.text);
  },
);

const hoverPosition = ref<{ x: number; y: number } | null>(null);
const showFullText = (mouseEvent: MouseEvent) => {
  if (!showHover.value) return;
  if (hoverPosition.value) return;

  hoverPosition.value = { x: mouseEvent.clientX, y: mouseEvent.clientY };

  window.setTimeout(() => renderFullText(), 100);
};

const renderFullText = () => {
  const { textPositionSelector, text } = textData.value!;

  annotatedTextFull = config.annotation
    .createAnnotatedText(annotationTextFullId, text)
    .setTextAdapter({
      limit: {
        start: textPositionSelector.start,
        end: textPositionSelector.end,
        ignoreLines: true,
      },
    });
};

const hideFullText = () => {
  annotatedTextFull?.destroy();
  hoverPosition.value = null;
};

onUnmounted(() => {
  annotatedText?.destroy();
  annotatedTextFull?.destroy();
});
</script>
