<template>
  <div
    ref="cardRef"
    class="card bg-base-100 shadow-xl absolute z-50"
    :style="{
      left: `${properties.position.x}px`,
      top: `${properties.position.y}px`,
    }"
  >
    <div class="card-body p-2">
      <div class="flex items-center justify-between gap-2">
        <div><strong>Type:</strong> {{ purposeLabel }}</div>
      </div>
      <Metadata
        v-if="annotationDef"
        :data="metadata"
        :definition="annotationDef"
      />
      <LinksDetail :annotation="properties.annotation" />
      <template v-if="!editorState.readonly">
        <Alert
          v-if="editorState.info"
          type="info"
          :message="'Action: ' + editorState.info.short"
        />
        <Navbar :actions="actions" />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Alert, IconEnum } from '@ghentcdh/ui';
import { type UIAnnotationDefinition } from '@ghentcdh/annotation-ui';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { AnnotationInfoCardProperties } from './AnnotationInfoCard.properties';
import LinksDetail from './LinksDetail.vue';
import { useEditorState } from '../../composables/useEditorState';
import Navbar from '../../components/navbar.vue';
import { type NavbarAction } from '../../components/navbar.properties';
import { default as Metadata } from './Metadata.vue';

const properties = defineProps(AnnotationInfoCardProperties);

const { editorState, sendAnnotationEvent } = useEditorState();

const annotationDef = computed(() => properties.annotation.definition);
const purposeLabel = computed(() => annotationDef.value?.label);
const metadata = computed(() => properties.annotation?.metadata);

// Outside-click handling (inlined from AnnotationInfoCardBase)
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

const close = () => {
  sendAnnotationEvent('select', null);
  editorState.reset();
};

const createAnnotation = (annotationType: string) => {
  skipNextClose();
  sendAnnotationEvent('create', {
    type: annotationType,
    source: properties.source,
    parentAnnotation: properties.annotation,
  });
};

const addActions = (definition: UIAnnotationDefinition) => {
  const actions = definition?.allowedChildren ?? [];

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

const createActionLinks = (definition: UIAnnotationDefinition) => {
  return definition?.allowedLinks.map((link) => ({
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
        skipNextClose();
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
        sendAnnotationEvent('delete', {
          annotation: properties.annotation!,
          definition: definition,
        });
      },
    },
  ]
    .filter((i) => !!i)
    .flat() as NavbarAction[];
});
</script>
