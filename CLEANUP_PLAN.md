# Cleanup & Optimization Plan — annotation-editor

_Nx + pnpm monorepo · Vue 3 UI libs + NestJS API · ~129 source files across 7 packages._
_Analysis: `knip` + manual verification. Updated: 2026-09-02._

> **Method note:** `knip` ran with its ESLint/Vite/Vitest plugins disabled (native-binding
> issue under `pnpm dlx`). Everything marked **verified** was checked by hand; items marked
> **verify first** are raw knip output that could be a config artifact. Phase 9 wires a
> properly-configured knip into CI as the durable check.
>
> Each phase is independent and ends green. Do them in order; commit after each.

---

## Phase 1 — Remove stray root junk _(risk: none)_
**Goal:** drop 0-byte scratch files.
- Delete `_tmp_19_c0ab22cb16bbe305ff11c7606809763b` and `_tmp_77_65158685dcde1e26a9384403aecf1aa9`.
- Add `_tmp_*` (and confirm `tmp/`) to `.gitignore`.
- **Verify:** `git status` clean of these; nothing references them.

---

## Phase 2 — Remove deprecated re-export shims _(risk: low)_
**Goal:** finish the package split — delete the 7 `@deprecated` 4-line `export *` files in `annotation-editor`.
Files:
```
src/lib/composables/annotationConfiguration.ts
src/lib/modals/AnnotationModal.definition.ts
src/lib/modals/annotationModal.composable.ts
src/lib/types/AnnotationConfiguration.model.ts
src/lib/types/source.model.ts
src/lib/utils/annotation-utils.ts
src/lib/utils/mouse-events.ts
```
- First remove the redundant re-export lines in `annotation-editor/src/index.ts`
  (`./lib/types/source.model`, `./lib/types/AnnotationConfiguration.model`) — the same symbols
  already arrive via `export * from '@ghentcdh/annotation-ui'`.
- Delete the 7 files.
- **Verify:** `grep -rn "@deprecated" packages/annotation-editor/src` returns nothing; `pnpm nx build annotation-editor`.

---

## Phase 3 — Remove other verified dead files _(risk: low)_
**Goal:** delete components with zero references.
- `annotation-editor/src/lib/modals/no-modal/NoModal.vue` — no references anywhere.
- `annotation-ui/src/lib/utils/annotation.style.ts` — only "use" is a commented-out export in `annotation-ui/src/index.ts:9`; delete the file and that comment line.
- **Verify:** `pnpm nx run-many -t build test`.

---

## Phase 4 — Remove verified unused dependencies _(risk: low)_
**Goal:** drop deps with no imports anywhere in source.
| Remove from root `package.json` | Type |
|---|---|
| `memoizee` | dev |
| `vee-validate` | dep |
| `@ghentcdh/crouton-api` | dep |
| `@ghentcdh/create-crouton` | dep |
- `pnpm remove <pkg>` for each, then `pnpm install`.
- **Verify:** `pnpm nx run-many -t build test lint`.

---

## Phase 5 — Fix missing dependency declarations _(risk: low, correctness)_
**Goal:** declare what's imported but undeclared.
- `@ghentcdh/annotation-vue` — imported in `annotation-editor/.../AnnotationForm.vue`, missing from `annotation-editor/package.json`. Add it.
- `@ghentcdh/annotation-editor` — used across `annotation-editor-e2e`, missing from its `package.json`. Add it.
- ✅ `@ghentcdh/crouton-forms-vue` — **already handled** (you removed it; no imports remain).
- **Verify:** `pnpm install` && `pnpm nx run-many -t build`.

---

## Phase 6 — Fix fragile cross-repo e2e imports _(risk: medium, correctness)_
**Goal:** stop reaching into a sibling checkout that isn't in the repo.
- `annotation-editor-e2e/src/testing/index.ts` imports
  `../../../../../ghentcdh/libs/ui/src/testing/{Harness,CollapseHarness,ModalHarness}` —
  breaks on any clean clone.
- Replace with an import from the published `@ghentcdh/ui` package (already a devDependency), or vendor the harness into the e2e package.
- **Verify:** `pnpm nx e2e annotation-editor-e2e` (or at least `nx build`/typecheck) resolves without the relative path.

---

## Phase 7 — Trim unused export surface _(risk: low, review each)_
**Goal:** shrink public API + generated `.d.ts`. For each, decide **public API → keep** vs **internal → drop `export`**.
- **Values (7):** `CURRENT_RESOURCE_VERSION` (annotation-core version.ts), `SourceEditEmits`, `Confirm`, `AnnotationEdit`, `LinkAnnotation`, `ToastCard`, `byRole` (e2e).
- **Types (16):** `NavbarProps`, `SourceEditProps`, `SourceEditEmitsType`, `SourceNavbarProps`, `SourceNavbarEmitsType`, `EditorState`, `AnnotationModalActionMap`, `AnnotationModalAction`, `AnnotationModalDefaults`, `AnnotationModalPropsType`, `ConfirmAction`, `ToastAction`, `EditToastEmitsType`, `PreviewSelectEvent`, `PreviewState`, `GridLayout`.
- ⚠️ Many `*Props`/`*EmitsType` are convention-required exports (per `CLAUDE.md`) — review, don't mass-delete.
- **Verify:** `pnpm nx run-many -t build test`.

---

## Phase 8 — Verify-then-remove ambiguous deps _(risk: medium)_
**Goal:** remove only after confirming each is truly unused.
- `@tiptap/markdown` **vs** `tiptap-markdown` — neither imported directly; keep whichever the tiptap editor config loads, drop the other.
- `@types/uuid` — `uuid@14` ships its own types; likely removable.
- `vite-plugin-static-copy`, `vite-tsconfig-paths`, `@typescript-eslint/parser`, `@swc/helpers`, `@vue/test-utils`, `vue-tsc` — check each package's vite/eslint/test config before removing (may be used indirectly).
- **Do NOT touch (knip false positives, used by build/docs/lint):** `vuepress*`, `tailwindcss`, `@tailwindcss/vite`, `@vitejs/plugin-vue`, `vite-plugin-dts`, `eslint-plugin-vue`, `typescript-eslint`, `@eslint/js`, `jsonc-eslint-parser`, `eslint-plugin-import-x`, `prettier`.
- **Verify:** full `build test lint` + `nx build docs`.

---

## Phase 9 — Wire knip into CI _(risk: none, locks in the cleanup)_
**Goal:** make §1–§8 self-maintaining.
- Add a checked-in `knip.json` (adjust the ESLint & Vite plugins so it loads inside the workspace where native bindings resolve).
- Add a root script `"knip": "knip"` and an `nx` target / CI step that fails PRs on new unused code, exports, or deps.
- **Verify:** `pnpm knip` runs clean after Phases 1–8.

---

## Phase 10 — Housekeeping _(risk: none)_
**Goal:** developer ergonomics.
- Root `package.json` only has `prepare`; add `build`/`test`/`lint`/`knip` scripts delegating to nx.
- Final: `pnpm nx run-many -t build test lint e2e` green, then open PR.

---

### Quick-win path
Phases 1 → 2 → 3 → 4 → 5 are all low-risk and deliver most of the cleanup; Phases 6–8 are
per-item review; Phase 9 prevents regressions.
