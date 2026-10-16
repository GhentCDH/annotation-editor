<template>
  <table class="border border-gray-300 table table-zebra table-sm">
    <tbody>
      <tr v-for="link in links" :key="link.annotation.id">
        <th>{{ link.definition.label }}</th>
        <td class="max-w-[300px]">
          <AnnotationText :annotation="link.relation" :max-characters="25" />
        </td>
        <td>
          <Navbar :actions="actions(link)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconEnum } from '@ghentcdh/crouton-vue';
import {
  type EditorAnnotation,
  type UIAnnotationDefinition,
} from '@ghentcdh/annotation-ui';
import AnnotationText from './Annotation-text.vue';
import Navbar from '../../components/navbar.vue';
import { type NavbarAction } from '../../components/navbar.properties';
import { useEditorState } from '../../composables/useEditorState';

const props = defineProps<{ annotation: EditorAnnotation }>();

const { editorState, sendAnnotationEvent, findAnnotation, getDefinition } =
  useEditorState();

type LinkDisplay = {
  definition: UIAnnotationDefinition;
  annotation: EditorAnnotation;
  relation: EditorAnnotation;
};

const links = computed<LinkDisplay[]>(() => {
  return props.annotation.links.flatMap((l) => {
    const link = findAnnotation(l.uri);
    if (!link) return [];
    const annotationId = link.links.find(
      (li) => li.uri !== props.annotation.id,
    )?.uri;
    const relation = findAnnotation(annotationId);
    if (!relation) return [];

    return [
      {
        id: link.id,
        definition: getDefinition(link.definitionUri),
        annotation: link,
        relation,
      },
    ];
  });
});

const actions = (link: LinkDisplay): NavbarAction[] => {
  if (editorState.readonly) return [];

  return [
    link.definition.canEdit
      ? {
          icon: IconEnum.Edit,
          label: 'Edit',
          disabled: editorState.disableEdits,
          action: () => {
            sendAnnotationEvent('edit', {
              annotation: link.annotation,
              definition: link.definition,
            });
          },
        }
      : null,
    link.definition.canDelete
      ? {
          icon: IconEnum.Delete,
          label: 'Delete',
          disabled: editorState.disableEdits,
          action: () => {
            sendAnnotationEvent('delete', {
              annotation: link.annotation,
              definition: link.definition,
            });
          },
        }
      : null,
  ].filter((x): x is NavbarAction => x !== null);
};
</script>
