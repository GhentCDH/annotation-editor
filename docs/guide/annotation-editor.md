# AnnotationEditor

Interactive editor component for creating, editing, and deleting W3C annotations on one or more text sources.

## Usage

::: tabs
@tab Vue
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
    @select:annotation="onSelect"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AnnotationEditor, type SourceModel } from '@ghentcdh/annotation-editor';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type AnnotationDefConfig } from '@ghentcdh/annotation-core';
import { provideAnnotationDefinitions } from '@ghentcdh/annotation-vue';

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
    content: { label: 'Original', text: 'Select any word to annotate it.', textDirection: 'ltr', processingLanguage: 'en' },
  },
];

const annotations = ref<W3CAnnotation[]>([]);

const onCreate  = async (a: W3CAnnotation) => { annotations.value = [...annotations.value, a]; };
const onUpdate  = async (a: W3CAnnotation) => { annotations.value = annotations.value.map((x) => (x.id === a.id ? a : x)); };
const onDelete  = async (a: W3CAnnotation) => { annotations.value = annotations.value.filter((x) => x.id !== a.id); };
const onSelect  = (a: W3CAnnotation | null, action: string | null) => { console.log('select', a?.id, action); };
</script>
```
:::

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `configuration` | `AnnotationDefConfig` | ✓ | — | Base URL, app name, and prefix for annotation URIs |
| `sources` | `SourceModel[]` | ✓ | — | Text sources to render and annotate |
| `annotations` | `W3CAnnotation[]` | ✓ | — | Current set of annotations (managed externally) |
| `annotationDefinitions` | `AnnotationDefinition[]` | ✓ | — | Available annotation types (label, colour, form schema) |
| `cols` | `number` | — | `2` | Number of grid columns for source panes |
| `modalView` | `boolean` | — | `true` | Show annotation details in a modal (`true`) or inline (`false`) |
| `selectedAnnotationId` | `string` | — | `undefined` | Pre-select an annotation by ID on mount |
| `selectedAnnotationAction` | `string` | — | `undefined` | Action to trigger on the pre-selected annotation |
| `textAdapter` | `TextAdapter` | — | `undefined` | Custom adapter for text rendering |
| `annotationAdapter` | `AnnotationAdapter` | — | `undefined` | Custom adapter for annotation rendering |

### AnnotationDefConfig

```ts
import { type AnnotationDefConfig } from '@ghentcdh/annotation-core';

const config: AnnotationDefConfig = {
  baseUrl: 'https://api.example.com/', // trailing slash required
  app: 'my-app',
  prefix: 'my-prefix',
  isDev: false,      // optional — disables caching during development
  cacheTTLms: 60000, // optional — definition cache lifetime in ms
};
```

### SourceModel

```ts
import { type SourceModel } from '@ghentcdh/annotation-editor';

const source: SourceModel = {
  id: 'original',                          // stable identifier used for layout
  uri: 'https://example.com/texts/1',      // W3C annotation target URI
  type: 'text',
  content: {
    text: 'The full text content.',
    label: 'Original',                     // pane title
    textDirection: 'ltr',                  // 'ltr' | 'rtl'
    processingLanguage: 'en',
    offset: 0,                             // character offset if text is a slice
  },
};
```

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `create:annotation` | `W3CAnnotation` | Emitted when the user completes a new annotation form |
| `update:annotation` | `W3CAnnotation` | Emitted when the user saves an edit |
| `delete:annotation` | `W3CAnnotation` | Emitted after the user confirms deletion |
| `create:annotation:events` | `any` | Raw internal creation event payload (advanced use) |
| `select:annotation` | `(W3CAnnotation \| null, string \| null)` | Emitted on annotation selection/deselection. Second arg is the action name. |

All mutation events (`create`, `update`, `delete`) expect async handlers — the component waits for the promise to settle before clearing modal state.

## Examples

### Two sources side by side

Use `cols` to control the number of columns. Each `SourceModel` gets its own collapsible pane.

```vue
<template>
  <AnnotationEditor
    :configuration="config"
    :sources="sources"
    :annotations="annotations"
    :annotation-definitions="definitions"
    :cols="2"
    @create:annotation="onCreate"
    @update:annotation="onUpdate"
    @delete:annotation="onDelete"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { AnnotationEditor, type SourceModel } from '@ghentcdh/annotation-editor';
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
];

const annotations = ref<W3CAnnotation[]>([]);
const onCreate  = async (a: W3CAnnotation) => { annotations.value = [...annotations.value, a]; };
const onUpdate  = async (a: W3CAnnotation) => { annotations.value = annotations.value.map((x) => (x.id === a.id ? a : x)); };
const onDelete  = async (a: W3CAnnotation) => { annotations.value = annotations.value.filter((x) => x.id !== a.id); };
</script>
```

### Pre-selecting an annotation

Pass `selectedAnnotationId` (and optionally `selectedAnnotationAction`) to open the editor on a specific annotation on mount. Useful when navigating from a search result.

```vue
<template>
  <AnnotationEditor
    :configuration="config"
    :sources="sources"
    :annotations="annotations"
    :annotation-definitions="definitions"
    selected-annotation-id="annotation-123"
    selected-annotation-action="edit"
    @update:annotation="onUpdate"
  />
</template>
```
