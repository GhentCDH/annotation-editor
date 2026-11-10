<template>
  <Modal
    :modal-title="label.title"
    :open="true"
    :disable-close="false"
    width="xl"
    role="dialog"
    @close-modal="cancel"
  >
    <template #content>
      <CroutonForm
        v-if="definition"
        layout="rows"
        :data="metadata"
        :views="(definition.schemas as any)"
        :format-before-save="formatBeforeSave"
        form-max-width="w-max max-w-lg form-scroll min-w-[1/2]"
        :save-id="annotation?.id !== undefined ? String(annotation!.id) : undefined"
        @save="save"
        @on-save-success="save"
        @cancel="cancel"
      >
        <template #content-before>
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
  </Modal>
</template>
<script lang="ts" setup>
import {
  Btn,
  Collapse,
  CroutonForm,
  FormMessage,
  Modal,
} from '@ghentcdh/crouton-vue';
import { computed, onMounted, onUnmounted } from 'vue';
import {
  type AnnotationMetadata,
  type UiAnnotatedText,
  updateAnnotation,
} from '@ghentcdh/annotation-ui';
import {
  AnnotationEditEmits,
  AnnotationEditModalProperties,
} from './AnnotationEditModal.properties';
import { UseAnnotationEdit } from './UseAnnotationEdit';
import { useEditorState } from '../../composables/useEditorState';

let annotatedTextConfig: UiAnnotatedText;
const props = defineProps(AnnotationEditModalProperties);

const { config } = useEditorState();

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
} = UseAnnotationEdit(props, emits);

const editId = `edit-select-annotation-${Date.now()}--`;

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
  const maxRange = {
    start: 0,
    end: source!.content.text.length + 1,
  };
  if (parent) {
    const selector = parent.getSelector(source.uri);
    if (selector) {
      maxRange.start = selector.start;
      maxRange.end = selector.end;
    }
  }

  const original = annotation!;
  return updateAnnotation(
    source.uri,
    maxRange,
    {
      fullFlatText: props.source.content.text,
      startOffset: 0, // TODO implement it
    },
    original,
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

onMounted(() => {
  if (!props.source) return;

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
  annotatedTextConfig.annotatedText?.destroy();
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
