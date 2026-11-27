<template>
  <div
    class="rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center gap-3"
    :class="classes.header"
  >
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <span
        class="inline-block w-3 h-3 rounded-full shrink-0"
        :class="classes.dot"
      />
      <span class="font-semibold text-base-content truncate">Annotation definitions</span>
      <div
        v-if="loadedCount !== undefined"
        class="flex gap-1 flex-wrap ml-2"
      >
        <span class="rounded bg-base-200 px-2 py-0.5 text-xs font-mono text-base-content">
          {{ loadedCount }} loaded
        </span>
      </div>
    </div>
    <div class="flex items-center gap-3 text-sm text-base-content shrink-0">
      <span
        v-if="errorCount > 0"
        class="text-error font-medium"
      >
        {{ errorCount }} error{{ errorCount !== 1 ? 's' : '' }}
      </span>
      <span
        v-if="loading"
        class="text-warning font-medium"
      >loading…</span>
      <span
        v-if="lastChecked"
        class="text-base-content/60 text-xs"
      >
        checked {{ lastChecked.toLocaleTimeString() }}
      </span>
      <button
        class="rounded border border-base-300 p-1 hover:bg-base-200 transition-colors"
        :class="{ 'opacity-50': loading }"
        :disabled="loading"
        title="Refresh"
        @click="emit('refresh')"
      >
        <svg
          class="w-4 h-4"
          :class="{ 'animate-spin': loading }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { stateClasses } from '../status.utils';
import {
  StatusHeaderEmits,
  StatusHeaderProperties,
} from './StatusHeader.properties';

const props = defineProps(StatusHeaderProperties);
const emit = defineEmits(StatusHeaderEmits);

const headerClasses = {
  error: 'border-error/40 bg-error/5',
  warning: 'border-warning/40 bg-warning/5',
  ok: 'border-success/40 bg-success/5',
} as const;

const classes = computed(() => ({
  dot: stateClasses[props.state].dot,
  header: headerClasses[props.state],
}));
</script>
