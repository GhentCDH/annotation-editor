import type { ExtractPublicPropTypes } from 'vue';

export type ConfirmAction = { label: string; onClick: () => void };

export const ConfirmProperties = {
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, required: false, default: 'Ok' },
  cancelLabel: { type: String, required: false, default: 'Cancel' },
};

export type ConfirmProps = ExtractPublicPropTypes<typeof ConfirmProperties>;

export type ConfirmCloseEvent = { confirmed: boolean };

export const ConfirmEmits = {
  close: (event: ConfirmCloseEvent) => true,
};
