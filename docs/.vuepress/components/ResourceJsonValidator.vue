<script setup lang="ts">
import { ref, watch } from 'vue';
import { z } from 'zod';
import {
  buildResourceJsonSchema,
  runResourceMigrations,
} from '@ghentcdh/crouton-core';
import { buildAnnotationDefFromResourceJson } from '../../../packages/annotation-vue/src/lib/definitions/annotation-definition.loader';

type ValidationState =
  | { status: 'idle' }
  | { status: 'valid'; data: unknown; schema: unknown }
  | { status: 'invalid'; message: string };

const EXAMPLES = {
  valid: JSON.stringify(
    {
      name: 'book',
      model: 'Book',
      title: 'Books',
      tag: 'Books',
      columns: {
        title: { label: 'Title', type: 'string' },
        year: { label: 'Year', type: 'number' },
      },
    },
    null,
    2,
  ),
  missingKind: JSON.stringify(
    {
      name: 'article',
      kind: 'custom',
      model: 'Article',
      title: 'Articles',
    },
    null,
    2,
  ),
  missingColumnType: JSON.stringify(
    {
      name: 'note',
      kind: 'custom',
      title: 'Notes',
      columns: {
        body: { label: 'Body' },
      },
    },
    null,
    2,
  ),
};

const input = ref('');
const result = ref<ValidationState>({ status: 'idle' });
const urlInput = ref('');
const urlLoading = ref(false);
const urlError = ref('');

const fetchFromUrl = async () => {
  if (!urlInput.value.trim()) return;
  urlLoading.value = true;
  urlError.value = '';
  try {
    const res = await fetch(urlInput.value.trim());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    input.value = JSON.stringify(await res.json(), null, 2);
  } catch (e) {
    urlError.value = e instanceof Error ? e.message : String(e);
  } finally {
    urlLoading.value = false;
  }
};

let timer: ReturnType<typeof setTimeout> | null = null;

const validate = (raw: string) => {
  if (!raw.trim()) {
    result.value = { status: 'idle' };
    return;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    result.value = {
      status: 'invalid',
      message: 'Invalid JSON — cannot parse.',
    };
    return;
  }
  const migrated = runResourceMigrations(parsed as Record<string, unknown>);
  const outcome = buildResourceJsonSchema().safeParse(migrated.raw);
  if (outcome.success) {
    const schema = buildAnnotationDefFromResourceJson(migrated.raw);
    result.value = {
      status: 'valid',
      data: outcome.data,
      schema: schema,
    };
  } else {
    result.value = {
      status: 'invalid',
      message: z.prettifyError(outcome.error),
    };
  }
};

watch(input, (val) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => validate(val), 200);
});

const loadExample = (key: keyof typeof EXAMPLES) => {
  input.value = EXAMPLES[key];
};
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-sm opacity-70">Load example:</span>
      <button
        class="text-xs px-2 py-0.5 border border-gray-300 rounded bg-gray-100 hover:bg-blue-50 cursor-pointer"
        @click="loadExample('valid')"
      >
        Valid
      </button>
      <button
        class="text-xs px-2 py-0.5 border border-gray-300 rounded bg-gray-100 hover:bg-blue-50 cursor-pointer"
        @click="loadExample('missingKind')"
      >
        model on custom resource
      </button>
      <button
        class="text-xs px-2 py-0.5 border border-gray-300 rounded bg-gray-100 hover:bg-blue-50 cursor-pointer"
        @click="loadExample('missingColumnType')"
      >
        missing column type
      </button>
    </div>

    <div class="flex gap-2">
      <input
        v-model="urlInput"
        type="url"
        placeholder="https://…/api/model/schema"
        class="flex-1 font-mono text-sm p-2 border border-gray-300 rounded-md bg-gray-50"
        @keyup.enter="fetchFromUrl"
      />
      <button
        class="text-sm px-3 py-1 border border-gray-300 rounded bg-gray-100 hover:bg-blue-50 cursor-pointer disabled:opacity-50"
        :disabled="urlLoading"
        @click="fetchFromUrl"
      >
        {{ urlLoading ? 'Loading…' : 'Fetch' }}
      </button>
    </div>
    <div v-if="urlError" class="text-xs text-red-600">{{ urlError }}</div>

    <textarea
      v-model="input"
      placeholder="Paste your resource.json here…"
      rows="18"
      spellcheck="false"
      class="w-full font-mono text-sm p-3 border border-gray-300 rounded-md bg-gray-50 text-inherit resize-y"
    />

    <div
      v-if="result.status === 'idle'"
      class="px-4 py-3 rounded-md text-sm bg-gray-100 opacity-70"
    >
      Paste a <code>resource.json</code> above to validate it.
    </div>

    <template v-else-if="result.status === 'valid'">
      <div
        class="px-4 py-3 rounded-md text-sm bg-green-50 border border-green-300 text-green-800"
      >
        <strong>✓ Valid</strong>
        <details class="mt-1">
          <summary class="cursor-pointer text-sm">Normalized output</summary>
          <pre class="mt-2 text-xs whitespace-pre-wrap break-words">{{
            JSON.stringify(result.data, null, 2)
          }}</pre>
        </details>
      </div>

      <div
        class="px-4 py-3 rounded-md text-sm bg-green-50 border border-green-300 text-green-800"
      >
        <details class="mt-1">
          <summary class="cursor-pointer text-sm">Schema output</summary>
          <pre class="mt-2 text-xs whitespace-pre-wrap break-words">{{
            JSON.stringify(result.schema, null, 2)
          }}</pre>
        </details>
      </div>
    </template>
    <div
      v-else
      class="px-4 py-3 rounded-md text-sm bg-red-50 border border-red-300 text-red-800"
    >
      <strong>✗ Invalid</strong>
      <pre class="mt-2 text-xs whitespace-pre-wrap break-words">{{
        result.message
      }}</pre>
    </div>
  </div>
</template>
