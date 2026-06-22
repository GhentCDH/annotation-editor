<template>
  <div class="overflow-y-auto flex-1 min-h-0">
    <div :id="textUuid" :dir="source.content.textDirection" />
  </div>
</template>
<script lang="ts" setup>
import { v4 as uuid } from 'uuid';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { onMounted, onUnmounted, watch } from 'vue';
import { type AnnotatedText } from '@ghentcdh/annotated-text';
import type { SourceModel } from '@ghentcdh/annotation-ui';
import { usePreviewState } from '../composables/usePreviewState';

const properties = defineProps<{
  source: SourceModel;
  annotations: W3CAnnotation[];
}>();

const { config, sendSelectEvent, previewState, utils } = usePreviewState();

const textUuid = `text-content-${uuid()}`;

let textAnnotation: AnnotatedText<W3CAnnotation> | undefined = undefined;

watch(
  () => properties.source,
  () => { textAnnotation?.setText(properties.source?.content.text ?? ''); },
);

watch(
  () => properties.annotations,
  () => { textAnnotation?.setAnnotations(properties.annotations ?? []); },
);

watch(
  () => previewState.selectedAnnotation,
  () => {
    textAnnotation?.selectAnnotations(
      previewState.selectedAnnotation ? [previewState.selectedAnnotation.id] : [],
    );
  },
);

onMounted(() => {
  textAnnotation = config.annotation
    .createAnnotatedText(textUuid, properties.source)
    .setTagLabelFn((annotation: W3CAnnotation) => {
      const style = utils.getAnnotationStyle(annotation);
      return style?.name ?? style?.id ?? 'default';
    })
    .on('click', ({ mouseEvent, data }) => {
      sendSelectEvent({
        mouseEvent: mouseEvent!,
        annotation: data.annotation,
        source: properties.source,
      });
    })
    .setText(properties.source?.content.text ?? '')
    .setAnnotations(properties.annotations ?? []);
});

onUnmounted(() => { textAnnotation?.destroy(); });
</script>
