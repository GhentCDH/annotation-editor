<template>
  <SourceNavbar
    v-bind="properties"
    @create-annotation="createAnnotation"
  />
  <div :id="textUuid" />
</template>
<script lang="ts" setup>
import { SourceEditProperties } from './SourceEdit.properties';
import { v4 as uuid } from 'uuid';
import { AnnotatedText, W3CAnnotation } from '@ghentcdh/annotated-text';
import { onMounted, onUnmounted, watch } from 'vue';
import SourceNavbar from './SourceNavbar.vue';
import { useEditorState } from '../composables/useEditorState';

const properties = defineProps(SourceEditProperties);

const { config, sendAnnotationEvent, editorState, utils } = useEditorState();

const textUuid = `text-content-${uuid()}`;

let textAnnotation: AnnotatedText<W3CAnnotation> | undefined = undefined;

const setTextContent = () => {
  const content = properties.source?.content;

  if (!textAnnotation) return;

  textAnnotation
    .setText(content?.text ?? '')
    .setAnnotations(properties.annotations ?? []);
};

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
    .setTagLabelFn((annotation) => {
      const style = utils.getAnnotationStyle(annotation);
      return style?.name ?? style?.id;
    })
    .on('click', ({ mouseEvent, event, data }) => {
      sendAnnotationEvent('select', {
        mouseEvent,
        annotation: data.annotation,
        source: properties.source,
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
