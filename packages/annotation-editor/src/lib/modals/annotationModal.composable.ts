import { type UnwrapNestedRefs, reactive } from 'vue';

import {
  type AnnotationModalConfig,
  type AnnotationModalFn,
  type ModalDefinition,
  type ModalStateDefinition,
  type ModalTypeConfig,
} from './AnnotationModal.definition';

export const createModalConfig = <
  T extends Record<string, ModalTypeConfig<unknown, unknown, unknown>>,
>(
  modalDefinitions: {
    [K in keyof T]: ModalDefinition<T[K]['data'], T[K]['show'], T[K]['closeEvent']>;
  },
): AnnotationModalConfig<T> => {
  const modalMap = new Map<string, ModalStateDefinition>();
  Object.entries(modalDefinitions).forEach(([key, { component, useFn }]) => {
    const modal: ModalStateDefinition = {
      key,
      component,
      state: reactive(useFn()) as UnwrapNestedRefs<AnnotationModalFn<unknown, unknown, void>>,
    };
    modalMap.set(key, modal);
  });

  const getModal = <K extends keyof T>(modal: K) => {
    const config:
      | ModalStateDefinition<T[K]['data'], T[K]['show'], T[K]['closeEvent']>
      | null = modalMap.get(String(modal)) ?? null;
    if (!config) {
      console.warn(`Modal ${String(modal)} not found`);
      return null;
    }

    return config;
  };

  const show = <K extends keyof T>(
    modal: K,
    data: T[K]['show'],
  ): Promise<T[K]['closeEvent']> | null => {
    const state = getModal(modal) as
      | ModalStateDefinition<T[K]['data'], T[K]['show'], T[K]['closeEvent']>
      | null;
    const promise = state?.state.show(data);
    return promise ?? null;
  };

  const close = <K extends keyof T>(
    modal: K,
    data?: T[K]['closeEvent'],
  ): void => {
    const state = getModal(modal) as
      | ModalStateDefinition<T[K]['data'], T[K]['show'], T[K]['closeEvent']>
      | null;
    state?.state.close(data as T[K]['closeEvent']);
  };

  const modals = Array.from(modalMap.values());
  // The runtime map is keyed by string; AnnotationModalConfig<T> gives callers per-key typing.
  return {
    modals,
    getModal,
    show,
    close,
    destroy: () => modals.forEach((modal) => modal.state.close(undefined)),
  } as AnnotationModalConfig<T>;
};
