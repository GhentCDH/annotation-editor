<template>
  <table
    v-if="links.length"
    class="border border-gray-300 table table-zebra table-sm"
  >
    <tbody>
      <tr
        v-for="link in links"
        :key="link.annotation.id"
      >
        <th>{{ link.purpose }}</th>
        <td class="max-w-[300px]">
          <AnnotationTextCell
            :annotation="link.relation"
            :sources="sourcesArray"
            :max-characters="25"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { AnnotationTextCell, type AnnotationLink } from '@ghentcdh/annotation-ui';
import { usePreviewState } from '../composables/usePreviewState';

const props = defineProps<{ annotation: W3CAnnotation }>();

const { config, utils, sources } = usePreviewState();

// sources is a ComputedRef<Readonly<SourceModel[]>> — unwrap for the child prop
const sourcesArray = computed(() => sources.value as any[]);

type LinkDisplay = {
  purpose: string | undefined;
  annotation: W3CAnnotation;
  relation: W3CAnnotation;
};

const links = computed<LinkDisplay[]>(() => {
  return utils
    .getLinks(props.annotation)
    .map((link: AnnotationLink) => {
      const relation = link.relations.find((r) => r.id !== props.annotation.id);
      const def = config.annotation.getDefinition(link.purpose);
      return { purpose: def?.label, annotation: link.annotation, relation };
    })
    .filter((link): link is LinkDisplay => !!link.relation);
});
</script>
