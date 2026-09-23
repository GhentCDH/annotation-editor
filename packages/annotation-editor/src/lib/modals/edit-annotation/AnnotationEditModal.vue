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
        v-if="annotationDef"
        layout="rows"
        :data="metadata"
        :views="annotationDef.schemas"
        :format-before-save="formatBeforeSave"
        form-max-width="w-max max-w-lg form-scroll min-w-[1/2]"
        :save-id="annotation?.id"
        @save="save"
        @on-save-success="save"
        @cancel="cancel"
      >
        <template #content-before>
          <div class="flex-grow before-scroll">
            <Collapse :title="label.selectLabel" :scrollable="true">
              <div :id="editId" />
              <Btn :outline="true" class="mt-2" @click="selectAll">
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
import { type AnnotatedText } from '@ghentcdh/annotated-text';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import {
  AnnotationEditEmits,
  AnnotationEditModalProperties,
} from './AnnotationEditModal.properties';
import { UseAnnotationEdit } from './UseAnnotationEdit';
import { useEditorState } from '../../composables/useEditorState';

let annotatedText: AnnotatedText<W3CAnnotation>;
const props = defineProps(AnnotationEditModalProperties);

const { config, utils } = useEditorState();

const emits = defineEmits(AnnotationEditEmits);

const {
  save,
  cancel,
  metadata,
  annotationSelector,
  annotationDef,
  message,
  onChangeValue,
} = UseAnnotationEdit(props, emits);

const editId = `edit-select-annotation-${Date.now()}--`;

const label = computed(() => {
  const _label = annotationDef?.label ?? props.type;

  return {
    title: props.annotation ? `Edit ${_label}` : `Create ${_label}`,
    selectLabel: props.annotation
      ? `Adjust ${_label} selection`
      : `Select ${_label} selection`,
  };
});

const formatBeforeSave = (formData: any) => {
  return onChangeValue({ metadata: formData });
};

const selectAll = () => {
  const source = props.source!;
  const selec = textPositionSelector?.value ?? {
    start: 0,
    end: source!.content.text.length + 1,
  };
  const selector = {
    ...selec,
    source: source.uri,
  };

  annotationSelector.value = utils.createAnnotationFromSelector(
    annotationDef,
    null,
    selector,
  );

  annotatedText
    .setAnnotationAdapterParams({ create: false, edit: true })
    .setAnnotations([annotationSelector.value]);
};
const textPositionSelector = computed(() => {
  if (!props.parentAnnotation || !props.source) {
    return null;
  }

  return utils.getTextPositionSelector(
    props.parentAnnotation,
    props.source.uri,
  );
});

onMounted(() => {
  if (!props.source) return;

  const annotations = props.annotation ? [props.annotation] : [];

  if (props.annotation) {
    annotationSelector.value = utils.createAnnotationFromSelector(
      annotationDef,
      props.annotation,
      null,
    );
  }
  annotatedText = config.annotation
    .createAnnotatedText(editId, props.source)
    .setStyleParams({
      styleFn: () => null,
    })
    .setRenderParams({
      renderFn: () => 'highlight',
    })
    .setAnnotations(annotations);

  annotatedText
    .setAnnotationAdapterParams({ edit: true, create: !props.annotation })
    .on('annotation-create--end', ({ mouseEvent, event, data: _data }) => {
      annotationSelector.value = _data.annotation;
      onChangeValue({ annotation: _data.annotation });
      annotatedText
        .setAnnotations([annotationSelector.value])
        .setAnnotationAdapterParams({ create: false, edit: true });
    })
    .on('annotation-edit--end', ({ mouseEvent, event, data }) => {
      annotationSelector.value = data.annotation;
      onChangeValue(data);
      annotatedText.setAnnotations([annotationSelector.value]);
    });

  if (textPositionSelector.value) {
    annotatedText.setTextAdapterParams({
      limit: { ...textPositionSelector.value, ignoreLines: true },
    });
  }
});

onUnmounted(() => {
  annotatedText?.destroy();
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
