# AnnotationPreview

Read-only component that renders annotated text sources with a detail modal on selection. No editing capabilities — use [AnnotationEditor](./annotation-editor.md) for create/edit workflows.

## Usage

::: tabs
@tab Vue
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
import { type AnnotationDefConfig } from '@ghentcdh/annotation-core';
import { provideAnnotationDefinitions } from '@ghentcdh/annotation-vue';
import { type SourceModel } from '@ghentcdh/annotation-editor';

const config: AnnotationDefConfig = {
  baseUrl: 'https://api.example.com/',
  app: 'my-app',
  prefix: 'my-prefix',
};

const resourceFolder = import.meta.glob('./annotation-configs/*.json', { eager: true });
const { definitions } = provideAnnotationDefinitions({ config, resourceFolder });

const sources: SourceModel[] = [
  {
    id: 'original',
    uri: 'https://example.com/texts/1',
    type: 'text',
    content: { label: 'Original', text: 'Hover over highlighted spans to view annotations.', textDirection: 'ltr', processingLanguage: 'en' },
  },
];

const onSelect = (annotation: W3CAnnotation | null, action: string | null) => {
  console.log('selected', annotation?.id, action);
};
</script>
```
:::

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `configuration` | `AnnotationDefConfig` | ✓ | — | Base URL, app name, and prefix for annotation URIs |
| `sources` | `SourceModel[]` | ✓ | — | Text sources to display |
| `annotations` | `W3CAnnotation[]` | ✓ | — | Annotations to highlight |
| `annotationDefinitions` | `AnnotationDefinition[]` | ✓ | — | Available annotation types (used for labels and styles) |
| `cols` | `number` | — | `2` | Number of grid columns (ignored when `layout` is set) |
| `layout` | `PreviewLayout` | — | `undefined` | Custom CSS grid layout — see [Custom layout](#custom-layout) |
| `selectedAnnotationId` | `string` | — | `undefined` | Highlight a specific annotation on mount |
| `textAdapter` | `TextAdapter` | — | `undefined` | Custom adapter for text rendering |
| `annotationAdapter` | `AnnotationAdapter` | — | `undefined` | Custom adapter for annotation rendering |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `select:annotation` | `(W3CAnnotation \| null, string \| null)` | Emitted when the user clicks an annotation. `null` means deselected. |

## Custom layout

By default the sources are placed in an equal-width column grid controlled by `cols`. For more control — e.g. a commentary pane spanning the full width below two source panes — pass a `PreviewLayout` object.

```ts
import { type PreviewLayout } from '@ghentcdh/annotation-preview';

const layout: PreviewLayout = {
  // 2-D array of CSS grid-area names; repeat a name to span
  areas: [
    ['original', 'translation'],
    ['commentary', 'commentary'],
  ],
  // CSS grid-template-columns (optional — defaults to equal fractions)
  columns: '1fr 1fr',
  // CSS grid-template-rows (optional)
  rows: 'auto 1fr',
  // Map each source id to its grid-area name
  panes: [
    { sourceId: 'original',    area: 'original'    },
    { sourceId: 'translation', area: 'translation' },
    { sourceId: 'commentary',  area: 'commentary'  },
  ],
};
```

### PreviewLayout type

```ts
type PaneConfig = {
  /** Matches SourceModel.id */
  sourceId: string;
  /** CSS grid-area name — must appear in areas */
  area: string;
};

type PreviewLayout = {
  areas: string[][];     // rows of area names
  columns?: string;      // grid-template-columns CSS value
  rows?: string;         // grid-template-rows CSS value
  panes: PaneConfig[];   // source → area mapping
};
```

## Examples

### Three sources with custom layout

Original and translation side by side, commentary spanning the full width below.

```vue
<template>
  <AnnotationPreview
    :configuration="config"
    :sources="sources"
    :annotations="annotations"
    :annotation-definitions="definitions"
    :layout="layout"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AnnotationPreview, type PreviewLayout } from '@ghentcdh/annotation-preview';
import { type SourceModel } from '@ghentcdh/annotation-editor';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';

const sources: SourceModel[] = [
  {
    id: 'original',
    uri: 'https://example.com/texts/1',
    type: 'text',
    content: { label: 'Original', text: 'Latin source text.', textDirection: 'ltr', processingLanguage: 'la' },
  },
  {
    id: 'translation',
    uri: 'https://example.com/texts/1/en',
    type: 'text',
    content: { label: 'Translation', text: 'English translation.', textDirection: 'ltr', processingLanguage: 'en' },
  },
  {
    id: 'commentary',
    uri: 'https://example.com/texts/1/commentary',
    type: 'text',
    content: { label: 'Commentary', text: 'Scholarly commentary spanning the full width.', textDirection: 'ltr', processingLanguage: 'en' },
  },
];

const layout: PreviewLayout = {
  areas: [
    ['original', 'translation'],
    ['commentary', 'commentary'],
  ],
  columns: '1fr 1fr',
  panes: [
    { sourceId: 'original',    area: 'original'    },
    { sourceId: 'translation', area: 'translation' },
    { sourceId: 'commentary',  area: 'commentary'  },
  ],
};

const annotations = ref<W3CAnnotation[]>([]);
</script>
```

### RTL source

Set `textDirection: 'rtl'` on the source content for right-to-left text such as Arabic or Hebrew.

```ts
const sources: SourceModel[] = [
  {
    id: 'arabic',
    uri: 'https://example.com/texts/1/ar',
    type: 'text',
    content: { label: 'Arabic', text: 'نص عربي', textDirection: 'rtl', processingLanguage: 'ar' },
  },
];
```

### Highlight a specific annotation

Pass `selectedAnnotationId` to scroll to and highlight a particular annotation on mount — useful when navigating from a search result or external link.

```vue
<AnnotationPreview
  :configuration="config"
  :sources="sources"
  :annotations="annotations"
  :annotation-definitions="definitions"
  selected-annotation-id="annotation-123"
/>
```
