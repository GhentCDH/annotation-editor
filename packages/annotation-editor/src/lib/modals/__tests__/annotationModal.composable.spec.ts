import { describe, expect, it, vi } from 'vitest';

import {
  type AnnotationModalAction,
  annotationModalDefaults,
} from '../AnnotationModal.defaults';
import { createModalConfig } from '../annotationModal.composable';

describe('createModalConfig', () => {
  it('should create a modal state for every default modal', () => {
    const config = createModalConfig(annotationModalDefaults);

    expect(config.modals.map((modal) => modal.key).sort()).toEqual(
      [
        'confirm',
        'edit-annotation',
        'info-card',
        'link-annotation',
        'toast',
      ].sort(),
    );
  });

  it('should warn and return null for an unknown modal key', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const config = createModalConfig(annotationModalDefaults);

    expect(config.getModal('unknown-modal' as AnnotationModalAction)).toBeNull();
    expect(warn).toHaveBeenCalledWith('Modal unknown-modal not found');
  });

  it('should resolve a pending show promise once the modal is closed', async () => {
    const config = createModalConfig(annotationModalDefaults);

    const pending = config.show('toast', { toastMessage: 'Saving your changes' });
    config.close('toast');

    await expect(pending).resolves.toBeUndefined();
  });
});
