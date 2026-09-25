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
        v-if="annotation.definition"
        layout="rows"
        :data="metadata"
        :views="annotation.definition.schemas"
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
import {
  AnnotationEditEmits,
  AnnotationEditModalProperties,
} from './AnnotationEditModal.properties';
import { UseAnnotationEdit } from './UseAnnotationEdit';
import { useEditorState } from '../../composables/useEditorState';
import { EditorAnnotation, updateAnnotation } from '@ghentcdh/annotation-ui';

let annotatedText: AnnotatedText<EditorAnnotation>;
const props = defineProps(AnnotationEditModalProperties);

const { config } = useEditorState();

const emits = defineEmits(AnnotationEditEmits);

const { save, cancel, metadata, annotationSelector, message, onChangeValue } =
  UseAnnotationEdit(props, emits);

const editId = `edit-select-annotation-${Date.now()}--`;

const label = computed(() => {
  const _label = props.annotation.definition.label;
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
  const parent = annotation.parent;
  if (parent) {
    const selector = parent.getSelector(source.uri);
    if (selector) {
      maxRange.start = selector.start;
      maxRange.end = selector.end;
    }
  }

  const original = {
    id: `NEW_ANNOTATION`,
    metadata,
    selectors: [],
    ...annotation,
  };

  return updateAnnotation(
    source.uri,
    maxRange,
    {
      fullFlatText: '', //TODO implement it
      startOffset: 0, // TODO implement it
      // fullFlatText: textAdapter.fullFlatText,
      // startOffset: startOffset,
    },
    original,
  );
};

const selectAll = () => {
  const annotation = selectFull();

  annotatedText
    .setAnnotationAdapterParams({ create: false, edit: true })
    .setAnnotations([annotation]);
  annotationSelector.value = annotation;
};

onMounted(() => {
  if (!props.source) return;

  const annotations = props.annotation ? [props.annotation] : [];

  if (props.annotation) {
    // annotationSelector.value = utils.createAnnotationFromSelector(
    //   annotationDef,
    //   props.annotation,
    //   null,
    // );
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

  const selector = props.annotation.parent?.getSelector(props.source.uri);
  if (selector) {
    annotatedText.setTextAdapterParams({
      limit: { ...selector, ignoreLines: true },
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
