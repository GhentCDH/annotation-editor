<template>
  <div>
    <h2>Annotation Editor — two sources</h2>

    <div style="margin-bottom: 0.5rem; display: flex; gap: 0.5rem">
      <label>
        Columns:
        <input v-model.number="cols" type="number" min="1" max="4" style="width: 3rem" />
      </label>
    </div>

    <AnnotationEditor
      :configuration="configuration"
      :sources="sources"
      :annotations="annotations"
      :annotation-definitions="annotationDefinitions"
      :cols="cols"
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
import { mockSources } from '../mock-data/sources';
import { mockAnnotations } from '../mock-data/annotations';
import { mockAnnotationDefinitions } from '../mock-data/annotation-definitions';

const configuration = mockConfiguration;
const sources = mockSources;
const annotationDefinitions = mockAnnotationDefinitions;

const annotations = ref<W3CAnnotation[]>([...mockAnnotations]);
const cols = ref(2);
const eventLog = ref<Array<{ type: string; id: string }>>([]);
const selectedId = ref<string | null>(null);

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
