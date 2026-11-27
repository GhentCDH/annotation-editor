import { type PropType } from 'vue';

import { type EditorLoadError } from './editorError';

export const SmartEditorErrorProperties = {
  error: {
    type: Object as PropType<EditorLoadError>,
    required: true as const,
  },
};

export const SmartEditorErrorEmits = {
  retry: () => true,
};
