import {
  w3cAnnotation,
  type W3CAnnotation,
  type W3CSelector,
  type W3CSpecificResource,
} from '@ghentcdh/w3c-utils';
import {
  type AnnotationLink,
  type EditorAnnotation,
  editorAnnotationSchema,
  LinkSchema,
  type Selector,
  SelectorSchema,
} from './editor.annotation';
import { TransformAnnotationAdapter } from './transform.annotation.adapter';
import { getAnnotationStyle, getMetadata } from './w3c.utils';

const createSelector = (resource: W3CSpecificResource) => {
  const selectorArr: W3CSelector[] = Array.isArray(resource.selector)
    ? resource.selector
    : resource.selector
      ? [resource.selector]
      : [];
  const obj = {
    ...(selectorArr as Array<Record<string, unknown>>).reduce<Record<string, unknown>>(
      (acc, { type: _, ...rest }) => ({ ...acc, ...rest }),
      {},
    ),
    uri: resource.source,
  };
  const parsed = SelectorSchema.safeParse(obj);

  if (parsed.error) return null;
  return parsed.data;
};

export class W3cTransformAnnotationAdapter extends TransformAnnotationAdapter<W3CAnnotation> {
  name = 'W3cTransformAnnotationAdapter';
  defaultParams = {};

  override parse(annotation: W3CAnnotation): EditorAnnotation | null {
    const builder = w3cAnnotation(annotation);
    const specificResourceTargets = builder.getSpecificResourceTargets();
    const selectors: Selector[] = [];
    const links: AnnotationLink[] = [];
    for (const resource of specificResourceTargets) {
      // check if it's an annotation
      if (!resource.selector) {
        // it is a link
        links.push(LinkSchema.parse({ uri: resource.source }));
      } else {
        const selector = createSelector(resource);
        if (selector) selectors.push(selector);
      }
    }
    const definitionSchemaUri = getAnnotationStyle(builder)?.id ?? '';

    const parsedAnnotation = editorAnnotationSchema.parse({
      id: annotation.id,
      definition: this.resolveDefinition(definitionSchemaUri),
      metadata: getMetadata(builder),
      selectors,
      links,
    });

    return parsedAnnotation;
  }

  format(annotation: EditorAnnotation, isNew: boolean): W3CAnnotation {
    throw new Error('not yet implemented.');
  }
}
