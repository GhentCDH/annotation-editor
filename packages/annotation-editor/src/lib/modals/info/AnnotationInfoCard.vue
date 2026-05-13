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
      <div><strong>Type:</strong> {{ purposeLabel }}</div>
      <Metadata
        v-if="metadata && validation.metaDataSchema"
        :data="metadata"
        :schema="validation.jsonSchema"
        :ui-schema="validation.metaDataSchema"
      />
      <LinksDetail :annotation="annotation!" />
      <Alert
        v-if="editorState.info"
        type="info"
        :message="'Action: ' + editorState.info.short"
      />
      <Navbar :actions="actions" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Alert, IconEnum } from '@ghentcdh/ui';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { AnnotationInfoCardProperties } from './AnnotationInfoCard.properties';
import Metadata from './Metadata.vue';
import LinksDetail from './LinksDetail.vue';
import { useEditorState } from '../../composables/useEditorState';
import Navbar from '../../components/navbar.vue';
import { type AnnotationDefinition } from '../../types/AnnotationConfiguration.model';
import { type NavbarAction } from '../../components/navbar.properties';

const properties = defineProps(AnnotationInfoCardProperties);

const { config, editorState, sendAnnotationEvent, utils } = useEditorState();

const purpose = computed(() => {
  const annotation = properties.annotation;
  if (!annotation) return 'default';
  return utils.getAnnotationType(annotation);
});
const annotationDef = computed(() => {
  return config.annotation.getDefinition(purpose.value);
});
const purposeLabel = computed(() => {
  return annotationDef.value?.label || purpose.value;
});

const validation = computed(() => {
  return annotationDef.value!.schema;
});

const metadata = computed(() => {
  return utils.getMetadata(properties.annotation!, validation.value);
});

const close = () => {
  sendAnnotationEvent('select', null);
  editorState.reset();
};

const createAnnotation = (annotationType: string) => {
  closeNextClick.value = true;
  sendAnnotationEvent('create', {
    type: annotationType,
    source: properties.source,
    parentAnnotation: properties.annotation,
  });
};

const addActions = (definition: AnnotationDefinition) => {
  const actions = definition.allowedChildren;

  if (actions.length === 0) return null;

  if (actions.length === 1) {
    const action = actions[0];
    return {
      icon: IconEnum.Plus,
      disabled: editorState.disableEdits,
      label: `Add ${action.label}`,
      action: () => createAnnotation(action.key),
    };
  }

  return {
    icon: IconEnum.Plus,
    label: 'Add',
    disabled: editorState.disableEdits,
    children: actions.map((action) => ({
      label: action.label,
      action: () => createAnnotation(action.key),
    })),
  };
};

const createActionLinks = (definition: AnnotationDefinition) => {
  return definition.allowedLinks.map((link) => ({
    icon: link.icon ?? IconEnum.Link,
    label: `Add ${link.label}`,
    disabled: editorState.disableEdits,
    action: () => {
      sendAnnotationEvent('link', { link });
    },
  }));
};

const actions = computed(() => {
  const definition = annotationDef.value!;
  return [
    addActions(definition),
    {
      icon: IconEnum.Edit,
      label: 'Edit',
      disabled: editorState.disableEdits,
      action: () => {
        closeNextClick.value = true;
        sendAnnotationEvent('edit', {
          annotation: properties.annotation!,
          source: properties.source!,
        });
      },
    },
    createActionLinks(definition),
    {
      icon: IconEnum.Delete,
      label: 'Delete',
      disabled: editorState.disableEdits,
      action: () => {
        sendAnnotationEvent('delete', { annotation: properties.annotation! });
      },
    },
  ]
    .filter((i) => !!i)
    .flat() as NavbarAction[];
});

const cardRef = ref<HTMLElement>();

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

const closeNextClick = ref(true);
watch(
  () => properties.annotation,
  () => {
    closeNextClick.value = true;
  },
);

function handleOutsideClick(e: MouseEvent) {
  if (editorState.disableEdits) return;

  if (closeNextClick.value) {
    closeNextClick.value = false;
    return;
  }

  if (cardRef.value && !cardRef.value.contains(e.target as Node)) {
    close();
  }
}
</script>
