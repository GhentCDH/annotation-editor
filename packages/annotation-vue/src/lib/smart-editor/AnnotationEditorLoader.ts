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
  // flag to identify if the schema is already parsed to crouton format.
  protected isSchema = false;

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

    // If the schema is already parsed to the crouton format then load it directly
    if (this.isSchema) {
      this.useAnnotationDefinitions.loadFromUrls(resources).then(() => {
        this.definitionsLoaded.value = true;
      });
    } else
      this.useAnnotationDefinitions.loadFromResourceUris(resources).then(() => {
        this.definitionsLoaded.value = true;
      });
  }

  getDefinitions() {
    return this.useAnnotationDefinitions.definitions;
  }
}
