# SmartAnnotationEditor

All-in-one annotation editor that handles data loading, annotation definitions, and source management internally. Use it when you want a self-contained component driven by a `loader` rather than managing state yourself.

Compared to [`AnnotationEditor`](./annotation-editor.md), you supply a loader and a transformer instead of raw `sources` / `annotations` arrays — the component fetches and reloads data automatically when `sourceUris` change or annotations are mutated.

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
  type SourceModel,
} from '@ghentcdh/annotation-vue';
import { TextLineAdapter } from '@ghentcdh/annotated-text';
import {
  editorAnnotationSchema,
  TransformAnnotationAdapter,
  type EditorAnnotation,
} from '@ghentcdh/annotation-ui';
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

class MyTransformAdapter extends TransformAnnotationAdapter<W3CAnnotation> {
  name = 'MyAnnotationAdapter';

  parse(raw: W3CAnnotation): EditorAnnotation | null {
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
  }

  format(annotation: EditorAnnotation): W3CAnnotation {
    const selector = annotation.selectors[0];
    return {
      id: annotation.id,
      ...annotation.metadata,
      selector,
    } as unknown as W3CAnnotation;
  }
}

// ─── 3. Wire up ──────────────────────────────────────────────────────────────

const loader = new MyLoader();
const transformer = new MyTransformAdapter();
const textAdapter = () => TextLineAdapter({});
const sourceUris = ref<string[]>(['text:1']);
</script>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `loader` | `AnnotationEditorLoader<T>` | ✓ | — | Loads sources, annotations, and annotation definition resources |
| `annotationTransformer` | `TransformAnnotationAdapter<T>` | ✓ | — | Converts between your domain model and the editor's `EditorAnnotation` format |
| `sourceUris` | `string[]` | ✓ | — | URIs identifying the sources to load. Change them to trigger a reload |
| `textAdapter` | `() => TextAdapter` | — | `undefined` | Custom text rendering adapter (e.g. `TextLineAdapter`) |
| `watchQueryParams` | `boolean` | — | `true` | Sync selected annotation and action with the URL query string |
| `readOnly` | `boolean` | — | `false` | Render `AnnotationPreview` instead of `AnnotationEditor` |

## AnnotationEditorLoader

Extend this abstract class to connect your data layer. Instantiate it once outside the component (singleton pattern avoids redundant definition loads).

```ts
import {
  AnnotationEditorLoader,
  type SourceModel,
} from '@ghentcdh/annotation-vue';

class MyLoader extends AnnotationEditorLoader<MyAnnotation> {
  /** Return resource URIs — called once on construction to populate definitions */
  async loadResources(): Promise<string[]> { … }

  /** Return a SourceModel for the given URI */
  async loadSource(sourceUri: string): Promise<SourceModel> { … }

  /** Return all annotations for the given source URI */
  async loadAnnotations(sourceUri: string): Promise<MyAnnotation[]> { … }
}
```

`getDefinitions()` is available inside `loadAnnotations` — the loader waits for definitions to be populated before calling it.

**Singleton pattern** — create the loader once and reuse it:

```ts
let _loader: MyLoader | null = null;
export const myLoader = () => (_loader ??= new MyLoader());
```

## TransformAnnotationAdapter

Extend `TransformAnnotationAdapter<T>` from `@ghentcdh/annotation-ui` to convert between your domain model `T` and the editor's internal `EditorAnnotation`.

```ts
import {
  TransformAnnotationAdapter,
  editorAnnotationSchema,
  type EditorAnnotation,
} from '@ghentcdh/annotation-ui';

class MyTransformAdapter extends TransformAnnotationAdapter<MyAnnotation> {
  name = 'MyAnnotationAdapter';
  readonly defaultParams = { startOffset: 0 };

  /** Raw API object → EditorAnnotation (return null to skip) */
  parse(raw: MyAnnotation): EditorAnnotation | null { … }

  /** EditorAnnotation → payload sent to your API */
  format(annotation: EditorAnnotation, isNew: boolean): MyAnnotation { … }

  /** Optional — transform metadata when selector changes */
  override transformMetadata(metadata: any, selector: Selector) { … }
}
```

## Read-only mode

Pass `:read-only="true"` to render `AnnotationPreview` instead of `AnnotationEditor`. The loader still fetches data; events for mutation are not emitted.

```vue
<SmartAnnotationEditor
  :loader="loader"
  :annotation-transformer="transformer"
  :source-uris="sourceUris"
  :read-only="true"
/>
```

## Dynamic sources

Update `sourceUris` to switch sources at runtime. The component reloads sources and annotations automatically; in-flight requests from the previous load are discarded.

```ts
const sourceUris = ref<string[]>(['text:1']);

// navigate to another text
sourceUris.value = ['text:42'];
```
