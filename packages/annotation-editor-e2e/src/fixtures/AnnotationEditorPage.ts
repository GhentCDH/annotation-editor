import type { Page } from '@playwright/test';

/**
 * Page object for the annotation-editor-e2e playground.
 *
 * Specs navigate to one of the component routes, then drive the rendered
 * editor via `AnnotationEditorHarness`. This fixture is intentionally thin —
 * it wraps `goto` and the `data-testid` probe readers that the playground
 * views expose.
 */
export class AnnotationEditorPage {
  static init(page: Page): AnnotationEditorPage {
    return new AnnotationEditorPage(page);
  }

  private constructor(readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /** Read the current annotations array from the hidden probe element. */
  async annotations<T = unknown[]>(): Promise<T> {
    return this.probe<T>('annotations');
  }

  /** Read the event log from the hidden probe element. */
  async events<T = Array<{ type: string; id: string }>>(): Promise<T> {
    return this.probe<T>('events');
  }

  /** Read the currently selected annotation id. */
  async selected(): Promise<string | null> {
    return this.probe<string | null>('selected');
  }

  /** Read the number of sources rendered. */
  async sourceCount(): Promise<number> {
    return this.probe<number>('source-count');
  }

  /** Read an arbitrary `[data-testid]` probe and parse as JSON. */
  async probe<T = unknown>(testid: string): Promise<T> {
    const raw = await this.page
      .locator(`[data-testid="${testid}"]`)
      .textContent();
    return JSON.parse(raw ?? 'null') as T;
  }
}
