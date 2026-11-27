<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <button
      class="rounded-lg border p-3 text-left hover:bg-base-200 transition-colors"
      :class="defsOk ? 'border-success/40 bg-success/5' : 'border-error/40 bg-error/5'"
      @click="emit('filter-change', 'all')"
    >
      <div class="text-xs text-base-content/60 mb-1">
        Definitions
      </div>
      <div
        class="font-semibold"
        :class="defsOk ? 'text-success' : 'text-error'"
      >
        {{ valid }}/{{ total }}
      </div>
      <div class="text-xs text-base-content/60">
        valid
      </div>
    </button>

    <button
      class="rounded-lg border p-3 text-left hover:bg-base-200 transition-colors"
      :class="errors > 0 ? 'border-error/40 bg-error/5' : 'border-base-300'"
      @click="emit('filter-change', 'errors')"
    >
      <div class="text-xs text-base-content/60 mb-1">
        Load errors
      </div>
      <div
        class="font-semibold"
        :class="errors > 0 ? 'text-error' : 'text-base-content'"
      >
        {{ errors }}
      </div>
      <div class="text-xs text-base-content/60">
        total
      </div>
    </button>

    <div class="rounded-lg border border-base-300 p-3">
      <div class="text-xs text-base-content/60 mb-1">
        Root types
      </div>
      <div class="font-semibold text-base-content">
        {{ roots }}
      </div>
      <div class="text-xs text-base-content/60">
        of {{ valid }}
      </div>
    </div>

    <div class="rounded-lg border border-base-300 p-3">
      <div class="text-xs text-base-content/60 mb-1">
        Relations
      </div>
      <div class="font-semibold text-base-content">
        ↳ {{ children }} · ↔ {{ links }}
      </div>
      <div class="text-xs text-base-content/60">
        children · links
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import {
  StatusStatTilesEmits,
  StatusStatTilesProperties,
} from './StatusStatTiles.properties';

const props = defineProps(StatusStatTilesProperties);
const emit = defineEmits(StatusStatTilesEmits);

const defs = computed(() => props.status.definitions);
const valid = computed(() => defs.value.length);
const errors = computed(() => props.status.loadErrors.length);
const total = computed(() => valid.value + errors.value);
const defsOk = computed(() => errors.value === 0 && !props.status.error);
const roots = computed(
  () => defs.value.filter((d) => d.annotation?.isRoot).length,
);
const children = computed(() =>
  defs.value.reduce((sum, d) => sum + d.allowedChildren.length, 0),
);
const links = computed(() =>
  defs.value.reduce((sum, d) => sum + d.allowedLinks.length, 0),
);
</script>
