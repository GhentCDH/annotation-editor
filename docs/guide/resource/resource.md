# Annotation Resource

An **annotation resource** is the JSON configuration file that tells the editor what annotation types exist, how they behave, and how their data is structured. Each file corresponds to one annotation type (e.g. `animals.json`, `emotion.json`).

## Relationship to Crouton

`AnnotationResourceSchema` extends the base **Crouton resource** format. The fields `name`, `title`, and `operations` come directly from Crouton — see the [Crouton resource documentation](https://ghentcdh.github.io/crouton/guide/resource/resource-json.html) for those fields.

This library adds three fields on top of that base: `annotation`, `context`, and `schemas`.

::: warning `name` is the id (crouton 0.1.0)
Crouton 0.1.0 removed the root `id` key: the resource id is always `name`, and `title` is the display label.
Annotation definition URIs are built from `name`, so set `name` to the old `id` to keep existing annotations valid:
`{ "id": "animals", "name": "Animals" }` → `{ "name": "animals", "title": "Animals" }`. Column entries must not
carry an `id` either (the map key is the id). Run `crouton migrate resources` afterwards for the remaining
crouton changes. At runtime `AnnotationResource.id` is still available and always equals `name`.
:::

## Fields

### `annotation`

Controls how the annotation type is rendered and linked to other types.

| Field | Type | Default | Description |
|---|---|---|---|
| `color` | `string` | — | Highlight / marker colour (CSS value) |
| `type` | `string` | — | Custom type identifier |
| `icon` | `string` | — | Icon name |
| `isRoot` | `boolean` | `true` | Whether this type can be created directly by the user |
| `allowedChildren` | `string[]` | `[]` | IDs of annotation types that can be nested under this one |
| `allowedLinks` | `string[]` | `[]` | IDs of annotation types that can be linked from this one |
| `target` | `"gutter" \| "underline" \| "highlight"` | `"highlight"` | Visual rendering target in the text |

```json
{
  "name": "animals",
  "title": "Animals",
  "annotation": {
    "color": "#65a378",
    "target": "highlight",
    "allowedLinks": ["emotion"]
  }
}
```

### `context` (runtime only)

A `ContextBuilder` instance (from `@ghentcdh/w3c-utils`) that controls the JSON-LD context attached to annotations. Set programmatically when building resources in TypeScript — not a JSON field.

```ts
import { baseContextBuilder } from '@ghentcdh/annotation-core';

const resource = AnnotationResourceSchema.parse({
  id: 'animals',
  name: 'animals',
  title: 'Animals',
  annotation: { color: '#65a378' },
  context: baseContextBuilder('animals', config),
});
```

### `schemas`

Optional per-view column overrides. Keys are view names (`table`, `view`, `form`); values are partial `ViewConfig` objects that override defaults coming from the crouton `columns` definition.

```json
{
  "name": "animals",
  "title": "Animals",
  "annotation": { "color": "#65a378" },
  "schemas": {
    "table": { "columns": { "name": { "hiddenInTable": false } } },
    "form":  { "columns": { "breed": { "hiddenInForm": true } } }
  }
}
```

## Full example

```json
{
  "$schema": "https://ghentcdh.github.io/annotation-editor/schema/v1/resource.schema.json",
  "name": "animals",
  "title": "Animals",
  "kind": "custom",
  "annotation": {
    "color": "#65a378",
    "target": "highlight",
    "allowedLinks": ["emotion"]
  },
  "columns": {
    "name": {
      "label": "Name",
      "type": { "type": "string" },
      "fieldInput": { "position": 1, "options": {} }
    }
  }
}
```

## JSON Schema

The JSON Schema for resource files is published at:

```
https://ghentcdh.github.io/annotation-editor/schema/v1/resource.schema.json
```

Add a `$schema` pointer to your config files to get IDE validation and autocompletion:

```json
{
  "$schema": "https://ghentcdh.github.io/annotation-editor/schema/v1/resource.schema.json",
  "name": "my-type",
  "title": "My Type",
  "annotation": {}
}
```

## Loading resources

Pass a glob of your config files to `provideAnnotationDefinitions`:

```ts
import { provideAnnotationDefinitions } from '@ghentcdh/annotation-vue';

const resourceFolder = import.meta.glob('./annotation-configs/*.json', { eager: true });
const { definitions } = provideAnnotationDefinitions({ config, resourceFolder });
```
