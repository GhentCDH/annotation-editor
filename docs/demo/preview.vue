<template>
  <AnnotationEditor
    :readonly="true"
    :configuration="config"
    :sources="sourcesPlainTxt"
    :annotations="annotations"
    :layout="layout"
    :annotation-definitions="definitions"
  />
</template>

<script setup lang="ts">
import {
  annotations as w3cAnnotations,
  config,
  definitions,
  layout,
  sourcesPlainTxt,
} from '@demo/demo-text';
import { AnnotationEditor } from '@ghentcdh/annotation-vue';
import {
  parseAnnotations,
  w3cAnnotationTransformer,
} from '../../packages/annotation-ui/src';

const annotations = parseAnnotations(w3cAnnotationTransformer, w3cAnnotations);
</script>
