import {
  AnnotationJsonResource,
  type SourceModel,
} from '@ghentcdh/annotation-core';
import { inject, nextTick, ref } from 'vue';
import {
  ANNOTATION_DEFINITIONS_KEY,
  type AnnotationDefinitionsState,
  provideAnnotationDefinitions,
} from '../definitions/useAnnotationDefinitions';

export abstract class AnnotationEditorLoader<ANNOTATION> {
  private readonly useAnnotationDefinitions: AnnotationDefinitionsState;
  // flag to identify if the schema is already parsed to crouton format.
  protected isSchema = false;

  public readonly definitionsLoaded = ref(false);

  constructor() {
    const existing = inject(ANNOTATION_DEFINITIONS_KEY, null);
    this.useAnnotationDefinitions =
      existing ?? provideAnnotationDefinitions({});
    this.loadDefinitions();
  }

  abstract loadAnnotations(sourceUri: string): Promise<ANNOTATION[]>;
  abstract loadSource(sourceUri: string | number): Promise<SourceModel>;
  abstract loadResources(): Promise<Array<string | AnnotationJsonResource>>;

  async loadDefinitions() {
    const resources = await this.loadResources();

    if (!resources.length) {
      this.useAnnotationDefinitions.loadFromResourceUris(resources as string[]).then(() => {
        nextTick(() => (this.definitionsLoaded.value = true));
      });

      return;
    }

    const isUrls = typeof resources[0] === 'string';

    if (!isUrls) {
      this.useAnnotationDefinitions.loadFromConfigs(
        resources as AnnotationJsonResource[],
      );
      return;
    }

    // If the schema is already parsed to the crouton format then load it directly
    const promise = this.isSchema
      ? this.useAnnotationDefinitions.loadFromUrls(resources as string[])
      : this.useAnnotationDefinitions.loadFromResourceUris(
          resources as string[],
        );

    promise.then(() => {
      nextTick(() => (this.definitionsLoaded.value = true));
    });
  }

  getDefinitions() {
    return this.useAnnotationDefinitions.definitions;
  }
}
