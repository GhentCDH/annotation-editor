# Annotation Editor

Monorepo for W3C-compliant annotation editing. Provides a NestJS API module for serving annotation definitions, a shared core library for types and validation, and a Vue 3 editor component for creating and managing annotations on text sources.

## Packages

| Package | Description |
|---|---|
| `@ghentcdh/annotation-core` | Shared types, Zod schemas, and configuration utilities |
| `@ghentcdh/annotation-editor` | Vue 3 annotation editor component |
| `@ghentcdh/annotation-api` | NestJS module for annotation definition services |

## Requirements

- Node.js 20+
- pnpm 10+

## Setup

```bash
pnpm install
```

## Build

```bash
pnpm nx build annotation-core
pnpm nx build annotation-editor
pnpm nx build annotation-api
```

## Packages

### @ghentcdh/annotation-core

Shared types and configuration utilities used by both the API and the editor.

#### AnnotationDefConfig

```ts
import { type AnnotationDefConfig, resolveConfig } from '@ghentcdh/annotation-core';

const config: AnnotationDefConfig = {
  baseUrl: 'https://api.example.com/',
  app: 'my-app',
  prefix: 'my-prefix',
};

// resolveConfig normalizes the config and generates contextUrl
const resolved = resolveConfig(config);
// resolved.baseUrl     → 'https://api.example.com/'
// resolved.contextUrl  → 'https://api.example.com/ns/'
// resolved.app         → 'my-app'
// resolved.prefix      → 'my-prefix'
```

**Defaults:**

| Property | Default |
|---|---|
| `baseUrl` | `http://localhost:3000/` |
| `app` | `annotation-app` |
| `prefix` | `annotation` |

#### AnnotationStyle

```ts
import { type AnnotationStyle, AnnotationStyleSchema } from '@ghentcdh/annotation-core';

const style: AnnotationStyle = {
  id: 'highlight-red',
  name: 'Red Highlight',
  target: 'highlight', // 'gutter' | 'underline' | 'highlight'
  color: '#FF0000',
};
```

---

### @ghentcdh/annotation-api

NestJS module that serves annotation definitions and metadata. Definitions are loaded from JSON config files on disk.

#### Module Registration

```ts
import { resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { AnnotationApiModule } from '@ghentcdh/annotation-api';

@Module({
  imports: [
    AnnotationApiModule.forResourceDir(
      resolve(import.meta.dirname, 'annotations'),
      {
        baseUrl: process.env.ANNOTATION_BASE_URL,
        cacheTTLms: 0,
        isDev: false,
        app: process.env.ANNOTATION_APP ?? 'my-app',
        prefix: process.env.ANNOTATION_PREFIX ?? 'my-prefix',
      },
    ),
  ],
})
export class AppModule {}
```

**Parameters:**

| Parameter | Description |
|---|---|
| `dirPath` | Path to directory containing annotation definition JSON files |
| `config` | `AnnotationDefConfig` with optional `isDev` and `cacheTTLms` |

The module registers globally and provides:

- `AnnotationDefinitionService` — load and cache annotation definitions
- `AnnotationNamespaceController` — REST endpoint at `ns/`

#### Annotation Definition JSON

Place JSON files in the annotations directory:

```json
{
  "id": "comment",
  "name": "Comment",
  "color": "#4A90D9",
  "target": "highlight",
  "columns": [
    {
      "id": "text",
      "label": "Comment text",
      "type": { "type": "string" },
      "fieldInput": { "type": "text" }
    }
  ]
}
```

**Advanced example with relationships:**

```json
{
  "id": "lemma",
  "name": "Lemma",
  "color": "#7a8800",
  "isRoot": false,
  "allowedChildren": ["link_bucket"],
  "allowedLinks": ["lemma"],
  "icon": "<svg>...</svg>",
  "columns": [
    {
      "id": "name",
      "label": "name"
    },
    {
      "id": "lemma",
      "label": "Lemma",
      "hiddenInMetadata": false,
      "hiddenInForm": false,
      "displayKey": "name",
      "type": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "label": { "type": "string" }
        }
      },
      "fieldInput": {
        "type": "autocomplete",
        "options": {
          "uri": "/api/lemma?filter=word:",
          "valueKey": "id",
          "labelKey": "label",
          "enableCreate": true
        }
      }
    }
  ]
}
```

**Top-level fields:**

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — | Unique identifier for the annotation type |
| `name` | `string` | — | Display name |
| `color` | `string` | — | Hex color for styling |
| `isRoot` | `boolean` | `true` | Whether this type appears as a top-level annotation option |
| `allowedChildren` | `string[]` | — | IDs of annotation types allowed as children |
| `allowedLinks` | `string[]` | — | IDs of annotation types that can be linked |
| `icon` | `string` | — | SVG string for custom icon |
| `type` | `string` | — | Optional type classifier |
| `target` | `string` | — | `gutter`, `underline`, or `highlight` |

**Supported `fieldInput.type` values:** `text`, `select`, `autocomplete`

#### Directory Structure

Annotation definitions are loaded from a directory where each subfolder represents one annotation type:

```
annotations/
├── person/
│   └── resource.json
├── place/
│   └── resource.json
├── event/
│   └── resource.json
└── _resource/              # optional resource definitions
    ├── persons.json
    └── places.json
```

Each `resource.json` contains an `AnnotationJsonConfig` object.

#### Frontend-Only Usage (No Backend)

Annotation definitions can be built entirely client-side using `@ghentcdh/annotation-core`, without running `@ghentcdh/annotation-api`.

**Static imports:**

```ts
import {
  buildAnnotationDefinitions,
  type AnnotationJsonConfig,
  type AnnotationDefConfig,
} from '@ghentcdh/annotation-core';

import personConfig from './annotations/person/resource.json';
import placeConfig from './annotations/place/resource.json';

const configs: AnnotationJsonConfig[] = [personConfig, placeConfig];

const defConfig: AnnotationDefConfig = {
  baseUrl: 'https://example.org',
  app: 'myapp',
  prefix: 'ann',
  isDev: true,
};

const definitions = buildAnnotationDefinitions(configs, defConfig);
```

**Dynamic loading with Vite:**

Auto-discover all annotation configs without manual imports:

```ts
import {
  buildAnnotationDefinitions,
  type AnnotationJsonConfig,
  type AnnotationDefConfig,
} from '@ghentcdh/annotation-core';

const modules = import.meta.glob('./annotations/*/resource.json', {
  eager: true,
  import: 'default',
});

const configs = Object.values(modules) as AnnotationJsonConfig[];
const definitions = buildAnnotationDefinitions(configs, defConfig);
```

**Example project structure:**

```
src/
└── annotations/
    ├── person/
    │   └── resource.json
    ├── place/
    │   └── resource.json
    └── index.ts            # collect & build all definitions
```

`annotations/index.ts`:

```ts
import {
  buildAnnotationDefinitions,
  type AnnotationJsonConfig,
  type AnnotationDefConfig,
} from '@ghentcdh/annotation-core';

const modules = import.meta.glob('./**/resource.json', {
  eager: true,
  import: 'default',
});

const configs = Object.values(modules) as AnnotationJsonConfig[];

export const loadDefinitions = (defConfig: AnnotationDefConfig) =>
  buildAnnotationDefinitions(configs, defConfig);
```

Then pass result to `<AnnotationEditor :annotation-definitions="definitions" />`.

---

### @ghentcdh/annotation-editor

Vue 3 component for annotating text sources. Renders sources in collapsible panels with inline annotation creation, editing, linking, and deletion.

#### Basic Usage

```vue
<template>
  <AnnotationEditor
    :configuration="configuration"
    :sources="sources"
    :annotations="annotations"
    :annotation-definitions="definitions"
    :selected-annotation-id="selectedAnnotationId"
    :selected-annotation-action="selectedAnnotationAction"
    @create:annotation="onCreate"
    @update:annotation="onUpdate"
    @delete:annotation="onDelete"
    @select:annotation="onSelect"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AnnotationEditor } from '@ghentcdh/annotation-editor';
import { type AnnotationDefConfig } from '@ghentcdh/annotation-core';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import type { SourceModel } from '@ghentcdh/annotation-editor';

const route = useRoute();
const router = useRouter();

const configuration: AnnotationDefConfig = {
  baseUrl: import.meta.env.VITE_ANNOTATION_BASE_URL,
  app: import.meta.env.VITE_ANNOTATION_APP ?? 'my-app',
  prefix: import.meta.env.VITE_ANNOTATION_PREFIX ?? 'my-prefix',
};

// Sources to annotate
const sources: SourceModel[] = [
  {
    id: 'source-1',
    uri: 'https://example.com/text/1',
    type: 'text',
    content: {
      text: 'The text content to annotate.',
      label: 'Source Document',
      textDirection: 'ltr',
      processingLanguage: 'en',
    },
  },
];

// Annotations loaded from your API
const annotations: W3CAnnotation[] = [];

// Annotation type definitions loaded from your API
const definitions = [];

// URL-based annotation selection
const selectedAnnotationId = computed(
  () => route.query.annotationId as string | undefined,
);
const selectedAnnotationAction = computed(
  () => route.query.action as string | undefined,
);

// Event handlers — should call your API and return the updated annotation
const onCreate = (annotation: W3CAnnotation) => {
  // POST to your API, return the created annotation
};
const onUpdate = (annotation: W3CAnnotation) => {
  // PUT to your API, return the updated annotation
};
const onDelete = (annotation: W3CAnnotation) => {
  // DELETE from your API, return the deleted annotation
};

// Sync selection state to URL
const onSelect = (
  annotation: W3CAnnotation | null,
  action: string | null,
) => {
  const query = { ...route.query };
  if (annotation) {
    query.annotationId = annotation.id;
  } else {
    delete query.annotationId;
  }
  if (action) {
    query.action = action;
  } else {
    delete query.action;
  }
  router.replace({ query });
};
</script>
```

#### Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `configuration` | `AnnotationDefConfig` | yes | — | API connection configuration |
| `sources` | `SourceModel[]` | yes | — | Text sources to display and annotate |
| `annotations` | `W3CAnnotation[]` | yes | — | Existing annotations to render |
| `annotationDefinitions` | `AnnotationDefinition[]` | yes | — | Available annotation type definitions |
| `cols` | `number` | no | `2` | Number of source columns in the grid layout |
| `selectedAnnotationId` | `string` | no | — | ID of the currently selected annotation |
| `selectedAnnotationAction` | `string` | no | — | Action for selected annotation (`show` or `edit`) |

#### Events

| Event | Payload | Description |
|---|---|---|
| `create:annotation` | `W3CAnnotation` | User created an annotation. Should return the persisted annotation. |
| `update:annotation` | `W3CAnnotation` | User updated an annotation. Should return the persisted annotation. |
| `delete:annotation` | `W3CAnnotation` | User deleted an annotation. Should return the deleted annotation. |
| `select:annotation` | `(annotation \| null, action \| null)` | Selection changed. Use to sync with URL or external state. |

#### SourceModel

```ts
type SourceModel = {
  id: string;
  uri: string;
  type: 'text';
  content: {
    text: string;
    label?: string;
    textDirection?: 'ltr' | 'rtl';       // default: 'ltr'
    processingLanguage?: string;          // default: 'en'
    offset?: number;                      // default: 0
  };
};
```

## Architecture

```
┌─────────────────────┐
│  annotation-editor  │  Vue 3 UI component
│  (frontend)         │
└────────┬────────────┘
         │ uses types from
┌────────▼────────────┐
│  annotation-core    │  Shared types, Zod schemas, config
└────────┬────────────┘
         │ used by
┌────────▼────────────┐
│  annotation-api     │  NestJS module (serves definitions)
│  (backend)          │
└─────────────────────┘
```

- **annotation-core** is the shared dependency used by both frontend and backend
- **annotation-api** loads annotation definitions from JSON files and serves them via REST
- **annotation-editor** renders sources, annotations, and provides CRUD UI using W3C annotation standard via `@ghentcdh/w3c-utils`

## Development

```bash
# Lint
pnpm nx affected -t lint --base=origin/main

# Test
pnpm nx affected -t test --base=origin/main

# Type check
pnpm nx affected -t typecheck --base=origin/main
```

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

## Credits

Bo Vandersteene, Ghent University.

Development by [Ghent Centre for Digital Humanities - Ghent University](https://www.ghentcdh.ugent.be/). Funded by the [GhentCDH research projects](https://www.ghentcdh.ugent.be/projects).

<img src="https://www.ghentcdh.ugent.be/ghentcdh_logo_blue_text_transparent_bg_landscape.svg" alt="GhentCDH" width="500">
