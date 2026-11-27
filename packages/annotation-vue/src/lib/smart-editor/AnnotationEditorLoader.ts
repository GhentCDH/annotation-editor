import { inject, nextTick, ref } from 'vue';

import {
  type AnnotationJsonResource,
  type SourceModel,
} from '@ghentcdh/annotation-core';

import {
  ANNOTATION_DEFINITIONS_KEY,
  type AnnotationDefinitionsState,
  provideAnnotationDefinitions,
} from '../definitions/useAnnotationDefinitions';
import { type EditorLoadError, toEditorLoadError } from './editorError';

export abstract class AnnotationEditorLoader<ANNOTATION> {
  private readonly useAnnotationDefinitions: AnnotationDefinitionsState;
  // flag to identify if the schema is already parsed to crouton format.
  protected isSchema = false;

  public readonly definitionsLoaded = ref(false);
  public readonly definitionsError = ref<EditorLoadError | null>(null);

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
    this.definitionsLoaded.value = false;
    this.definitionsError.value = null;

    try {
      const resources = await this.loadResources();

      if (!resources.length) {
        await this.useAnnotationDefinitions.loadFromResourceUris(
          resources as string[],
        );
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

      await promise;
    } catch (e) {
      console.error(e);
      this.definitionsError.value = toEditorLoadError(e);
    } finally {
      nextTick(() => (this.definitionsLoaded.value = true));
    }
  }

  /** Retry loading the annotation definition resources. */
  async reloadDefinitions() {
    this.definitionsError.value = null;
    await this.loadDefinitions();
  }

  getDefinitions() {
    return this.useAnnotationDefinitions.definitions;
  }
}
