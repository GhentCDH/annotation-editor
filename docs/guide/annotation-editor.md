# AnnotationEditor

Interactive editor component for creating, editing, and deleting W3C annotations on one or more text sources.

## Usage

::: tabs
@tab Vue
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
    @select:annotation="onSelect"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { AnnotationEditor } from '@ghentcdh/annotation-vue';
import { TransformAnnotationAdapter, editorAnnotationSchema, type EditorAnnotation } from '@ghentcdh/annotation-vue';
import { type SourceModel } from '@ghentcdh/annotation-vue';
import { type AnnotationDefConfig } from '@ghentcdh/annotation-vue';
import { provideAnnotationDefinitions } from '@ghentcdh/annotation-vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';

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

// Extend TransformAnnotationAdapter for your domain model
class MyAdapter extends TransformAnnotationAdapter<W3CAnnotation> {
  name = 'MyAdapter';
  defaultParams = {};

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
const toEditorAnnotations = (raw: W3CAnnotation[]) =>
  transformer.createLinks(
    raw.map((a) => transformer.parse(a)).filter((a): a is EditorAnnotation => !!a),
  );
const editorAnnotations = computed(() => toEditorAnnotations(rawAnnotations.value));

const onCreate  = async (a: W3CAnnotation) => { rawAnnotations.value = [...rawAnnotations.value, a]; };
const onUpdate  = async (a: W3CAnnotation) => { rawAnnotations.value = rawAnnotations.value.map((x) => (x.id === a.id ? a : x)); };
const onDelete  = async (a: W3CAnnotation) => { rawAnnotations.value = rawAnnotations.value.filter((x) => x.id !== a.id); };
const onSelect  = (a: W3CAnnotation | null, action: string | null) => { console.log('select', a?.id, action); };
</script>
```
:::

::: tip Use SmartAnnotationEditor for full data loading
For most use cases — fetching sources, annotations, and definitions from an API — use [`SmartAnnotationEditor`](./smart-annotation-editor.md) instead. It handles loading, caching, and the adapter pattern internally.
:::

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `sources` | `SourceModel[]` | ✓ | — | Text sources to render and annotate |
| `annotations` | `EditorAnnotation[]` | ✓ | — | Pre-converted annotations (`parse()` each raw annotation with your adapter, then `createLinks()`) |
| `annotationDefinitions` | `UIAnnotationDefinition[]` | ✓ | — | Available annotation types (label, colour, views for table/form/detail) |
| `annotationTransformer` | `TransformAnnotationAdapter<T>` | — | `new W3cTransformAnnotationAdapter()` | Adapter that converts between your domain model and `EditorAnnotation` |
| `cols` | `number` | — | `2` | Number of grid columns (ignored when `layout` is set) |
| `layout` | `GridLayout` | — | `undefined` | Custom CSS grid layout — see [Custom layout](#custom-layout) |
| `modalView` | `boolean` | — | `true` | Show annotation details in a modal (`true`) or inline (`false`) |
| `readonly` | `boolean` | — | `false` | Disable editing (annotations are displayed but cannot be created/edited/deleted) |
| `selectedAnnotationId` | `string \| number` | — | `undefined` | Pre-select an annotation by ID on mount |
| `selectedAnnotationAction` | `string` | — | `undefined` | Action to trigger on the pre-selected annotation |
| `textAdapter` | `() => TextAdapter` | — | `undefined` | Custom adapter for text rendering |

### SourceModel

```ts
import { type SourceModel } from '@ghentcdh/annotation-vue';

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

## Zoom

Each source pane has built-in zoom. Only the text is zoomed, not the page: the text reflows to the pane width and annotations are redrawn to match.

| Control | Action |
|---------|--------|
| Buttons | `−` / `%` / `+` buttons rendered on top of the text (`%` resets) |
| Mouse wheel / trackpad pinch | `Ctrl`/`Cmd` + wheel, or pinch, over the text |
| Keyboard | `Ctrl`/`Cmd` + `+` / `-` / `0` while the text has focus |

All three controls are always enabled; no props are needed.

## Custom layout

By default sources are placed in an equal-width column grid controlled by `cols`. For more control — e.g. a commentary pane spanning the full width below two source panes — pass a `GridLayout` object.

```ts
import { type GridLayout } from '@ghentcdh/annotation-vue';

const layout: GridLayout = {
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

### GridLayout type

```ts
type PaneConfig = {
  /** Matches SourceModel.id */
  sourceId: string;
  /** CSS grid-area name — must appear in areas */
  area: string;
};

type GridLayout = {
  areas: string[][];     // rows of area names
  columns?: string;      // grid-template-columns CSS value
  rows?: string;         // grid-template-rows CSS value
  panes: PaneConfig[];   // source → area mapping
};
```

## Examples

### Two sources side by side

Use `cols` to control the number of columns. Each `SourceModel` gets its own collapsible pane.

```vue
<template>
  <AnnotationEditor
    :sources="sources"
    :annotations="editorAnnotations"
    :annotation-definitions="definitions"
    :annotation-transformer="transformer"
    :cols="2"
    @create:annotation="onCreate"
    @update:annotation="onUpdate"
    @delete:annotation="onDelete"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { AnnotationEditor } from '@ghentcdh/annotation-vue';
import { type SourceModel } from '@ghentcdh/annotation-vue';

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

// transformer, rawAnnotations and toEditorAnnotations defined as in the Usage example above
const editorAnnotations = computed(() => toEditorAnnotations(rawAnnotations.value));
const onCreate  = async (a: W3CAnnotation) => { rawAnnotations.value = [...rawAnnotations.value, a]; };
const onUpdate  = async (a: W3CAnnotation) => { rawAnnotations.value = rawAnnotations.value.map((x) => (x.id === a.id ? a : x)); };
const onDelete  = async (a: W3CAnnotation) => { rawAnnotations.value = rawAnnotations.value.filter((x) => x.id !== a.id); };
</script>
```

### Three sources with custom layout

Original and translation side by side, commentary spanning the full width below.

```vue
<template>
  <AnnotationEditor
    :sources="sources"
    :annotations="editorAnnotations"
    :annotation-definitions="definitions"
    :annotation-transformer="transformer"
    :layout="layout"
    @create:annotation="onCreate"
    @update:annotation="onUpdate"
    @delete:annotation="onDelete"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { AnnotationEditor } from '@ghentcdh/annotation-vue';
import { type SourceModel, type GridLayout } from '@ghentcdh/annotation-vue';

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

const layout: GridLayout = {
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

// transformer, rawAnnotations and toEditorAnnotations defined as in the Usage example above
const editorAnnotations = computed(() => toEditorAnnotations(rawAnnotations.value));
const onCreate  = async (a: W3CAnnotation) => { rawAnnotations.value = [...rawAnnotations.value, a]; };
const onUpdate  = async (a: W3CAnnotation) => { rawAnnotations.value = rawAnnotations.value.map((x) => (x.id === a.id ? a : x)); };
const onDelete  = async (a: W3CAnnotation) => { rawAnnotations.value = rawAnnotations.value.filter((x) => x.id !== a.id); };
</script>
```

### Pre-selecting an annotation

Pass `selectedAnnotationId` (and optionally `selectedAnnotationAction`) to open the editor on a specific annotation on mount. Useful when navigating from a search result.

```vue
<template>
  <AnnotationEditor
    :sources="sources"
    :annotations="annotations"
    :annotation-definitions="definitions"
    selected-annotation-id="annotation-123"
    selected-annotation-action="edit"
    @update:annotation="onUpdate"
  />
</template>
```
