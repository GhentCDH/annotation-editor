<template>
  <EditorContainer
    :title="label.title"
    width="lg"
    @close="cancel"
  >
    <template #content>
      <CroutonForm
        layout="rows"
        :data="metadata"
        :views="views"
        :format-before-save="formatBeforeSave"
        :form-max-width="inline ? 'w-full' : 'w-max max-w-lg'"
        @save="save"
        @on-save-success="save"
        @cancel="cancel"
      >
        <template #content-before>
          <div class="flex-grow flex flex-col gap-2">
            <AnnotationText
              v-for="a of annotations"
              :key="a.id"
              :annotation="a"
              :show-source="true"
            />
          </div>
        </template>
        <template #message-buttons>
          <FormMessage v-bind="message" />
        </template>
      </CroutonForm>
    </template>
  </EditorContainer>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import { EditorPosition } from '@ghentcdh/annotation-core';
import { type AnnotationMetadata } from '@ghentcdh/annotation-ui';
import { type ViewConfig } from '@ghentcdh/crouton-core';
import { CroutonForm, FormMessage } from '@ghentcdh/crouton-vue';

import EditorContainer from '../../components/EditorContainer.vue';
import { useEditorState } from '../../composables/useEditorState';
import AnnotationText from '../info/AnnotationText.vue';
import {
  LinkAnnotationProperties,
  LinkEmits,
} from './link-annotation.properties';
import { useAnnotationLinkForm } from './useAnnotationLinkForm';

const props = defineProps(LinkAnnotationProperties);
const { config } = useEditorState();
const inline = computed(() => config.position === EditorPosition.Right);
const emits = defineEmits(LinkEmits);

const {
  save,
  cancel,
  onChangeValue,
  message,
  annotations,
  metadata,
  definition,
} = useAnnotationLinkForm(props, emits);

// crouton-vue types formatBeforeSave as returning a Promise, but calls it synchronously.
const formatBeforeSave = ((formData: AnnotationMetadata) =>
  onChangeValue({ metadata: formData })) as unknown as (
  formData: AnnotationMetadata,
) => Promise<AnnotationMetadata>;

const views = computed((): Record<string, ViewConfig> => {
  const schemas = definition.schemas;
  return (schemas ?? {}) as Record<string, ViewConfig>;
});

const label = computed(() => {
  const _label = definition.label;

  return {
    title: `Create ${_label} link`,
  };
});
</script>
