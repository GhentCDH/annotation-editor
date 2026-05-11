<template>
  <div
    ref="cardRef"
    class="card bg-base-100 shadow-xl fixed z-50"
    :style="{ left: `${clampedPosition.x}px`, top: `${clampedPosition.y}px` }"
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
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
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

const clampedPosition = ref({ x: 0, y: 0 });
const VIEWPORT_PADDING = 8;

const clampToViewport = (pos: { x: number; y: number }) => {
  if (!cardRef.value) return pos;

  const { width, height } = cardRef.value.getBoundingClientRect();
  const { innerWidth, innerHeight } = window;

  return {
    x: Math.max(
      VIEWPORT_PADDING,
      Math.min(pos.x, innerWidth - width - VIEWPORT_PADDING),
    ),
    y: Math.max(
      VIEWPORT_PADDING,
      Math.min(pos.y, innerHeight - height - VIEWPORT_PADDING),
    ),
  };
};

// Track scroll position at time of card open to compute deltas
const initialScrollPos = ref({ x: 0, y: 0 });
const anchorPosition = ref({ x: 0, y: 0 });

const getScrollContainer = () => {
  return cardRef.value?.closest('.overflow-auto, .overflow-y-auto, .overflow-scroll') ?? document.documentElement;
};

watch(
  () => properties.position,
  async (pos) => {
    anchorPosition.value = { ...pos };
    clampedPosition.value = { ...pos };

    await nextTick();

    const scrollEl = getScrollContainer();
    initialScrollPos.value = {
      x: scrollEl.scrollLeft,
      y: scrollEl.scrollTop,
    };

    clampedPosition.value = clampToViewport(pos);
  },
  { immediate: true },
);

const handleScroll = () => {
  const scrollEl = getScrollContainer();
  const deltaX = scrollEl.scrollLeft - initialScrollPos.value.x;
  const deltaY = scrollEl.scrollTop - initialScrollPos.value.y;

  const adjusted = {
    x: anchorPosition.value.x - deltaX,
    y: anchorPosition.value.y - deltaY,
  };

  clampedPosition.value = clampToViewport(adjusted);
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('scroll', handleScroll, true);
});
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('scroll', handleScroll, true);
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
