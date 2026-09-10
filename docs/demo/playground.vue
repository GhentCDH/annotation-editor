<template>
  <div>
    <details
      class="border border-gray-200 rounded-lg mb-6 bg-gray-50 open:pb-4"
    >
      <summary
        class="px-6 py-4 cursor-pointer text-lg font-semibold select-none list-none flex items-center justify-between"
      >
        Configuration
        <span class="text-gray-400 text-sm font-normal">▾</span>
      </summary>

      <div class="px-6">
        <!-- Annotation Definitions -->
        <div class="mb-5">
          <h4
            class="mt-0 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Annotation Definitions
          </h4>
          <ul class="list-none p-0 m-0 space-y-2">
            <li
              v-for="(r, i) in resources"
              :key="i"
              class="border border-gray-200 rounded bg-white"
            >
              <div class="flex items-center gap-2 px-3 py-2">
                <a
                  :href="r.url"
                  target="_blank"
                  rel="noopener"
                  class="min-w-24 font-medium text-sm truncate flex-shrink-0"
                >
                  {{ r.name }}
                </a>
                <code class="text-xs text-gray-400 truncate flex-1 min-w-0">{{
                  r.url
                }}</code>
                <button
                  @click="r.expanded = !r.expanded"
                  class="text-xs text-gray-500 hover:text-gray-800 px-1 flex-shrink-0"
                  :title="r.expanded ? 'Close editor' : 'Edit JSON'"
                >
                  {{ r.expanded ? '▲' : '▼' }} edit
                </button>
                <button
                  @click="remove(i)"
                  class="text-gray-400 hover:text-red-500 text-lg leading-none px-1 flex-shrink-0"
                  title="Remove"
                >
                  ×
                </button>
              </div>
              <div v-if="r.expanded" class="border-t border-gray-200 px-3 pb-3">
                <p v-if="r.fetchError" class="text-xs text-red-500 mt-2">
                  Fetch error: {{ r.fetchError }}
                </p>
                <textarea
                  v-model="r.content"
                  @input="onEdit"
                  rows="12"
                  spellcheck="false"
                  class="w-full mt-2 font-mono text-xs border border-gray-200 rounded p-2 bg-gray-50 resize-y"
                />
                <p v-if="r.parseError" class="text-xs text-red-500 mt-1">
                  {{ r.parseError }}
                </p>
              </div>
            </li>
          </ul>
          <div class="flex gap-2 mt-2 items-center">
            <input
              v-model="newName"
              placeholder="Name"
              class="border border-gray-300 rounded px-2 py-1 text-sm w-24 bg-white"
            />
            <input
              v-model="newUrl"
              placeholder="https://..."
              class="border border-gray-300 rounded px-2 py-1 text-sm flex-1 bg-white"
              @keydown.enter="add()"
            />
            <button
              @click="add()"
              :disabled="!newUrl"
              class="border border-gray-300 rounded px-3 py-1 text-sm bg-white hover:bg-gray-100 disabled:opacity-40 flex-shrink-0"
            >
              Add
            </button>
          </div>
        </div>

        <!-- Annotations URL -->
        <div class="mb-4">
          <h4
            class="mt-0 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Annotations URL
          </h4>
          <div class="border border-gray-200 rounded bg-white">
            <div class="flex items-center gap-2 px-3 py-2">
              <input
                v-model="annotationsUrl"
                class="text-xs font-mono flex-1 min-w-0 border-0 outline-none bg-transparent"
                @change="loadAnnotations"
              />
              <a
                :href="annotationsUrl"
                target="_blank"
                rel="noopener"
                class="text-xs text-gray-400 hover:underline flex-shrink-0"
                >view ↗</a
              >
              <button
                @click="annotationsExpanded = !annotationsExpanded"
                class="text-xs text-gray-500 hover:text-gray-800 px-1 flex-shrink-0"
              >
                {{ annotationsExpanded ? '▲' : '▼' }} edit
              </button>
            </div>
            <div
              v-if="annotationsExpanded"
              class="border-t border-gray-200 px-3 pb-3"
            >
              <p v-if="annotationsFetchError" class="text-xs text-red-500 mt-2">
                Fetch error: {{ annotationsFetchError }}
              </p>
              <textarea
                v-model="annotationsContent"
                @input="rebuildAnnotations"
                rows="12"
                spellcheck="false"
                class="w-full mt-2 font-mono text-xs border border-gray-200 rounded p-2 bg-gray-50 resize-y"
              />
              <p v-if="annotationsParseError" class="text-xs text-red-500 mt-1">
                {{ annotationsParseError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Source Text URL -->
        <div class="mb-2">
          <h4
            class="mt-0 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
          >
            Source Text URL
          </h4>
          <div class="border border-gray-200 rounded bg-white">
            <div class="flex items-center gap-2 px-3 py-2">
              <input
                v-model="sourceUrl"
                class="text-xs font-mono flex-1 min-w-0 border-0 outline-none bg-transparent"
                @change="loadSources"
              />
              <a
                :href="sourceUrl"
                target="_blank"
                rel="noopener"
                class="text-xs text-gray-400 hover:underline flex-shrink-0"
                >view ↗</a
              >
              <button
                @click="sourcesExpanded = !sourcesExpanded"
                class="text-xs text-gray-500 hover:text-gray-800 px-1 flex-shrink-0"
              >
                {{ sourcesExpanded ? '▲' : '▼' }} edit
              </button>
            </div>
            <div
              v-if="sourcesExpanded"
              class="border-t border-gray-200 px-3 pb-3"
            >
              <p v-if="sourcesFetchError" class="text-xs text-red-500 mt-2">
                Fetch error: {{ sourcesFetchError }}
              </p>
              <textarea
                v-model="sourcesContent"
                @input="rebuildSources"
                rows="12"
                spellcheck="false"
                class="w-full mt-2 font-mono text-xs border border-gray-200 rounded p-2 bg-gray-50 resize-y"
              />
              <p v-if="sourcesParseError" class="text-xs text-red-500 mt-1">
                {{ sourcesParseError }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </details>
    <AnnotationEditor
      :configuration="config"
      :sources="sources"
      :annotations="annotations"
      :layout="layout"
      :annotation-definitions="definitions"
    />
  </div>
</template>

<script setup lang="ts">
import { AnnotationEditor } from '@ghentcdh/annotation-editor';
import { config, useResources } from '@demo/composables/useResources';
import { useAnnotations } from '@demo/composables/useAnnotations';
import { useSources } from '@demo/composables/useSources';
import type { GridLayout } from '@ghentcdh/annotation-core';

const layout: GridLayout = {
  areas: [['translation']],
  columns: '1fr',
  panes: [{ sourceId: 'translation', area: 'translation' }],
};

const { resources, newUrl, newName, definitions, add, remove, onEdit } =
  useResources();
const {
  url: annotationsUrl,
  content: annotationsContent,
  annotations,
  fetchError: annotationsFetchError,
  parseError: annotationsParseError,
  expanded: annotationsExpanded,
  load: loadAnnotations,
  rebuild: rebuildAnnotations,
} = useAnnotations();

const {
  url: sourceUrl,
  content: sourcesContent,
  sources,
  fetchError: sourcesFetchError,
  parseError: sourcesParseError,
  expanded: sourcesExpanded,
  load: loadSources,
  rebuild: rebuildSources,
} = useSources();
</script>
