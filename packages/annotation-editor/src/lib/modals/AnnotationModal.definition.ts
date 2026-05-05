import { Component, ref, Ref } from 'vue';

export type ModalTypeConfig<
  DATA = void,
  SHOW_DATA = DATA,
  CLOSE_EVENT = void,
> = {
  data: DATA;
  show: SHOW_DATA;
  closeEvent: CLOSE_EVENT;
};

export type AnnotationModalFn<
  DATA = any,
  SHOW_DATA = DATA,
  CLOSE_EVENT = void,
> = {
  isVisible: Ref<boolean>;
  data: Ref<DATA | null>;
  close: (result: CLOSE_EVENT) => void;
  show: (data: SHOW_DATA) => Promise<CLOSE_EVENT>;
};

export type UseAnnotationModal<DATA, SHOW_DATA, CLOSE_EVENT> =
  () => AnnotationModalFn<DATA, SHOW_DATA, CLOSE_EVENT>;

export type ModalDefinition = {
  component: Component;
  useFn: UseAnnotationModal<any, any, any>;
};

export type ModalStateDefinition<DATA, SHOW_DATA, CLOSE_EVENT> = {
  key: string;
  component: Component;
  state: AnnotationModalFn<DATA, SHOW_DATA, CLOSE_EVENT>;
};

export type AnnotationModalConfig<
  T extends Record<string, ModalTypeConfig<any, any, any>> = Record<string, ModalTypeConfig>,
> = {
  modals: ModalStateDefinition<any, any, any>[];
  destroy: () => void;
  getModal: <K extends keyof T>(
    modal: K,
  ) => ModalStateDefinition<T[K]['data'], T[K]['show'], T[K]['closeEvent']>;
  close: <K extends keyof T>(modal: K, data: T[K]['closeEvent']) => void;
  show: <K extends keyof T>(
    modal: K,
    // FIXME any is wrong
    data: T[K]['show'] | any,
  ) => Promise<T[K]['closeEvent'] | null | any>;
  // FIXME any closeEvent should be correct
};

export abstract class AnnotationModal<
  DATA,
  SHOW_DATA,
  CLOSE_EVENT,
> implements AnnotationModalFn<DATA, SHOW_DATA, CLOSE_EVENT> {
  readonly data: Ref<DATA | null> = ref(null);
  readonly isVisible: Ref<boolean> = ref(false);
  private _resolve: ((value: CLOSE_EVENT) => void) | null = null;

  constructor() {
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
  }

  show(data: SHOW_DATA): Promise<CLOSE_EVENT> {
    return this._show(data as unknown as DATA);
  }

  protected _show(data: DATA): Promise<CLOSE_EVENT> {
    return new Promise((resolve) => {
      this._resolve = resolve;
      this.data.value = data;
      this.isVisible.value = true;
    });
  }

  close(result: CLOSE_EVENT): void {
    this.isVisible.value = false;
    this._resolve?.(result);
    this._resolve = null;
  }
}
