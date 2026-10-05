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
        :views="definition.schemas"
        :format-before-save="formatBeforeSave"
        form-max-width="w-max max-w-lg form-scroll min-w-[1/2]"
        :save-id="annotation?.id"
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
import { CroutonForm, FormMessage } from '@ghentcdh/crouton-vue';
import { Btn, Collapse, Modal } from '@ghentcdh/ui';
import { computed, onMounted, onUnmounted } from 'vue';
import {
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

const { config, findAnnotation } = useEditorState();

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

const formatBeforeSave = (formData: any) => {
  return onChangeValue({ metadata: formData });
};

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

  const original = {
    id: 'NEW_ANNOTATION',
    metadata,
    selectors: [],
    ...annotation,
  };

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
  updateSelector(annotation.getSelector(props.source.uri));
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
    .on('annotation-create--end', ({ mouseEvent, event, data: _data }) => {
      updateSelector(_data.annotation.getSelector(props.source.uri));
      annotatedTextConfig.annotatedText.setAnnotationAdapterParams({
        create: false,
        edit: true,
      });
    })
    .on('annotation-edit--end', ({ mouseEvent, event, data }) => {
      updateSelector(data.annotation.getSelector(props.source.uri));
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
