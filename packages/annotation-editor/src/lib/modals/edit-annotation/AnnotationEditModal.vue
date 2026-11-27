<template>
  <EditorContainer
    :title="label.title"
    width="xl"
    @close="cancel"
  >
    <template #content>
      <CroutonForm
        v-if="definition"
        layout="rows"
        :data="metadata"
        :views="views"
        :format-before-save="formatBeforeSave"
        :form-max-width="
          inline ? 'w-full' : 'w-max max-w-lg form-scroll min-w-[1/2]'
        "
        :save-id="
          annotation?.id !== undefined ? String(annotation!.id) : undefined
        "
        @save="save"
        @on-save-success="save"
        @cancel="cancel"
      >
        <!-- Right drawer: selection is adjusted in the main source text instead -->
        <template
          v-if="!inline"
          #content-before
        >
          <div class="flex-grow before-scroll">
            <Collapse
              :title="label.selectLabel"
              :scrollable="true"
            >
              <div :id="editId" />
              <Btn
                :outline="true"
                class="mt-2"
                @click="selectAll"
              >
                Select all text
              </Btn>
            </Collapse>
          </div>
        </template>
        <template #message-buttons>
          <FormMessage v-bind="message" />
        </template>
      </CroutonForm>
    </template>
  </EditorContainer>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';

import { EditorPosition } from '@ghentcdh/annotation-core';
import {
  type AnnotationMetadata,
  type UiAnnotatedText,
  updateAnnotation,
} from '@ghentcdh/annotation-ui';
import { type ViewConfig } from '@ghentcdh/crouton-core';
import {
  Btn,
  Collapse,
  CroutonForm,
  FormMessage,
} from '@ghentcdh/crouton-vue';

import EditorContainer from '../../components/EditorContainer.vue';
import { useEditorState } from '../../composables/useEditorState';
import {
  AnnotationEditEmits,
  AnnotationEditModalProperties,
} from './AnnotationEditModal.properties';
import { fullSelectionRange } from './fullSelectionRange';
import { useAnnotationEditForm } from './useAnnotationEditForm';
import { getEditModalState } from './useAnnotationEditModal';

let annotatedTextConfig: UiAnnotatedText;
const props = defineProps(AnnotationEditModalProperties);

const { config } = useEditorState();
const inline = computed(() => config.position === EditorPosition.Right);

const emits = defineEmits(AnnotationEditEmits);

const {
  save,
  cancel,
  metadata,
  message,
  onChangeValue,
  updateSelector,
  definition,
  parent,
} = useAnnotationEditForm(props, emits);

const editId = `edit-select-annotation-${Date.now()}--`;

const views = computed(
  (): Record<string, ViewConfig> =>
    (definition?.schemas ?? {}) as Record<string, ViewConfig>,
);

const label = computed(() => {
  const _label = definition.label;
  const isNew = !props.annotation?.id;
  return {
    title: isNew ? `Create ${_label}` : `Edit ${_label}`,
    selectLabel: isNew
      ? `Select ${_label} selection`
      : `Adjust ${_label} selection`,
  };
});

// crouton-vue types formatBeforeSave as returning a Promise, but calls it synchronously.
const formatBeforeSave = ((formData: AnnotationMetadata) =>
  onChangeValue({ metadata: formData })) as unknown as (
  formData: AnnotationMetadata,
) => Promise<AnnotationMetadata>;

const selectFull = () => {
  const { source, annotation } = props;
  const startOffset = annotatedTextConfig.annotationAdapter.startOffset;
  const maxRange = fullSelectionRange(
    source!.content.text,
    startOffset,
    parent?.getSelector(source.uri),
  );

  return updateAnnotation(
    source.uri,
    maxRange,
    { fullFlatText: source.content.text, startOffset },
    annotation!,
  );
};

const selectAll = () => {
  const annotation = selectFull();

  annotatedTextConfig.annotatedText
    .setAnnotationAdapterParams({ create: false, edit: true })
    .setAnnotations([annotation]);
  const sel = annotation.getSelector(props.source.uri);
  if (sel) updateSelector(sel);
};

// Right drawer: SourceEdit writes the drawn selector into the edit modal state
watch(
  () => getEditModalState(config.modal).selector,
  (selector) => {
    if (selector) updateSelector(selector);
  },
);

onMounted(() => {
  if (!props.source || inline.value) return;

  const annotations = props.annotation ? [props.annotation] : [];

  annotatedTextConfig = config.createAnnotatedText(editId, props.source);
  annotatedTextConfig.annotatedText
    // Snapper should be derived from the annotation model
    // .setSnapper(new WordSnapper())
    .setStyleParams({
      styleFn: () => null,
    })
    .setRenderParams({
      renderFn: () => 'highlight',
    })
    .setAnnotations(annotations)
    .setAnnotationAdapterParams({ edit: true, create: !props.annotation?.id })
    .on('annotation-create--end', ({ data: _data }) => {
      const s = _data.annotation.getSelector(props.source.uri);
      if (s) updateSelector(s);
      annotatedTextConfig.annotatedText.setAnnotationAdapterParams({
        create: false,
        edit: true,
      });
    })
    .on('annotation-edit--end', ({ data }) => {
      const s = data.annotation.getSelector(props.source.uri);
      if (s) updateSelector(s);
    });

  const selector = parent?.getSelector(props.source.uri);
  if (selector) {
    annotatedTextConfig.annotatedText.setTextAdapterParams({
      limit: { ...selector, ignoreLines: true },
    });
  }
});

onUnmounted(() => {
  annotatedTextConfig?.annotatedText?.destroy();
});
</script>

<style scoped>
/* collapse section: capped height, scrolls independently */
.before-scroll {
  max-height: calc(90vh - 12rem);
  overflow-y: auto;
}

/* form section: capped height, scrolls independently */
:deep(.form-scroll) {
  max-height: calc(90vh - 12rem);
  overflow-y: auto;
}
</style>
