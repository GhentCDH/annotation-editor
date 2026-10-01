<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <div
      class="rounded-lg border p-4 flex flex-col sm:flex-row sm:items-center gap-3"
      :class="headerClass"
    >
      <div class="flex items-center gap-2 flex-1">
        <span
          class="inline-block w-3 h-3 rounded-full shrink-0"
          :class="dotClass"
        />
        <span class="font-semibold text-base-content">Annotation definitions</span>
        <span
          v-if="state"
          class="rounded bg-base-200 px-2 py-0.5 text-xs font-mono text-base-content ml-2"
        >
          {{ state.definitions.length }} loaded
        </span>
        <span
          v-if="state?.loadErrors.length"
          class="rounded bg-error/10 text-error border border-error/40 px-2 py-0.5 text-xs ml-1"
        >
          {{ state.loadErrors.length }} error{{
            state.loadErrors.length !== 1 ? 's' : ''
          }}
        </span>
        <span
          v-if="state?.loading"
          class="text-xs text-base-content/60 ml-1"
        >Loading…</span>
      </div>
      <button
        v-if="state"
        class="rounded border border-base-300 p-1 hover:bg-base-200 transition-colors"
        title="Refresh"
        @click="forceRefresh"
      >
        <svg
          class="w-4 h-4"
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

    <!-- No state -->
    <div
      v-if="!state"
      class="rounded-lg border border-base-300 bg-base-200 p-6 text-center text-base-content/60 text-sm"
    >
      No definitions loaded yet. Open a text in the editor first.
    </div>

    <template v-else>
      <!-- Global fetch error -->
      <div
        v-if="state.error"
        class="rounded-lg border border-error/40 bg-error/5 p-4 text-sm text-error font-mono"
      >
        {{ state.error.message }}
      </div>

      <!-- Per-definition parse errors -->
      <section v-if="state.loadErrors.length">
        <h2 class="text-lg font-semibold mb-2 text-error">
          Failed to load
        </h2>
        <ul class="space-y-3">
          <li
            v-for="(err, i) in state.loadErrors"
            :key="i"
            class="rounded-lg border border-error/40 bg-error/5 p-4 space-y-2"
          >
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-error">{{
                err.name ?? err.id ?? 'Unknown'
              }}</span>
              <span
                v-if="err.id"
                class="text-xs font-mono text-base-content/50"
              >{{ err.id }}</span>
            </div>
            <p
              class="text-xs font-mono text-error bg-error/10 rounded p-2 whitespace-pre-wrap"
            >
              {{ err.error }}
            </p>
            <details v-if="err.raw">
              <summary
                class="text-xs text-base-content/60 cursor-pointer hover:text-base-content"
              >
                Raw JSON
              </summary>
              <pre
                class="mt-2 text-xs bg-base-200 rounded p-3 overflow-x-auto"
              >{{ JSON.stringify(err.raw, null, 2) }}</pre>
            </details>
          </li>
        </ul>
      </section>

      <!-- Valid definitions -->
      <section v-if="state.definitions.length">
        <h2 class="text-lg font-semibold mb-2 text-base-content">
          Definitions
        </h2>
        <ul
          class="rounded-lg border border-base-300 divide-y divide-base-300 overflow-hidden"
        >
          <li
            v-for="def in state.definitions"
            :key="def.id"
          >
            <button
              class="w-full flex items-start gap-3 p-3 text-left hover:bg-base-200 transition-colors"
              @click="toggle(def.id)"
            >
              <span
                class="inline-block w-3 h-3 rounded-full mt-1 shrink-0"
                :style="
                  def.annotation?.color
                    ? { background: def.annotation.color }
                    : {}
                "
                :class="!def.annotation?.color ? 'bg-base-300' : ''"
              />
              <div class="flex-1 min-w-0">
                <div class="font-medium text-base-content text-sm">
                  {{ def.name }}
                </div>
                <div class="text-xs text-base-content/50 font-mono mt-0.5">
                  {{ def.id }}
                </div>
                <div class="text-xs text-base-content/60 mt-1 space-x-2">
                  <span>{{ def.annotation.isRoot ? 'Root' : 'child' }}</span>
                  <span v-if="def.allowedChildren.length">↳ {{ def.allowedChildren.length }} children</span>
                  <span v-if="def.allowedLinks.length">↔ {{ def.allowedLinks.length }} links</span>
                </div>
              </div>
              <div class="flex gap-1 flex-wrap justify-end">
                <span
                  v-if="def.canCreate"
                  class="text-xs px-2 py-0.5 rounded border text-success border-success/40 bg-success/10"
                >create</span>
                <span
                  v-if="def.canEdit"
                  class="text-xs px-2 py-0.5 rounded border text-info border-info/40 bg-info/10"
                >edit</span>
                <span
                  v-if="def.canDelete"
                  class="text-xs px-2 py-0.5 rounded border text-error border-error/40 bg-error/10"
                >delete</span>
                <span class="text-xs text-base-content/40">{{
                  expanded.has(def.id) ? '▲' : '▼'
                }}</span>
              </div>
            </button>

            <div
              v-if="expanded.has(def.id)"
              class="border-t border-base-300 bg-base-100 p-4 space-y-4"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div
                    class="text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-1"
                  >
                    Resource JSON (raw)
                  </div>
                  <pre
                    class="text-xs bg-base-200 rounded p-3 overflow-x-auto max-h-96"
                  >{{ rawJson(def.id) }}</pre>
                </div>
                <div>
                  <div
                    class="text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-1"
                  >
                    Compiled definition
                  </div>
                  <pre
                    class="text-xs bg-base-200 rounded p-3 overflow-x-auto max-h-96"
                  >{{ compiledJson(def) }}</pre>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <div
        v-if="
          state.definitions.length === 0 &&
            !state.loadErrors.length &&
            !state.loading
        "
        class="rounded-lg border border-base-300 bg-base-200 p-4 text-sm text-base-content/60"
      >
        No definitions loaded.
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { type UIAnnotationDefinition } from '@ghentcdh/annotation-ui';
import { peekAnnotationDefinitionsState } from '../definitions/useAnnotationDefinitions';

const tick = ref(0);
const expanded = ref<Set<string>>(new Set());

const state = computed(() => {
  tick.value;
  return peekAnnotationDefinitionsState();
});

const dotClass = computed(() => {
  if (!state.value) return 'bg-base-300';
  if (state.value.error) return 'bg-error';
  if (state.value.loadErrors.length) return 'bg-warning';
  if (state.value.loading) return 'bg-warning';
  return 'bg-success';
});

const headerClass = computed(() => {
  if (!state.value) return 'border-base-300 bg-base-200/50';
  if (state.value.error || state.value.loadErrors.length)
    return 'border-error/40 bg-error/5';
  if (state.value.loading) return 'border-warning/40 bg-warning/5';
  return 'border-success/40 bg-success/5';
});

const toggle = (id: string) => {
  const next = new Set(expanded.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expanded.value = next;
};

const rawJson = (id: string): string => {
  const raw = state.value?.rawJsonMap[id];
  return raw ? JSON.stringify(raw, null, 2) : '(not available)';
};

const compiledJson = (def: UIAnnotationDefinition): string => {
  const { resource: _r, style: _s, ...rest } = def as any;
  return JSON.stringify(rest, null, 2);
};

const forceRefresh = () => {
  tick.value++;
};
</script>
