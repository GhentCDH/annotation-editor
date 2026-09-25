import {
  w3cAnnotation,
  W3CAnnotation,
  W3CSpecificResource,
} from '@ghentcdh/w3c-utils';
import { TransformAnnotationAdapter } from './transform.annotation.adapter';
import {
  EditorAnnotation,
  editorAnnotationSchema,
} from '@ghentcdh/annotation-ui';
import { Selector } from './editor.annotation';
import { getAnnotationStyle, getMetadata } from './w3c.utils';

export class W3cTransformAnnotationAdapter extends TransformAnnotationAdapter<W3CAnnotation> {
  name = 'W3cTransformAnnotationAdapter';
  defaultParams = {};

  override parse(annotation: W3CAnnotation): EditorAnnotation | null {
    const builder = w3cAnnotation(annotation);
    const textSelectors = builder.getSpecificResourceTargets();

    const createSelector = (resource: W3CSpecificResource) => {
      const selector = resource.selector as any[];
      const obj = {
        ...selector?.reduce(
          (acc, { type: _, ...rest }) => ({ ...acc, ...rest }),
          {},
        ),
        uri: resource.source,
      };
      const parsed = Selector.safeParse(obj);

      if (parsed.error) return null;
      return parsed.data;
    };
    const selectors = textSelectors?.map(createSelector).filter(Boolean) ?? [];

    const definitionSchemaUri = getAnnotationStyle(builder)?.id ?? '';

    const parsedAnnotation = editorAnnotationSchema.parse({
      id: annotation.id,
      definition: this.resolveDefinition(definitionSchemaUri),
      metadata: getMetadata(builder),
      selectors,
    });

    return parsedAnnotation;
  }

  format(
    annotation: EditorAnnotation,
    isNew: boolean,
    hasChanged: boolean,
  ): W3CAnnotation {
    throw new Error('not yet implemented.');
  }
}
