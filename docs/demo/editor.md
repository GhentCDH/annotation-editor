# Editor

<div class="relative block absolute w-full m-0">
 <AnnotationEditor
    :configuration="config"
    :sources="sourcesPlainTxt"
    :annotations="annotations"
    :layout="layout"
    :annotation-definitions="definitions"
  />
</div>




<script setup>
//
import {layout, sourcesPlainTxt, annotations, definitions, config} from '@demo/demo-text';
import { AnnotationEditor } from '@ghentcdh/annotation-editor';
import { provideHttpClient } from '@ghentcdh/crouton-forms-vue';

provideHttpClient(fetch);
</script>
