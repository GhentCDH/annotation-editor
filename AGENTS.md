# Agent guide

Instructions for AI coding agents (Claude Code, Codex, opencode, Copilot). Humans: see `CONTRIBUTING.md`.

## Read first

- `docs/architecture/README.md` — packages, dependency rules, glossary.
- `docs/architecture/frontend.md` — editor component tree, state, events, modals, "where to change what".
- `docs/architecture/backend.md` — NestJS module, endpoints, repository/mapper contract.
- `docs/guide/` — public API usage (keep in sync when you change public behaviour).

## Project overview

- Nx monorepo (`nx@24`), pnpm workspaces. Always use `pnpm` (`pnpm nx ...`, `pnpm install`).
- Packages (`packages/`):

| Package             | Published | Role                                                                  |
|---------------------|-----------|-----------------------------------------------------------------------|
| `annotation-core`   | yes (ESM) | Framework-free types + Zod schemas shared by API and UI.              |
| `annotation-ui`     | no        | `EditorAnnotation`, `AnnotationTransformer`, W3C transformer, definition → UI mapping. |
| `annotation-editor` | no        | `AnnotationEditor` Vue component (state, events, modals). No data loading. |
| `annotation-vue`    | yes (ESM) | What apps install. Bundles ui + editor; `SmartAnnotationEditor`, loaders, status page. |
| `annotation-api`    | yes (ESM+CJS) | NestJS `AnnotationApiModule` on top of crouton-api.               |

- Layering: `core` ← `ui` ← `editor` ← `vue`; `api` → `core` only. `core` imports no Vue/NestJS. Enforced by
  `@nx/enforce-module-boundaries`.
- Key deps: `@ghentcdh/crouton-*` (resources, UI, API), `@ghentcdh/annotated-text` (text rendering),
  `@ghentcdh/w3c-utils`, `zod@4`.

## Verify before finishing

```
pnpm nx run-many -t lint typecheck test build
pnpm knip
```

Same checks as CI. Husky pre-commit runs `nx affected -t lint --fix`.

## Code style

- TypeScript strict mode, pnpm, NX conventions
- Prefer `type` over `interface`
- Prefer arrow functions: `const fn = () => {}`
- Prefer type-only imports: `import { type Foo } from './bar'`
- Prettier: single quotes. ESLint flat config with `@nx/enforce-module-boundaries`
- `no-console` enforced (only `warn`/`error` allowed)

## Vue

- Vue 3.5 with `<script setup lang="ts">`. `<template>` first, then `<script setup>`
- Component: `Name.vue` + `Name.properties.ts`
- Props: Vue object syntax with `PropType`, always explicit `required: true as const` / `required: false as const`
- Always use `required: true as const` (literal `true`) so `ExtractPublicPropTypes` correctly marks required props as non-optional
- Always use `ExtractPublicPropTypes` (never `ExtractPropTypes`) for props type extraction
- Export `ExtractPublicPropTypes<typeof XProps>`, emits type, and `EmitFn` from properties file — but only the ones
  something imports: knip fails CI on unused exports:

```ts
export const XProps = {
  options: { type: Array as PropType<T[]>, required: true as const },
  label: { type: String, required: false as const, default: 'label' },
};
export type XPropsType = ExtractPublicPropTypes<typeof XProps>;
export const XEmits = {
  'update:modelValue': (_v: unknown) => true,
  select: (_item: unknown) => true,
};
export type XEmitsType = typeof XEmits;
export type XEmitsFn = EmitFn<XEmitsType>;
```

- Composables in `composables/` folder next to component. Naming: `useFeatureName.ts`

## Testing

- Vitest with globals. `annotation-editor`: jsdom environment. `annotation-core`: node environment
- `describe`/`it` blocks. Mock with `vi.fn()`/`vi.spyOn()`
- Prefer `it.each` tagged template literal for tabular data. Array syntax only for complex objects
- Co-locate tests as `*.spec.ts` in `__tests__/` next to source

## Git

- Conventional Commits

## Agent tooling in this repo

- `.claude/skills/` — project skills (build, test, lint, typecheck, verify, component, composable, schema,
  test-file, doc, modal, annotation-event). Plain markdown: other agents can read them as recipes.
- `.agents/`, `.opencode/`, `.codex/`, `.github/skills|agents|prompts` — Nx-generated agent config
  (`nx configure-ai-agents`). Do not edit by hand; regenerate.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
