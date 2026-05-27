import { reactive } from 'vue';
import {
  type AnnotationModalConfig,
  type ModalDefinition,
  type ModalStateDefinition,
} from './AnnotationModal.definition';
import { annotationModalDefaults } from './AnnotationModal.defaults';

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

