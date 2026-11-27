# SmartAnnotationEditor

All-in-one annotation editor that handles data loading, annotation definitions, and source management internally. Use it
when you want a self-contained component driven by a `loader` rather than managing state yourself.

Compared to [`AnnotationEditor`](./annotation-editor.md), you supply a loader and a transformer instead of raw
`sources` / `annotations` arrays — the component fetches and reloads data automatically when `sourceUris` change or
annotations are mutated.

## Usage

```vue

<template>
  <SmartAnnotationEditor
    :annotation-transformer="transformer"
    :loader="loader"
    :text-adapter="textAdapter"
    :source-uris="sourceUris"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import {
    SmartAnnotationEditor,
    AnnotationEditorLoader,
    editorAnnotationSchema,
    type AnnotationTransformer,
    type SourceModel,
  } from '@ghentcdh/annotation-vue';
  import { TextLineAdapter } from '@ghentcdh/annotated-text';
  import type { W3CAnnotation } from '@ghentcdh/w3c-utils';

  // ─── 1. Loader ───────────────────────────────────────────────────────────────

  class MyLoader extends AnnotationEditorLoader<W3CAnnotation> {
    async loadResources(): Promise<string[]> {
      // Return URIs of annotation definition resources from your API
      const res = await fetch('/api/annotation-definitions');
      const data = await res.json();
      return data.map((d: { uri: string }) => d.uri);
    }

    async loadSource(sourceUri: string): Promise<SourceModel> {
      const id = sourceUri.split(':')[1];
      const res = await fetch(`/api/texts/${id}`);
      // Surface HTTP failures so SmartAnnotationEditor can show an error state
      if (!res.ok) throw { response: { status: res.status, statusText: res.statusText } };
      const text = await res.json();
      return {
        id,
        uri: sourceUri,
        type: 'text',
        content: {
          label: text.title,
          text: text.content,
          textDirection: 'ltr',
          offset: 0,
        },
      };
    }

    async loadAnnotations(sourceUri: string): Promise<W3CAnnotation[]> {
      const id = sourceUri.split(':')[1];
      const defs = this.getDefinitions();
      const results = await Promise.all(
        defs.map((def) =>
          fetch(`/api/annotations?source_id=${id}&type=${def.id}`)
            .then((r) => r.json())
            .then((items: W3CAnnotation[]) =>
              items.map((item) => ({ ...item, definition: def })),
            ),
        ),
      );
      return results.flat();
    }
  }

  // ─── 2. Transformer ──────────────────────────────────────────────────────────

  const transformer: AnnotationTransformer<W3CAnnotation> = {
    parse: (raw) => {
      const { definition, ...metadata } = raw as any;
      return editorAnnotationSchema.parse({
        id: raw.id,
        start: Number((raw as any).selector?.start),
        end: Number((raw as any).selector?.end),
        label: definition.name,
        definition,
        selectors: [{ ...(raw as any).selector, uri: (raw as any).sourceUri }],
        metadata,
      });
    },
    format: (annotation) => {
      const selector = annotation.selectors[0];
      return {
        id: annotation.id,
        ...annotation.metadata,
        selector,
      } as unknown as W3CAnnotation;
    },
  };

  // ─── 3. Wire up ──────────────────────────────────────────────────────────────

  const loader = new MyLoader();
  const textAdapter = () => TextLineAdapter({});
  const sourceUris = ref<string[]>(['text:1']);
</script>
```

## Props

| Prop                    | Type                            | Required | Default                          | Description                                                                   |
|-------------------------|---------------------------------|----------|----------------------------------|-------------------------------------------------------------------------------|
| `loader`                | `AnnotationEditorLoader<T>`     | ✓        | —                                | Loads sources, annotations, and annotation definition resources               |
| `sourceUris`            | `string[]`                      | ✓        | —                                | URIs identifying the sources to load. Change them to trigger a reload         |
| `annotationTransformer` | `AnnotationTransformer<T>`      | —        | `w3cAnnotationTransformer`       | Converts between your domain model and `EditorAnnotation`. Defaults to the built-in W3C adapter. |
| `layout`                | `GridLayout`                    | —        | `undefined`                      | Custom CSS grid layout — see [AnnotationEditor custom layout](./annotation-editor.md#custom-layout) |
| `textAdapter`           | `() => TextAdapter`             | —        | `undefined`                      | Custom text rendering adapter (e.g. `TextLineAdapter`)                        |
| `watchQueryParams`      | `boolean`                       | —        | `true`                           | Sync selected annotation and action with the URL query string                 |
| `readonly`              | `boolean`                       | —        | `false`                          | Disable editing — only display annotations, no create/edit/delete             |

::: warning Requires vue-router
`SmartAnnotationEditor` uses `useRoute()` / `useRouter()` to sync the selection with the URL, so it must be rendered
inside an app with `vue-router` installed (also when `watchQueryParams` is `false`). `vue-router` is an optional peer
dependency of `@ghentcdh/annotation-vue`, so install it yourself.
:::

## Events

| Event                  | Payload               | Description                                                                                  |
|------------------------|-----------------------|----------------------------------------------------------------------------------------------|
| `annotationtype-click` | `Record<string, any>` | Emitted when an annotation type in the filter sidebar is clicked. Only active when a listener is attached. |

Create, update and delete are handled internally: the component reloads annotations from the `loader` after each
mutation.

## Slots

| Slot              | Description                                                         |
|-------------------|---------------------------------------------------------------------|
| `before-editor`   | Content rendered above the editor, e.g. a toolbar or source header |
| `annotation-menu` | Extra content in the left drawer, below the annotation type filter  |
| `error`           | Replaces the editor when loading fails. Receives `{ error, retry }` |

```vue
<SmartAnnotationEditor :loader="loader" :source-uris="sourceUris">
  <template #before-editor>
    <h2>{{ title }}</h2>
  </template>
  <template #annotation-menu>
    <RouterLink to="/help">Annotation guidelines</RouterLink>
  </template>
</SmartAnnotationEditor>
```

## AnnotationEditorLoader

Extend this abstract class to connect your data layer. Instantiate it once outside the component (singleton pattern
avoids redundant definition loads).

```ts
import {
  AnnotationEditorLoader,
  type SourceModel,
} from '@ghentcdh/annotation-vue';

class MyLoader extends AnnotationEditorLoader<MyAnnotation> {
  /** Return resource URIs — called once on construction to populate definitions */
  async loadResources(): Promise<string[]> { …
  }

  /** Return a SourceModel for the given URI */
  async loadSource(sourceUri: string | number): Promise<SourceModel> { …
  }

  /** Return all annotations for the given source URI */
  async loadAnnotations(sourceUri: string): Promise<MyAnnotation[]> { …
  }
}
```

`getDefinitions()` is available inside `loadAnnotations` — the loader waits for definitions to be populated before
calling it.

**Singleton pattern** — create the loader once and reuse it:

```ts
let _loader: MyLoader | null = null;
export const myLoader = () => (_loader ??= new MyLoader());
```

## AnnotationTransformer

An `AnnotationTransformer<T>` is a plain object that converts between your domain model `T` and the editor's internal
`EditorAnnotation`. Only `parse` and `format` are required. The built-in `w3cAnnotationTransformer` handles W3C
annotations.

```ts
import { type AnnotationTransformer } from '@ghentcdh/annotation-vue';

const myTransformer: AnnotationTransformer<MyAnnotation> = {
  /** Raw API object → EditorAnnotation (return null to skip) */
  parse: (raw) => { … },

  /** EditorAnnotation → payload sent to your API */
  format: (annotation, isNew) => { … },

  /** Optional — transform metadata when the selector changes (default: unchanged) */
  transformMetadata: (metadata, selector) => { … },

  /** Optional — passed to the text adapter to control selection behaviour (default: `{}`) */
  defaultParams: { startOffset: 0 },
};
```

Reuse the W3C transformer and override one function with a spread:
`{ ...w3cAnnotationTransformer, transformMetadata: (m, s) => ({ ...m, length: s.end - s.start }) }`.

::: tip Migrating from `TransformAnnotationAdapter` (≤ 0.0.1-alpha.30)
The abstract class is gone. Replace `class X extends TransformAnnotationAdapter<T>` with an object of type
`AnnotationTransformer<T>` (drop `name`), `new W3cTransformAnnotationAdapter()` with `w3cAnnotationTransformer`, and
`transformer.createLinks(raw.map(transformer.parse))` with `parseAnnotations(transformer, raw)`.
:::

## Read-only mode

Pass `:readonly="true"` to disable creating, editing and deleting annotations. The loader still fetches data and
annotations can still be selected.

```vue

<SmartAnnotationEditor
  :loader="loader"
  :annotation-transformer="transformer"
  :source-uris="sourceUris"
  :readonly="true"
/>
```

## Dynamic sources

Update `sourceUris` to switch sources at runtime. The component reloads sources and annotations automatically; in-flight
requests from the previous load are discarded.

```ts
const sourceUris = ref<string[]>(['text:1']);

// navigate to another text
sourceUris.value = ['text:42'];
```

## Error handling

When `loadSource`, `loadAnnotations` or `loadResources` reject, the editor is replaced by an error panel instead of
showing a blank screen or spinning forever. A `404` response gets a dedicated "Text not found" message; other failures
show the backend detail when available. The panel has a **Try again** button that re-runs the failed loaders.

The status is detected from axios (`error.response.status`), `error.status`, `error.statusCode`, or — as a last resort —
a `404` in the error message, so throwing the raw HTTP error from your loader is enough:

```ts
async loadSource(sourceUri: string): Promise<SourceModel> {
  const id = sourceUri.split(':')[1];
  const res = await fetch(`/api/texts/${id}`);
  if (!res.ok) throw { response: { status: res.status, statusText: res.statusText } };
  // …
}
```

Override the default panel with the `error` slot:

```vue
<SmartAnnotationEditor :loader="loader" :source-uris="sourceUris">
  <template #error="{ error, retry }">
    <div>
      <p>{{ error.isNotFound ? 'That text does not exist.' : error.message }}</p>
      <button @click="retry">Retry</button>
    </div>
  </template>
</SmartAnnotationEditor>
```

The normalised `EditorLoadError` (`{ message, detail, status, isNotFound, cause }`) is also available for host apps via
`toEditorLoadError`.
