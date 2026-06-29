import { AnnotationDefConfig } from '@ghentcdh/annotation-core';
import { AnnotationDefinition, SourceModel } from '@ghentcdh/annotation-ui';
import { PreviewLayout } from '@ghentcdh/annotation-preview';
import { collection } from './annotations';
import { provideAnnotationDefinitions } from '@ghentcdh/annotation-vue';
import { provideHttpClient } from '@ghentcdh/crouton-forms-vue';

const text = `Feathers & Fur
An unlikely friendship bloomed between a colorful parrot and a gentle dog. One spoke in squawks and mimicked laughter, the other communicated through tail wags and soft brown eyes. Yet somehow, without sharing a common language, they understood each other perfectly.
Every morning they claimed the same sunny spot on the couch, the parrot perched boldly on the dog's broad back. The dog never minded. He simply sighed contentedly, as if carrying his feathered companion was the most natural thing in the world.
Their bond reminded everyone nearby that friendship needs no explanation — only warmth, presence, and a willingness to share the light.`;

const markdownText = `Feathers & Fur

An unlikely *friendship* bloomed between a colorful **parrot** and a gentle **dog**. One spoke in squawks and mimicked laughter, the other communicated through tail wags and soft brown eyes. Yet somehow, without sharing a common language, they understood each other perfectly.

Every morning they claimed the same sunny spot on the couch, the parrot perched boldly on the dog's broad back. The dog never minded. He simply sighed contentedly, as if carrying his feathered companion was the most natural thing in the world.

Their bond reminded everyone nearby that friendship needs no explanation — only warmth, presence, and a willingness to share the light.`;

const lines = `1. Feathers & Fur
2. An unlikely friendship bloomed between a colorful parrot and a gentle dog. One spoke in squawks and mimicked laughter, the other communicated through tail wags and soft brown eyes. Yet somehow, without sharing a common language, they understood each other perfectly.
3. Every morning they claimed the same sunny spot on the couch, the parrot perched boldly on the dog's broad back. The dog never minded. He simply sighed contentedly, as if carrying his feathered companion was the most natural thing in the world.
4. Their bond reminded everyone nearby that friendship needs no explanation — only warmth, presence, and a willingness to share the light.`;

const text_arabic = `ريش وفراء
نشأت صداقة غير متوقعة بين ببغاء ملوّن وكلب وديع. أحدهما تكلّم بالصياح وقلّد الضحكات، والآخر تواصل بتلويح الذيل وعيون بنية ناعمة. ومع ذلك، وبطريقة ما، دون أن يتشاركا لغة مشتركة، فهم كلٌّ منهما الآخر تمامًا.
كل صباح كانا يحتلان نفس البقعة المشمسة على الأريكة، يجلس الببغاء بجرأة على ظهر الكلب العريض. لم يكترث الكلب قط. كان يتنهّد باكتفاء، كأن حمل رفيقه ذي الريش كان أمرًا طبيعيًا تمامًا.
ذكّرت علاقتهما كل من حولهما بأن الصداقة لا تحتاج إلى تفسير — فقط الدفء، والحضور، والاستعداد للتشارك في النور.`;

const markdownText_arabic = `ريش وفراء

نشأت *صداقة* غير متوقعة بين ببغاء ملوّن و**كلب** وديع. أحدهما تكلّم بالصياح وقلّد الضحكات، والآخر تواصل بتلويح الذيل وعيون بنية ناعمة. ومع ذلك، وبطريقة ما، دون أن يتشاركا لغة مشتركة، فهم كلٌّ منهما الآخر تمامًا.

كل صباح كانا يحتلان نفس البقعة المشمسة على الأريكة، يجلس **الببغاء** بجرأة على ظهر الكلب العريض. لم يكترث الكلب قط. كان يتنهّد باكتفاء، كأن حمل رفيقه ذي الريش كان أمرًا طبيعيًا تمامًا.

ذكّرت علاقتهما كل من حولهما بأن الصداقة لا تحتاج إلى تفسير — فقط الدفء، والحضور، والاستعداد للتشارك في النور.`;

const lines_arabic = `1. ريش وفراء
2. نشأت صداقة غير متوقعة بين ببغاء ملوّن وكلب وديع. أحدهما تكلّم بالصياح وقلّد الضحكات، والآخر تواصل بتلويح الذيل وعيون بنية ناعمة. ومع ذلك، وبطريقة ما، دون أن يتشاركا لغة مشتركة، فهم كلٌّ منهما الآخر تمامًا.
3. كل صباح كانا يحتلان نفس البقعة المشمسة على الأريكة، يجلس الببغاء بجرأة على ظهر الكلب العريض. لم يكترث الكلب قط. كان يتنهّد باكتفاء، كأن حمل رفيقه ذي الريش كان أمرًا طبيعيًا تمامًا.
4. ذكّرت علاقتهما كل من حولهما بأن الصداقة لا تحتاج إلى تفسير — فقط الدفء، والحضور، والاستعداد للتشارك في النور.`;

export const DemoText1: SourceModel = {
  id: 'original',
  uri: 'https://example.com/texts/1',
  type: 'text',
  content: {
    label: 'Original',
    text: 'Demo Text 1' as const,
    textDirection: 'ltr',
    processingLanguage: 'en',
  },
};

export const DemoText2: SourceModel = {
  id: 'translation',
  uri: 'https://example.com/texts/2',
  type: 'text',
  content: {
    label: 'Translation',
    text: 'Demo Text 2' as const,
    textDirection: 'ltr',
    processingLanguage: 'en',
  },
};

export const DemoText3: SourceModel = {
  id: 'commentary',
  uri: 'https://example.com/texts/3',
  type: 'text',
  content: {
    label: 'Some other text',
    text: 'Demo Text 3' as const,
    textDirection: 'ltr',
    processingLanguage: 'en',
  },
};

export const config: AnnotationDefConfig = {
  baseUrl: 'https://api.example.com/',
  app: 'my-app',
  prefix: 'my-prefix',
};

const _sources: SourceModel[] = [DemoText1, DemoText2, DemoText3];

const createSources = (original, translation, extra) => {
  return [
    {
      ...DemoText1,
      uri: original.uri,
      content: { ...DemoText1.content, ...original },
    },
    {
      ...DemoText2,
      uri: translation.uri,
      content: { ...DemoText2.content, ...translation },
    },
    {
      ...DemoText3,
      uri: extra.uri,
      content: { ...DemoText3.content, ...extra },
    },
  ];
};

export const sourcesPlainTxt = createSources(
  { text: text_arabic, textDirection: 'rtl', uri: 'urn:demo:plain:arabic' },
  { text, uri: 'urn:demo:plain:original' },
  {
    text: `This text is translated by AI to arabic`,
    uri: `urn:demo:plain:commentary`,
  },
);

export const annotations = collection.items;

export const _definitions: AnnotationDefinition[] = [
  {
    id: 'keyconcepts',
    label: 'Key Concepts',
    style: {
      color: '#712793',
      target: 'highlight',
    },
    schema: {
      type: 'object',
      properties: {
        value: {
          type: 'string',
          label: 'Term',
          required: true,
        },
        language: {
          type: 'string',
          label: 'Language',
          enum: ['en', 'nl', 'ar'],
          required: true,
        },
      },
    },
    allowedChildren: [],
    allowedLinks: [
      { key: 'animals', label: 'Animals' },
      { key: 'emotion', label: 'Emotion' },
    ],
    isRoot: true,
    context: {
      motivation: 'tagging',
      purpose: 'tagging',
    },
  },
  {
    id: 'animals',
    label: 'Animals',
    style: {
      color: '#65a378',
      target: 'highlight',
    },
    schema: {
      type: 'object',
      properties: {
        value: {
          type: 'string',
          label: 'Term',
          required: true,
        },
        language: {
          type: 'string',
          label: 'Language',
          enum: ['en', 'nl', 'ar'],
          required: true,
        },
      },
    },
    allowedChildren: [],
    allowedLinks: [{ key: 'keyconcepts', label: 'Key Concepts' }],
    isRoot: false,
    context: {
      motivation: 'tagging',
      purpose: 'tagging',
    },
  },
  {
    id: 'emotion',
    label: 'Emotion',
    style: {
      color: '#f3ff4d',
      target: 'highlight',
    },
    schema: {
      type: 'object',
      properties: {
        value: {
          type: 'string',
          label: 'Term',
          required: true,
        },
        language: {
          type: 'string',
          label: 'Language',
          enum: ['en', 'nl', 'ar'],
          required: true,
        },
      },
    },
    allowedChildren: [],
    allowedLinks: [{ key: 'keyconcepts', label: 'Key Concepts' }],
    isRoot: false,
    context: {
      motivation: 'tagging',
      purpose: 'tagging',
    },
  },
];
export const layout: PreviewLayout = {
  areas: [
    ['original', 'translation'],
    ['commentary', 'commentary'],
  ],
  columns: '1fr 1fr',
  panes: [
    { sourceId: 'original', area: 'original' },
    { sourceId: 'translation', area: 'translation' },
    { sourceId: 'commentary', area: 'commentary' },
  ],
};

provideHttpClient(fetch);

const resourceFolder = import.meta.glob('./annotation-configs/*.json', {
  eager: true,
});
const defs = provideAnnotationDefinitions({
  config,
  resourceFolder,
});

console.log(defs.definitions);
export const definitions = defs.definitions;
