<template>
  <div>
    <h2>Annotation Editor — pre-selected annotation</h2>

    <div style="margin-bottom: 0.5rem">
      Pre-selected annotation:
      <code>{{ selectedAnnotationId }}</code>
    </div>

    <AnnotationEditor
      :configuration="configuration"
      :sources="sources"
      :annotations="annotations"
      :annotation-definitions="annotationDefinitions"
      :cols="1"
      :selected-annotation-id="selectedAnnotationId"
      selected-annotation-action="show"
      @create:annotation="onCreate"
      @update:annotation="onUpdate"
      @delete:annotation="onDelete"
      @select:annotation="onSelect"
    />

    <!-- Probes for Playwright assertions -->
    <pre data-testid="annotations" style="display:none">{{ JSON.stringify(annotations) }}</pre>
    <pre data-testid="events" style="display:none">{{ JSON.stringify(eventLog) }}</pre>
    <pre data-testid="selected" style="display:none">{{ JSON.stringify(selectedId) }}</pre>
    <pre data-testid="source-count" style="display:none">{{ JSON.stringify(sources.length) }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { AnnotationEditor } from '@ghentcdh/annotation-editor';
import type { W3CAnnotation } from '@ghentcdh/w3c-utils';
import { mockConfiguration } from '../mock-data/configuration';
import { mockSourcesSingle } from '../mock-data/sources';
import { mockAnnotations } from '../mock-data/annotations';
import { mockAnnotationDefinitions } from '../mock-data/annotation-definitions';

const configuration = mockConfiguration;
const sources = mockSourcesSingle;
const annotationDefinitions = mockAnnotationDefinitions;

// Pre-select the first annotation
const selectedAnnotationId = mockAnnotations[0].id;

const annotations = ref<W3CAnnotation[]>([...mockAnnotations]);
const eventLog = ref<Array<{ type: string; id: string }>>([]);
const selectedId = ref<string | null>(selectedAnnotationId);

const onCreate = async (annotation: W3CAnnotation) => {
  annotations.value = [...annotations.value, annotation];
  eventLog.value = [...eventLog.value, { type: 'create', id: annotation.id }];
  return annotation;
};

const onUpdate = async (annotation: W3CAnnotation) => {
  annotations.value = annotations.value.map((a) =>
    a.id === annotation.id ? annotation : a,
  );
  eventLog.value = [...eventLog.value, { type: 'update', id: annotation.id }];
  return annotation;
};

const onDelete = async (annotation: W3CAnnotation) => {
  annotations.value = annotations.value.filter((a) => a.id !== annotation.id);
  eventLog.value = [...eventLog.value, { type: 'delete', id: annotation.id }];
  return annotation;
};

const onSelect = (annotation: W3CAnnotation | null, action: string | null) => {
  selectedId.value = annotation?.id ?? null;
  if (annotation) {
    eventLog.value = [
      ...eventLog.value,
      { type: `select:${action ?? 'default'}`, id: annotation.id },
    ];
  }
};
</script>
