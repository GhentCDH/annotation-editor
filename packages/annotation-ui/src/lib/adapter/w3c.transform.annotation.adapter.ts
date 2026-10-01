import {
  w3cAnnotation,
  type W3CAnnotation,
  type W3CSelector,
  type W3CSpecificResource,
} from '@ghentcdh/w3c-utils';
import {
  AnnotationMetadataType,
  AnnotationStyleType,
} from '@ghentcdh/annotation-core';
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
    ...(selectorArr as Array<Record<string, unknown>>).reduce<
      Record<string, unknown>
    >((acc, { type: _, ...rest }) => ({ ...acc, ...rest }), {}),
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
      definitionUri: definitionSchemaUri,
      metadata: getMetadata(builder),
      selectors,
      links,
    });

    return parsedAnnotation;
  }

  format(annotation: EditorAnnotation, isNew: boolean): W3CAnnotation {
    const builder = w3cAnnotation();

    builder.setId(String(annotation.id ?? 'NEW_ONE'));

    builder.setMotivation('tagging');

    if (annotation.definitionUri) {
      builder.addBody({
        type: AnnotationStyleType,
        purpose: 'styling',
        id: annotation.definitionUri,
        name: annotation.definitionUri,
      } as any);
    }

    if (annotation.metadata) {
      builder.addBody({ type: AnnotationMetadataType, ...annotation.metadata });
    }

    for (const selector of annotation.selectors) {
      const { uri, start, end, exact, prefix, suffix } = selector;

      builder.updateTextPositionSelector({ start, end }, uri);
      if (exact !== undefined || prefix !== undefined || suffix !== undefined) {
        builder.updateTextQuoteSelector(
          { exact: exact ?? '', prefix, suffix },
          uri,
        );
      }
    }

    for (const link of annotation.links) {
      builder.addTarget({ type: 'SpecificResource', source: link.uri });
    }
    return builder.build();
  }
}
