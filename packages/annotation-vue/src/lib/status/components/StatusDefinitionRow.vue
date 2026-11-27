<template>
  <div
    :id="row.anchor"
    class="rounded-lg border overflow-hidden"
    :class="classes.border"
  >
    <!-- collapsed header -->
    <button
      class="w-full flex items-center gap-3 p-3 hover:bg-base-200 transition-colors text-left"
      @click="emit('toggle')"
    >
      <span
        class="inline-block w-2.5 h-2.5 rounded-full shrink-0"
        :class="color ? '' : classes.dot"
        :style="color ? { background: color } : undefined"
      />
      <span class="font-medium text-base-content flex-1 truncate">{{ row.title }}</span>
      <template v-if="def">
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
        <span
          v-if="def.allowedChildren.length"
          class="text-xs px-1.5 py-0.5 rounded font-mono bg-base-200 text-base-content/60"
        >↳ {{ def.allowedChildren.length }}</span>
        <span
          v-if="def.allowedLinks.length"
          class="text-xs px-1.5 py-0.5 rounded font-mono bg-base-200 text-base-content/60"
        >↔ {{ def.allowedLinks.length }}</span>
      </template>
      <span
        class="text-xs px-2 py-0.5 rounded"
        :class="classes.badge"
      >
        {{ row.state }}
      </span>
      <svg
        class="w-4 h-4 text-base-content/60 shrink-0 transition-transform"
        :class="expanded ? 'rotate-180' : ''"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- expanded body -->
    <div
      v-if="expanded"
      class="border-t border-base-300 p-3 space-y-3 bg-base-100 text-sm"
    >
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-base-content/70">
        <template v-if="row.id">
          <span>Id</span><span class="font-mono text-base-content">{{ row.id }}</span>
        </template>
        <template v-if="def">
          <span>Name</span><span class="font-mono text-base-content">{{ def.name }}</span>
          <span>Kind</span><span>{{ def.annotation?.isRoot ? 'root' : 'child' }}</span>
          <template v-if="def.allowedChildren.length">
            <span>Children</span>
            <span>{{ def.allowedChildren.map((c) => c.label).join(', ') }}</span>
          </template>
          <template v-if="def.allowedLinks.length">
            <span>Links</span>
            <span>{{ def.allowedLinks.map((l) => l.label).join(', ') }}</span>
          </template>
        </template>
      </div>

      <div v-if="row.loadError">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-medium text-error">Error</span>
          <button
            class="text-xs text-primary hover:underline"
            @click="copyError"
          >
            copy
          </button>
        </div>
        <pre class="bg-base-200 rounded p-2 text-xs font-mono text-error overflow-x-auto whitespace-pre-wrap break-all">{{ row.loadError.error }}</pre>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div :class="def ? '' : 'md:col-span-2'">
          <div class="text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-1">
            Resource JSON (raw)
          </div>
          <pre class="text-xs bg-base-200 rounded p-3 overflow-x-auto max-h-96">{{ rawJson }}</pre>
        </div>
        <div v-if="def">
          <div class="text-xs font-semibold text-base-content/60 uppercase tracking-wide mb-1">
            Compiled definition
          </div>
          <pre class="text-xs bg-base-200 rounded p-3 overflow-x-auto max-h-96">{{ compiledJson }}</pre>
        </div>
      </div>

      <!-- preview tabs, same look as crouton StatusResourceDemoPreview -->
      <div
        v-if="def"
        class="border border-base-300 rounded-lg overflow-hidden"
      >
        <div class="bg-base-200 px-4 py-2 flex gap-1 text-sm font-medium flex-wrap">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="[
              'px-3 py-1 rounded cursor-pointer border-0 bg-transparent',
              activeTab === tab.value
                ? 'bg-base-100 shadow font-semibold'
                : 'opacity-60 hover:opacity-100',
            ]"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="p-4 min-h-32">
          <CroutonForm
            v-if="activeTab === 'form'"
            :views="views"
            :data="{}"
          />
          <CroutonForm
            v-else-if="activeTab === 'view'"
            :views="views"
            :data="{}"
            :readonly="true"
          />
          <pre
            v-else
            class="text-xs overflow-auto bg-base-100 p-2 rounded border border-base-300 h-64 m-0"
          >{{ JSON.stringify(def.schemas ?? {}, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { type ViewConfig } from '@ghentcdh/crouton-core';
import { CroutonForm } from '@ghentcdh/crouton-vue';

import { compiledDefinition, stateClasses } from '../status.utils';
import {
  StatusDefinitionRowEmits,
  StatusDefinitionRowProperties,
} from './StatusDefinitionRow.properties';

type Tab = 'form' | 'view' | 'json';
const tabs: { value: Tab; label: string }[] = [
  { value: 'form', label: 'Form' },
  { value: 'view', label: 'View' },
  { value: 'json', label: 'Schemas' },
];

const props = defineProps(StatusDefinitionRowProperties);
const emit = defineEmits(StatusDefinitionRowEmits);

const activeTab = ref<Tab>('form');

const def = computed(() => props.row.def);
const classes = computed(() => stateClasses[props.row.state]);
const color = computed(() =>
  props.row.state === 'ok' ? def.value?.annotation?.color : undefined,
);
const views = computed(
  () => (def.value?.schemas ?? {}) as Record<string, ViewConfig>,
);
const rawJson = computed(() =>
  props.row.raw ? JSON.stringify(props.row.raw, null, 2) : '(not available)',
);
const compiledJson = computed(() =>
  def.value ? JSON.stringify(compiledDefinition(def.value), null, 2) : '',
);

const copyError = () => {
  if (props.row.loadError) navigator.clipboard.writeText(props.row.loadError.error);
};
</script>
