# Annotation Definitions

Annotation definitions describe the types of annotations that can be created — their colour, allowed children and links, metadata schemas, and API operations. The `provideAnnotationDefinitions` composable manages the full lifecycle: loading, parsing, and making definitions available to the editor.

## Quick start

Call `provideAnnotationDefinitions` once in the root component (or `App.vue`) before any child that uses the editor.

```ts
import { provideAnnotationDefinitions } from '@ghentcdh/annotation-vue';

const resourceFolder = import.meta.glob('./annotation-configs/*.json', { eager: true });

const { definitions, loading, error } = provideAnnotationDefinitions({
  config: {
    baseUrl: 'https://api.example.com/',
    app: 'my-app',
    prefix: 'my-prefix',
  },
  resourceFolder,
});
```

Pass `definitions` directly to `AnnotationEditor`:

```vue
<AnnotationEditor
  :annotation-definitions="definitions"
  ...
/>
```

## State

`provideAnnotationDefinitions` returns an `AnnotationDefinitionsState` object — a reactive object you can read from any component under the provider:

| Property | Type | Description |
|----------|------|-------------|
| `definitions` | `UIAnnotationDefinition[]` | Parsed, Vue-ready definitions |
| `definitionsMap` | `Record<string, UIAnnotationDefinition>` | Keyed by definition `id` |
| `loading` | `boolean` | `true` while an async load is in flight |
| `error` | `Error \| null` | Set when a load throws; `null` on success |
| `loadErrors` | `AnnotationLoadError[]` | Per-resource errors from `loadFromResourceUris` |
| `rawJsonMap` | `Record<string, unknown>` | Raw JSON for each successfully loaded resource |
| `service` | `AnnotationDefinitionService` | Low-level service (advanced) |

### Reading state in child components

```ts
import { useAnnotationDefinitions } from '@ghentcdh/annotation-vue';

const { definitions, loading, error, loadErrors } = useAnnotationDefinitions();
```

`useAnnotationDefinitions` throws if called outside a component tree that called `provideAnnotationDefinitions`.

## Loading definitions

Four loading strategies are supported; they can be combined.

### From local JSON files (glob)

Best for projects that ship definitions as static assets.

```ts
provideAnnotationDefinitions({
  config,
  resourceFolder: import.meta.glob('./defs/*.json', { eager: true }),
});
```

### From a configuration URL

The URL must return a JSON object with an `annotations` array. Each item must have a `schemas` property pointing to the individual definition URL.

```ts
provideAnnotationDefinitions({
  config,
  definitionsUrl: 'https://api.example.com/annotation-config',
});
```

Provide a custom `fetchFn` to intercept the request (e.g. to add auth headers):

```ts
provideAnnotationDefinitions({
  config,
  definitionsUrl: '/api/annotation-config',
  fetchFn: async (url) => {
    const res = await myApiClient.get(url);
    return res.data; // AnnotationJsonResource[]
  },
});
```

### From individual schema URLs

```ts
provideAnnotationDefinitions({
  config,
  definitionsUrls: [
    'https://api.example.com/definitions/comment.json',
    'https://api.example.com/definitions/highlight.json',
  ],
});
```

### From resource URIs (status page)

`loadFromResourceUris` fetches each URL, parses the raw JSON, and collects both successes and per-resource errors. This is the method used by the **status page** — a diagnostic view that shows which definitions loaded successfully and which failed.

```ts
provideAnnotationDefinitions({
  config,
  resourceUrls: [
    'https://api.example.com/resources/comment',
    'https://api.example.com/resources/highlight',
  ],
});
```

After loading, inspect `loadErrors` and `rawJsonMap`:

```ts
const { loadErrors, rawJsonMap, definitions } = useAnnotationDefinitions();

// loadErrors: definitions that failed validation
loadErrors.forEach(({ id, name, error }) => {
  console.warn(`[${id}] ${name}: ${error}`);
});

// rawJsonMap: the raw JSON for each successful definition, keyed by id
console.log(rawJsonMap);
```

## The status page pattern

A status page lists all annotation definitions with their current load state. Implement it using `loadFromResourceUris` and the reactive state:

```vue
<template>
  <div v-if="loading">Loading definitions…</div>
  <div v-else>
    <ul>
      <li v-for="def in definitions" :key="def.id" class="ok">
        ✓ {{ def.name }} ({{ def.id }})
      </li>
      <li v-for="err in loadErrors" :key="err.id" class="error">
        ✗ {{ err.name ?? err.id }}: {{ err.error }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useAnnotationDefinitions } from '@ghentcdh/annotation-vue';

const { definitions, loadErrors, loading } = useAnnotationDefinitions();
</script>
```

## Late loading

Load additional definitions after mount by calling the load methods on the returned state:

```ts
const state = provideAnnotationDefinitions({ config });

// later, e.g. after a user selects a project:
await state.loadFromUrl('https://api.example.com/projects/42/annotation-config');
```

Each call to a `load*` method replaces the current `definitions` and `definitionsMap`.

## `UIAnnotationDefinition`

Each loaded definition is transformed into a `UIAnnotationDefinition`:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique definition identifier |
| `name` | `string` | Internal name |
| `label` | `string` | Display label (same as `name`) |
| `color` | `string \| undefined` | Highlight colour |
| `target` | `string \| undefined` | Default annotation target URI |
| `style` | `CustomAnnotationStyle \| undefined` | Default and active highlight styles |
| `allowedChildren` | `KeyLabel[]` | Definitions that may be nested inside this one |
| `allowedLinks` | `KeyLabel[]` | Definitions that may be linked from this one |
| `views` | `Record<string, unknown> \| null` | Crouton view schemas (table, form, detail) |
| `canCreate` | `boolean` | Derived from `operations.create` |
| `canEdit` | `boolean` | Derived from `operations.patch` |
| `canDelete` | `boolean` | Derived from `operations.delete` |
| `resource` | `ReturnType<typeof resourceApi>` | Crouton resource API helper |
| `_core` | `AnnotationResource` | Raw core definition before Vue transformation |

## Loading errors

`AnnotationLoadError` is the shape of entries in `loadErrors`:

```ts
type AnnotationLoadError = {
  id?: string;     // definition id, if parseable
  name?: string;   // definition name, if parseable
  error: string;   // human-readable error message
  raw: unknown;    // the raw JSON that failed
};
```

Errors are collected per-resource — one bad definition does not block the others.

## `AnnotationDefinitionService`

The service exposes lower-level helpers, primarily for internal use:

```ts
const { service } = useAnnotationDefinitions();

// All definitions keyed by id
const grouped = service.findAllGrouped();

// Look up a single definition
const def = service.findById('my-definition-id');
```
