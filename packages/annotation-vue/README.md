# @ghentcdh/annotation-vue

Vue 3 package for working with annotation definitions client-side — no NestJS backend required. Loads JSON annotation
configs, builds definitions via `@ghentcdh/annotation-core`, and exposes them as reactive Vue composables using
provide/inject.

## Install

Peer dependencies:

```
vue >= 3.5
@ghentcdh/annotation-core
@ghentcdh/w3c-utils
vue-router >= 4  (optional — only needed for router plugin)
```

## Usage

### Provide/inject pattern

Call `provideAnnotationDefinitions` once at the root component. All descendants use `useAnnotationDefinitions()` to
inject.

**Root component (provide):**

```vue

<template>
  <slot />
</template>

<script setup lang="ts">
  import { provideAnnotationDefinitions } from '@ghentcdh/annotation-vue';

  // import.meta.glob must be a string literal — call it here, pass result in
  const resourceFolder = import.meta.glob('./configs/*.json', { eager: true });

  const { definitions } = provideAnnotationDefinitions({
    config: {
      baseUrl: 'http://localhost:3000/',
      app: 'myapp',
      prefix: 'myapp',
      isDev: true,
      cacheTTLms: 0,
    },
    resourceFolder, // auto-loads definitions on creation
  });
</script>
```

**Child component (inject):**

```vue

<template>
  <div v-for="def in definitions" :key="def.id">
    {{ def.label }}
  </div>
</template>

<script setup lang="ts">
  import { useAnnotationDefinitions } from '@ghentcdh/annotation-vue';

  // No options needed — state is injected from ancestor
  const { definitions, getDefinitionById } = useAnnotationDefinitions();
</script>
```

### provideAnnotationDefinitions options

| Option                 | Type                       | Required | Description                                        |
|------------------------|----------------------------|----------|----------------------------------------------------|
| `config`               | `AnnotationDefConfig`      | yes      | Base URL, app name, prefix, cache settings         |
| `resourceFolder`       | `GlobModules`              | no       | `import.meta.glob` result — auto-loads on creation |
| `createHighlightStyle` | `(def) => AnnotationStyle` | no       | Custom style builder                               |
| `factory`              | `ContextBuilderFactory`    | no       | Custom context builder factory                     |

### Returned state (both provide and inject)

| Property              | Type                                                   | Description                             |
|-----------------------|--------------------------------------------------------|-----------------------------------------|
| `definitions`         | `ComputedRef<VueAnnotationDefinition[]>`               | All definitions, reactively transformed |
| `definitionsMap`      | `ComputedRef<Record<string, VueAnnotationDefinition>>` | Definitions keyed by ID                 |
| `getDefinitionById`   | `(id: string) => VueAnnotationDefinition \| undefined` | Lookup by ID                            |
| `loadFromGlob`        | `(modules: GlobModules) => void`                       | Load from `import.meta.glob` result     |
| `loadFromConfigs`     | `(configs: AnnotationJsonConfig[]) => void`            | Load from config array                  |
| `loadFromDefinitions` | `(defs: CoreAnnotationDefinition[]) => void`           | Load pre-built definitions              |
| `service`             | `AnnotationDefinitionService`                          | Underlying synchronous service          |

### Loading definitions manually

If you don't pass `resourceFolder`, load later:

```ts
const state = provideAnnotationDefinitions({ config });

// From glob
const modules = import.meta.glob('./configs/*.json', { eager: true });
state.loadFromGlob(modules);

// From config array
state.loadFromConfigs([
  { id: 'comment', name: 'Comment', color: '#ff0000' },
  { id: 'entity', name: 'Entity', color: '#00ff00', allowedChildren: ['comment'] },
]);

// From pre-built core definitions
state.loadFromDefinitions(coreDefinitions);
```

### VueAnnotationDefinition

Enriched version of core `AnnotationDefinition`, with:

- `label` — mapped from core `name`
- `style: AnnotationStyle` — built from `id`, `name`, `color`, `target`
- `schema: FormValidationDef` — wraps `ui_schema`, `json_schema`, `metadata_schema`
- `allowedChildren: KeyLabel[]` — string IDs resolved to `{ key, label, icon? }` objects
- `allowedLinks: KeyLabel[]` — same resolution
- `_core` — raw reference to the core `AnnotationDefinition`

### Custom highlight styles

```ts
provideAnnotationDefinitions({
  config,
  resourceFolder,
  createHighlightStyle: (def) => ({
    id: def.id,
    name: def.name,
    color: def.color,
    target: def.target ?? 'highlight',
  }),
});
```

### AnnotationDefinitionService

Synchronous, plain TS class (no NestJS dependency). Mirrors API service interface:

```ts
import { AnnotationDefinitionService } from '@ghentcdh/annotation-vue';

const service = new AnnotationDefinitionService(definitions);

service.findAll();              // AnnotationDefinition[]
service.findById('comment');    // AnnotationDefinition | undefined
service.findAllGrouped();       // Record<string, AnnotationDefinition>
service.getAllContextBuilders(); // unknown[]
service.getContextBuilder(id);  // unknown | undefined
service.setDefinitions(defs);   // replace all definitions
```

### Router plugin (optional, requires `vue-router`)

Registers Vue Router routes that mirror the NestJS `AnnotationNamespaceController` endpoints. Useful for serving
annotation definitions client-side without a backend.

```ts
import { createRouter, createWebHistory } from 'vue-router';
import {
  AnnotationNamespacePlugin,
  AnnotationDefinitionService,
} from '@ghentcdh/annotation-vue';

const service = new AnnotationDefinitionService(definitions);
const router = createRouter({ history: createWebHistory(), routes: [] });

// Option A: Vue plugin
app.use(AnnotationNamespacePlugin, {
  router,
  service,
  basePath: '/ns',   // default: '/ns'
  config,            // optional AnnotationDefConfig for AnnotationStyle context
});

// Option B: Direct install
import { installAnnotationNamespaceRoutes } from '@ghentcdh/annotation-vue';

installAnnotationNamespaceRoutes(router, service, { basePath: '/ns' });
```

Registered routes:

| Path                    | Name                        | Description                   |
|-------------------------|-----------------------------|-------------------------------|
| `/ns`                   | `annotation-ns-all`         | All definitions               |
| `/ns/anno.jsonld`       | `annotation-ns-all-jsonld`  | All JSON-LD contexts          |
| `/ns/:id.jsonld`        | `annotation-ns-jsonld`      | Single JSON-LD context        |
| `/ns/:type/anno.jsonld` | `annotation-ns-type-jsonld` | JSON-LD + forms for type      |
| `/ns/:id/schemas`       | `annotation-ns-schemas`     | Schemas subset for definition |
| `/ns/:id`               | `annotation-ns-by-id`       | Single definition             |

### Path helpers

Generate URL paths without installing routes:

```ts
import { createAnnotationNamespacePaths } from '@ghentcdh/annotation-vue';

const paths = createAnnotationNamespacePaths('/ns');
paths.all;              // '/ns'
paths.allJsonLd;        // '/ns/anno.jsonld'
paths.byId('comment');  // '/ns/comment'
paths.jsonLdById('comment'); // '/ns/comment.jsonld'
paths.schemasById('comment'); // '/ns/comment/schemas'
```

## Resolve defintions from third party server

```ts
                                                                                                                              │
│ // Simple — single app.use()                                                                                                        │
│ app.use(AnnotationPlugin, {                                                                                                         │
│   config: annotationDefConfig,                                                                                                      │
│   router,                                                                                                                           │
│   definitionsUrl: '/api/ns',                                                                                                        │
│
})
;                                                                                                                                 │
│                                                                                                                                     │
│ // Custom fetch (auth headers, axios, etc.)                                                                                         │
│ app.use(AnnotationPlugin, {                                                                                                         │
│   config: annotationDefConfig,                                                                                                      │
│   router,                                                                                                                           │
│   definitionsUrl: '/api/ns',                                                                                                        │
│   fetchFn: async (url) => {                                                                                                         │
│     const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });                                       │
│     return data;                                                                                                                    │
│
},                                                                                                                                │
│
})
;                     
```

## Package structure

```
src/
  index.ts                              # Barrel export
  lib/
    types/
      annotation-vue.types.ts           # KeyLabel, FormValidationDef, VueAnnotationDefinition
    service/
      annotation-definition.service.ts  # Synchronous definition service
    loader/
      annotation-definition.loader.ts   # import.meta.glob + config array loaders
    composables/
      useAnnotationDefinitions.ts       # Provide/inject composable
    router/
      annotation-namespace.routes.ts    # Route records + path helpers
      annotation-namespace.plugin.ts    # Vue Router plugin
```

## Build & test

```sh
pnpm nx build annotation-vue
pnpm nx test annotation-vue
pnpm nx lint annotation-vue
```
