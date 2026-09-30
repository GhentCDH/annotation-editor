import { type SourceModel } from '@ghentcdh/annotation-core';
import { inject, ref } from 'vue';
import {
  ANNOTATION_DEFINITIONS_KEY,
  type AnnotationDefinitionsState,
  provideAnnotationDefinitions,
} from '../definitions/useAnnotationDefinitions';

export abstract class AnnotationEditorLoader<ANNOTATION> {
  private definitionsLoaded = ref(false);

  private readonly useAnnotationDefinitions: AnnotationDefinitionsState;

  constructor() {
    const existing = inject(ANNOTATION_DEFINITIONS_KEY, null);
    this.useAnnotationDefinitions =
      existing ?? provideAnnotationDefinitions({});
    this.loadDefinitions();
  }

  abstract loadAnnotations(sourceUri: string): Promise<ANNOTATION[]>;
  abstract loadSource(sourceUri: string | number): Promise<SourceModel>;
  abstract loadResources(): Promise<string[]>;

  async loadDefinitions() {
    const resources = await this.loadResources();
    this.useAnnotationDefinitions.loadFromResourceUris(resources).then(() => {
      this.definitionsLoaded.value = true;
    });
  }

  getDefinitions() {
    return this.useAnnotationDefinitions.definitions;
  }
}
