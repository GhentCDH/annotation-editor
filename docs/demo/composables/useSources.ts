import { ref } from 'vue';
import { withBase } from 'vuepress/client';
import { type SourceModel } from '@ghentcdh/annotation-core';

export const useSources = () => {
  const url = ref(withBase('/demo/source.json'));
  const content = ref('');
  const sources = ref<SourceModel[]>([] as SourceModel[]);
  const fetchError = ref('');
  const parseError = ref('');
  const expanded = ref(false);

  const rebuild = () => {
    parseError.value = '';
    try {
      sources.value = JSON.parse(content.value);
    } catch {
      parseError.value = 'Invalid JSON';
    }
  };

  const load = async () => {
    fetchError.value = '';
    try {
      const res = await fetch(url.value);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      content.value = JSON.stringify(json, null, 2);
      sources.value = json;
      console.table(sources.value);
    } catch (e) {
      fetchError.value = e instanceof Error ? e.message : String(e);
    }
  };
  load();
  return {
    url,
    content,
    sources,
    fetchError,
    parseError,
    expanded,
    load,
    rebuild,
  };
};
