# Conventions

## Project overview

- NX monorepo (`nx@22.7.1`) with npm workspaces
- Packages: `annotation-api` (NestJS API), `annotation-core` (types + Zod validation), `annotation-editor` (Vue 3 UI library)
- Build: Vite with `vite-plugin-dts`. `annotation-editor` outputs CJS + ESM, `annotation-core` outputs ESM
- Dependencies: `@ghentcdh/w3c-utils`, `zod@4`

## Code style

- TypeScript strict mode, npm, NX conventions
- Prefer `type` over `interface`
- Prefer arrow functions: `const fn = () => {}`
- Prefer type-only imports: `import { type Foo } from './bar'`
- Prettier: single quotes. ESLint flat config with `@nx/enforce-module-boundaries`
- `no-console` enforced (only `warn`/`error` allowed)

## Vue

- Vue 3.5 with `<script setup lang="ts">`. `<template>` first, then `<script setup>`
- Component: `Name.vue` + `Name.properties.ts`
- Props: Vue object syntax with `PropType`, always explicit `required: true/false`
- Export `ExtractPublicPropTypes<typeof XProps>` and emits type from properties file:

```ts
export const XProps = { options: { type: Array as PropType<T[]>, required: true }, label: { type: String, required: false, default: 'label' } };
export type XPropsType = ExtractPublicPropTypes<typeof XProps>;
export const XEmits = { 'update:modelValue': (_v: any) => true, select: (_item: any) => true };
export type XEmitsType = typeof XEmits;
```

- Composables in `composables/` folder next to component. Naming: `useFeatureName.ts`

## Testing

- Vitest with globals. `annotation-editor`: jsdom environment. `annotation-core`: node environment
- `describe`/`it` blocks. Mock with `vi.fn()`/`vi.spyOn()`
- Prefer `it.each` tagged template literal for tabular data. Array syntax only for complex objects
- Co-locate tests as `*.spec.ts` in `__tests__/` next to source

## Git

- Conventional Commits

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring workspace, invoke `nx-workspace` skill first — has patterns for querying projects, targets, dependencies
- When running tasks (build, lint, test, e2e, etc.), always run through `nx` (`nx run`, `nx run-many`, `nx affected`) instead of underlying tooling directly
- Prefix nx commands with workspace package manager (e.g., `pnpm nx build`, `npm exec nx test`) — avoids globally installed CLI
- You have access to Nx MCP server and its tools, use them
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file — proceed without if unavailable.
- NEVER guess CLI flags — always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things already known
- `nx-generate` skill handles generator discovery internally — don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->