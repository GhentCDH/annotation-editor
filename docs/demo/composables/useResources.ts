import { computed, ref } from 'vue';
import {
  AnnotationDefConfig,
  provideAnnotationDefinitions,
} from '@ghentcdh/annotation-vue';
import { type AnnotationJsonResource } from '@ghentcdh/annotation-core';

export const config: AnnotationDefConfig = {
  baseUrl: 'https://api.example.com/',
  app: 'my-app',
  prefix: 'my-prefix',
};

const BASE_RAW =
  'https://raw.githubusercontent.com/GhentCDH/annotation-editor/refs/heads/main/docs/demo/annotation-configs';

const DEFAULT_URLS = [
  { name: 'Animals', url: `${BASE_RAW}/animals.json` },
  { name: 'Emotion', url: `${BASE_RAW}/emotion.json` },
  { name: 'Key Concepts', url: `${BASE_RAW}/keyconcepts.json` },
  { name: 'Paragraph', url: `${BASE_RAW}/paragraph.json` },
];

export type ResourceEntry = {
  name: string;
  url: string;
  content: string;
  fetchError: string;
  parseError: string;
  expanded: boolean;
};

export const useResources = () => {
  const resources = ref<ResourceEntry[]>([]);
  const newUrl = ref('');
  const newName = ref('');

  const state = provideAnnotationDefinitions({ config });

  const rebuild = () => {
    const valid: AnnotationJsonResource[] = [];
    for (const r of resources.value) {
      try {
        valid.push(JSON.parse(r.content));
        r.parseError = '';
      } catch {
        r.parseError = 'Invalid JSON';
      }
    }
    state.loadFromConfigs(valid);
  };

  const fetchEntry = async (entry: ResourceEntry) => {
    entry.fetchError = '';
    try {
      const res = await fetch(entry.url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      entry.content = JSON.stringify(await res.json(), null, 2);
    } catch (e) {
      entry.fetchError = e instanceof Error ? e.message : String(e);
    }
    rebuild();
  };

  const add = async (url = newUrl.value, name = newName.value) => {
    if (!url) return;
    const entry: ResourceEntry = {
      name: name || url.split('/').pop()?.replace('.json', '') || 'Resource',
      url,
      content: '',
      fetchError: '',
      parseError: '',
      expanded: false,
    };
    resources.value.push(entry);
    newUrl.value = '';
    newName.value = '';
    await fetchEntry(entry);
  };

  const remove = (i: number) => {
    resources.value.splice(i, 1);
    rebuild();
  };

  const onEdit = () => rebuild();

  DEFAULT_URLS.forEach(({ name, url }) => add(url, name));

  rebuild();

  return {
    resources,
    newUrl,
    newName,
    definitions: computed(() => state.definitions),
    add,
    remove,
    onEdit,
  };
};
