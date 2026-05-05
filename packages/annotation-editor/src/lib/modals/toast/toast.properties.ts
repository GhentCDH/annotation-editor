import type { ExtractPublicPropTypes, PropType } from 'vue';

export type ToastAction = { label: string; onClick: () => void };

export const ToastProperties = {
  toastMessage: { type: String, required: true },
  action: { type: Object as PropType<ToastAction>, required: false },
};

export type EditToast = ExtractPublicPropTypes<typeof ToastProperties>;

export const EditToastEmits = {
  close: () => true,
};

export type EditToastEmitsType = typeof EditToastEmits;
