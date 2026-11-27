<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <!-- No state: full-width card, rest of page hidden (same as crouton "backend unreachable") -->
    <div
      v-if="!state"
      class="rounded-lg border border-base-300 bg-base-200 p-6 text-center space-y-3"
    >
      <p class="font-semibold text-base-content text-lg">
        No definitions loaded yet
      </p>
      <p class="text-sm text-base-content/70">
        Open a text in the editor first.
      </p>
      <button
        class="rounded bg-primary px-4 py-2 text-sm text-primary-content hover:opacity-90"
        @click="refresh"
      >
        Retry
      </button>
    </div>

    <template v-else>
      <StatusHeader
        :state="worstState(state)"
        :loaded-count="state.definitions.length"
        :error-count="errorCount(state)"
        :loading="state.loading"
        :last-checked="lastChecked"
        @refresh="refresh"
      />

      <StatusStatTiles
        :status="state"
        @filter-change="onFilterChange"
      />

      <StatusIssuesPanel
        :issues="issues"
        @anchor-click="scrollTo"
      />

      <StatusDefinitionList :rows="rows" />

      <StatusRawJson :value="rawStatus" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { peekAnnotationDefinitionsState } from '../definitions/useAnnotationDefinitions';
import StatusDefinitionList from './components/StatusDefinitionList.vue';
import StatusHeader from './components/StatusHeader.vue';
import StatusIssuesPanel from './components/StatusIssuesPanel.vue';
import StatusRawJson from './components/StatusRawJson.vue';
import StatusStatTiles from './components/StatusStatTiles.vue';
import {
  type StatusFilter,
  buildRows,
  collectIssues,
  compiledDefinition,
  errorCount,
  worstState,
} from './status.utils';

const router = useRouter();

const tick = ref(0);
const lastChecked = ref<Date | null>(null);

const state = computed(() => {
  tick.value;
  return peekAnnotationDefinitionsState();
});

const rows = computed(() => buildRows(state.value));
const issues = computed(() => collectIssues(state.value));
const rawStatus = computed(() => {
  const s = state.value;
  if (!s) return null;
  return {
    loading: s.loading,
    error: s.error?.message ?? null,
    definitions: s.definitions.map(compiledDefinition),
    loadErrors: s.loadErrors,
    rawJsonMap: s.rawJsonMap,
  };
});

const refresh = () => {
  tick.value++;
  lastChecked.value = new Date();
};

const onFilterChange = (filter: StatusFilter) => {
  router.replace({
    query: {
      ...router.currentRoute.value.query,
      filter: filter === 'all' ? undefined : filter,
    },
  });
  scrollTo('definitions');
};

const scrollTo = (anchor: string) => {
  document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(refresh);
</script>
