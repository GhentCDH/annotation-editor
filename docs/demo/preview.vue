<template>
  <AnnotationPreview
    :configuration="config"
    :sources="sourcesPlainTxt"
    :annotations="annotations"
    :layout="layout"
    :annotation-definitions="definitions"
  />
</template>

<script setup lang="ts">
import {
  annotations,
  config,
  definitions,
  layout,
  sourcesPlainTxt,
} from '@demo/demo-text';
import { AnnotationPreview, configureApi } from '@ghentcdh/annotation-vue';
import axios from 'axios';

configureApi(axios);
</script>
