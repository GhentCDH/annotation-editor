# @ghentcdh/annotation-vue

Vue 3 components for editing W3C annotations on text. This is the package apps install: it bundles the editor
and re-exports `@ghentcdh/annotation-core`.

**Docs:** https://ghentcdh.github.io/annotation-editor/

## Install

```sh
pnpm add @ghentcdh/annotation-vue
```

Peer dependencies: `vue@^3.5`, `vue-router@^5`, `zod@^4`, `@ghentcdh/w3c-utils`.

## What's inside

| Export                                                    | Guide                                                         |
|-----------------------------------------------------------|---------------------------------------------------------------|
| `SmartAnnotationEditor`, `AnnotationEditorLoader`         | [SmartAnnotationEditor](https://ghentcdh.github.io/annotation-editor/guide/smart-annotation-editor.html) |
| `AnnotationEditor`                                        | [AnnotationEditor](https://ghentcdh.github.io/annotation-editor/guide/annotation-editor.html)           |
| `provideAnnotationDefinitions`, `useAnnotationDefinitions`, `loadAnnotationDefinitionsFrom*`, `AnnotationDefinitionService` | [Annotation definitions](https://ghentcdh.github.io/annotation-editor/guide/annotation-definitions.html) |
| `AnnotationStatusRoutes`, `AnnotationDefinitionsStatusView` | [Annotation definitions → status page](https://ghentcdh.github.io/annotation-editor/guide/annotation-definitions.html#the-status-page-pattern) |
| `AnnotationFilter`, `w3cAnnotationTransformer`, `parseAnnotations` | [SmartAnnotationEditor](https://ghentcdh.github.io/annotation-editor/guide/smart-annotation-editor.html) |

Styles: `import '@ghentcdh/annotation-vue/styles.css'` (see the quick start).

## Develop

```sh
pnpm nx build annotation-vue
pnpm nx test annotation-vue
```
