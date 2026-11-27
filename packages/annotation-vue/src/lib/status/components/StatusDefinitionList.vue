<template>
  <section id="definitions">
    <h2 class="text-lg font-semibold mb-2 text-base-content">
      Definitions
    </h2>

    <!-- filter + search bar -->
    <div class="flex flex-wrap gap-2 mb-3">
      <div class="flex rounded-lg border border-base-300 overflow-hidden text-sm">
        <button
          v-for="f in filters"
          :key="f.value"
          class="px-3 py-1.5 transition-colors"
          :class="currentFilter === f.value
            ? 'bg-primary text-primary-content'
            : 'hover:bg-base-200 text-base-content'"
          @click="setFilter(f.value)"
        >
          {{ f.label }}
        </button>
      </div>
      <input
        type="search"
        class="flex-1 min-w-32 rounded-lg border border-base-300 px-3 py-1.5 text-sm bg-base-100 text-base-content placeholder:text-base-content/40 focus:outline-none focus:border-primary"
        placeholder="Search…"
        :value="currentSearch"
        @input="setSearch(($event.target as HTMLInputElement).value)"
      >
    </div>

    <p
      v-if="filtered.length === 0"
      class="text-sm text-base-content/60"
    >
      No definitions match.
    </p>
    <div class="space-y-2">
      <StatusDefinitionRow
        v-for="row in filtered"
        :key="row.key"
        :row="row"
        :expanded="expanded.has(row.key)"
        @toggle="toggle(row.key)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { type StatusFilter, filterRows } from '../status.utils';
import { StatusDefinitionListProperties } from './StatusDefinitionList.properties';
import StatusDefinitionRow from './StatusDefinitionRow.vue';

const props = defineProps(StatusDefinitionListProperties);

const route = useRoute();
const router = useRouter();

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'errors', label: 'Errors' },
];

const currentFilter = computed<StatusFilter>(() =>
  route.query['filter'] === 'errors' ? 'errors' : 'all',
);
const currentSearch = computed(() => (route.query['q'] as string) || '');

const setFilter = (f: StatusFilter) => {
  router.replace({ query: { ...route.query, filter: f === 'all' ? undefined : f } });
};

const setSearch = (q: string) => {
  router.replace({ query: { ...route.query, q: q || undefined } });
};

const filtered = computed(() =>
  filterRows(props.rows, currentFilter.value, currentSearch.value),
);

// auto-expand error rows
const expanded = ref<Set<string>>(new Set());
watch(
  () => props.rows,
  (rows) => {
    const next = new Set(expanded.value);
    for (const r of rows) if (r.state === 'error') next.add(r.key);
    expanded.value = next;
  },
  { immediate: true },
);

const toggle = (key: string) => {
  const next = new Set(expanded.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  expanded.value = next;
};
</script>
