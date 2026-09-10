import { ref } from 'vue';
import { type SourceModel } from '@ghentcdh/annotation-core';

let counter = 0;
const nextId = () => `parsed-source-${++counter}`;

export const useSourceParser = () => {
  const text = ref('');
  const label = ref('');
  const id = ref('');
  const uri = ref('');
  const textDirection = ref<'ltr' | 'rtl'>('ltr');
  const processingLanguage = ref('en');
  const parseError = ref('');
  const expanded = ref(false);

  const parse = (): SourceModel | null => {
    parseError.value = '';
    if (!text.value.trim()) {
      parseError.value = 'Text is required';
      return null;
    }
    const resolvedId = id.value.trim() || nextId();
    return {
      id: resolvedId,
      uri: uri.value.trim() || `urn:source:${resolvedId}`,
      type: 'text',
      content: {
        text: text.value,
        label: label.value.trim() || resolvedId,
        textDirection: textDirection.value,
        processingLanguage: processingLanguage.value.trim() || 'en',
      },
    };
  };

  return { text, label, id, uri, textDirection, processingLanguage, parseError, expanded, parse };
};
