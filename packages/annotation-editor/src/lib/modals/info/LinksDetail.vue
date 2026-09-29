<template>
  <table class="border border-gray-300 table table-zebra table-sm">
    <tbody>
      <tr
        v-for="link in links"
        :key="link.annotation.id"
      >
        <th>{{ link.definition.label }}</th>
        <td class="max-w-[300px]">
          <AnnotationText
            :annotation="link.relation"
            :max-characters="25"
          />
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
import { IconEnum } from '@ghentcdh/ui';
import {
  type EditorAnnotation,
  type UIAnnotationDefinition,
} from '@ghentcdh/annotation-ui';
import AnnotationText from './Annotation-text.vue';
import Navbar from '../../components/navbar.vue';
import { useEditorState } from '../../composables/useEditorState';

const props = defineProps<{ annotation: EditorAnnotation }>();

const { editorState, sendAnnotationEvent, findAnnotation } = useEditorState();

type LinkDisplay = {
  definition: UIAnnotationDefinition;
  annotation: EditorAnnotation;
  relation: EditorAnnotation;
};

const links = computed<LinkDisplay[]>(() => {
  const _links = props.annotation.links.map((l) => {
    const link = findAnnotation(l.uri);
    const annotationId = link.links.find(
      (li) => li.uri !== props.annotation.id,
    )?.uri;
    const relation = findAnnotation(annotationId);

    return {
      definition: link.definition,
      annotation: link,
      relation,
    };
  });

  return _links;
});

const actions = (link: LinkDisplay) => {
  if (!link.definition.operations.delete) return [];

  return [
    {
      icon: IconEnum.Edit,
      label: 'Edit',
      disabled: editorState.disableEdits,
      action: () => {
        sendAnnotationEvent('edit', {
          annotation: link.annotation,
        });
      },
    },
    {
      icon: IconEnum.Delete,
      label: 'Delete',
      disabled: editorState.disableEdits,
      action: () => {
        sendAnnotationEvent('delete', {
          annotation: link.annotation,
        });
      },
    },
  ];
};
</script>
