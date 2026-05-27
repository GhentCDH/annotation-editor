import {
  w3cAnnotation,
  type W3CAnnotation,
  type W3CAnnotationBuilder,
  type W3CSpecificResource,
} from '@ghentcdh/w3c-utils';
import {
  type AnnotationDefConfig,
  AnnotationMetadataType,
  type AnnotationStyle,
  AnnotationStyleContextBuilder,
  createAnnotationStyleBodyUnsafe,
} from '@ghentcdh/annotation-core';
import {
  type AllowedChildrenPerType,
  type AnnotationDefinition,
  type FormValidationDef,
  type KeyLabel,
} from '../types/AnnotationConfiguration.model';

export type AnnotationLink = {
  purpose: string;
  annotation: W3CAnnotation;
  relations: W3CAnnotation[];
};

const mapRelationsToLinks = (
  sourceUri: string,
  builders: Map<string, W3CAnnotationBuilder>,
  annotations: W3CAnnotation[],
): AnnotationLink[] => {
  return annotations
    .map((link) => {
      const builder = builders.get(link.id)!;
      const specifyResource = builder.getSpecificResourceTargets(sourceUri);

      if (!specifyResource || specifyResource.length === 0) return null;

      const sourceUris = builder
        .getSpecificResourceTargets()
        .map((s) => s.source)
        .filter((s) => s !== sourceUri);

      const relations = sourceUris
        .map((uri) => {
          return annotations.find((a) => a.id === uri);
        })
        .filter(Boolean) as W3CAnnotation[];

      return {
        purpose: getAnnotationType(builder),
        annotation: link,
        relations,
      } as AnnotationLink;
    })
    .filter(Boolean) as AnnotationLink[];
};

type AnnotationPositionTree = {
  id: string;
  allowedChildren: KeyLabel[];
  sourceUri: string;
  start: number;
  end: number;
  type: string;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

const getAnnotationType = (builder: W3CAnnotationBuilder) => {
  return getAnnotationStyle(builder)?.id ?? 'text';
};

const getAnnotationStyle = (builder: W3CAnnotationBuilder) => {
  const style = builder
    .getBodiesByPurpose('styling')
    .find((b: any) => b.type === 'AnnotationStyle');

  return style as AnnotationStyle | null;
};
const getAnnotationPosition = (
  id: string,
  builder: W3CAnnotationBuilder,
  allowedChildrenPerType: AllowedChildrenPerType,
) => {
  const sourceUri = builder.getSpecificResourceTargets()[0]?.source;

  if (!sourceUri) {
    return null;
  }
  const textPositionSelector = builder.getTextPositionSelector(sourceUri)[0];

  // skip this annotation if it doesn't have a source URI
  if (!textPositionSelector) {
    return null;
  }

  const type = getAnnotationStyle(builder)?.id ?? 'text';

  return {
    id: id,
    start: textPositionSelector.start,
    end: textPositionSelector.end,
    allowedChildren: allowedChildrenPerType[type] ?? [],
    sourceUri: sourceUri ?? '',
    type,
    minX: textPositionSelector.start,
    minY: 0,
    maxX: textPositionSelector.end,
    maxY: 0,
  } as AnnotationPositionTree;
};

const rootId = 'ROOT';

const createId = () => {
  return `mela:new-annotation:${Date.now()}`;
};

export type Selector = { source: string; start: number; end: number };
const updateSelector = (builder: W3CAnnotationBuilder, selector: Selector) => {
  if (!builder.getSpecificResourceTargets(selector.source).length) {
    builder.addTarget({
      type: 'SpecificResource',
      source: selector.source,
    });
  }
  builder.updateTextPositionSelector(
    { start: selector.start, end: selector.end },
    selector.source,
  );

  return builder;
};

class AnnotationUtilsImpl {
  private readonly builderMap = new Map<string, W3CAnnotationBuilder>();
  private readonly childParentMap = new Map<string, W3CAnnotation | null>();
  private readonly parentChildMap = new Map<string, W3CAnnotation[]>();
  private readonly linkedAnnotations = new Map<string, AnnotationLink[]>();
  private annotations: W3CAnnotation[] = [];
  private allowedChildrenPerType: AllowedChildrenPerType = {};

  constructor(private readonly annotationConfig: AnnotationDefConfig) {}

  private getBuilder(annotation: W3CAnnotation) {
    const builder = this.builderMap.get(annotation.id);

    if (!builder)
      throw new Error(`Annotation builder not found: ${annotation.id}`);

    return builder;
  }

  setAnnotations(
    annotations: W3CAnnotation[],
    allowedChildrenPerType: AllowedChildrenPerType,
  ) {
    this.allowedChildrenPerType = allowedChildrenPerType;
    this.annotations = annotations;
    this.parentChildMap.clear();
    this.childParentMap.clear();
    this.builderMap.clear();

    const annotationsWithPositons: Array<AnnotationPositionTree> = [];
    const annotationIdMap = new Map<string, W3CAnnotation>();

    annotations.forEach((annotation) => {
      const builder = w3cAnnotation(annotation);
      this.builderMap.set(annotation.id, builder);

      const position = getAnnotationPosition(
        annotation.id,
        builder,
        this.allowedChildrenPerType,
      );
      annotationIdMap.set(annotation.id, annotation);
      if (position) annotationsWithPositons.push(position);
    });

    annotationsWithPositons.forEach((annotation) => {
      const parents = annotationsWithPositons
        .filter(
          (a: AnnotationPositionTree) =>
            a.id !== annotation.id &&
            a.sourceUri === annotation.sourceUri &&
            a.start <= annotation.start &&
            a.end >= annotation.end &&
            a.allowedChildren.some((c) => c.key === annotation.type),
        )
        // Pick the tightest parent (smallest containing range)
        .sort(
          (a: AnnotationPositionTree, b: AnnotationPositionTree) =>
            a.end - a.start - (b.end - b.start),
        );
      const parentAnnotation = parents[0];
      const parentId = parentAnnotation?.id ?? rootId;
      const children = this.parentChildMap.get(parentId) ?? [];

      children.push(annotationIdMap.get(annotation.id)!);
      this.parentChildMap.set(parentAnnotation?.id ?? rootId, children);
      this.childParentMap.set(
        annotation.id,
        annotationIdMap.get(parentId) ?? null,
      );
    });

    annotations.forEach((annotation) => {
      this.linkedAnnotations.set(
        annotation.id,
        mapRelationsToLinks(annotation.id, this.builderMap, annotations),
      );
    });

    return this;
  }

  updateAnnotationData(annotation: W3CAnnotation, data: any) {
    if (!data || Object.keys(data).length < 0) return annotation;

    const builder = this.getBuilder(annotation);
    data.type = data.type ?? AnnotationMetadataType;
    data.purpose = data.purpose ?? getAnnotationType(builder);
    const updated = builder.updateBodyByType(data.type, data).build();

    return updated;
  }

  getLinks(annotation: W3CAnnotation) {
    return this.linkedAnnotations.get(annotation.id) ?? [];
  }

  getTextPositionSelector(annotation: W3CAnnotation, sourceUri?: string) {
    return this.getBuilder(annotation).getTextPositionSelector(sourceUri)[0];
  }

  isAnnotationUri = (uri: string) => {
    // TODO this should be variable configured somewhere
    return uri.startsWith('mela:annotation/');
  };

  getParentSelector = (builder: W3CAnnotationBuilder) => {
    const textSelectors = builder.getSpecificResourceTargets();
    const getAnnotation = textSelectors.find((t) =>
      this.isAnnotationUri(t.source),
    );
    return (getAnnotation as W3CSpecificResource) ?? null;
  };

  getParent(annotation: W3CAnnotation): W3CAnnotation | null {
    const builder = this.getBuilder(annotation);
    const parentUri = this.getParentSelector(builder);

    if (!parentUri) return null;
    return this.annotations.find((a) => a.id === parentUri.source) ?? null;
  }

  updateTextPositionSelector(
    annotation: W3CAnnotation,
    selector: { source: string; start: number; end: number },
  ) {
    const builder = this.getBuilder(annotation);
    updateSelector(builder, selector);
    return builder.build();
  }

  updateAnnotationBuilder(annotation: W3CAnnotation) {
    this.builderMap.set(annotation.id, w3cAnnotation(annotation));
    return annotation;
  }

  private _create(
    fromAnnotation: W3CAnnotation | null,
    type: AnnotationDefinition,
  ) {
    const id = createId();
    const styleBody = createAnnotationStyleBodyUnsafe(
      this.annotationConfig,
      type.context,
    ).body;
    const builder = w3cAnnotation(fromAnnotation ?? undefined)
      .setId(id)
      .setMotivation('tagging');

    if (styleBody) builder.addBody(styleBody);

    this.builderMap.set(id, builder);

    return builder;
  }

  createAnnotation(
    fromAnnotation: W3CAnnotation | null,
    type: AnnotationDefinition,
    data: any | null,
    extraTextPositionSelector?: Selector,
  ) {
    const builder = w3cAnnotation(fromAnnotation ?? undefined).setMotivation(
      'tagging',
    );
    if (!fromAnnotation?.id) {
      builder.setId(createId());
    }

    // Add the style
    const styleBody = AnnotationStyleContextBuilder(
      this.annotationConfig,
    ).toAnnotationBody(type)!;

    builder.addBody(styleBody);

    // Add the metadata
    if (data && Object.keys(data).length > 0) {
      data.type = data.type ?? AnnotationMetadataType;
      data.purpose = data.purpose ?? getAnnotationType(builder);
      builder.updateBodyByType(data.type, data);
    }

    // Additional positionselector
    if (extraTextPositionSelector)
      updateSelector(builder, extraTextPositionSelector);

    return builder.build();
  }

  createLinkAnnotation = (
    sourceAnnotation: W3CAnnotation,
    targetAnnotation: W3CAnnotation,
    type: AnnotationDefinition,
  ): W3CAnnotation => {
    const builder = this._create(null, type);

    builder
      .addTarget({
        source: sourceAnnotation.id,
      })
      .addTarget({
        source: targetAnnotation.id,
      });
    return builder.build();
  };

  cancel() {
    this.setAnnotations(this.annotations, this.allowedChildrenPerType);
  }

  getSourceUri = (annotation: W3CAnnotation) => {
    const builder = this.getBuilder(annotation);
    const sourceUri = builder.getSourceUri();

    if (!sourceUri) {
      console.warn('no source uri');
      return null;
    }

    const textPositionSelector = builder.getTextPositionSelector(sourceUri)[0];

    return { textPositionSelector, sourceUri };
  };

  getMetadata = (
    annotation: W3CAnnotation,
    validationDef: FormValidationDef,
  ) => {
    const builder = this.getBuilder(annotation);

    if (!validationDef) return null;

    const metadataBody = builder.getBodiesByType(AnnotationMetadataType);
    return metadataBody?.[0] ?? null;
  };

  getAnnotationStyle = (annotation: W3CAnnotation) => {
    const builder = this.getBuilder(annotation);

    return getAnnotationStyle(builder);
  };

  getAnnotationType = (annotation: W3CAnnotation) => {
    const builder = this.getBuilder(annotation);
    return getAnnotationType(builder);
  };

  createAnnotationFromSelector(
    type: AnnotationDefinition,
    annotation: W3CAnnotation | null,
    selector: Selector | null,
  ) {
    const builder = w3cAnnotation(annotation ?? undefined)
      .setMotivation('tagging')
      .setId(createId());

    // Add the style
    const styleBody = AnnotationStyleContextBuilder(
      this.annotationConfig,
    ).toAnnotationBody(type)!;

    builder.addBody(styleBody);

    // Additional positionselector
    if (selector) updateSelector(builder, selector);

    return builder.build();
  }
}

export type AnnotationUtils = Pick<
  typeof AnnotationUtilsImpl.prototype,
  | 'createAnnotation'
  | 'updateAnnotationData'
  | 'getLinks'
  | 'getTextPositionSelector'
  | 'getParent'
  | 'createLinkAnnotation'
  | 'cancel'
  | 'updateTextPositionSelector'
  | 'getSourceUri'
  | 'getMetadata'
  | 'updateAnnotationBuilder'
  | 'getAnnotationStyle'
  | 'getAnnotationType'
  | 'createAnnotationFromSelector'
>;

export const annotationUtils = (annotationConfig: AnnotationDefConfig) => {
  return new AnnotationUtilsImpl(annotationConfig);
};
