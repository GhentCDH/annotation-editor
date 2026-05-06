import { reactive, type Ref, shallowRef } from 'vue';
import {
  type AnnotationModalConfig,
  type ModalDefinition,
  type ModalStateDefinition,
} from './AnnotationModal.definition';
import {
  type AnnotationModalAction,
  type AnnotationModalActionMap,
  annotationModalDefaults,
} from './AnnotationModal.defaults';

export const createModalConfig = (
  modalDefinitions: Record<string, ModalDefinition> = {},
): AnnotationModalConfig => {
  const modalMap = new Map<string, ModalStateDefinition<any, any, any>>();
  Object.entries(modalDefinitions).forEach(([key, { component, useFn }]) => {
    const modal: ModalStateDefinition<any, any, any> = {
      key,
      component,
      state: reactive(useFn()),
    };
    modalMap.set(key, modal);
  });

  const show = (modal: string, data: unknown) => {
    return getModal(modal)?.state.show(data) as any;
  };

  const close = (modal: string, event: unknown) => {
    return getModal(modal)?.state.close(event);
  };

  const getModal = (modal: string) => {
    const config = modalMap.get(modal);
    if (!config) {
      console.warn(`Modal ${modal} not found`);
      return null as any;
    }

    return config;
  };

  const modals = Array.from(modalMap.values());
  return {
    modals,
    getModal,
    show,
    close,
    destroy: () => modals.forEach((modal) => modal.state.close(null)),
  };
};

export const useAnnotationModal = (): {
  config: Ref<AnnotationModalConfig<AnnotationModalActionMap>>;
  setModalDefinitions: (
    modalDefinitions?: Record<string, ModalDefinition>,
  ) => void;
  destroy: () => void;
  show: <K extends AnnotationModalAction>(
    modal: K,
    data: AnnotationModalActionMap[K]['show'],
  ) => void;
  close: <K extends AnnotationModalAction>(
    modal: K,
    event: AnnotationModalActionMap[K]['closeEvent'],
  ) => void;
} => {
  const config = shallowRef(
    createModalConfig(
      annotationModalDefaults,
    ) as unknown as AnnotationModalConfig<AnnotationModalActionMap>,
  );

  const setModalDefinitions = (
    modalDefinitions: Record<string, ModalDefinition> = {},
  ) => {
    const allDefs = { ...annotationModalDefaults, ...modalDefinitions };

    config.value = createModalConfig(
      allDefs,
    ) as unknown as AnnotationModalConfig<AnnotationModalActionMap>;
  };

  const destroy = () => {
    config.value?.destroy();
  };

  const show = <K extends AnnotationModalAction>(
    modal: K,
    data: AnnotationModalActionMap[K]['show'],
  ) => {
    config.value?.show(modal, data);
  };

  const close = <K extends AnnotationModalAction>(
    modal: K,
    event: AnnotationModalActionMap[K]['closeEvent'],
  ) => {
    const modalState = config.value?.modals.find((m) => m.key === modal);
    modalState?.state.close(event);
  };

  return {
    config,
    setModalDefinitions,
    destroy,
    show,
    close,
  };
};
