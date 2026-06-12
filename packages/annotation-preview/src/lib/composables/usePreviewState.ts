import {
  computed,
  type ComputedRef,
  inject,
  type InjectionKey,
  provide,
  reactive,
  shallowReactive,
  type TemplateRef,
  watch,
  nextTick,
} from 'vue';
import {
  createAnnotationConfiguration,
  annotationUtils,
  type AnnotationUtils,
  createModalConfig,
  getAnnotationElementCenter, type SourceModel 
} from '@ghentcdh/annotation-ui';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';
import { type PreviewConfig, type PreviewState_ } from './previewState';
import { type AnnotationPreviewProps, type AnnotationPreviewEmitsFn } from '../AnnotationPreview.properties';
import { previewModalDefaults } from '../modals/PreviewModal.defaults';

export type PreviewSelectEvent = {
  annotation: W3CAnnotation;
  source: SourceModel;
  mouseEvent: MouseEvent;
};

export type PreviewState = {
  sources: ComputedRef<Readonly<SourceModel[]>>;
  config: Readonly<PreviewConfig>;
  previewState: Readonly<PreviewState_>;
  sendSelectEvent: (data: PreviewSelectEvent | null) => void;
  utils: AnnotationUtils;
};

const PREVIEW_KEY: InjectionKey<PreviewState> = Symbol('preview');

export const useProvidePreviewState = (
  props: AnnotationPreviewProps,
  emits: AnnotationPreviewEmitsFn,
  containerRef: TemplateRef<HTMLElement>,
) => {
  const utils = annotationUtils(props.configuration);

  const config = shallowReactive<PreviewConfig>({
    modal: createModalConfig(previewModalDefaults),
    annotation: createAnnotationConfiguration(
      props.annotationDefinitions,
      utils,
      props.textAdapter,
      props.annotationAdapter,
    ),
  });

  utils.setAnnotations(
    props.annotations ?? [],
    config.annotation.allowedChildrenPerType,
  );

  const sources = computed(() => props.sources ?? []);

  const previewState = reactive<PreviewState_>({
    selectedAnnotation: null,
    reset: () => resetPreviewState(),
  });

  watch(
    () =>
      props.annotationDefinitions &&
      props.textAdapter &&
      props.annotationAdapter,
    () => {
      config.annotation = createAnnotationConfiguration(
        props.annotationDefinitions,
        utils,
        props.textAdapter,
        props.annotationAdapter,
      );
    },
  );

  watch(
    () => props.annotations,
    () => {
      utils.setAnnotations(
        props.annotations ?? [],
        config.annotation.allowedChildrenPerType,
      );
    },
  );

  const resetPreviewState = () => {
    config.modal.destroy();
    previewState.selectedAnnotation = null;
  };

  watch(
    [() => props.selectedAnnotationId, () => props.annotations],
    ([id]) => {
      if (!id) {
        if (previewState.selectedAnnotation) {
          config.modal.close('info-card', undefined);
          previewState.selectedAnnotation = null;
        }
        return;
      }

      if (previewState.selectedAnnotation?.id === id) return;

      const annotation = (props.annotations ?? []).find((a) => a.id === id);
      if (!annotation) return;

      const sourceUri = utils.getSourceUri(annotation)?.sourceUri;
      const source = (props.sources ?? []).find((s) => s.uri === sourceUri);
      if (!source) return;

      nextTick(() => {
        previewState.selectedAnnotation = annotation;
        const position = getAnnotationElementCenter(containerRef.value!, id)
          ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        config.modal.show('info-card', { annotation, source, position });
        emits('select:annotation', annotation, 'show');
      });
    },
    { immediate: true },
  );

  const sendSelectEvent = (data: PreviewSelectEvent | null) => {
    if (!data?.annotation) {
      config.modal.close('info-card', undefined);
      previewState.selectedAnnotation = null;
      emits('select:annotation', null, null);
      return;
    }

    const position = getAnnotationElementCenter(
      containerRef.value!,
      data.annotation.id,
    ) ?? getMousePositionFromEvent(containerRef.value!, data.mouseEvent);

    config.modal.show('info-card', {
      annotation: data.annotation,
      source: data.source,
      position,
    });
    previewState.selectedAnnotation = data.annotation;
    emits('select:annotation', data.annotation, 'show');
  };

  provide(PREVIEW_KEY, {
    sources,
    config: config as Readonly<PreviewConfig>,
    previewState: previewState as Readonly<PreviewState_>,
    utils,
    sendSelectEvent,
  });
};

const getMousePositionFromEvent = (container: HTMLElement, event: MouseEvent) => {
  const rect = container.getBoundingClientRect();
  return {
    x: event.clientX - rect.left + container.scrollLeft,
    y: event.clientY - rect.top + container.scrollTop,
  };
};

export const usePreviewState = (): PreviewState => {
  const ctx = inject(PREVIEW_KEY);
  if (!ctx)
    throw new Error('usePreviewState() must be called inside an AnnotationPreview');
  return ctx;
};
