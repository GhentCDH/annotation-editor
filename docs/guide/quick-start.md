# Quick Start

Get annotation editing running in a Vue 3 app in under 10 minutes.

## Install

```bash
pnpm add @ghentcdh/annotation-editor @ghentcdh/annotation-preview @ghentcdh/annotation-vue
```

Import the CSS once in your app entry point:

```ts
import '@ghentcdh/annotation-editor/index.css';
```

## Concepts

Before adding a component, you need three things:

**`AnnotationDefConfig`** — tells the library where your annotation namespace lives:

```ts
import { type AnnotationDefConfig } from '@ghentcdh/annotation-core';

const config: AnnotationDefConfig = {
  baseUrl: 'https://api.example.com/',
  app: 'my-app',
  prefix: 'my-prefix',
};
```

**`AnnotationDefinition[]`** — the annotation types available in the editor (label, colour, views for table/form/detail
display, etc). Load these with `provideAnnotationDefinitions` from `@ghentcdh/annotation-vue`, or build them manually.

**`SourceModel[]`** — the text sources to annotate. Each source is a plain object:

```ts
import { type SourceModel } from '@ghentcdh/annotation-editor';

const sources: SourceModel[] = [
  {
    id: 'original',
    uri: 'https://example.com/texts/1',
    type: 'text',
    content: {
      label: 'Original',
      text: 'Lorem ipsum dolor sit amet.',
      textDirection: 'ltr',
      processingLanguage: 'en',
    },
  },
];
```

## Minimal example

```vue

<template>
  <AnnotationEditor
    :sources="sources"
    :annotations="editorAnnotations"
    :annotation-definitions="definitions"
    :annotation-transformer="transformer"
    @create:annotation="onCreate"
    @update:annotation="onUpdate"
    @delete:annotation="onDelete"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { AnnotationEditor } from '@ghentcdh/annotation-editor';
  import { TransformAnnotationAdapter, editorAnnotationSchema, type EditorAnnotation, type AnnotationAdapterParams } from '@ghentcdh/annotation-ui';
  import { provideAnnotationDefinitions } from '@ghentcdh/annotation-vue';
  import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
  import { type AnnotationDefConfig, type SourceModel } from '@ghentcdh/annotation-core';

  const config: AnnotationDefConfig = {
    baseUrl: 'https://api.example.com/',
    app: 'my-app',
    prefix: 'my-prefix',
  };

  // Load annotation type definitions from JSON configs bundled with your app
  const resourceFolder = import.meta.glob('./annotation-configs/*.json', { eager: true });
  const { definitions } = provideAnnotationDefinitions({ config, resourceFolder });

  const sources: SourceModel[] = [
    {
      id: 'original',
      uri: 'https://example.com/texts/1',
      type: 'text',
      content: {
        label: 'Original',
        text: 'Lorem ipsum dolor sit amet.',
        textDirection: 'ltr',
        processingLanguage: 'en',
      },
    },
  ];

  // Implement TransformAnnotationAdapter for your domain model
  class MyAdapter extends TransformAnnotationAdapter<W3CAnnotation> {
    name = 'MyAdapter';
    defaultParams: AnnotationAdapterParams = {};

    parse(raw: W3CAnnotation): EditorAnnotation | null {
      return editorAnnotationSchema.parse({ id: raw.id, /* map fields */ });
    }

    format(annotation: EditorAnnotation, isNew: boolean): W3CAnnotation {
      return { id: annotation.id, /* map fields */ } as W3CAnnotation;
    }
  }

  const transformer = new MyAdapter();
  const rawAnnotations = ref<W3CAnnotation[]>([]);
  // Convert raw annotations to the editor's internal format
  const editorAnnotations = computed(() => transformer.setAnnotations(rawAnnotations.value));

  const onCreate = async (annotation: W3CAnnotation) => {
    // persist to your API, then push to local state
    rawAnnotations.value = [...rawAnnotations.value, annotation];
  };

  const onUpdate = async (annotation: W3CAnnotation) => {
    rawAnnotations.value = rawAnnotations.value.map((a) =>
      a.id === annotation.id ? annotation : a,
    );
  };

  const onDelete = async (annotation: W3CAnnotation) => {
    rawAnnotations.value = rawAnnotations.value.filter((a) => a.id !== annotation.id);
  };
</script>
```

::: tip Prefer SmartAnnotationEditor
If your data comes from an API, [`SmartAnnotationEditor`](./smart-annotation-editor.md) handles loading, caching, and adapter wiring for you with less boilerplate.
:::

## Read-only mode

Pass `:readonly="true"` to `AnnotationEditor` to display annotations without allowing edits, or use `SmartAnnotationEditor` with `:readonly="true"`:

```vue
<SmartAnnotationEditor
  :loader="loader"
  :source-uris="sourceUris"
  :readonly="true"
/>
```

## Next steps

- [AnnotationEditor](./annotation-editor.md) — full props, events, and examples
- [SmartAnnotationEditor](./smart-annotation-editor.md) — loader-driven component with built-in data fetching
