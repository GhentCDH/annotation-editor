<template>
  <SourceNavbar v-bind="properties" @create-annotation="createAnnotation" />
  <div class="overflow-y-auto flex-1 min-h-0">
    <div :id="textUuid" />
  </div>
</template>
<script lang="ts" setup>
import { v4 as uuid } from 'uuid';
import { type AnnotatedText } from '@ghentcdh/annotated-text';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { onMounted, onUnmounted, watch } from 'vue';
import { SourceEditProperties } from './SourceEdit.properties';
import SourceNavbar from './SourceNavbar.vue';
import { useEditorState } from '../composables/useEditorState';

const properties = defineProps(SourceEditProperties);

const { config, sendAnnotationEvent, editorState, utils } = useEditorState();

const textUuid = `text-content-${uuid()}`;

let textAnnotation: AnnotatedText<W3CAnnotation> | undefined = undefined;

watch(
  () => properties.source,
  () => {
    textAnnotation?.setText(properties.source?.content.text ?? '');
  },
);

watch(
  () => properties.annotations,
  () => {
    textAnnotation?.setAnnotations(properties.annotations ?? []);
  },
);

watch(
  () => editorState.selectedAnnotation,
  () => {
    textAnnotation?.selectAnnotations(
      editorState.selectedAnnotation ? [editorState.selectedAnnotation.id] : [],
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
    .on('click', ({ mouseEvent, event, data }) => {
      sendAnnotationEvent('select', {
        mouseEvent: mouseEvent!,
        annotation: data.annotation,
        source: properties.source!,
      });
    })
    .setText(properties.source?.content.text ?? '')
    .setAnnotations(properties.annotations ?? []);
});

onUnmounted(() => {
  textAnnotation?.destroy();
});

const createAnnotation = (annotationType: string) => {
  sendAnnotationEvent('create', {
    type: annotationType,
    source: properties.source,
  });
};
</script>
