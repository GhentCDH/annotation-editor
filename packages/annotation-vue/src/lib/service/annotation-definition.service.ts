import { type AnnotationDefinition } from '@ghentcdh/annotation-core';

export class AnnotationDefinitionService {
  private definitions: AnnotationDefinition[] = [];
  private groupedDefinitions: Record<string, AnnotationDefinition> = {};

  constructor(definitions: AnnotationDefinition[] = []) {
    if (definitions.length) {
      this.setDefinitions(definitions);
    }
  }

  setDefinitions(definitions: AnnotationDefinition[]): void {
    this.definitions = definitions;
    this.groupedDefinitions = definitions.reduce(
      (acc: Record<string, AnnotationDefinition>, current) => {
        acc[current.id] = current;
        return acc;
      },
      {},
    );
  }

  findAll(): AnnotationDefinition[] {
    return this.definitions;
  }

  findById(id: string): AnnotationDefinition | undefined {
    return this.groupedDefinitions[id];
  }

  findAllGrouped(): Record<string, AnnotationDefinition> {
    return this.groupedDefinitions;
  }

  getAllContextBuilders(): unknown[] {
    return this.definitions.map((a) => a.context);
  }

  getContextBuilder(type: string): unknown | undefined {
    return this.findById(type)?.context;
  }
}
