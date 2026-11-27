import { type AnnotationResource } from '@ghentcdh/annotation-core';

export class AnnotationDefinitionService {
  private definitions: AnnotationResource[] = [];
  private groupedDefinitions: Record<string, AnnotationResource> = {};

  constructor(definitions: AnnotationResource[] = []) {
    if (definitions.length) {
      this.setDefinitions(definitions);
    }
  }

  setDefinitions(definitions: AnnotationResource[]): void {
    this.definitions = definitions;
    this.groupedDefinitions = Object.fromEntries(
      definitions.map((d) => [d.id, d]),
    );
  }

  findAll(): AnnotationResource[] {
    return this.definitions;
  }

  findById(id: string): AnnotationResource | undefined {
    return this.groupedDefinitions[id];
  }

  findAllGrouped(): Record<string, AnnotationResource> {
    return this.groupedDefinitions;
  }

  getAllContextBuilders(): unknown[] {
    return this.definitions.map((a) => a.context);
  }

  getContextBuilder(type: string): unknown | undefined {
    return this.findById(type)?.context;
  }
}
