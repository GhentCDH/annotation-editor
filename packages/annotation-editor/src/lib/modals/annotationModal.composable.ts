import { reactive } from 'vue';

import {
  type AnnotationModalConfig,
  type ModalDefinition,
  type ModalStateDefinition,
  type ModalTypeConfig,
} from './AnnotationModal.definition';

export const createModalConfig = <
  T extends Record<string, ModalTypeConfig<any, any, any>>,
>(
  modalDefinitions: Record<keyof T, ModalDefinition>,
): AnnotationModalConfig<T> => {
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
  // The runtime map is keyed by string; AnnotationModalConfig<T> gives callers per-key typing.
  return {
    modals,
    getModal,
    show,
    close,
    destroy: () => modals.forEach((modal) => modal.state.close(null)),
  } as AnnotationModalConfig<T>;
};

