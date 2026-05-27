import { expect, test } from '@playwright/test';
import { AnnotationEditorHarness } from '../harness/AnnotationEditorHarness';
import { AnnotationEditorPage } from '../fixtures/AnnotationEditorPage';

// ---------------------------------------------------------------------------
// /editor — two sources, three annotations
// ---------------------------------------------------------------------------

test.describe('AnnotationEditor — /editor', () => {
  test('renders one collapse panel per source', async ({ page }) => {
    const fx = AnnotationEditorPage.init(page);
    await fx.goto('/editor');

    const editor = AnnotationEditorHarness.for(page);
    expect(await editor.sourcePanelCount()).toBe(2);
    expect(await fx.sourceCount()).toBe(2);
  });

  test('source panels are collapsed by default', async ({ page }) => {
    await page.goto('/editor');

    const editor = AnnotationEditorHarness.for(page);
    const panel1 = editor.sourcePanel('Latin Text');
    const panel2 = editor.sourcePanel('Translation');

    expect(await panel1.isOpen()).toBe(false);
    expect(await panel2.isOpen()).toBe(false);
  });

  test('expanding a panel reveals its content', async ({ page }) => {
    await page.goto('/editor');

    const editor = AnnotationEditorHarness.for(page);
    const panel = editor.sourcePanel('Latin Text');

    await panel.toggle();

    expect(await panel.isOpen()).toBe(true);
    await expect(panel.content()).toBeVisible();
  });

  test('toggling a panel twice collapses it again', async ({ page }) => {
    await page.goto('/editor');

    const editor = AnnotationEditorHarness.for(page);
    const panel = editor.sourcePanel('Latin Text');

    await panel.toggle();
    await panel.toggle();

    expect(await panel.isOpen()).toBe(false);
  });

  test('panel titles match source labels', async ({ page }) => {
    await page.goto('/editor');

    const editor = AnnotationEditorHarness.for(page);
    await expect(editor.sourcePanel('Latin Text').title()).toHaveText(
      'Latin Text',
    );
    await expect(editor.sourcePanel('Translation').title()).toHaveText(
      'Translation',
    );
  });

  test('probe shows pre-loaded annotations', async ({ page }) => {
    const fx = AnnotationEditorPage.init(page);
    await fx.goto('/editor');

    const annotations = await fx.annotations<unknown[]>();
    expect(annotations).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
// /editor-empty — single source, no annotations
// ---------------------------------------------------------------------------

test.describe('AnnotationEditor — /editor-empty', () => {
  test('renders one source panel', async ({ page }) => {
    const fx = AnnotationEditorPage.init(page);
    await fx.goto('/editor-empty');

    expect(await fx.sourceCount()).toBe(1);
  });

  test('starts with no annotations', async ({ page }) => {
    const fx = AnnotationEditorPage.init(page);
    await fx.goto('/editor-empty');

    const annotations = await fx.annotations<unknown[]>();
    expect(annotations).toHaveLength(0);
  });

  test('event log starts empty', async ({ page }) => {
    const fx = AnnotationEditorPage.init(page);
    await fx.goto('/editor-empty');

    const events = await fx.events();
    expect(events).toHaveLength(0);
  });

  test('expand the panel and the source navbar is visible', async ({
    page,
  }) => {
    await page.goto('/editor-empty');

    const editor = AnnotationEditorHarness.for(page);
    const panel = editor.sourcePanel('Latin Text');
    await panel.toggle();

    // The SourceNavbar contains annotation-type buttons; at least the content wrapper is visible
    await expect(panel.content()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// /editor-selected — pre-selected annotation opens the info modal on load
// ---------------------------------------------------------------------------

test.describe('AnnotationEditor — /editor-selected', () => {
  test('info modal is visible on load for the pre-selected annotation', async ({
    page,
  }) => {
    await page.goto('/editor-selected');

    const editor = AnnotationEditorHarness.for(page);
    const modal = editor.annotationModal();

    await expect(modal.asLocator()).toBeVisible();
  });

  test('probe reflects the pre-selected annotation id', async ({ page }) => {
    const fx = AnnotationEditorPage.init(page);
    await fx.goto('/editor-selected');

    const selected = await fx.selected();
    expect(selected).toBe('mela:annotation/1');
  });

  test('closing the modal hides the dialog', async ({ page }) => {
    await page.goto('/editor-selected');

    const editor = AnnotationEditorHarness.for(page);
    const modal = editor.annotationModal();

    await modal.clickClose();
    await expect(modal.asLocator()).toBeHidden();
  });
});
