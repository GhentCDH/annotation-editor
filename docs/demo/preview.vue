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
import { AnnotationEditor, configureApi } from '@ghentcdh/annotation-vue';
import axios from 'axios';
import { W3cTransformAnnotationAdapter } from '../../packages/annotation-ui/src';

configureApi(axios);

const transformer = new W3cTransformAnnotationAdapter();
let annotations = w3cAnnotations.map((a) => transformer.parse(a));
annotations = transformer.createLinks(annotations);
</script>
