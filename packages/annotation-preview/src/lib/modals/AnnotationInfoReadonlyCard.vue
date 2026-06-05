<template>
  <div
    ref="cardRef"
    class="card bg-base-100 shadow-xl absolute z-50"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
  >
    <div class="card-body p-2">
      <div class="flex items-center justify-between gap-2">
        <div><strong>Type:</strong> {{ purposeLabel }}</div>
        <button
          class="btn btn-ghost btn-xs"
          @click="close"
        >
          ✕
        </button>
      </div>
      <MetadataTable
        v-if="metadata && validation?.metaDataSchema"
        :data="metadata"
        :schema="validation.jsonSchema"
        :ui-schema="validation.metaDataSchema"
      />
      <LinksDetailReadonly :annotation="annotation!" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import {
  AnnotationInfoCardProperties,
  MetadataTable,
} from '@ghentcdh/annotation-ui';
import LinksDetailReadonly from './LinksDetailReadonly.vue';
import { usePreviewState } from '../composables/usePreviewState';

const properties = defineProps(AnnotationInfoCardProperties);

const { config, utils, previewState } = usePreviewState();

const purpose = computed(() => {
  if (!properties.annotation) return 'default';
  return utils.getAnnotationType(properties.annotation);
});

const annotationDef = computed(() =>
  config.annotation.getDefinition(purpose.value),
);

const purposeLabel = computed(
  () => annotationDef.value?.label || purpose.value,
);

const validation = computed(() => annotationDef.value?.schema);

const metadata = computed(() => {
  if (!properties.annotation || !validation.value) return null;
  return utils.getMetadata(properties.annotation, validation.value);
});

const close = () => previewState.reset();

const cardRef = ref<HTMLElement>();
const closeNextClick = ref(true);

watch(
  () => properties.annotation,
  () => { closeNextClick.value = true; },
);

onMounted(() => document.addEventListener('click', handleOutsideClick));
onUnmounted(() => document.removeEventListener('click', handleOutsideClick));

function handleOutsideClick(e: MouseEvent) {
  if (closeNextClick.value) { closeNextClick.value = false; return; }
  if (cardRef.value && !cardRef.value.contains(e.target as Node)) close();
}
</script>
