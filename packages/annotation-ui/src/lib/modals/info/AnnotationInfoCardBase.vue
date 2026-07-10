<template>
  <div
    ref="cardRef"
    class="card bg-base-100 shadow-xl absolute z-50"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
  >
    <div class="card-body p-2">
      <div class="flex items-center justify-between gap-2">
        <div><strong>Type:</strong> {{ purposeLabel }}</div>
        <slot name="header-actions" />
      </div>
      <MetadataTable
        v-if="metadata && validation?.metaDataSchema"
        :data="metadata"
        :schema="validation.jsonSchema"
        :ui-schema="validation.metaDataSchema"
      />
      <slot
        name="links"
        :annotation="annotation!"
      />
      <slot name="actions" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import MetadataTable from './Metadata.vue';
import {
  AnnotationInfoCardBaseEmits,
  AnnotationInfoCardBaseProperties,
} from './AnnotationInfoCardBase.properties';
import { type FormValidationDef } from '../../types/AnnotationConfiguration.model';

const properties = defineProps(AnnotationInfoCardBaseProperties);
const emit = defineEmits(AnnotationInfoCardBaseEmits);

const purpose = computed(() => {
  if (!properties.annotation) return 'default';
  return properties.utils.getAnnotationType(properties.annotation);
});

const annotationDef = computed(() =>
  properties.config.getDefinition(purpose.value),
);

const purposeLabel = computed(
  () => annotationDef.value?.label || purpose.value,
);

const validation = computed(
  () => annotationDef.value?.schema as FormValidationDef | undefined,
);

const metadata = computed(() => {
  if (!properties.annotation || !validation.value) return null;
  return properties.utils.getMetadata(properties.annotation, validation.value);
});

const cardRef = ref<HTMLElement>();
const closeNextClick = ref(true);

watch(
  () => properties.annotation,
  () => {
    closeNextClick.value = true;
  },
);

onMounted(() => document.addEventListener('click', handleOutsideClick));
onUnmounted(() => document.removeEventListener('click', handleOutsideClick));

const skipNextClose = () => {
  closeNextClick.value = true;
};

defineExpose({ skipNextClose });

function handleOutsideClick(e: MouseEvent) {
  if (properties.disableClose) return;

  if (closeNextClick.value) {
    closeNextClick.value = false;
    return;
  }

  if (cardRef.value && !cardRef.value.contains(e.target as Node)) {
    emit('close');
  }
}
</script>
