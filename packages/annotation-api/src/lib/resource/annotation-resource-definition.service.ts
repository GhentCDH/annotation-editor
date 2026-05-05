import { Injectable } from '@nestjs/common';

import type { AnnotationResourceDefinition } from '@ghentcdh/annotation-core';

@Injectable()
export class AnnotationResourceDefinitionService {
  private readonly byType = new Map<string, AnnotationResourceDefinition>();

  constructor(definitions: AnnotationResourceDefinition[]) {
    for (const def of definitions) {
      this.byType.set(def.type, def);
    }
  }

  findAll = (): AnnotationResourceDefinition[] => [...this.byType.values()];

  getResourceForType = (type: string): AnnotationResourceDefinition | null =>
    this.byType.get(type) ?? null;

  getResourceFromUri = (
    uri: string,
  ): (AnnotationResourceDefinition & { id: string }) | null => {
    for (const def of this.byType.values()) {
      if (uri.startsWith(def.prefix)) {
        return { ...def, id: uri.substring(def.prefix.length) };
      }
    }
    return null;
  };
}
