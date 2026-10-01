import { AnnotationEditorLoader } from '@ghentcdh/annotation-vue';
import type { W3CAnnotation } from '@ghentcdh/w3c-utils';

export class Loader extends AnnotationEditorLoader<W3CAnnotation> {
  isSchema = true;
  constructor(props) {
    super(props);
  }

  async loadAnnotations(sourceUri: string) {
    return [];
  }

  async loadSource(sourceUri: string) {
    console.log('loadSource', sourceUri);
    return null;
  }

  async loadResources(): Promise<string[]> {
    return [];
  }
}
