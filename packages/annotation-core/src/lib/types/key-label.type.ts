import { z } from 'zod';

export type KeyLabel<KEY = string> = {
  key: KEY;
  label: string;
  icon?: string;
};

export const KeyLabelSchema = z.object<KeyLabel>();
