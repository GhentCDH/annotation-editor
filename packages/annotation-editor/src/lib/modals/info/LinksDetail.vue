<template>
  <table class="border border-gray-300 table table-zebra table-sm">
    <tbody>
      <tr v-for="link in links" :key="link.annotation.id">
        <th>{{ link.name }}</th>
        <td class="max-w-[300px]">
          <AnnotationText :annotation="link.relation" :max-characters="25" />
        </td>
        <td>
          <Navbar :actions="actions(link as any)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconEnum } from '@ghentcdh/ui';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type AnnotationLink } from '@ghentcdh/annotation-ui';
import AnnotationText from './Annotation-text.vue';
import Navbar from '../../components/navbar.vue';
import { useEditorState } from '../../composables/useEditorState';

const props = defineProps<{ annotation: W3CAnnotation }>();

const { config, editorState, sendAnnotationEvent } = useEditorState();

type LinkDisplay = {
  purpose: string | undefined;
  annotation: W3CAnnotation;
  relation: W3CAnnotation;
};

const links = computed<LinkDisplay[]>(() => {
  return config.annotation.links
    ?.map((link: AnnotationLink) => {
      const relation = link.relations.find((r) => r.id !== props.annotation.id);
      const def = link.definition;
      return {
        purpose: def?.id,
        label: def?.label ?? def?.name,
        annotation: link.annotation,
        relation,
      };
    })
    .filter((link): link is LinkDisplay => !!link.relation);
});

const actions = (link: AnnotationLink) => {
  const definition = config.annotation.definition;
  return [
    {
      icon: IconEnum.Delete,
      label: 'Delete',
      disabled: editorState.disableEdits,
      action: () => {
        sendAnnotationEvent('delete', {
          annotation: link.annotation,
          definition,
        });
      },
    },
  ];
};
</script>
