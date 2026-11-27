<template>
  <SourceNavbar
    v-if="!editorState.readonly"
    v-bind="properties"
    @create-annotation="createAnnotation"
  />
  <div class="overflow-y-auto flex-1 min-h-0">
    <div
      :id="textUuid"
      ref="mainEl"
      :dir="source.content.textDirection"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue';

import { type AnnotatedText } from '@ghentcdh/annotated-text';
import { EditorPosition } from '@ghentcdh/annotation-core';
import { type EditorAnnotation } from '@ghentcdh/annotation-ui';

import { useEditorState } from '../composables/useEditorState';
import { getEditModalState } from '../modals/edit-annotation/useAnnotationEditModal';
import { SourceEditProperties } from './SourceEdit.properties';
import SourceNavbar from './SourceNavbar.vue';

const properties = defineProps(SourceEditProperties);

const { config, sendAnnotationEvent, editorState, getDefinition, ...state } =
  useEditorState();

const textUuid = `text-content-${useId()}`;

let textAnnotation: AnnotatedText<EditorAnnotation> | undefined = undefined;

const mainEl = ref(null);
let observer: IntersectionObserver | null = null;

watch(
  () => config.createAnnotatedText,
  () => {
    textAnnotation?.destroy();
    nextTick(() => drawTextAnnotation());
  },
);

watch(
  () => properties.source,
  () => {
    textAnnotation?.setText(properties.source?.content.text ?? '');
  },
);

const editModal = getEditModalState(config.modal);

// Right drawer: the edit panel has no text of its own, so this source text
// switches to edit mode and shows only the annotation being edited.
const editingAnnotation = computed(() => {
  if (config.position !== EditorPosition.Right || !editModal.isVisible)
    return null;
  const data = editModal.data;
  if (!data?.annotation || data.source?.uri !== properties.source.uri)
    return null;
  return data.annotation;
});

const applyEditMode = () => {
  const annotation = editingAnnotation.value;
  if (!annotation) {
    // Redraw so the transformer's default adapter params apply again
    textAnnotation?.destroy();
    nextTick(() => drawTextAnnotation());
    return;
  }
  // ponytail: no parent-selector limit here (the modal limits the text); add if child edits drift outside parent
  textAnnotation
    ?.setAnnotationAdapterParams({ edit: true, create: !annotation.id })
    .setAnnotations(annotation.id ? [annotation] : []);
};

watch(editingAnnotation, applyEditMode);

watch(
  () => state.annotations.value,
  () => {
    if (editingAnnotation.value) return;
    textAnnotation?.setAnnotations([...state.annotations.value]);
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
  textAnnotation = config.createAnnotatedText(
    textUuid,
    properties.source,
  ).annotatedText;
  textAnnotation
    .setTagLabelFn((annotation: EditorAnnotation) => {
      return annotation.label ?? '';
    })
    .on('click', ({ mouseEvent, data }) => {
      const definition = getDefinition(data.annotation.definitionUri);
      sendAnnotationEvent('select', {
        mouseEvent: mouseEvent!,
        annotation: data.annotation,
        source: properties.source!,
        definitionUri: data.annotation.definitionUri,
        definition,
      });
    })
    .on('annotation-create--end', ({ data }) => {
      const selector = data.annotation.getSelector(properties.source.uri);
      if (selector) editModal.selector = selector;
      textAnnotation?.setAnnotationAdapterParams({ create: false, edit: true });
    })
    .on('annotation-edit--end', ({ data }) => {
      const selector = data.annotation.getSelector(properties.source.uri);
      if (selector) editModal.selector = selector;
    })
    .setText(properties.source?.content.text ?? '')
    .setAnnotations([...(state.annotations.value ?? [])]);
  if (editorState.selectedAnnotation)
    textAnnotation.selectAnnotations([editorState.selectedAnnotation.id]);
  if (editingAnnotation.value) applyEditMode();
};

onUnmounted(() => {
  textAnnotation?.destroy();
  if (observer) observer.disconnect();
});

const createAnnotation = (definitionUri: string) => {
  sendAnnotationEvent('create', {
    definitionUri,
    source: properties.source,
  });
};
</script>
