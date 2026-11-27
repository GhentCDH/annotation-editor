import { CroutonApiModule } from '@ghentcdh/crouton-api';

import { AnnotationController } from '../annotation/annotation.controller';
import { AnnotationW3cMapperService } from '../annotation/annotation.mapper.service';
import { AnnotationCrudRepository } from '../annotation/annotation.repository';
import { AnnotationApiModule } from '../annotation-api.module';
import { AnnotationNamespaceController } from '../annotation-namespace.controller';
import { AnnotationContextService } from '../context/annotation-context.service';
import { ANNOTATION_DEF_CONFIG_TOKEN } from '../context/annotation-def-config.token';
import { SCHEMA_PREFIX } from '../prefix';

vi.mock('@ghentcdh/crouton-api', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  CroutonApiModule: {
    forResourceDir: vi.fn().mockResolvedValue({ module: class Crouton {} }),
  },
}));

class Repository extends AnnotationCrudRepository<{ id: string }> {
  delete = vi.fn();
  create = vi.fn();
  update = vi.fn();
  findOne = vi.fn();
}
class Mapper {}

const config = { baseUrl: 'http://api.test', prefix: 'test' } as never;

describe('AnnotationApiModule.forResourceDir', () => {
  it('passes the annotation extension and prefix to crouton', async () => {
    await AnnotationApiModule.forResourceDir('res', 'ds', config);

    expect(CroutonApiModule.forResourceDir).toHaveBeenCalledWith(
      'res',
      'ds',
      expect.objectContaining({
        prefix: SCHEMA_PREFIX,
        extensions: { annotation: expect.anything() },
      }),
    );
  });

  it('only exposes the namespace API without a repository', async () => {
    const module = await AnnotationApiModule.forResourceDir('res', 'ds', config);

    expect(module.controllers).toEqual([AnnotationNamespaceController]);
    expect(module.providers).toEqual([
      AnnotationContextService,
      {
        provide: ANNOTATION_DEF_CONFIG_TOKEN,
        useValue: expect.objectContaining({ baseUrl: 'http://api.test/' }),
      },
    ]);
    expect(module.exports).toEqual([AnnotationContextService]);
  });

  it('adds the CRUD controller and binds repository + mapper', async () => {
    const module = await AnnotationApiModule.forResourceDir('res', 'ds', config, {
      repository: Repository,
      mapper: Mapper as never,
    });

    expect(module.controllers).toEqual([
      AnnotationNamespaceController,
      AnnotationController,
    ]);
    expect(module.providers).toEqual(
      expect.arrayContaining([
        { provide: AnnotationCrudRepository, useExisting: Repository },
        { provide: AnnotationW3cMapperService, useExisting: Mapper },
      ]),
    );
  });
});
