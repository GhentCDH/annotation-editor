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
      <div class="flex flex-row gap-2">
        <Collapse :title="label.selectLabel">
          <div :id="editId" />
          <Btn :outline="true" class="mt-2" @click="selectAll">
            Select all text
          </Btn>
        </Collapse>
        <div class="w-max max-w-lg">
          <AnnotationForm
            v-model="formData"
            :annotation="annotation"
            :annotation-type="type!"
            @valid="onValid"
          />
        </div>
      </div>
    </template>
    <template #actions>
      <Btn :color="'secondary' as any" :outline="true" @click="onCancel">
        Cancel
      </Btn>
      <Btn :disabled="formDisabled" @click="onSubmit"> Save </Btn>
    </template>
  </Modal>
</template>
<script lang="ts" setup>
import { Btn, Collapse, Modal } from '@ghentcdh/ui';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { type AnnotatedText } from '@ghentcdh/annotated-text';
import { w3cAnnotation, type W3CAnnotation } from '@ghentcdh/w3c-utils';
import AnnotationForm from './AnnotationForm.vue';
import { AnnotationEditEmits, AnnotationEditModalProperties } from './AnnotationEditModal.properties';
import { useEditorState } from '../../composables/useEditorState';
import { type Selector } from '../../utils/annotation-utils';

let annotatedText: AnnotatedText<W3CAnnotation>;
const props = defineProps(AnnotationEditModalProperties);

const { config, utils } = useEditorState();

// const annotationEdit = ref<W3CAnnotation | null>(props.annotation ?? null);
const emits = defineEmits(AnnotationEditEmits);

const editId = `edit-select-annotation-${Date.now()}--`;
const metadataValid = ref(true);

const annotationDef = computed(() => {
  return config.annotation.getDefinition(props.type!);
});

const formData = ref(null);
const label = computed(() => {
  const _label = annotationDef.value?.label ?? props.type;

  return {
    title: props.annotation ? `Edit ${_label}` : `Create ${_label}`,
    selectLabel: props.annotation
      ? `Adjust ${_label} selection`
      : `Select ${_label} selection`,
  };
});

const onSubmit = () => {
  if (formDisabled.value) return;

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
    annotationDef.value!,
    formData.value,
    extraTextPositionSelector,
  );

  // Submit it to the parent so if needed it can be saved to the server
  (result as any).id = props.annotation?.id ?? null;
  emits('close', { annotation: result });

  // if(!props.annotation){
  //   updatedAnnotation= this.ann
  // }
  //
  // if (textPositionSelector.value) {
  //   const currentTextPositionSelector = w3cAnnotation(
  //     annotationEdit.value!,
  //   ).getTextPositionSelector(props.source!.uri)[0];
  //
  //   const length =
  //     currentTextPositionSelector.end - currentTextPositionSelector.start;
  //   const start =
  //     textPositionSelector.value.start - currentTextPositionSelector.start;
  //   const end = start + length;
  //   const annotationTextPositionSelector = {
  //     start,
  //     end,
  //     source: props.parentAnnotation!.id,
  //   };
  //
  //   updatedAnnotation = utils.updateTextPositionSelector(
  //     annotationSelector.value!,
  //     annotationTextPositionSelector,
  //   );
  // }
  //
  // const result = utils.updateAnnotationData(updatedAnnotation!, formData.value);
  // if (props.annotation?.id) result.id = props.annotation.id;
  // emits('close', { annotation: result });
};

const onValid = (valid: boolean) => {
  metadataValid.value = valid;
};

const formDisabled = computed(() => {
  if (!annotationSelector.value) return true;

  // TODO add validate of form data
  return !metadataValid.value;
});

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
  // annotationSelector.value=//;
  // FIXME
  // annotationEdit.value = annotationEdit.value
  //   ? utils.updateTextPositionSelector(annotationEdit.value, selector)
  //   : utils.createAnnotation(null, annotationDef.value!, selector);
  //
  // annotatedText
  //   .setAnnotationAdapter({ create: false, edit: true })
  //   .setAnnotations([annotationEdit.value]);

  annotationSelector.value = utils.createAnnotationFromSelector(
    annotationDef.value!,
    null,
    selector,
  );

  annotatedText
    .setAnnotationAdapter({ create: false, edit: true })
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
      annotationDef.value!,
      props.annotation,
      null,
    );
  }
  annotatedText = config.annotation
    .createAnnotatedText(editId, props.source)
    .setAnnotationAdapter({ edit: true, create: !props.annotation })
    .on('annotation-create--end', ({ mouseEvent, event, data: _data }) => {
      annotationSelector.value = _data.annotation;
      annotatedText
        .setAnnotations([annotationSelector.value])
        .setAnnotationAdapter({ create: false, edit: true });
    })
    .on('annotation-edit--end', ({ mouseEvent, event, data }) => {
      annotationSelector.value = data.annotation;
      annotatedText.setAnnotations([annotationSelector.value]);
    })
    .setStyleParams({
      styleFn: () => null,
    })
    .setRenderParams({
      renderFn: () => 'highlight',
    })
    .setAnnotations(annotations);

  if (textPositionSelector.value) {
    annotatedText.setTextAdapter({
      limit: { ...textPositionSelector.value, ignoreLines: true },
    });
  }
});

onUnmounted(() => {
  annotatedText?.destroy();
});
</script>
