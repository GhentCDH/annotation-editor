<template>
  <Collapse title="Annotation filter">
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs text-base-content/50">
        {{ selectedLabel }} of {{ items.length }} items
      </span>
      <div class="flex gap-1">
        <button
          class="btn btn-ghost btn-xs"
          type="button"
          tabindex="-1"
          @click="selectAll"
        >
          All
        </button>
        <button
          class="btn btn-ghost btn-xs"
          type="button"
          tabindex="-1"
          @click="selectNone"
        >
          None
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <label
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-base-200"
        :class="{ 'bg-base-200/60': isSelected(item.id) }"
      >
        <input
          type="checkbox"
          class="checkbox checkbox-sm"
          :checked="isSelected(item.id)"
          @change="toggleItem(item.id, ($event.target as HTMLInputElement).checked)"
        >
        <span
          v-if="item.color"
          class="w-3 h-3 rounded-full shrink-0 ring-1 ring-black/10"
          :style="{ backgroundColor: item.color }"
        />
        <span class="text-sm flex-1 select-none break-words min-w-0">{{ item.label }}</span>
        <span
          v-if="item.count > 0"
          class="badge badge-sm badge-ghost"
        >
          {{ item.count }}
        </span>
        <button
          v-if="hasItemClick"
          type="button"
          class="btn btn-ghost btn-xs btn-circle shrink-0"
          @click.prevent.stop="emit('annotationtype-click', item)"
        >
          <Icon
            :icon="IconEnum.ChevronRight"
            class="w-3 h-3"
          />
        </button>
      </label>
    </div>
  </Collapse>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, type PropType } from 'vue';
import { Collapse, Icon, IconEnum } from '@ghentcdh/crouton-vue';
import { useAnnotationDefinitions } from '../definitions/useAnnotationDefinitions';

const emit = defineEmits(['update:modelValue', 'annotationtype-click']);
const model = defineModel<string[]>({ default: () => [] });
const props = defineProps({
  count: {
    type: Object as PropType<Record<string, any[]>>,
    default: undefined,
  },
});

const annotationDefinitions = useAnnotationDefinitions();
const hasItemClick = !!getCurrentInstance()?.vnode.props?.['onAnnotationtypeClick'];

const items = computed(() =>
  annotationDefinitions.definitions.map((def) => ({
    id: def.id,
    label: def.label,
    color: def.style?.default?.backgroundColor,
    count: props.count?.[def.id]?.length ?? 0,
  })),
);

const isSelected = (id: string) => model.value.includes(id);

const selectedLabel = computed(() => {
  const count = model.value.length;
  if (count === 0) return 'None';
  if (count === items.value.length) return 'All';
  return `${count}`;
});

const selectAll = () => emit('update:modelValue', items.value.map((i) => i.id));
const selectNone = () => emit('update:modelValue', []);

const toggleItem = (id: string, checked: boolean) => {
  if (checked) {
    emit('update:modelValue', [...model.value, id]);
  } else {
    emit('update:modelValue', model.value.filter((v) => v !== id));
  }
};
</script>
