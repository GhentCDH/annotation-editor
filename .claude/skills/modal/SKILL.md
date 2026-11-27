---
name: modal
description: Add a new modal to AnnotationEditor using the typed modal machinery (AnnotationModalActionMap + annotationModalDefaults). Use when a user action needs a dialog, card or toast in the editor.
---

Read `docs/architecture/frontend.md#modal-machinery` first. `$ARGUMENTS` = modal key (kebab-case) + purpose.

All paths below are in `packages/annotation-editor/src/lib/modals/`.

1. Create `<key>/`:
   - `<Name>Modal.vue` + `<Name>Modal.properties.ts` (follow the `component` skill). The properties file exports
     three types: the modal `data`, the `show` payload and the close event.
   - `use<Name>.ts` returning `AnnotationModalFn<DATA, SHOW, CLOSE>` (types in `AnnotationModal.definition.ts`).
     Copy the shape of an existing one, e.g. `confirm/useConfirm.composable.ts`.
2. Register in `AnnotationModal.defaults.ts`:
   - add `'<key>': ModalTypeConfig<DATA, SHOW, CLOSE>` to `AnnotationModalActionMap`;
   - add `'<key>': { component, useFn }` to `annotationModalDefaults` (and its type annotation).
3. Open it where needed: `config.modal.show('<key>', payload)` → `Promise<CLOSE | null>`. From user actions this
   is usually inside a handler in `composables/annotation.events.ts` (see the `annotation-event` skill).
4. Add a spec in `__tests__/` next to the composable; existing modal transition specs show the pattern.
5. Run `pnpm nx test annotation-editor && pnpm nx typecheck annotation-editor`.

Do not render the component manually: `AnnotationModal.vue` renders every registered modal.
