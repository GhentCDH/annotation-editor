<template>
  <div
    ref="cardRef"
    class="card bg-base-100 shadow-xl absolute z-50"
    :style="{
      left: `${adjustedX}px`,
      top: `${adjustedY}px`,
      maxHeight: `calc(100vh - ${adjustedY}px - 16px)`,
      minHeight: '100px',
      minWidth: '320px',
    }"
  >
    <div class="card-body p-2 overflow-y-auto">
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
import { Alert, IconEnum } from '@ghentcdh/crouton-vue';
import { type UIAnnotationDefinition } from '@ghentcdh/annotation-ui';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { AnnotationInfoCardProperties } from './AnnotationInfoCard.properties';
import LinksDetail from './LinksDetail.vue';
import { default as Metadata } from './Metadata.vue';
import { useEditorState } from '../../composables/useEditorState';
import Navbar from '../../components/navbar.vue';
import { type NavbarAction } from '../../components/navbar.properties';
import { getAnnotationElementCenter } from '../../utils/mouse-events';

const properties = defineProps(AnnotationInfoCardProperties);

const { editorState, sendAnnotationEvent, getDefinition } = useEditorState();

const annotationDef = computed(() =>
  getDefinition(properties.annotation.definitionUri),
);
const purposeLabel = computed(() => annotationDef.value?.label);
const metadata = computed(() => properties.annotation?.metadata);

// Outside-click handling (inlined from AnnotationInfoCardBase)
const cardRef = ref<HTMLElement>();
const adjustedX = ref(properties.position.x);
const adjustedY = ref(properties.position.y);

const clampX = (x: number, parent: HTMLElement) => {
  const margin = 8;
  const maxLeft = parent.clientWidth - (cardRef.value?.offsetWidth ?? 0) - margin;
  adjustedX.value = Math.max(margin, Math.min(x, maxLeft));
};

const applyPosition = async (x: number, y: number) => {
  await nextTick();
  if (!cardRef.value) return;
  const parent = cardRef.value.offsetParent as HTMLElement;
  if (!parent) return;
  adjustedY.value = y;
  clampX(x, parent);
};

const recalcPosition = async () => {
  if (!cardRef.value) return;
  const parent = cardRef.value.offsetParent as HTMLElement;
  if (!parent) return;
  const pos = getAnnotationElementCenter(parent, String(properties.annotation.id));
  if (pos) {
    await applyPosition(pos.x, pos.y);
  }
};

watch(
  () => properties.position,
  (pos) => applyPosition(pos.x, pos.y),
  { immediate: true },
);
const closeNextClick = ref(true);

watch(
  () => properties.annotation,
  () => {
    closeNextClick.value = true;
  },
);

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  window.addEventListener('resize', recalcPosition);
});
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
  window.removeEventListener('resize', recalcPosition);
});

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
    definitionUri: annotationType,
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
      sendAnnotationEvent('link', { link, definition });
    },
  }));
};

const actions = computed(() => {
  const definition = annotationDef.value;
  if (!definition) return [];

  return [
    addActions(definition),
    definition.canEdit
      ? {
          icon: IconEnum.Edit,
          label: 'Edit',
          disabled: editorState.disableEdits,
          action: () => {
            skipNextClose();
            sendAnnotationEvent('edit', {
              annotation: properties.annotation!,
              definition: annotationDef.value,
              source: properties.source!,
            });
          },
        }
      : null,
    createActionLinks(definition),
    definition.canDelete
      ? {
          icon: IconEnum.Delete,
          label: 'Delete',
          disabled: editorState.disableEdits,
          action: () => {
            sendAnnotationEvent('delete', {
              annotation: properties.annotation!,
              definition: annotationDef.value,
            });
          },
        }
      : null,
  ]
    .filter((i) => !!i)
    .flat() as NavbarAction[];
});
</script>
