import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { IconEnum } from '@ghentcdh/ui';

export type NavbarChildAction = {
  label: string;
  disabled?: boolean;
  action: () => void;
};

export type NavbarAction = {
  icon: IconEnum;
  label: string;
  disabled?: boolean;
  action?: () => void;
  children?: NavbarChildAction[];
};

export const NavbarProperties = {
  actions: { type: Array as PropType<NavbarAction[]>, required: true },
};

export type NavbarProps = ExtractPublicPropTypes<typeof NavbarProperties>;