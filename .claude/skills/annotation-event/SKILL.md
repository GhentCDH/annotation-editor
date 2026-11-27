---
name: annotation-event
description: Add or change a user action on annotations in AnnotationEditor (create, edit, delete, select, link…) via sendAnnotationEvent. Use when the editor needs a new interaction or an existing one behaves wrong.
---

Read `docs/architecture/frontend.md#annotation-events` first. All actions go through one dispatcher:
`packages/annotation-editor/src/lib/composables/annotation.events.ts`.

To add an event:

1. Add the payload type and a key to `AnnotationEvents`.
2. Write a handler `(data, config, state, emits) => void` next to the others. Rules the existing handlers follow:
   - return early when `state.disableEdits`; set it to `true` while a modal is open; call `state.show()` when done;
   - open UI only via `config.modal.show(...)` (new dialog → `modal` skill);
   - tell the parent via `emits(...)`. New emit → add it to `AnnotationEditorEmits` in `AnnotationEditor.properties.ts`
     and document it in `docs/guide/annotation-editor.md#events`.
   - never call the backend here; saving happens in modals via `useAnnotationResource`.
3. Add a `case` in `sendAnnotationEvent`.
4. Trigger it from a component with `useEditorState().sendAnnotationEvent('<event>', data)`.
5. Spec in `composables/__tests__/` (mock `config.modal.show` with `vi.fn()`; assert emits + state).
6. Run `pnpm nx test annotation-editor && pnpm nx typecheck annotation-editor`.

If `SmartAnnotationEditor` must react (e.g. reload), wire the new emit in
`packages/annotation-vue/src/lib/smart-editor/SmartEditor.vue`.
