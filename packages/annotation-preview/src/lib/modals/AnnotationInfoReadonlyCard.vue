<template>
  <AnnotationInfoCardBase
    v-bind="$props"
    :config="config.annotation"
    :utils="utils"
    @close="close"
  >
    <template #header-actions>
      <button
        class="btn btn-ghost btn-xs"
        @click="close"
      >
        ✕
      </button>
    </template>
    <template #links="{ annotation }">
      <LinksDetailReadonly :annotation="annotation" />
    </template>
  </AnnotationInfoCardBase>
</template>
<script lang="ts" setup>
import {
  AnnotationInfoCardProperties,
  AnnotationInfoCardBase,
} from '@ghentcdh/annotation-ui';
import LinksDetailReadonly from './LinksDetailReadonly.vue';
import { usePreviewState } from '../composables/usePreviewState';

defineProps(AnnotationInfoCardProperties);

const { config, utils, previewState } = usePreviewState();

const close = () => previewState.reset();
</script>
