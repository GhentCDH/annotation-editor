<template>
  <AnnotationInfoCardBase
    ref="baseRef"
    v-bind="$props"
    :config="config.annotation"
    :utils="utils"
    :disable-close="editorState.disableEdits"
    @close="close"
  >
    <template #links="{ annotation }">
      <LinksDetail :annotation="annotation" />
    </template>
    <template #actions>
      <Alert
        v-if="editorState.info"
        type="info"
        :message="'Action: ' + editorState.info.short"
      />
      <Navbar :actions="actions" />
    </template>
  </AnnotationInfoCardBase>
</template>
<script lang="ts" setup>
import { Alert, IconEnum } from '@ghentcdh/ui';
import { AnnotationInfoCardBase } from '@ghentcdh/annotation-ui';
import { computed, ref } from 'vue';
import { AnnotationInfoCardProperties } from './AnnotationInfoCard.properties';
import LinksDetail from './LinksDetail.vue';
import { useEditorState } from '../../composables/useEditorState';
import Navbar from '../../components/navbar.vue';
import { type AnnotationDefinition } from '../../types/AnnotationConfiguration.model';
import { type NavbarAction } from '../../components/navbar.properties';

const properties = defineProps(AnnotationInfoCardProperties);

const baseRef = ref<InstanceType<typeof AnnotationInfoCardBase>>();
const { config, editorState, sendAnnotationEvent, utils } = useEditorState();

const purpose = computed(() => {
  if (!properties.annotation) return 'default';
  return utils.getAnnotationType(properties.annotation);
});

const annotationDef = computed(() =>
  config.annotation.getDefinition(purpose.value),
);

const close = () => {
  sendAnnotationEvent('select', null);
  editorState.reset();
};

const createAnnotation = (annotationType: string) => {
  baseRef.value?.skipNextClose();
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
        baseRef.value?.skipNextClose();
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
</script>
