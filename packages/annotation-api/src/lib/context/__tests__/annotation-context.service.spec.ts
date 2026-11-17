import { resolveConfig } from '@ghentcdh/annotation-core';
import { type ResourceConfigRegistry } from '@ghentcdh/crouton-api';

import {
  AnnotationContextService,
  type AnnotationRegistryResource,
} from '../annotation-context.service';

const resource = (name: string, title: string) =>
  ({
    name,
    title,
    annotation: { target: 'highlight', color: '#000', type: name },
  }) as unknown as AnnotationRegistryResource;

const createService = () => {
  const registry = {
    getAll: vi
      .fn()
      .mockResolvedValue([
        resource('animals', 'Animals'),
        resource('emotion', 'Emotion'),
      ]),
  } as unknown as ResourceConfigRegistry<AnnotationRegistryResource>;
  const config = resolveConfig({ baseUrl: 'http://test/', prefix: 'test' });
  return { service: new AnnotationContextService(registry, config), registry };
};

describe('AnnotationContextService', () => {
  it.each`
    id           | label
    ${'animals'} | ${'Animals'}
    ${'emotion'} | ${'Emotion'}
  `('finds $id by resource name', async ({ id, label }) => {
    const { service } = createService();

    const context = await service.findById(id);

    expect(context?.id).toBe(id);
    expect(context?.styling).toMatchObject({ id, name: label });
  });

  it('returns null for an unknown id', async () => {
    const { service } = createService();

    expect(await service.findById('nope')).toBeNull();
  });

  it('caches contexts after reloadAll', async () => {
    const { service, registry } = createService();

    await service.reloadAll();
    await service.findById('animals');

    expect(registry.getAll).toHaveBeenCalledTimes(1);
  });
});
