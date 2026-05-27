import type { Locator, Page } from '@playwright/test';
import { CollapseHarness, ModalHarness, Harness } from '../testing';

/**
 * Drives the `AnnotationEditor` root component.
 *
 * The editor renders a CSS grid of `Collapse` panels (one per source) and an
 * `AnnotationModal` portal. This harness composes `CollapseHarness` and
 * `ModalHarness` from `@ghentcdh/ui/testing` to stay consistent with the
 * testing pattern used across the ghentcdh monorepo.
 *
 * Usage:
 *   const editor = AnnotationEditorHarness.for(page);
 *   const panel = editor.sourcePanel('Latin Text');
 *   await panel.toggle();
 *   expect(await panel.isOpen()).toBe(true);
 */
export class AnnotationEditorHarness extends Harness {
  /** Wrap the entire page — there is typically one editor per route. */
  static for(page: Page): AnnotationEditorHarness {
    // The editor root is the first grid container rendered by AnnotationEditor.vue
    return new AnnotationEditorHarness(page.locator('[data-testid="annotation-editor"]'));
  }

  /** Wrap an explicit locator (useful when multiple editors exist on a page). */
  static scoped(locator: Locator): AnnotationEditorHarness {
    return new AnnotationEditorHarness(locator);
  }

  // ── Source panels ─────────────────────────────────────────────────────

  /**
   * Return a `CollapseHarness` for the source panel with the given title.
   * Titles come from `source.content.label`.
   */
  sourcePanel(title: string): CollapseHarness {
    return CollapseHarness.byTitle(this.locator, title);
  }

  /** Count source panels currently rendered. */
  async sourcePanelCount(): Promise<number> {
    // Each Collapse root contains an aria-labeled toggle checkbox
    return this.locator.locator('input[type="checkbox"]').count();
  }

  // ── Modals ────────────────────────────────────────────────────────────

  /** The currently visible annotation modal (info-card, edit, confirm…). */
  annotationModal(): ModalHarness {
    return ModalHarness.current(this.page());
  }

  /** Annotation modal resolved by its title text. */
  annotationModalByTitle(title: string): ModalHarness {
    return ModalHarness.byTitle(this.page(), title);
  }

  // ── Navbar ────────────────────────────────────────────────────────────

  /**
   * Source navbar button that triggers annotation creation.
   * The button label matches the annotation definition label.
   */
  createAnnotationButton(sourceTitle: string, annotationType: string): Locator {
    const panel = this.sourcePanel(sourceTitle);
    return panel.asLocator().getByRole('button', { name: annotationType });
  }
}
