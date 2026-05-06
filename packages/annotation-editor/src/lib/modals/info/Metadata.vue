<template>
  <table class="border border-gray-300 table table-zebra table-sm">
    <tbody>
      <tr
        v-for="key in keys"
        :key="key.id"
      >
        <th>{{ key.label }}</th>
        <td>
          <TextCell
            :column="key"
            :data="data"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import { type ColumnDef, findColumnDef, type JsonFormsLayout, type TextCellType } from '@ghentcdh/json-forms-core';
import { TextCell } from '@ghentcdh/ui';
import { type UISchemaElement } from '@jsonforms/core';

const properties = defineProps<{
  data: any;
  schema: JsonFormsLayout;
  uiSchema: UISchemaElement;
}>();

const keys = computed(() => {
  const { schema, uiSchema } = properties;

  return (uiSchema as any).elements.map((e: any) => {
    const element = e as TextCellType;
    const def = findColumnDef(element, schema);

    return {
      ...def,
    } as ColumnDef & { component: any };
  });
});
</script>
