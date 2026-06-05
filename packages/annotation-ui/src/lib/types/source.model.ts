import { z } from 'zod';

const SourceTypesList = ['text'] as const;

export const SourceTextSchema = z.object({
  text: z.string(),
  textDirection: z.enum(['ltr', 'rtl']).default('ltr'),
  processingLanguage: z.string().default('en'),
  label: z.string().optional(),
  // If only part of the text is displayed then indicate the offset of the text
  offset: z.number().optional().default(0),
});

export const SourceModelSchema = z.object({
  id: z.string(),
  uri: z.string(),
  type: z.enum(SourceTypesList),
  content: SourceTextSchema,
});

export type SourceModel = z.infer<typeof SourceModelSchema>;
