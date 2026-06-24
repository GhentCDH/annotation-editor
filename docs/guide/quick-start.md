# Quick Start

Get annotation editing running in a Vue 3 app in under 10 minutes.

## Install

```bash
pnpm add @ghentcdh/annotation-editor @ghentcdh/annotation-preview @ghentcdh/annotation-vue
```

Import the CSS once in your app entry point:

```ts
import '@ghentcdh/annotation-editor/index.css';
import '@ghentcdh/annotation-preview/index.css';
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

**`AnnotationDefinition[]`** — the annotation types available in the editor (label, colour, JSON schema for the form, etc). Load these with `provideAnnotationDefinitions` from `@ghentcdh/annotation-vue`, or build them manually.

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
    :configuration="config"
    :sources="sources"
    :annotations="annotations"
    :annotation-definitions="definitions"
    @create:annotation="onCreate"
    @update:annotation="onUpdate"
    @delete:annotation="onDelete"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AnnotationEditor, type SourceModel } from '@ghentcdh/annotation-editor';
import { provideAnnotationDefinitions } from '@ghentcdh/annotation-vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type AnnotationDefConfig } from '@ghentcdh/annotation-core';

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
    content: { label: 'Original', text: 'Lorem ipsum dolor sit amet.', textDirection: 'ltr', processingLanguage: 'en' },
  },
];

const annotations = ref<W3CAnnotation[]>([]);

const onCreate = async (annotation: W3CAnnotation) => {
  // persist to your API, then push to local state
  annotations.value = [...annotations.value, annotation];
};

const onUpdate = async (annotation: W3CAnnotation) => {
  annotations.value = annotations.value.map((a) =>
    a.id === annotation.id ? annotation : a,
  );
};

const onDelete = async (annotation: W3CAnnotation) => {
  annotations.value = annotations.value.filter((a) => a.id !== annotation.id);
};
</script>
```

## Read-only preview

Swap `AnnotationEditor` for `AnnotationPreview` when you only need display (no editing):

```vue
<template>
  <AnnotationPreview
    :configuration="config"
    :sources="sources"
    :annotations="annotations"
    :annotation-definitions="definitions"
    @select:annotation="onSelect"
  />
</template>

<script setup lang="ts">
import { AnnotationPreview } from '@ghentcdh/annotation-preview';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';

// ... same config/sources/annotations/definitions setup as above

const onSelect = (annotation: W3CAnnotation | null, action: string | null) => {
  console.log('selected', annotation?.id, action);
};
</script>
```

## Next steps

- [AnnotationEditor](./annotation-editor.md) — full props, events, and examples
- [AnnotationPreview](./annotation-preview.md) — read-only display with custom grid layouts
