import type { SourceModel } from '@ghentcdh/annotation-editor';

export const SOURCE_URI_1 = 'http://example.org/source/1';
export const SOURCE_URI_2 = 'http://example.org/source/2';

export const mockSources: SourceModel[] = [
  {
    id: 'source-1',
    uri: SOURCE_URI_1,
    type: 'text',
    content: {
      label: 'Latin Text',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      textDirection: 'ltr',
      processingLanguage: 'la',
      offset: 0,
    },
  },
  {
    id: 'source-2',
    uri: SOURCE_URI_2,
    type: 'text',
    content: {
      label: 'Translation',
      text: 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter.',
      textDirection: 'rtl',
      processingLanguage: 'en',
      offset: 0,
    },
  },
];

export const mockSourcesSingle: SourceModel[] = [mockSources[0]];
