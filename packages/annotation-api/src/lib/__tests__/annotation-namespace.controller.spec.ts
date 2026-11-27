import { SELF_DECLARED_DEPS_METADATA } from '@nestjs/common/constants';

import { type ResourceConfigRegistry } from '@ghentcdh/crouton-api';

import { AnnotationNamespaceController } from '../annotation-namespace.controller';
import {
  AnnotationContextService,
  type AnnotationRegistryResource,
} from '../context/annotation-context.service';

describe('AnnotationNamespaceController', () => {
  it('injects AnnotationContextService (not the def config) as 2nd dependency', () => {
    const deps: { index: number; param: unknown }[] = Reflect.getMetadata(
      SELF_DECLARED_DEPS_METADATA,
      AnnotationNamespaceController,
    );

    expect(deps.find((d) => d.index === 1)?.param).toBe(
      AnnotationContextService,
    );
  });

  it('returns the JSON-LD context of a type', async () => {
    const jsonLd = { '@context': {} };
    const contextService = {
      findById: vi.fn().mockResolvedValue({ jsonLd }),
    } as unknown as AnnotationContextService;
    const controller = new AnnotationNamespaceController(
      {} as ResourceConfigRegistry<AnnotationRegistryResource>,
      contextService,
    );

    await expect(controller.getJsonLd_('animals')).resolves.toBe(jsonLd);
    expect(contextService.findById).toHaveBeenCalledWith('animals');
  });
});
