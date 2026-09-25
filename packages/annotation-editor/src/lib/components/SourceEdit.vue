<template>
  <SourceNavbar v-bind="properties" @create-annotation="createAnnotation" />
  <div class="overflow-y-auto flex-1 min-h-0">
    <div :id="textUuid" ref="mainEl" :dir="source.content.textDirection" />
  </div>
</template>
<script lang="ts" setup>
import { v4 as uuid } from 'uuid';
import { type AnnotatedText } from '@ghentcdh/annotated-text';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { SourceEditProperties } from './SourceEdit.properties';
import SourceNavbar from './SourceNavbar.vue';
import { useEditorState } from '../composables/useEditorState';
import {
  EditorAnnotation,
  UIAnnotationDefinition,
} from '@ghentcdh/annotation-ui';

const properties = defineProps(SourceEditProperties);

const { config, sendAnnotationEvent, editorState, ...state } = useEditorState();

const textUuid = `text-content-${uuid()}`;

let textAnnotation: AnnotatedText<W3CAnnotation> | undefined = undefined;

const mainEl = ref(null);
let observer: IntersectionObserver | null = null;

watch(
  () => properties.source,
  () => {
    textAnnotation?.setText(properties.source?.content.text ?? '');
  },
);

watch(
  () => state.annotations.value,
  () => {
    textAnnotation?.setAnnotations(state.annotations.value);
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
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      drawTextAnnotation();
      observer?.disconnect(); // Stop watching once visible, if desired
    }
  });

  if (mainEl.value) {
    observer.observe(mainEl.value);
  }
});

const drawTextAnnotation = () => {
  textAnnotation = config.annotation
    .createAnnotatedText(textUuid, properties.source)
    .setTagLabelFn((annotation: EditorAnnotation) => {
      return annotation.label;
    })
    .on('click', ({ mouseEvent, event, data }) => {
      sendAnnotationEvent('select', {
        mouseEvent: mouseEvent!,
        annotation: data.annotation,
        source: properties.source!,
      });
    })
    .setText(properties.source?.content.text ?? '')
    .setAnnotations(state.annotations.value ?? []);
};

onUnmounted(() => {
  textAnnotation?.destroy();
  if (observer) observer.disconnect();
});

const createAnnotation = (definition: UIAnnotationDefinition) => {
  sendAnnotationEvent('create', {
    definition: definition,
    source: properties.source,
  });
};
</script>
