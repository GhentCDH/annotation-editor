# Read-only preview

There is no separate preview component anymore: `AnnotationPreview` and the `@ghentcdh/annotation-preview` package were
removed. Use [`AnnotationEditor`](./annotation-editor.md) (or [`SmartAnnotationEditor`](./smart-annotation-editor.md))
with `readonly` instead. Annotations are rendered and can be selected, but not created, edited or deleted.

See the [Preview demo](../demo/preview.md) for a live example.

## Usage

::: tabs
@tab Vue
```vue
<template>
  <AnnotationEditor
    :readonly="true"
    :sources="sources"
    :annotations="annotations"
    :annotation-definitions="definitions"
    :layout="layout"
    @select:annotation="onSelect"
  />
</template>

<script setup lang="ts">
import {
  AnnotationEditor,
  W3cTransformAnnotationAdapter,
  type SourceModel,
} from '@ghentcdh/annotation-vue';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';

// sources, definitions, layout and w3cAnnotations: see the AnnotationEditor usage example
const transformer = new W3cTransformAnnotationAdapter();
const annotations = transformer.createLinks(
  w3cAnnotations.map((a) => transformer.parse(a)),
);

const onSelect = (annotation: W3CAnnotation | null, action: string | null) => {
  console.log('selected', annotation?.id, action);
};
</script>
```
:::

## Migrating from `AnnotationPreview`

| `AnnotationPreview`                    | `AnnotationEditor`                                                   |
|----------------------------------------|----------------------------------------------------------------------|
| `import … from '@ghentcdh/annotation-preview'` | `import { AnnotationEditor } from '@ghentcdh/annotation-vue'` |
| —                                      | add `:readonly="true"`                                               |
| `configuration`                        | drop it — not a prop of `AnnotationEditor`                           |
| `annotations: W3CAnnotation[]`         | `annotations: EditorAnnotation[]` — convert with your `annotationTransformer` |
| `annotationAdapter`                    | `annotationTransformer`                                              |
| `PreviewLayout`                        | `GridLayout`                                                         |

`sources`, `annotationDefinitions`, `cols`, `layout`, `selectedAnnotationId`, `textAdapter` and the
`select:annotation` event work the same. See [AnnotationEditor](./annotation-editor.md) for the full prop list.
