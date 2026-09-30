<template>
  <Drawer
    class="_h-full"
    :width-left="300"
  >
    <Loading :loading="store.loading" />
    <AnnotationPreview
      v-if="readOnly"
      :configuration="definitionsState.configuration"
      :sources="store.sources"
      :annotations="store.filteredAnnotations"
      :annotation-definitions="definitionsState.definitions"
      :text-adapter="textAdapter"
      :annotation-transformer="annotationTransformer"
      :selected-annotation-id="selectedAnnotationId"
      :selected-annotation-action="selectedAnnotationAction"
      :cols="1"
      :modal-view="false"
      @select:annotation="selectAnnotation"
    />
    <AnnotationEditor
      v-else
      :configuration="definitionsState.configuration"
      :sources="store.sources"
      :annotations="store.filteredAnnotations"
      :annotation-definitions="definitionsState.definitions"
      :text-adapter="textAdapter"
      :annotation-transformer="annotationTransformer"
      :selected-annotation-id="selectedAnnotationId"
      :selected-annotation-action="selectedAnnotationAction"
      :cols="1"
      :modal-view="false"
      @select:annotation="selectAnnotation"
      @delete:annotation="store.reload"
      @update:annotation="store.reload"
      @create:annotation="store.reload"
    />
    <template #left-drawer>
      <div class="gap-2 flex flex-col">
        <AnnotationFilter
          v-model="store.selectedAnnotationTypes"
          :count="store.annotationsGroupedByPurpose"
        />
      </div>
    </template>
  </Drawer>
</template>

<script lang="ts" setup>
import {
  AnnotationEditor,
  AnnotationPreview,
} from '@ghentcdh/annotation-editor';
import { onMounted, ref, watch } from 'vue';
import type { W3CAnnotation } from '@ghentcdh/w3c-utils';
import { useRoute, useRouter } from 'vue-router';
import { Drawer, Loading } from '@ghentcdh/ui';
import { provideEditorStore } from './editorStore';
import { SmartEditorProperties } from './SmartEditor.properties';
import { useAnnotationDefinitions } from '../definitions/useAnnotationDefinitions';
import AnnotationFilter from '../filter/AnnotationFilter.vue';

const props = defineProps(SmartEditorProperties);

const selectedAnnotationId = ref<number | undefined>(undefined);
const selectedAnnotationAction = ref<string | undefined>(undefined);

const route = useRoute();
const router = useRouter();
const store = provideEditorStore(props.loader);

const definitionsState = useAnnotationDefinitions();

onMounted(() => {
  if (!props.watchQueryParams) return;
  const { action, annotationId } = route.query;
  if (annotationId) selectedAnnotationId.value = Number(annotationId);
  if (action) selectedAnnotationAction.value = action as string;
});

watch(
  () => props.sourceUris,
  () => {
    store.setSourceUris(props.sourceUris);
  },
  { immediate: true },
);

const selectAnnotation = (
  annotation: W3CAnnotation | null,
  action: string | null,
) => {
  if (!props.watchQueryParams) return;
  const query = { ...route.query };
  if (annotation) {
    query.annotationId = annotation.id;
  } else {
    delete query.annotationId;
  }
  if (action) {
    query.action = action;
  } else {
    delete query.action;
  }
  router.replace({ query });
};
</script>
