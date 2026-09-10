import { ref } from 'vue';
import { withBase } from 'vuepress/client';
import { type W3CAnnotation } from '@ghentcdh/w3c-utils';

export const useAnnotations = () => {
  const url = ref(withBase('/demo/annotations.json'));
  const content = ref('');
  const annotations = ref<W3CAnnotation[]>([] as W3CAnnotation[]);
  const fetchError = ref('');
  const parseError = ref('');
  const expanded = ref(false);

  const rebuild = () => {
    parseError.value = '';
    try {
      const json = JSON.parse(content.value);
      annotations.value = json.items ?? json;
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
      annotations.value = json.items ?? json;
    } catch (e) {
      fetchError.value = e instanceof Error ? e.message : String(e);
    }
  };

  load();

  return {
    url,
    content,
    annotations,
    fetchError,
    parseError,
    expanded,
    load,
    rebuild,
  };
};
