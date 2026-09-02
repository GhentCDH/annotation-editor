<template>
  <Modal
    :modal-title="label.title"
    :open="true"
    :disable-close="false"
    width="xl"
    role="dialog"
    @close-modal="onCancel"
  >
    <template #content>
      <CroutonForm
        layout="rows"
        :data="metadata"
        :views="annotationDef.views"
        :format-before-save="formatBeforeSave"
        form-max-width="w-max max-w-lg"
        @click="onCancel"
        @save="save"
      >
        <template #content-before>
          <div class="flex-grow">
            <Collapse :title="label.selectLabel">
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
      </CroutonForm>
    </template>
  </Modal>
</template>
<script lang="ts" setup>
import { CroutonForm } from '@ghentcdh/crouton-vue';
import { Btn, Collapse, Modal } from '@ghentcdh/ui';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { type AnnotatedText } from '@ghentcdh/annotated-text';
import { w3cAnnotation, type W3CAnnotation } from '@ghentcdh/w3c-utils';
import {
  AnnotationEditEmits,
  AnnotationEditModalProperties,
} from './AnnotationEditModal.properties';
import { useEditorState } from '../../composables/useEditorState';
import { type Selector } from '@ghentcdh/annotation-ui';
import { useMetadata } from '../../utils/useMetadata';

let annotatedText: AnnotatedText<W3CAnnotation>;
const props = defineProps(AnnotationEditModalProperties);

const { config, utils } = useEditorState();

const emits = defineEmits(AnnotationEditEmits);

const editId = `edit-select-annotation-${Date.now()}--`;

const { annotationDef, metadata } = useMetadata(props);

const label = computed(() => {
  const _label = annotationDef.label ?? props.type;

  return {
    title: props.annotation ? `Edit ${_label}` : `Create ${_label}`,
    selectLabel: props.annotation
      ? `Adjust ${_label} selection`
      : `Select ${_label} selection`,
  };
});

const formatBeforeSave = (formData: any) => {
  let updatedAnnotation = annotationSelector.value;

  let extraTextPositionSelector: Selector | undefined;

  if (textPositionSelector.value && updatedAnnotation) {
    const currentTextPositionSelector = w3cAnnotation(
      updatedAnnotation,
    ).getTextPositionSelector(props.source!.uri)[0];

    const length =
      currentTextPositionSelector.end - currentTextPositionSelector.start;
    const start =
      textPositionSelector.value.start - currentTextPositionSelector.start;
    const end = start + length;
    extraTextPositionSelector = {
      start,
      end,
      source: props.parentAnnotation!.id,
    } as Selector;
  }
  const result = utils.createAnnotation(
    updatedAnnotation,
    annotationDef,
    formData,
    extraTextPositionSelector,
  );

  // Submit it to the parent so if needed it can be saved to the server
  (result as any).id = props.annotation?.id ?? null;

  return result;
};

const save = (annotation: any) => {
  emits('close', { annotation });
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

const onCancel = () => {
  utils.cancel();
  emits('close', null);
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

const annotationSelector = ref<W3CAnnotation | null>(null);

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
      annotatedText
        .setAnnotations([annotationSelector.value])
        .setAnnotationAdapterParams({ create: false, edit: true });
    })
    .on('annotation-edit--end', ({ mouseEvent, event, data }) => {
      annotationSelector.value = data.annotation;
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
